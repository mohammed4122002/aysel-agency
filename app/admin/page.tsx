"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { clearContentCache } from "@/lib/site-content-client";
import { defaultSiteContent } from "@/lib/site-content-default";
import { deepMerge } from "@/lib/deep-merge";
import "./admin.css";

type EditorTab = "agency" | "market" | "media" | "tech" | "security";

type ObjField = { key: string; label: string; dir?: "rtl" | "ltr"; multiline?: boolean };
type Credentials = { username: string; password: string };

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
  } catch {
    return DEFAULT_CREDENTIALS;
  }
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
  if (active) {
    window.localStorage.setItem(SESSION_KEY, "1");
  } else {
    window.localStorage.removeItem(SESSION_KEY);
  }
}

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

async function uploadImageFile(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("يرجى اختيار صورة فقط.");
  }

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

  return data.path;
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="admin-card p-5 sm:p-6">
      <h3 className="mb-4 text-right text-[0.98rem] font-bold text-[var(--text)]">{title}</h3>
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
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  dir?: "rtl" | "ltr";
  multiline?: boolean;
  type?: string;
  placeholder?: string;
}) {
  const base =
    "admin-focus w-full rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-2.5 text-sm text-[var(--text)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:bg-[var(--bg-elevated)]";

  return (
    <label className="block text-right">
      <span className="mb-1.5 block text-sm font-semibold text-[var(--text-soft)]">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={3}
          className={`${base} leading-relaxed`}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          dir={dir}
          className={base}
          placeholder={placeholder}
        />
      )}
    </label>
  );
}

function SingleImageUploader({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (file: File) => {
    setError("");
    setUploading(true);
    try {
      const path = await uploadImageFile(file);
      onChange(path);
    } catch (err) {
      const message = err instanceof Error ? err.message : "فشل رفع الصورة";
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2 text-right">
      <p className="text-sm font-semibold text-[var(--text-soft)]">{label}</p>
      {error ? (
        <p className="rounded-xl border border-[rgba(255,107,125,0.5)] bg-[rgba(255,107,125,0.12)] px-3 py-2 text-xs font-semibold text-[var(--danger)]">
          {error}
        </p>
      ) : null}
      <div className="flex flex-wrap items-center justify-end gap-2">
        <label className="admin-focus inline-flex cursor-pointer items-center rounded-xl border border-[rgba(47,124,255,0.5)] bg-[rgba(47,124,255,0.16)] px-3 py-2 text-xs font-semibold text-white">
          اختر من الجهاز
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              void handleUpload(file);
              event.currentTarget.value = "";
            }}
          />
        </label>
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="admin-focus rounded-xl border border-[rgba(255,107,125,0.5)] bg-[rgba(255,107,125,0.12)] px-3 py-2 text-xs font-semibold text-[var(--danger)]"
          >
            حذف الصورة
          </button>
        ) : null}
        {uploading ? <span className="text-xs font-semibold text-[var(--text-muted)]">جاري رفع الصورة...</span> : null}
      </div>
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-3">
        {value ? (
          <>
            <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value} alt="preview" className="h-32 w-full object-cover sm:h-36" />
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-[rgba(9,18,34,0.6)] p-6 text-center text-xs font-semibold text-[var(--text-muted)]">
            لا توجد صورة بعد. اختر صورة من جهازك لعرض معاينة.
          </div>
        )}
      </div>
    </div>
  );
}

function TabBtn({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`admin-focus w-full rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
        active
          ? "border-[var(--primary)] bg-[rgba(47,124,255,0.2)] text-white shadow-[0_10px_26px_rgba(47,124,255,0.18)]"
          : "border-[var(--border)] bg-[var(--panel)] text-[var(--text-muted)] hover:border-[var(--border-strong)] hover:text-white"
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
      const imagePath = await uploadImageFile(file);
      updateField(path, index, key, imagePath);
    } catch (error) {
      const message = error instanceof Error ? error.message : "فشل رفع الصورة";
      setUploadError(message);
    } finally {
      setUploadingByKey((prev) => ({ ...prev, [uploadKey]: false }));
    }
  };

  return (
    <div className="mt-5 space-y-3">
      <p className="text-right text-sm font-bold text-[var(--text-soft)]">{title}</p>
      {uploadError ? (
        <p className="rounded-xl border border-[rgba(255,107,125,0.5)] bg-[rgba(255,107,125,0.12)] px-3 py-2 text-right text-xs font-semibold text-[var(--danger)]">
          {uploadError}
        </p>
      ) : null}
      {rows.map((row, index) => (
        <div key={`${title}-${index}`} className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--panel)] p-3 shadow-[var(--shadow-sm)]">
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
                  <p className="text-right text-sm font-semibold text-[var(--text-soft)]">{item.label}</p>

                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <label className="admin-focus inline-flex cursor-pointer items-center rounded-xl border border-[rgba(47,124,255,0.5)] bg-[rgba(47,124,255,0.16)] px-3 py-2 text-xs font-semibold text-white">
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
                      <span className="text-xs font-semibold text-[var(--text-muted)]">جاري رفع الصورة...</span>
                    ) : null}
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-3">
                    {value ? (
                      <>
                        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={value} alt="preview" className="h-44 w-full object-cover sm:h-56" />
                        </div>
                      </>
                    ) : (
                      <div className="rounded-xl border border-dashed border-[var(--border)] bg-[rgba(9,18,34,0.6)] p-6 text-center text-xs font-semibold text-[var(--text-muted)]">
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
              className="admin-focus rounded-xl border border-[rgba(255,107,125,0.5)] bg-[rgba(255,107,125,0.12)] px-3 py-2 text-sm font-semibold text-[var(--danger)]"
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
          className="admin-focus rounded-xl border border-[rgba(47,124,255,0.5)] bg-[rgba(47,124,255,0.16)] px-4 py-2 text-sm font-semibold text-white"
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
  imageOnly = false,
}: {
  title: string;
  path: string[];
  content: unknown;
  updateField: (path: string[], index: number, value: string) => void;
  removeRow: (path: string[], index: number) => void;
  addRow: (path: string[], item: unknown) => void;
  imageOnly?: boolean;
}) {
  const rows = asStringList(readPath(content, path));
  const [uploadingByIndex, setUploadingByIndex] = useState<Record<number, boolean>>({});
  const [uploadError, setUploadError] = useState("");

  const uploadAtIndex = async (index: number, file: File) => {
    setUploadError("");
    setUploadingByIndex((prev) => ({ ...prev, [index]: true }));
    try {
      const imagePath = await uploadImageFile(file);
      updateField(path, index, imagePath);
    } catch (err) {
      const message = err instanceof Error ? err.message : "فشل رفع الصورة";
      setUploadError(message);
    } finally {
      setUploadingByIndex((prev) => ({ ...prev, [index]: false }));
    }
  };

  const addImage = async (file: File) => {
    setUploadError("");
    try {
      const imagePath = await uploadImageFile(file);
      addRow(path, imagePath);
    } catch (err) {
      const message = err instanceof Error ? err.message : "فشل رفع الصورة";
      setUploadError(message);
    }
  };

  return (
    <div className="mt-5 space-y-3">
      <p className="text-right text-sm font-bold text-[var(--text-soft)]">{title}</p>
      {uploadError ? (
        <p className="rounded-xl border border-[rgba(255,107,125,0.5)] bg-[rgba(255,107,125,0.12)] px-3 py-2 text-right text-xs font-semibold text-[var(--danger)]">
          {uploadError}
        </p>
      ) : null}

      {imageOnly ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((row, index) => {
            const isUploading = Boolean(uploadingByIndex[index]);

            return (
              <div key={`${title}-${index}`} className="admin-card-soft space-y-3 p-3">
                <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
                  {row ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={row} alt="preview" className="h-24 w-full object-cover sm:h-28" />
                  ) : (
                    <div className="flex h-24 items-center justify-center text-xs text-[var(--text-muted)]">
                      لا توجد صورة بعد
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="admin-focus inline-flex cursor-pointer items-center rounded-xl border border-[rgba(47,124,255,0.5)] bg-[rgba(47,124,255,0.16)] px-3 py-2 text-xs font-semibold text-white">
                      استبدال
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (!file) return;
                          void uploadAtIndex(index, file);
                          event.currentTarget.value = "";
                        }}
                      />
                    </label>
                    {isUploading ? <span className="text-xs text-[var(--text-muted)]">جاري الرفع...</span> : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeRow(path, index)}
                    className="admin-focus rounded-xl border border-[rgba(255,107,125,0.5)] bg-[rgba(255,107,125,0.12)] px-3 py-2 text-xs font-semibold text-[var(--danger)]"
                  >
                    حذف
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        rows.map((row, index) => (
          <div
            key={`${title}-${index}`}
            className="grid gap-3 rounded-xl border border-[var(--border)] bg-[var(--panel)] p-3 md:grid-cols-[1fr_auto] md:items-end"
          >
            <Field label={`العنصر ${index + 1}`} value={row} onChange={(next) => updateField(path, index, next)} />
            <button
              type="button"
              onClick={() => removeRow(path, index)}
              className="admin-focus rounded-xl border border-[rgba(255,107,125,0.5)] bg-[rgba(255,107,125,0.12)] px-3 py-2 text-sm font-semibold text-[var(--danger)]"
            >
              حذف
            </button>
          </div>
        ))
      )}

      <div className="text-right">
        {imageOnly ? (
          <label className="admin-focus inline-flex cursor-pointer items-center rounded-xl border border-[rgba(47,124,255,0.5)] bg-[rgba(47,124,255,0.16)] px-4 py-2 text-sm font-semibold text-white">
            + إضافة صورة
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                void addImage(file);
                event.currentTarget.value = "";
              }}
            />
          </label>
        ) : (
          <button
            type="button"
            onClick={() => addRow(path, "")}
            className="admin-focus rounded-xl border border-[rgba(47,124,255,0.5)] bg-[rgba(47,124,255,0.16)] px-4 py-2 text-sm font-semibold text-white"
          >
            + إضافة
          </button>
        )}
      </div>
    </div>
  );
}

const tabs: Array<{ id: EditorTab; label: string }> = [
  { id: "agency", label: "الوكالة" },
  { id: "market", label: "ماركت" },
  { id: "media", label: "ميديا" },
  { id: "tech", label: "تك" },
  { id: "security", label: "الدخول" },
];

export default function AdminPage() {
  const [credentials, setCredentials] = useState<Credentials>(() => loadStoredCredentials());
  const [isAuthenticated, setIsAuthenticated] = useState(() => loadSession());
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginNote, setLoginNote] = useState("");
  const [changeUser, setChangeUser] = useState("");
  const [changePass, setChangePass] = useState("");
  const [newUser, setNewUser] = useState("");
  const [newPass, setNewPass] = useState("");
  const [newPassConfirm, setNewPassConfirm] = useState("");
  const [changeError, setChangeError] = useState("");
  const [changeSuccess, setChangeSuccess] = useState("");

  const [tab, setTab] = useState<EditorTab>("agency");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [content, setContent] = useState<unknown>(structuredClone(defaultSiteContent));

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError("");
    setLoginNote("");

    if (!loginUser.trim() || !loginPass.trim()) {
      setLoginError("يرجى إدخال اسم المستخدم وكلمة السر.");
      return;
    }

    if (loginUser.trim() !== credentials.username || loginPass !== credentials.password) {
      setLoginError("بيانات الدخول غير صحيحة.");
      return;
    }

    setIsAuthenticated(true);
    persistSession(true);
    setLoginNote("تم تسجيل الدخول بنجاح.");
    setLoginPass("");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    persistSession(false);
    setLoginUser("");
    setLoginPass("");
    setLoginError("");
  };

  const handleChangeCredentials = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setChangeError("");
    setChangeSuccess("");

    if (!changeUser.trim() || !changePass.trim()) {
      setChangeError("يرجى إدخال بيانات الدخول الحالية.");
      return;
    }

    if (changeUser.trim() !== credentials.username || changePass !== credentials.password) {
      setChangeError("بيانات الدخول الحالية غير صحيحة.");
      return;
    }

    if (!newUser.trim() || !newPass.trim()) {
      setChangeError("يرجى إدخال اسم مستخدم وكلمة سر جديدين.");
      return;
    }

    if (newPass !== newPassConfirm) {
      setChangeError("تأكيد كلمة السر غير مطابق.");
      return;
    }

    const updated = { username: newUser.trim(), password: newPass };
    setCredentials(updated);
    persistCredentials(updated);
    setChangeSuccess("تم تحديث بيانات الدخول بنجاح.");
    setChangeUser("");
    setChangePass("");
    setNewUser("");
    setNewPass("");
    setNewPassConfirm("");
  };

  useEffect(() => {
    if (!isAuthenticated) return;
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
      const payload = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? "تعذر حفظ المحتوى.");
      }
      clearContentCache();
      setMessage("تم حفظ التعديلات بنجاح.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "تعذر حفظ المحتوى.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const tabDescriptions: Record<EditorTab, string> = {
    agency: "إدارة أقسام الوكالة: معرض الأعمال وآراء العملاء.",
    market: "إدارة دراسات الحالة، الأرقام، والأسئلة الشائعة لقسم ماركت.",
    media: "إدارة خدمات ومشاريع ميديا ولماذا نحن والأسئلة الشائعة.",
    tech: "إدارة مشاريع قسم تك والفلاتر والمحتوى المرتبط بها.",
    security: "تحديث بيانات الدخول الخاصة بلوحة الإدارة.",
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
    security: [
      { label: "جلسة نشطة", count: isAuthenticated ? 1 : 0 },
      { label: "تحديثات الدخول", count: 1 },
      { label: "سياسات الأمان", count: 0 },
    ],
  };

  const activeStats = statGroups[tab];
  const maxStat = Math.max(1, ...activeStats.map((item) => item.count));

  if (!isAuthenticated) {
    return (
      <main className="admin-theme admin-surface min-h-screen">
        <div className="admin-auth-shell">
          <section className="admin-auth-card">
            <div className="text-right">
              <p className="text-xs font-semibold text-[var(--text-muted)]">AYSEL SECURE</p>
              <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">بوابة الإدارة</h1>
              <p className="mt-3 text-sm text-[var(--text-muted)]">
                دخول سريع وآمن لإدارة المحتوى. بيانات الدخول الافتراضية: <span className="font-semibold text-white">admin / admin</span>
              </p>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleLogin}>
              <Field
                label="اسم المستخدم"
                value={loginUser}
                onChange={setLoginUser}
                dir="ltr"
                placeholder="admin"
              />
              <Field
                label="كلمة السر"
                value={loginPass}
                onChange={setLoginPass}
                dir="ltr"
                type="password"
                placeholder="••••••••"
              />

              {loginError ? (
                <div className="rounded-xl border border-[rgba(255,107,125,0.5)] bg-[rgba(255,107,125,0.12)] px-4 py-3 text-right text-xs text-[var(--danger)]">
                  {loginError}
                </div>
              ) : null}

              {loginNote ? (
                <div className="rounded-xl border border-[rgba(46,197,118,0.5)] bg-[rgba(46,197,118,0.12)] px-4 py-3 text-right text-xs text-[var(--success)]">
                  {loginNote}
                </div>
              ) : null}

              <button
                type="submit"
                className="admin-focus w-full rounded-xl border border-[var(--primary)] bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white"
              >
                دخول الإدارة
              </button>
            </form>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-theme admin-surface min-h-screen text-[var(--text)]">
      <div className="mx-auto w-full max-w-[1680px] px-4 py-4 sm:px-6 lg:px-8">
        <header className="admin-panel admin-glow p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-right">
              <p className="text-xs font-semibold text-[var(--text-muted)]">AYSEL ADMIN</p>
              <h1 className="text-[1.15rem] font-extrabold text-white sm:text-[1.3rem]">لوحة التحكم الديناميكية</h1>
              <p className="text-sm text-[var(--text-muted)]">نفس هوية موقعك الأصلية مع إدارة محتوى كاملة لجميع الأقسام</p>
            </div>

            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
              <div className="relative min-w-[220px] grow sm:grow-0">
                <input
                  type="search"
                  placeholder="ابحث داخل لوحة التحكم..."
                  className="admin-focus w-full rounded-xl border border-[var(--border)] bg-[var(--panel)] px-10 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--primary)]"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">⌕</span>
              </div>

              <button
                type="button"
                onClick={save}
                disabled={loading || saving}
                className="admin-focus rounded-xl border border-[var(--primary)] bg-[var(--primary)] px-4 py-2.5 text-sm font-bold text-white shadow-[0_10px_20px_rgba(47,124,255,0.2)] disabled:opacity-60"
              >
                {saving ? "جاري الحفظ..." : "حفظ كل التعديلات"}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="admin-focus rounded-xl border border-[rgba(255,107,125,0.5)] bg-[rgba(255,107,125,0.12)] px-4 py-2.5 text-sm font-semibold text-[var(--danger)]"
              >
                تسجيل خروج
              </button>
            </div>
          </div>
        </header>

        <div className="mt-4 grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="space-y-4 xl:sticky xl:top-4 xl:self-start">
            <section className="admin-card p-4">
              <p className="mb-3 text-right text-sm font-bold text-[var(--text-soft)]">الأقسام</p>
              <div className="space-y-2">
                {tabs.map((item) => (
                  <TabBtn key={item.id} active={tab === item.id} label={item.label} onClick={() => setTab(item.id)} />
                ))}
              </div>
            </section>

            <section className="admin-card p-4">
              <p className="text-right text-sm font-bold text-[var(--text-soft)]">إحصائيات سريعة</p>
              <div className="mt-3 space-y-2.5">
                {activeStats.map((item) => (
                  <article key={item.label} className="admin-card-soft px-3 py-2.5">
                    <p className="text-right text-xs text-[var(--text-muted)]">{item.label}</p>
                    <p className="text-right text-xl font-extrabold text-white">{item.count}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="admin-card p-4">
              <p className="mb-3 text-right text-sm font-bold text-[var(--text-soft)]">إجراءات سريعة</p>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setContent(structuredClone(defaultSiteContent))}
                  className="admin-focus w-full rounded-xl border border-[rgba(241,163,63,0.6)] bg-[rgba(241,163,63,0.16)] px-3 py-2.5 text-sm font-semibold text-[var(--warning)]"
                >
                  إعادة المحتوى الافتراضي
                </button>
                <button
                  type="button"
                  onClick={save}
                  disabled={loading || saving}
                  className="admin-focus w-full rounded-xl border border-[var(--primary)] bg-[var(--primary)] px-3 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                >
                  حفظ الآن
                </button>
                <Link href="/" className="admin-focus block w-full rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-2.5 text-center text-sm font-semibold text-[var(--text-soft)]">
                  العودة للموقع
                </Link>
              </div>
            </section>
          </aside>

          <section className="admin-panel p-4 sm:p-6">
            <div className="mb-5 grid gap-3 rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 md:grid-cols-[1fr_auto] md:items-center">
              <div className="text-right">
                <h2 className="text-lg font-extrabold text-white">إدارة قسم {tabs.find((item) => item.id === tab)?.label}</h2>
                <p className="text-sm text-[var(--text-muted)]">{tabDescriptions[tab]}</p>
              </div>
              <span className="admin-chip inline-flex items-center justify-center px-3 py-2 text-sm font-semibold text-[var(--text-soft)]">
                وضع التحرير مفعل
              </span>
            </div>

            <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {activeStats.map((item, index) => {
                const width = Math.max(12, Math.round((item.count / maxStat) * 100));
                return (
                  <article key={item.label} className="admin-card-soft admin-kpi p-4 text-right">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-[var(--text-muted)]">{item.label}</p>
                      <span className={`admin-chip ${index === 0 ? "admin-chip-strong" : ""} px-2.5 py-1 text-[10px]`}>
                        مؤثر مباشر
                      </span>
                    </div>
                    <p className="mt-2 text-xl font-extrabold text-white">{item.count}</p>
                    <div className="mt-3 admin-stat-line">
                      <span style={{ width: `${width}%` }} />
                    </div>
                  </article>
                );
              })}
            </div>

            {message && (
              <p className="mb-4 rounded-xl border border-[rgba(46,197,118,0.5)] bg-[rgba(46,197,118,0.12)] px-4 py-3 text-sm font-semibold text-[var(--success)]">
                {message}
              </p>
            )}
            {error && (
              <p className="mb-4 rounded-xl border border-[rgba(255,107,125,0.5)] bg-[rgba(255,107,125,0.12)] px-4 py-3 text-sm font-semibold text-[var(--danger)]">
                {error}
              </p>
            )}

            {loading ? (
              <div className="admin-card-soft admin-skeleton p-8 text-center text-[var(--text-muted)]">جاري تحميل البيانات...</div>
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
                  <div className="grid gap-4 xl:grid-cols-2">
                    <div className="space-y-4">
                      <section className="admin-card-soft p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-[var(--text-soft)]">محتوى القسم</p>
                          <span className="admin-chip px-2.5 py-1 text-[10px]">واجهة العرض</span>
                        </div>
                        <div className="mt-3 grid gap-3 md:grid-cols-2">
                          <Field label="شارة القسم" value={asString(readPath(content, ["pages", "agency", "clientStories", "badge"]))} onChange={(v) => setField(["pages", "agency", "clientStories", "badge"], v)} />
                          <Field label="عنوان القسم" value={asString(readPath(content, ["pages", "agency", "clientStories", "title"]))} onChange={(v) => setField(["pages", "agency", "clientStories", "title"], v)} />
                        </div>
                        <div className="mt-3">
                          <Field label="الوصف" value={asString(readPath(content, ["pages", "agency", "clientStories", "subtitle"]))} onChange={(v) => setField(["pages", "agency", "clientStories", "subtitle"], v)} multiline />
                        </div>
                      </section>

                      <details className="admin-card-soft p-4">
                        <summary className="cursor-pointer text-sm font-semibold text-[var(--text-soft)]">
                          بيانات احتياطية (تُستخدم عند عدم وجود عناصر بالقائمة)
                        </summary>
                        <div className="mt-3 grid gap-3 md:grid-cols-2">
                          <Field label="نص الإنجاز" value={asString(readPath(content, ["pages", "agency", "clientStories", "achievement"]))} onChange={(v) => setField(["pages", "agency", "clientStories", "achievement"], v)} />
                          <Field label="اسم العميل" value={asString(readPath(content, ["pages", "agency", "clientStories", "authorName"]))} onChange={(v) => setField(["pages", "agency", "clientStories", "authorName"], v)} />
                          <Field label="الدور" value={asString(readPath(content, ["pages", "agency", "clientStories", "authorRole"]))} onChange={(v) => setField(["pages", "agency", "clientStories", "authorRole"], v)} />
                        </div>
                        <div className="mt-3">
                          <Field label="الاقتباس" value={asString(readPath(content, ["pages", "agency", "clientStories", "quote"]))} onChange={(v) => setField(["pages", "agency", "clientStories", "quote"], v)} multiline />
                        </div>
                        <div className="mt-3">
                          <SingleImageUploader
                            label="صورة العميل"
                            value={asString(readPath(content, ["pages", "agency", "clientStories", "authorImage"]))}
                            onChange={(v) => setField(["pages", "agency", "clientStories", "authorImage"], v)}
                          />
                        </div>
                      </details>

                      <section className="admin-card-soft p-4">
                        <ObjListEditor title="إحصائيات القسم" path={["pages", "agency", "clientStories", "stats"]} fields={[{ key: "value", label: "القيمة" }, { key: "label", label: "العنوان" }]} newItem={{ value: "", label: "" }} content={content} updateField={updateObjField} removeRow={removeRow} addRow={addRow} />
                      </section>
                    </div>

                    <div className="space-y-4">
                      <section className="admin-card-soft p-4">
                        <ObjListEditor
                          title="قائمة آراء العملاء"
                          path={["pages", "agency", "clientStories", "items"]}
                          fields={[
                            { key: "id", label: "ID", dir: "ltr" },
                            { key: "name", label: "اسم العميل" },
                            { key: "role", label: "الدور" },
                            { key: "achievement", label: "الإنجاز" },
                            { key: "quote", label: "الاقتباس", multiline: true },
                            { key: "image", label: "الصورة", dir: "ltr" },
                          ]}
                          newItem={{ id: "", name: "", role: "", achievement: "", quote: "", image: "" }}
                          content={content}
                          updateField={updateObjField}
                          removeRow={removeRow}
                          addRow={addRow}
                        />
                      </section>

                    </div>
                  </div>
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

            {tab === "security" && (
              <Card title="إعدادات الدخول">
                <div className="admin-card-soft p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-right">
                      <p className="text-xs font-semibold text-[var(--text-muted)]">تحديث بيانات الدخول</p>
                      <h3 className="text-base font-bold text-white">اسم المستخدم وكلمة السر</h3>
                      <p className="mt-1 text-xs text-[var(--text-muted)]">
                        المستخدم الحالي: <span className="font-semibold text-white">{credentials.username}</span>
                      </p>
                    </div>
                  </div>

                  <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={handleChangeCredentials}>
                    <Field
                      label="اسم المستخدم الحالي"
                      value={changeUser}
                      onChange={setChangeUser}
                      dir="ltr"
                      placeholder="admin"
                    />
                    <Field
                      label="كلمة السر الحالية"
                      value={changePass}
                      onChange={setChangePass}
                      dir="ltr"
                      type="password"
                      placeholder="••••••••"
                    />
                    <Field
                      label="اسم المستخدم الجديد"
                      value={newUser}
                      onChange={setNewUser}
                      dir="ltr"
                      placeholder="new-admin"
                    />
                    <Field
                      label="كلمة السر الجديدة"
                      value={newPass}
                      onChange={setNewPass}
                      dir="ltr"
                      type="password"
                      placeholder="••••••••"
                    />
                    <Field
                      label="تأكيد كلمة السر"
                      value={newPassConfirm}
                      onChange={setNewPassConfirm}
                      dir="ltr"
                      type="password"
                      placeholder="••••••••"
                    />
                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="admin-focus w-full rounded-xl border border-[var(--primary)] bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white"
                      >
                        تحديث بيانات الدخول
                      </button>
                    </div>
                  </form>

                  {changeError ? (
                    <div className="mt-3 rounded-xl border border-[rgba(255,107,125,0.5)] bg-[rgba(255,107,125,0.12)] px-4 py-3 text-right text-xs text-[var(--danger)]">
                      {changeError}
                    </div>
                  ) : null}

                  {changeSuccess ? (
                    <div className="mt-3 rounded-xl border border-[rgba(46,197,118,0.5)] bg-[rgba(46,197,118,0.12)] px-4 py-3 text-right text-xs text-[var(--success)]">
                      {changeSuccess}
                    </div>
                  ) : null}
                </div>
              </Card>
            )}
          </div>
        )}
          </section>
        </div>
      </div>
    </main>
  );
}
