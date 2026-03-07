"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { useSiteContent } from "@/lib/site-content-client";
import Image from "next/image";

const defaultMainNav = [
  { label: "الوكالة", href: "/" },
  { label: "تسوق", href: "/market" },
  { label: "ميديا", href: "/media" },
  { label: "تك", href: "/tech" },
];

const defaultTopLinks = {
  aboutLabel: "من نحن",
  aboutHref: "/about",
  worksLabel: "أعمالنا",
  worksHref: "#",
  consultationLabel: "استشارة مجانية",
  consultationHref: "/consultation",
};

type BrandKey = "agency" | "market" | "media" | "tech";

interface BrandTheme {
  subtitle: string;
  activeNavClass: string;
  ctaClass: string;
  mobileActiveNavClass: string;
  mobileCtaClass: string;
}

const brandThemes: Record<BrandKey, BrandTheme> = {
  agency: {
    subtitle: "AGENCY",
    activeNavClass:
      "bg-gradient-to-l from-[#c89f34] to-[#d9b64d] text-[#1a1305] shadow-[0_8px_20px_rgba(212,168,67,0.25)]",
    ctaClass:
      "rounded-full border border-[#d4a843] bg-gradient-to-l from-[#c79d32] to-[#dbbc55] px-7 py-2.5 text-base font-semibold text-[#1b160a] shadow-[0_10px_24px_rgba(212,168,67,0.2)]",
    mobileActiveNavClass:
      "bg-gradient-to-l from-[#c89f34] to-[#d9b64d] text-[#1a1305]",
    mobileCtaClass:
      "rounded-full border border-[#d4a843] px-4 py-1.5 text-[#e5c873]",
  },
  market: {
    subtitle: "MARKETING",
    activeNavClass:
      "bg-gradient-to-l from-[var(--brand-primary)] to-[var(--brand-primary-strong)] text-[#1a1305] shadow-[0_8px_20px_rgba(212,168,67,0.34)]",
    ctaClass:
      "rounded-full border border-[var(--brand-primary)] bg-gradient-to-l from-[var(--brand-primary)] to-[var(--brand-primary-strong)] px-7 py-2.5 text-base font-semibold text-[#1b160a] shadow-[0_10px_24px_rgba(212,168,67,0.3)]",
    mobileActiveNavClass:
      "bg-gradient-to-l from-[var(--brand-primary)] to-[var(--brand-primary-strong)] text-[#1a1305]",
    mobileCtaClass:
      "rounded-full border border-[var(--brand-primary)] px-4 py-1.5 text-[var(--brand-primary-soft)]",
  },
  media: {
    subtitle: "MEDIA",
    activeNavClass:
      "bg-gradient-to-l from-[var(--brand-primary)] to-[var(--brand-primary-strong)] text-[#1a1305] shadow-[0_8px_20px_rgba(212,168,67,0.34)]",
    ctaClass:
      "rounded-full border border-[var(--brand-primary)] bg-gradient-to-l from-[var(--brand-primary)] to-[var(--brand-primary-strong)] px-7 py-2.5 text-base font-semibold text-[#1b160a] shadow-[0_10px_24px_rgba(212,168,67,0.3)]",
    mobileActiveNavClass:
      "bg-gradient-to-l from-[var(--brand-primary)] to-[var(--brand-primary-strong)] text-[#1a1305]",
    mobileCtaClass:
      "rounded-full border border-[var(--brand-primary)] px-4 py-1.5 text-[var(--brand-primary-soft)]",
  },
  tech: {
    subtitle: "TECH",
    activeNavClass:
      "bg-gradient-to-l from-[var(--brand-primary)] to-[var(--brand-primary-strong)] text-[#1a1305] shadow-[0_8px_20px_rgba(212,168,67,0.34)]",
    ctaClass:
      "rounded-full border border-[var(--brand-primary)] bg-gradient-to-l from-[var(--brand-primary)] to-[var(--brand-primary-strong)] px-7 py-2.5 text-base font-semibold text-[#1b160a] shadow-[0_10px_24px_rgba(212,168,67,0.3)]",
    mobileActiveNavClass:
      "bg-gradient-to-l from-[var(--brand-primary)] to-[var(--brand-primary-strong)] text-[#1a1305]",
    mobileCtaClass:
      "rounded-full border border-[var(--brand-primary)] px-4 py-1.5 text-[var(--brand-primary-soft)]",
  },
};

function getBrandKey(pathname: string): BrandKey {
  if (pathname.startsWith("/market")) return "market";
  if (pathname.startsWith("/media")) return "media";
  if (pathname.startsWith("/tech")) return "tech";
  return "agency";
}

function isActiveRoute(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** ✅ Logos map (public/logos/...) */
const brandLogos: Record<
  BrandKey,
  { src: string; alt: string; width: number; height: number }
> = {
  agency: { src: "/logos/logo1.png", alt: "Aysel Agency Logo", width: 176, height: 60 },
  market: { src: "/logos/market.png", alt: "Aysel Market Logo", width: 176, height: 60 },
  media: { src: "/logos/media.png", alt: "Aysel Media Logo", width: 176, height: 60 },
  tech: { src: "/logos/tech.png", alt: "Aysel Tech Logo", width: 176, height: 60 },
};

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const siteContent = useSiteContent();

  const brandKey = getBrandKey(pathname);
  const theme = brandThemes[brandKey];
  const logo = brandLogos[brandKey]; // ✅ dynamic logo

  const dynamicMainNav =
    Array.isArray(siteContent.navigation?.main) &&
    siteContent.navigation.main.length > 0
      ? siteContent.navigation.main
      : defaultMainNav;

  const topLinks = siteContent.navigation?.topLinks ?? defaultTopLinks;

  return (
    <header className="absolute inset-x-0 top-0 z-[120] pt-6 pointer-events-auto">
      <div className="mx-auto w-full max-w-[1220px] px-4 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center text-white"
            aria-label="Aysel Agency"
          >
            <Image
              key={logo.src} // ✅ force re-render when route changes
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              priority
              className="h-10 w-auto transition-opacity duration-200 lg:h-11"
            />
          </Link>

          <nav className="hidden rounded-full border border-[#2f425e] bg-[linear-gradient(120deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] lg:flex">
            {dynamicMainNav.map((item) => {
              const isActive = isActiveRoute(pathname, item.href);
              const baseClass = `rounded-full px-6 py-2 text-sm transition-colors ${
                isActive ? theme.activeNavClass : "text-white/72 hover:text-white"
              }`;

              return (
                <Link key={item.label} href={item.href} className={baseClass}>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-6 lg:flex">
            <Link
              href={topLinks.aboutHref}
              className="text-base text-white/82 hover:text-white"
            >
              {topLinks.aboutLabel}
            </Link>
            <Link
              href={topLinks.worksHref}
              className="text-base text-white/82 hover:text-white"
            >
              {topLinks.worksLabel}
            </Link>
            <Link href={topLinks.consultationHref} className={theme.ctaClass}>
              {topLinks.consultationLabel}
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/[0.04] text-white lg:hidden"
            aria-label={mobileOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={mobileOpen}
          >
            <span className="sr-only">القائمة</span>
            {mobileOpen ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M4 4 14 14M14 4 4 14"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M3.5 5.2h11M3.5 9h11M3.5 12.8h11"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>

        {mobileOpen && (
          <div className="mt-4 rounded-2xl border border-white/12 bg-[#0f1628]/90 p-4 backdrop-blur-xl lg:hidden">
            <div className="mb-3 grid grid-cols-2 gap-2">
              {dynamicMainNav.map((item) => {
                const isActive = isActiveRoute(pathname, item.href);
                const mobileClass = `rounded-xl px-4 py-2.5 text-center text-sm ${
                  isActive
                    ? theme.mobileActiveNavClass
                    : "bg-white/[0.03] text-white/80"
                }`;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={mobileClass}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-sm text-white/85">
              <Link href={topLinks.aboutHref} onClick={() => setMobileOpen(false)}>
                {topLinks.aboutLabel}
              </Link>
              <Link href={topLinks.worksHref} onClick={() => setMobileOpen(false)}>
                {topLinks.worksLabel}
              </Link>
              <Link
                href={topLinks.consultationHref}
                className={theme.mobileCtaClass}
                onClick={() => setMobileOpen(false)}
              >
                {topLinks.consultationLabel}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
