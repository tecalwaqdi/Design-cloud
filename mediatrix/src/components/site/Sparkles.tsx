// Ambient sparkles + rising bubbles. Deterministic positions (no hydration mismatch).
function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 9301 + 49297) % 233280) / 233280);
}

export function Sparkles({ count = 18, bubbles = 10, seed = 7 }: { count?: number; bubbles?: number; seed?: number }) {
  const r = rng(seed);
  const stars = Array.from({ length: count }, () => ({
    left: r() * 100,
    top: r() * 100,
    size: 6 + r() * 12,
    delay: r() * 4,
    dur: 2.5 + r() * 3,
  }));
  const bub = Array.from({ length: bubbles }, () => ({
    left: 10 + r() * 80,
    top: 55 + r() * 40,
    size: 4 + r() * 10,
    delay: r() * 8,
    dur: 6 + r() * 6,
    drift: (r() - 0.5) * 40,
  }));
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {stars.map((s, i) => (
        <svg
          key={`s${i}`}
          viewBox="0 0 20 20"
          className="absolute"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
            opacity: 0,
          }}
        >
          <path d="M10 0 C11 7 13 9 20 10 C13 11 11 13 10 20 C9 13 7 11 0 10 C7 9 9 7 10 0 Z" fill={i % 3 ? "#bfe9f4" : "#ffffff"} />
        </svg>
      ))}
      {bub.map((b, i) => (
        <span
          key={`b${i}`}
          className="absolute rounded-full border border-white/90"
          style={{
            left: `${b.left}%`,
            top: `${b.top}%`,
            width: b.size,
            height: b.size,
            background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,.95), rgba(210,228,235,.35) 60%, rgba(255,255,255,.1))",
            animation: `floatUp ${b.dur}s ease-in ${b.delay}s infinite`,
            opacity: 0,
            ["--drift" as string]: `${b.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
