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
    <section className="rounded-3xl border border-[#1b3550] bg-[linear-gradient(180deg,#102238_0%,#0b1a2b_100%)] p-5 shadow-[0_18px_42px_rgba(2,10,20,0.45)] sm:p-6">
      <h3 className="mb-4 text-right text-[1.05rem] font-bold text-[#e6f0fb]">{title}</h3>
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
    "w-full rounded-xl border border-[#26435f] bg-[#0a1929] px-3 py-2.5 text-sm text-[#e6f0fb] outline-none transition-colors placeholder:text-[#7f96b0] focus:border-[#28d58b] focus:bg-[#0d2135]";

  return (
    <label className="block text-right">
      <span className="mb-1.5 block text-sm font-semibold text-[#a9bdd4]">{label}</span>
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
      className={`w-full rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
        active
          ? "border-[#28d58b] bg-[#133528] text-[#d5ffe9] shadow-[0_10px_26px_rgba(40,213,139,0.16)]"
          : "border-[#223c57] bg-[#0e1f31] text-[#9eb4cc] hover:border-[#31526f] hover:text-[#dbe8f7]"
      }`}
    >
      {label}
    </button>
  );
}

function isImageField(field: ObjField) {
  const key = field.key.toLowerCase();
  return key.includes("image") || field.label.includes("صورة");
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
  const [uploadingByKey, setUploadingByKey] = useState<Record<string, boolean>>({});
  const [uploadError, setUploadError] = useState("");
  const rows = asObjectList(readPath(content, path));

  const getUploadKey = (index: number, key: string) => `${path.join(".")}::${index}::${key}`;

  const uploadImage = async (index: number, key: string, file: File) => {
    const uploadKey = getUploadKey(index, key);
    setUploadError("");
    setUploadingByKey((prev) => ({ ...prev, [uploadKey]: true }));

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/files", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as { ok?: boolean; path?: string; error?: string };
      if (!response.ok || !data.ok || !data.path) {
        throw new Error(data.error ?? "فشل رفع الصورة");
      }

      updateField(path, index, key, data.path);
    } catch (error) {
      const message = error instanceof Error ? error.message : "فشل رفع الصورة";
      setUploadError(message);
    } finally {
      setUploadingByKey((prev) => ({ ...prev, [uploadKey]: false }));
    }
  };

  return (
    <div className="mt-5 space-y-3">
      <p className="text-right text-sm font-bold text-[#b6c8dc]">{title}</p>
      {uploadError ? (
        <p className="rounded-xl border border-[#6e2230] bg-[#36121b] px-3 py-2 text-right text-xs font-semibold text-[#ffb8c4]">
          {uploadError}
        </p>
      ) : null}
      {rows.map((row, index) => (
        <div key={`${title}-${index}`} className="space-y-3 rounded-xl border border-[#244260] bg-[#0a1a2b] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className={`grid gap-3 ${fields.length > 2 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
            {fields.map((item) => {
              const value = asString(row[item.key]);
              const imageLike = isImageField(item);
              const uploadKey = getUploadKey(index, item.key);
              const isUploading = Boolean(uploadingByKey[uploadKey]);

              if (!imageLike) {
                return (
                  <Field
                    key={`${item.key}-${index}`}
                    label={item.label}
                    value={value}
                    onChange={(next) => updateField(path, index, item.key, next)}
                    dir={item.dir ?? "rtl"}
                    multiline={item.multiline}
                  />
                );
              }

              return (
                <div key={`${item.key}-${index}`} className="space-y-2">
                  <Field
                    label={item.label}
                    value={value}
                    onChange={(next) => updateField(path, index, item.key, next)}
                    dir={item.dir ?? "ltr"}
                    multiline={item.multiline}
                  />

                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <label className="inline-flex cursor-pointer items-center rounded-xl border border-[#2d8f66] bg-[#133526] px-3 py-2 text-xs font-semibold text-[#b9f5d8]">
                      اختر من الجهاز
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (!file) return;
                          void uploadImage(index, item.key, file);
                          event.currentTarget.value = "";
                        }}
                      />
                    </label>
                    {isUploading ? (
                      <span className="text-xs font-semibold text-[#9dd9bd]">جاري رفع الصورة...</span>
                    ) : null}
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-[#2b4965] bg-[linear-gradient(180deg,#0a1828_0%,#081423_100%)] p-3">
                    {value ? (
                      <>
                        <div className="group relative overflow-hidden rounded-xl border border-[#31516f] bg-[#0b1b2d]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={value}
                            alt="preview"
                            className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] sm:h-56"
                          />
                          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-[#02070f]/85 to-transparent px-3 pb-2 pt-6">
                            <a
                              href={value}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-lg border border-[#3f6283] bg-[#0e243a]/90 px-2.5 py-1 text-[11px] font-semibold text-[#cfe2f7] hover:border-[#4f7ca5]"
                            >
                              فتح الصورة كاملة
                            </a>
                            <span className="rounded-md border border-[#2d8f66] bg-[#133526] px-2 py-1 text-[10px] font-semibold text-[#b9f5d8]">
                              معاينة
                            </span>
                          </div>
                        </div>
                        <p className="mt-2 truncate text-right text-[11px] text-[#8da4bc]" dir="ltr">
                          {value}
                        </p>
                      </>
                    ) : (
                      <div className="rounded-xl border border-dashed border-[#2b4965] bg-[#0a1a2b] p-6 text-center text-xs font-semibold text-[#7f96b0]">
                        لا توجد صورة بعد. اختر صورة من جهازك لعرض معاينة.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-right">
            <button
              type="button"
              onClick={() => removeRow(path, index)}
              className="rounded-xl border border-[#6e2230] bg-[#36121b] px-3 py-2 text-sm font-semibold text-[#ff9dad]"
            >
              حذف
            </button>
          </div>
        </div>
      ))}
      <div className="text-right">
        <button
          type="button"
          onClick={() => addRow(path, newItem)}
          className="rounded-xl border border-[#2d8f66] bg-[#133526] px-4 py-2 text-sm font-semibold text-[#b9f5d8]"
        >
          + إضافة
        </button>
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
      <p className="text-right text-sm font-bold text-[#b6c8dc]">{title}</p>
      {rows.map((row, index) => (
        <div key={`${title}-${index}`} className="grid gap-3 rounded-xl border border-[#244260] bg-[#0a1a2b] p-3 md:grid-cols-[1fr_auto] md:items-end">
          <Field label={`العنصر ${index + 1}`} value={row} onChange={(next) => updateField(path, index, next)} />
          <button
            type="button"
            onClick={() => removeRow(path, index)}
            className="rounded-xl border border-[#6e2230] bg-[#36121b] px-3 py-2 text-sm font-semibold text-[#ff9dad]"
          >
            حذف
          </button>
        </div>
      ))}
      <div className="text-right">
        <button
          type="button"
          onClick={() => addRow(path, "")}
          className="rounded-xl border border-[#2d8f66] bg-[#133526] px-4 py-2 text-sm font-semibold text-[#b9f5d8]"
        >
          + إضافة
        </button>
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

  const tabDescriptions: Record<EditorTab, string> = {
    agency: "إدارة أقسام الوكالة: معرض الأعمال وآراء العملاء.",
    market: "إدارة دراسات الحالة، الأرقام، والأسئلة الشائعة لقسم ماركت.",
    media: "إدارة خدمات ومشاريع ميديا ولماذا نحن والأسئلة الشائعة.",
    tech: "إدارة مشاريع قسم تك والفلاتر والمحتوى المرتبط بها.",
  };

  const statGroups: Record<EditorTab, Array<{ label: string; count: number }>> = {
    agency: [
      { label: "مشاريع المعرض", count: asObjectList(readPath(content, ["pages", "agency", "portfolio", "projects"])).length },
      { label: "فلاتر المعرض", count: asObjectList(readPath(content, ["pages", "agency", "portfolio", "filters"])).length },
      { label: "إحصائيات العملاء", count: asObjectList(readPath(content, ["pages", "agency", "clientStories", "stats"])).length },
    ],
    market: [
      { label: "تبويبات الحالات", count: asStringList(readPath(content, ["pages", "market", "caseStudies", "tabs"])).length },
      { label: "مؤشرات الحالة", count: asObjectList(readPath(content, ["pages", "market", "caseStudies", "metrics"])).length },
      { label: "أسئلة ماركت", count: asObjectList(readPath(content, ["pages", "market", "faq", "items"])).length },
    ],
    media: [
      { label: "مشاريع ميديا", count: asObjectList(readPath(content, ["pages", "media", "projects", "items"])).length },
      { label: "إحصائيات لماذا نحن", count: asObjectList(readPath(content, ["pages", "media", "whyUs", "stats"])).length },
      { label: "أسئلة ميديا", count: asObjectList(readPath(content, ["pages", "media", "faq", "items"])).length },
    ],
    tech: [
      { label: "مشاريع تك", count: asObjectList(readPath(content, ["pages", "tech", "projectsSection", "projects"])).length },
      { label: "فلاتر تك", count: asObjectList(readPath(content, ["pages", "tech", "projectsSection", "filters"])).length },
      { label: "كتل المحتوى", count: asObject(readPath(content, ["pages", "tech"])).projectsSection ? 1 : 0 },
    ],
  };

  const activeStats = statGroups[tab];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_82%_12%,rgba(38,216,143,0.16),transparent_34%),radial-gradient(circle_at_18%_84%,rgba(35,109,255,0.14),transparent_30%),linear-gradient(180deg,#050e17_0%,#071523_100%)] text-[#dbe8f5]">
      <div className="mx-auto w-full max-w-[1680px] px-4 py-4 sm:px-6 lg:px-8">
        <header className="rounded-3xl border border-[#1a324b] bg-[linear-gradient(180deg,#102033_0%,#0b1828_100%)] p-4 shadow-[0_24px_52px_rgba(2,10,20,0.45)] sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-right">
              <p className="text-xs font-semibold text-[#8da4bc]">AYSEL ADMIN</p>
              <h1 className="text-[1.3rem] font-extrabold text-[#f2f8ff] sm:text-[1.45rem]">لوحة التحكم الديناميكية</h1>
              <p className="text-sm text-[#8da4bc]">نفس هوية موقعك الأصلية مع إدارة محتوى كاملة لجميع الأقسام</p>
            </div>

            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
              <div className="relative min-w-[220px] grow sm:grow-0">
                <input
                  type="search"
                  placeholder="ابحث داخل لوحة التحكم..."
                  className="w-full rounded-xl border border-[#26435f] bg-[#0b1b2d] px-10 py-2.5 text-sm text-[#e6f0fb] placeholder:text-[#7f96b0] outline-none focus:border-[#28d58b]"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7f96b0]">⌕</span>
              </div>

              <button
                type="button"
                onClick={save}
                disabled={loading || saving}
                className="rounded-xl border border-[#2a8f67] bg-[#163d2d] px-4 py-2.5 text-sm font-bold text-[#d5ffe9] shadow-[0_10px_20px_rgba(40,213,139,0.15)] disabled:opacity-60"
              >
                {saving ? "جاري الحفظ..." : "حفظ كل التعديلات"}
              </button>
            </div>
          </div>
        </header>

        <div className="mt-4 grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="space-y-4 xl:sticky xl:top-4 xl:self-start">
            <section className="rounded-3xl border border-[#1a324b] bg-[linear-gradient(180deg,#102033_0%,#0b1828_100%)] p-4">
              <p className="mb-3 text-right text-sm font-bold text-[#d5e6f7]">الأقسام</p>
              <div className="space-y-2">
                {tabs.map((item) => (
                  <TabBtn key={item.id} active={tab === item.id} label={item.label} onClick={() => setTab(item.id)} />
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-[#1a324b] bg-[linear-gradient(180deg,#102033_0%,#0b1828_100%)] p-4">
              <p className="text-right text-sm font-bold text-[#d5e6f7]">إحصائيات سريعة</p>
              <div className="mt-3 space-y-2.5">
                {activeStats.map((item) => (
                  <article key={item.label} className="rounded-xl border border-[#23415d] bg-[#0a1a2b] px-3 py-2.5">
                    <p className="text-right text-xs text-[#93abc2]">{item.label}</p>
                    <p className="text-right font-[var(--font-manrope)] text-2xl font-extrabold text-[#f2f8ff]">{item.count}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-[#1a324b] bg-[linear-gradient(180deg,#102033_0%,#0b1828_100%)] p-4">
              <p className="mb-3 text-right text-sm font-bold text-[#d5e6f7]">إجراءات سريعة</p>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setContent(structuredClone(defaultSiteContent))}
                  className="w-full rounded-xl border border-[#6f5130] bg-[#352617] px-3 py-2.5 text-sm font-semibold text-[#ffddb3]"
                >
                  إعادة المحتوى الافتراضي
                </button>
                <button
                  type="button"
                  onClick={save}
                  disabled={loading || saving}
                  className="w-full rounded-xl border border-[#2a8f67] bg-[#163d2d] px-3 py-2.5 text-sm font-semibold text-[#d5ffe9] disabled:opacity-60"
                >
                  حفظ الآن
                </button>
                <Link href="/" className="block w-full rounded-xl border border-[#22405d] bg-[#0e1f31] px-3 py-2.5 text-center text-sm font-semibold text-[#c7d9ec]">
                  العودة للموقع
                </Link>
              </div>
            </section>
          </aside>

          <section className="rounded-3xl border border-[#1a324b] bg-[linear-gradient(180deg,#0f2033_0%,#0a1726_100%)] p-4 shadow-[0_20px_40px_rgba(2,10,20,0.4)] sm:p-6">
            <div className="mb-5 grid gap-3 rounded-2xl border border-[#223f5b] bg-[#0a1a2b] p-4 md:grid-cols-[1fr_auto] md:items-center">
              <div className="text-right">
                <h2 className="text-xl font-extrabold text-[#f2f8ff]">إدارة قسم {tabs.find((item) => item.id === tab)?.label}</h2>
                <p className="text-sm text-[#8da4bc]">{tabDescriptions[tab]}</p>
              </div>
              <span className="inline-flex items-center justify-center rounded-xl border border-[#2a8f67] bg-[#163d2d] px-3 py-2 text-sm font-semibold text-[#d5ffe9]">
                وضع التحرير مفعل
              </span>
            </div>

            {message && (
              <p className="mb-4 rounded-xl border border-[#2a8f67] bg-[#163d2d] px-4 py-3 text-sm font-semibold text-[#bff8dc]">
                {message}
              </p>
            )}
            {error && (
              <p className="mb-4 rounded-xl border border-[#6e2230] bg-[#36121b] px-4 py-3 text-sm font-semibold text-[#ffb8c4]">
                {error}
              </p>
            )}

            {loading ? (
              <div className="rounded-2xl border border-[#244260] bg-[#0a1a2b] p-8 text-center text-[#8da4bc]">جاري تحميل البيانات...</div>
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
        </div>
      </div>
    </main>
  );
}
