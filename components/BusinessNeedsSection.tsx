"use client";

import React from "react";

interface NeedCard {
  key: "market" | "media" | "tech";
  title: string;
  description: string;
  bullets: string[];
  cta: string;
}

const cards: NeedCard[] = [
  {
    key: "market",
    title: "ماركت",
    description:
      "تحتاج استراتيجية واضحة؟ تريد فهم سوقك بشكل أعمق؟ تبحث عن تحسين عملية المبيعات؟",
    bullets: ["التخطيط الاستراتيجي", "تحليل السوق والمنافسين", "تحسين النمو والمبيعات"],
    cta: "استكشف ماركت",
  },
  {
    key: "media",
    title: "ميديا",
    description:
      "تريد بناء علامتك التجارية؟ تحتاج محتوى جذاب؟ تبحث عن الوصول لعملاء أكثر؟",
    bullets: ["تطوير العلامة التجارية", "إنشاء المحتوى الإبداعي", "التسويق الرقمي والإعلانات"],
    cta: "استكشف ميديا",
  },
  {
    key: "tech",
    title: "تك",
    description:
      "تحتاج موقع أو تطبيق؟ تريد أتمتة العمليات؟ تبحث عن حلول مخصصة؟",
    bullets: ["تطوير المواقع الإلكترونية", "تطبيقات الجوال", "الحلول والأنظمة المخصصة"],
    cta: "استكشف تك",
  },
];

function IconMarket() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M4.5 4.5v11h11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path
        d="m7.1 12 2.3-2.3 1.9 1.9 2.4-2.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconMedia() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M5.5 8.3 12.8 5v10L5.5 11.7V8.3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path
        d="M12.8 7.7c1.5.3 2.5 1.5 2.5 2.9s-1 2.6-2.5 2.9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path d="M5 11.8V14c0 .6.5 1.1 1.1 1.1h1.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconTech() {
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

const iconByKey = {
  market: <IconMarket />,
  media: <IconMedia />,
  tech: <IconTech />,
};

function ChevronItem({ text }: { text: string }) {
  return (
    <li className="flex items-center justify-between gap-3 text-[14px] text-white/75">
      <span className="text-white/85">{text}</span>
      <span className="text-[#d4a843] text-[13px]">&#8249;</span>
    </li>
  );
}

export default function BusinessNeedsSection() {
  return (
    <section className="business-needs-section relative py-20 sm:py-24">
      <div className="mx-auto w-full max-w-[1120px] px-4 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[680px] text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#d4a843]/30 bg-[#d4a843]/10 px-4 py-1.5 text-[11px] font-semibold text-[#d4a843]">
            <span className="text-[8px]">&#9679;</span>
            <span>اختر مسارك</span>
          </div>

          <h2 className="mt-6 text-[28px] font-extrabold leading-[1.2] text-white sm:text-[32px] lg:text-[36px]">
            ماذا يحتاج عملك؟
          </h2>

          <p className="mx-auto mt-4 max-w-[640px] text-[14px] leading-relaxed text-white/70">
            اختر المجال الذي يناسب أهدافك الحالية. كل قسم مصمم لحل تحديات محددة
            وتحقيق نتائج قابلة للقياس.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:gap-6 lg:grid-cols-3">
          {cards.map((card) => (
            <article key={card.key} className="needs-card flex-1 rounded-[18px] px-7 pb-7 pt-6 text-right">
              <div className="mb-6 flex justify-end">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#d4b038] text-[#101828] shadow-[0_10px_24px_rgba(212,168,67,0.25)]">
                  {iconByKey[card.key]}
                </span>
              </div>

              <h3 className="text-[22px] font-extrabold leading-none text-white">{card.title}</h3>
              <p className="mt-4 text-[14px] leading-relaxed text-white/70">{card.description}</p>

              <ul className="mt-5 space-y-2.5">
                {card.bullets.map((item) => (
                  <ChevronItem key={item} text={item} />
                ))}
              </ul>

              <button
                type="button"
                className="mt-7 inline-flex items-center gap-2 text-[14px] font-semibold text-[#d4a843] hover:text-[#e4c369]"
              >
                <span>{card.cta}</span>
                <span>&#8592;</span>
              </button>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-[14px] text-white/60">لست متأكداً أي قسم تحتاج؟</p>
          <button
            type="button"
            className="mt-4 rounded-full bg-white px-8 py-3 text-[14px] font-bold text-[#111827] shadow-[0_10px_24px_rgba(0,0,0,0.25)]"
          >
            احصل على استشارة مجانية
          </button>
        </div>
      </div>
    </section>
  );
}
