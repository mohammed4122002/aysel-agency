import Image from "next/image";
import React from "react";

interface ServiceCard {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  active?: boolean;
  icon: React.ReactNode;
}

const MarketIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
    <path d="M3.2 16.8h13.6M5.6 13v-3.5M9.8 13V6.8M14 13V5.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const MediaIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
    <rect x="2.8" y="3" width="14.4" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M6 7.3h8M6 10h8M6 12.7h5.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const TechIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
    <rect x="2.8" y="3.3" width="14.4" height="10.8" rx="1.8" stroke="currentColor" strokeWidth="1.5" />
    <path d="M7.5 16.6h5M10 14.1v2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const services: ServiceCard[] = [
  {
    id: "market",
    title: "ماركت",
    subtitle: "استراتيجية ونمو",
    icon: <MarketIcon />,
  },
  {
    id: "media",
    title: "ميديا",
    subtitle: "إبداع وهوية",
    description: "بناء علامة تجارية قوية ومحتوى إبداعي مؤثر",
    icon: <MediaIcon />,
    active: true,
  },
  {
    id: "tech",
    title: "تك",
    subtitle: "حلول رقمية",
    icon: <TechIcon />,
  },
];

const avatars = [
  "/figma-assets/section5/avatar-1.png",
  "/figma-assets/section5/avatar-2.png",
  "/figma-assets/section5/avatar-3.png",
  "/figma-assets/section5/avatar-4.png",
];

export default function ServiceCards() {
  return (
    <aside className="relative w-full max-w-[506px]" aria-label="خدماتنا">
      <ul className="flex flex-col gap-4">
        {services.map((service) => {
          const cardClass = service.active
            ? "border-[#d4af37]/50 bg-white/[0.12] shadow-[0_14px_36px_rgba(212,175,55,0.16)]"
            : "border-white/20 bg-white/[0.05]";
          const heightClass = service.active ? "min-h-[116px]" : "min-h-[98px]";
          const descriptionClass = service.active ? "mt-2 text-sm leading-6 text-white/70" : "hidden";

          return (
            <li key={service.id}>
              <article className={`rounded-2xl border p-[21px] backdrop-blur-[2px] ${cardClass} ${heightClass}`}>
                <div className="flex items-start justify-between gap-4">
                  <span
                    className={`flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-xl ${
                      service.active ? "bg-[#d4af37] text-[#15120a]" : "bg-white/10 text-white/80"
                    }`}
                  >
                    {service.icon}
                  </span>

                  <div className="flex-1 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <h3 className={`text-[18px] font-bold ${service.active ? "text-white" : "text-white/85"}`}>
                        {service.title}
                      </h3>
                      <p className="text-[14px] text-white/45">{service.subtitle}</p>
                    </div>

                    {service.description && <p className={descriptionClass}>{service.description}</p>}
                  </div>

                  <span className={service.active ? "pt-1 text-[#d4af37]" : "pt-1 text-white/35"} aria-hidden>
                    &#8249;
                  </span>
                </div>

                {service.active && (
                  <div className="mt-4 h-0.5 w-full rounded-full bg-white/20">
                    <span className="block h-full w-full rounded-full bg-[#d4af37]" />
                  </div>
                )}
              </article>
            </li>
          );
        })}
      </ul>

      <article className="mt-4 min-h-[110px] rounded-2xl border border-white/20 bg-white/[0.05] p-[21px] backdrop-blur-[2px]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex -space-x-3 rtl:space-x-reverse">
            {avatars.map((avatar) => (
              <span key={avatar} className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-white/80">
                <Image src={avatar} alt="عميل" fill className="object-cover" sizes="36px" />
              </span>
            ))}
          </div>

          <div className="flex gap-0.5 text-[#d4af37]" aria-label="تقييم خمس نجوم">
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                <path d="M8 1.2 10.1 5.6 15 6.3l-3.5 3.4.8 4.8L8 12.2l-4.3 2.3.8-4.8L1 6.3l4.9-.7L8 1.2Z" />
              </svg>
            ))}
          </div>
        </div>

        <p className="mt-3 text-right text-[14px] text-white/70">انضم إلى +200 عميل راضٍ حول العالم</p>
      </article>
    </aside>
  );
}
