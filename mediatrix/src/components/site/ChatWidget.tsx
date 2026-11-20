"use client";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Pulse } from "../art/Logo";
import { Social } from "./Icons";
import type { Lang } from "@/lib/types";

type Msg = { role: "user" | "assistant"; content: string; handoff?: boolean; summary?: string };

const T = {
  ar: {
    open: "تحدث معنا",
    online: "متصل الآن",
    placeholder: "اكتب سؤالك…",
    send: "إرسال",
    note: "مساعد ذكي، قد يخطئ أحياناً. لا يقدّم استشارات طبية.",
    handoffTitle: "خدمة العملاء",
    wa: "واتساب",
    email: "البريد",
    leave: "اترك رقمك ونتواصل معك",
    name: "الاسم",
    contact: "رقم الجوال أو الإيميل",
    submit: "أرسل للخدمة",
    sent: "تم إرسال طلبك لخدمة العملاء، وسنتواصل معك قريباً ✅",
    err: "تعذّر الإرسال، حاول مرة أخرى.",
    human: "أريد التحدث مع خدمة العملاء",
    reset: "محادثة جديدة",
    close: "إغلاق",
    neterr: "تعذّر الاتصال. حاول مرة أخرى.",
  },
  en: {
    open: "Chat with us",
    online: "Online now",
    placeholder: "Type your question…",
    send: "Send",
    note: "AI assistant, may make mistakes. Not medical advice.",
    handoffTitle: "Customer service",
    wa: "WhatsApp",
    email: "Email",
    leave: "Leave your number and we'll contact you",
    name: "Name",
    contact: "Phone or email",
    submit: "Send to support",
    sent: "Your request was sent to customer service — we'll contact you soon ✅",
    err: "Couldn't send, please try again.",
    human: "I want to talk to customer service",
    reset: "New chat",
    close: "Close",
    neterr: "Connection problem. Please try again.",
  },
};

export function ChatWidget({
  lang,
  name,
  welcome,
  suggestions,
  whatsapp,
  email,
}: {
  lang: Lang;
  name: string;
  welcome: string;
  suggestions: string[];
  whatsapp: string;
  email: string;
}) {
  const t = T[lang];
  const key = `mtx_chat_${lang}`;
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(key);
      if (saved) setMsgs(JSON.parse(saved));
    } catch {}
  }, [key]);
  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(msgs.slice(-30)));
    } catch {}
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, busy, key]);
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 250);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content: q }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ lang, messages: next.map(({ role, content }) => ({ role, content })) }),
      });
      const data = await res.json();
      setMsgs([...next, { role: "assistant", content: data.reply || t.neterr, handoff: !!data.handoff, summary: data.summary || q }]);
    } catch {
      setMsgs([...next, { role: "assistant", content: t.neterr }]);
    } finally {
      setBusy(false);
    }
  }

  const transcript = () =>
    msgs
      .slice(-10)
      .map((m) => `${m.role === "user" ? (lang === "ar" ? "العميل" : "Customer") : "Bot"}: ${m.content}`)
      .join("\n");

  return (
    <>
      {/* launcher */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.4 }}
            onClick={() => setOpen(true)}
            aria-label={t.open}
            className="fixed bottom-5 start-5 z-40 flex items-center gap-2 rounded-full bg-navy py-3 pe-5 ps-3 text-sm font-semibold text-white shadow-[0_14px_30px_-10px_rgba(28,42,63,.7)] ring-1 ring-gold/40 transition hover:scale-[1.03]"
          >
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-b from-gold-light to-gold">
              <span className="absolute inset-0 animate-ping rounded-full bg-gold/40" />
              <svg viewBox="0 0 24 24" className="relative h-5 w-5" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 5h16v11H9l-5 4z" />
                <path d="M8 10.5h2l1.2-2.5 1.6 5 1.2-2.5H16" />
              </svg>
            </span>
            <span className="hidden sm:inline">{t.open}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label={name}
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-3 bottom-3 z-50 flex h-[78vh] max-h-[640px] flex-col overflow-hidden rounded-[24px] border border-white bg-[#f7fafb] shadow-[0_30px_80px_-20px_rgba(28,42,63,.55)] sm:inset-x-auto sm:start-5 sm:bottom-5 sm:w-[380px]"
          >
            {/* header */}
            <div className="relative flex items-center gap-3 bg-navy px-4 py-3.5 text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-gold/40">
                <Pulse className="h-auto w-7 invert" id="chat-pulse" animated={false} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{name}</p>
                <p className="flex items-center gap-1.5 text-[0.7rem] text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {t.online}
                </p>
              </div>
              {msgs.length > 0 && (
                <button onClick={() => setMsgs([])} className="rounded-full px-2.5 py-1 text-[0.7rem] text-white/75 ring-1 ring-white/20 hover:bg-white/10">
                  {t.reset}
                </button>
              )}
              <button onClick={() => setOpen(false)} aria-label={t.close} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10">
                <svg viewBox="0 0 12 12" className="h-3.5 w-3.5" aria-hidden="true">
                  <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
              <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-light to-transparent" />
            </div>

            {/* messages */}
            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4 [scrollbar-width:thin]">
              <Bubble role="assistant">{welcome}</Bubble>
              {msgs.length === 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {[...suggestions.slice(0, 3), t.human].map((s) => (
                    <button key={s} onClick={() => send(s)} className="rounded-full border border-gold/40 bg-white px-3 py-1.5 text-xs text-gold-deep transition hover:bg-gold hover:text-white">
                      {s}
                    </button>
                  ))}
                </div>
              )}
              {msgs.map((m, i) => (
                <div key={i} className="space-y-2">
                  <Bubble role={m.role}>{m.content}</Bubble>
                  {m.handoff && i === msgs.length - 1 && (
                    <Handoff t={t} lang={lang} whatsapp={whatsapp} email={email} summary={m.summary || ""} transcript={transcript()} />
                  )}
                </div>
              ))}
              {busy && (
                <div className="flex w-fit items-center gap-1 rounded-2xl rounded-ss-md bg-white px-4 py-3 shadow-sm ring-1 ring-ice-200">
                  {[0, 1, 2].map((d) => (
                    <motion.span key={d} className="h-1.5 w-1.5 rounded-full bg-gold" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: d * 0.15 }} />
                  ))}
                </div>
              )}
            </div>

            {/* input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="border-t border-ice-200 bg-white px-3 pb-2 pt-3"
            >
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  maxLength={1000}
                  placeholder={t.placeholder}
                  className="min-w-0 flex-1 rounded-full border border-ice-300 bg-ice-50 px-4 py-2.5 text-sm text-navy outline-none transition focus:border-gold focus:bg-white focus:ring-4 focus:ring-gold/10"
                />
                <button type="submit" disabled={busy || !input.trim()} aria-label={t.send} className="btn-gold flex h-10 w-10 shrink-0 items-center justify-center rounded-full disabled:opacity-50">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h13M13 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
              <p className="mt-1.5 text-center text-[0.62rem] text-mist">{t.note}</p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Bubble({ role, children }: { role: "user" | "assistant"; children: React.ReactNode }) {
  const mine = role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-[0.9rem] leading-6 ${
        mine ? "ms-auto rounded-se-md bg-navy text-white" : "rounded-ss-md bg-white text-navy shadow-sm ring-1 ring-ice-200"
      }`}
    >
      {children}
    </motion.div>
  );
}

function Handoff({
  t,
  lang,
  whatsapp,
  email,
  summary,
  transcript,
}: {
  t: (typeof T)["ar"];
  lang: Lang;
  whatsapp: string;
  email: string;
  summary: string;
  transcript: string;
}) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const digits = whatsapp.replace(/[^\d]/g, "");
  const intro = lang === "ar" ? "مرحباً، تواصلت معكم من مساعد الموقع بخصوص:" : "Hello, I'm reaching out from the website assistant about:";

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const contact = String(f.get("contact") || "").trim();
    const isEmail = contact.includes("@");
    setState("sending");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: String(f.get("name") || "").trim() || (lang === "ar" ? "زائر من المساعد" : "Assistant visitor"),
        email: isEmail ? contact : "",
        phone: isEmail ? "" : contact,
        message: `[${lang === "ar" ? "تحويل من المساعد الذكي" : "Handover from assistant"}]\n${summary}\n\n${transcript}`.slice(0, 3900),
      }),
    }).catch(() => null);
    setState(res?.ok ? "sent" : "error");
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-gold/30 bg-gradient-to-b from-white to-gold-pale/30 p-3.5">
      <p className="mb-2.5 text-xs font-bold text-gold-deep">{t.handoffTitle}</p>
      <div className="flex flex-wrap gap-2">
        {digits && (
          <a
            href={`https://wa.me/${digits}?text=${encodeURIComponent(`${intro}\n${summary}`)}`}
            target="_blank"
            rel="noopener"
            className="flex items-center gap-1.5 rounded-full bg-[#25D366] px-3.5 py-2 text-xs font-semibold text-white"
          >
            <Social name="whatsapp" className="h-4 w-4" />
            {t.wa}
          </a>
        )}
        {email && (
          <a
            href={`mailto:${email}?subject=${encodeURIComponent(lang === "ar" ? "طلب من المساعد الذكي" : "Request from the website assistant")}&body=${encodeURIComponent(`${summary}\n\n${transcript}`)}`}
            className="flex items-center gap-1.5 rounded-full bg-navy px-3.5 py-2 text-xs font-semibold text-white"
          >
            ✉ {t.email}
          </a>
        )}
      </div>
      {state === "sent" ? (
        <p className="mt-3 text-xs text-emerald-700">{t.sent}</p>
      ) : (
        <form onSubmit={submit} className="mt-3 space-y-2">
          <p className="text-[0.7rem] text-mist">{t.leave}</p>
          <div className="flex gap-2">
            <input name="name" placeholder={t.name} className="min-w-0 flex-1 rounded-lg border border-ice-300 bg-white px-2.5 py-2 text-xs outline-none focus:border-gold" />
            <input name="contact" required placeholder={t.contact} dir="ltr" className="min-w-0 flex-[1.3] rounded-lg border border-ice-300 bg-white px-2.5 py-2 text-xs outline-none focus:border-gold" />
          </div>
          <button disabled={state === "sending"} className="btn-gold w-full rounded-lg py-2 text-xs font-semibold">
            {state === "sending" ? "…" : t.submit}
          </button>
          {state === "error" && <p className="text-[0.7rem] text-red-700">{t.err}</p>}
        </form>
      )}
    </motion.div>
  );
}
