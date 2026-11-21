// "Mediatrix" wordmark — Readex Pro, deep navy; the i-dots are ice drops and the x is a DNA double helix (gold + navy strands).

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

/** The "x": two DNA strands (gold + navy) that twist and cross, with base-pair rungs and an ice core. */
function DnaX({ u }: { u: string }) {
  const gold = ["M14 4 C 70 30, 30 70, 86 96", "M18 4 C 62 32, 38 68, 82 96", "M14 4 C 70 30, 30 70, 86 96"].join(";");
  const navy = ["M86 4 C 30 30, 70 70, 14 96", "M82 4 C 38 32, 62 68, 18 96", "M86 4 C 30 30, 70 70, 14 96"].join(";");
  const rungs = [
    [16, 32, 68],
    [30, 40, 60],
    [70, 40, 60],
    [84, 32, 68],
  ];
  return (
    <svg viewBox="0 0 100 100" className="inline-block h-[0.64em] w-[0.62em] overflow-visible align-baseline" style={{ marginInlineStart: "0.03em" }} aria-hidden="true">
      <defs>
        <linearGradient id={`${u}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f1dfb3" />
          <stop offset="0.45" stopColor="#d9bd86" />
          <stop offset="1" stopColor="#9a7a4b" />
        </linearGradient>
      </defs>
      {/* base-pair rungs (pulse like a slow twist) */}
      <g stroke="#a8875a" strokeWidth="4" strokeLinecap="round" opacity="0.85">
        {rungs.map(([y, x1, x2], i) => (
          <line key={i} x1={x1} x2={x2} y1={y} y2={y}>
            <animate attributeName="x1" values={`${x1};${x1 + 6};${x1}`} dur="3.6s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
            <animate attributeName="x2" values={`${x2};${x2 - 6};${x2}`} dur="3.6s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
          </line>
        ))}
      </g>
      <path fill="none" stroke="#1c2a3f" strokeWidth="16" strokeLinecap="round">
        <animate attributeName="d" values={navy} dur="3.6s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1" />
      </path>
      <path fill="none" stroke={`url(#${u}-g)`} strokeWidth="16" strokeLinecap="round">
        <animate attributeName="d" values={gold} dur="3.6s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1" />
      </path>
      <path d="M22 9 C 52 26, 44 40, 47 46" fill="none" stroke="#fff6dc" strokeOpacity="0.8" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="50" cy="50" r="6" fill="#bfe9f4" stroke="#fff" strokeWidth="2">
        <animate attributeName="r" values="5.5;7;5.5" dur="1.8s" repeatCount="indefinite" />
      </circle>
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
      <DnaX u={`${uid}-x`} />
    </span>
  );
}
