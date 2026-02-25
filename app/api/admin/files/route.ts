import { promises as fs } from "node:fs";
import path from "node:path";
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

