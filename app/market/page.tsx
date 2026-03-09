"use client";

import Image from "next/image";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import { useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiArrowUpRight,
  FiBarChart2,
  FiBell,
  FiChevronDown,
  FiClock,
  FiDollarSign,
  FiTrendingUp,
} from "react-icons/fi";

type StepId = "01" | "02" | "03" | "04" | "05";
type StoryId = "startup" | "ecommerce" | "b2b";

const chips = ["تحليل السوق", "استراتيجيات النمو", "تحسين المبيعات"];

const audience = [
  { title: "الشركات الناشئة", description: "تحتاج إلى استراتيجية نمو واضحة وتموضع قوي في السوق", badge: "+100 شركة ناشئة" },
  { title: "الشركات المتوسطة", description: "تريد التوسع والسيطرة على حصة أكبر من السوق", badge: "+150 شركة متوسطة" },
  { title: "الشركات الكبرى", description: "تبحث عن تحسين الأداء وزيادة الكفاءة التسويقية", badge: "+50 شركة كبرى" },
  { title: "رواد الأعمال", description: "يطلقون منتجات جديدة ويحتاجون خطة دخول السوق", badge: "+100 رائد أعمال" },
];

const services = [
  { id: "01", title: "أبحاث وتحليل السوق", description: "نغوص في بيانات سوقك ومنافسيك لنكشف الفرص الخفية.", metric: "85%", label: "دقة التوقعات" },
  { id: "02", title: "استراتيجية النمو", description: "خارطة طريق واضحة مبنية على بيانات حقيقية للنمو.", metric: "3x", label: "متوسط النمو" },
  { id: "03", title: "تحسين قمع المبيعات", description: "نحول الزوار إلى عملاء بتحسين كل نقطة في الرحلة.", metric: "+180%", label: "معدل التحول" },
  { id: "04", title: "تخطيط دخول السوق", description: "خطة مدروسة تقلل المخاطر وتسرّع النجاح.", metric: "95%", label: "نسبة النجاح" },
];

const steps: { id: StepId; title: string; duration: string; description: string; tags: string[] }[] = [
  { id: "01", title: "الاكتشاف", duration: "1-2 أسبوع", description: "تحليل السوق والجمهور والمنافسين لبناء أساس واضح.", tags: ["تحليل السوق", "دراسة المنافسين", "تحديد الأهداف"] },
  { id: "02", title: "الاستراتيجية", duration: "2-3 أسابيع", description: "نصمم استراتيجية نمو مخصصة تتضمن التموضع والرسائل والقنوات.", tags: ["استراتيجية النمو", "خطة التموضع", "خارطة الطريق"] },
  { id: "03", title: "التخطيط", duration: "1 أسبوع", description: "تحويل الاستراتيجية إلى خطة تنفيذ قابلة للقياس.", tags: ["الجدول الزمني", "توزيع الميزانية", "مؤشرات الأداء"] },
  { id: "04", title: "التنفيذ", duration: "4-8 أسابيع", description: "تنفيذ الحملات والمحتوى والتجارب التسويقية.", tags: ["إطلاق الحملات", "إدارة القنوات", "تحسين فوري"] },
  { id: "05", title: "التحسين", duration: "مستمر", description: "تحسين مستمر للأداء للوصول إلى نمو مستدام.", tags: ["تحليل النتائج", "اختبارات", "توسيع النمو"] },
];

const stories: Record<StoryId, { tab: string; stats: { value: string; label: string }[]; challenge: string; solution: string; quote: string; author: string; role: string }> = {
  startup: {
    tab: "شركة تقنية ناشئة",
    stats: [{ value: "450%", label: "نمو الإيرادات" }, { value: "12%", label: "حصة السوق" }, { value: "+2,500", label: "عملاء جدد" }],
    challenge: "دخول سوق جديد مع منافسة شديدة وميزانية محدودة.",
    solution: "استراتيجية تموضع فريدة وخطة دخول سوق مرحلية.",
    quote: "ساعدونا على تحقيق نمو لم نكن نتخيله. استراتيجيتهم كانت دقيقة وفعّالة.",
    author: "أحمد محمد",
    role: "المدير التنفيذي - شركة تقنية ناشئة",
  },
  ecommerce: {
    tab: "شركة تجارة إلكترونية",
    stats: [{ value: "320%", label: "نمو المبيعات" }, { value: "9%", label: "حصة السوق" }, { value: "+1,800", label: "عملاء جدد" }],
    challenge: "تكلفة اكتساب مرتفعة وتذبذب في التحويل.",
    solution: "تحسين قمع المبيعات وتوزيع ذكي للميزانية.",
    quote: "المؤشرات تحسنت بسرعة ووصلنا لنمو مستدام.",
    author: "سارة علي",
    role: "مديرة التسويق - شركة تجارة إلكترونية",
  },
  b2b: {
    tab: "شركة خدمات B2B",
    stats: [{ value: "210%", label: "نمو الإيرادات" }, { value: "7%", label: "حصة السوق" }, { value: "+900", label: "عملاء جدد" }],
    challenge: "ضعف توليد العملاء المؤهلين وطول دورة المبيعات.",
    solution: "إعادة تموضع الرسالة وبناء رحلة محتوى فعالة.",
    quote: "أصبحت عملية الحصول على فرص جديدة أكثر استقرارًا.",
    author: "محمد فهد",
    role: "مدير تطوير الأعمال - شركة خدمات B2B",
  },
};

const resultCards = [
  { title: "عائد الاستثمار", value: "4.5x", baseline: "1.2x", uplift: "+275%" },
  { title: "العملاء الجدد", value: "5,000", baseline: "500", uplift: "+900%" },
  { title: "الحصة السوقية", value: "17%", baseline: "2%", uplift: "+750%" },
  { title: "الإيرادات الشهرية", value: "200K", baseline: "50K", uplift: "+300%" },
];

const highlights = [
  { value: "+500", label: "مشروع ناجح" },
  { value: "98%", label: "رضا العملاء" },
  { value: "15+", label: "سنة خبرة" },
  { value: "3x", label: "متوسط النمو" },
];

const faq = [
  {
    id: "01",
    q: "ما الفرق بين خدمات ماركت وخدمات التسويق التقليدية؟",
    a: "خدمات ماركت تركز على الاستراتيجية الشاملة للنمو، وليس فقط التنفيذ التسويقي. نبدأ بتحليل عميق للسوق والمنافسين ثم نبني خطة متكاملة تشمل التموضع، التسعير، القنوات، وخطة النمو.",
  },
  { id: "02", q: "كم من الوقت يستغرق رؤية النتائج؟", a: "عادة تظهر مؤشرات أولية خلال 4-8 أسابيع، وتختلف النتائج حسب طبيعة السوق." },
  { id: "03", q: "هل تعملون مع الشركات الصغيرة أم الكبيرة فقط؟", a: "نعمل مع الشركات الناشئة والمتوسطة والكبرى بخطط مناسبة لكل مرحلة." },
  { id: "04", q: "ما هي تكلفة خدماتكم؟", a: "التكلفة تعتمد على نطاق العمل والأهداف، ونقدم عرضًا واضحًا بعد جلسة التشخيص." },
  { id: "05", q: "هل تضمنون ضمان على النتائج؟", a: "نضمن منهجية واضحة ومؤشرات أداء قابلة للقياس والتحسين المستمر." },
  { id: "06", q: "هل تنفذون الاستراتيجية أم تقدمون الخطة فقط؟", a: "نقدم الخيارين: بناء الخطة فقط أو الخطة مع التنفيذ الكامل." },
];

function Dot() {
  return <span className="h-2 w-2 rounded-full bg-[var(--brand-primary)]" />;
}

function Arrow() {
  return <FiArrowLeft className="text-[1rem]" aria-hidden />;
}

function IconGlyph() {
  return <FiTrendingUp className="text-[1.1rem]" aria-hidden />;
}

function ChevronIcon({ open }: { open: boolean }) {
  return <FiChevronDown className={`text-[0.9rem] ${open ? "" : "rotate-180"}`} aria-hidden />;
}

function TrendIcon() {
  return <FiArrowUpRight className="text-[0.95rem]" aria-hidden />;
}

function HeroPanelIcon({ index, active }: { index: number; active: boolean }) {
  const sizeClass = active ? "text-[1rem]" : "text-[0.95rem]";

  if (index === 0) {
    return <FiBell className={sizeClass} aria-hidden />;
  }

  if (index === 1) {
    return <FiBarChart2 className={sizeClass} aria-hidden />;
  }

  if (index === 2) {
    return <FiClock className={sizeClass} aria-hidden />;
  }

  return <FiDollarSign className={sizeClass} aria-hidden />;
}

export default function MarketPage() {
  const [activeStep, setActiveStep] = useState<StepId>("02");
  const [activeStory, setActiveStory] = useState<StoryId>("startup");
  const [activeFaq, setActiveFaq] = useState("01");

  const story = useMemo(() => stories[activeStory], [activeStory]);
  const stepIndex = steps.findIndex((s) => s.id === activeStep);

  return (
    <main className="bg-[#eceef2]">
      <section className="market-shell relative overflow-hidden">
        <div className="market-hero-bg" aria-hidden>
          <div className="market-hero-glow-main" />
          <div className="market-hero-glow-secondary" />
          <div className="market-hero-glow-left" />
          <div className="market-hero-vignette" />
          <div className="market-hero-fade-top" />
      
        </div>
        <Navbar />
        <section className="relative z-10 mx-auto w-full px-4 pb-12 pt-[7.2rem] sm:px-8 sm:pb-14 sm:pt-[8rem] lg:px-10 lg:pb-96 lg:pt-[9.2rem]">
          <div className="mx-auto grid max-w-[1304px] gap-8 [direction:ltr] lg:grid-cols-[506px_734px] lg:items-start lg:justify-between lg:gap-16">
            <div className="relative mx-auto h-[470px] w-full max-w-[506px] mt-13">
              <div className="absolute left-[4%] top-[15%] w-[90%] rounded-[28px] border border-white/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-8 shadow-[0_22px_48px_rgba(2,8,20,0.56)]">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--brand-primary)] text-white text-2xl">
                  <FiDollarSign aria-hidden />
                </div>
                <p className="mt-5 text-center text-[4rem] font-extrabold leading-none text-white">300%</p>
                <p className="mt-2 text-center text-[1.36rem] font-semibold text-white/72">نمو الإيرادات</p>
                <div className="mt-7 grid grid-cols-4 gap-2.5">
                  {[0, 1, 2, 3].map((i) => {
                    const isActive = i === 3;

                    return (
                      <span key={i} className={`flex h-12 items-center justify-center rounded-xl border ${isActive ? "border-[var(--brand-primary-border-soft)] bg-[var(--brand-primary-soft-bg)] text-[var(--brand-primary-soft)]" : "border-white/10 bg-white/[0.035] text-white/35"}`}>
                        <HeroPanelIcon index={i} active={isActive} />
                      </span>
                    );
                  })}
                </div>
                <div className="mt-5 h-1.5 rounded-full bg-white/12"><span className="block h-full w-[78%] rounded-full bg-[var(--brand-primary)]" /></div>
              </div>
              <div className="absolute right-[2%] top-[10%] rounded-[20px] bg-[var(--brand-primary)] px-4 py-3 text-center text-white shadow-[0_14px_30px_rgba(212,168,67,0.34)] after:absolute after:right-1/2 after:top-full after:h-8 after:w-px after:bg-[rgba(184,140,53,0.55)] after:content-['']">
                <p className="text-[2rem] font-extrabold leading-none">+500</p>
                <p className="mt-1 text-[0.95rem] font-semibold">مشروع ناجح</p>
              </div>
              <div className="absolute bottom-[8%] left-[0%] rounded-2xl border border-white/12 bg-[#1b263b]/88 px-4 py-3 shadow-[0_12px_26px_rgba(0,0,0,0.4)]">
                <div className="flex items-center gap-3">
                  <span className="text-[1.1rem] font-semibold text-white/82">150+ عميل سعيد</span>
                  <div className="flex -space-x-2">
                    {["/media-assets/avatar-2.png", "/media-assets/avatar-1.png", "/media-assets/avatar-3.png"].map((src) => (
                      <span key={src} className="relative h-8 w-8 overflow-hidden rounded-full border border-white/70">
                        <Image src={src} alt="عميل" fill className="object-cover" sizes="32px" />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="[direction:rtl] text-right">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-primary-border-soft)] bg-[#19130a]/72 px-5 py-2 text-[0.9rem] font-semibold text-[var(--brand-primary-soft)]"><span>قسم ماركت</span><Dot /></div>
              <h1 className="mt-7 text-[clamp(2.45rem,5.2vw,5rem)] font-extrabold leading-[1.06] text-white">
                <span className="block">نمو استراتيجي</span>
                <span className="market-highlight block text-[var(--brand-primary)]"> 
                  { "يحقق نتائج" }
                
                  <svg
                aria-hidden
                viewBox="0 0 100 14"
                preserveAspectRatio="none"
                className="pointer-events-none absolute -bottom-[0.24em] right-[-2%] h-[0.36em] w-[70%]"
              >
                <path d="M2,12 C30,3 70,3 98,12" fill="none" stroke="var(--brand-primary)" strokeWidth="1.9" strokeLinecap="round" />
              </svg>
                </span>
              </h1>
              <p className="mt-5 max-w-[630px] text-[1.06rem] leading-relaxed text-white/66">توقف عن التخمين. ابدأ بالنمو. نجمع بين رؤى السوق العميقة والاستراتيجيات المثبتة لمساعدتك على السيطرة على سوقك.</p>
              <div className="mt-7 flex flex-wrap justify-start gap-2.5">
                {chips.map((chip) => <span key={chip} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[0.96rem] font-semibold text-white/74"><Dot />{chip}</span>)}
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-start gap-3 lg:flex-nowrap">
                <button type="button" className="whitespace-nowrap rounded-2xl border border-[var(--brand-primary)] bg-gradient-to-l from-[var(--brand-primary)] to-[var(--brand-primary-strong)] px-7 py-2.5 text-[1.03rem] font-bold text-white">احصل على جلسة استراتيجية مجانية</button>
                <button type="button" className="whitespace-nowrap rounded-2xl border border-white/16 bg-[#0b1326]/75 px-7 py-2.5 text-[1.03rem] font-semibold text-white/90">عرض دراسات الحالة</button>
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

      <section className="market-who-section py-20 sm:py-24">
        <div className="mx-auto w-full max-w-[1220px] px-4 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[840px] text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-[#f3ead6] px-5 py-2 text-sm font-semibold text-[var(--brand-primary-strong)]"><span>لمن هذه الخدمة</span><Dot /></div>
            <h2 className="mt-6 text-[clamp(2.4rem,4.4vw,4.4rem)]  leading-[1.08] text-[#121a2b]">من يستفيد من خدماتنا؟</h2>
            <p className="mx-auto mt-4 max-w-[760px] text-[1.15rem] leading-relaxed text-[#7a8595]">نساعد الشركات في جميع المراحل على تحقيق أهداف النمو والتوسع</p>
          </div>
          <div className="mt-14 grid gap-5 lg:grid-cols-4">
            {audience.map((card) => (
              <article key={card.title} className="market-who-card px-6 pb-6 pt-7 text-center">
                <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--brand-primary)] text-white">
                  <IconGlyph />
                </span>
                <h3 className="text-[2rem] font-extrabold leading-none text-[#1b2435]">{card.title}</h3>
                <p className="mt-4 text-[1.02rem] leading-relaxed text-[#788395]">{card.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#eef2f4] px-4 py-1.5 text-sm font-semibold text-[#7b8596]">{card.badge}</span>
              </article>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <span className="rounded-2xl bg-[#edf0f3] px-8 py-3 text-[1.18rem] text-[#6f7989]">إذا كان حجم شركتك، لدينا الحلول المناسبة</span>
            <button type="button" className="rounded-2xl bg-gradient-to-l from-[var(--brand-primary)] to-[var(--brand-primary-strong)] px-8 py-3 text-[1.12rem] font-bold text-white">احجز استشارة مجانية</button>
          </div>
        </div>
      </section>

      <section className="market-services-section py-20 sm:py-24">
        <div className="mx-auto w-full max-w-[1220px] px-4 sm:px-8 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
            <div className="text-right">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#f3ead6] px-5 py-2 text-sm font-semibold text-[var(--brand-primary-strong)]"><span>خدماتنا</span><Dot /></div>
              <h2 className="mt-5 text-[clamp(2.5rem,4.5vw,4.2rem)] font-extrabold leading-[1.05] text-[#121a2b]">خدمات ماركت</h2>
            </div>
            <p className="text-right text-[1.15rem] leading-relaxed text-[#7a8595]">أربع خدمات أساسية مصممة بعناية لتغطّي كل ما تحتاجه لتسريع نموك والسيطرة على سوقك.</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {services.map((card) => (
              <article key={card.id} className="market-service-card relative px-6 pb-6 pt-5 text-right">
                <div className="mb-6 flex items-start justify-between [direction:ltr]"><span className="text-[3.4rem] font-extrabold leading-none text-[#cfd6df]">{card.id}</span><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f6ecd9] text-[var(--brand-primary-strong)]"><IconGlyph /></span></div>
                <h3 className="text-[2rem] font-extrabold leading-none text-[#1c2536]">{card.title}</h3>
                <p className="mt-4 text-[1.02rem] leading-relaxed text-[#738092]">{card.description}</p>
                <div className="mt-7 flex items-center justify-between [direction:ltr]"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e7ebf1] text-[#8e98a8]"><Arrow /></span><div className="text-right [direction:rtl]"><p className="text-[2rem] font-extrabold leading-none text-[var(--brand-primary-strong)]">{card.metric}</p><p className="mt-1 text-sm text-[#8f99aa]">{card.label}</p></div></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="market-how-section py-20 sm:py-24">
        <div className="mx-auto w-full max-w-[1220px] px-4 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[840px] text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-[#f3ead6] px-5 py-2 text-sm font-semibold text-[var(--brand-primary-strong)]"><span>طريقة العمل</span><Dot /></div>
            <h2 className="mt-6 text-[clamp(2.5rem,4.5vw,4.2rem)] font-extrabold leading-[1.05] text-[#121a2b]">كيف نعمل معك</h2>
            <p className="mx-auto mt-4 max-w-[760px] text-[1.15rem] leading-relaxed text-[#7a8595]">خمس خطوات بسيطة ومنهجية توصلك من الفكرة إلى النتائج</p>
          </div>
          <div className="mx-auto mt-12 max-w-[980px] space-y-3">
            {steps.map((step) => {
              const isActive = step.id === activeStep;
              return (
                <article key={step.id} className={`market-accordion-item px-6 py-5 ${isActive ? "market-accordion-item-active py-6" : ""}`}>
                  <button type="button" onClick={() => setActiveStep(step.id)} className="flex w-full items-center justify-between gap-4 [direction:ltr]">
                    <div className="flex items-center gap-4">
                      <span className={`flex h-8 w-8 items-center justify-center rounded-full ${isActive ? "bg-[#0b1930] text-white/75" : "bg-[#e9edf2] text-[#a1aab8]"}`}>
                        <ChevronIcon open={isActive} />
                      </span>
                      <span className={`rounded-full px-4 py-1.5 text-sm font-semibold ${isActive ? "bg-[#21180b] text-[var(--brand-primary-soft)]" : "bg-[#e9edf2] text-[#a1aab8]"}`}>{step.duration}</span>
                    </div>
                    <div className="flex items-center gap-4 [direction:rtl]">
                      <h3 className={`text-[2rem] font-extrabold leading-none ${isActive ? "text-white" : "text-[#1f2937]"}`}>{step.title}</h3>
                      <span className={`inline-flex h-12 min-w-12 items-center justify-center rounded-xl px-2 text-[1.05rem] font-bold ${isActive ? "bg-[var(--brand-primary)] text-white" : "bg-[#e9edf2] text-[#9aa4b4]"}`}>{step.id}</span>
                    </div>
                  </button>
                  {isActive && (
                    <div className="mt-6 border-t border-white/10 pt-5 text-center">
                      <p className="text-[1.02rem] leading-relaxed text-[#9aa8bc]">{step.description}</p>
                      <div className="mt-5 flex flex-wrap justify-center gap-2.5">
                        {step.tags.map((tag) => <span key={tag} className="inline-flex items-center gap-2 rounded-full border border-[#2b3a52] bg-[#0b1528] px-4 py-1.5 text-sm font-semibold text-[#aeb8c8]"><Dot />{tag}</span>)}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
          <div className="mt-8 flex items-center justify-center gap-3">{[0, 1, 2, 3, 4].map((dot) => <span key={dot} className={`h-[6px] rounded-full ${dot === stepIndex ? "w-10 bg-[var(--brand-primary)]" : "w-6 bg-[#d5dbe3]"}`} />)}</div>
          <div className="mt-12 text-center"><button type="button" className="inline-flex min-w-[320px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-[var(--brand-primary)] to-[var(--brand-primary-strong)] px-9 py-3.5 text-[1.2rem] font-bold text-white"><Arrow />جاهز للبدء؟ احجز جلستك المجانية</button></div>
        </div>
      </section>



      <section className="market-stats-section py-20 sm:py-24">
        <div className="mx-auto w-full max-w-[1220px] px-4 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[840px] text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[var(--brand-primary-border-soft)] bg-[#1a1308]/45 px-5 py-2 text-sm font-semibold text-[var(--brand-primary-soft)]"><span>نتائج حقيقية</span><Dot /></div>
            <h2 className="mt-6 text-[clamp(2.4rem,4.4vw,4.4rem)] leading-[1.08] text-white">أرقام تتحدث عن نفسها</h2>
            <p className="mx-auto mt-4 max-w-[760px] text-[1.15rem] leading-relaxed text-white/62">نتائج ملموسة حققناها لعملائنا</p>
          </div>
          <div className="mt-14 grid gap-5 [direction:ltr] md:grid-cols-2 xl:grid-cols-4">{resultCards.map((card) => <article key={card.title} className="market-stat-card rounded-[22px] px-6 pb-6 pt-6 text-right [direction:rtl]"><p className="text-[1.55rem] font-semibold text-[#aab4c7]/72">{card.title}</p><div className="mt-4 flex items-center justify-end gap-3"><span className="text-[2.7rem] font-extrabold leading-none text-white">{card.value}</span><span className="text-[var(--brand-primary)]"><Arrow /></span><span className="text-[1.9rem] font-bold leading-none text-[#647490]/62 line-through decoration-[2px]">{card.baseline}</span></div><div className="mt-5"><span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--brand-primary-border-soft)] bg-[#241a0c] px-4 py-1.5 text-[1.08rem] font-semibold text-[var(--brand-primary-soft)]"><TrendIcon />{card.uplift}</span></div></article>)}</div>
          <div className="mt-12 rounded-[22px] border border-[var(--brand-primary-border-soft)] bg-[#020b1c]/86 px-6 py-8 sm:px-8"><div className="grid gap-8 [direction:ltr] sm:grid-cols-2 lg:grid-cols-4">{highlights.map((h) => <div key={h.label} className="text-center [direction:rtl]"><p className="text-[2.6rem] font-extrabold leading-none text-white">{h.value}</p><p className="mt-2 text-[1.08rem] font-semibold text-[#a8b2c3]/62">{h.label}</p></div>)}</div></div>
        </div>
      </section>

            <section className="market-stories-section py-20 sm:py-24">
        <div className="mx-auto w-full max-w-[1220px] px-4 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[840px] text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-[#f3ead6] px-5 py-2 text-sm text-[var(--brand-primary-strong)]"><span>دراسات الحالة</span><Dot /></div>
            <h2 className="mt-6 text-[clamp(2.4rem,4.4vw,4.4rem)]  leading-[1.08] text-[#111827]">قصص نجاح عملائنا</h2>
            <p className="mx-auto mt-4 max-w-[760px] text-[1.15rem] leading-relaxed text-[#7b8594]">نتائج حقيقية حققناها لشركات في مختلف الصناعات</p>
          </div>
          <div className="mt-11 flex flex-wrap items-center justify-center gap-3">
            {Object.entries(stories).map(([id, s]) => (
              <button key={id} type="button" onClick={() => setActiveStory(id as StoryId)} className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[1.02rem] font-semibold ${activeStory === id ? "bg-[#040d21] text-white" : "bg-[#eceff3] text-[#596273]"}`}>
                {s.tab}<Dot />
              </button>
            ))}
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">{story.stats.map((s) => <article key={s.label} className="market-story-card rounded-[18px] px-6 py-6 text-center"><p className="text-[2.7rem] font-extrabold leading-none text-[var(--brand-primary-strong)]">{s.value}</p><p className="mt-3 text-[1.15rem] font-semibold text-[#6c7686]">{s.label}</p></article>)}</div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <article className="market-story-card rounded-[18px] px-6 py-6 text-right"><h3 className="mb-3 text-[1.7rem] font-extrabold text-[#1f2937]">التحدي</h3><p className="text-[1.1rem] leading-relaxed text-[#677182]">{story.challenge}</p></article>
            <article className="market-story-card rounded-[18px] px-6 py-6 text-right"><h3 className="mb-3 text-[1.7rem] font-extrabold text-[#1f2937]">الحل</h3><p className="text-[1.1rem] leading-relaxed text-[#677182]">{story.solution}</p></article>
          </div>
          <article className="mt-8 rounded-[20px] bg-[linear-gradient(180deg,#020c1f_0%,#010817_100%)] px-6 py-8 text-white sm:px-8">
            <p className="text-[1.6rem] leading-[1.5] text-right">&ldquo;{story.quote}&rdquo;</p>
            <div className="mt-7 flex items-center justify-end gap-3">
              <div className="text-right"><p className="text-[1.18rem] font-bold text-white">{story.author}</p><p className="text-[1rem] text-white/55">{story.role}</p></div>
              <span className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-white/70"><Image src="/media-assets/avatar-4.png" alt={story.author} fill className="object-cover" sizes="56px" /></span>
            </div>
          </article>
        </div>
      </section>

      <section className="market-faq-section py-20 sm:py-24">
        <div className="mx-auto w-full max-w-[1220px] px-4 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[820px] text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-[#f3ead6] px-5 py-2 text-sm font-semibold text-[var(--brand-primary-strong)]"><span>الأسئلة الشائعة</span><Dot /></div>
            <h2 className="mt-6 text-[clamp(2.4rem,4.4vw,4.4rem)]  leading-[1.08] text-[#111827]">أسئلة قد تهمك</h2>
            <p className="mx-auto mt-4 max-w-[760px] text-[1.15rem] leading-relaxed text-[#798394]">إجابات على الأسئلة الأكثر شيوعًا حول خدماتنا</p>
          </div>
          <div className="mx-auto mt-12 max-w-[980px] space-y-4">
            {faq.map((item) => {
              const isOpen = item.id === activeFaq;
              return (
                <article key={item.id} className={`market-faq-item px-6 py-4 sm:px-7 ${isOpen ? "market-faq-item-open py-5 sm:py-6" : ""}`}>
                  <button type="button" onClick={() => setActiveFaq(item.id)} className="flex w-full items-center justify-between gap-4 [direction:ltr]" aria-expanded={isOpen}>
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${isOpen ? "bg-[var(--brand-primary)] text-white" : "bg-[#e8ebf0] text-[#8d97a8]"}`}>
                      <ChevronIcon open={isOpen} />
                    </span>
                    <div className="flex items-center gap-4 [direction:rtl]"><span className={`inline-flex h-12 min-w-12 items-center justify-center rounded-xl px-2 text-[1.05rem] ${isOpen ? "bg-[var(--brand-primary)] text-white" : "bg-[#e8ebf0] text-[#8f99aa]"}`}>{item.id}</span><h3 className={`text-[1.65rem]  leading-none ${isOpen ? "text-[var(--brand-primary-strong)]" : "text-[#1f2937]"}`}>{item.q}</h3></div>
                  </button>
                  {isOpen && <p className="mx-auto mt-5 max-w-[92%] border-t border-[#ecdcb7] pt-4 text-center text-[1.15rem] leading-relaxed text-[#6f798a]">{item.a}</p>}
                </article>
              );
            })}
          </div>
          <div className="mx-auto mt-12 max-w-[980px] rounded-[18px] border border-[var(--brand-primary-border-soft)] bg-[#f6ecd9] px-6 py-9 text-center"><p className="text-[1.25rem] font-semibold text-[#5e6878]">لديك سؤال آخر؟ تواصل معنا مباشرة</p><button type="button" className="mt-5 rounded-2xl bg-gradient-to-l from-[var(--brand-primary)] to-[var(--brand-primary-strong)] px-12 py-3 text-[1.2rem] font-bold text-white">احجز استشارة مجانية</button></div>
        </div>
      </section>

      <SiteFooter brandSubtitle="MARKETING" />
    </main>
  );
}
