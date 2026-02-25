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
      <path d="M4 14.6V5.4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v9.2" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="m7.2 12.2 2.2-2.3 1.9 1.9 2.6-3"
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
      <path d="M5.5 8.3 12.8 5v10L5.5 11.7V8.3Z" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12.8 7.7c1.5.3 2.5 1.5 2.5 2.9 0 1.5-1 2.7-2.5 3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path d="M5 12v2.1c0 .6.5 1.1 1.1 1.1h1.3" stroke="currentColor" strokeWidth="1.6" />
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
    <li className="flex items-center justify-start gap-2 text-[0.91rem] text-white/72">
      <span className="text-[#d4a843]">&#8249;</span>
      <span>{text}</span>
    </li>
  );
}

export default function BusinessNeedsSection() {
  return (
    <section className="business-needs-section relative py-20 sm:py-24">
      <div className="mx-auto w-full max-w-[1220px] px-4 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[760px] text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#d4a843]/30 bg-[#d4a843]/10 px-4 py-1.5 text-xs font-semibold text-[#d4a843]">
            <span className="text-[0.7rem]">&#9679;</span>
            <span>اختر مسارك</span>
          </div>

          <h2 className="mt-6 text-[clamp(1.8rem,4vw,3.12rem)] font-extrabold leading-[1.08] text-white">
            ماذا يحتاج عملك؟
          </h2>

          <p className="mx-auto mt-4 max-w-[760px] text-[1rem] leading-relaxed text-white/65">
            اختر المجال الذي يناسب أهدافك الحالية. كل قسم مصمم لحل تحديات محددة
            وتحقيق نتائج قابلة للقياس.
          </p>
        </div>

        <div className="mt-14 flex flex-col gap-5 lg:flex-row">
          {cards.map((card) => (
            <article key={card.key} className="needs-card flex-1 rounded-[18px] px-6 pb-6 pt-5 text-right">
              <div className="mb-6 flex justify-end">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#d4b038] text-[#101828] shadow-[0_10px_24px_rgba(212,168,67,0.25)]">
                  {iconByKey[card.key]}
                </span>
              </div>

              <h3 className="text-[1.72rem] font-extrabold leading-none text-white">{card.title}</h3>
              <p className="mt-4 text-[0.93rem] leading-relaxed text-white/63">{card.description}</p>

              <ul className="mt-5 space-y-2.5">
                {card.bullets.map((item) => (
                  <ChevronItem key={item} text={item} />
                ))}
              </ul>

              <button
                type="button"
                className="mt-6 inline-flex items-center gap-2 text-base font-semibold text-[#d4a843] hover:text-[#e4c369]"
              >
                <span>{card.cta}</span>
                <span>&#8592;</span>
              </button>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-white/58">لست متأكداً أي قسم تحتاج؟</p>
          <button
            type="button"
            className="mt-4 rounded-xl bg-white px-8 py-3 text-[0.93rem] font-bold text-[#111827] shadow-[0_10px_24px_rgba(0,0,0,0.25)]"
          >
            احصل على استشارة مجانية
          </button>
        </div>
      </div>
    </section>
  );
}

