"use client";

import Image from "next/image";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import { useState, type ReactNode } from "react";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="m6 4.8 5.2 3.2L6 11.2V4.8Z" fill="currentColor" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M12 8H4.4M4.4 8l2.8-2.8M4.4 8l2.8 2.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M13.2 9H5.4M5.4 9l3-3M5.4 9l3 3" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M4.8 9h7.8m0 0-3-3m3 3-3 3" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 5.5v13M5.5 12h13" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="m4.5 6.2 3.5 3.6 3.5-3.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="m4.5 9.8 3.5-3.6 3.5 3.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type GoalId = "brand" | "reach" | "sales";

interface ProjectCardItem {
  year: string;
  tag: string;
  client: string;
  title: string;
  statValue: string;
  statLabel: string;
  image: string;
  tone: "dark" | "light";
  highlighted?: boolean;
}

interface JourneyStep {
  id: string;
  title: string;
  duration: string;
  description: string;
  short: string;
  icon: ReactNode;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const chips = ["تحليل السوق", "استراتيجية النمو", "تحسين المبيعات"];

const goalTabs: Array<{ id: GoalId; label: string }> = [
  { id: "sales", label: "زيادة المبيعات" },
  { id: "reach", label: "زيادة الوصول" },
  { id: "brand", label: "بناء العلامة" },
];

const goalContent: Record<GoalId, { title: string; subtitle: string; metric: string; metricLabel: string }> = {
  brand: { title: "بناء العلامة", subtitle: "هوية بصرية متكاملة تترك انطباعاً دائماً", metric: "+150", metricLabel: "علامة" },
  reach: { title: "زيادة الوصول", subtitle: "محتوى بصري يستهدف جمهورك ويزيد انتشارك", metric: "+2.3M", metricLabel: "وصول" },
  sales: { title: "زيادة المبيعات", subtitle: "حملات إعلانية مدروسة ترفع معدل التحويل", metric: "+320%", metricLabel: "عائد" },
};

const projectCards: ProjectCardItem[] = [
  { year: "2024", tag: "إنتاج فيديو", client: "إيليجانس", title: "فيديو أزياء سينمائي", statValue: "+5M", statLabel: "مشاهدة", image: "/media-assets/project-fashion.png", tone: "dark" },
  { year: "2024", tag: "هوية بصرية", client: "لافيستا", title: "هوية مطعم فاخر", statValue: "+180%", statLabel: "نمو المتابعين", image: "/media-assets/project-brand.png", tone: "light" },
  { year: "2024", tag: "فيديو ترويجي", client: "تك إنوفيشن", title: "حملة إطلاق منتج تقني", statValue: "+250%", statLabel: "زيادة المبيعات", image: "/media-assets/project-phone.png", tone: "dark", highlighted: true },
  { year: "2025", tag: "إنتاج فيديو", client: "لوكس", title: "فيلم ترويجي لعطر فاخر", statValue: "+3.2M", statLabel: "مشاهدة", image: "/media-assets/project-cinema-2.png", tone: "dark" },
  { year: "2025", tag: "هوية بصرية", client: "إيكو هوم", title: "هوية مشروع عقاري", statValue: "+140%", statLabel: "نمو الوصول", image: "/media-assets/project-brand-2.png", tone: "light" },
];

const whyStats = [
  { value: "320%", label: "متوسط العائد" },
  { value: "98%", label: "رضا العملاء" },
  { value: "200+", label: "عميل سعيد" },
  { value: "500+", label: "مشروع ناجح" },
];

const whyFeatures = [
  { title: "إبداع لا محدود", desc: "نفكر خارج الصندوق لكل مشروع" },
  { title: "فريق محترف", desc: "خبراء في جميع مجالات الإعلام والتسويق" },
  { title: "نتائج سريعة", desc: "نحقق أهدافك في أقصر وقت ممكن" },
  { title: "دعم مستمر", desc: "نبقى معك في كل خطوة من الرحلة" },
];

const journeySteps: JourneyStep[] = [
  { id: "01", title: "الاكتشاف", duration: "1-2 يوم", short: "1-2 يوم", description: "نفهم مشروعك، جمهورك، وأهدافك لنرسم نقطة الانطلاق.", icon: "01" },
  { id: "02", title: "التخطيط", duration: "2-3 أيام", short: "2-3 أيام", description: "نضع خطة محتوى واضحة ورسائل دقيقة لكل قناة.", icon: "02" },
  { id: "03", title: "الإبداع", duration: "1-2 أسابيع", short: "1-2 أسابيع", description: "نصنع محتوى بصري مذهل يعكس هوية علامتك ويجذب جمهورك.", icon: "03" },
  { id: "04", title: "الإطلاق", duration: "مستمر", short: "مستمر", description: "ننشر ونفعّل الحملات في الوقت المناسب لتحقيق أفضل أثر.", icon: "04" },
  { id: "05", title: "التحسين", duration: "شهري", short: "شهري", description: "نحلّل الأداء ونحسّن النتائج باستمرار.", icon: "05" },
];

const faqItems: FaqItem[] = [
  { id: "01", question: "ما الفرق بين خدمات ماركت وخدمات التسويق التقليدية؟", answer: "خدمات ماركت تركز على الاستراتيجية الشاملة للنمو، وليس فقط التنفيذ التسويقي. نبدأ بتحليل عميق للسوق والمنافسين، ثم نبني استراتيجية متكاملة تشمل التموضع، التسعير، القنوات، وخطة النمو." },
  { id: "02", question: "كم من الوقت يستغرق رؤية النتائج؟", answer: "تظهر النتائج الأولية عادة خلال 2-6 أسابيع بحسب نوع الخدمة وحجم المشروع." },
  { id: "03", question: "هل تعملون مع الشركات الصغيرة أم الكبيرة فقط؟", answer: "نعمل مع الشركات الناشئة، المتوسطة، والكبيرة مع خطط تناسب كل مرحلة." },
  { id: "04", question: "ما هي تكلفة خدماتكم؟", answer: "تعتمد التكلفة على نطاق المشروع. نشاركك عرضاً واضحاً بعد جلسة الاكتشاف." },
  { id: "05", question: "هل تقدمون ضمان على النتائج؟", answer: "نضمن الجودة والتنفيذ وفق الخطة، ونبني مؤشرات أداء واضحة للمتابعة والتحسين." },
  { id: "06", question: "هل تنفذون الاستراتيجية أم تقدمون الخطة فقط؟", answer: "نقدّم الخيارين: خطة استراتيجية فقط، أو خطة مع تنفيذ كامل عبر فريقنا." },
];

export default function MediaPage() {
  const [activeGoal, setActiveGoal] = useState<GoalId>("brand");
  const [activeProject, setActiveProject] = useState(1);
  const [activeJourneyId, setActiveJourneyId] = useState("03");
  const [activeFaqId, setActiveFaqId] = useState("01");

  const goalData = goalContent[activeGoal];
  const activeJourney = journeySteps.find((step) => step.id === activeJourneyId) ?? journeySteps[2];
  const activeJourneyIndex = Math.max(0, journeySteps.findIndex((step) => step.id === activeJourneyId));
  const progressWidth = `${((activeProject + 1) / projectCards.length) * 100}%`;

  return (
    <main className="bg-[var(--brand-bg)]">
      <section className="media-shell relative min-h-screen overflow-hidden">
        <Navbar />

        <section className="relative z-10 mx-auto flex w-full max-w-[1220px] flex-col gap-12 px-4 pb-14 pt-[7.8rem] sm:px-8 sm:pt-[8.8rem] lg:flex-row lg:items-center lg:gap-10 lg:px-10 lg:pt-[10.2rem]">
          <div className="order-2 w-full lg:order-2 lg:w-[52%]">
            <div className="relative mx-auto h-[560px] max-w-[640px] sm:h-[620px] [direction:ltr]">
              <span className="absolute left-[6%] top-[30%] h-20 w-20 rounded-full border border-[rgba(212,168,67,0.45)] sm:h-24 sm:w-24" />
              <span className="absolute left-0 top-[58%] h-24 w-24 rounded-full border border-[rgba(184,140,53,0.35)] sm:h-28 sm:w-28" />

              <div className="absolute left-[10%] top-[14%] inline-flex items-center gap-2 rounded-2xl border border-white/16 bg-[#1a1c23]/82 px-4 py-2.5 text-white shadow-[0_12px_24px_rgba(0,0,0,0.36)]">
                <span className="text-sm font-semibold">+50 جائزة</span>
                <span className="h-2 w-2 rounded-full bg-[var(--brand-primary)]" />
              </div>

              <article className="media-card absolute right-[3%] top-[10%] h-[58%] w-[64%]">
                <Image src="/media-assets/hero-camera.png" alt="إنتاج سينمائي" fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-black/10" />
                <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm">
                  <PlayIcon />
                </span>
                <div className="absolute bottom-4 right-4 text-right">
                  <span className="inline-flex rounded-full bg-[rgba(212,168,67,0.88)] px-3 py-1 text-xs font-semibold text-white">فيديو</span>
                  <p className="mt-2 text-[1.59rem] font-extrabold leading-none text-white">إنتاج سينمائي</p>
                </div>
              </article>

              <article className="media-card-soft absolute left-0 top-[54%] h-[34%] w-[54%]">
                <Image src="/media-assets/hero-social.png" alt="محتوى رقمي" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-4 right-4 text-right">
                  <span className="inline-flex rounded-full bg-[rgba(212,168,67,0.88)] px-3 py-1 text-xs font-semibold text-white">سوشيال</span>
                  <p className="mt-2 text-[1.38rem] font-extrabold leading-none text-white">محتوى رقمي</p>
                </div>
              </article>

              <article className="media-card-soft absolute right-[14%] top-[63%] h-[35%] w-[46%]">
                <Image src="/media-assets/hero-brand.png" alt="هوية بصرية" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/12 to-transparent" />
                <div className="absolute bottom-4 right-4 text-right">
                  <span className="inline-flex rounded-full bg-[rgba(212,168,67,0.88)] px-3 py-1 text-xs font-semibold text-white">تصميم</span>
                  <p className="mt-2 text-[1.4rem] font-extrabold leading-none text-white">هوية بصرية</p>
                </div>
              </article>
            </div>
          </div>

          <div className="order-1 w-full text-right lg:order-1 lg:w-[48%]">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-[#181a21]/70 px-5 py-2 text-sm font-semibold text-white/76">
              <span className="h-2 w-2 rounded-full bg-[var(--brand-primary)]" />
              <span>إنتاج آيسل ميديا</span>
            </div>

            <h1 className="mt-8 leading-[1.08] text-white">
              <span className="block text-[clamp(1.84rem,4.9vw,3.86rem)] font-extrabold">نصنع محتوى</span>
              <span className="mt-1 block text-[clamp(1.84rem,4.9vw,3.86rem)] font-extrabold">يُحدث فرقاً</span>
            </h1>

            <p className="mt-8 max-w-[640px] text-[1.04rem] leading-relaxed text-white/58">
              من الفكرة إلى الشاشة، نحول رؤيتك إلى قصص بصرية تأسر الجمهور وتبني علامتك التجارية.
            </p>

            <div className="mt-8 flex flex-wrap justify-start gap-3">
              {chips.map((chip) => (
                <span key={chip} className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/[0.035] px-4 py-2 text-[0.87rem] font-semibold text-white/82">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-primary)]" />
                  <span>{chip}</span>
                </span>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button type="button" className="inline-flex items-center gap-2 rounded-2xl border border-[var(--brand-primary-strong)] bg-gradient-to-l from-[var(--brand-primary)] to-[var(--brand-primary-strong)] px-8 py-3 text-[0.95rem] font-bold text-white shadow-[0_14px_30px_rgba(212,168,67,0.32)]">
                <ArrowIcon />
                <span>ابدأ مشروعك</span>
              </button>

              <button type="button" className="inline-flex items-center gap-3 rounded-2xl border border-white/22 bg-black/30 px-6 py-3 text-[0.95rem] font-semibold text-white/92">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/12">
                  <PlayIcon />
                </span>
                <span>شاهد أعمالنا</span>
              </button>
            </div>

            <div className="mt-10 grid max-w-[640px] grid-cols-3 gap-4 border-t border-white/12 pt-7 [direction:ltr]">
              <div className="text-center [direction:rtl]"><p className="text-[1.97rem] font-extrabold leading-none text-white">98%</p><p className="mt-2 text-[0.95rem] text-white/54">رضا</p></div>
              <div className="text-center [direction:rtl]"><p className="text-[1.97rem] font-extrabold leading-none text-white">200+</p><p className="mt-2 text-[0.95rem] text-white/54">عميل</p></div>
              <div className="text-center [direction:rtl]"><p className="text-[1.97rem] font-extrabold leading-none text-white">500+</p><p className="mt-2 text-[0.95rem] text-white/54">مشروع</p></div>
            </div>
          </div>
        </section>

        <div className="pointer-events-none absolute bottom-5 left-1/2 z-10 -translate-x-1/2 text-center text-xs text-white/35">
          <p className="mb-2">اكتشف المزيد</p>
          <div className="mx-auto flex h-10 w-6 items-start justify-center rounded-full border border-white/25 p-1">
            <span className="mt-1 h-2.5 w-1.5 animate-[pulse_1.8s_ease-in-out_infinite] rounded-full bg-[var(--brand-primary)]" />
          </div>
        </div>
      </section>

      <section className="bg-[#eef0f4] py-20 sm:py-24">
        <div className="mx-auto w-full max-w-[1220px] px-4 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[760px] text-center">
            <h2 className="text-[clamp(1.68rem,4vw,2.87rem)] font-extrabold leading-[1.1] text-[#121a2b]">ما هو هدفك؟</h2>
            <p className="mt-4 text-[1rem] text-[#6d7687]">اختر هدفك ودعنا نساعدك في تحقيقه</p>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {goalTabs.map((tab) => {
              const isActive = tab.id === activeGoal;
              return (
                <button key={tab.id} type="button" onClick={() => setActiveGoal(tab.id)} className={`inline-flex items-center gap-2 rounded-2xl px-7 py-2.5 text-[0.95rem] font-semibold transition-colors ${isActive ? "bg-[#0d1731] text-white" : "bg-[#e5e7ec] text-[#6a7383]"}`}>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <article className="mx-auto mt-9 max-w-[1100px] rounded-[26px] bg-[#e4e6eb] px-8 py-14 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] sm:px-10 sm:py-16">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[26px] bg-gradient-to-b from-[var(--brand-primary)] to-[var(--brand-primary-strong)] text-white shadow-[0_16px_26px_rgba(212,168,67,0.28)]">
              <span className="text-3xl">◎</span>
            </div>
            <h3 className="mt-8 text-[2.38rem] font-extrabold leading-none text-[#121a2b]">{goalData.title}</h3>
            <p className="mt-5 text-[1.3rem] text-[#6d7687]">{goalData.subtitle}</p>
            <div className="mx-auto mt-8 inline-flex items-center gap-3 rounded-3xl bg-[#f3f4f6] px-8 py-3.5 shadow-[0_10px_18px_rgba(15,23,42,0.08)]">
              <span className="text-[1.97rem] font-extrabold leading-none text-[#121a2b]">{goalData.metric}</span>
              <span className="text-[1.12rem] text-[#7b8392]">{goalData.metricLabel}</span>
            </div>
          </article>

          <div className="mt-10 text-center"><button type="button" className="rounded-full bg-[#0d1731] px-11 py-3 text-[1.03rem] font-bold text-white">ابدأ مشروعك الآن</button></div>
        </div>
      </section>

      <section className="media-services-section py-20 sm:py-24">
        <div className="mx-auto w-full max-w-[1220px] px-4 sm:px-8 lg:px-10">
          <div className="grid gap-8 [direction:ltr] lg:grid-cols-2 lg:items-start">
            <div className="text-right lg:col-start-2"><span className="inline-flex rounded-full bg-[#f2ead8] px-4 py-1.5 text-sm font-semibold text-[var(--brand-primary-strong)]">خدماتنا</span><h2 className="mt-4 text-[clamp(1.8rem,4.6vw,3.28rem)] font-extrabold leading-[1.08] text-[#121a2b]">ماذا نقدم؟</h2></div>
            <p className="max-w-[560px] text-right text-[1.01rem] leading-relaxed text-[#717b8a] lg:col-start-1 lg:pt-6">مجموعة متكاملة من الخدمات الإبداعية لتحقيق جميع أهدافك التسويقية</p>
          </div>
          <div className="mt-10 grid gap-5 [direction:ltr] lg:grid-cols-12">
            <article className="media-service-tile media-service-purple min-h-[240px] [direction:rtl] lg:col-span-3">
              <div className="flex items-start justify-between"><p className="text-[2.38rem] font-extrabold leading-none text-white">98%</p><span className="text-white/80">◎</span></div>
              <p className="mt-1 text-[1.17rem] text-white/82">رضا</p>
              <div className="mt-6 text-right"><p className="text-[1.01rem] font-semibold text-white/72">هوية مميزة</p><h3 className="mt-1 text-[1.72rem] font-extrabold leading-none text-white">التصميم</h3><p className="mt-2.5 text-[0.93rem] leading-relaxed text-white/82">نصمم هوية بصرية تعكس شخصية علامتك</p></div>
            </article>

            <article className="media-service-tile media-service-purple min-h-[240px] [direction:rtl] lg:col-span-4">
              <div className="flex items-start justify-between"><p className="text-[2.38rem] font-extrabold leading-none text-white">+200</p><span className="text-white/80">◉</span></div>
              <p className="mt-1 text-[1.17rem] text-white/82">حساب</p>
              <div className="mt-6 text-right"><p className="text-[1.01rem] font-semibold text-white/72">حضور رقمي قوي</p><h3 className="mt-1 text-[1.72rem] font-extrabold leading-none text-white">السوشيال ميديا</h3><p className="mt-2.5 text-[0.93rem] leading-relaxed text-white/82">نبني لك حضوراً مؤثراً على جميع المنصات</p></div>
            </article>

            <article className="media-service-tile relative min-h-[520px] overflow-hidden [direction:rtl] lg:col-span-5 lg:row-span-2">
              <Image src="/media-assets/service-video.png" alt="إنتاج الفيديو" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
              <div className="relative z-10 flex h-full flex-col justify-between"><div className="flex items-start justify-between"><span className="text-white">◼</span><p className="text-[1.04rem] font-semibold text-[var(--brand-primary-soft)]">قصص سينمائية</p></div><div className="text-right"><h3 className="text-[2.21rem] font-extrabold leading-none text-white">إنتاج الفيديو</h3><p className="mt-3 text-[0.97rem] leading-relaxed text-white/90">نصنع فيديوهات احترافية تحكي قصتك بطريقة تأسر المشاهد</p><div className="mt-6 inline-flex items-center gap-2.5 rounded-2xl bg-black/45 px-4 py-2 text-white"><span className="text-[1.38rem] font-extrabold">+500</span><span className="text-[0.95rem] text-white/75">فيديو</span></div></div></div>
            </article>

            <article className="media-service-tile relative min-h-[255px] overflow-hidden [direction:rtl] lg:col-span-7">
              <Image src="/media-assets/service-dashboard.png" alt="الحملات الإعلانية" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />
              <div className="relative z-10 flex h-full flex-col justify-between"><div className="flex items-start justify-between"><span className="text-white">◍</span><p className="text-[0.97rem] font-semibold text-[var(--brand-primary-soft)]">نتائج مضمونة</p></div><div className="text-right"><h3 className="text-[1.94rem] font-extrabold leading-none text-white">الحملات الإعلانية</h3><p className="mt-3 text-[0.95rem] leading-relaxed text-white/84">حملات مستهدفة تحقق أعلى عائد على الاستثمار</p><div className="mt-5 inline-flex items-center gap-2.5 rounded-2xl bg-black/45 px-4 py-2 text-white"><span className="text-[1.35rem] font-extrabold">+320%</span><span className="text-[0.95rem] text-white/72">عائد</span></div></div></div>
            </article>
          </div>

          <div className="mt-5 grid gap-5 [direction:ltr] sm:grid-cols-2 lg:grid-cols-5">
            <article className="media-service-mini media-service-dark min-h-[175px] [direction:rtl]"><span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-white/72 text-white"><PlusIcon /></span><p className="mt-5 text-center text-[1.55rem] font-semibold text-white">اكتشف المزيد</p></article>
            <article className="media-service-mini media-service-dark min-h-[175px] [direction:rtl]"><p className="mt-5 text-[0.95rem] text-white/72">لقطات احترافية</p><h3 className="mt-1 text-[1.55rem] font-extrabold text-white">التصوير</h3></article>
            <article className="media-service-mini media-service-purple min-h-[175px] [direction:rtl]"><p className="mt-5 text-[0.95rem] text-white/72">لقطات احترافية</p><h3 className="mt-1 text-[1.55rem] font-extrabold text-white">التصوير</h3></article>
            <article className="media-service-mini media-service-purple min-h-[175px] [direction:rtl]"><p className="mt-5 text-[0.95rem] text-white/72">رسوم متحركة</p><h3 className="mt-1 text-[1.55rem] font-extrabold text-white">الموشن</h3></article>
            <article className="media-service-mini media-service-purple min-h-[175px] [direction:rtl]"><p className="mt-5 text-[0.95rem] text-white/72">لقطات احترافية</p><h3 className="mt-1 text-[1.55rem] font-extrabold text-white">التصوير</h3></article>
          </div>
        </div>
      </section>

      <section className="media-projects-section py-20 sm:py-24">
        <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-6 [direction:ltr] lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-center gap-3">
              <button type="button" className="media-projects-prev flex h-12 w-12 items-center justify-center rounded-full bg-[#0b1530] text-white" aria-label="السابق"><ArrowLeftIcon /></button>
              <button type="button" className="media-projects-next flex h-12 w-12 items-center justify-center rounded-full bg-[#e4e7ed] text-[#111827]" aria-label="التالي"><ArrowRightIcon /></button>
            </div>
            <div className="text-right"><span className="inline-flex rounded-full bg-[#f2ead8] px-4 py-1.5 text-sm font-semibold text-[var(--brand-primary-strong)]">أعمالنا</span><h2 className="mt-4 text-[clamp(1.8rem,4.4vw,3.28rem)] font-extrabold leading-[1.08] text-[#121a2b]">مشاريع مميزة</h2></div>
          </div>

          <Swiper
            className="media-projects-swiper mt-10 [direction:ltr]"
            modules={[Navigation, Autoplay]}
            slidesPerView={1.04}
            spaceBetween={16}
            initialSlide={1}
            speed={780}
            loop
            touchStartPreventDefault={false}
            touchMoveStopPropagation={false}
            autoplay={{ delay: 4200, disableOnInteraction: false, pauseOnMouseEnter: true }}
            navigation={{ prevEl: ".media-projects-prev", nextEl: ".media-projects-next" }}
            onSlideChange={(swiper) => {
              setActiveProject(swiper.realIndex);
            }}
            breakpoints={{
              640: { slidesPerView: 1.35, spaceBetween: 18 },
              960: { slidesPerView: 2.05, spaceBetween: 22 },
              1280: { slidesPerView: 2.9, spaceBetween: 24 },
            }}
          >
            {projectCards.map((project) => (
              <SwiperSlide key={`${project.client}-${project.title}`} className="media-projects-slide">
                <article className="media-project-card relative min-h-[545px] [direction:rtl]">
                  <Image src={project.image} alt={project.title} fill className="object-cover" />
                  <div className={`absolute inset-0 ${project.tone === "light" ? "bg-gradient-to-t from-white/30 via-white/5 to-transparent" : "bg-gradient-to-t from-black/80 via-black/20 to-black/10"}`} />
                  <div className="relative z-10 flex h-full flex-col justify-between">
                    <div className="flex items-start justify-between"><span className={`text-sm ${project.tone === "light" ? "text-black/55" : "text-white/72"}`}>{project.year}</span><span className={`rounded-full px-4 py-1.5 text-xs font-semibold ${project.tone === "light" ? "bg-black/14 text-black/72" : "bg-white/16 text-white/92"}`}>{project.tag}</span></div>
                    <div className="flex items-end justify-between gap-3">
                      {project.highlighted ? (<span className="inline-flex flex-col items-center rounded-2xl bg-[var(--brand-primary)] px-4 py-2.5 text-white"><span className="text-[1.63rem] font-extrabold leading-none">{project.statValue}</span><span className="text-xs text-white/86">{project.statLabel}</span></span>) : (<div className="text-right"><p className={`text-[1.72rem] font-extrabold leading-none ${project.tone === "light" ? "text-[#111827]" : "text-white"}`}>{project.statValue}</p><p className={`mt-1 text-sm ${project.tone === "light" ? "text-black/58" : "text-white/70"}`}>{project.statLabel}</p></div>)}
                      <div className="text-right"><p className={`text-sm ${project.tone === "light" ? "text-black/58" : "text-white/75"}`}>{project.client}</p><h3 className={`mt-2 text-[1.72rem] font-extrabold leading-none ${project.tone === "light" ? "text-[#111827]" : "text-white"}`}>{project.title}</h3></div>
                    </div>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="mt-12 flex items-center justify-between gap-8 [direction:ltr]"><p className="min-w-[4rem] text-lg font-bold text-[#7b8594]">{activeProject + 1} / {projectCards.length}</p><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#e5e7ec]"><span className="block h-full rounded-full bg-[var(--brand-primary)] transition-all duration-500 ease-out" style={{ width: progressWidth }} /></div></div>
        </div>
      </section>
      <section className="bg-[radial-gradient(920px_380px_at_78%_24%,rgba(212,168,67,0.18),transparent_72%),linear-gradient(180deg,#070b18_0%,#050a16_60%,#040814_100%)] py-20 sm:py-24">
        <div className="mx-auto w-full max-w-[1220px] px-4 sm:px-8 lg:px-10">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {whyStats.map((stat) => (
              <article key={stat.label} className="rounded-2xl border border-white/10 bg-[linear-gradient(130deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] px-6 py-6 text-right">
                <span className="mb-5 ml-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[rgba(212,168,67,0.9)] text-white">•</span>
                <p className="text-[2.17rem] font-extrabold leading-none text-white">{stat.value}</p>
                <p className="mt-1 text-[0.97rem] text-white/65">{stat.label}</p>
              </article>
            ))}
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-[1.06fr_1fr] lg:items-center">
            <article className="relative min-h-[430px] overflow-hidden rounded-[22px] border border-white/10">
              <Image src="/media-assets/team-why.png" alt="فريق العمل" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070f20] via-transparent to-transparent" />
              <div className="absolute left-4 top-1/2 flex -translate-y-1/2 items-center gap-2 rounded-xl bg-[var(--brand-primary)] px-4 py-3 text-white"><span className="text-lg font-extrabold">+50</span><span className="text-sm">مشروع</span></div>
              <div className="absolute right-1/2 top-6 translate-x-1/2 rounded-2xl bg-white px-4 py-3 text-[#0f172a]"><div className="flex items-center gap-2"><span className="text-[1.72rem] font-extrabold leading-none">4.9</span><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--brand-primary)] text-white"><span>★</span></span></div><p className="text-sm text-[#6b7280]">تقييم العملاء</p><p className="mt-1 text-[#f59e0b]">★★★★★</p></div>
            </article>

            <div className="text-right">
              <span className="inline-flex rounded-full border border-[rgba(212,168,67,0.3)] bg-[rgba(212,168,67,0.12)] px-4 py-1.5 text-sm font-semibold text-[var(--brand-primary-soft)]">لماذا نحن</span>
              <h2 className="mt-5 text-[clamp(1.72rem,4.2vw,3.12rem)] font-extrabold leading-[1.08] text-white"><span className="text-[var(--brand-primary)]">خدماتنا الإعلامية؟</span><br /><span>لماذا تُختار</span></h2>
              <p className="mt-5 max-w-[560px] text-[0.98rem] leading-relaxed text-white/66">نجمع بين الإبداع والاستراتيجية لنقدّم لك حلولاً إعلامية متكاملة تحقق نتائج ملموسة.</p>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {whyFeatures.map((item) => (
                  <article key={item.title} className="rounded-2xl border border-white/10 bg-[#111b31]/78 px-4 py-4 text-right"><div className="mb-2 flex items-center justify-between"><span className="text-[1rem] font-bold text-white">{item.title}</span><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgba(212,168,67,0.9)] text-white">•</span></div><p className="text-sm leading-relaxed text-white/60">{item.desc}</p></article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#eef0f4] py-20 sm:py-24">
        <div className="mx-auto w-full max-w-[1220px] px-4 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[760px] text-center"><h2 className="text-[clamp(1.8rem,4.2vw,3.2rem)] font-extrabold leading-[1.08] text-[#111827]">رحلة المشروع معنا</h2><p className="mt-3 text-[1rem] text-[#6b7280]">5 خطوات بسيطة لنجاح مشروعك</p></div>

          <div className="mt-12 grid gap-4 md:grid-cols-5">
            {journeySteps.map((step) => {
              const isActive = step.id === activeJourneyId;
              return (
                <button key={step.id} type="button" onClick={() => setActiveJourneyId(step.id)} className={`rounded-2xl border px-5 py-5 text-right transition-colors ${isActive ? "border-[#1b2540] bg-[#050f26] text-white" : "border-[#e2e5ea] bg-white text-[#111827]"}`}>
                  <div className="text-left text-sm font-bold text-[#9ca3af]">{step.id}</div>
                  <span className={`mt-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${isActive ? "bg-white/12" : "bg-[#f0f3f7]"}`}>{step.icon}</span>
                  <h3 className="mt-4 text-[1.42rem] font-extrabold leading-none">{step.title}</h3>
                  <p className={`mt-2 text-sm font-semibold ${isActive ? "text-white/70" : "text-[#9ca3af]"}`}>{step.short}</p>
                </button>
              );
            })}
          </div>

          <article className="mx-auto mt-8 max-w-[1080px] rounded-[24px] border border-[#dfe3e9] bg-white px-6 py-10 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#f6edd9] px-4 py-1.5 text-sm font-semibold text-[var(--brand-primary-strong)]"><span className="h-2 w-2 rounded-full bg-[var(--brand-primary)]" /><span>المدة: {activeJourney.duration}</span></span>
            <h3 className="mt-5 text-[2.05rem] font-extrabold leading-none text-[#111827]">{activeJourney.title}</h3>
            <p className="mx-auto mt-4 max-w-[700px] text-[1.06rem] leading-relaxed text-[#6b7280]">{activeJourney.description}</p>
          </article>

          <div className="mt-8 flex items-center justify-center gap-2">{journeySteps.map((step, index) => <span key={step.id} className={`h-[6px] rounded-full ${index === activeJourneyIndex ? "w-10 bg-[var(--brand-primary)]" : "w-4 bg-[#d2d7df]"}`} />)}</div>
        </div>
      </section>

      <section className="bg-[#eff1f4] py-20 sm:py-24">
        <div className="mx-auto w-full max-w-[1220px] px-4 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[820px] text-center"><div className="mx-auto inline-flex items-center gap-2 rounded-full bg-[#f3ead6] px-5 py-2 text-sm font-semibold text-[var(--brand-primary-strong)]"><span className="h-2 w-2 rounded-full border border-current" /><span>الأسئلة الشائعة</span></div><h2 className="mt-6 text-[clamp(1.89rem,4.4vw,3.28rem)] font-extrabold leading-[1.08] text-[#111827]">أسئلة قد تهمك</h2><p className="mx-auto mt-4 max-w-[760px] text-[1.01rem] leading-relaxed text-[#798394]">إجابات على الأسئلة الأكثر شيوعاً حول خدماتنا</p></div>

          <div className="mx-auto mt-12 max-w-[980px] space-y-3">
            {faqItems.map((item) => {
              const isOpen = item.id === activeFaqId;
              return (
                <article key={item.id} className={`rounded-[16px] border px-5 py-4 sm:px-6 ${isOpen ? "border-[#e2c892] bg-white" : "border-[#e0e4eb] bg-[#f6f8fb]"}`}>
                  <button type="button" onClick={() => setActiveFaqId(item.id)} className="flex w-full items-center justify-between gap-4 [direction:ltr]" aria-expanded={isOpen}>
                    <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${isOpen ? "bg-[var(--brand-primary)] text-white" : "bg-[#e9edf2] text-[#8f99aa]"}`}>{isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}</span>
                    <div className="flex items-center gap-4 [direction:rtl]"><span className={`inline-flex h-10 min-w-10 items-center justify-center rounded-xl px-2 text-sm font-bold ${isOpen ? "bg-[var(--brand-primary)] text-white" : "bg-[#e9edf2] text-[#8f99aa]"}`}>{item.id}</span><h3 className={`text-[1.22rem] font-extrabold leading-none ${isOpen ? "text-[var(--brand-primary-strong)]" : "text-[#1f2937]"}`}>{item.question}</h3></div>
                  </button>
                  {isOpen && <p className="mx-auto mt-4 max-w-[92%] border-t border-[#ecdcb7] pt-4 text-center text-[0.95rem] leading-relaxed text-[#6f798a]">{item.answer}</p>}
                </article>
              );
            })}
          </div>

          <div className="mx-auto mt-12 max-w-[980px] rounded-[18px] border border-[#d9c08a] bg-[#f6ecd9] px-6 py-9 text-center"><p className="text-[1.03rem] font-semibold text-[#5e6878]">لديك سؤال آخر؟ تواصل معنا مباشرة</p><button type="button" className="mt-5 rounded-2xl bg-gradient-to-l from-[var(--brand-primary)] to-[var(--brand-primary-strong)] px-12 py-3 text-[1rem] font-bold text-white">احجز استشارة مجانية</button></div>
        </div>
      </section>

      <SiteFooter brandSubtitle="MEDIA" />
    </main>
  );
}

