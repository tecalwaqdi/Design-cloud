import { Social } from "./Icons";

export function WhatsApp({ number, label }: { number: string; label: string }) {
  const digits = number.replace(/[^\d]/g, "");
  if (!digits) return null;
  return (
    <a
      href={`https://wa.me/${digits}`}
      target="_blank"
      rel="noopener"
      aria-label={label}
      className="group fixed bottom-5 end-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,.7)] transition hover:scale-105"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30" />
      <Social name="whatsapp" className="relative h-7 w-7" />
    </a>
  );
}
