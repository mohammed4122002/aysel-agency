"use client";

import Link from "next/link";
import { useSiteContent } from "@/lib/site-content-client";

interface SiteFooterProps {
  brandSubtitle?: string;
}

const defaultQuickLinks = [
  { label: "من نحن", href: "/about" },
  { label: "أعمالنا", href: "#" },
  { label: "دراسات الحالة", href: "#" },
  { label: "آراء العملاء", href: "#" },
  { label: "تواصل معنا", href: "/consultation" },
];

const defaultServices = [
  "استراتيجية السوق",
  "أبحاث النمو",
  "العلامة التجارية",
  "التسويق الرقمي",
  "تطوير المواقع",
  "تطبيقات الجوال",
];

function MailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="2.4" y="3.4" width="11.2" height="9.2" rx="1.8" stroke="currentColor" strokeWidth="1.4" />
      <path d="m3.2 4.5 4.8 4 4.8-4" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M4.1 2.8h2l.6 2.3-1 1c.6 1.1 1.5 2 2.6 2.6l1-1 2.3.6v2c0 .6-.5 1.1-1.1 1.1A8.1 8.1 0 0 1 2.9 4c0-.6.5-1.1 1.2-1.1Z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M8 14s4-3.8 4-7A4 4 0 1 0 4 7c0 3.2 4 7 4 7Z" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="8" cy="7" r="1.4" fill="currentColor" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="2.2" y="2.2" width="11.6" height="11.6" rx="3.2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="8" r="2.6" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="11.7" cy="4.4" r="0.8" fill="currentColor" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3.4 3.2h2.2L12.6 12.8h-2.2L3.4 3.2Z" fill="currentColor" />
      <path d="M12.3 3.2 8.8 7.2M7.2 9 3.7 12.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3.2 6.7h2v6.1h-2V6.7ZM4.2 3.3a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z" fill="currentColor" />
      <path d="M7.1 12.8V6.7H9v.8c.4-.6 1-.9 1.9-.9 1.6 0 2.5 1 2.5 2.8v3.4h-2V9.7c0-.9-.4-1.4-1.2-1.4-.8 0-1.2.5-1.2 1.4v3.1h-2Z" fill="currentColor" />
    </svg>
  );
}

export default function SiteFooter({ brandSubtitle = "AGENCY" }: SiteFooterProps) {
  const siteContent = useSiteContent();
  const quickLinks = Array.isArray(siteContent.footer?.quickLinks) && siteContent.footer.quickLinks.length > 0
    ? siteContent.footer.quickLinks
    : defaultQuickLinks;
  const services = Array.isArray(siteContent.footer?.services) && siteContent.footer.services.length > 0
    ? siteContent.footer.services
    : defaultServices;
  const footerDescription = siteContent.footer?.description
    ?? "شريكك المتكامل للنمو يجمع بين الاستراتيجية والإبداع والتكنولوجيا لتحقيق نتائج استثنائية.";
  const footerContact = siteContent.footer?.contact ?? {
    email: "hello@agency.com",
    phone: "+966 50 000 0000",
    address: "الرياض - المملكة العربية السعودية",
  };
  const copyrights = siteContent.footer?.copyrights ?? "© 2026 Agency. جميع الحقوق محفوظة.";
  const privacyText = siteContent.footer?.privacyText ?? "سياسة الخصوصية";
  const termsText = siteContent.footer?.termsText ?? "شروط الاستخدام";
  const poweredByText = siteContent.footer?.poweredByText ?? "Powered by Readdy";

  return (
    <footer className="bg-[radial-gradient(980px_440px_at_90%_8%,rgba(52,84,149,0.34),transparent_70%),radial-gradient(760px_420px_at_48%_34%,rgba(42,67,114,0.24),transparent_72%),linear-gradient(180deg,#070f22_0%,#0a1630_52%,#0b1a33_100%)] text-[#b9c4d7]">
      <div className="mx-auto w-full max-w-[1280px] px-4 py-14 sm:px-8 lg:px-10 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="text-right">
            <div className="mb-6 flex items-center justify-end gap-2.5 text-white">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
                <path
                  d="M7.2 29.5 20.1 5.2h8.2L15.5 29.5H7.2Zm10.8 0L31 5.2h4.3L22.5 29.5H18Z"
                  fill="url(#siteFooterLogoGrad)"
                />
                <defs>
                  <linearGradient id="siteFooterLogoGrad" x1="7.2" y1="5.2" x2="35.3" y2="29.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#fbfdff" />
                    <stop offset="1" stopColor="#d4ddeb" />
                  </linearGradient>
                </defs>
              </svg>

              <span className="leading-none">
                <span className="block text-[1.72rem] font-bold tracking-[0.02em]">AYSEL</span>
                <span className="mt-[-1px] block text-[0.7rem] font-semibold tracking-[0.34em] text-white/78">
                  {brandSubtitle}
                </span>
              </span>
            </div>

            <p className="max-w-[300px] text-[0.97rem] leading-[1.8] text-[#b7c3d7]">{footerDescription}</p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/8 text-white/92 transition-colors hover:bg-white/14"
                aria-label="LinkedIn"
              >
                <LinkedinIcon />
              </button>
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/8 text-white/92 transition-colors hover:bg-white/14"
                aria-label="X"
              >
                <XIcon />
              </button>
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/8 text-white/92 transition-colors hover:bg-white/14"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </button>
            </div>
          </div>

          <div className="text-right">
            <h3 className="mb-5 text-[1.72rem] font-bold leading-none text-white">روابط سريعة</h3>
            <ul className="space-y-3.5 text-[0.99rem] text-[#b8c4d8]">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-right">
            <h3 className="mb-5 text-[1.72rem] font-bold leading-none text-white">خدماتنا</h3>
            <ul className="space-y-3.5 text-[0.99rem] text-[#b8c4d8]">
              {services.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="text-right">
            <h3 className="mb-5 text-[1.72rem] font-bold leading-none text-white">تواصل معنا</h3>
            <ul className="space-y-4 text-[0.99rem] text-[#b8c4d8]">
              <li className="flex items-center justify-end gap-3.5">
                <span>{footerContact.email}</span>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/8 text-white/92">
                  <MailIcon />
                </span>
              </li>

              <li className="flex items-center justify-end gap-3.5">
                <span dir="ltr">{footerContact.phone}</span>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/8 text-white/92">
                  <PhoneIcon />
                </span>
              </li>

              <li className="flex items-center justify-end gap-3.5">
                <span>{footerContact.address}</span>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/8 text-white/92">
                  <PinIcon />
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-[0.95rem] text-[#9eaac0]">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p>{copyrights}</p>
            <div className="flex items-center gap-8">
              <span>{privacyText}</span>
              <span>{termsText}</span>
              <span>{poweredByText}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

