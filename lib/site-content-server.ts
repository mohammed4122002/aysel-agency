import { promises as fs } from "node:fs";
import path from "node:path";
import { Redis } from "@upstash/redis";
import { deepMerge } from "@/lib/deep-merge";
import { defaultSiteContent, type SiteContent } from "@/lib/site-content-default";

const contentDir = path.join(process.cwd(), "data");
const contentFile = path.join(contentDir, "site-content.json");
const redisKey = "site-content";
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

async function ensureContentFile() {
  await fs.mkdir(contentDir, { recursive: true });

  try {
    await fs.access(contentFile);
  } catch {
    await fs.writeFile(contentFile, JSON.stringify(defaultSiteContent, null, 2), "utf8");
  }
}

export async function readSiteContent(): Promise<SiteContent> {
  if (redis) {
    try {
      const stored = await redis.get<SiteContent>(redisKey);
      return deepMerge(defaultSiteContent, stored ?? {});
    } catch {
      return defaultSiteContent;
    }
  }

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
  if (redis) {
    await redis.set(redisKey, merged);
    return merged;
  }

  await ensureContentFile();
  await fs.writeFile(contentFile, JSON.stringify(merged, null, 2), "utf8");
  return merged;
}

export function getContentFilePath() {
  return contentFile;
}
