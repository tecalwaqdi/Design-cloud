"use client";
import { useState } from "react";
import { Logo } from "@/components/art/Logo";
import { Sparkles } from "@/components/site/Sparkles";

export default function Login() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const r = await fetch("/api/admin/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password: pw }) });
    if (r.ok) location.href = "/admin";
    else {
      setErr((await r.json().catch(() => ({}))).error || "تعذّر الدخول");
      setBusy(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden p-6">
      <Sparkles count={16} bubbles={6} seed={3} />
      <form onSubmit={submit} className="glass relative w-full max-w-sm rounded-[28px] p-8 text-center">
        <Logo size="md" />
        <h1 className="font-heading mt-6 text-2xl font-bold text-navy">لوحة التحكم</h1>
        <p className="mt-1 text-sm text-mist">سجّل الدخول لإدارة محتوى الموقع</p>
        <input
          type="password"
          dir="ltr"
          autoFocus
          autoComplete="current-password"
          placeholder="••••••••"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          className="mt-6 w-full rounded-xl border border-ice-300 bg-white px-4 py-3 text-center text-navy outline-none focus:border-gold focus:ring-4 focus:ring-gold/10"
        />
        {err && <p className="mt-3 text-sm text-red-700">{err}</p>}
        <button disabled={busy || !pw} className="btn-gold mt-5 w-full rounded-xl py-3 font-semibold disabled:opacity-60">
          {busy ? "جارٍ الدخول…" : "دخول"}
        </button>
      </form>
    </main>
  );
}
