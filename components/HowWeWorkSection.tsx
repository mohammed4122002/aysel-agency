"use client";

import React from "react";

interface WorkStep {
  number: string;
  title: string;
  description: string;
  bullets: string[];
  icon: React.ReactNode;
}

function IconSearch() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="9" cy="9" r="5.2" stroke="currentColor" strokeWidth="1.7" />
      <path d="m13 13 3.5 3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function IconBulb() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M10 4.4a4 4 0 0 0-2.8 6.9c.7.6 1 1.2 1.1 1.9h3.4c.1-.7.4-1.3 1.1-1.9A4 4 0 0 0 10 4.4Z" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8.6 14.4h2.8M8.8 16h2.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconPalette() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M10 4.2a5.8 5.8 0 1 0 0 11.6h.8a1.5 1.5 0 0 0 1.4-2.1 1.4 1.4 0 0 1 1.4-2h.4A3.9 3.9 0 0 0 14 4.2H10Z" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="7.5" cy="8.3" r="1" fill="currentColor" />
      <circle cx="10.2" cy="7.2" r="1" fill="currentColor" />
      <circle cx="12.5" cy="8.9" r="1" fill="currentColor" />
    </svg>
  );
}

function IconRocket() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M6.7 15.3h6.6l.6-4.2L10 4l-3.9 7 .6 4.3Z" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="10" cy="10.2" r="1.2" fill="currentColor" />
    </svg>
  );
}

const steps: WorkStep[] = [
  {
    number: "01",
    title: "الاكتشاف والتحليل",
    description:
      "نبدأ بفهم عملك وأهدافك وتحدياتك وسوقك. البحث والتحليل العميق يشكلان أساس كل ما نقوم به.",
    bullets: [
      "تدقيق الأعمال وتحليل المنافسين",
      "تحديد الجمهور المستهدف",
      "تحديد الأهداف ومؤشرات الأداء",
    ],
    icon: <IconSearch />,
  },
  {
    number: "02",
    title: "تطوير الاستراتيجية",
    description:
      "بناءً على الرؤى، نضع استراتيجية شاملة تنسق بين موقع السوق والحضور الإعلامي والبنية التقنية.",
    bullets: ["إنشاء خارطة طريق مخصصة", "تخطيط القنوات والموارد", "تحديد الجدول الزمني والمراحل"],
    icon: <IconBulb />,
  },
  {
    number: "03",
    title: "التنفيذ الإبداعي",
    description:
      "فرقنا الإبداعية والتقنية تعمل بالتوازي لتحويل الاستراتيجية إلى واقع بمحتوى جذاب وحلول قوية.",
    bullets: ["تطوير العلامة التجارية والمحتوى", "التطوير التقني والاختبار", "ضمان الجودة"],
    icon: <IconPalette />,
  },
  {
    number: "04",
    title: "الإطلاق والتحسين",
    description:
      "ننسق إطلاقاً سلساً عبر جميع القنوات، ونراقب ونحسن الأداء باستمرار لتعظيم النتائج.",
    bullets: ["إطلاق منسق متعدد القنوات", "مراقبة الأداء والتحليل", "التحسين المستمر والتوسع"],
    icon: <IconRocket />,
  },
];

export default function HowWeWorkSection() {
  return (
    <section className="how-we-work-section py-20 sm:py-24">
      <div className="mx-auto w-full max-w-[1220px] px-4 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[840px] text-center">
          <div className="text-label mx-auto inline-flex rounded-full bg-[#e2e5ea] px-4 py-1.5 font-semibold text-[#5f6775]">
            منهجيتنا
          </div>

          <h2 className="heading-2 mt-5 text-[#121a2b]">
            كيف نعمل
          </h2>

          <p className="body-lg mx-auto mt-4 max-w-[840px] text-[#4b5565]">
            منهجية مثبتة تجمع بين التفكير الاستراتيجي والتنفيذ الإبداعي والتميز
            التقني.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-4">
          {steps.map((step, idx) => {
            const withConnector = idx !== steps.length - 1;
            return (
              <article
                key={step.number}
                className={`workflow-card relative rounded-[18px] px-6 pb-6 pt-5 text-right ${
                  withConnector
                    ? "lg:after:absolute lg:after:-left-5 lg:after:top-11 lg:after:h-px lg:after:w-4 lg:after:bg-[#8f98a8] lg:after:content-['']"
                    : ""
                }`}
              >
                <div className="mb-5 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0d1633] text-white">
                    {step.icon}
                  </div>

                  <span className="text-[2.62rem] font-extrabold leading-none tracking-[0.01em] text-[#c9ced7]">
                    {step.number}
                  </span>
                </div>

                <h3 className="heading-3 text-[#121a2b]">{step.title}</h3>
                <p className="body-sm mt-3 text-[#5f6877]">{step.description}</p>

                <ul className="body-xs mt-5 space-y-2 text-[#3c4555]">
                  {step.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-center justify-start gap-2">
                      <span className="text-[0.82rem]">✓</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        <div className="workflow-cta mt-12 rounded-[22px] px-6 py-10 text-center sm:px-8">
          <h3 className="heading-3 text-[#121a2b]">مستعد للبدء؟</h3>
          <p className="body-base mt-3 text-[#556070]">
            دعنا نناقش مشروعك ونضع خطة مخصصة تناسب أهدافك وميزانيتك.
          </p>
          <button
            type="button"
            className="mt-6 rounded-xl bg-[#0b1530] px-10 py-3 text-base font-semibold text-white shadow-[0_10px_24px_rgba(11,21,48,0.24)]"
          >
            احجز استشارة مجانية
          </button>
        </div>
      </div>
    </section>
  );
}

