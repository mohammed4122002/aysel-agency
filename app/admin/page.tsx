"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { clearContentCache } from "@/lib/site-content-client";
import { defaultSiteContent } from "@/lib/site-content-default";
import { deepMerge } from "@/lib/deep-merge";

type EditorTab = "agency" | "market" | "media" | "tech";

type ObjField = { key: string; label: string; dir?: "rtl" | "ltr"; multiline?: boolean };

function readPath(obj: unknown, path: string[]) {
  let cursor: unknown = obj;
  for (const part of path) {
    if (cursor && typeof cursor === "object" && part in (cursor as Record<string, unknown>)) {
      cursor = (cursor as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return cursor;
}

function writePath(obj: unknown, path: string[], value: unknown) {
  if (!obj || typeof obj !== "object") return obj;
  const draft = structuredClone(obj) as Record<string, unknown>;
  let cursor: Record<string, unknown> = draft;
  for (let i = 0; i < path.length - 1; i += 1) {
    const key = path[i];
    const next = cursor[key];
    if (!next || typeof next !== "object" || Array.isArray(next)) cursor[key] = {};
    cursor = cursor[key] as Record<string, unknown>;
  }
  cursor[path[path.length - 1]] = value;
  return draft;
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asObject(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? ({ ...(value as Record<string, unknown>) } as Record<string, unknown>)
    : ({} as Record<string, unknown>);
}

function asObjectList(value: unknown): Array<Record<string, unknown>> {
  if (!Array.isArray(value)) return [];
  return value.map((item) => asObject(item));
}

function asStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => asString(item));
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#dce3ef] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.06)] sm:p-6">
      <h3 className="mb-4 text-right text-[1.05rem] font-bold text-[#0f172a]">{title}</h3>
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  dir = "rtl",
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  dir?: "rtl" | "ltr";
  multiline?: boolean;
}) {
  const base =
    "w-full rounded-xl border border-[#d9e1ee] bg-[#f8fafc] px-3 py-2.5 text-sm text-[#0f172a] outline-none transition-colors focus:border-[#3b82f6] focus:bg-white";

  return (
    <label className="block text-right">
      <span className="mb-1.5 block text-sm font-semibold text-[#334155]">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={3}
          className={`${base} leading-relaxed`}
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          dir={dir}
          className={base}
        />
      )}
    </label>
  );
}

function TabBtn({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
        active ? "bg-[#1d4ed8] text-white" : "bg-white text-[#334155]"
      }`}
    >
      {label}
    </button>
  );
}

function ObjListEditor({
  title,
  path,
  fields,
  newItem,
  content,
  updateField,
  removeRow,
  addRow,
}: {
  title: string;
  path: string[];
  fields: ObjField[];
  newItem: Record<string, unknown>;
  content: unknown;
  updateField: (path: string[], index: number, key: string, value: string) => void;
  removeRow: (path: string[], index: number) => void;
  addRow: (path: string[], item: unknown) => void;
}) {
  const rows = asObjectList(readPath(content, path));

  return (
    <div className="mt-5 space-y-3">
      <p className="text-right text-sm font-bold text-[#334155]">{title}</p>
      {rows.map((row, index) => (
        <div key={`${title}-${index}`} className="space-y-3 rounded-xl border border-[#dde5f1] bg-[#f8fafc] p-3">
          <div className={`grid gap-3 ${fields.length > 2 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
            {fields.map((item) => (
              <Field
                key={`${item.key}-${index}`}
                label={item.label}
                value={asString(row[item.key])}
                onChange={(next) => updateField(path, index, item.key, next)}
                dir={item.dir ?? "rtl"}
                multiline={item.multiline}
              />
            ))}
          </div>
          <div className="text-right">
            <button type="button" onClick={() => removeRow(path, index)} className="rounded-xl border border-[#fecaca] bg-[#fef2f2] px-3 py-2 text-sm font-semibold text-[#b91c1c]">حذف</button>
          </div>
        </div>
      ))}
      <div className="text-right">
        <button type="button" onClick={() => addRow(path, newItem)} className="rounded-xl border border-[#bfdbfe] bg-[#eff6ff] px-4 py-2 text-sm font-semibold text-[#1d4ed8]">+ إضافة</button>
      </div>
    </div>
  );
}

function StrListEditor({
  title,
  path,
  content,
  updateField,
  removeRow,
  addRow,
}: {
  title: string;
  path: string[];
  content: unknown;
  updateField: (path: string[], index: number, value: string) => void;
  removeRow: (path: string[], index: number) => void;
  addRow: (path: string[], item: unknown) => void;
}) {
  const rows = asStringList(readPath(content, path));

  return (
    <div className="mt-5 space-y-3">
      <p className="text-right text-sm font-bold text-[#334155]">{title}</p>
      {rows.map((row, index) => (
        <div key={`${title}-${index}`} className="grid gap-3 rounded-xl border border-[#dde5f1] bg-[#f8fafc] p-3 md:grid-cols-[1fr_auto] md:items-end">
          <Field label={`العنصر ${index + 1}`} value={row} onChange={(next) => updateField(path, index, next)} />
          <button type="button" onClick={() => removeRow(path, index)} className="rounded-xl border border-[#fecaca] bg-[#fef2f2] px-3 py-2 text-sm font-semibold text-[#b91c1c]">حذف</button>
        </div>
      ))}
      <div className="text-right">
        <button type="button" onClick={() => addRow(path, "")} className="rounded-xl border border-[#bfdbfe] bg-[#eff6ff] px-4 py-2 text-sm font-semibold text-[#1d4ed8]">+ إضافة</button>
      </div>
    </div>
  );
}

const tabs: Array<{ id: EditorTab; label: string }> = [
  { id: "agency", label: "الوكالة" },
  { id: "market", label: "ماركت" },
  { id: "media", label: "ميديا" },
  { id: "tech", label: "تك" },
];

export default function AdminPage() {
  const [tab, setTab] = useState<EditorTab>("agency");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [content, setContent] = useState<unknown>(structuredClone(defaultSiteContent));

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/admin/content", { cache: "no-store" });
        const data = (await response.json()) as { content?: unknown };
        setContent(structuredClone(deepMerge(defaultSiteContent, data.content)));
      } catch {
        setError("تعذر تحميل المحتوى.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const setField = (path: string[], value: unknown) =>
    setContent((prev: unknown) => writePath(prev, path, value));

  const updateList = (path: string[], updater: (items: unknown[]) => void) => {
    setContent((prev: unknown) => {
      const current = readPath(prev, path);
      const list = Array.isArray(current) ? [...current] : [];
      updater(list);
      return writePath(prev, path, list);
    });
  };

  const updateObjField = (path: string[], index: number, key: string, value: string) => {
    updateList(path, (items) => {
      const row = asObject(items[index]);
      row[key] = value;
      items[index] = row;
    });
  };

  const updateStrField = (path: string[], index: number, value: string) => {
    updateList(path, (items) => {
      items[index] = value;
    });
  };

  const removeRow = (path: string[], index: number) => updateList(path, (items) => items.splice(index, 1));
  const addRow = (path: string[], item: unknown) => updateList(path, (items) => items.push(item));

  const save = async () => {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error();
      clearContentCache();
      setMessage("تم حفظ التعديلات بنجاح.");
    } catch {
      setError("تعذر حفظ المحتوى.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <main className="min-h-screen bg-[#f1f5f9] text-[#0f172a]">
      <header className="sticky top-0 z-20 border-b border-[#d5deec] bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1320px] flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-8">
          <div className="text-right">
            <h1 className="text-[1.4rem] font-extrabold">لوحة إدارة المحتوى</h1>
            <p className="text-sm text-[#64748b]">CRUD لأقسام: الوكالة، ماركت، ميديا، تك</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setContent(structuredClone(defaultSiteContent))} className="rounded-xl border border-[#fed7aa] bg-[#fff7ed] px-3.5 py-2 text-sm font-semibold text-[#c2410c]">إعادة الافتراضي</button>
            <button type="button" onClick={save} disabled={loading || saving} className="rounded-xl bg-[#1d4ed8] px-4 py-2 text-sm font-bold text-white disabled:opacity-60">{saving ? "جاري الحفظ..." : "حفظ"}</button>
            <Link href="/" className="rounded-xl border border-[#d7e0ef] bg-white px-3.5 py-2 text-sm font-semibold text-[#1e293b]">العودة</Link>
          </div>
        </div>
      </header>

      <section className="mx-auto w-full max-w-[1320px] px-4 pb-10 pt-6 sm:px-8">
        <div className="mb-5 flex flex-wrap gap-2 rounded-2xl border border-[#d9e1ee] bg-[#eef2f8] p-2">
          {tabs.map((item) => <TabBtn key={item.id} active={tab === item.id} label={item.label} onClick={() => setTab(item.id)} />)}
        </div>

        {message && <p className="mb-4 rounded-xl border border-[#86efac] bg-[#f0fdf4] px-4 py-3 text-sm font-semibold text-[#166534]">{message}</p>}
        {error && <p className="mb-4 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm font-semibold text-[#b91c1c]">{error}</p>}

        {loading ? (
          <div className="rounded-2xl border border-[#d9e1ee] bg-white p-8 text-center text-[#64748b]">جاري تحميل البيانات...</div>
        ) : (
          <div className="space-y-5">
            {tab === "agency" && (
              <>
                <Card title="الوكالة - معرض الأعمال">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="شارة القسم" value={asString(readPath(content, ["pages", "agency", "portfolio", "badge"]))} onChange={(v) => setField(["pages", "agency", "portfolio", "badge"], v)} />
                    <Field label="عنوان القسم" value={asString(readPath(content, ["pages", "agency", "portfolio", "title"]))} onChange={(v) => setField(["pages", "agency", "portfolio", "title"], v)} />
                    <Field label="نص زر عرض جميع الأعمال" value={asString(readPath(content, ["pages", "agency", "portfolio", "viewAllLabel"]))} onChange={(v) => setField(["pages", "agency", "portfolio", "viewAllLabel"], v)} />
                  </div>
                  <div className="mt-4"><Field label="وصف القسم" value={asString(readPath(content, ["pages", "agency", "portfolio", "subtitle"]))} onChange={(v) => setField(["pages", "agency", "portfolio", "subtitle"], v)} multiline /></div>

                  <ObjListEditor title="فلاتر المعرض" path={["pages", "agency", "portfolio", "filters"]} fields={[{ key: "id", label: "ID", dir: "ltr" }, { key: "label", label: "النص" }]} newItem={{ id: "", label: "" }} content={content} updateField={updateObjField} removeRow={removeRow} addRow={addRow} />

                  <ObjListEditor title="المشاريع" path={["pages", "agency", "portfolio", "projects"]} fields={[{ key: "id", label: "ID", dir: "ltr" }, { key: "category", label: "category", dir: "ltr" }, { key: "categoryLabel", label: "التصنيف" }, { key: "client", label: "العميل" }, { key: "title", label: "العنوان" }, { key: "description", label: "الوصف", multiline: true }, { key: "duration", label: "المدة" }, { key: "image", label: "الصورة", dir: "ltr" }]} newItem={{ id: "", category: "", categoryLabel: "", client: "", title: "", description: "", duration: "", image: "" }} content={content} updateField={updateObjField} removeRow={removeRow} addRow={addRow} />
                </Card>

                <Card title="الوكالة - آراء العملاء">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="شارة القسم" value={asString(readPath(content, ["pages", "agency", "clientStories", "badge"]))} onChange={(v) => setField(["pages", "agency", "clientStories", "badge"], v)} />
                    <Field label="عنوان القسم" value={asString(readPath(content, ["pages", "agency", "clientStories", "title"]))} onChange={(v) => setField(["pages", "agency", "clientStories", "title"], v)} />
                    <Field label="نص الإنجاز" value={asString(readPath(content, ["pages", "agency", "clientStories", "achievement"]))} onChange={(v) => setField(["pages", "agency", "clientStories", "achievement"], v)} />
                    <Field label="اسم العميل" value={asString(readPath(content, ["pages", "agency", "clientStories", "authorName"]))} onChange={(v) => setField(["pages", "agency", "clientStories", "authorName"], v)} />
                    <Field label="الدور" value={asString(readPath(content, ["pages", "agency", "clientStories", "authorRole"]))} onChange={(v) => setField(["pages", "agency", "clientStories", "authorRole"], v)} />
                    <Field label="صورة العميل" value={asString(readPath(content, ["pages", "agency", "clientStories", "authorImage"]))} onChange={(v) => setField(["pages", "agency", "clientStories", "authorImage"], v)} dir="ltr" />
                  </div>
                  <div className="mt-4"><Field label="الوصف" value={asString(readPath(content, ["pages", "agency", "clientStories", "subtitle"]))} onChange={(v) => setField(["pages", "agency", "clientStories", "subtitle"], v)} multiline /></div>
                  <div className="mt-4"><Field label="الاقتباس" value={asString(readPath(content, ["pages", "agency", "clientStories", "quote"]))} onChange={(v) => setField(["pages", "agency", "clientStories", "quote"], v)} multiline /></div>

                  <StrListEditor title="صور العملاء" path={["pages", "agency", "clientStories", "avatars"]} content={content} updateField={updateStrField} removeRow={removeRow} addRow={addRow} />
                  <ObjListEditor title="إحصائيات القسم" path={["pages", "agency", "clientStories", "stats"]} fields={[{ key: "value", label: "القيمة" }, { key: "label", label: "العنوان" }]} newItem={{ value: "", label: "" }} content={content} updateField={updateObjField} removeRow={removeRow} addRow={addRow} />
                </Card>
              </>
            )}

            {tab === "market" && (
              <>
                <Card title="ماركت - دراسات الحالة">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="شارة القسم" value={asString(readPath(content, ["pages", "market", "caseStudies", "badge"]))} onChange={(v) => setField(["pages", "market", "caseStudies", "badge"], v)} />
                    <Field label="عنوان القسم" value={asString(readPath(content, ["pages", "market", "caseStudies", "title"]))} onChange={(v) => setField(["pages", "market", "caseStudies", "title"], v)} />
                    <Field label="عنوان التحدي" value={asString(readPath(content, ["pages", "market", "caseStudies", "challengeTitle"]))} onChange={(v) => setField(["pages", "market", "caseStudies", "challengeTitle"], v)} />
                    <Field label="عنوان الحل" value={asString(readPath(content, ["pages", "market", "caseStudies", "solutionTitle"]))} onChange={(v) => setField(["pages", "market", "caseStudies", "solutionTitle"], v)} />
                    <Field label="اسم العميل" value={asString(readPath(content, ["pages", "market", "caseStudies", "authorName"]))} onChange={(v) => setField(["pages", "market", "caseStudies", "authorName"], v)} />
                    <Field label="الدور" value={asString(readPath(content, ["pages", "market", "caseStudies", "authorRole"]))} onChange={(v) => setField(["pages", "market", "caseStudies", "authorRole"], v)} />
                  </div>
                  <div className="mt-4"><Field label="الوصف" value={asString(readPath(content, ["pages", "market", "caseStudies", "subtitle"]))} onChange={(v) => setField(["pages", "market", "caseStudies", "subtitle"], v)} multiline /></div>
                  <div className="mt-4"><Field label="التحدي" value={asString(readPath(content, ["pages", "market", "caseStudies", "challengeText"]))} onChange={(v) => setField(["pages", "market", "caseStudies", "challengeText"], v)} multiline /></div>
                  <div className="mt-4"><Field label="الحل" value={asString(readPath(content, ["pages", "market", "caseStudies", "solutionText"]))} onChange={(v) => setField(["pages", "market", "caseStudies", "solutionText"], v)} multiline /></div>
                  <div className="mt-4"><Field label="الاقتباس" value={asString(readPath(content, ["pages", "market", "caseStudies", "quote"]))} onChange={(v) => setField(["pages", "market", "caseStudies", "quote"], v)} multiline /></div>

                  <StrListEditor title="تبويبات دراسات الحالة" path={["pages", "market", "caseStudies", "tabs"]} content={content} updateField={updateStrField} removeRow={removeRow} addRow={addRow} />
                  <ObjListEditor title="مؤشرات الحالة" path={["pages", "market", "caseStudies", "metrics"]} fields={[{ key: "value", label: "القيمة" }, { key: "label", label: "العنوان" }]} newItem={{ value: "", label: "" }} content={content} updateField={updateObjField} removeRow={removeRow} addRow={addRow} />
                </Card>

                <Card title="ماركت - أرقام تتحدث عن نفسها">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="شارة القسم" value={asString(readPath(content, ["pages", "market", "numbers", "badge"]))} onChange={(v) => setField(["pages", "market", "numbers", "badge"], v)} />
                    <Field label="عنوان القسم" value={asString(readPath(content, ["pages", "market", "numbers", "title"]))} onChange={(v) => setField(["pages", "market", "numbers", "title"], v)} />
                  </div>
                  <div className="mt-4"><Field label="الوصف" value={asString(readPath(content, ["pages", "market", "numbers", "subtitle"]))} onChange={(v) => setField(["pages", "market", "numbers", "subtitle"], v)} multiline /></div>

                  <ObjListEditor title="بطاقات النتائج" path={["pages", "market", "numbers", "cards"]} fields={[{ key: "title", label: "العنوان" }, { key: "value", label: "القيمة" }, { key: "baseline", label: "الأساس" }, { key: "uplift", label: "النمو" }]} newItem={{ title: "", value: "", baseline: "", uplift: "" }} content={content} updateField={updateObjField} removeRow={removeRow} addRow={addRow} />
                  <ObjListEditor title="الإحصائيات المختصرة" path={["pages", "market", "numbers", "highlights"]} fields={[{ key: "value", label: "القيمة" }, { key: "label", label: "العنوان" }]} newItem={{ value: "", label: "" }} content={content} updateField={updateObjField} removeRow={removeRow} addRow={addRow} />
                </Card>

                <Card title="ماركت - الأسئلة الشائعة">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="شارة القسم" value={asString(readPath(content, ["pages", "market", "faq", "badge"]))} onChange={(v) => setField(["pages", "market", "faq", "badge"], v)} />
                    <Field label="عنوان القسم" value={asString(readPath(content, ["pages", "market", "faq", "title"]))} onChange={(v) => setField(["pages", "market", "faq", "title"], v)} />
                    <Field label="نص CTA" value={asString(readPath(content, ["pages", "market", "faq", "ctaText"]))} onChange={(v) => setField(["pages", "market", "faq", "ctaText"], v)} />
                    <Field label="زر CTA" value={asString(readPath(content, ["pages", "market", "faq", "ctaButton"]))} onChange={(v) => setField(["pages", "market", "faq", "ctaButton"], v)} />
                  </div>
                  <div className="mt-4"><Field label="الوصف" value={asString(readPath(content, ["pages", "market", "faq", "subtitle"]))} onChange={(v) => setField(["pages", "market", "faq", "subtitle"], v)} multiline /></div>
                  <ObjListEditor title="الأسئلة" path={["pages", "market", "faq", "items"]} fields={[{ key: "id", label: "ID", dir: "ltr" }, { key: "question", label: "السؤال" }, { key: "answer", label: "الإجابة", multiline: true }]} newItem={{ id: "", question: "", answer: "" }} content={content} updateField={updateObjField} removeRow={removeRow} addRow={addRow} />
                </Card>
              </>
            )}

            {tab === "media" && (
              <>
                <Card title="ميديا - ماذا نقدم؟">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="شارة القسم" value={asString(readPath(content, ["pages", "media", "services", "badge"]))} onChange={(v) => setField(["pages", "media", "services", "badge"], v)} />
                    <Field label="عنوان القسم" value={asString(readPath(content, ["pages", "media", "services", "title"]))} onChange={(v) => setField(["pages", "media", "services", "title"], v)} />
                  </div>
                  <div className="mt-4"><Field label="الوصف" value={asString(readPath(content, ["pages", "media", "services", "subtitle"]))} onChange={(v) => setField(["pages", "media", "services", "subtitle"], v)} multiline /></div>
                </Card>

                <Card title="ميديا - المشاريع المميزة">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="شارة القسم" value={asString(readPath(content, ["pages", "media", "projects", "badge"]))} onChange={(v) => setField(["pages", "media", "projects", "badge"], v)} />
                    <Field label="عنوان القسم" value={asString(readPath(content, ["pages", "media", "projects", "title"]))} onChange={(v) => setField(["pages", "media", "projects", "title"], v)} />
                  </div>
                  <ObjListEditor title="مشاريع ميديا" path={["pages", "media", "projects", "items"]} fields={[{ key: "year", label: "السنة" }, { key: "tag", label: "الوسم" }, { key: "client", label: "العميل" }, { key: "title", label: "العنوان" }, { key: "statValue", label: "القيمة" }, { key: "statLabel", label: "عنوان القيمة" }, { key: "image", label: "الصورة", dir: "ltr" }, { key: "tone", label: "tone", dir: "ltr" }]} newItem={{ year: "", tag: "", client: "", title: "", statValue: "", statLabel: "", image: "", tone: "dark" }} content={content} updateField={updateObjField} removeRow={removeRow} addRow={addRow} />
                </Card>

                <Card title="ميديا - لماذا نحن؟">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="شارة القسم" value={asString(readPath(content, ["pages", "media", "whyUs", "badge"]))} onChange={(v) => setField(["pages", "media", "whyUs", "badge"], v)} />
                    <Field label="عنوان القسم" value={asString(readPath(content, ["pages", "media", "whyUs", "title"]))} onChange={(v) => setField(["pages", "media", "whyUs", "title"], v)} />
                  </div>
                  <div className="mt-4"><Field label="الوصف" value={asString(readPath(content, ["pages", "media", "whyUs", "subtitle"]))} onChange={(v) => setField(["pages", "media", "whyUs", "subtitle"], v)} multiline /></div>
                  <ObjListEditor title="إحصائيات لماذا نحن" path={["pages", "media", "whyUs", "stats"]} fields={[{ key: "value", label: "القيمة" }, { key: "label", label: "العنوان" }]} newItem={{ value: "", label: "" }} content={content} updateField={updateObjField} removeRow={removeRow} addRow={addRow} />
                  <ObjListEditor title="ميزات لماذا نحن" path={["pages", "media", "whyUs", "features"]} fields={[{ key: "title", label: "العنوان" }, { key: "description", label: "الوصف", multiline: true }]} newItem={{ title: "", description: "" }} content={content} updateField={updateObjField} removeRow={removeRow} addRow={addRow} />
                </Card>

                <Card title="ميديا - الأسئلة الشائعة">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="شارة القسم" value={asString(readPath(content, ["pages", "media", "faq", "badge"]))} onChange={(v) => setField(["pages", "media", "faq", "badge"], v)} />
                    <Field label="عنوان القسم" value={asString(readPath(content, ["pages", "media", "faq", "title"]))} onChange={(v) => setField(["pages", "media", "faq", "title"], v)} />
                    <Field label="نص CTA" value={asString(readPath(content, ["pages", "media", "faq", "ctaText"]))} onChange={(v) => setField(["pages", "media", "faq", "ctaText"], v)} />
                    <Field label="زر CTA" value={asString(readPath(content, ["pages", "media", "faq", "ctaButton"]))} onChange={(v) => setField(["pages", "media", "faq", "ctaButton"], v)} />
                  </div>
                  <div className="mt-4"><Field label="الوصف" value={asString(readPath(content, ["pages", "media", "faq", "subtitle"]))} onChange={(v) => setField(["pages", "media", "faq", "subtitle"], v)} multiline /></div>
                  <ObjListEditor title="أسئلة ميديا" path={["pages", "media", "faq", "items"]} fields={[{ key: "id", label: "ID", dir: "ltr" }, { key: "question", label: "السؤال" }, { key: "answer", label: "الإجابة", multiline: true }]} newItem={{ id: "", question: "", answer: "" }} content={content} updateField={updateObjField} removeRow={removeRow} addRow={addRow} />
                </Card>
              </>
            )}

            {tab === "tech" && (
              <>
                <Card title="تك - مشاريع غيرت قواعد اللعبة">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="عنوان القسم" value={asString(readPath(content, ["pages", "tech", "projectsSection", "title"]))} onChange={(v) => setField(["pages", "tech", "projectsSection", "title"], v)} />
                  </div>
                  <div className="mt-4"><Field label="الوصف" value={asString(readPath(content, ["pages", "tech", "projectsSection", "subtitle"]))} onChange={(v) => setField(["pages", "tech", "projectsSection", "subtitle"], v)} multiline /></div>

                  <ObjListEditor title="فلاتر تك" path={["pages", "tech", "projectsSection", "filters"]} fields={[{ key: "id", label: "ID", dir: "ltr" }, { key: "label", label: "النص" }]} newItem={{ id: "", label: "" }} content={content} updateField={updateObjField} removeRow={removeRow} addRow={addRow} />

                  <ObjListEditor title="مشاريع تك" path={["pages", "tech", "projectsSection", "projects"]} fields={[{ key: "id", label: "ID", dir: "ltr" }, { key: "title", label: "العنوان" }, { key: "category", label: "category", dir: "ltr" }, { key: "categoryLabel", label: "اسم القسم" }, { key: "description", label: "الوصف", multiline: true }, { key: "year", label: "السنة" }, { key: "image", label: "الصورة", dir: "ltr" }]} newItem={{ id: "", title: "", category: "", categoryLabel: "", description: "", year: "", image: "" }} content={content} updateField={updateObjField} removeRow={removeRow} addRow={addRow} />
                </Card>
              </>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
