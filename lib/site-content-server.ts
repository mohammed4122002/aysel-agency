import { promises as fs } from "node:fs";
import path from "node:path";
import { deepMerge } from "@/lib/deep-merge";
import { defaultSiteContent, type SiteContent } from "@/lib/site-content-default";

const contentDir = path.join(process.cwd(), "data");
const contentFile = path.join(contentDir, "site-content.json");

async function ensureContentFile() {
  await fs.mkdir(contentDir, { recursive: true });

  try {
    await fs.access(contentFile);
  } catch {
    await fs.writeFile(contentFile, JSON.stringify(defaultSiteContent, null, 2), "utf8");
  }
}

export async function readSiteContent(): Promise<SiteContent> {
  await ensureContentFile();

  try {
    const raw = await fs.readFile(contentFile, "utf8");
    const parsed: unknown = JSON.parse(raw);
    return deepMerge(defaultSiteContent, parsed);
  } catch {
    return defaultSiteContent;
  }
}

export async function writeSiteContent(payload: unknown): Promise<SiteContent> {
  const merged = deepMerge(defaultSiteContent, payload);
  await ensureContentFile();
  await fs.writeFile(contentFile, JSON.stringify(merged, null, 2), "utf8");
  return merged;
}

export function getContentFilePath() {
  return contentFile;
}

