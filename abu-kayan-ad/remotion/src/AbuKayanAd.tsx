import React from 'react';
import { AbsoluteFill, Img, Sequence, interpolate, random, staticFile, useCurrentFrame } from 'remotion';
import '@fontsource/cairo/600.css';
import '@fontsource/cairo/800.css';
import '@fontsource/cairo/900.css';
import '@fontsource/tajawal/500.css';
import '@fontsource/tajawal/700.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import {
  AR,
  AR_BODY,
  Bleed,
  Butterfly,
  C,
  Card,
  Chip,
  EN,
  Glitch,
  Grain,
  NeonGrid,
  NeonText,
  Sparkles,
  Vignette,
  clamp,
  ease,
  easeIn,
  easeInOut,
  glow,
  s,
} from './fx';

export const DURATION = s(45); // 1350

/* ---------------- shared bits ---------------- */
const Flash: React.FC<{ at: number; dur?: number; color?: string; max?: number }> = ({ at, dur = 8, color = '#fff', max = 0.8 }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: color, opacity: interpolate(f, [at, at + 1, at + dur], [0, max, 0], clamp), mixBlendMode: 'screen', pointerEvents: 'none' }} />;
};

/** Caption for the voice-over line (local frames). */
const Caption: React.FC<{ text: string; from: number; to: number; y: number; size?: number }> = ({ text, from, to, y, size = 50 }) => {
  const f = useCurrentFrame();
  if (f < from - 2 || f > to + 8) return null;
  const o = interpolate(f, [from, from + 6, to, to + 8], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: 'absolute', left: 70, right: 70, top: y, textAlign: 'center', direction: 'rtl', opacity: o, transform: `translateY(${(1 - o) * 14}px)` }}>
      <span
        style={{
          fontFamily: AR_BODY,
          fontWeight: 700,
          fontSize: size,
          lineHeight: 1.55,
          color: C.white,
          background: 'rgba(18,15,51,0.72)',
          padding: '6px 26px 12px',
          borderRadius: 18,
          boxDecorationBreak: 'clone',
          WebkitBoxDecorationBreak: 'clone',
          boxShadow: `0 0 0 2px ${C.purple}55`,
        }}
      >
        {text}
      </span>
    </div>
  );
};

/** Wordmark: neon roof line + butterfly + name. */
const Logo: React.FC<{ p: number; scale?: number; y: number }> = ({ p, scale = 1, y }) => {
  const f = useCurrentFrame();
  const draw = interpolate(p, [0, 0.55], [1, 0], clamp);
  const t = interpolate(p, [0.25, 0.75], [0, 1], { ...clamp, easing: ease });
  const sub = interpolate(p, [0.55, 1], [0, 1], { ...clamp, easing: ease });
  const shine = interpolate(f % 90, [0, 30], [-0.3, 1.3], clamp);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: y, height: 560, transform: `scale(${scale})`, transformOrigin: '50% 0%' }}>
      <svg width={1080} height={260} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <path
          d="M300,230 L300,150 L540,40 L780,150 L780,230"
          fill="none"
          stroke={C.purple}
          strokeWidth={12}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={draw}
          style={{ filter: `drop-shadow(0 0 10px ${C.purple}) drop-shadow(0 0 30px ${C.purple})` }}
        />
        <rect x={505} y={150} width={70} height={80} rx={10} fill="none" stroke={C.cyan} strokeWidth={8} opacity={t} style={{ filter: `drop-shadow(0 0 10px ${C.cyan})` }} />
      </svg>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 70, opacity: t }}>
        <Butterfly x={540} y={40} size={90 * t + 1} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 230,
          textAlign: 'center',
          fontFamily: AR,
          fontWeight: 900,
          fontSize: 170,
          lineHeight: 1.1,
          direction: 'rtl',
          color: '#fff',
          opacity: t,
          transform: `scale(${0.85 + 0.15 * t})`,
          textShadow: glow(C.purple, 1.2),
          WebkitTextStroke: `3px ${C.purple}`,
          backgroundImage: `linear-gradient(100deg, #fff 0%, #fff ${shine * 100 - 8}%, ${C.cyan} ${shine * 100}%, #fff ${shine * 100 + 8}%, #fff 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        أبو كيان
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 440, textAlign: 'center', fontFamily: AR, fontWeight: 700, fontSize: 64, direction: 'rtl', color: C.cyan, opacity: sub, letterSpacing: 2, textShadow: glow(C.cyan, 0.6), transform: `translateY(${(1 - sub) * 20}px)` }}>
        للتسويق العقاري
      </div>
    </div>
  );
};

/* ---------------- 1. HOOK (0 – 3.6 s) ---------------- */
const LISTINGS = [
  { img: 'img/living_2.png', title: 'شقة فاخرة للبيع', price: '٨٥٠,٠٠٠' },
  { img: 'img/kitchen_1.png', title: 'شقة جديدة ٤ غرف', price: '٧٢٠,٠٠٠' },
  { img: 'img/struggle_2.png', title: 'شقة لقطة!! 🔥', price: '٥٩٠,٠٠٠' },
  { img: 'img/living_1.png', title: 'شقة للبيع بسعر مغري', price: '٩٤٠,٠٠٠' },
];
const ListingCard: React.FC<{ i: number }> = ({ i }) => {
  const L = LISTINGS[i % LISTINGS.length];
  return (
    <div style={{ height: 470, margin: '0 18px 22px', borderRadius: 26, background: '#fff', overflow: 'hidden', boxShadow: '0 6px 18px rgba(0,0,0,0.25)' }}>
      <div style={{ height: 300, position: 'relative', overflow: 'hidden' }}>
        <Img src={staticFile(L.img)} style={{ height: '100%', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }} />
        <div style={{ position: 'absolute', top: 14, right: 14, background: C.red, color: '#fff', fontFamily: AR, fontWeight: 800, fontSize: 24, padding: '2px 16px 6px', borderRadius: 10 }}>إعلان مميز</div>
      </div>
      <div style={{ direction: 'rtl', padding: '16px 24px', fontFamily: AR, color: '#1b1b2e' }}>
        <div style={{ fontWeight: 800, fontSize: 36 }}>{L.title}</div>
        <div style={{ fontWeight: 800, fontSize: 40, color: '#5b2bd1' }}>
          {L.price} <span style={{ fontSize: 26 }}>ر.س</span>
        </div>
      </div>
    </div>
  );
};
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  // scrolling accelerates
  const scroll = interpolate(f, [0, 40, 108], [0, 500, 3600], { ...clamp, easing: easeIn });
  const phoneIn = interpolate(f, [0, 10], [0, 1], { ...clamp, easing: ease });
  const shake = f > 47 && f < 60 ? (random(`hk${f}`) - 0.5) * 18 : 0;
  const gk = interpolate(f, [92, 108], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <NeonGrid opacity={0.35} speed={2} />
      <AbsoluteFill style={{ transform: `translateX(${shake}px)` }}>
        {/* phone */}
        <div
          style={{
            position: 'absolute',
            left: 540 - 300,
            top: 640,
            width: 600,
            height: 1220,
            borderRadius: 70,
            background: '#0b0a1f',
            border: '14px solid #26224d',
            boxShadow: `${glow(C.purple, 1.3)}, 0 40px 120px rgba(0,0,0,0.7)`,
            overflow: 'hidden',
            transform: `translateY(${(1 - phoneIn) * 300}px) rotate(${-4 + 4 * phoneIn}deg)`,
          }}
        >
          <div style={{ position: 'absolute', inset: 0, background: '#ecebf5' }}>
            <div style={{ transform: `translateY(${-(scroll % (492 * 4))}px)`, paddingTop: 110, filter: `blur(${interpolate(f, [40, 100], [0, 5], clamp)}px)` }}>
              {new Array(12).fill(0).map((_, i) => (
                <ListingCard key={i} i={i} />
              ))}
            </div>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 100, background: '#fff', direction: 'rtl', fontFamily: AR, fontWeight: 800, fontSize: 34, color: '#1b1b2e', padding: '44px 30px 0', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              🔍 شقق للبيع · ٢٬٣٤٨ إعلان
            </div>
          </div>
        </div>
</AbsoluteFill>
      <NeonText text="تدوّر شقة من شهور…" at={4} y={150} size={92} color={C.purple} />
      <NeonText text="وكل ما تروح تشوف… تنصدم؟" at={46} y={300} size={84} color={C.white} hi={['تنصدم؟']} />
      <Flash at={46} color={C.purple} max={0.35} />
      <Glitch k={gk} />
    </AbsoluteFill>
  );
};

/* ---------------- 2. STRUGGLE (3.6 – 10 s) ---------------- */
const PRICES = ['٧٥٠ ألف', '٨٢٠ ألف', '٩٤٠ ألف', '١٫١ مليون'];
const Struggle: React.FC = () => {
  const f = useCurrentFrame(); // local, 0..192
  const D = 192;
  const at = (sec: number) => s(sec - 3.6);
  const glitchIn = interpolate(f, [0, 10], [1, 0], clamp);
  const implode = interpolate(f, [at(9.45), at(10)], [0, 1], { ...clamp, easing: easeIn });
  const shake = (random(`st${Math.floor(f / 2)}`) - 0.5) * 6;
  const priceIdx = Math.min(PRICES.length - 1, Math.max(0, Math.floor((f - at(6.45)) / 9)));
  const car = interpolate(f, [at(7.95), at(9.4)], [0, 1], clamp);
  const pinX = (t: number) => 160 + t * 760;
  const pinY = (t: number) => 1560 + Math.sin(t * Math.PI * 3) * 90;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Bleed src="img/struggle_1.png" cx={0.25} dur={D} zoom={[1.12, 1.0]} filter="saturate(0.55) contrast(1.1) brightness(0.78) hue-rotate(-8deg)" />
      <AbsoluteFill style={{ background: `linear-gradient(to bottom, ${C.bg}ee 0%, transparent 35%, transparent 55%, ${C.bg}f2 100%)` }} />
      <AbsoluteFill style={{ transform: `scale(${1 - implode}) rotate(${implode * 25}deg)`, opacity: 1 - implode * 0.6, transformOrigin: '50% 50%' }}>
        {/* "in the photos" card */}
        {f >= at(5.0) && (
          <div
            style={{
              position: 'absolute',
              right: 60,
              top: 560,
              width: 430,
              borderRadius: 22,
              overflow: 'hidden',
              border: `4px solid ${C.purple}`,
              boxShadow: glow(C.purple, 0.8),
              transform: `translate(${shake}px, 0) rotate(5deg) scale(${interpolate(f, [at(5.0), at(5.0) + 8], [0.4, 1], { ...clamp, easing: ease })})`,
            }}
          >
            <Img src={staticFile('img/living_2.png')} style={{ width: 430, display: 'block' }} />
            <div style={{ position: 'absolute', top: 10, right: 10, background: C.purple, color: '#fff', fontFamily: AR, fontWeight: 800, fontSize: 32, padding: '0 16px 6px', borderRadius: 10 }}>بالإعلان</div>
            <svg width={430} height={242} style={{ position: 'absolute', left: 0, top: 0 }}>
              {(() => {
                const p = interpolate(f, [at(5.4), at(5.4) + 8], [0, 1], clamp);
                return (
                  <g stroke={C.red} strokeWidth={16} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${C.red})` }}>
                    <line x1={90} y1={40} x2={90 + 250 * p} y2={40 + 160 * p} />
                    <line x1={340} y1={40} x2={340 - 250 * p} y2={40 + 160 * p} />
                  </g>
                );
              })()}
            </svg>
          </div>
        )}
        {f >= at(5.0) && (
          <div style={{ position: 'absolute', left: 80, top: 900, fontFamily: AR, fontWeight: 800, fontSize: 44, color: C.white, background: 'rgba(0,0,0,0.55)', padding: '0 20px 8px', borderRadius: 12, direction: 'rtl', opacity: interpolate(f, [at(5.3), at(5.3) + 6], [0, 1], clamp) }}>
            … وبالواقع 😶
          </div>
        )}
        {/* price ticker */}
        {f >= at(6.45) && (
          <div style={{ position: 'absolute', left: 70, top: 1080, direction: 'rtl', fontFamily: AR, transform: `translateX(${shake}px)` }}>
            <div style={{ fontWeight: 700, fontSize: 36, color: C.white, opacity: 0.85 }}>السعر اليوم</div>
            <div style={{ fontWeight: 900, fontSize: 92, color: '#fff', textShadow: glow(C.red, 1), WebkitTextStroke: `2px ${C.red}` }}>
              {PRICES[priceIdx]} <span style={{ fontSize: 70 }}>↑</span>
            </div>
          </div>
        )}
        {/* pins + wandering path */}
        {f >= at(7.95) && (
          <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0 }}>
            <path
              d={new Array(41)
                .fill(0)
                .map((_, i) => `${i ? 'L' : 'M'}${pinX(i / 40)},${pinY(i / 40)}`)
                .join(' ')}
              stroke={C.white}
              strokeWidth={6}
              strokeDasharray="16 16"
              fill="none"
              opacity={0.75}
            />
            {[0, 0.33, 0.66, 1].map((t, i) => (
              <g key={i} transform={`translate(${pinX(t)},${pinY(t) - 20})`} opacity={car >= t - 0.05 ? 1 : 0.35}>
                <path d="M0,0 C-26,-30 -26,-64 0,-64 C26,-64 26,-30 0,0 Z" fill={C.red} style={{ filter: `drop-shadow(0 0 8px ${C.red})` }} />
                <circle cx={0} cy={-42} r={9} fill="#fff" />
              </g>
            ))}
            <g transform={`translate(${pinX(car)},${pinY(car)})`}>
              <text fontSize={64} textAnchor="middle" y={22}>🚗</text>
            </g>
          </svg>
        )}
      </AbsoluteFill>
      <Chip text="صور مضللة" at={at(5.05)} x={540} y={250} rot={-3} icon="✕" />
      <Chip text="أسعار مبالغة" at={at(6.45)} x={560} y={380} rot={2} icon="✕" />
      <Chip text="مشاوير بلا فايدة" at={at(7.95)} x={530} y={510} rot={-2} icon="✕" />
      <Caption text="إعلانات كثيرة، صور غير الواقع، أسعار كل يوم بحال… وأنت تلف من مكان لمكان." from={at(3.85)} to={at(9.5)} y={1740} size={40} />
      <Vignette k={0.8} />
      <Glitch k={glitchIn + (f > at(5.0) && f < at(5.0) + 4 ? 0.6 : 0) + (f > at(6.45) && f < at(6.45) + 4 ? 0.5 : 0)} />
      <Flash at={at(9.9)} color={C.purple} max={0.7} dur={6} />
    </AbsoluteFill>
  );
};

/* ---------------- 3. THE SHIFT (10 – 15 s) ---------------- */
const Shift: React.FC = () => {
  const f = useCurrentFrame(); // 0..150
  const at = (sec: number) => s(sec - 10);
  const fly = interpolate(f, [0, at(12.6)], [0, 1], { ...clamp, easing: easeInOut });
  const path = (t: number): [number, number] => [140 + 400 * t + Math.sin(t * Math.PI * 2) * 160, 1720 - 820 * t - Math.sin(t * Math.PI) * 120];
  const [bx, by0] = path(fly);
  const by = by0 + (fly >= 1 ? Math.sin(f / 6) * 14 : 0);
  const morph = interpolate(f, [at(13.05), at(13.5)], [0, 1], { ...clamp, easing: easeIn });
  const logoP = interpolate(f, [at(13.3), at(14.9)], [0, 1], clamp);
  const gridOrder = interpolate(f, [0, 40], [0, 1], { ...clamp, easing: ease });
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill style={{ transform: `scale(${1.4 - 0.4 * gridOrder}) rotate(${(1 - gridOrder) * 8}deg)`, opacity: gridOrder }}>
        <NeonGrid speed={0.6} />
      </AbsoluteFill>
      <NeonText text="إحنا ما نرمي عليك عروض…" at={at(10.2)} y={250} size={72} color={C.white} out={at(13.0)} />
      <NeonText text="إحنا نختار لك." at={at(11.95)} y={380} size={120} color={C.purple} hi={['نختار']} out={at(13.0)} />
      {morph < 1 && (
        <>
          <Sparkles path={(t) => path(Math.min(1, t))} t={fly} />
          <Butterfly x={bx} y={by} size={170 + morph * 500} opacity={1 - morph} rot={interpolate(fly, [0, 1], [30, 0])} />
        </>
      )}
      <Flash at={at(13.35)} color={C.purple} max={0.85} dur={12} />
      {logoP > 0 && <Logo p={logoP} y={620} />}
    </AbsoluteFill>
  );
};

/* ---------------- 4. WHY US (15 – 30 s) ---------------- */
const FEATURES = ['مختار', 'مناسب', 'موثّق', 'شفاف'];
const Progress: React.FC<{ active: number }> = ({ active }) => (
  <div style={{ position: 'absolute', left: 0, right: 0, top: 1650, display: 'flex', flexDirection: 'row-reverse', justifyContent: 'center', gap: 18 }}>
    {FEATURES.map((w, i) => {
      const on = i <= active;
      return (
        <div
          key={w}
          style={{
            fontFamily: AR,
            fontWeight: 800,
            fontSize: 44,
            color: on ? '#fff' : '#ffffff66',
            border: `3px solid ${on ? C.cyan : '#ffffff33'}`,
            boxShadow: on ? glow(C.cyan, 0.6) : undefined,
            background: on ? 'rgba(62,230,230,0.12)' : 'rgba(18,15,51,0.6)',
            padding: '4px 26px 10px',
            borderRadius: 999,
          }}
        >
          {on ? '✓ ' : ''}
          {w}
        </div>
      );
    })}
  </div>
);
/** whip-pan wrapper: slides in from right, out to left, with motion blur */
const Whip: React.FC<{ dur: number; children: React.ReactNode; first?: boolean; last?: boolean }> = ({ dur, children, first, last }) => {
  const f = useCurrentFrame();
  const inX = first ? 0 : interpolate(f, [0, 7], [1080, 0], { ...clamp, easing: ease });
  const outX = last ? 0 : interpolate(f, [dur - 7, dur], [0, -1080], { ...clamp, easing: easeIn });
  const x = inX + outX;
  const blur = Math.min(40, Math.abs(x) / 18);
  return <AbsoluteFill style={{ transform: `translateX(${x}px)`, filter: blur > 0.5 ? `blur(${blur}px)` : undefined }}>{children}</AbsoluteFill>;
};
const Label: React.FC<{ word: string; sub: string }> = ({ word, sub }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [4, 14], [0, 1], { ...clamp, easing: ease });
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', direction: 'rtl' }}>
      <div style={{ fontFamily: AR, fontWeight: 900, fontSize: 150, color: '#fff', WebkitTextStroke: `3px ${C.cyan}`, textShadow: glow(C.cyan, 1.1), opacity: p, transform: `scale(${0.8 + 0.2 * p})`, lineHeight: 1.2 }}>{word}</div>
      <div style={{ fontFamily: AR, fontWeight: 700, fontSize: 46, color: C.purple, textShadow: glow(C.purple, 0.5), opacity: p, marginTop: -6 }}>{sub}</div>
    </div>
  );
};
const MapRoute: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const draw = interpolate(f, [8, dur - 30], [1, 0], { ...clamp, easing: easeInOut });
  const arrive = interpolate(f, [dur - 34, dur - 22], [0, 1], { ...clamp, easing: ease });
  const route = 'M180,1180 L180,1020 L420,1020 L420,880 L700,880 L700,740 L880,740';
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        {/* streets */}
        {new Array(14).fill(0).map((_, i) => (
          <line key={`h${i}`} x1={0} x2={1080} y1={420 + i * 70 + (i % 3) * 8} y2={420 + i * 70 + (i % 3) * 8} stroke="#ffffff" strokeOpacity={i % 4 === 0 ? 0.22 : 0.08} strokeWidth={i % 4 === 0 ? 10 : 4} />
        ))}
        {new Array(12).fill(0).map((_, i) => (
          <line key={`v${i}`} y1={380} y2={1400} x1={60 + i * 90} x2={60 + i * 90 + (i % 2) * 30} stroke="#ffffff" strokeOpacity={i % 3 === 0 ? 0.2 : 0.07} strokeWidth={i % 3 === 0 ? 10 : 4} />
        ))}
        {/* dim alternative pins */}
        {[
          [300, 500],
          [820, 1100],
          [560, 1280],
          [960, 860],
          [120, 700],
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x},${y})`} opacity={0.3}>
            <path d="M0,0 C-20,-24 -20,-50 0,-50 C20,-50 20,-24 0,0 Z" fill="#888" />
          </g>
        ))}
        <path d={route} stroke={C.cyan} strokeWidth={14} fill="none" strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={draw} style={{ filter: `drop-shadow(0 0 10px ${C.cyan}) drop-shadow(0 0 26px ${C.cyan})` }} />
        <g transform="translate(180,1200)">
          <circle r={26} fill={C.purple} style={{ filter: `drop-shadow(0 0 12px ${C.purple})` }} />
          <text y={80} fill="#fff" fontFamily={AR} fontWeight={800} fontSize={40} textAnchor="middle">أنت</text>
        </g>
        <g transform={`translate(880,740) scale(${0.6 + 0.4 * arrive})`} opacity={0.3 + 0.7 * arrive}>
          <path d="M0,0 C-36,-40 -36,-90 0,-90 C36,-90 36,-40 0,0 Z" fill={C.cyan} style={{ filter: `drop-shadow(0 0 14px ${C.cyan})` }} />
          <text y={-38} fontSize={40} textAnchor="middle">🏠</text>
        </g>
      </svg>
      <Chip text="ميزانيتك" icon="✓" at={s(1.0)} x={330} y={1300} color={C.cyan} size={46} />
      <Chip text="احتياجك" icon="✓" at={s(1.6)} x={740} y={1300} color={C.cyan} size={46} />
      {arrive > 0 && (
        <div style={{ position: 'absolute', left: 580, top: 400, width: 360, borderRadius: 20, overflow: 'hidden', border: `3px solid ${C.cyan}`, boxShadow: glow(C.cyan, 0.7), opacity: arrive, transform: `scale(${0.7 + 0.3 * arrive})`, transformOrigin: '80% 100%' }}>
          <Img src={staticFile('img/kitchen_2.png')} style={{ width: 360, display: 'block' }} />
        </div>
      )}
    </AbsoluteFill>
  );
};
const SEG = [
  { from: s(15), to: s(17.85) },
  { from: s(17.85), to: s(21.75) },
  { from: s(21.75), to: s(25.35) },
  { from: s(25.35), to: s(30) },
];
const Features: React.FC = () => {
  const f = useCurrentFrame() + s(15); // absolute
  const active = SEG.findIndex((g) => f >= g.from && f < g.to);
  const rel = (sec: number) => s(sec) - s(15);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Sequence from={SEG[0].from - s(15)} durationInFrames={SEG[0].to - SEG[0].from}>
        <Whip dur={SEG[0].to - SEG[0].from} first>
          <Card src="img/living_1.png" dur={SEG[0].to - SEG[0].from} />
          <Label word="مختار" sub="بعناية… يستاهل وقتك" />
        </Whip>
      </Sequence>
      <Sequence from={SEG[1].from - s(15)} durationInFrames={SEG[1].to - SEG[1].from}>
        <Whip dur={SEG[1].to - SEG[1].from}>
          <MapRoute dur={SEG[1].to - SEG[1].from} />
          <Label word="مناسب" sub="لميزانيتك واحتياجك" />
        </Whip>
      </Sequence>
      <Sequence from={SEG[2].from - s(15)} durationInFrames={SEG[2].to - SEG[2].from}>
        <Whip dur={SEG[2].to - SEG[2].from}>
          <Card src="img/docs_1.png" dur={SEG[2].to - SEG[2].from} color={C.cyan} />
          <Label word="موثّق" sub="كل تفصيل واضح" />
          <Stamp at={s(1.0)} />
        </Whip>
      </Sequence>
      <Sequence from={SEG[3].from - s(15)} durationInFrames={SEG[3].to - SEG[3].from}>
        <Whip dur={SEG[3].to - SEG[3].from} last>
          <Card src="img/hand_2.png" dur={SEG[3].to - SEG[3].from} />
          <Label word="شفاف" sub="سعر عادل من أول زيارة لين الاستلام" />
        </Whip>
      </Sequence>
      <Progress active={active} />
      <Caption text="شقق مختارة بعناية، تستاهل وقتك." from={rel(15.15)} to={rel(17.75)} y={1480} size={44} />
      <Caption text="نعرض لك اللي يناسب ميزانيتك واحتياجك، بدون مشاوير زايدة." from={rel(17.95)} to={rel(21.6)} y={1450} size={42} />
      <Caption text="كل عقار موثّق، وكل تفصيل واضح قبل لا توقّع." from={rel(21.85)} to={rel(25.15)} y={1480} size={44} />
      <Caption text="سعر عادل، وتعامل بشفافية من أول زيارة لين الاستلام." from={rel(25.45)} to={rel(29.6)} y={1450} size={42} />
      <Grain amount={0.05} />
    </AbsoluteFill>
  );
};
const Stamp: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = interpolate(f, [at, at + 5, at + 9], [2.4, 0.92, 1], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: 640,
        top: 1000,
        width: 300,
        height: 300,
        borderRadius: '50%',
        border: `10px solid ${C.cyan}`,
        boxShadow: glow(C.cyan, 1),
        transform: `translate(-50%,-50%) rotate(-14deg) scale(${p})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        background: 'rgba(18,15,51,0.55)',
        fontFamily: AR,
        color: '#fff',
        direction: 'rtl',
      }}
    >
      <div style={{ fontSize: 110, lineHeight: 1, color: C.cyan, textShadow: glow(C.cyan, 0.6) }}>✓</div>
      <div style={{ fontWeight: 900, fontSize: 52 }}>موثّق</div>
    </div>
  );
};

/* ---------------- 5. THE MOMENT (30 – 38 s) ---------------- */
const Moment: React.FC = () => {
  const f = useCurrentFrame(); // 0..240
  const D = 240;
  const at = (sec: number) => s(sec - 30);
  const zoomA = 1.0;
  const zoomB = 1.12;
  const cx = 0.42;
  const z = interpolate(f, [0, D], [zoomA, zoomB], clamp);
  const W = 1920 * z * (1280 / 720);
  const H = 1920 * z;
  const handX = 540 + (0.305 - cx) * W;
  const handY = (1920 - H) / 2 + 0.5 * H;
  const fly = interpolate(f, [at(31.2), at(33.6)], [0, 1], { ...clamp, easing: easeInOut });
  const sx = 1000;
  const sy = 260;
  const bx = sx + (handX - sx) * fly + Math.sin(fly * Math.PI * 2) * 90 * (1 - fly);
  const by = sy + (handY - 40 - sy) * fly - Math.sin(fly * Math.PI) * 160;
  const landed = fly >= 1;
  const fadeIn = interpolate(f, [0, 10], [0, 1], clamp);
  const endGlow = interpolate(f, [at(37.4), at(38)], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: C.bg, opacity: fadeIn }}>
      <Bleed src="img/family_1.png" cx={cx} dur={D} zoom={[zoomA, zoomB]} filter="saturate(1.1) brightness(0.95)" />
      <AbsoluteFill style={{ background: `linear-gradient(to bottom, ${C.bg}dd 0%, transparent 28%, transparent 62%, ${C.bg}ee 100%)` }} />
      {f > at(31.0) && (
        <>
          <Sparkles path={(t) => [sx + (handX - sx) * t + Math.sin(t * Math.PI * 2) * 90 * (1 - t), sy + (handY - 40 - sy) * t - Math.sin(t * Math.PI) * 160]} t={fly} />
          <Butterfly x={bx} y={by} size={landed ? 110 : 130} flap={landed ? 0.35 : 1} rot={landed ? -10 : -25} />
        </>
      )}
      {landed && (
        <div style={{ position: 'absolute', left: handX - 120, top: handY - 160, width: 240, height: 240, borderRadius: '50%', background: `radial-gradient(circle, ${C.cyan}55, transparent 70%)`, opacity: interpolate(f, [at(33.6), at(34.2)], [1, 0.4], clamp) }} />
      )}
      <Caption text="لأن البيت قرار عمر… ويستاهل أحد يدلّك عليه صح." from={at(30.5)} to={at(34.1)} y={170} size={50} />
      {f >= at(34.4) && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 1500, display: 'flex', flexDirection: 'row-reverse', justifyContent: 'center', gap: 26, direction: 'rtl' }}>
          {['ثقة', '·', 'ذوق', '·', 'احتراف'].map((w, i) => {
            const t = at(34.4) + i * 6;
            const p = interpolate(f, [t, t + 10], [0, 1], { ...clamp, easing: ease });
            return (
              <span key={i} style={{ fontFamily: AR, fontWeight: 900, fontSize: w === '·' ? 80 : 110, color: '#fff', WebkitTextStroke: `3px ${C.cyan}`, textShadow: glow(C.cyan, 1.1), opacity: p, transform: `translateY(${(1 - p) * 40}px)`, display: 'inline-block' }}>
                {w}
              </span>
            );
          })}
        </div>
      )}
      <Vignette k={0.55} />
      <AbsoluteFill style={{ background: `radial-gradient(circle, #ffffff, ${C.purple})`, opacity: endGlow * 0.9, mixBlendMode: 'screen' }} />
    </AbsoluteFill>
  );
};

/* ---------------- 6. CTA (38 – 45 s) ---------------- */
const CTA: React.FC = () => {
  const f = useCurrentFrame(); // 0..210
  const at = (sec: number) => s(sec - 38);
  const inP = interpolate(f, [0, 12], [0, 1], clamp);
  const info = (k: number) => interpolate(f, [at(39.2) + k * 6, at(39.2) + k * 6 + 10], [0, 1], { ...clamp, easing: ease });
  const pulse = 1 + 0.04 * Math.sin(f / 4);
  const btn = interpolate(f, [at(40.4), at(40.8)], [0, 1], { ...clamp, easing: ease });
  // butterfly circles logo, then exits
  const orbit = f / 18;
  const exit = interpolate(f, [at(43.4), at(44.5)], [0, 1], { ...clamp, easing: easeIn });
  const bx = 540 + Math.cos(orbit) * 330 + exit * 900;
  const by = 330 + Math.sin(orbit) * 90 - exit * 700;
  const fadeOut = interpolate(f, [at(44.3), at(45)], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <NeonGrid speed={0.5} horizon={1180} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, #ffffff, transparent 60%)`, opacity: (1 - inP) * 0.8, mixBlendMode: 'screen' }} />
      <Logo p={interpolate(f, [0, 30], [0.5, 1], clamp)} y={120} scale={0.82} />
      <Caption text="تدوّر عقارك؟ قل لنا وش تبي… ونجيبه لك." from={at(38.3)} to={at(41.3)} y={640} size={50} />
      {/* contact card */}
      <div style={{ position: 'absolute', left: 90, right: 90, top: 800, direction: 'rtl' }}>
        {[
          { icon: '📞', text: '0565005633', size: 84 },
          { icon: '✉️', text: 'ulwaqedi@gmail.com', size: 54 },
        ].map((r, k) => (
          <div
            key={k}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 26,
              justifyContent: 'center',
              margin: '0 0 30px',
              padding: '18px 30px',
              borderRadius: 28,
              background: 'rgba(18,15,51,0.75)',
              border: `3px solid ${k ? C.purple : C.cyan}`,
              boxShadow: glow(k ? C.purple : C.cyan, 0.6),
              opacity: info(k),
              transform: `translateY(${(1 - info(k)) * 40}px)`,
            }}
          >
            <span style={{ fontSize: r.size * 0.8 }}>{r.icon}</span>
            <span style={{ fontFamily: EN, fontWeight: 800, fontSize: r.size, color: '#fff', direction: 'ltr', letterSpacing: k ? 0 : 3 }}>{r.text}</span>
          </div>
        ))}
      </div>
      {/* neon button */}
      <div
        style={{
          position: 'absolute',
          left: 140,
          right: 140,
          top: 1290,
          textAlign: 'center',
          fontFamily: AR,
          fontWeight: 900,
          fontSize: 76,
          color: '#fff',
          padding: '18px 0 30px',
          borderRadius: 999,
          background: `linear-gradient(90deg, ${C.purple}, #8a4dff)`,
          boxShadow: `${glow(C.purple, 1.6)}, inset 0 0 0 4px #E7D3FF`,
          direction: 'rtl',
          opacity: btn,
          transform: `scale(${(0.6 + 0.4 * btn) * (btn >= 1 ? pulse : 1)})`,
        }}
      >
        اطلب عقارك الآن ←
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1490, textAlign: 'center', fontFamily: AR_BODY, fontWeight: 700, fontSize: 40, color: C.white, opacity: btn * 0.8, direction: 'rtl' }}>
        شقق · فلل · أراضي
      </div>
      {f > 10 && <Butterfly x={bx} y={by} size={110} rot={Math.cos(orbit) * 20 + exit * 40} />}
      <Grain amount={0.05} />
      <AbsoluteFill style={{ background: '#000', opacity: fadeOut }} />
    </AbsoluteFill>
  );
};

/* ---------------- master ---------------- */
export const AbuKayanAd: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Sequence from={0} durationInFrames={s(3.6)}>
      <Hook />
    </Sequence>
    <Sequence from={s(3.6)} durationInFrames={s(10) - s(3.6)}>
      <Struggle />
    </Sequence>
    <Sequence from={s(10)} durationInFrames={s(5)}>
      <Shift />
    </Sequence>
    <Sequence from={s(15)} durationInFrames={s(15)}>
      <Features />
    </Sequence>
    <Sequence from={s(30)} durationInFrames={s(8)}>
      <Moment />
    </Sequence>
    <Sequence from={s(38)} durationInFrames={s(7)}>
      <CTA />
    </Sequence>
  </AbsoluteFill>
);
