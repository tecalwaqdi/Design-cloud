// "Mediatrix" wordmark — Readex Pro, deep navy; the i-dots are ice drops and the x is gold.

function Drop({ u, delay = 0 }: { u: string; delay?: number }) {
  return (
    <svg
      viewBox="0 0 20 28"
      className="pointer-events-none absolute left-1/2 top-[0.02em] h-[0.27em] w-[0.2em] -translate-x-1/2"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${u}-drop`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bfe9f4" />
          <stop offset="1" stopColor="#2a9db8" />
        </linearGradient>
      </defs>
      <path d="M10 2 C 5.5 9.5, 3 13.6, 3 17.4 a7 7 0 0 0 14 0 C 17 13.6, 14.5 9.5, 10 2 Z" fill={`url(#${u}-drop)`}>
        <animateTransform attributeName="transform" type="translate" values="0 0;0 1.6;0 0" dur="2.8s" begin={`${delay}s`} repeatCount="indefinite" />
      </path>
      <ellipse cx="7.6" cy="15.5" rx="1.6" ry="2.6" fill="#ffffff" opacity="0.85" />
    </svg>
  );
}

export function Wordmark({ className = "", uid = "wm" }: { className?: string; uid?: string }) {
  return (
    <span className={`font-brand inline-flex items-baseline font-semibold leading-none tracking-[-0.015em] text-navy ${className}`} dir="ltr" aria-label="Mediatrix" role="img">
      <span aria-hidden="true">Med</span>
      <span className="relative" aria-hidden="true">
        ı<Drop u={`${uid}-a`} />
      </span>
      <span aria-hidden="true">atr</span>
      <span className="relative" aria-hidden="true">
        ı<Drop u={`${uid}-b`} delay={1.4} />
      </span>
      <span className="text-gold-grad !p-0" aria-hidden="true">
        x
      </span>
    </span>
  );
}
