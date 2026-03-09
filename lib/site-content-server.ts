import { Prisma } from "@prisma/client";
import { deepMerge } from "@/lib/deep-merge";
import { prisma } from "@/lib/prisma";
import { defaultSiteContent, type SiteContent } from "@/lib/site-content-default";

const SITE_CONTENT_ID = "site-content";

export async function readSiteContent(): Promise<SiteContent> {
  const stored = await prisma.siteContent.findUnique({ where: { id: SITE_CONTENT_ID } });

  if (!stored) {
    const seeded = structuredClone(defaultSiteContent);
    await prisma.siteContent.create({
      data: {
        id: SITE_CONTENT_ID,
        content: seeded as Prisma.InputJsonValue,
      },
    });
    return seeded;
  }

  return deepMerge(defaultSiteContent, stored.content);
}

export async function writeSiteContent(payload: unknown): Promise<SiteContent> {
  const merged = deepMerge(defaultSiteContent, payload);
  await prisma.siteContent.upsert({
    where: { id: SITE_CONTENT_ID },
    create: {
      id: SITE_CONTENT_ID,
      content: merged as Prisma.InputJsonValue,
    },
    update: {
      content: merged as Prisma.InputJsonValue,
    },
  });
  return merged;
}
