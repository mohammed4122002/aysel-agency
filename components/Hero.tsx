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
    titleHighlight:"حضورا رقمياً",
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

      <div className="mt-6">
        <div className="relative inline-block">
         

          <h2 className="relative leading-[0.88] text-white">
            <span className="block text-[clamp(3rem,6.2vw,5.8rem)] font-extrabold">{heroContent.titleLine1}</span>
            <span className="relative mt-2 inline-block text-[clamp(3.2rem,6.6vw,6.2rem)] font-extrabold text-[#d4af37]">
              {heroContent.titleHighlight}
              <svg
                aria-hidden
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
                className="absolute -bottom-3 right-0 h-[16px] w-[102%]"
              >
                <path d="M0,7 C28,2 72,2 100,7" fill="none" stroke="#d4af37" strokeWidth="2.3" strokeLinecap="round" />
              </svg>
            </span>
            <span className="mt-3 block text-[clamp(3rem,6.2vw,5.8rem)] font-extrabold">{heroContent.titleLine3}</span>
          </h2>
        </div>
      </div>

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
