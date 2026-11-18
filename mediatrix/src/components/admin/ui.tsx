"use client";
import { useRef, useState } from "react";
import type { L } from "@/lib/types";

export const inputCls =
  "w-full rounded-xl border border-ice-300 bg-white px-3.5 py-2.5 text-sm text-navy outline-none transition placeholder:text-mist/50 focus:border-gold focus:ring-4 focus:ring-gold/10";

export function Card({ title, desc, children, actions }: { title?: string; desc?: string; children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white bg-white/80 p-5 shadow-[0_10px_30px_-20px_rgba(28,42,63,.35)] md:p-6">
      {(title || actions) && (
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            {title && <h2 className="text-lg font-bold text-navy">{title}</h2>}
            {desc && <p className="mt-1 text-sm text-mist">{desc}</p>}
          </div>
          {actions}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-navy-soft">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[0.7rem] text-mist">{hint}</span>}
    </label>
  );
}

export function Text({ value, onChange, ltr, ...rest }: { value: string; onChange: (v: string) => void; ltr?: boolean } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return <input {...rest} dir={ltr ? "ltr" : undefined} className={`${inputCls} ${ltr ? "text-left" : ""}`} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
}

export function Area({ value, onChange, rows = 4, ltr }: { value: string; onChange: (v: string) => void; rows?: number; ltr?: boolean }) {
  return <textarea dir={ltr ? "ltr" : "rtl"} rows={rows} className={`${inputCls} resize-y leading-7`} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
}

/** Bilingual field: Arabic + English side by side. */
export function LField({ label, value, onChange, area, rows }: { label: string; value: L; onChange: (v: L) => void; area?: boolean; rows?: number }) {
  const v = value ?? { ar: "", en: "" };
  return (
    <div>
      <span className="mb-1.5 block text-xs font-semibold text-navy-soft">{label}</span>
      <div className="grid gap-2 md:grid-cols-2">
        <div className="relative">
          <span className="absolute end-2 top-2 z-10 rounded bg-ice-100 px-1.5 text-[0.6rem] font-bold text-mist">AR</span>
          {area ? <Area rows={rows} value={v.ar} onChange={(ar) => onChange({ ...v, ar })} /> : <Text value={v.ar} onChange={(ar) => onChange({ ...v, ar })} />}
        </div>
        <div className="relative" dir="ltr">
          <span className="absolute end-2 top-2 z-10 rounded bg-ice-100 px-1.5 text-[0.6rem] font-bold text-mist">EN</span>
          {area ? <Area ltr rows={rows} value={v.en} onChange={(en) => onChange({ ...v, en })} /> : <Text ltr value={v.en} onChange={(en) => onChange({ ...v, en })} />}
        </div>
      </div>
    </div>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className="inline-flex items-center gap-2 text-sm text-navy-soft" aria-pressed={checked}>
      <span className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-gold" : "bg-ice-300"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? "start-[22px]" : "start-0.5"}`} />
      </span>
      {label}
    </button>
  );
}

export function Btn({ children, variant = "ghost", ...rest }: { variant?: "gold" | "ghost" | "danger" } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const v = {
    gold: "btn-gold px-5 py-2.5",
    ghost: "border border-ice-300 bg-white px-3 py-2 text-navy-soft hover:border-gold hover:text-gold-deep",
    danger: "border border-red-200 bg-white px-3 py-2 text-red-700 hover:bg-red-50",
  }[variant];
  return (
    <button type="button" {...rest} className={`inline-flex items-center justify-center gap-1.5 rounded-xl text-sm font-semibold transition disabled:opacity-50 ${v} ${rest.className ?? ""}`}>
      {children}
    </button>
  );
}

export function Upload({ value, onChange, accept = "image/*", label = "رفع ملف" }: { value?: string; onChange: (url: string | undefined) => void; accept?: string; label?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const isVideo = value && /\.(mp4|webm|mov)$/i.test(value);

  async function pick(f: File) {
    setBusy(true);
    setErr("");
    const fd = new FormData();
    fd.append("file", f);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd }).catch(() => null);
    const data = await res?.json().catch(() => null);
    setBusy(false);
    if (res?.ok && data?.url) onChange(data.url);
    else setErr(data?.error || "فشل الرفع");
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-ice-300 bg-ice-50">
        {value ? (
          isVideo ? (
            <video src={value} className="h-full w-full object-cover" muted autoPlay loop playsInline />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-contain" />
          )
        ) : (
          <span className="text-[0.65rem] text-mist">لا يوجد</span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <Btn onClick={() => ref.current?.click()} disabled={busy}>
          {busy ? "جارٍ الرفع…" : label}
        </Btn>
        {value && (
          <Btn variant="danger" onClick={() => onChange(undefined)}>
            إزالة
          </Btn>
        )}
        {err && <span className="w-full text-xs text-red-700">{err}</span>}
      </div>
      <input
        ref={ref}
        type="file"
        accept={accept}
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) pick(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

/** Generic list editor with add / reorder / delete. */
export function ListEditor<T extends { id: string }>({
  items,
  onChange,
  render,
  make,
  addLabel = "إضافة",
  title,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  render: (item: T, update: (patch: Partial<T>) => void, index: number) => React.ReactNode;
  make: () => T;
  addLabel?: string;
  title: (item: T, i: number) => React.ReactNode;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div key={it.id} className="rounded-2xl border border-ice-200 bg-ice-50/60">
          <div className="flex items-center gap-2 p-3">
            <button type="button" onClick={() => setOpen(open === it.id ? null : it.id)} className="flex min-w-0 flex-1 items-center gap-3 text-start">
              <span className={`text-gold transition ${open === it.id ? "rotate-90" : ""}`}>‹</span>
              <span className="min-w-0 truncate font-semibold text-navy">{title(it, i)}</span>
            </button>
            <Btn onClick={() => move(i, -1)} disabled={i === 0} aria-label="أعلى" className="!px-2 !py-1">
              ↑
            </Btn>
            <Btn onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="أسفل" className="!px-2 !py-1">
              ↓
            </Btn>
            <Btn
              variant="danger"
              className="!px-2 !py-1"
              onClick={() => {
                if (confirm("هل تريد حذف هذا العنصر؟")) onChange(items.filter((x) => x.id !== it.id));
              }}
            >
              حذف
            </Btn>
          </div>
          {open === it.id && (
            <div className="space-y-4 border-t border-ice-200 p-4">
              {render(it, (patch) => onChange(items.map((x) => (x.id === it.id ? { ...x, ...patch } : x))), i)}
            </div>
          )}
        </div>
      ))}
      <Btn
        variant="ghost"
        className="w-full border-dashed py-3"
        onClick={() => {
          const n = make();
          onChange([...items, n]);
          setOpen(n.id);
        }}
      >
        + {addLabel}
      </Btn>
    </div>
  );
}

export const uid = () => Math.random().toString(36).slice(2, 8);
export const emptyL = (): L => ({ ar: "", en: "" });
