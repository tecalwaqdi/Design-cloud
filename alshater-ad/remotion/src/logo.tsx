import React from 'react';
import { interpolate } from 'remotion';
import { AR, C, EN, KUFI, clamp, ease, back } from './fx';

/* Vector paths copied verbatim from the profile PDF (page 13), via pdftocairo -svg. */
const PETALS = [
  'M 339.035156 249.5 L 266.363281 269.644531 L 312.773438 295.90625 L 385.445312 275.761719 L 365.300781 203.089844 L 318.890625 176.824219 Z',
  'M 421.125 200.125 L 368.101562 147.101562 L 368.101562 200.125 L 421.125 253.148438 L 474.148438 200.125 L 474.148438 147.101562 Z',
  'M 476.417969 203.351562 L 457.0625 275.796875 L 529.511719 295.148438 L 575.410156 268.601562 L 502.964844 249.25 L 522.316406 176.804688 Z',
  'M 456.644531 317.84375 L 476.675781 390.105469 L 522.824219 416.222656 L 502.792969 343.960938 L 575.054688 323.929688 L 528.90625 297.8125 Z',
  'M 368.125 394.625 L 368.125 447.648438 L 421.148438 394.625 L 474.171875 447.648438 L 474.171875 394.625 L 421.148438 341.601562 Z',
  'M 266.828125 326.148438 L 339.277344 345.5 L 319.921875 417.945312 L 365.824219 391.402344 L 385.175781 318.957031 L 312.730469 299.601562 Z',
];
const ARROW = 'M 393.464844 297.382812 L 393.464844 325.050781 L 421.132812 297.382812 L 448.800781 325.050781 L 448.800781 297.382812 L 421.132812 269.714844 Z';
// petal centroids relative to the mark centre (421.13, 297.4) — used to fly them in
const CX = 421.13, CY = 297.4;
const DIRS = [[-95, -50], [0, -110], [95, -50], [95, 55], [0, 110], [-95, 55]];
const VB = '262 143 318 310';

/** The EL-SHATER star mark. `p` 0..1 assembles it (petals fly in from outside, arrow pops last). */
export const Mark: React.FC<{ size: number; p?: number; spin?: number; glow?: number; arrowLift?: number; mono?: string; style?: React.CSSProperties }> = ({ size, p = 1, spin = 0, glow = 0, arrowLift = 0, mono, style }) => {
  return (
    <svg width={size} height={size} viewBox={VB} style={{ overflow: 'visible', filter: glow ? `drop-shadow(0 0 ${18 * glow}px rgba(111,227,174,${0.75 * glow}))` : undefined, ...style }}>
      <g transform={`rotate(${spin} ${CX} ${CY})`}>
        {PETALS.map((d, i) => {
          const local = interpolate(p, [i * 0.07, i * 0.07 + 0.55], [0, 1], { ...clamp, easing: ease });
          const k = 1 - local;
          const [dx, dy] = DIRS[i];
          return (
            <path
              key={i}
              d={d}
              fill={mono ?? C.green}
              opacity={Math.min(1, local * 2.5)}
              transform={`translate(${dx * 3.2 * k} ${dy * 3.2 * k}) rotate(${k * (i % 2 ? 90 : -90)} ${CX + dx * 0.6} ${CY + dy * 0.6})`}
            />
          );
        })}
      </g>
      {(() => {
        const a = interpolate(p, [0.62, 0.9], [0, 1], { ...clamp, easing: back });
        return <path d={ARROW} fill="#fff" opacity={Math.min(1, a * 2)} transform={`translate(0 ${(1 - a) * 40 - arrowLift}) translate(${CX} ${CY + 14}) scale(${Math.max(0.001, a)}) translate(${-CX} ${-CY - 14})`} />;
      })()}
    </svg>
  );
};

/** Horizontal lockup like the profile cover: mark + Arabic name + English line. */
export const Lockup: React.FC<{ scale?: number; p?: number; textP?: number; dark?: boolean }> = ({ scale = 1, p = 1, textP = 1, dark = false }) => {
  const col = dark ? C.navy : '#fff';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 26 * scale, direction: 'ltr' }}>
      <Mark size={190 * scale} p={p} />
      <div style={{ textAlign: 'left', overflow: 'hidden', clipPath: `inset(0 0 0 ${(1 - textP) * 100}%)` }}>
        <div style={{ fontFamily: KUFI, fontWeight: 600, fontSize: 64 * scale, color: col, direction: 'rtl', lineHeight: 1.25, whiteSpace: 'nowrap' }}>الشاطر لخدمات الأعمال</div>
        <div style={{ fontFamily: EN, fontWeight: 500, fontSize: 40.5 * scale, color: col, letterSpacing: 0.3 * scale, whiteSpace: 'nowrap', marginTop: 2 * scale }}>EL-SHATER Business Services</div>
      </div>
    </div>
  );
};

/** Small corner bug (watermark) */
export const Bug: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <div style={{ position: 'absolute', top: 70, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity }}>
    <Lockup scale={0.42} />
  </div>
);

export const _unused = AR;
