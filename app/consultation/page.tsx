import Link from "next/link";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";

const services = [
  "استراتيجية السوق والنمو",
  "تطوير الهوية والعلامة",
  "التسويق الرقمي",
  "تطوير موقع أو متجر",
  "تطبيقات الجوال",
  "خطة متكاملة (ماركت + ميديا + تك)",
];

const process = [
  {
    step: "01",
    title: "نفهم احتياجك",
    description: "نجمع التفاصيل الأساسية لنفهم وضعك الحالي وأهدافك.",
  },
  {
    step: "02",
    title: "نشخص الفرص",
    description: "نحدد نقاط التحسين السريعة والفرص الأعلى أثرًا على النمو.",
  },
  {
    step: "03",
    title: "نقترح خارطة طريق",
    description: "نضع لك مسارًا واضحًا بخطوات عملية، ميزانية، وأولويات التنفيذ.",
  },
];

const perks = [
  { value: "45 دقيقة", label: "جلسة مركزة" },
  { value: "خطة واضحة", label: "مخرجات عملية" },
  { value: "بدون التزام", label: "استشارة مجانية بالكامل" },
];

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

export default function ConsultationPage() {
  return (
    <main className="bg-[#edf1f7]">
      <section className="relative overflow-hidden bg-[radial-gradient(920px_520px_at_84%_24%,rgba(47,124,255,0.2),transparent_72%),radial-gradient(760px_440px_at_16%_78%,rgba(17,167,118,0.16),transparent_72%),linear-gradient(180deg,#06112a_0%,#091835_56%,#0b1f3f_100%)] text-white">
        <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(118deg,rgba(255,255,255,0.07)_0,rgba(255,255,255,0.07)_1px,transparent_1px,transparent_94px)] opacity-20" />
        <Navbar />

        <section className="relative z-10 mx-auto w-full max-w-[1240px] px-4 pb-20 pt-[8.2rem] sm:px-8 lg:px-10 lg:pt-[10.3rem]">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="[direction:rtl] text-right">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#5d8de8]/45 bg-[#0f234f]/76 px-5 py-2 text-sm font-semibold text-[#8dc6ff]">
                <span>استشارة مجانية</span>
                <Dot />
              </div>

              <h1 className="mt-7 text-[clamp(2rem,4.8vw,4rem)] font-extrabold leading-[1.08]">
                جلسة استراتيجية
                <br />
                <span className="text-[#8dc6ff]">تمنحك وضوحًا قبل التنفيذ</span>
              </h1>

              <p className="mt-6 max-w-[620px] text-[1.08rem] leading-relaxed text-white/74">
                إذا عندك مشروع جديد أو مشروع قائم يحتاج إعادة توجيه، هذه الجلسة تساعدك تشوف
                الصورة كاملة: الأولويات، الميزانية، والخطوات العملية المناسبة لمرحلتك.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {perks.map((perk) => (
                  <article
                    key={perk.label}
                    className="rounded-2xl border border-white/14 bg-[#0e214b]/78 px-4 py-4 text-right"
                  >
                    <p className="text-[1.25rem] font-extrabold leading-none text-white">{perk.value}</p>
                    <p className="mt-1 text-sm text-white/66">{perk.label}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-[26px] border border-white/14 bg-[linear-gradient(145deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04))] p-6 shadow-[0_24px_50px_rgba(0,0,0,0.32)]">
              <h2 className="text-right text-[1.5rem] font-extrabold">احجز موعدك الآن</h2>
              <p className="mt-2 text-right text-sm text-white/68">
                املأ النموذج وسيتواصل معك الفريق خلال 24 ساعة.
              </p>

              <form className="mt-5 space-y-4 text-right">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-sm text-white/82">الاسم الكامل</span>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-white/16 bg-white/[0.08] px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/45 focus:border-[#7db9ff]"
                      placeholder="مثال: أحمد العلي"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm text-white/82">البريد الإلكتروني</span>
                    <input
                      type="email"
                      className="w-full rounded-xl border border-white/16 bg-white/[0.08] px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/45 focus:border-[#7db9ff]"
                      placeholder="name@company.com"
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-sm text-white/82">رقم الجوال</span>
                    <input
                      type="tel"
                      className="w-full rounded-xl border border-white/16 bg-white/[0.08] px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/45 focus:border-[#7db9ff]"
                      placeholder="+966 5X XXX XXXX"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm text-white/82">اسم الشركة</span>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-white/16 bg-white/[0.08] px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/45 focus:border-[#7db9ff]"
                      placeholder="اسم النشاط أو الشركة"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="mb-1.5 block text-sm text-white/82">الخدمة المطلوبة</span>
                  <select className="w-full rounded-xl border border-white/16 bg-white/[0.08] px-4 py-2.5 text-sm text-white outline-none focus:border-[#7db9ff]">
                    {services.map((item) => (
                      <option key={item} value={item} className="text-[#0f1a31]">
                        {item}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm text-white/82">وصف مختصر لاحتياجك</span>
                  <textarea
                    rows={4}
                    className="w-full rounded-xl border border-white/16 bg-white/[0.08] px-4 py-3 text-sm text-white outline-none placeholder:text-white/45 focus:border-[#7db9ff]"
                    placeholder="اكتب هدفك الحالي، وأي تفاصيل تساعدنا لفهم المشروع..."
                  />
                </label>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#2f7cff] bg-gradient-to-l from-[#2f7cff] to-[#1f67de] px-7 py-3 text-base font-bold text-white shadow-[0_14px_30px_rgba(47,124,255,0.28)]"
                >
                  <Arrow />
                  تأكيد طلب الاستشارة
                </button>
              </form>
            </div>
          </div>
        </section>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[760px] text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#dce7fb] px-5 py-2 text-sm font-semibold text-[#2f7cff]">
              <span>كيف تتم الجلسة</span>
              <Dot />
            </div>
            <h2 className="mt-5 text-[clamp(1.8rem,4.4vw,3rem)] font-extrabold leading-[1.1] text-[#111827]">
              خطوات بسيطة ونتيجة واضحة
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {process.map((item) => (
              <article
                key={item.step}
                className="rounded-[22px] border border-[#d7deea] bg-[linear-gradient(180deg,#ffffff_0%,#f4f7fc_100%)] px-5 py-6 text-right shadow-[0_10px_22px_rgba(15,23,42,0.07)]"
              >
                <span className="text-sm font-bold text-[#2f7cff]">{item.step}</span>
                <h3 className="mt-2 text-[1.35rem] font-extrabold text-[#141d2e]">{item.title}</h3>
                <p className="mt-2 text-[0.97rem] leading-relaxed text-[#677388]">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20 sm:pb-24">
        <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-8 lg:px-10">
          <div className="rounded-[26px] bg-[radial-gradient(620px_220px_at_78%_24%,rgba(17,167,118,0.28),transparent_70%),linear-gradient(180deg,#08172e_0%,#0a1b37_100%)] px-6 py-10 text-center text-white sm:px-10">
            <h2 className="text-[clamp(1.7rem,4vw,2.6rem)] font-extrabold">تحتاج تفاصيل أكثر عن الوكالة؟</h2>
            <p className="mx-auto mt-3 max-w-[700px] text-[1rem] leading-relaxed text-white/72">
              تعرف على طريقة عملنا وفريقنا والمنهج الذي نتبعه قبل بداية أي مشروع.
            </p>
            <div className="mt-7">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/[0.08] px-8 py-3 text-base font-semibold text-white"
              >
                <Arrow />
                زيارة صفحة من نحن
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter brandSubtitle="AGENCY" />
    </main>
  );
}
