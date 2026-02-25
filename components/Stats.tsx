"use client";

import React, { useEffect, useRef, useState } from "react";

interface StatItem {
  value: string;
  label: string;
}

const stats: StatItem[] = [
  { value: "+500", label: "مشروع" },
  { value: "+200", label: "عميل" },
  { value: "15", label: "سنة خبرة" },
  { value: "98%", label: "رضا العملاء" },
];

function AnimatedNumber({ target, suffix = "" }: { target: string; suffix?: string }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const numericPart = target.replace(/[^0-9]/g, "");
          const prefix = target.startsWith("+") ? "+" : "";
          const end = parseInt(numericPart, 10);
          const duration = 1800;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * end);
            setDisplay(`${prefix}${current}${suffix}`);
            if (progress < 1) requestAnimationFrame(animate);
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, suffix]);

  return <div ref={ref}>{display}</div>;
}

export default function Stats() {
  return (
    <div className="mt-9 flex items-center gap-8 lg:gap-10" aria-label="إحصائيات">
      {stats.map((stat, idx) => {
        const suffix = stat.value.endsWith("%") ? "%" : "";
        return (
          <div key={idx} className="text-center">
            <div className="text-[1.76rem] font-semibold leading-none text-white sm:text-[1.89rem]">
              <AnimatedNumber target={stat.value} suffix={suffix} />
            </div>
            <p className="mt-1.5 text-xs text-white/45 sm:text-sm">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}

