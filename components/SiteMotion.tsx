"use client";

import type { ReactNode } from "react";
import { useEffect, useLayoutEffect } from "react";
import { useAnimate, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

const CONTENT_REVEAL_SELECTOR = [
  "main article",
  ".service-card",
  ".needs-card",
  ".pillar-card",
  ".adv-card",
  ".workflow-card",
  ".portfolio-card",
  ".portfolio-filter",
  ".workflow-cta",
  ".market-who-card",
  ".market-service-card",
  ".market-story-card",
  ".market-stat-card",
  ".market-faq-item",
  ".media-card",
  ".media-card-soft",
  ".media-service-tile",
  ".media-service-mini",
  ".media-project-card",
  ".swiper-slide",
].join(", ");

const PAGE_REVEAL_SELECTOR = [
  "main > section",
  "footer",
  CONTENT_REVEAL_SELECTOR,
].join(", ");

function uniqueElements(elements: HTMLElement[]): HTMLElement[] {
  return Array.from(new Set(elements));
}

function isMotionTarget(element: HTMLElement) {
  if (element.dataset.motion === "skip") return false;

  const rect = element.getBoundingClientRect();
  return rect.width >= 56 && rect.height >= 28;
}

interface SiteMotionProps {
  children: ReactNode;
}

export default function SiteMotion({ children }: SiteMotionProps) {
  const pathname = usePathname();
  const [scope, animate] = useAnimate();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    document.body.classList.add("motion-ready");

    return () => {
      document.body.classList.remove("motion-ready");
    };
  }, []);

  useLayoutEffect(() => {
    const root = scope.current as HTMLElement | null;
    if (!root) return;
    const disablePageReveal =
      pathname.startsWith("/tech") || pathname.startsWith("/media") || pathname.startsWith("/admin");
    const revealSelector = disablePageReveal ? CONTENT_REVEAL_SELECTOR : PAGE_REVEAL_SELECTOR;

    const allTargets = uniqueElements(
      Array.from(root.querySelectorAll(revealSelector))
        .map((element) => element as HTMLElement)
        .filter(isMotionTarget)
    );

    if (allTargets.length === 0) return;

    if (prefersReducedMotion) {
      allTargets.forEach((target) => {
        target.style.removeProperty("opacity");
        target.style.removeProperty("transform");
        target.style.removeProperty("filter");
        target.style.removeProperty("will-change");
      });
      return;
    }

    allTargets.forEach((target) => {
      target.style.willChange = "opacity, transform, filter";
    });

    void animate(
      allTargets,
      {
        opacity: 0,
        y: 22,
        scale: 0.992,
        filter: "blur(2px)",
      },
      {
        duration: 0,
      }
    );

    const revealed = new WeakSet<HTMLElement>();
    const revealElement = (element: HTMLElement, delay = 0) => {
      if (revealed.has(element)) return;
      revealed.add(element);

      void animate(
        element,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
        },
        {
          duration: 0.6,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }
      ).then(() => {
        element.style.removeProperty("will-change");
      });
    };

    let observer: IntersectionObserver | null = null;
    const viewportHeight = window.innerHeight;
    const immediateTargets: HTMLElement[] = [];
    const deferredTargets: HTMLElement[] = [];

    allTargets.forEach((target) => {
      const rect = target.getBoundingClientRect();
      const isImmediate = rect.top <= viewportHeight * 0.9 && rect.bottom >= viewportHeight * 0.04;

      if (isImmediate) {
        immediateTargets.push(target);
      } else {
        deferredTargets.push(target);
      }
    });

    immediateTargets
      .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)
      .forEach((target, index) => {
        revealElement(target, index * 0.04);
      });

    if ("IntersectionObserver" in window && deferredTargets.length > 0) {
      observer = new IntersectionObserver(
        (entries, io) => {
          const visibleEntries = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

          visibleEntries.forEach((entry, index) => {
            revealElement(entry.target as HTMLElement, index * 0.032);
            io.unobserve(entry.target);
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -6% 0px",
        }
      );

      deferredTargets.forEach((target) => observer?.observe(target));
    }

    return () => {
      observer?.disconnect();
      allTargets.forEach((target) => {
        target.style.removeProperty("will-change");
      });
    };
  }, [animate, pathname, prefersReducedMotion, scope]);

  return (
    <div key={pathname} ref={scope} className="site-motion-root">
      {children}
    </div>
  );
}
