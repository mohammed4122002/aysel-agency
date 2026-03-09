"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

type Department = {
  key: string;
  title: string;
  subtitle: string;
  icon: "grid" | "chart" | "media" | "code";
};

type FormState = {
  department: string;
  fullName: string;
  email: string;
  phone: string;
  budget: string;
  details: string;
};

const departments: Department[] = [
  { key: "all", title: "الكل", subtitle: "حل متكامل", icon: "grid" },
  { key: "market", title: "الماركت", subtitle: "استراتيجية ونمو", icon: "chart" },
  { key: "media", title: "الميديا", subtitle: "إبداع وتسويقي", icon: "media" },
  { key: "tech", title: "التك", subtitle: "حلول رقمية", icon: "code" },
];

const budgets = ["أقل من 5K$", "5K - 15K$", "15K - 50K$", "+50K$"];

const initialForm: FormState = {
  department: "all",
  fullName: "",
  email: "",
  phone: "",
  budget: "",
  details: "",
};

function SectionTitle({ step, title }: { step: number; title: string }) {
  return (
    <div className="mb-3 flex items-center justify-end gap-2">
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--brand-bg)] text-[11px] font-bold text-white">
        {step}
      </span>
      <h2 className="text-[1rem] font-bold text-white">{title}</h2>
    </div>
  );
}

function HeaderBackButton() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 rounded-[10px] border border-[rgba(212,168,67,0.2)] bg-[rgba(255,255,255,0.04)] px-4 py-2 text-[0.78rem] font-medium text-[#dde6f8] transition hover:bg-[rgba(255,255,255,0.08)]"
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
      <div>
        <p className="text-[1.03rem] font-bold text-white">شركة أيسل</p>
        <p className="text-[0.75rem] text-[#9aa5bd]">ماركت، ميديا، تك</p>
      </div>
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-[13px] bg-gradient-to-b from-[var(--brand-primary)] to-[var(--brand-primary-strong)] text-lg font-extrabold text-white shadow-[0_8px_20px_rgba(212,168,67,0.35)]">
        A
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
    <div className="inline-flex items-center gap-1.5 text-[0.72rem] text-[#a8b2c7]">
      <svg aria-hidden width="12" height="12" viewBox="0 0 12 12" fill="none">
        <circle cx="6" cy="6" r="4.5" stroke="var(--brand-primary)" strokeWidth="1.1" />
        <circle cx="6" cy="6" r="1.1" fill="var(--brand-primary)" />
      </svg>
      <span>{label}</span>
    </div>
  );
}

export default function ConsultationPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string>("");
  const [submitError, setSubmitError] = useState<string>("");

  const detailsCount = useMemo(() => form.details.length, [form.details.length]);

  const canSubmit = form.fullName.trim().length > 1 && form.email.trim().length > 5 && !submitting;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitMessage("");
    setSubmitError("");

    if (!canSubmit) {
      setSubmitError("يرجى إدخال الاسم والبريد بشكل صحيح قبل الإرسال.");
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "تعذّر إرسال الطلب، حاول مرة أخرى.");
      }

      setSubmitMessage("تم إرسال طلبك بنجاح. سنتواصل معك خلال 24 ساعة.");
      setForm(initialForm);
    } catch (error) {
      const message = error instanceof Error ? error.message : "تعذّر إرسال الطلب.";
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#050a16_0%,#040814_55%,#03060f_100%)] text-[#e9eefb] [color-scheme:dark]">
      <div className="border-b border-[rgba(212,168,67,0.14)] bg-[rgba(2,7,18,0.62)] backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1120px] items-center justify-between px-6 py-5">
          <HeaderBackButton />
          <BrandBadge />
        </div>
      </div>

      <section className="px-4 pb-12 pt-8">
        <div className="mx-auto w-full max-w-[560px]">
          <div className="text-center [direction:rtl]">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(212,168,67,0.25)] bg-[rgba(212,168,67,0.12)] px-4 py-1.5 text-[0.76rem] font-semibold text-[var(--brand-primary-soft)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-primary)]" />
              متاح الرد خلال ساعات
            </div>

            <h1 className="mt-4 text-[3.1rem] font-extrabold leading-[1.04] tracking-tight text-white">
              لنبدأ <span className="text-[var(--brand-primary)]">رحلتك</span>
            </h1>

            <p className="mt-2 text-[0.98rem] text-[#a5afc3]">
              أخبرنا عن فكرتك وسنعود إليك بخطة عمل مخصصة، بدون التزام.
            </p>
          </div>

          <form className="mt-10 space-y-9 [direction:rtl]" onSubmit={onSubmit}>
            <div>
              <SectionTitle step={1} title="اختر القسم" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {departments.map((department) => {
                  const active = form.department === department.key;
                  return (
                    <button
                      key={department.key}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, department: department.key }))}
                      className={`group rounded-[14px] border px-3 py-3 text-center transition ${
                        active
                          ? "border-[var(--brand-primary)] bg-[rgba(212,168,67,0.12)]"
                          : "border-[rgba(212,168,67,0.14)] bg-[rgba(255,255,255,0.03)] hover:border-[rgba(212,168,67,0.3)] hover:bg-[rgba(255,255,255,0.05)]"
                      }`}
                    >
                      <span
                        className={`mx-auto inline-flex h-8 w-8 items-center justify-center rounded-[10px] transition ${
                          active ? "bg-[rgba(212,168,67,0.2)] text-[var(--brand-primary-soft)]" : "bg-[rgba(255,255,255,0.06)] text-[#9aa3b2]"
                        }`}
                      >
                        <DepartmentIcon kind={department.icon} />
                      </span>
                      <p className="mt-2 text-[0.96rem] font-extrabold text-white">{department.title}</p>
                      <p className="mt-0.5 text-[0.72rem] text-[#9ea8bd]">{department.subtitle}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <SectionTitle step={2} title="معلوماتك" />
              <div className="rounded-[14px] border border-[rgba(212,168,67,0.14)] bg-[rgba(255,255,255,0.03)] p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block text-right">
                    <span className="mb-1 block text-[0.76rem] font-semibold text-[#a8b2c7]">الاسم *</span>
                    <input
                      type="text"
                      required
                      value={form.fullName}
                      onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
                      placeholder="أحمد محمد"
                      className="h-10 w-full rounded-[11px] border border-[rgba(212,168,67,0.13)] bg-[rgba(3,8,20,0.72)] px-3 text-[0.88rem] text-white outline-none placeholder:text-[#78839a] focus:border-[var(--brand-primary)]"
                    />
                  </label>

                  <label className="block text-right">
                    <span className="mb-1 block text-[0.76rem] font-semibold text-[#a8b2c7]">البريد *</span>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="ahmed@mail.com"
                      className="h-10 w-full rounded-[11px] border border-[rgba(212,168,67,0.13)] bg-[rgba(3,8,20,0.72)] px-3 text-[0.88rem] text-white outline-none placeholder:text-[#78839a] focus:border-[var(--brand-primary)]"
                    />
                  </label>
                </div>

                <label className="mt-3 block text-right">
                  <span className="mb-1 block text-[0.76rem] font-semibold text-[#a8b2c7]">الهاتف (اختياري)</span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="+966 50 000 0000"
                    className="h-10 w-full rounded-[11px] border border-[rgba(212,168,67,0.13)] bg-[rgba(3,8,20,0.72)] px-3 text-[0.88rem] text-white outline-none placeholder:text-[#78839a] focus:border-[var(--brand-primary)]"
                  />
                </label>
              </div>
            </div>

            <div>
              <SectionTitle step={3} title="الميزانية (اختياري)" />
              <div className="flex flex-wrap justify-end gap-2">
                {budgets.map((budget) => {
                  const active = form.budget === budget;
                  return (
                    <button
                      key={budget}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, budget: prev.budget === budget ? "" : budget }))}
                      className={`rounded-full border px-4 py-2 text-[0.78rem] font-semibold transition ${
                        active
                          ? "border-[var(--brand-primary)] bg-[rgba(212,168,67,0.12)] text-[var(--brand-primary-soft)]"
                          : "border-[rgba(212,168,67,0.18)] bg-[rgba(255,255,255,0.03)] text-[#95a0b8] hover:bg-[rgba(255,255,255,0.06)]"
                      }`}
                    >
                      {budget}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <SectionTitle step={4} title="أخبرنا عن مشروعك" />
              <div className="rounded-[14px] border border-[rgba(212,168,67,0.14)] bg-[rgba(255,255,255,0.03)] p-4">
                <textarea
                  rows={5}
                  maxLength={500}
                  value={form.details}
                  onChange={(e) => setForm((prev) => ({ ...prev, details: e.target.value }))}
                  placeholder="شاركنا تفاصيل مشروعك، التحديات، أو أي أسئلة..."
                  className="w-full resize-none rounded-[11px] border border-[rgba(212,168,67,0.13)] bg-[rgba(3,8,20,0.72)] px-3 py-3 text-[0.9rem] text-white outline-none placeholder:text-[#78839a] focus:border-[var(--brand-primary)]"
                />

                <div className="mt-2 flex items-center justify-between text-[#7f89a0]">
                  <p className="text-[0.68rem]">{detailsCount}/500</p>
                  <div className="flex items-center gap-2">
                    <span className="h-3.5 w-3.5 rounded-[4px] border border-[rgba(212,168,67,0.25)]" />
                    <span className="h-3.5 w-3.5 rounded-[4px] border border-[rgba(212,168,67,0.25)]" />
                    <span className="h-3.5 w-3.5 rounded-[4px] border border-[rgba(212,168,67,0.25)]" />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-[13px] border border-[var(--brand-primary)] bg-gradient-to-l from-[var(--brand-primary)] to-[var(--brand-primary-strong)] text-[1rem] font-bold text-white shadow-[0_12px_28px_rgba(212,168,67,0.32)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-65"
            >
              {submitting ? "جاري الإرسال..." : "إرسال الطلب"}
            </button>

            {submitMessage ? <p className="text-center text-[0.86rem] text-[#89d8a7]">{submitMessage}</p> : null}
            {submitError ? <p className="text-center text-[0.86rem] text-[#ff9c9c]">{submitError}</p> : null}

            <div className="flex items-center justify-center gap-5 [direction:rtl]">
              <TinyInfo label="مشفر 100%" />
              <TinyInfo label="خصوصية تامة" />
              <TinyInfo label="خلال 24 ساعة" />
            </div>
          </form>
        </div>
      </section>

      <footer className="border-t border-[rgba(212,168,67,0.14)] px-6 py-6 text-[0.78rem] text-[#8f9ab3]">
        <div className="mx-auto flex w-full max-w-[1120px] items-center justify-between">
          <p>Powered by Readdy</p>
          <p>© 2026 Agency. جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </main>
  );
}
