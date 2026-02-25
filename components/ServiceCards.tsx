"use client";

import Image from "next/image";
import React, { useState } from "react";

interface ServiceCard {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
}

const MarketIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
    <rect x="2" y="11.5" width="2.6" height="6.5" rx="0.8" fill="#CED6E4" opacity="0.65" />
    <rect x="6.3" y="8.5" width="2.6" height="9.5" rx="0.8" fill="#CED6E4" opacity="0.75" />
    <rect x="10.6" y="5.3" width="2.6" height="12.7" rx="0.8" fill="#CED6E4" />
    <rect x="14.9" y="2.4" width="2.6" height="15.6" rx="0.8" fill="#CED6E4" opacity="0.5" />
  </svg>
);

const MediaIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
    <rect x="2.5" y="2.5" width="15" height="15" rx="3" stroke="#1B1C22" strokeWidth="1.6" />
    <rect x="6" y="6" width="8" height="8" rx="1.4" fill="#1B1C22" opacity="0.35" />
    <path d="M10 6.5v7M6.5 10h7" stroke="#1B1C22" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const TechIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
    <rect x="2.5" y="3" width="15" height="10.5" rx="2" stroke="#CED6E4" strokeWidth="1.6" />
    <path d="M8 17h4M10 13.5V17" stroke="#CED6E4" strokeWidth="1.6" strokeLinecap="round" />
    <path
      d="m8.1 8.3 1.9 1.8 2.3-2.6"
      stroke="#CED6E4"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const services: ServiceCard[] = [
  {
    id: 1,
    title: "ماركت",
    subtitle: "استراتيجية ونمو",
    description: "تحليل السوق وتخطيط النمو وتحسين مسار المبيعات بقرارات مدعومة بالبيانات.",
    icon: <MarketIcon />,
  },
  {
    id: 2,
    title: "ميديا",
    subtitle: "إبداع وهوية",
    description: "بناء علامة تجارية قوية ومحتوى إبداعي مؤثر يجذب الانتباه ويقود النتائج.",
    icon: <MediaIcon />,
  },
  {
    id: 3,
    title: "تك",
    subtitle: "حلول رقمية",
    description: "تطوير مواقع وتطبيقات وحلول تقنية مخصصة تدعم أهدافك التشغيلية والتجارية.",
    icon: <TechIcon />,
  },
];

const avatars = [
  "/media-assets/avatar-1.png",
  "/media-assets/avatar-4.png",
  "/media-assets/avatar-6.png",
  "/media-assets/avatar-3.png",
];

export default function ServiceCards() {
  const [activeId, setActiveId] = useState(2);

  return (
    <section className="relative w-full max-w-[530px]" aria-label="خدماتنا">
      <div className="flex flex-col gap-3.5">
        {services.map((service) => {
          const isActive = service.id === activeId;

          return (
            <button
              key={service.id}
              type="button"
              onClick={() => setActiveId(service.id)}
              className={`service-card group relative w-full rounded-[18px] border px-4 py-4 text-right transition-all duration-300 sm:px-5 ${
                isActive
                  ? "service-card-active border-[#d4a843]/70"
                  : "border-white/10 hover:border-white/20"
              }`}
              aria-pressed={isActive}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                    isActive ? "border-[#d9b44a] bg-[#d4a843]" : "border-white/10 bg-white/[0.04]"
                  }`}
                >
                  {service.icon}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3
                      className={`text-[1.35rem] font-bold leading-none ${
                        isActive ? "text-white" : "text-white/90"
                      }`}
                    >
                      {service.title}
                    </h3>
                    <p className="text-sm text-white/52">{service.subtitle}</p>
                  </div>

                  <p
                    className={`overflow-hidden text-sm text-white/66 transition-all duration-300 ${
                      isActive ? "mt-3 max-h-12 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    {service.description}
                  </p>

                  {isActive && (
                    <div className="mt-3 h-[2px] rounded-full bg-[linear-gradient(90deg,transparent,rgba(212,168,67,0.95),transparent)]" />
                  )}
                </div>

                <span
                  className={`mt-2 inline-flex shrink-0 text-sm ${
                    isActive ? "text-[#d4a843]" : "text-white/30"
                  }`}
                  aria-hidden
                >
                  &#8249;
                </span>
              </div>
            </button>
          );
        })}

        <div className="service-card rounded-[18px] border border-white/10 px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex gap-0.5 text-[#d4a843]" aria-label="تقييم خمس نجوم">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 1.2 10.1 5.6 15 6.3l-3.5 3.4.8 4.8L8 12.2l-4.3 2.3.8-4.8L1 6.3l4.9-.7L8 1.2Z" />
                  </svg>
                ))}
              </div>

              <div className="flex -space-x-2 rtl:space-x-reverse">
                {avatars.map((avatar) => (
                  <div key={avatar} className="relative h-8 w-8 overflow-hidden rounded-full border border-white/35">
                    <Image src={avatar} alt="عميل" fill className="object-cover" sizes="32px" />
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-white/55 sm:text-sm">انضم إلى +200 عميل راضٍ حول العالم</p>
          </div>
        </div>
      </div>
    </section>
  );
}

