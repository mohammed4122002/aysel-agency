import Link from "next/link";

type Department = {
  key: string;
  title: string;
  subtitle: string;
  icon: "grid" | "chart" | "media" | "code";
};

const departments: Department[] = [


  { key: "all", title: "الكل", subtitle: "حل متكامل", icon: "grid" },
   { key: "market", title: "الماركت", subtitle: "استراتيجية ونمو", icon: "chart" },
    { key: "media", title: "الميديا", subtitle: "إبداع وتسويقية", icon: "media" },
  { key: "tech", title: "التك", subtitle: "حلول رقمية", icon: "code" },
  
   
   
];

const budgets = ["أقل من 5K$", "5K - 15K$", "15K - 50K$", "+50K$"];

function SectionTitle({ step, title }: { step: number; title: string }) {
  return (
    <div className="mb-3 flex items-center  gap-2">
       <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#0b1220] text-[11px] font-bold text-white">
        {step}
      </span>
         <h2 className="text-[1rem] font-bold text-[#121827]">{title}</h2>
     
   
    </div>
  );
}

function HeaderLeftButton() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 rounded-[10px] border border-[#ececec] bg-[#efefef] px-4 py-2 text-[0.78rem] font-medium text-[#111827] transition hover:bg-[#e9e9e9]"
    >
      <svg aria-hidden width="13" height="13" viewBox="0 0 13 13" fill="none">
        <path d="M11 6.5H2.5M2.5 6.5 5 4M2.5 6.5 5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      العودة إلى الصفحة الرئيسية
    </Link>
  );
}

function BrandBadge() {
  return (
    <div className="flex items-center gap-3 text-right [direction:rtl]">
       <div className="inline-flex h-11 w-11 items-center justify-center rounded-[13px] bg-[#ef7f2c] text-lg font-extrabold text-white shadow-[0_8px_18px_rgba(239,127,44,0.34)]">
        A
      </div>
      <div>
        <p className="text-[1.03rem] font-bold text-[#141824]">شركة أيسل</p>
        <p className="text-[0.75rem] text-[#7f8795]">ماركت، ميديا، تك</p>
      </div>
     
    </div>
  );
}

function DepartmentIcon({ kind }: { kind: Department["icon"] }) {
  if (kind === "grid") {
    return (
      <svg aria-hidden width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="2" y="2" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.25" />
        <rect x="9" y="2" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.25" />
        <rect x="2" y="9" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.25" />
        <rect x="9" y="9" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.25" />
      </svg>
    );
  }

  if (kind === "chart") {
    return (
      <svg aria-hidden width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M2.4 11.8h10.2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        <path d="M4 9.6 6.4 7.2l2 1.8L11 6.4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (kind === "media") {
    return (
      <svg aria-hidden width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="7.5" r="4.1" stroke="currentColor" strokeWidth="1.25" />
        <circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg aria-hidden width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M5.3 4.2 2.8 7.5l2.5 3.3M9.7 4.2l2.5 3.3-2.5 3.3M8.4 3.4 6.6 11.6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TinyInfo({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 text-[0.72rem] text-[#8a93a3]">
      <svg aria-hidden width="12" height="12" viewBox="0 0 12 12" fill="none">
        <circle cx="6" cy="6" r="4.5" stroke="#ef7f2c" strokeWidth="1.1" />
        <circle cx="6" cy="6" r="1.1" fill="#ef7f2c" />
      </svg>
      <span>{label}</span>
    </div>
  );
}

export default function ConsultationPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f8] text-[#111827] [color-scheme:light] [direction:ltr] text-right">
      <div className="border-b border-[#eceef1]">
        <div className="mx-auto flex w-full max-w-[1120px] items-center justify-between px-6 py-5">
          <HeaderLeftButton />
          <BrandBadge />
        </div>
      </div>

      <section className="px-4 pb-12 pt-8">
        <div className="mx-auto w-full max-w-[560px]">
          <div className="text-center [direction:rtl]">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#f5e7de] px-4 py-1.5 text-[0.76rem] font-semibold text-[#e17832]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#e17832]" />
              متاح الرد خلال ساعات
            </div>

            <h1 className="mt-4 text-[3.1rem] font-extrabold leading-[1.04] tracking-tight text-[#111827]">
              لنبدأ{" "}
              <span className="text-[#e87c35]">
                رحلتك
              </span>
            </h1>

            <p className="mt-2 text-[0.98rem] text-[#7e8694]">
              أخبرنا عن فكرتك وسنعود إليك بخطة عمل مخصصة، بدون التزام.
            </p>
          </div>

          <div className="mt-10 [direction:rtl] ">
            <SectionTitle step={1} title="اختر القسم" />

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {departments.map((department) => (
                <button
                  key={department.key}
                  type="button"
                  className="group rounded-[14px] border border-[#e5e8ee] bg-[#f5f6f8] px-3 py-3 text-center transition hover:border-[#d8dce4] hover:bg-[#f0f2f5]"
                >
                  <span className="mx-auto inline-flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#eceef2] text-[#9aa3b2] transition group-hover:text-[#7f8898]">
                    <DepartmentIcon kind={department.icon} />
                  </span>
                  <p className="mt-2 text-[0.96rem] font-extrabold text-[#1f2937]">{department.title}</p>
                  <p className="mt-0.5 text-[0.72rem] text-[#99a1af]">{department.subtitle}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-9 [direction:rtl] ">
            <SectionTitle step={2} title="معلوماتك" />

            <div className="rounded-[14px] border border-[#e6e9ef] bg-[#f6f7f9] p-4">
              <div className="grid gap-3 sm:grid-cols-2">
             

           
                   <label className="block text-right">
                  <span className="mb-1 block text-[0.76rem] font-semibold text-[#8d95a3]">الاسم *</span>
                  <input
                    type="text"
                    placeholder="أحمد محمد"
                    className="h-10 w-full rounded-[11px] border border-[#e0e4ea] bg-[#f2f4f7] px-3 text-[0.88rem] text-[#111827] outline-none placeholder:text-[#a2a9b5] focus:border-[#d2d8e2]"
                  />
                </label>
                     <label className="block text-right">
                  <span className="mb-1 block text-[0.76rem] font-semibold text-[#8d95a3]">البريد *</span>
                  <input
                    type="email"
                    placeholder="ahmed@mail.com"
                    className="h-10 w-full rounded-[11px] border border-[#e0e4ea] bg-[#f2f4f7] px-3 text-[0.88rem] text-[#111827] outline-none placeholder:text-[#a2a9b5] focus:border-[#d2d8e2]"
                  />
                </label>
              </div>

              <label className="mt-3 block text-right ">
                <span className="mb-1 block text-[0.76rem] font-semibold text-[#8d95a3]">الهاتف (اختياري)</span>
                <input
                  type="tel"
                  placeholder="+966 50 000 0000"
                  className="h-10 w-full rounded-[11px] border border-[#e0e4ea] bg-[#f2f4f7] px-3 text-[0.88rem] text-[#111827] outline-none placeholder:text-[#a2a9b5] focus:border-[#d2d8e2] text-right"
                />
              </label>
            </div>
          </div>

          <div className="mt-9 [direction:rtl]">
            <SectionTitle step={3} title="الميزانية (اختياري)" />
            <div className="flex flex-wrap  gap-2">
              {budgets.map((budget) => (
                <button
                  key={budget}
                  type="button"
                  className="rounded-full border border-[#dfe3ea] bg-[#f2f4f7] px-4 py-2 text-[0.78rem] font-semibold text-[#616a7b] transition hover:bg-[#eceff4]"
                >
                  {budget}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-9 [direction:rtl]">
            <SectionTitle step={4} title="أخبرنا عن مشروعك" />

            <div className="rounded-[14px] border border-[#e6e9ef] bg-[#f6f7f9] p-4">
              <textarea
                rows={5}
                placeholder="شاركنا تفاصيل مشروعك، التحديات، أو أي أسئلة..."
                className="w-full resize-none rounded-[11px] border border-[#e0e4ea] bg-[#f2f4f7] px-3 py-3 text-[0.9rem] text-[#111827] outline-none placeholder:text-[#a2a9b5] focus:border-[#d2d8e2]"
              />

              <div className="mt-2 flex items-center justify-between text-[#afb6c3]">
                <p className="text-[0.68rem]">0/500</p>
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-[4px] border border-[#d5dbe4]" />
                  <span className="h-3.5 w-3.5 rounded-[4px] border border-[#d5dbe4]" />
                  <span className="h-3.5 w-3.5 rounded-[4px] border border-[#d5dbe4]" />
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="mt-6 inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-[13px] bg-[#ebb691] text-[1rem] font-bold text-white transition hover:bg-[#e7a980]"
          >
            <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M11 7H3.5M3.5 7 6 4.5M3.5 7 6 9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            إرسال الطلب
          </button>

          <div className="mt-4 flex items-center justify-center gap-5 [direction:rtl]">
            <TinyInfo label="مشفر 100%" />
            <TinyInfo label="خصوصية تامة" />
            <TinyInfo label="خلال 24 ساعة" />
          </div>
        </div>
      </section>

      <footer className="border-t border-[#eceef1] px-6 py-6 text-[0.78rem] text-[#9aa2af]">
        <div className="mx-auto flex w-full max-w-[1120px] items-center justify-between">
          <p>Powered by Readdy</p>
          <p>© 2026 Agency. جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </main>
  );
}
