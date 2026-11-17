import React from 'react';
import { AbsoluteFill, Img, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { ArchWipe, B, BrandBg, COPPER_GRAD, DIN, Glint, Lockup, Mark, PLEX, Reveal, Rule, clamp, ease, easeInOut, s } from './brand';

export const DURATION = s(45); // 1350

/* scene boundaries (frames) — timed to the voice-over, see scripts/mix.py */
const T = { pain: s(4.0), turn: s(11.0), pillars: s(16.0), moment: s(30.0), cta: s(37.5) };

/* ---------- shared ---------- */
const Photo: React.FC<{ src: string; dur: number; zoom?: [number, number]; origin?: string; filter?: string }> = ({ src, dur, zoom = [1.0, 1.08], origin = '50% 50%', filter }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, dur], zoom, clamp);
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${z})`, transformOrigin: origin, filter }} />
    </AbsoluteFill>
  );
};
const H: React.FC<{ children: React.ReactNode; size: number; color?: string; weight?: number; y: number; align?: 'right' | 'center'; font?: string; left?: number }> = ({
  children,
  size,
  color = B.cream,
  weight = 700,
  y,
  align = 'right',
  font = DIN,
  left = 80,
}) => (
  <div style={{ position: 'absolute', left, right: 80, top: y, textAlign: align, direction: 'rtl', fontFamily: font, fontWeight: weight, fontSize: size, color, lineHeight: 1.25 }}>{children}</div>
);
const Cu: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ color: B.copper }}>{children}</span>;

/* ---------- 1. HOOK  0 – 4.0 s : «كم شقة زرت… وما حسّيت إن وحدة منها بيتك؟» ---------- */
const HOOK_IMGS = ['img/living_b.jpg', 'img/v1_kitchen_1.jpg', 'img/kitchen_b.jpg', 'img/v1_living_2.jpg', 'img/hood_b.jpg', 'img/v1_living_1.jpg', 'img/living_a.jpg', 'img/v1_struggle_2.jpg'];
const Hook: React.FC = () => {
  const f = useCurrentFrame(); // 0..120
  const step = Math.min(HOOK_IMGS.length * 2 - 1, Math.max(0, Math.floor((f - 8) / 5)));
  const img = HOOK_IMGS[step % HOOK_IMGS.length];
  const settle = interpolate(f, [92, 112], [0, 1], clamp);
  const archIn = interpolate(f, [0, 16], [0, 1], { ...clamp, easing: ease });
  const visits = 3 + step;
  return (
    <AbsoluteFill>
      <BrandBg />
      <H y={130} size={104} weight={700}>
        <Reveal at={4}>كم شقة زرت…</Reveal>
      </H>
      <H y={272} size={66} weight={500}>
        <Reveal at={44}>
          وما حسّيت إن وحدة منها <span style={{ fontWeight: 700, color: B.copper }}>بيتك؟</span>
        </Reveal>
      </H>
      {/* arch window */}
      <div
        style={{
          position: 'absolute',
          left: 130,
          top: 520,
          width: 820,
          height: 1180,
          borderRadius: '410px 410px 10px 10px',
          overflow: 'hidden',
          border: `4px solid ${B.copper}`,
          transform: `translateY(${(1 - archIn) * 120}px)`,
          opacity: archIn,
          boxShadow: '0 40px 90px rgba(0,0,0,0.55)',
        }}
      >
        <Img
          src={staticFile(img)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: `saturate(${0.9 - settle * 0.7}) sepia(0.15) brightness(${1 - settle * 0.3})`, transform: `scale(${1.12 - (f % 5) * 0.012})` }}
        />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${B.navyDeep}cc, transparent 40%)` }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 46, textAlign: 'center', direction: 'rtl', fontFamily: DIN, fontWeight: 500, fontSize: 40, color: B.cream }}>
          الزيارة رقم <span style={{ fontWeight: 700, fontSize: 64, color: B.copper, display: 'inline-block', minWidth: 80 }}>{visits}</span>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 108, top: 498, width: 864, height: 1224, borderRadius: '432px 432px 14px 14px', border: `1.5px solid ${B.copper}`, opacity: 0.45 * archIn }} />
    </AbsoluteFill>
  );
};

/* ---------- 2. PAIN  4.0 – 11.0 s ---------- */
const PAINS = [
  { t: 'صور مفلترة', at: 8 },
  { t: 'أسعار ما لها سقف', at: 38 },
  { t: 'مواعيد تاكل يومك', at: 78 },
];
const Pain: React.FC = () => {
  const f = useCurrentFrame(); // 0..210
  const listOut = interpolate(f, [128, 140], [1, 0], clamp);
  return (
    <AbsoluteFill>
      <Photo src="img/struggle_a.jpg" dur={210} zoom={[1.1, 1.0]} origin="40% 30%" filter="saturate(0.55) brightness(0.85) contrast(1.05)" />
      <AbsoluteFill style={{ background: `linear-gradient(to bottom, ${B.navyDeep}55 0%, transparent 30%, ${B.navy}e6 58%, ${B.navyDeep} 100%)` }} />
      <div style={{ opacity: listOut }}>
        {PAINS.map((p, i) => {
          const y = 1170 + i * 140;
          const strike = interpolate(f, [p.at + 16, p.at + 28], [0, 1], { ...clamp, easing: easeInOut });
          return (
            <React.Fragment key={i}>
              <Reveal at={p.at} style={{ position: 'absolute', right: 90, top: y, direction: 'rtl', display: 'flex', alignItems: 'baseline', gap: 26 }}>
                <span style={{ fontFamily: DIN, fontWeight: 300, fontSize: 44, color: B.copper }}>0{i + 1}</span>
                <span style={{ fontFamily: DIN, fontWeight: 500, fontSize: 70, color: B.cream, opacity: 1 - strike * 0.45 }}>{p.t}</span>
              </Reveal>
              {f >= p.at + 16 && <div style={{ position: 'absolute', right: 80, top: y + 58, width: 760 * strike, height: 4, background: COPPER_GRAD, transformOrigin: 'right' }} />}
            </React.Fragment>
          );
        })}
      </div>
      <H y={1250} size={58} weight={500} align="center">
        <Reveal at={136} style={{ textAlign: 'center' }}>
          <Cu>والنتيجة؟</Cu>
        </Reveal>
      </H>
      <H y={1340} size={124} weight={900} align="center">
        <Reveal at={164} style={{ textAlign: 'center' }}>
          تعب بلا فايدة.
        </Reveal>
      </H>
      <Rule at={172} x={340} y={1530} w={400} />
    </AbsoluteFill>
  );
};

/* ---------- 3. TURN  11.0 – 16.0 s : logo build + «نسمعك أول… وبعدين ندوّر لك» ---------- */
const Turn: React.FC = () => {
  const f = useCurrentFrame(); // 0..150
  const p = interpolate(f, [4, 60], [0, 1], clamp);
  const up = interpolate(f, [62, 84], [0, 1], { ...clamp, easing: easeInOut });
  const shine = interpolate(f, [40, 70], [-0.2, 1.2], clamp);
  return (
    <AbsoluteFill>
      <BrandBg />
      <div style={{ position: 'absolute', left: 0, right: 0, top: interpolate(up, [0, 1], [560, 170]), display: 'flex', justifyContent: 'center', transform: `scale(${1 - 0.3 * up})`, transformOrigin: '50% 0%' }}>
        <Lockup markW={360} p={p} shine={shine} nameSize={80} id="turn" />
      </div>
      <H y={1010} size={112} weight={700} align="center">
        <Reveal at={78} style={{ textAlign: 'center' }}>
          نسمعك أوّل…
        </Reveal>
      </H>
      <Rule at={88} x={390} y={1180} w={300} />
      <H y={1210} size={112} weight={700} align="center">
        <Reveal at={94} style={{ textAlign: 'center' }}>
          <Cu>وبعدين ندوّر لك.</Cu>
        </Reveal>
      </H>
    </AbsoluteFill>
  );
};

/* ---------- 4. PILLARS  16.0 – 30.0 s ---------- */
const PILLARS = [
  { from: s(16.0), to: s(19.9), title: 'ننقّي لك بعناية', sub: 'شقق تستاهل زيارتك… مو أي إعلان', img: 'img/living_a.jpg', tag: 'انتقاء', origin: '50% 60%' },
  { from: s(19.9), to: s(23.0), title: 'على قد ميزانيتك', sub: 'وفي الحي اللي يناسبك', img: 'img/hood_a.jpg', tag: 'ميزانية', origin: '50% 55%' },
  { from: s(23.0), to: s(26.6), title: 'أوراق نظامية', sub: 'ومراجعة كاملة قبل ما توقّع', img: 'img/docs_a.jpg', tag: 'نظامية', origin: '60% 70%' },
  { from: s(26.6), to: s(30.0), title: 'سعر واضح', sub: 'من البداية… بدون مفاجآت', img: 'img/hand_a.jpg', tag: 'وضوح', origin: '50% 45%' },
];
const PinDrop: React.FC<{ at: number; x: number; y: number }> = ({ at, x, y }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const drop = interpolate(f, [at, at + 10], [-160, 0], { ...clamp, easing: ease });
  const ring = ((f - at - 8) % 30) / 30;
  return (
    <>
      {f > at + 8 && <div style={{ position: 'absolute', left: x - 90 * ring, top: y - 34 * ring, width: 180 * ring, height: 68 * ring, borderRadius: '50%', border: `3px solid ${B.copper}`, opacity: 1 - ring }} />}
      <svg width={90} height={120} viewBox="-45 -110 90 120" style={{ position: 'absolute', left: x - 45, top: y - 110 + drop, overflow: 'visible', filter: 'drop-shadow(0 10px 14px rgba(0,0,0,0.5))' }}>
        <path d="M0,0 C-40,-46 -40,-104 0,-104 C40,-104 40,-46 0,0 Z" fill={B.copper} stroke={B.copperLight} strokeWidth={3} />
        <g transform="translate(0,-64) scale(0.07)" fill="none" stroke={B.navy} strokeWidth={60}>
          <path d="M-305,300 L-305,0 L-120,-90 L-120,300 M-120,300 L-120,-250 L150,-350 L150,300 M150,-90 L300,0 L300,300" />
        </g>
      </svg>
    </>
  );
};
const Seal: React.FC<{ at: number; x: number; y: number }> = ({ at, x, y }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = interpolate(f, [at, at + 5, at + 9], [2.2, 0.94, 1], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: x - 150,
        top: y - 150,
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: `${B.navy}e6`,
        border: `5px solid ${B.copper}`,
        boxShadow: `0 0 0 10px ${B.navy}99, 0 0 0 12px ${B.copper}88, 0 20px 50px rgba(0,0,0,0.5)`,
        transform: `rotate(-10deg) scale(${p})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        direction: 'rtl',
      }}
    >
      <svg width={90} height={70} viewBox="0 0 90 70">
        <path d="M8,36 L34,60 L82,10" fill="none" stroke={B.copper} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div style={{ fontFamily: DIN, fontWeight: 700, fontSize: 46, color: B.cream, marginTop: 6 }}>تمت المراجعة</div>
    </div>
  );
};
const Pill: React.FC<{ at: number; x: number; y: number; text: string }> = ({ at, x, y, text }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = interpolate(f, [at, at + 10], [0, 1], { ...clamp, easing: ease });
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) translateY(${(1 - p) * 30}px)`, opacity: p, direction: 'rtl', display: 'flex', alignItems: 'center', gap: 14, background: `${B.navy}ee`, border: `2px solid ${B.copper}`, borderRadius: 14, padding: '10px 30px 16px', fontFamily: DIN, fontWeight: 700, fontSize: 46, color: B.cream, whiteSpace: 'nowrap', boxShadow: '0 16px 40px rgba(0,0,0,0.45)' }}>
      <svg width={36} height={30} viewBox="0 0 90 70">
        <path d="M8,36 L34,60 L82,10" fill="none" stroke={B.copper} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {text}
    </div>
  );
};
const PillarScene: React.FC<{ i: number }> = ({ i }) => {
  const f = useCurrentFrame();
  const P = PILLARS[i];
  const dur = P.to - P.from;
  const rv = i === 0 ? 1 : interpolate(f, [0, 12], [0, 1], { ...clamp, easing: easeInOut });
  const frameIn = interpolate(f, [0, 18], [0, 1], { ...clamp, easing: ease });
  return (
    <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${(1 - rv) * 100}%)` }}>
      <BrandBg />
      {/* big outlined number */}
      <div style={{ position: 'absolute', left: 70, top: 110, fontFamily: DIN, fontWeight: 300, fontSize: 190, lineHeight: 1, color: 'transparent', WebkitTextStroke: `2.5px ${B.copper}`, opacity: frameIn }}>
        0{i + 1}
        <span style={{ fontSize: 44, WebkitTextStroke: '0', color: B.slate, marginLeft: 6 }}>/04</span>
      </div>
      <H y={130} size={88} weight={700} left={340}>
        <Reveal at={6}>{P.title}</Reveal>
      </H>
      <H y={262} size={44} weight={400} font={DIN} left={340}>
        <Reveal at={14}>
          <span style={{ color: B.copperLight }}>{P.sub}</span>
        </Reveal>
      </H>
      {/* arch photo frame */}
      <div style={{ position: 'absolute', left: 90, top: 450, width: 900, height: 1200, borderRadius: '450px 450px 8px 8px', overflow: 'hidden', border: `4px solid ${B.copper}`, boxShadow: '0 40px 90px rgba(0,0,0,0.55)', transform: `translateY(${(1 - frameIn) * 60}px)` }}>
        <Photo src={P.img} dur={dur} zoom={[1.0, 1.1]} origin={P.origin} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${B.navyDeep}aa, transparent 35%)` }} />
        {i === 1 && <PinDrop at={18} x={470} y={760} />}
      </div>
      <div style={{ position: 'absolute', left: 68, top: 428, width: 944, height: 1244, borderRadius: '472px 472px 12px 12px', border: `1.5px solid ${B.copper}`, opacity: 0.45 }} />
      {i === 1 && <Pill at={30} x={540} y={1560} text="ميزانيتك محفوظة" />}
      {i === 2 && <Seal at={34} x={700} y={1380} />}
      {i === 3 && <Pill at={24} x={540} y={1560} text="بدون مفاجآت" />}
    </AbsoluteFill>
  );
};
const PillarProgress: React.FC = () => {
  const f = useCurrentFrame() + T.pillars;
  return (
    <div style={{ position: 'absolute', left: 90, right: 90, top: 1730, display: 'flex', flexDirection: 'row-reverse', gap: 22 }}>
      {PILLARS.map((P, i) => {
        const fill = interpolate(f, [P.from, P.to], [0, 1], clamp);
        const active = f >= P.from;
        return (
          <div key={i} style={{ flex: 1 }}>
            <div style={{ height: 4, background: `${B.slate}44`, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: `${fill * 100}%`, background: COPPER_GRAD }} />
            </div>
            <div style={{ marginTop: 14, textAlign: 'center', fontFamily: DIN, fontWeight: active ? 700 : 400, fontSize: 36, color: active ? B.cream : `${B.slate}aa`, direction: 'rtl' }}>{P.tag}</div>
          </div>
        );
      })}
    </div>
  );
};
const Pillars: React.FC = () => (
  <AbsoluteFill>
    {PILLARS.map((P, i) => (
      <Sequence key={i} from={P.from - T.pillars} durationInFrames={(PILLARS[i + 1]?.from ?? T.moment) - P.from + (i < 3 ? 12 : 0)}>
        <PillarScene i={i} />
      </Sequence>
    ))}
    {/* copper sweep line on each pillar change */}
    {PILLARS.slice(1).map((P, k) => (
      <Sequence key={`l${k}`} from={P.from - T.pillars} durationInFrames={13}>
        <SweepLine />
      </Sequence>
    ))}
    <PillarProgress />
  </AbsoluteFill>
);
const SweepLine: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 12], [0, 1], { ...clamp, easing: easeInOut });
  const x = 1080 * (1 - p);
  return (
    <>
      <div style={{ position: 'absolute', left: x - 2, top: 0, width: 4, height: 1920, background: `linear-gradient(${B.copperDark}, ${B.copperLight}, ${B.copperDark})` }} />
      <div style={{ position: 'absolute', left: x - 60, top: 0, width: 120, height: 1920, background: `radial-gradient(ellipse at center, ${B.copper}55, transparent 70%)` }} />
    </>
  );
};

/* ---------- 5. MOMENT  30.0 – 37.5 s ---------- */
const Moment: React.FC = () => {
  const f = useCurrentFrame(); // 0..225
  return (
    <AbsoluteFill>
      <Photo src="img/family_b.jpg" dur={225} zoom={[1.0, 1.12]} origin="26% 50%" filter="saturate(1.05)" />
      <AbsoluteFill style={{ background: `linear-gradient(to bottom, ${B.navyDeep}88 0%, transparent 18%, transparent 55%, ${B.navy}ee 80%, ${B.navyDeep} 100%)` }} />
      <Glint at={40} x={290} y={975} />
      <Glint at={118} x={300} y={985} size={90} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 90, display: 'flex', justifyContent: 'center', opacity: interpolate(f, [10, 30], [0, 0.9], clamp) }}>
        <Mark width={92} id="mo" />
      </div>
      <H y={1430} size={68} weight={500} align="center">
        <Reveal at={24} style={{ textAlign: 'center' }}>
          لأن المفتاح اللي بتستلمه…
        </Reveal>
      </H>
      <H y={1530} size={104} weight={700} align="center">
        <Reveal at={84} style={{ textAlign: 'center' }}>
          <Cu>بداية حكاية عيلتك.</Cu>
        </Reveal>
      </H>
      <Rule at={96} x={390} y={1700} w={300} />
    </AbsoluteFill>
  );
};

/* ---------- 6. CTA  37.5 – 45 s ---------- */
const Icon: React.FC<{ kind: 'phone' | 'mail' }> = ({ kind }) => (
  <svg width={54} height={54} viewBox="0 0 24 24" fill="none" stroke={B.copper} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    {kind === 'phone' ? (
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
    ) : (
      <>
        <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
        <path d="M3 6l9 7 9-7" />
      </>
    )}
  </svg>
);
const CTA: React.FC = () => {
  const f = useCurrentFrame(); // 0..225
  const p = interpolate(f, [0, 50], [0.35, 1], clamp);
  const shine = interpolate(f, [90, 120], [-0.2, 1.2], clamp);
  const row = (k: number) => interpolate(f, [100 + k * 8, 112 + k * 8], [0, 1], { ...clamp, easing: ease });
  const btn = interpolate(f, [124, 138], [0, 1], { ...clamp, easing: ease });
  const sweep = ((f - 140) % 60) / 60;
  return (
    <AbsoluteFill>
      <BrandBg />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 150, display: 'flex', justifyContent: 'center', transform: `scale(${f > 88 && f < 110 ? 1 + 0.02 * Math.sin(((f - 88) / 22) * Math.PI) : 1})` }}>
        <Lockup markW={300} p={p} shine={shine} nameSize={72} id="cta" />
      </div>
      <H y={790} size={84} weight={700} align="center">
        <Reveal at={14} style={{ textAlign: 'center' }}>
          قل لنا وش تدوّر…
        </Reveal>
      </H>
      <H y={900} size={84} weight={700} align="center">
        <Reveal at={52} style={{ textAlign: 'center' }}>
          <Cu>والباقي علينا.</Cu>
        </Reveal>
      </H>
      {/* contact rows */}
      {[
        { k: 'phone' as const, text: '0565005633', size: 74, w: 700, ls: 4 },
        { k: 'mail' as const, text: 'ulwaqedi@gmail.com', size: 50, w: 500, ls: 1 },
      ].map((r, k) => (
        <div
          key={k}
          style={{
            position: 'absolute',
            left: 130,
            right: 130,
            top: 1080 + k * 140,
            height: 116,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 26,
            borderTop: k === 0 ? `1.5px solid ${B.copper}66` : undefined,
            borderBottom: `1.5px solid ${B.copper}66`,
            opacity: row(k),
            transform: `translateY(${(1 - row(k)) * 30}px)`,
          }}
        >
          <Icon kind={r.k} />
          <span style={{ fontFamily: DIN, fontWeight: r.w, fontSize: r.size, color: B.cream, letterSpacing: r.ls, direction: 'ltr' }}>{r.text}</span>
        </div>
      ))}
      {/* button */}
      <div
        style={{
          position: 'absolute',
          left: 170,
          right: 170,
          top: 1420,
          height: 136,
          borderRadius: 14,
          background: COPPER_GRAD,
          backgroundSize: '200% 100%',
          backgroundPosition: `${(1 - sweep) * 100}% 0`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          direction: 'rtl',
          fontFamily: DIN,
          fontWeight: 700,
          fontSize: 62,
          color: B.navyDeep,
          opacity: btn,
          transform: `scale(${0.85 + 0.15 * btn})`,
          boxShadow: `0 18px 50px rgba(0,0,0,0.45), 0 0 0 8px ${B.navy}, 0 0 0 9.5px ${B.copper}88`,
        }}
      >
        تواصل معنا الآن
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1610, textAlign: 'center', fontFamily: PLEX, fontSize: 38, color: B.slate, direction: 'rtl', opacity: btn, letterSpacing: 1 }}>
        شقق · فلل · أراضي
      </div>
    </AbsoluteFill>
  );
};

/* ---------- master ---------- */
export const AbuKayanAd: React.FC = () => (
  <AbsoluteFill style={{ background: B.navy }}>
    <Sequence from={0} durationInFrames={T.pain}>
      <Hook />
    </Sequence>
    <Sequence from={T.pain} durationInFrames={T.turn - T.pain}>
      <Pain />
    </Sequence>
    <Sequence from={T.turn} durationInFrames={T.pillars - T.turn}>
      <Turn />
    </Sequence>
    <Sequence from={T.pillars} durationInFrames={T.moment - T.pillars}>
      <Pillars />
    </Sequence>
    <Sequence from={T.moment} durationInFrames={T.cta - T.moment}>
      <Moment />
    </Sequence>
    <Sequence from={T.cta} durationInFrames={DURATION - T.cta}>
      <CTA />
    </Sequence>
    <ArchWipe cut={T.pain} />
    <ArchWipe cut={T.turn} />
    <ArchWipe cut={T.pillars} />
    <ArchWipe cut={T.moment} />
    <ArchWipe cut={T.cta} />
  </AbsoluteFill>
);
