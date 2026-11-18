"use client";
import { useState } from "react";

type Labels = { name: string; email: string; phone: string; message: string; send: string; sending: string; sent: string; error: string };

export function ContactForm({ labels }: { labels: Labels }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) }).catch(() => null);
    if (res?.ok) {
      setState("sent");
      (e.target as HTMLFormElement).reset();
    } else setState("error");
  }

  const field = "w-full rounded-xl border border-white bg-white/70 px-4 py-3 text-sm text-navy outline-none transition placeholder:text-mist/60 focus:border-gold/60 focus:bg-white focus:ring-4 focus:ring-gold/10";
  return (
    <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
      <input name="name" required placeholder={labels.name} className={field} />
      <input name="phone" placeholder={labels.phone} className={field} inputMode="tel" />
      <input name="email" type="email" placeholder={labels.email} className={`${field} sm:col-span-2`} />
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <textarea name="message" required rows={4} placeholder={labels.message} className={`${field} resize-none sm:col-span-2`} />
      <div className="flex items-center gap-4 sm:col-span-2">
        <button disabled={state === "sending"} className="btn-gold rounded-xl px-8 py-3 text-sm font-semibold">
          {state === "sending" ? labels.sending : labels.send}
        </button>
        {state === "sent" && <p className="text-sm text-gold-deep">{labels.sent}</p>}
        {state === "error" && <p className="text-sm text-red-700">{labels.error}</p>}
      </div>
    </form>
  );
}
