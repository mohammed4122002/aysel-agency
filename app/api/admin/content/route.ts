import { NextResponse } from "next/server";
import { readSiteContent, writeSiteContent } from "@/lib/site-content-server";

export async function GET() {
  const content = await readSiteContent();
  return NextResponse.json({ content });
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as { content?: unknown };
    const saved = await writeSiteContent(body.content ?? {});
    return NextResponse.json({ ok: true, content: saved });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save content";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

