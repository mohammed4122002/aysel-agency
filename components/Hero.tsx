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
    titleHighlight: "حضوراً رقمـــــــياً",
    titleLine3: "لا ينسى",
    description:
      "ثلاث شركات متخصصة تحت سقف واحد - استراتيجية، إبداع، وتقنية. نحوّل رؤيتك إلى واقع رقمي يتفوق على المنافسة.",
    primaryCta: "ابدأ مشروعك الآن",
    secondaryCta: "شاهد أعمالنا",
  };

  return (
    <header className="w-full max-w-[734px] text-right">
      <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/50 bg-white/10 px-5 py-2 text-[14px] text-[#d4af37] backdrop-blur-sm">
        <span className="h-2 w-2 rounded-full bg-[#d4af37]" />
        <span>{heroContent.badge}</span>
      </div>

      <h1 className="mt-6 leading-[1.05] text-white">
        <span className="block text-[clamp(2.55rem,5.6vw,4.5rem)] font-extrabold">{heroContent.titleLine1}</span>
        <span className="mt-1 block text-[clamp(2.75rem,6vw,4.5rem)] font-extrabold text-[#d4af37]">
          {heroContent.titleHighlight}
        </span>
        <span className="mt-1 block text-[clamp(2.55rem,5.6vw,4.5rem)] font-extrabold">{heroContent.titleLine3}</span>
      </h1>

      <p className="mt-6 max-w-[734px] text-[18px] leading-[1.65] text-white/75">
        {heroContent.description}
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Button variant="primary" ariaLabel={heroContent.primaryCta} className="h-[52px] rounded-xl px-7 text-[16px] font-bold text-white">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d="M12 8H4.2M4.2 8l2.7-2.7M4.2 8l2.7 2.7"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {heroContent.primaryCta}
        </Button>

        <Button variant="secondary" ariaLabel={heroContent.secondaryCta} className="h-[52px] rounded-xl px-7 text-[16px]">
          {heroContent.secondaryCta}
        </Button>
      </div>

      <Stats />
    </header>
  );
}
