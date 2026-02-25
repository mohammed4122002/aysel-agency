"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import { useSiteContent } from "@/lib/site-content-client";
import { deepMerge } from "@/lib/deep-merge";

const aboutDefaults = {
  hero: {
    badge: "من نحن",
    titleLine1: "فريق يصنع النمو",
    titleHighlight: "بعقلية تنفيذية واضحة",
    description:
      "نحن وكالة عربية تجمع الاستراتيجية، الإبداع، والتقنية في منظومة واحدة. هدفنا بسيط: نحول الرؤية إلى نتائج قابلة للقياس، بخطوات عملية وسرعة تنفيذ تواكب طموحك.",
    primaryCta: "احجز استشارة مجانية",
    secondaryCta: "استعرض أعمالنا",
  },
  valuesTitle: "كيف نفكر عندما نعمل معك",
  valuesSubtitle:
    "فلسفة عملنا توازن بين العمق الاستراتيجي والسرعة التنفيذية، حتى تحصل على نتائج ملموسة بدون تعقيد.",
  values: [
    {
      title: "وضوح استراتيجي",
      description:
        "نبني كل مشروع على أهداف واضحة ومؤشرات نجاح قابلة للقياس، بدون قرارات عشوائية.",
    },
    {
      title: "تنفيذ متقن",
      description:
        "نركز على الجودة من أول نسخة، مع تفاصيل تصميم وتجربة مستخدم تعكس مستوى العلامة.",
    },
    {
      title: "شراكة طويلة",
      description:
        "لا نعمل بعقلية تسليم فقط، بل نرافقك بعد الإطلاق لتوسيع الأثر وتحسين النتائج.",
    },
    {
      title: "مرونة عالية",
      description:
        "نشكّل فرق العمل وفق احتياجك الحقيقي: سريع عند الانطلاق، ومنهجي عند التوسع.",
    },
  ],
  milestonesTitle: "محطاتنا",
  milestonesSubtitle: "رحلة متدرجة بنينا فيها منهجية تنفيذ موثوقة وقابلة للتوسع.",
  milestones: [
    {
      year: "2011",
      title: "البداية",
      description: "انطلاق الفريق الأساسي بخدمات بناء الهوية وتجارب المواقع.",
    },
    {
      year: "2016",
      title: "توسّع الخدمات",
      description: "إضافة فرق مستقلة للتسويق الرقمي، الإنتاج الإبداعي، والتقنية.",
    },
    {
      year: "2021",
      title: "هيكلة الوكالة",
      description: "توحيد فرق التنفيذ تحت نموذج تشغيلي واحد سريع ومرن.",
    },
    {
      year: "اليوم",
      title: "منظومة متكاملة",
      description: "نقود مشاريع نمو في قطاعات متعددة داخل السعودية وخارجها.",
    },
  ],
  teamTitle: "قيادة المشروع",
  teamSubtitle: "فريق متعدد التخصصات يدير التفاصيل من الفكرة حتى الإطلاق.",
  leaders: [
    { name: "سارة خالد", role: "مديرة الاستراتيجية", image: "/media-assets/avatar-5.png" },
    { name: "أحمد فهد", role: "مدير التطوير", image: "/media-assets/avatar-4.png" },
    { name: "ريم العلي", role: "مديرة التسويق", image: "/media-assets/avatar-3.png" },
    { name: "محمد ناصر", role: "مدير المشاريع", image: "/media-assets/avatar-2.png" },
  ],
  finalCtaTitle: "جاهز تبني قصة نجاحك القادمة؟",
  finalCtaText:
    "نبدأ بجلسة استشارية سريعة لفهم احتياجك الحقيقي، ثم نضع لك خطة واضحة بالخطوات والأولويات.",
  finalCtaButton: "ابدأ الاستشارة المجانية",
};

function Dot() {
  return <span className="h-2 w-2 rounded-full bg-[#2f7cff]" aria-hidden />;
}

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M12 8H4.3M4.3 8l2.8-2.8M4.3 8l2.8 2.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function AboutPage() {
  const siteContent = useSiteContent();
  const aboutContent = deepMerge(aboutDefaults, siteContent.pages?.about);

  return (
    <main className="bg-[#eef1f6]">
      <section className="relative min-h-[74vh] overflow-hidden bg-[radial-gradient(860px_500px_at_84%_22%,rgba(47,124,255,0.24),transparent_70%),radial-gradient(760px_420px_at_20%_74%,rgba(15,157,218,0.2),transparent_72%),linear-gradient(180deg,#06102a_0%,#08142f_56%,#0a1834_100%)]">
        <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(116deg,rgba(255,255,255,0.08)_0,rgba(255,255,255,0.08)_1px,transparent_1px,transparent_96px)] opacity-20" />
        <Navbar />

        <section className="relative z-10 mx-auto w-full max-w-[1240px] px-4 pb-20 pt-[8.2rem] sm:px-8 lg:px-10 lg:pt-[10.3rem]">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="[direction:rtl] text-right text-white">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#5d8de8]/45 bg-[#0f224f]/76 px-5 py-2 text-sm font-semibold text-[#8dc6ff]">
                <span>{aboutContent.hero.badge}</span>
                <Dot />
              </div>

              <h1 className="mt-7 text-[clamp(2rem,5vw,4.1rem)] font-extrabold leading-[1.06]">
                {aboutContent.hero.titleLine1}
                <br />
                <span className="text-[#8dc6ff]">{aboutContent.hero.titleHighlight}</span>
              </h1>

              <p className="mt-6 max-w-[640px] text-[1.08rem] leading-relaxed text-white/74">
                {aboutContent.hero.description}
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
                <Link
                  href="/consultation"
                  className="inline-flex items-center gap-2 rounded-2xl border border-[#2f7cff] bg-gradient-to-l from-[#2f7cff] to-[#1f67de] px-7 py-3 text-base font-bold text-white shadow-[0_14px_30px_rgba(47,124,255,0.28)]"
                >
                  <Arrow />
                  {aboutContent.hero.primaryCta}
                </Link>
                <Link
                  href="/"
                  className="rounded-2xl border border-white/18 bg-white/[0.06] px-7 py-3 text-base font-semibold text-white/92"
                >
                  {aboutContent.hero.secondaryCta}
                </Link>
              </div>
            </div>

            <div className="rounded-[26px] border border-white/14 bg-[linear-gradient(145deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04))] p-6 shadow-[0_24px_50px_rgba(0,0,0,0.32)]">
              <div className="grid gap-4 sm:grid-cols-2">
                <article className="rounded-2xl border border-white/12 bg-[#0d1e45]/78 p-5 text-right text-white">
                  <p className="text-[2rem] font-extrabold leading-none">+500</p>
                  <p className="mt-1 text-sm text-white/68">مشروع ناجح</p>
                </article>
                <article className="rounded-2xl border border-white/12 bg-[#0d1e45]/78 p-5 text-right text-white">
                  <p className="text-[2rem] font-extrabold leading-none">15+</p>
                  <p className="mt-1 text-sm text-white/68">سنة خبرة</p>
                </article>
                <article className="rounded-2xl border border-white/12 bg-[#0d1e45]/78 p-5 text-right text-white">
                  <p className="text-[2rem] font-extrabold leading-none">98%</p>
                  <p className="mt-1 text-sm text-white/68">رضا العملاء</p>
                </article>
                <article className="rounded-2xl border border-white/12 bg-[#0d1e45]/78 p-5 text-right text-white">
                  <p className="text-[2rem] font-extrabold leading-none">3 فرق</p>
                  <p className="mt-1 text-sm text-white/68">استراتيجية، ميديا، تك</p>
                </article>
              </div>
              <div className="mt-5 rounded-2xl border border-white/12 bg-[#0a1838]/82 p-4">
                <div className="flex items-center justify-end gap-3">
                  <div className="text-right text-white">
                    <p className="font-bold">نعمل معك كفريق واحد</p>
                    <p className="text-sm text-white/62">وضوح في التواصل، وسرعة في التنفيذ.</p>
                  </div>
                  <div className="flex -space-x-2">
                    {aboutContent.leaders.map((member) => (
                      <span key={member.name} className="relative h-9 w-9 overflow-hidden rounded-full border border-white/70">
                        <Image src={member.image} alt={member.name} fill className="object-cover" sizes="36px" />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[860px] text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#dce7fb] px-5 py-2 text-sm font-semibold text-[#2f7cff]">
              <span>قِيَمنا</span>
              <Dot />
            </div>
            <h2 className="mt-5 text-[clamp(1.8rem,4.5vw,3.1rem)] font-extrabold leading-[1.1] text-[#111827]">
              {aboutContent.valuesTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-[760px] text-[1.04rem] leading-relaxed text-[#6e7888]">
              {aboutContent.valuesSubtitle}
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {aboutContent.values.map((value) => (
              <article
                key={value.title}
                className="rounded-[20px] border border-[#d8dfeb] bg-[linear-gradient(180deg,#fbfcff_0%,#f2f5fb_100%)] px-5 py-6 text-right shadow-[inset_0_1px_0_rgba(255,255,255,0.92)]"
              >
                <h3 className="text-[1.4rem] font-extrabold leading-tight text-[#151f31]">{value.title}</h3>
                <p className="mt-3 text-[0.98rem] leading-relaxed text-[#667287]">{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#eef2f8_0%,#edf1f7_100%)] py-20 sm:py-24">
        <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[760px] text-center">
            <h2 className="text-[clamp(1.8rem,4.4vw,2.9rem)] font-extrabold text-[#121a2c]">{aboutContent.milestonesTitle}</h2>
            <p className="mt-3 text-[1rem] text-[#6f798a]">{aboutContent.milestonesSubtitle}</p>
          </div>

          <div className="mt-11 grid gap-4 md:grid-cols-2">
            {aboutContent.milestones.map((item) => (
              <article
                key={item.year}
                className="rounded-[18px] border border-[#d7deea] bg-white px-5 py-5 text-right shadow-[0_10px_22px_rgba(15,23,42,0.06)]"
              >
                <p className="text-sm font-bold text-[#2f7cff]">{item.year}</p>
                <h3 className="mt-2 text-[1.3rem] font-extrabold text-[#141d2e]">{item.title}</h3>
                <p className="mt-2 text-[0.97rem] leading-relaxed text-[#667186]">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[760px] text-center">
            <h2 className="text-[clamp(1.8rem,4.4vw,2.9rem)] font-extrabold text-[#111827]">{aboutContent.teamTitle}</h2>
            <p className="mt-3 text-[1rem] text-[#6e7888]">{aboutContent.teamSubtitle}</p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {aboutContent.leaders.map((member) => (
              <article
                key={member.name}
                className="rounded-[20px] border border-[#d7deea] bg-[linear-gradient(180deg,#ffffff_0%,#f7f9fd_100%)] p-4 text-right shadow-[0_10px_22px_rgba(15,23,42,0.06)]"
              >
                <div className="relative h-[230px] overflow-hidden rounded-2xl">
                  <Image src={member.image} alt={member.name} fill className="object-cover" sizes="(max-width: 1024px) 50vw, 280px" />
                </div>
                <h3 className="mt-4 text-[1.15rem] font-extrabold text-[#161f30]">{member.name}</h3>
                <p className="mt-1 text-[0.92rem] text-[#6d7788]">{member.role}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20 sm:pb-24">
        <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-8 lg:px-10">
          <div className="rounded-[26px] bg-[radial-gradient(680px_240px_at_80%_20%,rgba(47,124,255,0.28),transparent_68%),linear-gradient(180deg,#081532_0%,#0a1a3b_100%)] px-6 py-10 text-center text-white sm:px-10">
            <h2 className="text-[clamp(1.7rem,4vw,2.8rem)] font-extrabold">{aboutContent.finalCtaTitle}</h2>
            <p className="mx-auto mt-3 max-w-[700px] text-[1rem] leading-relaxed text-white/72">
              {aboutContent.finalCtaText}
            </p>
            <div className="mt-7">
              <Link
                href="/consultation"
                className="inline-flex items-center gap-2 rounded-2xl border border-[#2f7cff] bg-gradient-to-l from-[#2f7cff] to-[#1f67de] px-8 py-3 text-base font-bold text-white"
              >
                <Arrow />
                {aboutContent.finalCtaButton}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter brandSubtitle="AGENCY" />
    </main>
  );
}

