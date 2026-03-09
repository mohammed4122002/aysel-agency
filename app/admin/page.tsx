"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { clearContentCache } from "@/lib/site-content-client";
import { defaultSiteContent } from "@/lib/site-content-default";
import { deepMerge } from "@/lib/deep-merge";
import "./admin.css";

type EditorTab = "agency" | "market" | "media" | "tech" | "requests" | "security";
type ObjField = { key: string; label: string; dir?: "rtl" | "ltr"; multiline?: boolean };
type Credentials = { username: string; password: string };
type ConsultationRequest = {
  id: string;
  createdAt: string;
  status: string;
  department: string;
  fullName: string;
  email: string;
  phone: string;
  budget: string;
  details: string;
};

const DEFAULT_CREDENTIALS: Credentials = { username: "admin", password: "admin" };
const CREDENTIALS_KEY = "aysel.admin.credentials";
const SESSION_KEY = "aysel.admin.session";

function loadStoredCredentials(): Credentials {
  if (typeof window === "undefined") return DEFAULT_CREDENTIALS;
  const raw = window.localStorage.getItem(CREDENTIALS_KEY);
  if (!raw) return DEFAULT_CREDENTIALS;
  try {
    const parsed = JSON.parse(raw) as Partial<Credentials>;
    return {
      username: typeof parsed.username === "string" ? parsed.username : DEFAULT_CREDENTIALS.username,
      password: typeof parsed.password === "string" ? parsed.password : DEFAULT_CREDENTIALS.password,
    };
  } catch { return DEFAULT_CREDENTIALS; }
}

function persistCredentials(next: Credentials) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(next));
}

function loadSession(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(SESSION_KEY) === "1";
}

function persistSession(active: boolean) {
  if (typeof window === "undefined") return;
  if (active) window.localStorage.setItem(SESSION_KEY, "1");
  else window.localStorage.removeItem(SESSION_KEY);
}

function readPath(obj: unknown, path: string[]) {
  let cursor: unknown = obj;
  for (const part of path) {
    if (cursor && typeof cursor === "object" && part in (cursor as Record<string, unknown>))
      cursor = (cursor as Record<string, unknown>)[part];
    else return undefined;
  }
  return cursor;
}

function writePath(obj: unknown, path: string[], value: unknown) {
  if (!obj || typeof obj !== "object") return obj;
  const draft = structuredClone(obj) as Record<string, unknown>;
  let cursor: Record<string, unknown> = draft;
  for (let i = 0; i < path.length - 1; i++) {
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

function normalizeSearch(value: string) {
  return value.trim().toLowerCase();
}

function formatDateLabel(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "تاريخ غير متاح";
  return date.toLocaleString("ar-SA", { dateStyle: "medium", timeStyle: "short" });
}

async function uploadImageFile(file: File) {
  if (!file.type.startsWith("image/")) throw new Error("يرجى اختيار صورة فقط.");
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch("/api/admin/files", { method: "POST", body: formData });
  const data = (await response.json()) as { ok?: boolean; path?: string; error?: string };
  if (!response.ok || !data.ok || !data.path) throw new Error(data.error ?? "فشل رفع الصورة");
  return data.path;
}

/* ??? Card wrapper ????????????????????????????????????????????????????????? */
function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="admin-card p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-end gap-3">
        <h3 className="text-right text-[0.98rem] font-bold text-[var(--text)]">{title}</h3>
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[rgba(200,151,58,0.25)]" />
      </div>
      {children}
    </section>
  );
}

/* ??? Field ???????????????????????????????????????????????????????????????? */
function Field({
  label, value, onChange, dir = "rtl", multiline = false, type = "text", placeholder,
}: {
  label: string; value: string; onChange: (next: string) => void;
  dir?: "rtl" | "ltr"; multiline?: boolean; type?: string; placeholder?: string;
}) {
  const base =
    "admin-focus w-full rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-2.5 text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-muted)] focus:border-[rgba(200,151,58,0.55)] focus:bg-[var(--bg-elevated)]";
  return (
    <label className="block text-right">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">{label}</span>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3}
          className={`${base} leading-relaxed`} placeholder={placeholder} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
          dir={dir} className={base} placeholder={placeholder} />
      )}
    </label>
  );
}

/* ??? Single image uploader ???????????????????????????????????????????????? */
function SingleImageUploader({ label, value, onChange }: { label: string; value: string; onChange: (next: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const handleUpload = async (file: File) => {
    setError(""); setUploading(true);
    try { onChange(await uploadImageFile(file)); }
    catch (err) { setError(err instanceof Error ? err.message : "فشل رفع الصورة"); }
    finally { setUploading(false); }
  };
  return (
    <div className="space-y-2 text-right">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">{label}</p>
      {error && <p className="rounded-xl border border-[rgba(224,92,110,0.4)] bg-[rgba(224,92,110,0.1)] px-3 py-2 text-xs font-semibold text-[var(--danger)]">{error}</p>}
      <div className="flex flex-wrap items-center justify-end gap-2">
        <label className="admin-focus inline-flex cursor-pointer items-center rounded-xl border border-[rgba(200,151,58,0.45)] bg-[rgba(200,151,58,0.1)] px-3 py-2 text-xs font-semibold text-[var(--primary-600)] hover:bg-[rgba(200,151,58,0.18)]">
          اختر من الجهاز
          <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; void handleUpload(f); e.currentTarget.value = ""; }} />
        </label>
        {value && (
          <button type="button" onClick={() => onChange("")}
            className="admin-focus rounded-xl border border-[rgba(224,92,110,0.4)] bg-[rgba(224,92,110,0.1)] px-3 py-2 text-xs font-semibold text-[var(--danger)]">
            حذف الصورة
          </button>
        )}
        {uploading && <span className="text-xs text-[var(--text-muted)]">جاري الرفع...</span>}
      </div>
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-3">
        {value ? (
          <div className="overflow-hidden rounded-xl border border-[var(--border)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="preview" className="h-32 w-full object-cover sm:h-36" />
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[rgba(200,151,58,0.2)] bg-[var(--surface-subtle)] p-6 text-center text-xs text-[var(--text-muted)]">
            لا توجد صورة. اختر صورة من جهازك.
          </div>
        )}
      </div>
    </div>
  );
}

/* ??? Tab button ??????????????????????????????????????????????????????????? */
function TabBtn({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className={`admin-focus w-full rounded-xl border px-4 py-2.5 text-sm font-semibold text-right transition-colors ${
        active
          ? "border-[rgba(200,151,58,0.55)] bg-gradient-to-l from-[rgba(200,151,58,0.14)] to-[rgba(200,151,58,0.06)] text-[var(--primary-600)] shadow-[0_4px_20px_rgba(200,151,58,0.12)]"
          : "border-[var(--border)] bg-[var(--panel)] text-[var(--text-muted)] hover:border-[rgba(200,151,58,0.28)] hover:text-[var(--text-soft)]"
      }`}>
      {label}
    </button>
  );
}

function isImageField(field: ObjField) {
  return field.key.toLowerCase().includes("image") || field.label.includes("صورة");
}

/* ??? Object list editor ??????????????????????????????????????????????????? */
function ObjListEditor({ title, path, fields, newItem, content, updateField, removeRow, addRow }: {
  title: string; path: string[]; fields: ObjField[]; newItem: Record<string, unknown>;
  content: unknown;
  updateField: (path: string[], index: number, key: string, value: string) => void;
  removeRow: (path: string[], index: number) => void;
  addRow: (path: string[], item: unknown) => void;
}) {
  const [uploadingByKey, setUploadingByKey] = useState<Record<string, boolean>>({});
  const [uploadError, setUploadError] = useState("");
  const rows = asObjectList(readPath(content, path));
  const getUploadKey = (i: number, k: string) => `${path.join(".")}::${i}::${k}`;

  const uploadImage = async (index: number, key: string, file: File) => {
    const uk = getUploadKey(index, key);
    setUploadError(""); setUploadingByKey((p) => ({ ...p, [uk]: true }));
    try { updateField(path, index, key, await uploadImageFile(file)); }
    catch (e) { setUploadError(e instanceof Error ? e.message : "فشل رفع الصورة"); }
    finally { setUploadingByKey((p) => ({ ...p, [uk]: false })); }
  };

  return (
    <div className="mt-5 space-y-3">
      <div className="flex items-center gap-2 justify-end">
        <p className="text-right text-sm font-bold text-[#d4a84a]">{title}</p>
        <span className="h-px w-8 bg-gradient-to-r from-[rgba(200,151,58,0.4)] to-transparent" />
      </div>
      {uploadError && <p className="rounded-xl border border-[rgba(224,92,110,0.4)] bg-[rgba(224,92,110,0.1)] px-3 py-2 text-right text-xs font-semibold text-[var(--danger)]">{uploadError}</p>}
      {rows.map((row, index) => (
        <div key={`${title}-${index}`} className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-3">
          <div className={`grid gap-3 ${fields.length > 2 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
            {fields.map((item) => {
              const value = asString(row[item.key]);
              const imageLike = isImageField(item);
              const uk = getUploadKey(index, item.key);

              if (!imageLike) return (
                <Field key={`${item.key}-${index}`} label={item.label} value={value}
                  onChange={(next) => updateField(path, index, item.key, next)}
                  dir={item.dir ?? "rtl"} multiline={item.multiline} />
              );

              return (
                <div key={`${item.key}-${index}`} className="space-y-2">
                  <p className="text-right text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">{item.label}</p>
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <label className="admin-focus inline-flex cursor-pointer items-center rounded-xl border border-[rgba(200,151,58,0.45)] bg-[rgba(200,151,58,0.1)] px-3 py-2 text-xs font-semibold text-[var(--primary-600)]">
                      اختر من الجهاز
                      <input type="file" accept="image/*" className="hidden"
                        onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; void uploadImage(index, item.key, f); e.currentTarget.value = ""; }} />
                    </label>
                    {uploadingByKey[uk] && <span className="text-xs text-[var(--text-muted)]">جاري الرفع...</span>}
                  </div>
                  <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-3">
                    {value ? (
                      <div className="overflow-hidden rounded-xl border border-[var(--border)]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={value} alt="preview" className="h-44 w-full object-cover sm:h-56" />
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-[rgba(200,151,58,0.2)] bg-[var(--surface-subtle)] p-6 text-center text-xs text-[var(--text-muted)]">
                        لا توجد صورة بعد
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-right">
            <button type="button" onClick={() => removeRow(path, index)}
              className="admin-focus rounded-xl border border-[rgba(224,92,110,0.35)] bg-[rgba(224,92,110,0.08)] px-3 py-2 text-xs font-semibold text-[var(--danger)] hover:bg-[rgba(224,92,110,0.14)]">
              حذف
            </button>
          </div>
        </div>
      ))}
      <div className="text-right">
        <button type="button" onClick={() => addRow(path, newItem)}
          className="admin-focus rounded-xl border border-[rgba(200,151,58,0.4)] bg-[rgba(200,151,58,0.08)] px-4 py-2 text-sm font-semibold text-[var(--primary-600)] hover:bg-[rgba(200,151,58,0.15)]">
          + إضافة
        </button>
      </div>
    </div>
  );
}

/* ??? String list editor ??????????????????????????????????????????????????? */
function StrListEditor({ title, path, content, updateField, removeRow, addRow, imageOnly = false }: {
  title: string; path: string[]; content: unknown;
  updateField: (path: string[], index: number, value: string) => void;
  removeRow: (path: string[], index: number) => void;
  addRow: (path: string[], item: unknown) => void;
  imageOnly?: boolean;
}) {
  const rows = asStringList(readPath(content, path));
  const [uploadingByIndex, setUploadingByIndex] = useState<Record<number, boolean>>({});
  const [uploadError, setUploadError] = useState("");

  const uploadAtIndex = async (index: number, file: File) => {
    setUploadError(""); setUploadingByIndex((p) => ({ ...p, [index]: true }));
    try { updateField(path, index, await uploadImageFile(file)); }
    catch (e) { setUploadError(e instanceof Error ? e.message : "فشل رفع الصورة"); }
    finally { setUploadingByIndex((p) => ({ ...p, [index]: false })); }
  };

  const addImage = async (file: File) => {
    setUploadError("");
    try { addRow(path, await uploadImageFile(file)); }
    catch (e) { setUploadError(e instanceof Error ? e.message : "فشل رفع الصورة"); }
  };

  return (
    <div className="mt-5 space-y-3">
      <div className="flex items-center gap-2 justify-end">
        <p className="text-right text-sm font-bold text-[#d4a84a]">{title}</p>
        <span className="h-px w-8 bg-gradient-to-r from-[rgba(200,151,58,0.4)] to-transparent" />
      </div>
      {uploadError && <p className="rounded-xl border border-[rgba(224,92,110,0.4)] bg-[rgba(224,92,110,0.1)] px-3 py-2 text-right text-xs font-semibold text-[var(--danger)]">{uploadError}</p>}

      {imageOnly ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((row, index) => (
            <div key={`${title}-${index}`} className="admin-card-soft space-y-3 p-3">
              <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
                {row ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={row} alt="preview" className="h-24 w-full object-cover sm:h-28" />
                ) : (
                  <div className="flex h-24 items-center justify-center text-xs text-[var(--text-muted)]">لا توجد صورة</div>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="admin-focus inline-flex cursor-pointer items-center rounded-xl border border-[rgba(200,151,58,0.45)] bg-[rgba(200,151,58,0.1)] px-3 py-2 text-xs font-semibold text-[var(--primary-600)]">
                  استبدال
                  <input type="file" accept="image/*" className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; void uploadAtIndex(index, f); e.currentTarget.value = ""; }} />
                </label>
                {uploadingByIndex[index] && <span className="text-xs text-[var(--text-muted)]">جاري الرفع...</span>}
                <button type="button" onClick={() => removeRow(path, index)}
                  className="admin-focus rounded-xl border border-[rgba(224,92,110,0.35)] bg-[rgba(224,92,110,0.08)] px-3 py-2 text-xs font-semibold text-[var(--danger)]">
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        rows.map((row, index) => (
          <div key={`${title}-${index}`}
            className="grid gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-3 md:grid-cols-[1fr_auto] md:items-end">
            <Field label={`العنصر ${index + 1}`} value={row} onChange={(next) => updateField(path, index, next)} />
            <button type="button" onClick={() => removeRow(path, index)}
              className="admin-focus rounded-xl border border-[rgba(224,92,110,0.35)] bg-[rgba(224,92,110,0.08)] px-3 py-2 text-xs font-semibold text-[var(--danger)]">
              حذف
            </button>
          </div>
        ))
      )}

      <div className="text-right">
        {imageOnly ? (
          <label className="admin-focus inline-flex cursor-pointer items-center rounded-xl border border-[rgba(200,151,58,0.4)] bg-[rgba(200,151,58,0.08)] px-4 py-2 text-sm font-semibold text-[var(--primary-600)] hover:bg-[rgba(200,151,58,0.15)]">
            + إضافة صورة
            <input type="file" accept="image/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; void addImage(f); e.currentTarget.value = ""; }} />
          </label>
        ) : (
          <button type="button" onClick={() => addRow(path, "")}
            className="admin-focus rounded-xl border border-[rgba(200,151,58,0.4)] bg-[rgba(200,151,58,0.08)] px-4 py-2 text-sm font-semibold text-[var(--primary-600)] hover:bg-[rgba(200,151,58,0.15)]">
            + إضافة
          </button>
        )}
      </div>
    </div>
  );
}

const tabs: Array<{ id: EditorTab; label: string }> = [
  { id: "agency",   label: "الوكالة" },
  { id: "market",   label: "ماركت"   },
  { id: "media",    label: "ميديا"   },
  { id: "tech",     label: "تك"      },
  { id: "requests", label: "الطلبات" },
  { id: "security", label: "الدخول"  },
];

const tabSearchKeywords: Record<EditorTab, string[]> = {
  agency: ["الوكالة", "portfolio", "projects", "clients", "معرض", "عملاء"],
  market: ["ماركت", "case studies", "faq", "numbers", "حالات", "أسئلة"],
  media: ["ميديا", "projects", "services", "why us", "خدمات", "مشاريع"],
  tech: ["تك", "projects", "filters", "technical", "تقني", "فلاتر"],
  requests: ["الطلبات", "consultation", "leads", "استشارات", "طلبات"],
  security: ["الدخول", "security", "credentials", "password", "كلمة السر"],
};

const departmentLabels: Record<string, string> = {
  all: "الكل",
  market: "ماركت",
  media: "ميديا",
  tech: "تك",
};

const tabDescriptions: Record<EditorTab, string> = {
  agency:   "إدارة أقسام الوكالة: معرض الأعمال وآراء العملاء.",
  market:   "إدارة دراسات الحالة، الأرقام، والأسئلة الشائعة لقسم ماركت.",
  media:    "إدارة خدمات ومشاريع ميديا ولماذا نحن والأسئلة الشائعة.",
  tech:     "إدارة مشاريع قسم تك والفلاتر والمحتوى المرتبط بها.",
  requests: "عرض طلبات الاستشارة القادمة من نموذج الموقع المخزنة في قاعدة البيانات.",
  security: "تحديث بيانات الدخول الخاصة بلوحة الإدارة.",
};

/* ????????????????????????????????????????????????????
   MAIN PAGE
   ???????????????????????????????????????????????????? */
export default function AdminPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const [credentials, setCredentials] = useState<Credentials>(DEFAULT_CREDENTIALS);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginUser, setLoginUser]   = useState("");
  const [loginPass, setLoginPass]   = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginNote, setLoginNote]   = useState("");
  const [changeUser, setChangeUser] = useState("");
  const [changePass, setChangePass] = useState("");
  const [newUser, setNewUser]       = useState("");
  const [newPass, setNewPass]       = useState("");
  const [newPassConfirm, setNewPassConfirm] = useState("");
  const [changeError, setChangeError]   = useState("");
  const [changeSuccess, setChangeSuccess] = useState("");
  const [tab, setTab]       = useState<EditorTab>("agency");
  const [dashboardSearch, setDashboardSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError]     = useState("");
  const [content, setContent] = useState<unknown>(structuredClone(defaultSiteContent));
  const [savedSnapshot, setSavedSnapshot] = useState("");
  const [lastSavedAt, setLastSavedAt] = useState("");
  const [consultationRequests, setConsultationRequests] = useState<ConsultationRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState("");
  const [requestsQuery, setRequestsQuery] = useState("");
  const [requestsDepartmentFilter, setRequestsDepartmentFilter] = useState("all");
  const [copiedKey, setCopiedKey] = useState("");

  useEffect(() => {
    setCredentials(loadStoredCredentials());
    setIsAuthenticated(loadSession());
    setHasMounted(true);
  }, []);

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError(""); setLoginNote("");
    if (!loginUser.trim() || !loginPass.trim()) { setLoginError("يرجى إدخال اسم المستخدم وكلمة السر."); return; }
    if (loginUser.trim() !== credentials.username || loginPass !== credentials.password) { setLoginError("بيانات الدخول غير صحيحة."); return; }
    setIsAuthenticated(true); persistSession(true); setLoginNote("تم تسجيل الدخول بنجاح."); setLoginPass("");
  };

  const handleLogout = () => {
    setIsAuthenticated(false); persistSession(false);
    setLoginUser(""); setLoginPass(""); setLoginError("");
  };

  const handleChangeCredentials = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setChangeError(""); setChangeSuccess("");
    if (!changeUser.trim() || !changePass.trim()) { setChangeError("يرجى إدخال بيانات الدخول الحالية."); return; }
    if (changeUser.trim() !== credentials.username || changePass !== credentials.password) { setChangeError("بيانات الدخول الحالية غير صحيحة."); return; }
    if (!newUser.trim() || !newPass.trim()) { setChangeError("يرجى إدخال اسم مستخدم وكلمة سر جديدين."); return; }
    if (newPass !== newPassConfirm) { setChangeError("تأكيد كلمة السر غير مطابق."); return; }
    const updated = { username: newUser.trim(), password: newPass };
    setCredentials(updated); persistCredentials(updated);
    setChangeSuccess("تم تحديث بيانات الدخول بنجاح.");
    setChangeUser(""); setChangePass(""); setNewUser(""); setNewPass(""); setNewPassConfirm("");
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/content", { cache: "no-store" });
        const data = (await res.json()) as { ok?: boolean; error?: string; content?: unknown };
        if (!res.ok || data.ok === false) throw new Error(data.error ?? "تعذر تحميل المحتوى من قاعدة البيانات.");
        const merged = structuredClone(deepMerge(defaultSiteContent, data.content));
        setContent(merged);
        setSavedSnapshot(JSON.stringify(merged));
        setLastSavedAt(formatDateLabel(new Date().toISOString()));
      } catch (err) { setError(err instanceof Error ? err.message : "تعذر تحميل المحتوى."); }
      finally { setLoading(false); }
    };
    run();
  }, [isAuthenticated]);

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

  const updateObjField = (path: string[], index: number, key: string, value: string) =>
    updateList(path, (items) => { const row = asObject(items[index]); row[key] = value; items[index] = row; });

  const updateStrField = (path: string[], index: number, value: string) =>
    updateList(path, (items) => { items[index] = value; });

  const removeRow = (path: string[], index: number) => updateList(path, (items) => items.splice(index, 1));
  const addRow    = (path: string[], item: unknown)  => updateList(path, (items) => items.push(item));

  const hasUnsavedChanges = useMemo(() => {
    if (loading || !savedSnapshot) return false;
    try {
      return JSON.stringify(content) !== savedSnapshot;
    } catch {
      return true;
    }
  }, [content, loading, savedSnapshot]);

  const save = async () => {
    setSaving(true); setMessage(""); setError("");
    if (!hasUnsavedChanges) {
      setSaving(false);
      setMessage("لا توجد تغييرات جديدة للحفظ.");
      return;
    }
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const payload = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !payload.ok) throw new Error(payload.error ?? "تعذر حفظ المحتوى.");
      clearContentCache();
      setSavedSnapshot(JSON.stringify(content));
      setLastSavedAt(formatDateLabel(new Date().toISOString()));
      setMessage("تم حفظ التعديلات بنجاح ?");
    } catch (err) { setError(err instanceof Error ? err.message : "تعذر حفظ المحتوى."); }
    finally { setSaving(false); }
  };

  const loadConsultationRequests = useCallback(async () => {
    setRequestsLoading(true);
    setRequestsError("");
    try {
      const res = await fetch("/api/consultation?limit=150", { cache: "no-store" });
      const data = (await res.json()) as { ok?: boolean; error?: string; items?: unknown[] };
      if (!res.ok || !data.ok) throw new Error(data.error ?? "تعذر تحميل الطلبات.");
      const items = Array.isArray(data.items) ? (data.items as ConsultationRequest[]) : [];
      setConsultationRequests(items);
    } catch (err) {
      setRequestsError(err instanceof Error ? err.message : "تعذر تحميل الطلبات.");
      setConsultationRequests([]);
    } finally {
      setRequestsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated || tab !== "requests") return;
    void loadConsultationRequests();
  }, [isAuthenticated, tab, loadConsultationRequests]);

  const statGroups: Record<EditorTab, Array<{ label: string; count: number }>> = {
    agency: [
      { label: "مشاريع المعرض",    count: asObjectList(readPath(content, ["pages","agency","portfolio","projects"])).length },
      { label: "فلاتر المعرض",     count: asObjectList(readPath(content, ["pages","agency","portfolio","filters"])).length },
      { label: "إحصائيات العملاء", count: asObjectList(readPath(content, ["pages","agency","clientStories","stats"])).length },
    ],
    market: [
      { label: "تبويبات الحالات", count: asStringList(readPath(content, ["pages","market","caseStudies","tabs"])).length },
      { label: "مؤشرات الحالة",   count: asObjectList(readPath(content, ["pages","market","caseStudies","metrics"])).length },
      { label: "أسئلة ماركت",     count: asObjectList(readPath(content, ["pages","market","faq","items"])).length },
    ],
    media: [
      { label: "مشاريع ميديا",        count: asObjectList(readPath(content, ["pages","media","projects","items"])).length },
      { label: "إحصائيات لماذا نحن", count: asObjectList(readPath(content, ["pages","media","whyUs","stats"])).length },
      { label: "أسئلة ميديا",         count: asObjectList(readPath(content, ["pages","media","faq","items"])).length },
    ],
    tech: [
      { label: "مشاريع تك",  count: asObjectList(readPath(content, ["pages","tech","projectsSection","projects"])).length },
      { label: "فلاتر تك",   count: asObjectList(readPath(content, ["pages","tech","projectsSection","filters"])).length },
      { label: "كتل المحتوى", count: asObject(readPath(content, ["pages","tech"])).projectsSection ? 1 : 0 },
    ],
    requests: [
      { label: "إجمالي الطلبات", count: consultationRequests.length },
      { label: "طلبات بميزانية", count: consultationRequests.filter((item) => Boolean(item.budget)).length },
      { label: "طلبات جديدة", count: consultationRequests.filter((item) => item.status === "new").length },
    ],
    security: [
      { label: "جلسة نشطة",      count: isAuthenticated ? 1 : 0 },
      { label: "تحديثات الدخول", count: 1 },
      { label: "سياسات الأمان",  count: 0 },
    ],
  };

  const activeStats = statGroups[tab];
  const maxStat = Math.max(1, ...activeStats.map((s) => s.count));
  const normalizedDashboardSearch = normalizeSearch(dashboardSearch);
  const normalizedRequestsSearch = normalizeSearch(requestsQuery);

  const quickTabMatches = useMemo(() => {
    if (!normalizedDashboardSearch) return [];
    return tabs.filter((item) => {
      const haystack = [
        item.label,
        tabDescriptions[item.id],
        ...tabSearchKeywords[item.id],
      ].join(" ");
      return normalizeSearch(haystack).includes(normalizedDashboardSearch);
    });
  }, [normalizedDashboardSearch]);

  const requestDepartmentOptions = useMemo(() => {
    const unique = new Set<string>();
    for (const item of consultationRequests) {
      const value = item.department.trim();
      if (value) unique.add(value);
    }
    return ["all", ...Array.from(unique)];
  }, [consultationRequests]);

  const filteredConsultationRequests = useMemo(() => {
    return consultationRequests.filter((item) => {
      if (requestsDepartmentFilter !== "all" && item.department !== requestsDepartmentFilter) {
        return false;
      }
      if (!normalizedRequestsSearch) return true;
      const searchable = [
        item.fullName,
        item.email,
        item.phone,
        item.department,
        item.budget,
        item.details,
      ].join(" ");
      return normalizeSearch(searchable).includes(normalizedRequestsSearch);
    });
  }, [consultationRequests, normalizedRequestsSearch, requestsDepartmentFilter]);

  const handleCopyValue = useCallback(async (value: string, key: string) => {
    if (!value.trim()) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      window.setTimeout(() => {
        setCopiedKey((prev) => (prev === key ? "" : prev));
      }, 1400);
    } catch {
      setError("تعذر نسخ النص إلى الحافظة.");
    }
  }, []);

  if (!hasMounted) {
    return (
      <main className="admin-theme admin-surface min-h-screen">
        <div className="admin-auth-shell">
          <section className="admin-auth-card">
            <div className="text-right">
              <p style={{ letterSpacing: "0.22em" }}
                className="text-[9px] font-bold uppercase text-[var(--gold-500)]">
                AYSEL ADMIN
              </p>
              <h1 className="mt-2 text-2xl font-bold text-[var(--text)]">جاري تهيئة لوحة التحكم...</h1>
              <p className="mt-3 text-sm text-[var(--text-muted)]">يرجى الانتظار لحظة.</p>
            </div>
          </section>
        </div>
      </main>
    );
  }

  /* ??? Login screen ??????????????????????????????????????????????????????? */
  if (!isAuthenticated) {
    return (
      <main className="admin-theme admin-surface min-h-screen">
        <div className="admin-auth-shell">
          <section className="admin-auth-card">
            {/* Logo / brand mark */}
            <div className="mb-8 text-right">
              <p style={{ letterSpacing: "0.22em" }}
                className="text-[9px] font-bold uppercase text-[var(--gold-500)]">
                AYSEL SECURE ACCESS
              </p>
              <h1 className="mt-2 text-3xl font-bold text-[var(--text)]">
                بوابة الإدارة
              </h1>
              <div className="mt-2 h-px w-20 mr-auto bg-gradient-to-r from-[#c8973a] via-[#e8cc88] to-transparent" />
              <p className="mt-3 text-sm text-[var(--text-muted)]">
                بيانات الدخول الافتراضية:{" "}
                <span className="font-semibold text-[var(--primary-600)]">admin / admin</span>
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleLogin}>
              <Field label="اسم المستخدم" value={loginUser} onChange={setLoginUser} dir="ltr" placeholder="admin" />
              <Field label="كلمة السر" value={loginPass} onChange={setLoginPass} dir="ltr" type="password" placeholder="••••••••" />

              {loginError && (
                <div className="rounded-xl border border-[rgba(224,92,110,0.4)] bg-[rgba(224,92,110,0.1)] px-4 py-3 text-right text-xs text-[var(--danger)]">
                  {loginError}
                </div>
              )}
              {loginNote && (
                <div className="rounded-xl border border-[rgba(78,201,148,0.4)] bg-[rgba(78,201,148,0.1)] px-4 py-3 text-right text-xs text-[var(--success)]">
                  {loginNote}
                </div>
              )}

              <button type="submit"
                className="admin-focus mt-2 w-full rounded-xl bg-gradient-to-r from-[#e2c183] via-[#cfaa62] to-[#bc8a3f] px-4 py-3 text-sm font-bold text-[#1e2d4a] shadow-[0_8px_24px_rgba(200,151,58,0.28)]">
                دخول الإدارة
              </button>
            </form>
          </section>
        </div>
      </main>
    );
  }

  /* ??? Main dashboard ????????????????????????????????????????????????????? */
  return (
    <main className="admin-theme admin-surface min-h-screen text-[var(--text)]">
      <div className="mx-auto w-full max-w-[1520px] px-4 py-5 sm:px-6 lg:px-8">

        {/* Header */}
        <header className="admin-panel admin-glow p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-right">
              <p style={{ letterSpacing: "0.2em" }}
                className="text-[9px] font-bold uppercase text-[var(--gold-500)]">
                AYSEL ADMIN
              </p>
              <h1 className="mt-1 text-xl font-bold text-[var(--text)] sm:text-2xl">
                لوحة التحكم
              </h1>
              <p className="text-xs text-[var(--text-muted)]">إدارة محتوى كاملة لجميع أقسام الموقع</p>
            </div>

            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
              <div className="relative min-w-[220px] grow sm:grow-0">
                <input
                  type="search"
                  value={dashboardSearch}
                  onChange={(e) => setDashboardSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key !== "Enter") return;
                    const first = quickTabMatches[0];
                    if (!first) return;
                    e.preventDefault();
                    setTab(first.id);
                    setDashboardSearch("");
                  }}
                  placeholder="ابحث عن قسم (ماركت، ميديا، الطلبات...)"
                  className="admin-focus w-full rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] px-10 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none focus:border-[rgba(200,151,58,0.5)]"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[var(--text-muted)]">
                  بحث
                </span>
                {normalizedDashboardSearch && (
                  <div className="admin-search-dropdown">
                    {quickTabMatches.length ? (
                      quickTabMatches.slice(0, 5).map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setTab(item.id);
                            setDashboardSearch("");
                          }}
                          className="admin-focus admin-search-item"
                        >
                          <span className="text-xs text-[var(--text-muted)]">{tabDescriptions[item.id]}</span>
                          <strong className="text-sm font-bold text-[var(--text)]">{item.label}</strong>
                        </button>
                      ))
                    ) : (
                      <p className="px-3 py-2 text-right text-xs text-[var(--text-muted)]">لا يوجد قسم مطابق.</p>
                    )}
                  </div>
                )}
              </div>

              <span
                className={`admin-chip px-3 py-2 text-[10px] ${
                  hasUnsavedChanges ? "admin-chip-strong" : ""
                }`}
              >
                {hasUnsavedChanges ? "تغييرات غير محفوظة" : "جميع التغييرات محفوظة"}
              </span>

              <button type="button" onClick={save} disabled={loading || saving || !hasUnsavedChanges}
                className="admin-focus rounded-xl bg-gradient-to-r from-[#e2c183] via-[#cfaa62] to-[#bc8a3f] px-4 py-2.5 text-sm font-bold text-[#1e2d4a] shadow-[0_6px_18px_rgba(200,151,58,0.22)] disabled:opacity-50">
                {saving ? "جاري الحفظ..." : hasUnsavedChanges ? "حفظ كل التعديلات" : "لا يوجد تعديلات"}
              </button>

              <button type="button" onClick={handleLogout}
                className="admin-focus rounded-xl border border-[rgba(224,92,110,0.35)] bg-[rgba(224,92,110,0.08)] px-4 py-2.5 text-sm font-semibold text-[var(--danger)] hover:bg-[rgba(224,92,110,0.14)]">
                تسجيل خروج
              </button>
            </div>
          </div>
        </header>

        <section className="mt-4 lg:hidden">
          <div className="admin-card p-3">
            <p className="mb-2 text-right text-[11px] font-semibold text-[var(--text-muted)]">تنقل سريع بين الأقسام</p>
            <div className="flex gap-2 overflow-x-auto pb-1 [direction:rtl]">
              {tabs.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={`admin-focus shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    tab === item.id
                      ? "border-[rgba(200,151,58,0.55)] bg-[rgba(200,151,58,0.14)] text-[var(--primary-600)]"
                      : "border-[var(--border)] bg-[var(--panel)] text-[var(--text-muted)]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-5 grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">

          {/* Sidebar */}
          <aside className="space-y-3 xl:sticky xl:top-4 xl:self-start">

            <section className="admin-card p-4">
              <p style={{ letterSpacing: "0.18em" }}
                className="mb-3 text-right text-[9px] font-bold uppercase text-[var(--gold-500)]">
                الأقسام
              </p>
              <div className="space-y-1.5">
                {tabs.map((item) => (
                  <TabBtn key={item.id} active={tab === item.id} label={item.label} onClick={() => setTab(item.id)} />
                ))}
              </div>
            </section>

            <section className="admin-card p-4">
              <p style={{ letterSpacing: "0.18em" }}
                className="mb-3 text-right text-[9px] font-bold uppercase text-[var(--gold-500)]">
                إحصائيات سريعة
              </p>
              <div className="space-y-2">
                {activeStats.map((item) => (
                  <article key={item.label} className="admin-card-soft px-3 py-2.5">
                    <p className="text-right text-[11px] text-[var(--text-muted)]">{item.label}</p>
                    <p className="text-right text-2xl font-extrabold text-[var(--text)]">{item.count}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="admin-card p-4">
              <p style={{ letterSpacing: "0.18em" }}
                className="mb-3 text-right text-[9px] font-bold uppercase text-[var(--gold-500)]">
                إجراءات سريعة
              </p>
              <div className="space-y-2">
                <button type="button" onClick={() => setContent(structuredClone(defaultSiteContent))}
                  className="admin-focus w-full rounded-xl border border-[rgba(212,168,74,0.4)] bg-[rgba(212,168,74,0.08)] px-3 py-2.5 text-sm font-semibold text-[var(--warning)] hover:bg-[rgba(212,168,74,0.14)]">
                  إعادة المحتوى الافتراضي
                </button>
                <button type="button" onClick={save} disabled={loading || saving || !hasUnsavedChanges}
                  className="admin-focus w-full rounded-xl bg-gradient-to-r from-[#e2c183] via-[#cfaa62] to-[#bc8a3f] px-3 py-2.5 text-sm font-bold text-[#1e2d4a] disabled:opacity-50">
                  {hasUnsavedChanges ? "حفظ الآن" : "لا يوجد تعديلات"}
                </button>
                <Link href="/"
                  className="admin-focus block w-full rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-2.5 text-center text-sm font-semibold text-[var(--text-soft)] hover:border-[rgba(200,151,58,0.28)]">
                  العودة للموقع
                </Link>
              </div>
            </section>
          </aside>

          {/* Main content */}
          <section className="admin-panel p-4 sm:p-6">

            {/* Section header */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
              <span className="admin-chip inline-flex items-center gap-1.5 px-3 py-2 text-xs">
                <span className="status-dot" />
                وضع التحرير مفعل
              </span>
              <div className="text-right">
                <h2 className="text-lg font-bold text-[var(--text)]">
                  {tabs.find((t) => t.id === tab)?.label}
                </h2>
                <p className="text-xs text-[var(--text-muted)]">{tabDescriptions[tab]}</p>
              </div>
            </div>

            {/* KPI cards */}
            <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {activeStats.map((item, i) => {
                const width = Math.max(12, Math.round((item.count / maxStat) * 100));
                return (
                  <article key={item.label} className="admin-card-soft admin-kpi p-4 text-right">
                    <div className="flex items-start justify-between gap-2">
                      <span className={`admin-chip ${i === 0 ? "admin-chip-strong" : ""} px-2.5 py-1 text-[10px]`}>
                        {i === 0 ? "رئيسي" : "ثانوي"}
                      </span>
                      <p className="text-[11px] text-[var(--text-muted)]">{item.label}</p>
                    </div>
                    <p className="mt-2 text-2xl font-extrabold text-[var(--text)]">{item.count}</p>
                    <div className="mt-3 admin-stat-line">
                      <span style={{ width: `${width}%` }} />
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Alerts */}
            {message && (
              <p className="mb-4 rounded-xl border border-[rgba(78,201,148,0.4)] bg-[rgba(78,201,148,0.1)] px-4 py-3 text-sm font-semibold text-[var(--success)]">
                {message}
              </p>
            )}
            {error && (
              <p className="mb-4 rounded-xl border border-[rgba(224,92,110,0.4)] bg-[rgba(224,92,110,0.1)] px-4 py-3 text-sm font-semibold text-[var(--danger)]">
                {error}
              </p>
            )}

            {loading ? (
              <div className="admin-card-soft admin-skeleton rounded-2xl p-10 text-center text-sm text-[var(--text-muted)]">
                جاري تحميل البيانات...
              </div>
            ) : (
              <div className="space-y-5">

                {/* ?? AGENCY ?? */}
                {tab === "agency" && (
                  <>
                    <Card title="الوكالة — معرض الأعمال">
                      <div className="grid gap-4 md:grid-cols-2">
                        <Field label="شارة القسم" value={asString(readPath(content, ["pages","agency","portfolio","badge"]))} onChange={(v) => setField(["pages","agency","portfolio","badge"], v)} />
                        <Field label="عنوان القسم" value={asString(readPath(content, ["pages","agency","portfolio","title"]))} onChange={(v) => setField(["pages","agency","portfolio","title"], v)} />
                        <Field label="نص زر عرض جميع الأعمال" value={asString(readPath(content, ["pages","agency","portfolio","viewAllLabel"]))} onChange={(v) => setField(["pages","agency","portfolio","viewAllLabel"], v)} />
                      </div>
                      <div className="mt-4"><Field label="وصف القسم" value={asString(readPath(content, ["pages","agency","portfolio","subtitle"]))} onChange={(v) => setField(["pages","agency","portfolio","subtitle"], v)} multiline /></div>
                      <ObjListEditor title="فلاتر المعرض" path={["pages","agency","portfolio","filters"]} fields={[{key:"id",label:"ID",dir:"ltr"},{key:"label",label:"النص"}]} newItem={{id:"",label:""}} content={content} updateField={updateObjField} removeRow={removeRow} addRow={addRow} />
                      <ObjListEditor title="المشاريع" path={["pages","agency","portfolio","projects"]} fields={[{key:"id",label:"ID",dir:"ltr"},{key:"category",label:"category",dir:"ltr"},{key:"categoryLabel",label:"التصنيف"},{key:"client",label:"العميل"},{key:"title",label:"العنوان"},{key:"description",label:"الوصف",multiline:true},{key:"duration",label:"المدة"},{key:"image",label:"الصورة",dir:"ltr"}]} newItem={{id:"",category:"",categoryLabel:"",client:"",title:"",description:"",duration:"",image:""}} content={content} updateField={updateObjField} removeRow={removeRow} addRow={addRow} />
                    </Card>

                    <Card title="الوكالة — آراء العملاء">
                      <div className="grid gap-4 xl:grid-cols-2">
                        <div className="space-y-4">
                          <section className="admin-card-soft p-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="admin-chip px-2.5 py-1 text-[10px]">واجهة العرض</span>
                              <p className="text-sm font-semibold text-[var(--text-soft)]">محتوى القسم</p>
                            </div>
                            <div className="mt-3 grid gap-3 md:grid-cols-2">
                              <Field label="شارة القسم" value={asString(readPath(content, ["pages","agency","clientStories","badge"]))} onChange={(v) => setField(["pages","agency","clientStories","badge"], v)} />
                              <Field label="عنوان القسم" value={asString(readPath(content, ["pages","agency","clientStories","title"]))} onChange={(v) => setField(["pages","agency","clientStories","title"], v)} />
                            </div>
                            <div className="mt-3"><Field label="الوصف" value={asString(readPath(content, ["pages","agency","clientStories","subtitle"]))} onChange={(v) => setField(["pages","agency","clientStories","subtitle"], v)} multiline /></div>
                          </section>
                          <details className="admin-card-soft p-4">
                            <summary className="cursor-pointer text-sm font-semibold text-[var(--text-soft)]">بيانات احتياطية</summary>
                            <div className="mt-3 grid gap-3 md:grid-cols-2">
                              <Field label="نص الإنجاز" value={asString(readPath(content, ["pages","agency","clientStories","achievement"]))} onChange={(v) => setField(["pages","agency","clientStories","achievement"], v)} />
                              <Field label="اسم العميل" value={asString(readPath(content, ["pages","agency","clientStories","authorName"]))} onChange={(v) => setField(["pages","agency","clientStories","authorName"], v)} />
                              <Field label="الدور" value={asString(readPath(content, ["pages","agency","clientStories","authorRole"]))} onChange={(v) => setField(["pages","agency","clientStories","authorRole"], v)} />
                            </div>
                            <div className="mt-3"><Field label="الاقتباس" value={asString(readPath(content, ["pages","agency","clientStories","quote"]))} onChange={(v) => setField(["pages","agency","clientStories","quote"], v)} multiline /></div>
                            <div className="mt-3"><SingleImageUploader label="صورة العميل" value={asString(readPath(content, ["pages","agency","clientStories","authorImage"]))} onChange={(v) => setField(["pages","agency","clientStories","authorImage"], v)} /></div>
                          </details>
                          <section className="admin-card-soft p-4">
                            <ObjListEditor title="إحصائيات القسم" path={["pages","agency","clientStories","stats"]} fields={[{key:"value",label:"القيمة"},{key:"label",label:"العنوان"}]} newItem={{value:"",label:""}} content={content} updateField={updateObjField} removeRow={removeRow} addRow={addRow} />
                          </section>
                        </div>
                        <section className="admin-card-soft p-4">
                          <ObjListEditor title="قائمة آراء العملاء" path={["pages","agency","clientStories","items"]} fields={[{key:"id",label:"ID",dir:"ltr"},{key:"name",label:"اسم العميل"},{key:"role",label:"الدور"},{key:"achievement",label:"الإنجاز"},{key:"quote",label:"الاقتباس",multiline:true},{key:"image",label:"الصورة",dir:"ltr"}]} newItem={{id:"",name:"",role:"",achievement:"",quote:"",image:""}} content={content} updateField={updateObjField} removeRow={removeRow} addRow={addRow} />
                        </section>
                      </div>
                    </Card>
                  </>
                )}

                {/* ?? MARKET ?? */}
                {tab === "market" && (
                  <>
                    <Card title="ماركت — دراسات الحالة">
                      <div className="grid gap-4 md:grid-cols-2">
                        <Field label="شارة القسم" value={asString(readPath(content, ["pages","market","caseStudies","badge"]))} onChange={(v) => setField(["pages","market","caseStudies","badge"], v)} />
                        <Field label="عنوان القسم" value={asString(readPath(content, ["pages","market","caseStudies","title"]))} onChange={(v) => setField(["pages","market","caseStudies","title"], v)} />
                        <Field label="عنوان التحدي" value={asString(readPath(content, ["pages","market","caseStudies","challengeTitle"]))} onChange={(v) => setField(["pages","market","caseStudies","challengeTitle"], v)} />
                        <Field label="عنوان الحل" value={asString(readPath(content, ["pages","market","caseStudies","solutionTitle"]))} onChange={(v) => setField(["pages","market","caseStudies","solutionTitle"], v)} />
                        <Field label="اسم العميل" value={asString(readPath(content, ["pages","market","caseStudies","authorName"]))} onChange={(v) => setField(["pages","market","caseStudies","authorName"], v)} />
                        <Field label="الدور" value={asString(readPath(content, ["pages","market","caseStudies","authorRole"]))} onChange={(v) => setField(["pages","market","caseStudies","authorRole"], v)} />
                      </div>
                      <div className="mt-4"><Field label="الوصف" value={asString(readPath(content, ["pages","market","caseStudies","subtitle"]))} onChange={(v) => setField(["pages","market","caseStudies","subtitle"], v)} multiline /></div>
                      <div className="mt-4"><Field label="التحدي" value={asString(readPath(content, ["pages","market","caseStudies","challengeText"]))} onChange={(v) => setField(["pages","market","caseStudies","challengeText"], v)} multiline /></div>
                      <div className="mt-4"><Field label="الحل" value={asString(readPath(content, ["pages","market","caseStudies","solutionText"]))} onChange={(v) => setField(["pages","market","caseStudies","solutionText"], v)} multiline /></div>
                      <div className="mt-4"><Field label="الاقتباس" value={asString(readPath(content, ["pages","market","caseStudies","quote"]))} onChange={(v) => setField(["pages","market","caseStudies","quote"], v)} multiline /></div>
                      <StrListEditor title="تبويبات دراسات الحالة" path={["pages","market","caseStudies","tabs"]} content={content} updateField={updateStrField} removeRow={removeRow} addRow={addRow} />
                      <ObjListEditor title="مؤشرات الحالة" path={["pages","market","caseStudies","metrics"]} fields={[{key:"value",label:"القيمة"},{key:"label",label:"العنوان"}]} newItem={{value:"",label:""}} content={content} updateField={updateObjField} removeRow={removeRow} addRow={addRow} />
                    </Card>

                    <Card title="ماركت — أرقام تتحدث عن نفسها">
                      <div className="grid gap-4 md:grid-cols-2">
                        <Field label="شارة القسم" value={asString(readPath(content, ["pages","market","numbers","badge"]))} onChange={(v) => setField(["pages","market","numbers","badge"], v)} />
                        <Field label="عنوان القسم" value={asString(readPath(content, ["pages","market","numbers","title"]))} onChange={(v) => setField(["pages","market","numbers","title"], v)} />
                      </div>
                      <div className="mt-4"><Field label="الوصف" value={asString(readPath(content, ["pages","market","numbers","subtitle"]))} onChange={(v) => setField(["pages","market","numbers","subtitle"], v)} multiline /></div>
                      <ObjListEditor title="بطاقات النتائج" path={["pages","market","numbers","cards"]} fields={[{key:"title",label:"العنوان"},{key:"value",label:"القيمة"},{key:"baseline",label:"الأساس"},{key:"uplift",label:"النمو"}]} newItem={{title:"",value:"",baseline:"",uplift:""}} content={content} updateField={updateObjField} removeRow={removeRow} addRow={addRow} />
                      <ObjListEditor title="الإحصائيات المختصرة" path={["pages","market","numbers","highlights"]} fields={[{key:"value",label:"القيمة"},{key:"label",label:"العنوان"}]} newItem={{value:"",label:""}} content={content} updateField={updateObjField} removeRow={removeRow} addRow={addRow} />
                    </Card>

                    <Card title="ماركت — الأسئلة الشائعة">
                      <div className="grid gap-4 md:grid-cols-2">
                        <Field label="شارة القسم" value={asString(readPath(content, ["pages","market","faq","badge"]))} onChange={(v) => setField(["pages","market","faq","badge"], v)} />
                        <Field label="عنوان القسم" value={asString(readPath(content, ["pages","market","faq","title"]))} onChange={(v) => setField(["pages","market","faq","title"], v)} />
                        <Field label="نص CTA" value={asString(readPath(content, ["pages","market","faq","ctaText"]))} onChange={(v) => setField(["pages","market","faq","ctaText"], v)} />
                        <Field label="زر CTA" value={asString(readPath(content, ["pages","market","faq","ctaButton"]))} onChange={(v) => setField(["pages","market","faq","ctaButton"], v)} />
                      </div>
                      <div className="mt-4"><Field label="الوصف" value={asString(readPath(content, ["pages","market","faq","subtitle"]))} onChange={(v) => setField(["pages","market","faq","subtitle"], v)} multiline /></div>
                      <ObjListEditor title="الأسئلة" path={["pages","market","faq","items"]} fields={[{key:"id",label:"ID",dir:"ltr"},{key:"question",label:"السؤال"},{key:"answer",label:"الإجابة",multiline:true}]} newItem={{id:"",question:"",answer:""}} content={content} updateField={updateObjField} removeRow={removeRow} addRow={addRow} />
                    </Card>
                  </>
                )}

                {/* ?? MEDIA ?? */}
                {tab === "media" && (
                  <>
                    <Card title="ميديا — ماذا نقدم؟">
                      <div className="grid gap-4 md:grid-cols-2">
                        <Field label="شارة القسم" value={asString(readPath(content, ["pages","media","services","badge"]))} onChange={(v) => setField(["pages","media","services","badge"], v)} />
                        <Field label="عنوان القسم" value={asString(readPath(content, ["pages","media","services","title"]))} onChange={(v) => setField(["pages","media","services","title"], v)} />
                      </div>
                      <div className="mt-4"><Field label="الوصف" value={asString(readPath(content, ["pages","media","services","subtitle"]))} onChange={(v) => setField(["pages","media","services","subtitle"], v)} multiline /></div>
                    </Card>

                    <Card title="ميديا — المشاريع المميزة">
                      <div className="grid gap-4 md:grid-cols-2">
                        <Field label="شارة القسم" value={asString(readPath(content, ["pages","media","projects","badge"]))} onChange={(v) => setField(["pages","media","projects","badge"], v)} />
                        <Field label="عنوان القسم" value={asString(readPath(content, ["pages","media","projects","title"]))} onChange={(v) => setField(["pages","media","projects","title"], v)} />
                      </div>
                      <ObjListEditor title="مشاريع ميديا" path={["pages","media","projects","items"]} fields={[{key:"year",label:"السنة"},{key:"tag",label:"الوسم"},{key:"client",label:"العميل"},{key:"title",label:"العنوان"},{key:"statValue",label:"القيمة"},{key:"statLabel",label:"عنوان القيمة"},{key:"image",label:"الصورة",dir:"ltr"},{key:"tone",label:"tone",dir:"ltr"}]} newItem={{year:"",tag:"",client:"",title:"",statValue:"",statLabel:"",image:"",tone:"dark"}} content={content} updateField={updateObjField} removeRow={removeRow} addRow={addRow} />
                    </Card>

                    <Card title="ميديا — لماذا نحن؟">
                      <div className="grid gap-4 md:grid-cols-2">
                        <Field label="شارة القسم" value={asString(readPath(content, ["pages","media","whyUs","badge"]))} onChange={(v) => setField(["pages","media","whyUs","badge"], v)} />
                        <Field label="عنوان القسم" value={asString(readPath(content, ["pages","media","whyUs","title"]))} onChange={(v) => setField(["pages","media","whyUs","title"], v)} />
                      </div>
                      <div className="mt-4"><Field label="الوصف" value={asString(readPath(content, ["pages","media","whyUs","subtitle"]))} onChange={(v) => setField(["pages","media","whyUs","subtitle"], v)} multiline /></div>
                      <ObjListEditor title="إحصائيات لماذا نحن" path={["pages","media","whyUs","stats"]} fields={[{key:"value",label:"القيمة"},{key:"label",label:"العنوان"}]} newItem={{value:"",label:""}} content={content} updateField={updateObjField} removeRow={removeRow} addRow={addRow} />
                      <ObjListEditor title="ميزات لماذا نحن" path={["pages","media","whyUs","features"]} fields={[{key:"title",label:"العنوان"},{key:"description",label:"الوصف",multiline:true}]} newItem={{title:"",description:""}} content={content} updateField={updateObjField} removeRow={removeRow} addRow={addRow} />
                    </Card>

                    <Card title="ميديا — الأسئلة الشائعة">
                      <div className="grid gap-4 md:grid-cols-2">
                        <Field label="شارة القسم" value={asString(readPath(content, ["pages","media","faq","badge"]))} onChange={(v) => setField(["pages","media","faq","badge"], v)} />
                        <Field label="عنوان القسم" value={asString(readPath(content, ["pages","media","faq","title"]))} onChange={(v) => setField(["pages","media","faq","title"], v)} />
                        <Field label="نص CTA" value={asString(readPath(content, ["pages","media","faq","ctaText"]))} onChange={(v) => setField(["pages","media","faq","ctaText"], v)} />
                        <Field label="زر CTA" value={asString(readPath(content, ["pages","media","faq","ctaButton"]))} onChange={(v) => setField(["pages","media","faq","ctaButton"], v)} />
                      </div>
                      <div className="mt-4"><Field label="الوصف" value={asString(readPath(content, ["pages","media","faq","subtitle"]))} onChange={(v) => setField(["pages","media","faq","subtitle"], v)} multiline /></div>
                      <ObjListEditor title="أسئلة ميديا" path={["pages","media","faq","items"]} fields={[{key:"id",label:"ID",dir:"ltr"},{key:"question",label:"السؤال"},{key:"answer",label:"الإجابة",multiline:true}]} newItem={{id:"",question:"",answer:""}} content={content} updateField={updateObjField} removeRow={removeRow} addRow={addRow} />
                    </Card>
                  </>
                )}

                {/* ?? TECH ?? */}
                {tab === "tech" && (
                  <Card title="تك — مشاريع غيرت قواعد اللعبة">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="عنوان القسم" value={asString(readPath(content, ["pages","tech","projectsSection","title"]))} onChange={(v) => setField(["pages","tech","projectsSection","title"], v)} />
                    </div>
                    <div className="mt-4"><Field label="الوصف" value={asString(readPath(content, ["pages","tech","projectsSection","subtitle"]))} onChange={(v) => setField(["pages","tech","projectsSection","subtitle"], v)} multiline /></div>
                    <ObjListEditor title="فلاتر تك" path={["pages","tech","projectsSection","filters"]} fields={[{key:"id",label:"ID",dir:"ltr"},{key:"label",label:"النص"}]} newItem={{id:"",label:""}} content={content} updateField={updateObjField} removeRow={removeRow} addRow={addRow} />
                    <ObjListEditor title="مشاريع تك" path={["pages","tech","projectsSection","projects"]} fields={[{key:"id",label:"ID",dir:"ltr"},{key:"title",label:"العنوان"},{key:"category",label:"category",dir:"ltr"},{key:"categoryLabel",label:"اسم القسم"},{key:"description",label:"الوصف",multiline:true},{key:"year",label:"السنة"},{key:"image",label:"الصورة",dir:"ltr"}]} newItem={{id:"",title:"",category:"",categoryLabel:"",description:"",year:"",image:""}} content={content} updateField={updateObjField} removeRow={removeRow} addRow={addRow} />
                  </Card>
                )}

                {/* ?? REQUESTS ?? */}
                {tab === "requests" && (
                  <Card title="طلبات الاستشارة">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => void loadConsultationRequests()}
                        className="admin-focus rounded-xl border border-[rgba(200,151,58,0.4)] bg-[rgba(200,151,58,0.08)] px-4 py-2 text-xs font-semibold text-[var(--primary-600)] hover:bg-[rgba(200,151,58,0.15)]"
                      >
                        تحديث الطلبات
                      </button>
                      <p className="text-right text-xs text-[var(--text-muted)]">آخر 150 طلب من قاعدة البيانات</p>
                    </div>

                    <div className="mb-3 grid gap-2 md:grid-cols-[minmax(0,1fr)_180px_auto]">
                      <input
                        type="search"
                        value={requestsQuery}
                        onChange={(e) => setRequestsQuery(e.target.value)}
                        placeholder="ابحث بالاسم أو البريد أو الهاتف أو التفاصيل..."
                        className="admin-focus w-full rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)]"
                      />

                      <select
                        value={requestsDepartmentFilter}
                        onChange={(e) => setRequestsDepartmentFilter(e.target.value)}
                        className="admin-focus rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-2 text-sm text-[var(--text)]"
                      >
                        {requestDepartmentOptions.map((department) => (
                          <option key={department} value={department}>
                            {departmentLabels[department] ?? department}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => {
                          setRequestsQuery("");
                          setRequestsDepartmentFilter("all");
                        }}
                        className="admin-focus rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-2 text-xs font-semibold text-[var(--text-soft)] hover:border-[rgba(200,151,58,0.28)]"
                      >
                        مسح الفلاتر
                      </button>
                    </div>

                    <p className="mb-4 text-right text-xs text-[var(--text-muted)]">
                      عرض {filteredConsultationRequests.length} من أصل {consultationRequests.length} طلب.
                    </p>

                    {requestsLoading ? (
                      <p className="rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] px-4 py-3 text-right text-sm text-[var(--text-muted)]">
                        جاري تحميل الطلبات...
                      </p>
                    ) : requestsError ? (
                      <p className="rounded-xl border border-[rgba(224,92,110,0.4)] bg-[rgba(224,92,110,0.1)] px-4 py-3 text-right text-sm text-[var(--danger)]">
                        {requestsError}
                      </p>
                    ) : filteredConsultationRequests.length === 0 ? (
                      <p className="rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] px-4 py-3 text-right text-sm text-[var(--text-muted)]">
                        {consultationRequests.length === 0 ? "لا توجد طلبات حتى الآن." : "لا توجد نتائج مطابقة للفلاتر الحالية."}
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {filteredConsultationRequests.map((request) => (
                          <article key={request.id} className="admin-card-soft space-y-3 p-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="text-right">
                                <p className="text-sm font-bold text-[var(--text)]">{request.fullName}</p>
                                <p className="text-xs text-[var(--text-muted)]">{request.email}</p>
                              </div>
                              <span className="admin-chip px-2.5 py-1 text-[10px]">
                                {formatDateLabel(request.createdAt)}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center justify-end gap-2">
                              <span className="admin-chip px-2.5 py-1 text-[10px]">القسم: {departmentLabels[request.department] || request.department || "-"}</span>
                              <span className="admin-chip px-2.5 py-1 text-[10px]">الميزانية: {request.budget || "-"}</span>
                              <span className="admin-chip px-2.5 py-1 text-[10px]">الحالة: {request.status || "-"}</span>
                              {request.phone ? <span className="admin-chip px-2.5 py-1 text-[10px]">الهاتف: {request.phone}</span> : null}
                            </div>

                            <div className="flex flex-wrap items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => void handleCopyValue(request.email, `${request.id}:email`)}
                                className="admin-focus rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] px-2.5 py-1.5 text-[11px] font-semibold text-[var(--text-soft)]"
                              >
                                {copiedKey === `${request.id}:email` ? "تم نسخ البريد" : "نسخ البريد"}
                              </button>
                              {request.phone ? (
                                <button
                                  type="button"
                                  onClick={() => void handleCopyValue(request.phone, `${request.id}:phone`)}
                                  className="admin-focus rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] px-2.5 py-1.5 text-[11px] font-semibold text-[var(--text-soft)]"
                                >
                                  {copiedKey === `${request.id}:phone` ? "تم نسخ الهاتف" : "نسخ الهاتف"}
                                </button>
                              ) : null}
                            </div>

                            <details className="rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-3">
                              <summary className="cursor-pointer text-right text-xs font-semibold text-[var(--text-muted)]">
                                تفاصيل الطلب
                              </summary>
                              <p className="mt-2 text-right text-xs leading-relaxed text-[var(--text-soft)]">
                                {request.details || "لا توجد تفاصيل إضافية."}
                              </p>
                            </details>
                          </article>
                        ))}
                      </div>
                    )}
                  </Card>
                )}

                {/* ?? SECURITY ?? */}
                {tab === "security" && (
                  <Card title="إعدادات الدخول">
                    <div className="admin-card-soft p-4">
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                        <span className="admin-chip px-3 py-1.5 text-xs">
                          المستخدم: <span className="font-bold text-[var(--primary-600)] mr-1">{credentials.username}</span>
                        </span>
                        <div className="text-right">
                          <p style={{ letterSpacing: "0.18em" }} className="text-[9px] font-bold uppercase text-[var(--gold-500)]">تحديث بيانات الدخول</p>
                          <h3 className="text-base font-bold text-[var(--text)]">اسم المستخدم وكلمة السر</h3>
                        </div>
                      </div>

                      <form className="grid gap-3 md:grid-cols-2" onSubmit={handleChangeCredentials}>
                        <Field label="اسم المستخدم الحالي" value={changeUser} onChange={setChangeUser} dir="ltr" placeholder="admin" />
                        <Field label="كلمة السر الحالية" value={changePass} onChange={setChangePass} dir="ltr" type="password" placeholder="••••••••" />
                        <Field label="اسم المستخدم الجديد" value={newUser} onChange={setNewUser} dir="ltr" placeholder="new-admin" />
                        <Field label="كلمة السر الجديدة" value={newPass} onChange={setNewPass} dir="ltr" type="password" placeholder="••••••••" />
                        <Field label="تأكيد كلمة السر" value={newPassConfirm} onChange={setNewPassConfirm} dir="ltr" type="password" placeholder="••••••••" />
                        <div className="flex items-end">
                          <button type="submit"
                            className="admin-focus w-full rounded-xl bg-gradient-to-r from-[#e2c183] via-[#cfaa62] to-[#bc8a3f] px-4 py-2.5 text-sm font-bold text-[#1e2d4a] shadow-[0_6px_18px_rgba(200,151,58,0.22)]">
                            تحديث بيانات الدخول
                          </button>
                        </div>
                      </form>

                      {changeError && (
                        <div className="mt-3 rounded-xl border border-[rgba(224,92,110,0.4)] bg-[rgba(224,92,110,0.1)] px-4 py-3 text-right text-xs text-[var(--danger)]">
                          {changeError}
                        </div>
                      )}
                      {changeSuccess && (
                        <div className="mt-3 rounded-xl border border-[rgba(78,201,148,0.4)] bg-[rgba(78,201,148,0.1)] px-4 py-3 text-right text-xs text-[var(--success)]">
                          {changeSuccess}
                        </div>
                      )}
                    </div>
                  </Card>
                )}

              </div>
            )}
          </section>
        </div>

        <section className="admin-savebar">
          <div className="admin-savebar-inner">
            <div className="text-right">
              <p className="text-xs font-semibold text-[var(--text-soft)]">
                {hasUnsavedChanges ? "لديك تغييرات غير محفوظة" : "كل شيء محفوظ"}
              </p>
              <p className="text-[11px] text-[var(--text-muted)]">
                {lastSavedAt ? `آخر حفظ: ${lastSavedAt}` : "لم يتم الحفظ بعد"}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={save}
                disabled={loading || saving || !hasUnsavedChanges}
                className="admin-focus rounded-xl bg-gradient-to-r from-[#e2c183] via-[#cfaa62] to-[#bc8a3f] px-4 py-2 text-sm font-bold text-[#1e2d4a] disabled:opacity-50"
              >
                {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}


