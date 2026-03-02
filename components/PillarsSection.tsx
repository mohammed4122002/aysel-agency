"use client";

import React from "react";

interface Pillar {
  key: "market" | "media" | "tech";
  title: string;
  subtitle: string;
  points: string[];
  quote: string;
}

const pillars: Pillar[] = [
  {
    key: "market",
    title: "ماركت",
    subtitle: "الأساس الاستراتيجي للنمو المستدام",
    points: [
      "أبحاث وتحليل السوق",
      "تطوير استراتيجية النمو",
      "تحسين قمع المبيعات",
      "تخطيط دخول السوق",
    ],
    quote:
      "نحلل ونخطط ونرسم خرائط طريق تحول الرؤية إلى نتائج قابلة للقياس.",
  },
  {
    key: "media",
    title: "ميديا",
    subtitle: "التميز الإبداعي الذي يجذب الانتباه",
    points: [
      "هوية العلامة التجارية",
      "إنشاء وإدارة المحتوى",
      "التسويق عبر وسائل التواصل",
      "الإعلانات المدفوعة",
    ],
    quote:
      "نصنع قصصاً تلامس القلوب، ونبني علامات تدوم، ونطلق حملات تحقق النتائج.",
  },
  {
    key: "tech",
    title: "تك",
    subtitle: "حلول رقمية تدعم أعمالك",
    points: [
      "تطوير المواقع المخصصة",
      "حلول وتطبيقات الجوال",
      "لوحات التحكم والتحليلات",
      "تكامل الأنظمة",
    ],
    quote:
      "نبني حلولاً قوية وقابلة للتوسع تحول الأفكار إلى تجارب رقمية مميزة.",
  },
];

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="m3.4 8.2 3 3.1 6-6.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MarketIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect x="4.2" y="4.2" width="11.6" height="11.6" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="m6.9 12 2.2-2.3 1.9 1.9 2.2-2.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MediaIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M5.3 8.2 12.7 5v10l-7.4-3.3V8.2Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path
        d="M12.7 7.7c1.5.3 2.5 1.5 2.5 2.9s-1 2.6-2.5 2.9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path d="M4.8 11.9V14c0 .6.5 1.1 1.1 1.1h1.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function TechIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="m7.2 6.1-3 3.9 3 3.9M12.8 6.1l3 3.9-3 3.9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="m11 4.7-2.2 10.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8 2.8A2.5 2.5 0 0 0 5.5 5.3v.9c0 .7-.2 1.4-.6 2L4.2 9.3h7.6l-.7-1.1a3.4 3.4 0 0 1-.6-2v-.9A2.5 2.5 0 0 0 8 2.8Z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path d="M6.9 10.8a1.2 1.2 0 0 0 2.2 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

const iconMap = {
  market: <MarketIcon  />,
  media: <MediaIcon />,
  tech: <TechIcon />,
};

function TinyIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#0c1633] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
      {children}
    </span>
  );
}

export default function PillarsSection() {
  return (
    <section className="pillars-section relative z-20 py-20 sm:py-24">
      <div className="mx-auto w-full max-w-[1220px] px-4 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[720px] text-center">
          <div className="mx-auto inline-flex rounded-full bg-[#e4e6eb] px-4 py-1.5 text-xs font-semibold text-[#667085]">
            منظومة متكاملة
          </div>

          <h2 className="mt-5 text-[clamp(1.64rem,3.5vw,2.79rem)] font-extrabold leading-[1.1] text-[#111827]">
            ثلاث ركائز، رؤية واحدة
          </h2>

          <p className="mx-auto mt-4 max-w-[660px] text-[1.01rem] leading-relaxed text-[#6b7280]">
            بنينا نظاماً متكاملاً حيث تعمل الاستراتيجية والإبداع والتكنولوجيا معاً
            بسلاسة لتحقيق نتائج استثنائية.
          </p>
        </div>

        <div className="mt-16 grid gap-5 lg:grid-cols-3">
          {pillars.map((pillar) => (
            <article key={pillar.key} className="pillar-card px-6 pb-6 pt-7">
              <div className=" mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0c1633] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                {iconMap[pillar.key]}
              </div>

              <h3 className="text-[1.72rem] font-extrabold leading-none text-[#111827]">{pillar.title}</h3>
              <p className="mt-3 text-[0.95rem] text-[#6b7280]">{pillar.subtitle}</p>

              <ul className="mt-4 space-y-2.5 text-[0.93rem] text-[#374151]">
                {pillar.points.map((point) => (
                  <li key={point} className="flex items-start justify-start gap-2">
                    <CheckIcon />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 border-t border-[#e5e7eb] pt-4">
                <p className="text-sm leading-relaxed text-[#9ca3af]">&ldquo;{pillar.quote}&rdquo;</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-[20px] border border-[#b7bfcc] bg-[#f4f5f8] px-6 py-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] sm:px-8">
          <div className="mb-4 inline-flex items-center flex-row-reverse gap-3 text-[#334155]">
            <TinyIcon>
              <BellIcon />
            </TinyIcon>

            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path
                d="M14 9H4.5m0 0L7.6 5.8M4.5 9l3.1 3.2"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <TinyIcon>
              <TechIcon />
            </TinyIcon>
            <span className="text-xl">+</span>
            <TinyIcon>
              <MediaIcon />
            </TinyIcon>
            <span className="text-xl">+</span>
            <TinyIcon>
              <MarketIcon />
            </TinyIcon>
          </div>

          <h3 className="text-[1.72rem] font-extrabold text-[#111827]">قوة التكامل</h3>
          <p className="mx-auto mt-3 max-w-[860px] text-[0.98rem] leading-relaxed text-[#4b5563]">
            عندما تعمل الاستراتيجية والإبداع والتكنولوجيا معًا، يحدث السحر. نحن لا
            نقدم خدمات منفصلة، بل نخلق حلولًا متكاملة حيث يعزز كل ركيزة الأخرى،
            مما يؤدي إلى نمو فعال لأعمالك.
          </p>
        </div>
      </div>
    </section>
  );
}
