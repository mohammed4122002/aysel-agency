import { promises as fs } from "node:fs";
import path from "node:path";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

const allowedRoots = ["app", "components", "lib", "data"];

function isAllowedPath(relativePath: string) {
  if (!relativePath || relativePath.includes("\0")) return false;
  const normalized = relativePath.replace(/\\/g, "/");
  return allowedRoots.some((root) => normalized === root || normalized.startsWith(`${root}/`));
}

function resolveSafePath(relativePath: string) {
  if (!isAllowedPath(relativePath)) return null;
  const absolutePath = path.resolve(process.cwd(), relativePath);
  const normalizedAbsolute = absolutePath.toLowerCase();

  const valid = allowedRoots.some((root) => {
    const rootAbs = path.resolve(process.cwd(), root).toLowerCase();
    return normalizedAbsolute === rootAbs || normalizedAbsolute.startsWith(`${rootAbs}${path.sep}`);
  });

  return valid ? absolutePath : null;
}

const imageMimeToExtension: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
};

const maxUploadBytes = 8 * 1024 * 1024;
const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";

function safeBaseName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

async function walkFiles(directory: string): Promise<string[]> {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(absolute)));
      continue;
    }

    if (!entry.isFile()) continue;

    const extension = path.extname(entry.name).toLowerCase();
    if (![".ts", ".tsx", ".json", ".css", ".md"].includes(extension)) continue;
    files.push(path.relative(process.cwd(), absolute).replace(/\\/g, "/"));
  }

  return files;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedPath = searchParams.get("path");

  if (!requestedPath) {
    const allFiles: string[] = [];

    for (const root of allowedRoots) {
      const rootAbsolute = path.resolve(process.cwd(), root);
      try {
        const files = await walkFiles(rootAbsolute);
        allFiles.push(...files);
      } catch {
        // ignore missing root
      }
    }

    allFiles.sort((a, b) => a.localeCompare(b));
    return NextResponse.json({ files: allFiles });
  }

  const safePath = resolveSafePath(requestedPath);
  if (!safePath) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  try {
    const content = await fs.readFile(safePath, "utf8");
    return NextResponse.json({ path: requestedPath, content });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to read file";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as { path?: string; content?: string };
    const relativePath = body.path ?? "";
    const nextContent = typeof body.content === "string" ? body.content : "";
    const safePath = resolveSafePath(relativePath);

    if (!safePath) {
      return NextResponse.json({ ok: false, error: "Invalid path" }, { status: 400 });
    }

    await fs.writeFile(safePath, nextContent, "utf8");
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save file";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "No file uploaded" }, { status: 400 });
    }

    if (!(file.type in imageMimeToExtension)) {
      return NextResponse.json(
        { ok: false, error: "Unsupported file type. Allowed: jpg, png, webp, gif, svg" },
        { status: 400 },
      );
    }

    if (file.size <= 0 || file.size > maxUploadBytes) {
      return NextResponse.json(
        { ok: false, error: "Invalid file size. Maximum is 8MB." },
        { status: 400 },
      );
    }

    if (blobToken) {
      const originalName = file.name || "image";
      const parsed = path.parse(originalName);
      const preferredExt = imageMimeToExtension[file.type] ?? ".png";
      const ext = preferredExt || parsed.ext || ".png";
      const base = safeBaseName(parsed.name || "image") || "image";
      const fileName = `${base}${ext}`;
      const blob = await put(`admin/${fileName}`, file, { access: "public", addRandomSuffix: true });
      return NextResponse.json({
        ok: true,
        path: blob.url,
        name: blob.pathname,
        size: file.size,
        mimeType: file.type,
      });
    }

    if (isProd) {
      return NextResponse.json(
        {
          ok: false,
          error: "Storage is not configured. Set BLOB_READ_WRITE_TOKEN on Vercel.",
        },
        { status: 400 },
      );
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads", "admin");
    await fs.mkdir(uploadsDir, { recursive: true });

    const originalName = file.name || "image";
    const parsed = path.parse(originalName);
    const preferredExt = imageMimeToExtension[file.type] ?? ".png";
    const ext = preferredExt || parsed.ext || ".png";
    const base = safeBaseName(parsed.name || "image") || "image";
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).slice(2, 8);
    const fileName = `${base}-${timestamp}-${randomPart}${ext}`;
    const outputPath = path.join(uploadsDir, fileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(outputPath, buffer);

    return NextResponse.json({
      ok: true,
      path: `/uploads/admin/${fileName}`,
      name: fileName,
      size: file.size,
      mimeType: file.type,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
