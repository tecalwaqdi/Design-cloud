// The Mediatrix mark: a heartbeat line over the serif wordmark.
// When `animated`, the line draws itself and a gold pulse runs along it.

export const PULSE_PATH = "M2 30 H58 L66 34 L76 4 L88 52 L98 22 L104 30 H158";

export function Pulse({ animated = true, className = "", id = "pulse" }: { animated?: boolean; className?: string; id?: string }) {
  return (
    <svg viewBox="0 0 160 56" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-g`} x1="0" x2="1">
          <stop offset="0" stopColor="#1c2a3f" stopOpacity="0.15" />
          <stop offset="0.25" stopColor="#1c2a3f" />
          <stop offset="0.75" stopColor="#1c2a3f" />
          <stop offset="1" stopColor="#1c2a3f" stopOpacity="0.15" />
        </linearGradient>
        <radialGradient id={`${id}-dot`}>
          <stop offset="0" stopColor="#fff8e3" />
          <stop offset="0.45" stopColor="#e6c98e" />
          <stop offset="1" stopColor="#c9a96e" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path
        d={PULSE_PATH}
        fill="none"
        stroke={`url(#${id}-g)`}
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={animated ? 1 : undefined}
        strokeDashoffset={animated ? 1 : undefined}
      >
        {animated && <animate attributeName="stroke-dashoffset" from="1" to="0" dur="1.6s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" keyTimes="0;1" />}
      </path>
      {animated && (
        <>
          {/* gold trace following the beat */}
          <path d={PULSE_PATH} fill="none" stroke="#d9bd86" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="0.12 1">
            <animate attributeName="stroke-dashoffset" values="0.12;-1" dur="2.4s" begin="1.6s" repeatCount="indefinite" />
          </path>
          <circle r="5" fill={`url(#${id}-dot)`}>
            <animateMotion dur="2.4s" begin="1.6s" repeatCount="indefinite" path={PULSE_PATH} />
          </circle>
        </>
      )}
    </svg>
  );
}

export function Logo({
  animated = true,
  logoUrl,
  name = "Mediatrix",
  size = "md",
}: {
  animated?: boolean;
  logoUrl?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
}) {
  if (logoUrl) {
    const h = size === "lg" ? "h-24" : size === "sm" ? "h-9" : "h-14";
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={logoUrl} alt={name} className={`${h} w-auto`} />;
  }
  const dims = {
    sm: { pulse: "w-16", text: "text-xl" },
    md: { pulse: "w-24", text: "text-[1.7rem]" },
    lg: { pulse: "w-40", text: "text-5xl" },
  }[size];
  return (
    <span className="inline-flex flex-col items-center leading-none" dir="ltr">
      <Pulse animated={animated} className={`${dims.pulse} -mb-1 h-auto`} id={`pulse-${size}`} />
      <span className={`font-logo font-bold tracking-tight text-navy ${dims.text}`}>{name}</span>
    </span>
  );
}
