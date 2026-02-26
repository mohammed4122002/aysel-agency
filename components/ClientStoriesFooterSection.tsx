"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useSiteContent } from "@/lib/site-content-client";

function QuoteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M6.9 4.7c-1.9.5-2.8 1.7-2.8 3.5h2v3.1H3.2V8.2c0-2.8 1.4-4.8 3.7-5.5Zm6 0C11 5.2 10.1 6.4 10.1 8.2h2v3.1H9.2V8.2c0-2.8 1.4-4.8 3.7-5.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M4.2 11.8 11.8 4.2M11.8 4.2H6.1m5.7 0v5.7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8 13.1 3.5 8.8A2.8 2.8 0 1 1 7.4 4.8L8 5.4l.6-.6a2.8 2.8 0 0 1 4 4L8 13.1Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="m8 2 1.6 3.2 3.5.5-2.6 2.4.6 3.5L8 10 4.9 11.6l.6-3.5-2.6-2.4 3.5-.5L8 2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8 8.2a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM3.8 12.2c0-1.7 1.8-2.9 4.2-2.9s4.2 1.2 4.2 2.9"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M2.8 12.2h10.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M4.2 10V7.1M8 10V5M11.8 10V8.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

const stats = [
  { value: "98%", label: "رضا العملاء", icon: <HeartIcon /> },
  { value: "4.9", label: "متوسط التقييم", icon: <StarIcon /> },
  { value: "+200", label: "عميل سعيد", icon: <UsersIcon /> },
  { value: "90%", label: "معدل الاحتفاظ", icon: <ChartIcon /> },
];

export default function ClientStoriesFooterSection() {
  const siteContent = useSiteContent();
  const stories = siteContent.pages?.agency?.clientStories;
  const prefersReducedMotion = useReducedMotion();

  const testimonials = useMemo(() => {
    const items = (stories?.items as Array<{
      id?: string;
      name?: string;
      role?: string;
      quote?: string;
      achievement?: string;
      image?: string;
    }> | undefined) ?? [];

    if (items.length > 0) {
      return items.map((item, index) => ({
        id: item.id ?? `cs-${index}`,
        name: item.name ?? "عميل",
        role: item.role ?? "عميل",
        quote: item.quote ?? "",
        achievement: item.achievement ?? "",
        image: item.image ?? "",
      }));
    }

    return [
      {
        id: "cs-default",
        name: stories?.authorName ?? "محمد العلي",
        role: stories?.authorRole ?? "المؤسس، فاشن فورورد",
        quote:
          stories?.quote ??
          "إبداع الفريق وتفكيرهم الاستراتيجي ساعدنا على إعادة بناء علامتنا التجارية وتوسيع أعمالنا بالكامل. هم لا ينفذون فقط - بل يفكرون كشركاء حقيقيين.",
        achievement: stories?.achievement ?? "توسع في 6 أسواق جديدة",
        image: stories?.authorImage ?? "/media-assets/avatar-4.png",
      },
    ];
  }, [stories]);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion || testimonials.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [prefersReducedMotion, testimonials.length]);

  const safeIndex = Math.min(activeIndex, Math.max(testimonials.length - 1, 0));
  const activeStory = testimonials[safeIndex];
  const dynamicStats =
    (stories?.stats as unknown as Array<{ value: string; label: string; icon?: React.ReactNode }> | undefined) ??
    stats;

  return (
    <section className="bg-[#eceef2] py-20 sm:py-24">
      <div className="mx-auto w-full max-w-[1220px] px-4 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[760px] text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-[#e2e5ea] px-4 py-1.5 text-xs font-semibold text-[#5f6775]">
            <UsersIcon />
            <span>{stories?.badge ?? "آراء العملاء"}</span>
          </div>

          <h2 className="mt-5 text-[clamp(2.05rem,4.2vw,3.43rem)] font-extrabold leading-[1.08] text-[#121a2b]">
            {stories?.title ?? "حقيقة قصص نجاح"}
          </h2>

          <p className="mx-auto mt-4 max-w-[760px] text-[1.03rem] leading-relaxed text-[#5a6476]">
            {stories?.subtitle ?? "عملاؤنا هم أفضل دليل على جودة عملنا. إليك ما يقولونه عن تجربتهم معنا."}
          </p>
        </div>

        <article className="relative mx-auto mt-10 max-w-[980px] overflow-hidden rounded-2xl border border-[#e0e5ed] bg-[linear-gradient(180deg,#f8fafd,#f4f7fb)] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] sm:p-10">
          <span className="pointer-events-none absolute -right-5 -top-5 h-16 w-16 rounded-full bg-[#ece7de]" />
          <span className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b1530] text-white">
            <QuoteIcon />
          </span>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeStory.id}
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -10 }}
              transition={{ duration: 0.4 }}
            >
              <p className="mx-auto max-w-[780px] text-center text-[1.3rem] leading-relaxed text-[#1a2537] sm:text-[1.44rem]">
                &ldquo;{activeStory.quote}&rdquo;
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#b9c2d1] bg-[#f4f7fb] px-4 py-2 text-sm font-semibold text-[#2b3649]"
                >
                  <ArrowUpIcon />
                  <span>{activeStory.achievement || "نتائج ملموسة خلال أسابيع"}</span>
                </button>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-base font-bold text-[#121a2b]">{activeStory.name}</p>
                    <p className="text-sm text-[#7b8596]">{activeStory.role}</p>
                  </div>

                  <div className="relative h-12 w-12 overflow-hidden rounded-full border border-white/80">
                    <Image
                      src={activeStory.image || "/media-assets/avatar-4.png"}
                      alt={activeStory.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </article>

        {testimonials.length > 1 ? (
          <div className="mt-8 flex items-center justify-center gap-2">
            {testimonials.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`h-[3px] w-6 rounded-full ${
                  idx === activeIndex ? "bg-[#121a2b]" : "bg-[#d5dbe6]"
                }`}
                aria-label={`الانتقال إلى رأي ${idx + 1}`}
              />
            ))}
          </div>
        ) : (
          <div className="mt-8 flex items-center justify-center gap-2">
            <span className="h-[2px] w-6 rounded-full bg-[#c3cad6]" />
            <span className="h-[2px] w-6 rounded-full bg-[#121a2b]" />
            <span className="h-[2px] w-6 rounded-full bg-[#d5dbe6]" />
          </div>
        )}

        <div className="mx-auto mt-10 grid max-w-[900px] grid-cols-2 gap-6 sm:grid-cols-4">
          {dynamicStats.map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-md bg-[#e2e6ee] text-[#5f6878]">
                {stat.icon ?? stats[index % stats.length]?.icon}
              </div>
              <p className="text-[1.22rem] font-bold text-[#121a2b]">{stat.value}</p>
              <p className="text-xs text-[#7e8899]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

