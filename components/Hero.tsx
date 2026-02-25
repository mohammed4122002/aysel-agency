"use client";

import React from "react";
import Button from "./Button";
import Stats from "./Stats";
import { useSiteContent } from "@/lib/site-content-client";

export default function Hero() {
  const siteContent = useSiteContent();
  const heroContent = siteContent.pages?.home?.hero ?? {
    badge: "وكالة رقمية متكاملة",
    titleLine1: "نصنع لك",
    titleHighlight: "حضوراً رقمياً",
    titleLine3: "لا يُنسى",
    description:
      "ثلاث شركات متخصصة تحت سقف واحد - استراتيجية، إبداع، وتقنية. نحوّل رؤيتك إلى واقع رقمي يتفوق على المنافسة.",
    primaryCta: "ابدأ مشروعك الآن",
    secondaryCta: "شاهد أعمالنا",
  };

  return (
    <div className="flex w-full flex-col items-start text-right">
      <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#d4a843]/35 bg-white/[0.03] px-5 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <span className="h-2 w-2 rounded-full bg-[#d4a843]" />
        <span className="text-sm font-medium text-[#e4c879]">{heroContent.badge}</span>
      </div>

      <h1 className="leading-[1.08] text-white">
        <span className="block text-[clamp(1.97rem,5vw,4.06rem)] font-extrabold">{heroContent.titleLine1}</span>
        <span className="hero-highlight mt-1 block text-[clamp(2.05rem,5.6vw,4.45rem)] font-extrabold text-[#d4a843]">
          {heroContent.titleHighlight}
        </span>
        <span className="mt-2 block text-[clamp(1.89rem,5vw,3.9rem)] font-extrabold">{heroContent.titleLine3}</span>
      </h1>

      <p className="mt-7 max-w-[640px] text-base leading-relaxed text-white/68 sm:text-xl">
        {heroContent.description}
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <Button variant="primary" ariaLabel={heroContent.primaryCta}>
          {heroContent.primaryCta}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M9.5 3.5L5 8l4.5 4.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>

        <Button variant="secondary" ariaLabel={heroContent.secondaryCta} className="px-8">
          {heroContent.secondaryCta}
        </Button>
      </div>

      <Stats />
    </div>
  );
}

