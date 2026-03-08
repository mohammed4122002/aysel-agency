"use client";

import Image from "next/image";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import { useEffect, useMemo, useState } from "react";

type NeedId = "idea" | "legacy" | "integration";
type JourneyId = "01" | "02" | "03" | "04" | "05";
type ProjectFilter = "all" | "web" | "mobile" | "ai";
type HeroChipKind = "web" | "mobile" | "cloud" | "security";
type HeroStatKind = "support" | "satisfaction" | "projects";
type SolutionIconKind = "web" | "mobile" | "dashboard" | "integration";

interface SolutionItem {
  id: string;
  value: string;
  unit: string;
  title: string;
  description: string;
  badges: string[];
  icon: SolutionIconKind;
}

interface NeedItem {
  id: NeedId;
  title: string;
  subtitle: string;
  timeline: string;
  bullets: string[];
}

interface JourneyStep {
  id: JourneyId;
  title: string;
  duration: string;
  summary: string;
  details: string;
}

interface ProjectMetric {
  value: string;
  label: string;
}

interface ProjectItem {
  id: string;
  title: string;
  category: Exclude<ProjectFilter, "all">;
  categoryLabel: string;
  description: string;
  year: string;
  image: string;
  metrics: ProjectMetric[];
}

interface HeroChip {
  id: string;
  label: string;
  kind: HeroChipKind;
  active?: boolean;
}

interface HeroStat {
  id: string;
  value: string;
  label: string;
  kind: HeroStatKind;
}

const heroChips: HeroChip[] = [
  { id: "web", label: "تطوير المواقع", kind: "web" },
  { id: "mobile", label: "تطبيقات الجوال", kind: "mobile" },
  { id: "cloud", label: "حلول سحابية", kind: "cloud" },
  { id: "security", label: "أمن سيبراني", kind: "security", active: true },
];

const heroStats: HeroStat[] = [
  { id: "support", value: "24/7", label: "دعم فني", kind: "support" },
  { id: "satisfaction", value: "98%", label: "رضا العملاء", kind: "satisfaction" },
  { id: "projects", value: "+500", label: "مشروع", kind: "projects" },
];

const heroCodeLines = [
  "const buildDreamAwait = project.launch();",
  'const quality = "premium";',
  'const speed = "lightning";',
  "const innovation = true;",
  "return deploy({ quality, speed, innovation });",
];

const heroCodeBlock = heroCodeLines.join("\n");

const solutions: SolutionItem[] = [
  {
    id: "web",
    value: "120+",
    unit: "مشروع",
    title: "تطوير المواقع",
    description: "مواقع عصرية بأحدث التقنيات، مُحسنة للسرعة وتجربة المستخدم.",
    badges: ["React / Next.js", "تصميم متجاوب", "SEO محسن"],
    icon: "web",
  },
  {
    id: "mobile",
    value: "80+",
    unit: "تطبيق",
    title: "تطبيقات الجوال",
    description: "تطبيقات iOS وAndroid بتجربة مستخدم استثنائية وأداء سلس.",
    badges: ["Flutter / React Native", "أداء عالي", "تجربة سلسة"],
    icon: "mobile",
  },
  {
    id: "dashboard",
    value: "95+",
    unit: "نظام",
    title: "لوحات التحكم",
    description: "أنظمة إدارة ذكية مع عروض بيانات تفاعلي وتقارير مخصصة.",
    badges: ["تقارير تفاعلية", "بيانات حية", "صلاحيات متقدمة"],
    icon: "dashboard",
  },
  {
    id: "integration",
    value: "200+",
    unit: "API",
    title: "تكامل الأنظمة",
    description: "نربط أنظمتك وأدواتك معًا بسلاسة ونُتمت سير العمل.",
    badges: ["REST / GraphQL", "أتمتة العمليات", "ربط سلس"],
    icon: "integration",
  },
];

const needs: NeedItem[] = [
  {
    id: "idea",
    title: "لدي فكرة جديدة",
    subtitle: "أريد تحويل فكرتي إلى منتج رقمي واضح ومربح.",
    timeline: "8-12 أسبوع",
    bullets: ["تحليل الفكرة", "تصميم تجربة المستخدم", "MVP سريع"],
  },
  {
    id: "legacy",
    title: "لدي موقع قديم",
    subtitle: "أحتاج إعادة بناء المنصة بشكل أسرع وأكثر استقرارًا.",
    timeline: "6-10 أسابيع",
    bullets: ["مراجعة تقنية", "تحسين الأداء", "إعادة الهيكلة"],
  },
  {
    id: "integration",
    title: "أحتاج تكامل",
    subtitle: "أريد ربط الأنظمة الحالية وتوحيد البيانات في مكان واحد.",
    timeline: "4-8 أسابيع",
    bullets: ["ربط APIs", "أتمتة العمليات", "تقارير لحظية"],
  },
];

const stack = [
  "Flutter",
  "TypeScript",
  "Python",
  "Node.js",
  "Next.js",
  "Vue.js",
  "React",
  "AWS",
  "Docker",
  "Firebase",
  "MongoDB",
  "PostgreSQL",
];

const journey: JourneyStep[] = [
  {
    id: "01",
    title: "الاكتشاف",
    duration: "1-2 يوم",
    summary: "نبدأ بفهم المنتج، الجمهور، والأهداف.",
    details: "جلسة تحليل مركزة لتحديد نطاق العمل ومؤشرات النجاح قبل أي كتابة كود.",
  },
  {
    id: "02",
    title: "التخطيط",
    duration: "2-3 أيام",
    summary: "نحوّل الرؤية إلى خارطة تنفيذ واضحة.",
    details: "نحدد المعمارية، أولويات النسخة الأولى، وجدول زمني عملي للتسليم.",
  },
  {
    id: "03",
    title: "التطوير",
    duration: "2-6 أسابيع",
    summary: "تنفيذ سريع مع مراجعات مستمرة.",
    details: "نطور الواجهات والخلفية بالتوازي، مع إصدار تحديثات أسبوعية قابلة للتجربة.",
  },
  {
    id: "04",
    title: "الإطلاق",
    duration: "1-2 يوم",
    summary: "إطلاق منضبط مع تجهيز بيئة الإنتاج.",
    details: "ننفذ اختبارات ما قبل الإطلاق ونضبط المراقبة والتنبيهات لضمان الاستقرار.",
  },
  {
    id: "05",
    title: "التحسين",
    duration: "مستمر",
    summary: "تحسين الأداء والتحويل بناءً على البيانات.",
    details: "نراقب سلوك المستخدم، نحل نقاط الاحتكاك، ونطلق تحسينات متتابعة.",
  },
];

const projectFilters: Array<{ id: ProjectFilter; label: string }> = [
  { id: "all", label: "الكل" },
  { id: "web", label: "مواقع" },
  { id: "mobile", label: "جوال" },
  { id: "ai", label: "ذكاء اصطناعي" },
];

const projects: ProjectItem[] = [
  {
    id: "ecommerce",
    title: "منصة التجارة الإلكترونية",
    category: "web",
    categoryLabel: "ويب",
    description: "منصة تجارة إلكترونية متكاملة مع إدارة طلبات ومخزون.",
    year: "2024",
    image: "/media-assets/project-phone.png",
    metrics: [
      { value: "95%", label: "رضا العملاء" },
      { value: "80%", label: "نمو المبيعات" },
      { value: "250%", label: "زيادة الطلبات" },
    ],
  },
  {
    id: "delivery",
    title: "تطبيق التوصيل الفوري",
    category: "mobile",
    categoryLabel: "جوال",
    description: "تطبيق توصيل مع تتبع حي وتجربة مستخدم مبسطة.",
    year: "2024",
    image: "/media-assets/project-fashion.png",
    metrics: [
      { value: "40%", label: "سرعة التوصيل" },
      { value: "99%", label: "توفر الخدمة" },
      { value: "5000+", label: "عملية يومية" },
    ],
  },
  {
    id: "assistant",
    title: "مساعد ذكاء اصطناعي",
    category: "ai",
    categoryLabel: "AI",
    description: "مساعد ذكي لدعم القرارات وتحليل بيانات العملاء.",
    year: "2024",
    image: "/media-assets/project-brand.png",
    metrics: [
      { value: "94%", label: "دقة التحليل" },
      { value: "90%", label: "رضا الفريق" },
      { value: "85%", label: "توفير الوقت" },
    ],
  },
  {
    id: "dashboard",
    title: "نظام إدارة المستشفيات",
    category: "web",
    categoryLabel: "لوحة تحكم",
    description: "لوحة تشغيل مركزية لإدارة العمليات الطبية والبيانات.",
    year: "2023",
    image: "/media-assets/service-dashboard.png",
    metrics: [
      { value: "92%", label: "الكفاءة" },
      { value: "99%", label: "الاعتمادية" },
      { value: "60%", label: "توفير التكاليف" },
    ],
  },
];

function DotIcon() {
  return <span className="inline-block h-2 w-2 rounded-full bg-[var(--brand-primary)]" aria-hidden />;
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M12 8H4.3M4.3 8l2.8-2.8M4.3 8l2.8 2.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SolutionIcon({ kind }: { kind: SolutionIconKind }) {
  if (kind === "web") {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <rect x="2.2" y="3.2" width="13.6" height="11.2" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M2.7 6.1h12.6" stroke="currentColor" strokeWidth="1.3" />
        <circle cx="5" cy="4.8" r="0.6" fill="currentColor" />
      </svg>
    );
  }

  if (kind === "mobile") {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <rect x="5.6" y="2.2" width="6.8" height="13.6" rx="1.8" stroke="currentColor" strokeWidth="1.4" />
        <path d="M7.8 4.5h2.4M8 13.2h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === "dashboard") {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <circle cx="9" cy="9" r="6.2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M9 9 12.2 6.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="9" cy="9" r="1" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M6.1 11.9 11.9 6.1M7 4.9h4.8v4.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="2.6" y="2.6" width="12.8" height="12.8" rx="3" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function HeroChipIcon({ kind }: { kind: HeroChipKind }) {
  if (kind === "web") {
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="8" cy="8" r="5.6" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2.4 8h11.2M8 2.4a9 9 0 0 1 0 11.2M8 2.4a9 9 0 0 0 0 11.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === "mobile") {
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
        <rect x="5.1" y="2.2" width="5.8" height="11.6" rx="1.4" stroke="currentColor" strokeWidth="1.4" />
        <path d="M7.1 4.2h1.8M7.3 11.8h1.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === "cloud") {
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M4.8 12h6.2a2.3 2.3 0 0 0 .2-4.6A3.4 3.4 0 0 0 4.6 8a2 2 0 0 0 .2 4Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M8 2.3 2.9 4.5v3.2c0 2.6 1.6 4.4 5.1 6 3.5-1.6 5.1-3.4 5.1-6V4.5L8 2.3Z" stroke="currentColor" strokeWidth="1.4" />
      <path d="m6.3 7.9 1.2 1.2 2.2-2.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M8 2.8A2.5 2.5 0 0 0 5.5 5.3v.9c0 .7-.2 1.4-.6 2L4.2 9.3h7.6l-.7-1.1a3.4 3.4 0 0 1-.6-2v-.9A2.5 2.5 0 0 0 8 2.8Z" stroke="currentColor" strokeWidth="1.3" />
      <path d="M6.9 10.8a1.2 1.2 0 0 0 2.2 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function HeroStatIcon({ kind }: { kind: HeroStatKind }) {
  if (kind === "support") {
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M4.4 8.1V7a3.6 3.6 0 0 1 7.2 0v1.1M4.4 8.1A1.5 1.5 0 0 0 3 9.6v.5c0 .7.6 1.3 1.3 1.3h1.2V8.1H4.4Zm7.2 0a1.5 1.5 0 0 1 1.4 1.5v.5c0 .7-.6 1.3-1.3 1.3h-1.2V8.1h1.1Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === "satisfaction") {
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M8 13.1 3.6 8.9a2.8 2.8 0 0 1 4-4l.4.4.4-.4a2.8 2.8 0 0 1 4 4L8 13.1Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="m6.2 5.1-2.4 2.7 2.4 2.7M9.8 5.1l2.4 2.7-2.4 2.7M9 3.8 7 11.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NeedCardIcon({ id }: { id: NeedId }) {
  if (id === "integration") {
    return (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M9.2 6.2V4.5a2 2 0 0 1 2-2h1.6a2 2 0 0 1 2 2v1.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <rect x="5.1" y="6.6" width="13.8" height="8.8" rx="2.2" stroke="currentColor" strokeWidth="2" />
        <path d="M12 15.4v4.2M9.2 19.6h5.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (id === "legacy") {
    return (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M5 12a7 7 0 1 1 2.1 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M5 7.2v4.5h4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 3.5a6 6 0 0 1 3.5 10.9c-.8.6-1.3 1.4-1.5 2.3h-4c-.2-.9-.7-1.7-1.5-2.3A6 6 0 0 1 12 3.5Z" stroke="currentColor" strokeWidth="2" />
      <path d="M12 8.4v3.1M10.8 17.8h2.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function JourneyStepIcon({ id }: { id: JourneyId }) {
  if (id === "01") {
    return (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
        <circle cx="10" cy="10" r="6.3" stroke="currentColor" strokeWidth="1.7" />
        <path d="m10 10 3.4-1.8-1.8 3.4L8.2 13.4 10 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    );
  }

  if (id === "02") {
    return (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path d="M4.3 14.2 13.6 5l1.4 1.4-9.3 9.3H4.3v-1.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="m11.8 6.7 1.5 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }

  if (id === "03") {
    return (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path d="m7.7 6.3-3.3 3.6 3.3 3.7M12.3 6.3l3.3 3.6-3.3 3.7M11 5.4l-2 9.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (id === "04") {
    return (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
        <circle cx="10" cy="10" r="4.2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10 3.6v2.1M10 14.3v2.1M3.6 10h2.1M14.3 10h2.1M5.5 5.5l1.5 1.5M13 13l1.5 1.5M5.5 14.5 7 13M13 7l1.5-1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }

  return <BellIcon />;
}

function ClockMiniIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="5.6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 5.1v3l2 1.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="m4.2 6.3 3.8 3.8 3.8-3.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TechChipIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M8 2.6v2M8 11.4v2M2.6 8h2M11.4 8h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="8" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function renderCodeLine(line: string) {
  if (!line) {
    return null;
  }

  const tokens = line.split(/(\s+|"[^"]*"|[{}()[\].,;=])/g).filter(Boolean);

  return tokens.map((token, index) => {
    let className = "text-white/82";

    if (token === "const" || token === "return" || token === "true") {
      className = "text-[var(--brand-primary)]";
    } else if (/^"[^"]*"$/.test(token)) {
      className = "text-[var(--brand-primary-soft)]";
    } else if (/^[{}()[\].,;=]$/.test(token)) {
      className = "text-white/40";
    }

    return (
      <span key={`${token}-${index}`} className={className}>
        {token}
      </span>
    );
  });
}

export default function TechPage() {
  const [activeJourneyId, setActiveJourneyId] = useState<JourneyId>("01");
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>("all");
  const [typedChars, setTypedChars] = useState(0);
  const [codePhase, setCodePhase] = useState<"typing" | "pause">("typing");
  const activeJourneyIndex = journey.findIndex((item) => item.id === activeJourneyId);
  const journeySegmentWidth = 100 / journey.length;

  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") {
      return projects;
    }

    return projects.filter((project) => project.category === activeFilter);
  }, [activeFilter]);

  useEffect(() => {
    const fullLength = heroCodeBlock.length;
    const isFullyTyped = typedChars >= fullLength;
    const delay = codePhase === "typing" ? (isFullyTyped ? 1200 : 42) : 460;

    const timeoutId = window.setTimeout(() => {
      if (codePhase === "typing") {
        if (isFullyTyped) {
          setCodePhase("pause");
          return;
        }

        setTypedChars((prev) => Math.min(fullLength, prev + 1));
        return;
      }

      setTypedChars(0);
      setCodePhase("typing");
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [codePhase, typedChars]);

  const visibleCode = heroCodeBlock.slice(0, typedChars);
  const visibleCodeLines = visibleCode ? visibleCode.split("\n") : [];
  const cursorLineIndex = Math.max(0, Math.min(visibleCodeLines.length - 1, heroCodeLines.length - 1));

  return (
    <main className="bg-[#040812]">
      <section className="relative overflow-hidden bg-[radial-gradient(1080px_620px_at_76%_32%,rgba(16,24,48,0.7),transparent_67%),radial-gradient(780px_480px_at_20%_74%,rgba(8,16,32,0.9),transparent_70%),linear-gradient(180deg,#020915_0%,#020918_56%,#020713_100%)]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(116deg,rgba(212,168,67,0.08)_0,rgba(212,168,67,0.08)_1px,transparent_1px,transparent_92px)] opacity-30" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_720px_280px_at_52%_52%,rgba(212,168,67,0.26),transparent_72%)]" />
          <div className="absolute left-1/2 top-[13%] h-[92%] w-px -translate-x-[138px] rotate-[7deg] bg-gradient-to-b from-transparent via-[var(--brand-primary)]/40 to-transparent" />
          <div className="absolute left-1/2 top-[13%] h-[92%] w-px translate-x-[138px] -rotate-[7deg] bg-gradient-to-b from-transparent via-[var(--brand-primary)]/34 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#020713] to-transparent" />
        </div>

        <Navbar />

        <section className="relative z-10 mx-auto w-full max-w-[1304px] px-4 pb-12 pt-[7.2rem] sm:px-8 sm:pb-14 sm:pt-[8rem] lg:px-10 lg:pb-72 lg:pt-[9.2rem]">
          <div className="grid gap-8 [direction:ltr] lg:grid-cols-2 lg:items-start lg:gap-16">
            <div className="relative mx-auto h-[560px] w-full max-w-[700px] lg:h-[620px] order-2 lg:order-1">
              <div className="absolute left-[8%] top-[14%] w-[82%] overflow-hidden rounded-[24px] border border-[#29406c] bg-[linear-gradient(180deg,#0b1630_0%,#081126_100%)] shadow-[0_20px_42px_rgba(0,0,0,0.5)]">
                <div className="flex items-center justify-between border-b border-[#1d2b4d] px-4 py-3">
                  <div className="flex items-center gap-2 text-white/28">
                    <span className="h-2.5 w-2.5 rounded-[3px] border border-current" />
                    <span className="h-px w-3 bg-current" />
                  </div>
                  <p className="text-xs font-semibold tracking-[0.12em] text-[#5f739d]">aysel-tech.ts</p>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[var(--brand-primary)]" />
                    <span className="h-3 w-3 rounded-full bg-[#c8a329]" />
                    <span className="h-3 w-3 rounded-full bg-[#c2454f]" />
                  </div>
                </div>

                <div className="space-y-2.5 px-6 py-7 text-left font-mono text-[1.2rem] leading-[1.32] sm:text-[1.35rem]">
                  {heroCodeLines.map((_, index) => {
                    const line = visibleCodeLines[index] ?? "";
                    const showCursor = codePhase === "typing" && index === cursorLineIndex;

                    return (
                    <p key={`${index}-${heroCodeLines[index]}`} className="min-h-[1.32em]">
                      {renderCodeLine(line)}
                      {showCursor && (
                        <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-[var(--brand-primary-soft)]" />
                      )}
                    </p>
                    );
                  })}
                </div>

                <div className="flex items-center justify-end border-t border-[#1d2b4d] px-5 py-3 text-xs text-[#60729b]">
                  <span className="">Building...  Done ✓ </span>
                  <span className="text-[var(--brand-primary)] font-bold text-xl"> ●</span>
                </div>
              </div>

              <div className="absolute right-[3%] top-[30%] flex items-center gap-3 rounded-2xl border border-[#2b4069] bg-[#0a1326]/92 px-4 py-3 text-white shadow-[0_16px_32px_rgba(0,0,0,0.42)]">
                <div className="text-right leading-tight">
                  <p className="text-[1.04rem] font-bold">50+ مطور</p>
                  <p className="text-xs text-white/62">فريق متخصص</p>
                </div>
                <div className="flex -space-x-2">
                  {["from-[#e8cf7b] to-[#b88c35]", "from-[#f1d28a] to-[#8d5a2b]", "from-[#d4a843] to-[#7a4c22]", "from-[#caa14a] to-[#5f3f1e]"].map((tone, idx) => (
                    <span key={idx} className={`h-7 w-7 rounded-full border border-white/50 bg-gradient-to-br ${tone}`} />
                  ))}
                </div>
              </div>

              <div className="absolute left-0 top-[46%] rounded-[18px] border border-[#24457f] bg-[#0b1731]/92 px-4 py-3 text-right text-white shadow-[0_14px_28px_rgba(0,0,0,0.38)]">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-[1.3rem] font-bold leading-none">أداء فائق</p>
                    <p className="mt-1 text-xs text-[var(--brand-primary)]">99.9% Uptime</p>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b1530] text-[var(--brand-primary)]">
                    <BellIcon />
                  </span>
                </div>
              </div>

              <div className="absolute bottom-[18%] left-[10%] right-[10%] grid grid-cols-3 gap-2.5 lg:bottom-[20%]">
                {heroStats.map((item) => (
                  <article key={item.id} className="rounded-[20px] border border-[#1f2f4f] bg-[#0a1325]/90 px-3.5 py-3.5 text-center text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                    <span className="mx-auto mb-2.5 flex h-8 w-8 items-center justify-center rounded-[11px] border border-[var(--brand-primary-border-soft)] bg-[#0c1b38] text-[var(--brand-primary)]">
                      <HeroStatIcon kind={item.kind} />
                    </span>
                    <p className="text-[1.55rem] font-extrabold leading-none">{item.value}</p>
                    <p className="mt-1 text-[0.9rem] text-white/54">{item.label}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="[direction:rtl] text-right order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-primary-border-soft)] bg-[#050912]/90 px-6 py-2.5 text-[0.97rem] font-bold text-[var(--brand-primary-soft)]">
                <span>آيسل تك</span>
                <DotIcon />
              </div>

              <h1 className="mt-8 leading-[1.04]">
                <span className="block text-[clamp(1.64rem,4vw,3.32rem)] font-extrabold text-white">نبني لك</span>
                <span className="relative mt-1.5 inline-block whitespace-nowrap text-[clamp(1.76rem,4.25vw,3.55rem)] font-extrabold text-[var(--brand-primary)] after:absolute after:bottom-1 after:right-0 after:h-[3px] after:w-full after:rounded-full after:bg-gradient-to-l after:from-[var(--brand-primary)] after:to-[var(--brand-primary)]/15">
                  مستقبلك الرقمي
                </span>
              </h1>

              <p className="mt-6 max-w-[650px] text-[0.95rem] leading-relaxed text-white/57">
                من الفكرة إلى الإطلاق، نحول رؤيتك إلى منتجات رقمية استثنائية
                <br />
                بأحدث التقنيات وأعلى معايير الجودة.
              </p>

              <div className="mt-7 flex flex-row items-end gap-2.5">
                {heroChips.map((chip) => {
                  const isActive = Boolean(chip.active);

                  return (
                    <span
                      key={chip.id}
                      className={`inline-flex items-center gap-1 rounded-2xl border px-5 py-2.5 text-base font-semibold transition-colors ${
                        isActive
                          ? "border-[var(--brand-primary-border-soft)] bg-[#151013]/90 text-[var(--brand-primary-soft)] shadow-[0_10px_24px_rgba(0,0,0,0.45)]"
                          : "border-white/10 bg-white/[0.035] text-white/50"
                      }`}
                    >
                      <span>{chip.label}</span>
                      <span className={isActive ? "text-[var(--brand-primary)]" : "text-white/35"}>
                        <HeroChipIcon kind={chip.kind} />
                      </span>
                    </span>
                  );
                })}
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-start gap-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-2xl border border-[var(--brand-primary-border-soft)] bg-gradient-to-l from-[var(--brand-primary)] to-[var(--brand-primary-strong)] px-8 py-3 text-[1.3rem] font-bold text-white shadow-[0_16px_32px_rgba(0,0,0,0.45)]"
                >
                  <ArrowIcon />
                  <span>ابدأ مشروعك الآن</span>
                </button>

                <button type="button" className="rounded-2xl border border-white/20 bg-black/25 px-8 py-3 text-[1.22rem] font-semibold text-white/86">
                  شاهد أعمالنا
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-center text-xs text-white/40">
          <p className="mb-2">اكتشف المزيد</p>
          <div className="mx-auto flex h-9 w-5 items-start justify-center rounded-full border border-white/30 p-[6px]">
            <span className="mt-0.5 h-2.5 w-1 animate-[pulse_1.8s_ease-in-out_infinite] rounded-full bg-[var(--brand-primary)]" />
          </div>
        </div>
      </section>

      <section className="bg-[#f2f4f7] py-20 sm:py-24">
        <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[760px] text-center">
            <h2 className="text-[clamp(1.8rem,4.4vw,3.12rem)]  leading-[1.08] text-[#111827]">
              حلولنا <span className="text-[var(--brand-primary)]">التقنية</span>
            </h2>
            <p className="mt-4 text-[1.01rem] text-[#6d7788]">حلول متكاملة بأعلى المعايير لكل احتياجاتك الرقمية</p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-4">
            {solutions.map((item) => (
              <article key={item.id} className="rounded-[22px] border border-[#e2e6ee] bg-[#f5f7fb] px-6 py-7 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.92)]">
                <span className="mx-auto mb-5 inline-flex h-11 w-11 items-center justify-center rounded-[13px] border border-[#d8dee9] bg-[#f7f9fc] text-[#7f899a]">
                  <SolutionIcon kind={item.icon} />
                </span>
                <p className="text-[2.46rem]  leading-none text-[var(--brand-primary-strong)]">{item.value}</p>
                <p className="mt-1 text-xs font-semibold tracking-[0.04em] text-[#a0a8b7]">{item.unit}</p>
                <h3 className="mt-5 text-[1.72rem]  leading-none text-[#111827]">{item.title}</h3>
                <p className="mt-3 text-[0.93rem] leading-relaxed text-[#6e7889]">{item.description}</p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                  {item.badges.map((badge) => (
                    <span key={badge} className="rounded-full bg-[#edf1f7] px-3 py-1 text-[0.7rem] font-semibold text-[#9aa4b5]">
                      {badge}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button type="button" className="inline-flex items-center gap-2 rounded-2xl bg-[#030c20] px-8 py-3.5 text-[1.22rem]  text-white shadow-[0_12px_26px_rgba(3,12,32,0.24)]">
              <ArrowIcon />
              <span>ابدأ مشروعك</span>
            </button>
          </div>
        </div>
      </section>

      <section className="bg-[#f2f4f7] py-20 sm:py-24">
        <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[860px] text-center">
            <h2 className="text-[clamp(1.8rem,4.2vw,3.2rem)]  leading-[1.08] text-[#111827]">
              ما هي <span className="text-[var(--brand-primary)]">احتياجاتك؟</span>
            </h2>
            <p className="mt-4 text-[1.1rem] text-[#6f7888]">اختر المسار المناسب لوضعك الحالي واكتشف رحلتك معنا</p>
          </div>

          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {needs.map((item) => (
              <article key={item.id} className="rounded-[30px] border border-[#d5dbe5] bg-[#f6f8fb] px-7 py-8 text-right shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                <div className="flex justify-start">
                  <span className="inline-flex h-20 w-20 items-center justify-center rounded-[20px] bg-[#ebedf2] text-[#566173]">
                    <NeedCardIcon id={item.id} />
                  </span>
                </div>

                <h3 className="mt-6 text-[1.81rem]  leading-none text-[#1a2436]">{item.title}</h3>
                <p className="mt-4 text-[1.03rem] text-[#677283]">{item.subtitle}</p>

                <div className="mt-6 flex justify-start">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#ebedf2] px-4 py-1.5 text-[0.97rem]  text-[#5f6979]">
                    <ClockMiniIcon />
                    <span>{item.timeline}</span>
                  </span>
                </div>

                <details className="group mt-6">
                  <summary className="flex cursor-pointer list-none items-center justify-start gap-2 text-[1.68rem]  text-[#a0a9b8]">
                    <span className="transition-transform group-open:rotate-180">
                      <ChevronDownIcon />
                    </span>
                    <span>عرض الخطوات</span>
                  </summary>

                  <ul className="mt-4 space-y-2 text-[0.9rem] text-[#5d6778]">
                    {item.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-center justify-end gap-2">
                        <span>{bullet}</span>
                        <span className="text-[var(--brand-primary)]">✓</span>
                      </li>
                    ))}
                  </ul>
                </details>
              </article>
            ))}
          </div>

          <div className="mt-16 text-center">
            <h3 className="text-[clamp(1.89rem,4.6vw,3.9rem)]  leading-[1.08] text-[#111827]">
              نستخدم <span className="text-[var(--brand-primary)]">أحدث</span> التقنيات
            </h3>
            <p className="mt-3 text-[0.97rem] text-[#7f8899]">أدوات عالمية لضمان جودة وأداء استثنائي</p>

            <div className="mx-auto mt-10 flex max-w-[1020px] flex-wrap justify-center gap-3">
              {stack.map((item) => (
                <span key={item} className="inline-flex items-center gap-3 rounded-full border border-[#d4dbe7] bg-[#f7f9fc] px-5 py-2.5 text-[0.97rem] font-bold text-[#5b6576] shadow-[inset_0_1px_0_rgba(255,255,255,0.92)]">
                  <span>{item}</span>
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#d3dae6] bg-[#eef2f7] text-[#9aa3b2]">
                    <TechChipIcon />
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#eceff4] py-20 sm:py-24">
        <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[780px] text-center">
            <h2 className="text-[clamp(1.8rem,4.2vw,3.12rem)]  text-[#111827]">
              من الفكرة إلى <span className="text-[var(--brand-primary)]">الإطلاق</span>
            </h2>
            <p className="mt-3 text-[0.97rem] text-[#6e7888]">عملية واضحة ومنظمة تضمن نجاح مشروعك</p>
          </div>

          <div className="mt-12 grid gap-3 lg:grid-cols-5">
            {journey.map((step) => {
              const isActive = step.id === activeJourneyId;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveJourneyId(step.id)}
                  className={`relative min-h-[290px] rounded-[24px] border px-5 py-6 text-right transition-colors ${
                    isActive
                      ? "border-[#14244a] bg-[linear-gradient(180deg,#050f25_0%,#040c1d_100%)] text-white shadow-[0_24px_44px_rgba(3,10,25,0.32)]"
                      : "border-[#d3d9e3] bg-[#f5f7fb] text-[#111827]"
                  }`}
                >
                  <p className={`text-center text-[2.21rem]  leading-none ${isActive ? "text-[var(--brand-primary)]" : "text-[#d4d9e3]"}`}>{step.id}</p>

                  <span
                    className={`mx-auto mt-4 flex h-12 w-12 items-center justify-center rounded-[14px] border ${
                      isActive
                        ? "border-[var(--brand-primary-border-soft)] bg-[#151013] text-[var(--brand-primary)]"
                        : "border-[#e2e5ed] bg-[#eef1f6] text-[#a8afbd]"
                    }`}
                  >
                    <JourneyStepIcon id={step.id} />
                  </span>

                  <h3 className={`mt-5 text-center text-[1.68rem]  leading-none ${isActive ? "text-white" : "text-[#1d2433]"}`}>{step.title}</h3>
                  <p className={`mt-2 text-center text-[0.95rem] ${isActive ? "text-[var(--brand-primary-soft)]" : "text-[#9da5b4]"}`}>{step.duration}</p>
                  {isActive && <p className="mt-4 text-center text-[0.95rem] leading-relaxed text-white/72">{step.summary}</p>}

                  {isActive && (
                    <span className="absolute -bottom-[11px] left-1/2 h-0 w-0 -translate-x-1/2 border-l-[11px] border-r-[11px] border-t-[11px] border-l-transparent border-r-transparent border-t-[#040c1d]" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="relative mt-8 h-[4px] rounded-full bg-[#d7dce5]">
            <span
              className="absolute inset-y-0 rounded-full bg-[var(--brand-primary)]"
              style={{ width: `${journeySegmentWidth}%`, right: `${activeJourneyIndex * journeySegmentWidth}%` }}
            />
          </div>
        </div>
      </section>

      <section className="bg-[#f3f5f8] py-20 sm:py-24">
        <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[780px] text-center">
            <h2 className="text-[clamp(1.84rem,4.2vw,3.2rem)]  text-[#111827]">
              مشاريع <span className="text-[var(--brand-primary)]">غيرت</span> قواعد اللعبة
            </h2>
            <p className="mt-3 text-[0.97rem] text-[#6d7788]">نماذج واقعية من منتجات رقمية طورناها لقطاعات متعددة.</p>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {projectFilters.map((filter) => {
              const isActive = filter.id === activeFilter;

              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  className={`rounded-xl px-5 py-2.5 text-sm  transition-colors ${
                    isActive
                      ? "bg-[var(--brand-primary)] text-white shadow-[0_10px_20px_rgba(0,0,0,0.24)]"
                      : "bg-[#e7ebf2] text-[#5e687a]"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {filteredProjects.map((project) => (
              <article key={project.id} className="overflow-hidden rounded-[22px] border border-[#d5dce8] bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_14px_26px_rgba(15,23,42,0.08)]">
                <div className="relative h-[260px] overflow-hidden">
                  <Image src={project.image} alt={project.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <span className="absolute left-3 top-3 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white">{project.year}</span>
                </div>

                <div className="px-5 pb-5 pt-4 text-right">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="rounded-full bg-[var(--brand-primary-soft-bg)] px-3 py-1 text-xs font-semibold text-[var(--brand-primary-strong)]">
                      {project.categoryLabel}
                    </span>
                    <span className="text-xs text-[#8c95a6]">{project.id}</span>
                  </div>

                  <h3 className="text-[1.55rem]  leading-none text-[#111827]">{project.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#657081]">{project.description}</p>

                  <div className="mt-5 grid grid-cols-3 gap-3 border-t border-[#e8ecf3] pt-4 text-center [direction:ltr]">
                    {project.metrics.map((metric) => (
                      <div key={metric.label} className="[direction:rtl]">
                        <p className="text-[1.88rem]  leading-none text-[var(--brand-primary-strong)]">{metric.value}</p>
                        <p className="mt-1 text-xs text-[#778294]">{metric.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter brandSubtitle="TECH" />
    </main>
  );
}


