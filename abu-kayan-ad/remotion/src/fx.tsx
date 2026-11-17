import React from 'react';
import { AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame, Easing } from 'remotion';

export const FPS = 30;
export const s = (sec: number) => Math.round(sec * FPS);

export const C = {
  bg: '#120F33',
  bg2: '#1B1650',
  purple: '#B57BFF',
  cyan: '#3EE6E6',
  white: '#F2F2F7',
  red: '#FF4D6D',
};
export const AR = "'Cairo', 'Tajawal', sans-serif";
export const AR_BODY = "'Tajawal', 'Cairo', sans-serif";
export const EN = "'Inter', sans-serif";

export const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
export const ease = Easing.bezier(0.16, 1, 0.3, 1);
export const easeIn = Easing.bezier(0.7, 0, 0.84, 0);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

export const glow = (color: string, k = 1) =>
  `0 0 ${8 * k}px ${color}, 0 0 ${22 * k}px ${color}, 0 0 ${48 * k}px ${color}`;

/** Animated 3D neon grid floor + horizon + stars. */
export const NeonGrid: React.FC<{ speed?: number; opacity?: number; tilt?: number; horizon?: number }> = ({
  speed = 1,
  opacity = 1,
  tilt = 72,
  horizon = 1060,
}) => {
  const f = useCurrentFrame();
  const off = ((f * 3 * speed) % 120 + 120) % 120;
  return (
    <AbsoluteFill style={{ opacity, overflow: 'hidden' }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% ${horizon / 19.2}%, #3b2a8a 0%, ${C.bg2} 30%, ${C.bg} 70%)` }} />
      {/* stars */}
      {new Array(60).fill(0).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: random(`sx${i}`) * 1080,
            top: random(`sy${i}`) * horizon * 0.95,
            width: 2 + random(`ss${i}`) * 3,
            height: 2 + random(`ss${i}`) * 3,
            borderRadius: '50%',
            background: i % 3 ? C.white : C.cyan,
            opacity: 0.25 + 0.5 * Math.abs(Math.sin(f / 20 + i)),
          }}
        />
      ))}
      {/* horizon glow line */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: horizon - 2, height: 4, background: C.purple, boxShadow: glow(C.purple, 2) }} />
      {/* floor */}
      <div style={{ position: 'absolute', left: -1200, right: -1200, top: horizon, height: 1920, perspective: 600, perspectiveOrigin: '50% 0%' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transformOrigin: '50% 0%',
            transform: `rotateX(${tilt}deg)`,
            backgroundImage: `linear-gradient(${C.purple} 3px, transparent 3px), linear-gradient(90deg, ${C.purple} 3px, transparent 3px)`,
            backgroundSize: '120px 120px',
            backgroundPosition: `0px ${off}px`,
            height: 4000,
            opacity: 0.85,
            filter: `drop-shadow(0 0 6px ${C.purple})`,
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.15), black 25%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.15), black 25%)',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

/** The cyan "opportunity" butterfly. */
export const Butterfly: React.FC<{ x: number; y: number; size?: number; rot?: number; opacity?: number; flap?: number }> = ({
  x,
  y,
  size = 140,
  rot = 0,
  opacity = 1,
  flap = 1,
}) => {
  const f = useCurrentFrame();
  const w = 0.35 + 0.65 * Math.abs(Math.cos((f / 3.2) * flap));
  return (
    <div style={{ position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, height: size, transform: `rotate(${rot}deg)`, opacity, pointerEvents: 'none' }}>
      <svg viewBox="-100 -100 200 200" width={size} height={size} style={{ overflow: 'visible', filter: `drop-shadow(0 0 10px ${C.cyan}) drop-shadow(0 0 26px ${C.cyan})` }}>
        <defs>
          <linearGradient id="bw" x1="0" y1="-1" x2="0" y2="1">
            <stop offset="0" stopColor="#B9FFFF" />
            <stop offset="0.6" stopColor={C.cyan} />
            <stop offset="1" stopColor={C.purple} />
          </linearGradient>
        </defs>
        {[-1, 1].map((side) => (
          <g key={side} transform={`scale(${side * w},1)`}>
            <path d="M4,-6 C30,-80 92,-78 86,-30 C82,-4 40,4 6,0 Z" fill="url(#bw)" opacity={0.92} stroke="#E8FFFF" strokeWidth={2} />
            <path d="M4,4 C36,8 72,30 56,62 C42,86 14,56 4,14 Z" fill="url(#bw)" opacity={0.85} stroke="#E8FFFF" strokeWidth={2} />
            <circle cx={52} cy={-38} r={8} fill="#E8FFFF" opacity={0.7} />
          </g>
        ))}
        <ellipse cx={0} cy={4} rx={5} ry={30} fill="#E8FFFF" />
        <path d="M-2,-24 C-10,-44 -18,-52 -26,-56 M2,-24 C10,-44 18,-52 26,-56" stroke="#E8FFFF" strokeWidth={2.5} fill="none" />
      </svg>
    </div>
  );
};

/** sparkle trail behind the butterfly */
export const Sparkles: React.FC<{ path: (t: number) => [number, number]; t: number; n?: number }> = ({ path, t, n = 14 }) => (
  <>
    {new Array(n).fill(0).map((_, i) => {
      const tt = t - i * 0.012;
      if (tt < 0) return null;
      const [x, y] = path(tt);
      const jx = (random(`spx${i}`) - 0.5) * 30;
      const jy = (random(`spy${i}`) - 0.5) * 30;
      const o = 1 - i / n;
      return <div key={i} style={{ position: 'absolute', left: x + jx, top: y + jy, width: 6, height: 6, borderRadius: '50%', background: '#CFFFFF', opacity: o * 0.8, boxShadow: glow(C.cyan, 0.6) }} />;
    })}
  </>
);

/** Full-bleed image crop of a 1280x720 still into 1080x1920 with slow Ken Burns. */
export const Bleed: React.FC<{ src: string; cx: number; zoom?: [number, number]; dur: number; filter?: string; dx?: number }> = ({
  src,
  cx,
  zoom = [1, 1.08],
  dur,
  filter,
  dx = 0,
}) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, dur], zoom, clamp);
  const H = 1920 * z;
  const W = (H * 1280) / 720;
  const left = 540 - cx * W + interpolate(f, [0, dur], [0, dx], clamp);
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Img src={staticFile(src)} style={{ position: 'absolute', height: H, width: W, left, top: (1920 - H) / 2, filter }} />
    </AbsoluteFill>
  );
};

/** Neon-framed landscape card over a blurred copy of the same image. */
export const Card: React.FC<{ src: string; dur: number; color?: string; y?: number }> = ({ src, dur, color = C.purple, y = 520 }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, dur], [1.0, 1.1], clamp);
  return (
    <AbsoluteFill>
      <Img src={staticFile(src)} style={{ position: 'absolute', height: 1920, width: 3413, left: -1166, top: 0, filter: 'blur(30px) brightness(0.45) saturate(1.2)', transform: `scale(${1.1 + (z - 1) * 0.5})` }} />
      <AbsoluteFill style={{ background: `linear-gradient(to bottom, ${C.bg}cc, transparent 30%, transparent 60%, ${C.bg}ee)` }} />
      <div
        style={{
          position: 'absolute',
          left: 40,
          top: y,
          width: 1000,
          height: 1000 * (720 / 1280) + 260,
          borderRadius: 36,
          overflow: 'hidden',
          border: `4px solid ${color}`,
          boxShadow: `${glow(color, 1.4)}, 0 30px 80px rgba(0,0,0,0.6)`,
        }}
      >
        <Img src={staticFile(src)} style={{ position: 'absolute', height: '100%', left: '50%', top: 0, transform: `translateX(-50%) scale(${z})` }} />
      </div>
    </AbsoluteFill>
  );
};

export const Grain: React.FC<{ amount?: number }> = ({ amount = 0.06 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity: amount, mixBlendMode: 'overlay' }}>
      <svg width="1080" height="1920">
        <filter id="gn">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={f % 30} />
        </filter>
        <rect width="1080" height="1920" filter="url(#gn)" />
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{ k?: number }> = ({ k = 0.75 }) => (
  <AbsoluteFill style={{ pointerEvents: 'none', background: `radial-gradient(ellipse at center, transparent 45%, rgba(8,6,30,${k}) 100%)` }} />
);

/** Scanline + RGB-split glitch overlay; intensity 0..1 */
export const Glitch: React.FC<{ k: number }> = ({ k }) => {
  const f = useCurrentFrame();
  if (k <= 0.01) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {new Array(9).fill(0).map((_, i) => {
        const y = random(`gy${i}${f}`) * 1920;
        const h = 10 + random(`gh${i}${f}`) * 90;
        const dx = (random(`gx${i}${f}`) - 0.5) * 160 * k;
        const col = i % 3 === 0 ? C.cyan : i % 3 === 1 ? C.purple : '#ffffff';
        return <div key={i} style={{ position: 'absolute', left: dx, top: y, width: 1080, height: h, background: col, opacity: 0.35 * k, mixBlendMode: 'screen' }} />;
      })}
      <AbsoluteFill style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.25) 0 2px, transparent 2px 5px)', opacity: k }} />
    </AbsoluteFill>
  );
};

/** Neon headline that writes on word by word. */
export const NeonText: React.FC<{
  text: string;
  at: number;
  size?: number;
  color?: string;
  weight?: number;
  y: number;
  glowK?: number;
  out?: number;
  hi?: string[];
  hiColor?: string;
}> = ({ text, at, size = 96, color = C.purple, weight = 900, y, glowK = 1, out, hi = [], hiColor = C.cyan }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const words = text.split(' ');
  const o = out !== undefined ? interpolate(f, [out, out + 8], [1, 0], clamp) : 1;
  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        right: 60,
        top: y,
        textAlign: 'center',
        direction: 'rtl',
        fontFamily: AR,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.35,
        opacity: o,
      }}
    >
      {words.map((w, i) => {
        const t = at + i * 4;
        const p = interpolate(f, [t, t + 8], [0, 1], { ...clamp, easing: ease });
        const isHi = hi.includes(w);
        const col = isHi ? hiColor : color;
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              margin: '0 0.14em',
              color: col === C.white ? C.white : '#fff',
              textShadow: col === C.white ? `0 4px 20px rgba(0,0,0,0.6)` : glow(col, glowK),
              WebkitTextStroke: col === C.white ? undefined : `2px ${col}`,
              opacity: p,
              transform: `translateY(${(1 - p) * 40}px) scale(${0.9 + 0.1 * p})`,
              filter: `blur(${(1 - p) * 8}px)`,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

export const Chip: React.FC<{ text: string; at: number; x: number; y: number; color?: string; rot?: number; icon?: string; size?: number }> = ({
  text,
  at,
  x,
  y,
  color = C.red,
  rot = 0,
  icon,
  size = 58,
}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = interpolate(f, [at, at + 5, at + 9], [0, 1.15, 1], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${p})`,
        fontFamily: AR,
        fontWeight: 800,
        fontSize: size,
        color: '#fff',
        background: 'rgba(18,15,51,0.82)',
        border: `3px solid ${color}`,
        boxShadow: glow(color, 0.8),
        padding: '8px 34px 14px',
        borderRadius: 999,
        direction: 'rtl',
        whiteSpace: 'nowrap',
      }}
    >
      {icon ? <span style={{ marginLeft: 16 }}>{icon}</span> : null}
      {text}
    </div>
  );
};
