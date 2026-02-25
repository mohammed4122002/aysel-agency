"use client";

import { useEffect, useState } from "react";
import { deepMerge } from "@/lib/deep-merge";
import { defaultSiteContent, type SiteContent } from "@/lib/site-content-default";

let cachedContent: SiteContent | null = null;
let pendingFetch: Promise<SiteContent> | null = null;

async function fetchSiteContent(): Promise<SiteContent> {
  if (cachedContent) {
    return cachedContent;
  }

  if (!pendingFetch) {
    pendingFetch = fetch("/api/admin/content", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch content");
        }

        const data = (await response.json()) as { content?: unknown };
        const merged = deepMerge(defaultSiteContent, data.content);
        cachedContent = merged;
        return merged;
      })
      .catch(() => defaultSiteContent)
      .finally(() => {
        pendingFetch = null;
      });
  }

  return pendingFetch;
}

export function clearContentCache() {
  cachedContent = null;
}

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>(cachedContent ?? defaultSiteContent);

  useEffect(() => {
    let isMounted = true;

    fetchSiteContent().then((nextContent) => {
      if (!isMounted) return;
      setContent(nextContent);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return content;
}

