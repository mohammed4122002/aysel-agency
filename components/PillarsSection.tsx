"use client";

import React from "react";

const servicesData = [
  {
    icon: "/figmaAssets/margin-wrap-15.svg",
    title: "تك",
    subtitle: "حلول رقمية تدعم أعمالك",
    features: [
      "تطوير المواقع المخصصة",
      "حلول تطبيقات الجوال",
      "لوحات التحكم والتحليلات",
      "تكامل الأنظمة",
    ],
    quote: "نبني حلولًا قوية وقابلة للتوسع تحول الأفكار إلى تجارب رقمية مميزة.",
  },
  {
    icon: "/figmaAssets/margin-wrap-26.svg",
    title: "ميديا",
    subtitle: "التميز الإبداعي الذي يجذب الانتباه",
    features: [
      "هوية العلامة التجارية",
      "إنشاء وإدارة المحتوى",
      "التسويق عبر وسائل التواصل",
      "الإعلانات المدفوعة",
    ],
    quote: "نصنع قصصًا تلامس القلوب، ونبني علامات تدوم، ونطلق حملات تحقق النتائج.",
  },
  {
    icon: "/figmaAssets/margin-wrap-27.svg",
    title: "ماركت",
    subtitle: "الأساس الاستراتيجي للنمو المستدام",
    features: [
      "أبحاث وتحليل السوق",
      "تطوير استراتيجية النمو",
      "تحسين قمع المبيعات",
      "تخطيط دخول السوق",
    ],
    quote: "نحلل ونخطط ونرسم خرائط طريق تحول الرؤية إلى نتائج قابلة للقياس.",
  },
];

export default function PillarsSection(): JSX.Element {
  return (
    <section className="w-full px-6 py-20">
      <div className="mx-auto max-w-screen-xl">
        <div className="flex flex-col items-center pb-20">
          <div className="flex w-full max-w-[1232px] flex-col items-center">
            <div className="flex w-full justify-center pb-4">
              <div className="inline-flex h-9 items-center rounded-full border-0 bg-[#0b12260f] px-4 py-2 text-xs font-semibold">
                <span className="text-center text-sm font-normal leading-5 text-[#0b1226] [direction:rtl]">
                  منظومة متكاملة
                </span>
              </div>
            </div>

            <div className="flex w-full justify-center pb-6">
              <h2 className="heading-2 text-center text-[#111726] [direction:rtl]">
                ثلاث ركائز، رؤية واحدة
              </h2>
            </div>

            <div className="flex w-full max-w-screen-md flex-col items-center">
              <p className="body-lg text-center text-[#4a5462] [direction:rtl]">
                بنينا نظامًا متكاملًا حيث تعمل الاستراتيجية والإبداع والتكنولوجيا معًا بسلاسة لتحقيق نتائج
                استثنائية.
              </p>
            </div>
          </div>
        </div>

        <div className="pb-16  " dir="ltr">
          <div className="mx-auto grid max-w-[1232px] grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {servicesData.map((service) => (
              <article
                key={service.title}
                className="flex flex-col items-end overflow-hidden rounded-3xl border border-solid border-[#f2f4f5] bg-white p-[41px] shadow-[0px_2px_20px_#0000001a]"
              >
                <div className="flex w-full flex-col items-end space-y-4 p-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="shrink-0" alt={service.title} src={service.icon} />

                  <div className="flex w-full justify-end">
                    <h3 className="heading-3 text-[#111726] [direction:rtl]">{service.title}</h3>
                  </div>

                  <div className="flex w-full justify-end pb-2">
                    <p className="body-base text-[#4a5462] [direction:rtl]">
                      {service.subtitle}
                    </p>
                  </div>

                  <div className="flex w-full flex-col items-end space-y-3 pb-4">
                    {service.features.map((feature) => (
                      <div key={feature} className="flex w-full items-center justify-end gap-3">
                        <span className="body-sm text-[#374050] [direction:rtl]">
                          {feature}
                        </span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img className="shrink-0" alt="Check" src="/figmaAssets/i-675.svg" />
                      </div>
                    ))}
                  </div>

                  <div className="flex w-full flex-col items-end border-t border-solid border-[#e4e7eb] pt-[25px]">
                    <p className="quote-text line-clamp-2 text-right text-[#6a7280] [direction:rtl]">
                      &ldquo;{service.quote}&rdquo;
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mx-auto flex max-w-[1232px] flex-col items-end rounded-3xl border border-solid border-[#0b1226a1] bg-[#0b122605] p-[49px] shadow">
          <div className="flex w-full flex-col items-center p-0">
            <div className="flex w-full max-w-screen-md flex-col items-end space-y-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="shrink-0" alt="Integration" src="/figmaAssets/margin-wrap-18.svg" />

              <div className="flex w-full justify-center pb-4">
                <h3 className="heading-3 text-center text-[#111726] [direction:rtl]">قوة التكامل</h3>
              </div>

              <div className="flex w-full flex-col items-center">
                <p className="body-base text-center text-[#374050] [direction:rtl]">
                  عندما تعمل الاستراتيجية والإبداع والتكنولوجيا معًا، يحدث السحر. نحن لا نقدم خدمات منفصلة بل
                  نخلق حلولًا متكاملة حيث تعزز كل ركيزة الأخرى، مما يؤدي إلى نمو هائل لأعمالك.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

