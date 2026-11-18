import React from 'react';
import { C } from './fx';

/* Line icons in the profile's style (mint strokes on navy). `p` 0..1 draws the strokes. */
type P = { size?: number; color?: string; p?: number; sw?: number };
const S: React.FC<P & { children: (dash: (len: number) => React.SVGProps<SVGPathElement>) => React.ReactNode }> = ({ size = 120, color = C.mint, p = 1, sw = 3.2, children }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ overflow: 'visible' }}>
    {children((len) => ({ strokeDasharray: len, strokeDashoffset: len * (1 - p) }))}
  </svg>
);

export const IcDoc: React.FC<P> = (pr) => (
  <S {...pr}>{(d) => (<>
    <path {...d(170)} d="M16 6 h24 l10 10 v42 h-34 z" />
    <path {...d(30)} d="M40 6 v10 h10" />
    <path {...d(60)} d="M22 28 h20 M22 36 h20 M22 44 h12" />
  </>)}</S>
);
export const IcShop: React.FC<P> = (pr) => (
  <S {...pr}>{(d) => (<>
    <path {...d(120)} d="M8 24 l5 -14 h38 l5 14 z" />
    <path {...d(120)} d="M12 26 v30 h40 v-30" />
    <path {...d(50)} d="M26 56 v-16 h12 v16" />
  </>)}</S>
);
export const IcShield: React.FC<P> = (pr) => (
  <S {...pr}>{(d) => (<>
    <path {...d(160)} d="M32 5 l22 8 v16 c0 15 -10 25 -22 30 c-12 -5 -22 -15 -22 -30 v-16 z" />
    <path {...d(60)} d="M32 22 c6 6 8 10 6 15 a7 7 0 0 1 -13 -2 c0 -4 3 -6 3 -9 c2 2 3 3 4 4 z" />
  </>)}</S>
);
export const IcTax: React.FC<P> = (pr) => (
  <S {...pr}>{(d) => (<>
    <path {...d(170)} d="M14 6 h36 v52 l-6 -4 l-6 4 l-6 -4 l-6 4 l-6 -4 l-6 4 z" />
    <path {...d(40)} d="M24 34 l16 -14" />
    <circle {...(d(20) as object)} cx="25" cy="21" r="3.5" />
    <circle {...(d(20) as object)} cx="39" cy="33" r="3.5" />
    <path {...d(30)} d="M22 44 h20" />
  </>)}</S>
);
export const IcCrane: React.FC<P> = (pr) => (
  <S {...pr}>{(d) => (<>
    <path {...d(60)} d="M18 58 v-48 h8 v48" />
    <path {...d(60)} d="M8 14 h50 M26 10 l30 4" />
    <path {...d(30)} d="M50 14 v14 M46 28 h8 v6 h-8 z" />
    <path {...d(40)} d="M18 18 l8 8 M26 18 l-8 8 M18 30 l8 8 M26 30 l-8 8" />
    <path {...d(30)} d="M10 58 h24" />
  </>)}</S>
);
export const IcPlan: React.FC<P> = (pr) => (
  <S {...pr}>{(d) => (<>
    <path {...d(200)} d="M8 8 h48 v48 h-48 z" />
    <path {...d(120)} d="M8 30 h20 v26 M28 8 v12 M36 30 h20 M36 30 v10 M44 56 v-10" />
  </>)}</S>
);
export const IcSpark: React.FC<P> = (pr) => (
  <S {...pr}>{(d) => (<>
    <path {...d(90)} d="M28 8 l4 14 l14 4 l-14 4 l-4 14 l-4 -14 l-14 -4 l14 -4 z" />
    <path {...d(40)} d="M48 40 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 l6 -2 z" />
  </>)}</S>
);
export const IcBug: React.FC<P> = (pr) => (
  <S {...pr}>{(d) => (<>
    <circle {...(d(160) as object)} cx="32" cy="32" r="26" />
    <path {...d(80)} d="M24 26 h16 v14 a8 8 0 0 1 -16 0 z" />
    <path {...d(40)} d="M28 26 a4 4 0 0 1 8 0" />
    <path {...d(50)} d="M18 18 l46 46" transform="translate(-6 -6)" />
  </>)}</S>
);
export const IcKey: React.FC<P> = (pr) => (
  <S {...pr}>{(d) => (<>
    <path {...d(170)} d="M12 6 h30 l10 10 v42 h-40 z" />
    <circle {...(d(30) as object)} cx="26" cy="32" r="6" />
    <path {...d(40)} d="M32 32 h14 M42 32 v6 M38 32 v4" />
    <path {...d(30)} d="M18 46 h26" />
  </>)}</S>
);
export const IcGov: React.FC<P> = (pr) => (
  <S {...pr}>{(d) => (<>
    <path {...d(90)} d="M6 22 l26 -14 l26 14 z" />
    <path {...d(120)} d="M12 26 v24 M22 26 v24 M32 26 v24 M42 26 v24 M52 26 v24" />
    <path {...d(60)} d="M6 54 h52" />
  </>)}</S>
);
export const IcTarget: React.FC<P> = (pr) => (
  <S {...pr}>{(d) => (<>
    <circle {...(d(170) as object)} cx="32" cy="32" r="26" />
    <circle {...(d(100) as object)} cx="32" cy="32" r="15" />
    <circle {...(d(30) as object)} cx="32" cy="32" r="4" />
  </>)}</S>
);
export const IcBolt: React.FC<P> = (pr) => (
  <S {...pr}>{(d) => <path {...d(160)} d="M36 4 l-22 32 h16 l-4 24 l24 -34 h-16 z" />}</S>
);
export const IcEye: React.FC<P> = (pr) => (
  <S {...pr}>{(d) => (<>
    <path {...d(160)} d="M4 32 c8 -13 18 -20 28 -20 s20 7 28 20 c-8 13 -18 20 -28 20 s-20 -7 -28 -20 z" />
    <circle {...(d(50) as object)} cx="32" cy="32" r="8" />
  </>)}</S>
);
export const IcPin: React.FC<P> = (pr) => (
  <S {...pr}>{(d) => (<>
    <path {...d(150)} d="M32 58 c-12 -14 -18 -24 -18 -32 a18 18 0 0 1 36 0 c0 8 -6 18 -18 32 z" />
    <circle {...(d(40) as object)} cx="32" cy="26" r="6" />
  </>)}</S>
);
export const IcPhone: React.FC<P> = (pr) => (
  <S {...pr}>{(d) => <path {...d(200)} d="M14 6 h10 l5 13 l-7 5 a32 32 0 0 0 18 18 l5 -7 l13 5 v10 a6 6 0 0 1 -6 6 a48 48 0 0 1 -44 -44 a6 6 0 0 1 6 -6 z" />}</S>
);
export const IcGlobe: React.FC<P> = (pr) => (
  <S {...pr}>{(d) => (<>
    <circle {...(d(170) as object)} cx="32" cy="32" r="26" />
    <path {...d(180)} d="M6 32 h52 M32 6 c-10 10 -10 42 0 52 c10 -10 10 -42 0 -52" />
  </>)}</S>
);
export const IcAt: React.FC<P> = (pr) => (
  <S {...pr}>{(d) => (<>
    <circle {...(d(60) as object)} cx="32" cy="32" r="9" />
    <path {...d(200)} d="M41 32 v4 a6 6 0 0 0 12 0 v-4 a21 21 0 1 0 -9 17" />
  </>)}</S>
);
export const IcCheck: React.FC<P> = (pr) => (
  <S {...pr}>{(d) => <path {...d(60)} d="M12 33 l13 13 l27 -28" />}</S>
);
export const IcClock: React.FC<P & { t?: number }> = ({ t = 0, ...pr }) => (
  <S {...pr}>{(d) => (<>
    <circle {...(d(170) as object)} cx="32" cy="32" r="26" />
    <path d="M32 32 v-16" transform={`rotate(${t * 30} 32 32)`} />
    <path d="M32 32 h11" transform={`rotate(${t * 2.5} 32 32)`} />
  </>)}</S>
);
