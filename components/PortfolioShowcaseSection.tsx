"use client";

import Image from "next/image";
import React, { useMemo, useState } from "react";
import { useSiteContent } from "@/lib/site-content-client";

type Category = "all" | "market" | "media" | "tech";

interface PortfolioProject {
  id: number;
  category: Exclude<Category, "all">;
  categoryLabel: string;
  client: string;
  title: string;
  description: string;
  duration: string;
  image: string;
}

const filters: { id: Category; label: string }[] = [
  { id: "all", label: "الكل" },
  { id: "market", label: "ماركت" },
  { id: "media", label: "ميديا" },
  { id: "tech", label: "تك" },
];

const projects: PortfolioProject[] = [
  {
    id: 1,
    category: "market",
    categoryLabel: "ماركت",
    client: "جلوبال ريتيل",
    title: "استراتيجية دخول السوق الإقليمية",
    description:
      "تطوير استراتيجية شاملة لدخول أسواق جديدة في المنطقة مع دراسة تنافسية معمقة.",
    duration: "6 أشهر",
    image: "/media-assets/portfolio-boardroom.png",
  },
  {
    id: 2,
    category: "media",
    categoryLabel: "ميديا",
    client: "تك ستارت",
    title: "حملة إطلاق العلامة التجارية الشاملة",
    description:
      "حملة تسويقية متكاملة لإطلاق علامة تجارية جديدة في السوق مع استراتيجية محتوى إبداعي.",
    duration: "3 أشهر",
    image: "/media-assets/portfolio-abstract.png",
  },
  {
    id: 3,
    category: "tech",
    categoryLabel: "تك",
    client: "فاشن فورورد",
    title: "منصة التجارة الإلكترونية المتكاملة",
    description:
      "تطوير منصة تجارة إلكترونية متكاملة مع نظام إدارة المخزون الذكي وتكامل مع بوابات الدفع المتعددة.",
    duration: "4 أشهر",
    image: "/media-assets/portfolio-ecommerce.png",
  },
  {
    id: 4,
    category: "market",
    categoryLabel: "ماركت",
    client: "فينتك سولوشنز",
    title: "تحليل وأبحاث السوق المالي",
    description:
      "دراسة شاملة للسوق المالي وتحليل المنافسين والفرص الاستثمارية.",
    duration: "3 أشهر",
    image: "/media-assets/portfolio-finance.png",
  },
  {
    id: 5,
    category: "media",
    categoryLabel: "ميديا",
    client: "إديوتك",
    title: "إنتاج محتوى فيديو تعليمي احترافي",
    description:
      "إنتاج سلسلة فيديوهات تعليمية احترافية للمنصة التعليمية مع رسوم متحركة.",
    duration: "4 أشهر",
    image: "/media-assets/portfolio-studio.png",
  },
  {
    id: 6,
    category: "tech",
    categoryLabel: "تك",
    client: "هيلث كير بلس",
    title: "تطبيق الجوال الصحي الذكي",
    description:
      "تطوير تطبيق جوال متقدم لإدارة المواعيد الطبية والسجلات الصحية الإلكترونية.",
    duration: "5 أشهر",
    image: "/media-assets/portfolio-mobile.png",
  },
  {
    id: 7,
    category: "market",
    categoryLabel: "ماركت",
    client: "إي-كومرس جلوبال",
    title: "استراتيجية التوسع الدولي",
    description:
      "تطوير خطة توسع دولية شاملة لدخول أسواق الخليج وشمال أفريقيا.",
    duration: "8 أشهر",
    image: "/media-assets/portfolio-map.png",
  },
  {
    id: 8,
    category: "media",
    categoryLabel: "ميديا",
    client: "ريتيل برو",
    title: "حملة إعلانية متعددة القنوات",
    description:
      "حملة إعلانية شاملة عبر منصات متعددة لزيادة المبيعات الموسمية.",
    duration: "2 أشهر",
    image: "/media-assets/portfolio-flowers.png",
  },
  {
    id: 9,
    category: "tech",
    categoryLabel: "تك",
    client: "ترافل هب",
    title: "منصة حجز السفر والسياحة",
    description:
      "تطوير منصة متكاملة لحجز الرحلات والفنادق مع نظام مقارنة الأسعار.",
    duration: "6 أشهر",
    image: "/media-assets/portfolio-travel.png",
  },
];

function SectionLabelIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3.3 4h9.4v8H3.3V4Zm2.2 2.2h5M5.5 8h5M5.5 9.8h3.4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="2.4" y="2.4" width="4.4" height="4.4" rx="1.1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="9.2" y="2.4" width="4.4" height="4.4" rx="1.1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="2.4" y="9.2" width="4.4" height="4.4" rx="1.1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="9.2" y="9.2" width="4.4" height="4.4" rx="1.1" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 3h5.5L13 7.5 8.5 12H3V3Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="6.2" cy="6" r="0.9" fill="currentColor" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="5.6" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 5.1v3.2l2 1.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export default function PortfolioShowcaseSection() {
  const [activeFilter, setActiveFilter] = useState<Category>("all");
  const siteContent = useSiteContent();
  const portfolioContent = siteContent.pages?.agency?.portfolio;
  const dynamicFilters =
    (portfolioContent?.filters as unknown as Array<{ id: Category; label: string }> | undefined) ??
    filters;
  const dynamicProjects =
    (portfolioContent?.projects as unknown as PortfolioProject[] | undefined) ?? projects;

  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") return dynamicProjects;
    return dynamicProjects.filter((project) => project.category === activeFilter);
  }, [activeFilter, dynamicProjects]);

  return (
    <section className="portfolio-section py-20 sm:py-24">
      <div className="mx-auto w-full max-w-[1220px] px-4 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[840px] text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-[#e2e5ea] px-4 py-1.5 text-xs font-semibold text-[#5f6775]">
            <SectionLabelIcon />
            <span>{portfolioContent?.badge ?? "معرض الأعمال"}</span>
          </div>

          <h2 className="mt-5 text-[clamp(2.13rem,4.5vw,3.59rem)]  leading-[1.06] text-[#121a2b]">
            {portfolioContent?.title ?? "أعمال نفتخر بإنجازها"}
          </h2>

          <p className="mx-auto mt-4 max-w-[860px] text-[1.06rem] leading-relaxed text-[#4b5565]">
            {portfolioContent?.subtitle ??
              "نماذج من مشاريعنا الناجحة التي ساعدت عملاءنا على تحقيق أهدافهم وتجاوز توقعاتهم بنتائج استثنائية."}
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {dynamicFilters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              className={`portfolio-filter ${
                activeFilter === filter.id ? "portfolio-filter-active" : ""
              }`}
              aria-pressed={activeFilter === filter.id}
            >
              <span>{filter.label}</span>
              {filter.id === "all" ? <GridIcon /> : <TagIcon />}
            </button>
          ))}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <article key={project.id} className="portfolio-card overflow-hidden rounded-[20px]">
              <div className="relative h-[220px] overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
                />

                <span className="absolute right-3 top-3 inline-flex rounded-full bg-[#0a1430] px-3 py-1 text-xs font-bold text-white">
                  {project.categoryLabel}
                </span>
              </div>

              <div className="px-5 pb-5 pt-4 text-right">
                <p className="inline-flex items-center gap-1.5 text-xs text-[#8a93a5]">
                  <TagIcon />
                  <span>{project.client}</span>
                </p>

                <h3 className="mt-2 text-[1.72rem]  leading-tight text-[#121a2b]">
                  {project.title}
                </h3>

                <p className="mt-2 text-[0.91rem] leading-relaxed text-[#5f6877]">
                  {project.description}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-[#e3e7ef] pt-4">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#121a2b] hover:text-[#0a1430]"
                  >
                    <span>اقرأ المزيد</span>
                    <span>←</span>
                  </button>

                  <span className="inline-flex items-center gap-1.5 text-xs text-[#8a93a5]">
                    <ClockIcon />
                    <span>{project.duration}</span>
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0b1530] px-8 py-3 text-base font-semibold text-white shadow-[0_12px_26px_rgba(11,21,48,0.25)]"
          >
            <span>{portfolioContent?.viewAllLabel ? portfolioContent.viewAllLabel : "عرض جميع الأعمال"}</span>
            <span>←</span>
          </button>
        </div>
      </div>
    </section>
  );
}

