"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSiteContent } from "@/lib/site-content-client";

interface SiteFooterProps {
  brandSubtitle?: string;
}

type BrandKey = "agency" | "market" | "media" | "tech";

function getBrandKey(pathname: string): BrandKey {
  if (pathname.startsWith("/market")) return "market";
  if (pathname.startsWith("/media")) return "media";
  if (pathname.startsWith("/tech")) return "tech";
  return "agency";
}

const brandLogos: Record<
  BrandKey,
  { src: string; alt: string; width: number; height: number; subtitle: string }
> = {
  agency: { src: "/logos/logo1.png", alt: "Aysel Agency Logo", width: 176, height: 60, subtitle: "AGENCY" },
  market: { src: "/logos/market.png", alt: "Aysel Market Logo", width: 176, height: 60, subtitle: "MARKETING" },
  media: { src: "/logos/media.png", alt: "Aysel Media Logo", width: 176, height: 60, subtitle: "MEDIA" },
  tech: { src: "/logos/tech.png", alt: "Aysel Tech Logo", width: 176, height: 60, subtitle: "TECH" },
};

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

export default function SiteFooter({ brandSubtitle }: SiteFooterProps) {
  const pathname = usePathname();
  const brandKey = getBrandKey(pathname);
  const logo = brandLogos[brandKey];
  const resolvedSubtitle = brandSubtitle ?? logo.subtitle;
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
    <footer className="bg-[radial-gradient(980px_440px_at_90%_8%,rgba(212,168,67,0.08),transparent_70%),radial-gradient(760px_420px_at_48%_34%,rgba(11,52,112,0.2),transparent_72%),linear-gradient(180deg,#03060f_0%,#050815_52%,#04070f_100%)] text-[#a99574]">
      <div className="mx-auto w-full max-w-[1280px] px-4 py-14 sm:px-8 lg:px-10 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="text-right">
            <div className="mb-6 flex items-center  gap-2.5 text-white">
              <Image
                key={logo.src}
                src={logo.src}
                alt={`Aysel ${resolvedSubtitle} Logo`}
                width={logo.width}
                height={logo.height}
                className="h-11 w-auto"
              />
            </div>

            <p className="max-w-[300px] text-[0.97rem] leading-[1.8] text-[#9e8a67]">{footerDescription}</p>

            <div className="mt-6 flex items-center  gap-3">
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[rgba(212,168,67,0.2)] bg-[rgba(212,168,67,0.06)] text-[#d4a843] transition-colors hover:bg-[rgba(212,168,67,0.14)]"
                aria-label="LinkedIn"
              >
                <LinkedinIcon />
              </button>
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[rgba(212,168,67,0.2)] bg-[rgba(212,168,67,0.06)] text-[#d4a843] transition-colors hover:bg-[rgba(212,168,67,0.14)]"
                aria-label="X"
              >
                <XIcon />
              </button>
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[rgba(212,168,67,0.2)] bg-[rgba(212,168,67,0.06)] text-[#d4a843] transition-colors hover:bg-[rgba(212,168,67,0.14)]"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </button>
            </div>
          </div>

          <div className="text-right">
            <h3 className="mb-5 text-[1.72rem] font-bold leading-none text-[#f2ead6]">روابط سريعة</h3>
            <ul className="space-y-3.5 text-[0.99rem] text-[#9e8a67]">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="transition-colors hover:text-[#d4a843]">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-right">
            <h3 className="mb-5 text-[1.72rem] font-bold leading-none text-[#f2ead6]">خدماتنا</h3>
            <ul className="space-y-3.5 text-[0.99rem] text-[#9e8a67]">
              {services.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="text-right">
            <h3 className="mb-5 text-[1.72rem] font-bold leading-none text-[#f2ead6]">تواصل معنا</h3>
            <ul className="space-y-4 text-[0.99rem] text-[#9e8a67]">
              <li className="flex items-center  gap-3.5">
                 <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[rgba(212,168,67,0.2)] bg-[rgba(212,168,67,0.06)] text-[#d4a843]">
                  <MailIcon />
                </span>
                <span>{footerContact.email}</span>
               
              </li>

              <li className="flex items-center gap-3.5">
                   <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[rgba(212,168,67,0.2)] bg-[rgba(212,168,67,0.06)] text-[#d4a843]">
                  <PhoneIcon />
                </span>
                <span dir="ltr">{footerContact.phone}</span>
             
              </li>

              <li className="flex items-center gap-3.5">
                 <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[rgba(212,168,67,0.2)] bg-[rgba(212,168,67,0.06)] text-[#d4a843]">
                  <PinIcon />
                </span>
                <span>{footerContact.address}</span>
               
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-[rgba(212,168,67,0.12)] pt-8 text-[0.95rem] text-[#7d6a50]">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p>{copyrights}</p>
            <div className="flex items-center gap-8">
              <span className="transition-colors hover:text-[#d4a843]">{privacyText}</span>
              <span className="transition-colors hover:text-[#d4a843]">{termsText}</span>
              <span className="text-[#c8973a]">{poweredByText}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
