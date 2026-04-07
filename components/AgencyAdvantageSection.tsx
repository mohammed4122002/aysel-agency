"use client";

import React from "react";

interface Advantage {
  title: string;
  description: string;
  icon: React.ReactNode;
}

function IconTeam() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M10 10.1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M4.8 15.1c0-2.2 2.2-3.8 5.2-3.8s5.2 1.6 5.2 3.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path d="M5.8 9.7a2 2 0 1 0 0-4m8.4 4a2 2 0 1 1 0-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconData() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="5.8" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="m7.3 10.7 1.7 1.7 3.2-3.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconTrack() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M6.7 15.7h6.6l.7-4.9L10 3.9l-4 6.9.7 4.9Z" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="10" cy="10.2" r="1.2" fill="currentColor" />
    </svg>
  );
}

function IconSupport() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M5.8 8.8a4.2 4.2 0 1 1 8.4 0v1.8a2 2 0 0 1-2 2h-.9l-2.6 2v-2H7.8a2 2 0 0 1-2-2V8.8Z" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function IconIdea() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M10 4.3a4 4 0 0 0-2.7 6.9c.6.6 1 1.3 1.1 2h3.2c.1-.7.5-1.4 1.1-2A4 4 0 0 0 10 4.3Z" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8.5 14.2h3M8.7 16h2.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M10 3.9 5.8 5.5V10c0 3 1.8 4.8 4.2 6.1 2.4-1.3 4.2-3.1 4.2-6.1V5.5L10 3.9Z" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="m8.3 9.8 1.4 1.5 2.2-2.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const items: Advantage[] = [
  {
    title: "فريق واحد، حل متكامل",
    description:
      "لا مزيد من التعامل مع وكالات متعددة. احصل على الاستراتيجية والإبداع والتكنولوجيا من فريق واحد متماسك.",
    icon: <IconTeam />,
  },
  {
    title: "قرارات مبنية على البيانات",
    description:
      "كل استراتيجية وحملة مدعومة ببيانات وتحليلات حقيقية. نحن لا نخمن - بل نقيس ونحلل ونحسن.",
    icon: <IconData />,
  },
  {
    title: "سجل حافل بالنجاح",
    description:
      "مع أكثر من 500 مشروع ناجح و200+ عميل راضٍ، أثبتنا قدرتنا على تحقيق النتائج.",
    icon: <IconTrack />,
  },
  {
    title: "دعم مخصص",
    description:
      "أنت لست مجرد رقم في مشروع. احصل على مدير حساب مخصص ووصول مباشر لفريق خبرائنا.",
    icon: <IconSupport />,
  },
  {
    title: "الابتكار أولاً",
    description:
      "نبقى في طليعة الاتجاهات والتقنيات، لضمان حصول عملك على أحدث الأدوات والاستراتيجيات.",
    icon: <IconIdea />,
  },
  {
    title: "جودة مضمونة",
    description:
      "نقف وراء عملنا بمعدل نجاح 98%، ورقابة الجودة الصارمة تضمن أعلى المعايير.",
    icon: <IconShield />,
  },
];

export default function AgencyAdvantageSection() {
  return (
    <section className="agency-adv-section py-20 sm:py-24">
      <div className="mx-auto w-full max-w-[1220px] px-4 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[800px] text-center">
          <div className="text-label mx-auto inline-flex rounded-full bg-[#e2e5ea] px-4 py-1.5 font-semibold text-[#5f6775]">
            لماذا نحن
          </div>

          <h2 className="heading-2 mt-5 text-[#121a2b]">
            ميزة الوكالة
          </h2>

          <p className="body-lg mx-auto mt-4 max-w-[820px] text-[#4b5565]">
            لسنا مجرد مزود خدمات. نحن شريكك الاستراتيجي الملتزم بنجاحك على المدى
            الطويل.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.title}
              className="adv-card relative min-h-[190px] rounded-[18px] px-7 pb-6 pt-7 text-center"
            >
              <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0d1633] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                {item.icon}
              </div>

              <h3 className="heading-3 text-[#121a2b]">{item.title}</h3>
              <p className="body-sm mt-3 text-[#5f6877]">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

