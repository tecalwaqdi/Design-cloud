import React from 'react';
import { AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame } from 'remotion';
import '@fontsource/almarai/400.css';
import '@fontsource/almarai/700.css';
import '@fontsource/almarai/800.css';
import '@fontsource/noto-kufi-arabic/600.css';
import '@fontsource/noto-kufi-arabic/700.css';
import '@fontsource/noto-sans/500.css';
import '@fontsource/noto-sans/700.css';
import { AR, Bokeh, BrandBg, C, EN, Flash, Grain, H, KUFI, Particles, Photo, Range, Shockwave, Vignette, Words, back, clamp, ease, easeIn, easeInOut, lerp, s2f, shake } from './fx';
import { Bug, Lockup, Mark } from './logo';
import { IcAt, IcBolt, IcBug, IcCheck, IcClock, IcCrane, IcDoc, IcEye, IcGlobe, IcGov, IcKey, IcPhone, IcPin, IcPlan, IcShield, IcShop, IcSpark, IcTarget, IcTax } from './icons';
import { CONTACT, T } from './data';

export const DURATION = s2f(49.5);

/* ======================= transitions ======================= */
/** Brand chevron wipe: an upward chevron band (the logo's arrow) sweeps bottom→top, fully covering the cut at `at`. */
const ChevronWipe: React.FC<{ at: number; dur?: number }> = ({ at, dur = 16 }) => {
  const f = useCurrentFrame();
  if (f < at - dur / 2 || f > at + dur / 2) return null;
  const p = interpolate(f, [at - dur / 2, at + dur / 2], [0, 1], { ...clamp, easing: easeInOut });
  const A = 420; // chevron depth
  const band = 2500;
  const top = interpolate(p, [0, 1], [1920 + 60, -band - A - 60]);
  const chev = (y0: number, y1: number) => `0,${y0 + A} 540,${y0} 1080,${y0 + A} 1080,${y1 + A} 540,${y1} 0,${y1 + A}`;
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <polygon points={chev(top - 40, top - 16)} fill="#ffffff" opacity={0.9} />
      <polygon points={chev(top, top + band)} fill={C.green} />
      <polygon points={chev(top + 130, top + band)} fill={C.navy} />
      <polygon points={chev(top + 150, top + 170)} fill={C.mint} opacity={0.6} />
    </svg>
  );
};

/** quick light sweep */
const Sweep: React.FC<{ at: number; dur?: number; y?: number; h?: number }> = ({ at, dur = 18, y = 0, h = 1920 }) => {
  const f = useCurrentFrame();
  if (f < at || f > at + dur) return null;
  const x = interpolate(f, [at, at + dur], [-700, 1500], { ...clamp, easing: easeInOut });
  return <div style={{ position: 'absolute', left: x, top: y, width: 260, height: h, transform: 'skewX(-18deg)', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)', mixBlendMode: 'screen', pointerEvents: 'none' }} />;
};

/* ======================= 1. HOOK (0 – 7.3 s) ======================= */
const HOOK_CARDS = [
  { t: T.sijil, title: 'سجل تجاري', Icon: IcDoc, x: 300, y: 610, r: -8 },
  { t: T.baladiya, title: 'رخصة بلدية', Icon: IcShop, x: 780, y: 860, r: 7 },
  { t: T.difa, title: 'دفاع مدني', Icon: IcShield, x: 320, y: 1130, r: 5 },
  { t: T.zakat, title: 'زكاة وضريبة', Icon: IcTax, x: 770, y: 1390, r: -6 },
];

const PaperCard: React.FC<{ title: string; Icon: React.FC<{ size?: number; color?: string; p?: number }>; stamp: number; stampText?: string; stampColor?: string }> = ({ title, Icon, stamp, stampText = 'مطلوب', stampColor = '#e0474c' }) => (
  <div style={{ width: 500, height: 330, borderRadius: 18, background: '#f7f8fb', boxShadow: '0 30px 60px rgba(0,0,20,0.55), 0 0 0 1px rgba(255,255,255,0.4)', overflow: 'hidden', position: 'relative', direction: 'rtl' }}>
    <div style={{ height: 104, background: C.navy, display: 'flex', alignItems: 'center', gap: 20, padding: '0 30px' }}>
      <Icon size={62} color={C.mint} />
      <div style={{ fontFamily: AR, fontWeight: 800, fontSize: 50, color: '#fff' }}>{title}</div>
    </div>
    {[0, 1, 2, 3].map((i) => (
      <div key={i} style={{ position: 'absolute', right: 34, top: 140 + i * 40, height: 14, width: [380, 320, 400, 220][i], borderRadius: 7, background: '#d9dde8' }} />
    ))}
    {stamp > 0 && (
      <div style={{ position: 'absolute', left: 34, bottom: 34, transform: `rotate(-14deg) scale(${interpolate(stamp, [0, 1], [2.2, 1])})`, opacity: Math.min(1, stamp * 2), border: `6px solid ${stampColor}`, color: stampColor, fontFamily: AR, fontWeight: 800, fontSize: 46, padding: '4px 26px 10px', borderRadius: 12 }}>
        {stampText}
      </div>
    )}
  </div>
);

const HookPile: React.FC<{ frozen?: number; blast?: number }> = ({ frozen, blast = 0 }) => {
  const live = useCurrentFrame();
  const f = frozen ?? live;
  return (
    <AbsoluteFill>
      {HOOK_CARDS.map((c, i) => {
        const at = s2f(c.t);
        if (f < at) return null;
        const p = interpolate(f, [at, at + 7], [0, 1], { ...clamp, easing: easeIn });
        const sc = interpolate(p, [0, 1], [2.1, 1]);
        const st = lerp(f, at + 6, at + 10, 0, 1);
        const a = Math.atan2(c.y - 960, c.x - 540);
        const bx = Math.cos(a) * 1500 * blast, by = Math.sin(a) * 1700 * blast;
        return (
          <div key={i} style={{ position: 'absolute', left: c.x - 250 + bx, top: c.y - 165 + by, transform: `rotate(${c.r + blast * (i % 2 ? 140 : -140)}deg) scale(${sc})`, opacity: p, filter: p < 1 ? `blur(${(1 - p) * 8}px)` : undefined }}>
            <PaperCard title={c.title} Icon={c.Icon} stamp={st} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const last = s2f(T.zakat);
  const kull = s2f(T.kull);
  const mishwar = s2f(T.mishwar);
  const dim = lerp(f, kull - 2, kull + 8, 0, 1);
  const tilt = interpolate(f, [s2f(6.6), s2f(7.3)], [0, 1], clamp);
  const lastShake = [s2f(T.sijil) + 7, s2f(T.baladiya) + 7, s2f(T.difa) + 7, last + 7].find((a) => f >= a && f <= a + 8) ?? -100;
  // route between government offices
  const routeP = lerp(f, kull, s2f(6.7), 0, 1, easeInOut);
  const stops = [
    [140, 1560], [380, 1450], [640, 1640], [930, 1500],
  ];
  return (
    <AbsoluteFill style={{ background: C.navyDeep }}>
      <BrandBg intensity={0.55} />
      <AbsoluteFill style={{ transform: `${shake(f, lastShake, 8, 14)} scale(${1 + tilt * 0.06}) rotate(${tilt * -2}deg)` }}>
        {/* the pile */}
        <AbsoluteFill style={{ transform: `scale(${1 - dim * 0.18}) translateY(${-dim * 180}px)`, filter: `blur(${dim * 5}px) saturate(${1 - dim * 0.6})`, opacity: 1 - dim * 0.45 }}>
          <HookPile />
        </AbsoluteFill>
        {/* top hook line, visible from frame 0 */}
        <AbsoluteFill style={{ alignItems: 'center', paddingTop: 210, opacity: 1 - dim }}>
          <div style={{ transform: `scale(${interpolate(f, [0, 5], [1.25, 1], { ...clamp, easing: back })})`, display: 'flex', alignItems: 'center', gap: 18, direction: 'rtl', padding: '14px 40px 22px', borderRadius: 99, background: 'rgba(8,24,84,0.75)', border: `3px solid ${C.mint}`, boxShadow: `0 0 40px rgba(111,227,174,0.35)` }}>
            <span style={{ fontFamily: AR, fontWeight: 800, fontSize: 60, color: '#fff' }}>عندك منشأة؟</span>
            <span style={{ fontFamily: AR, fontWeight: 800, fontSize: 60, color: C.mint }}>اسمع هذا</span>
          </div>
        </AbsoluteFill>
        {/* ticking clock */}
        <div style={{ position: 'absolute', right: 60, top: 330, opacity: 0.9 * (1 - dim) }}>
          <IcClock size={96} color="#ffffff" t={f * 0.9} />
        </div>
        {/* «وكل جهة… تبي لها مشوار؟!» */}
        {f >= kull && (
          <>
            <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
              <path d={`M ${stops.map((s) => s.join(' ')).join(' L ')}`} stroke={C.mint} strokeWidth={8} strokeDasharray="22 18" fill="none" strokeLinecap="round" pathLength={1000} style={{ strokeDashoffset: 0, clipPath: `inset(0 ${100 - routeP * 100}% 0 0)` }} />
            </svg>
            {stops.map((s, i) => {
              const at = kull + i * 9;
              const p = lerp(f, at, at + 8, 0, 1, back);
              return (
                <div key={i} style={{ position: 'absolute', left: s[0] - 62, top: s[1] - 150, transform: `scale(${p})`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 124, height: 124, borderRadius: 30, background: 'rgba(8,24,84,0.9)', border: `3px solid ${C.mint}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IcGov size={78} color="#fff" />
                  </div>
                  <div style={{ width: 22, height: 22, borderRadius: 11, background: C.mint, marginTop: 14, boxShadow: `0 0 18px ${C.mint}` }} />
                </div>
              );
            })}
            <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', marginTop: -140 }}>
              <div style={{ transform: `scale(${lerp(f, kull, kull + 6, 1.4, 1, back)})` }}>
                <H size={110}>وكل جهة…</H>
              </div>
              {f >= mishwar && (
                <div style={{ transform: `scale(${lerp(f, mishwar, mishwar + 6, 1.6, 1, back)}) rotate(-2deg)`, marginTop: 10 }}>
                  <H size={128}>
                    تبي لها <span style={{ color: C.mint }}>مشوار؟!</span>
                  </H>
                </div>
              )}
            </AbsoluteFill>
          </>
        )}
      </AbsoluteFill>
      <Flash at={s2f(T.sijil) + 7} dur={4} max={0.18} />
      <Flash at={s2f(T.baladiya) + 7} dur={4} max={0.18} />
      <Flash at={s2f(T.difa) + 7} dur={4} max={0.18} />
      <Flash at={last + 7} dur={4} max={0.18} />
      <Vignette strength={0.85} />
    </AbsoluteFill>
  );
};

/* ======================= 2. PUNCH «لا… خلّها على الشاطر!» (7.3 – 9.5 s) ======================= */
const Punch: React.FC = () => {
  const f = useCurrentFrame();
  const la = s2f(T.la);
  const khalliha = s2f(T.khalliha);
  const hit = s2f(T.shater);
  const blast = lerp(f, hit, hit + 16, 0, 1, easeIn);
  const markP = interpolate(f, [hit - 10, hit + 10], [0, 1], clamp);
  const zoom = f < hit ? interpolate(f, [la, hit], [1, 1.08]) : 1;
  return (
    <AbsoluteFill style={{ background: C.navyDeep }}>
      {f >= hit && <BrandBg intensity={lerp(f, hit, hit + 10, 0, 1)} />}
      {/* the frozen pile, greyed, then blown away */}
      <AbsoluteFill style={{ transform: `scale(${zoom * 0.82}) translateY(-180px)`, filter: `grayscale(${f < hit ? 1 : 0.4}) blur(${f < hit ? 4 : 2}px)`, opacity: f < hit ? 0.35 : Math.max(0, 1 - blast * 1.8) }}>
        <HookPile frozen={s2f(7.2)} blast={blast} />
      </AbsoluteFill>
      {f < hit && (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', transform: `scale(${zoom})` }}>
          <div style={{ transform: `scale(${lerp(f, la, la + 6, 1.5, 1, back)})`, marginTop: -60 }}>
            <H size={250}>لا…</H>
          </div>
          {f >= khalliha && <H size={110} style={{ opacity: lerp(f, khalliha, khalliha + 5, 0, 1) }}>خلّها على</H>}
        </AbsoluteFill>
      )}
      {/* logo assembles on the hit */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', marginTop: -330 }}>
        {f >= hit - 10 && <Mark size={interpolate(f, [hit - 10, hit, hit + 30], [260, 420, 460], clamp)} p={markP} glow={f >= hit ? 1.4 : 0} spin={interpolate(f, [hit - 10, hit + 8], [-120, 0], { ...clamp, easing: ease })} />}
      </AbsoluteFill>
      {f >= hit && (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', marginTop: 360, transform: shake(f, hit, 10, 20) }}>
          <H size={110} style={{ opacity: lerp(f, hit, hit + 4, 0, 1) }}>خلّها على</H>
          <div style={{ transform: `scale(${lerp(f, hit, hit + 7, 1.9, 1, back)})` }}>
            <H size={210} color={C.mint} glow="rgba(111,227,174,0.55)">الشاطر!</H>
          </div>
        </AbsoluteFill>
      )}
      {f >= hit && <Particles progress={lerp(f, hit, hit + 30, 0.05, 1)} cy={630} count={130} seed="punch" />}
      <Shockwave at={hit} cy={630} />
      <Shockwave at={hit + 4} cy={630} color="#fff" size={700} />
      <Flash at={la} dur={5} max={0.25} />
      <Flash at={hit} dur={9} color={C.mint} max={0.75} />
      <Vignette strength={0.8} />
    </AbsoluteFill>
  );
};

/* ======================= 3. BRAND (9.5 – 14.65 s) ======================= */
const Brand: React.FC = () => {
  const f = useCurrentFrame();
  const a = s2f(9.5);
  const name = s2f(T.name);
  const lic = s2f(T.licensed);
  const exp = s2f(T.experience);
  const rise = lerp(f, a, a + 40, 1, 0);
  const years = Math.round(interpolate(f, [exp + 4, s2f(13.6)], [0, 11], { ...clamp, easing: ease }));
  return (
    <AbsoluteFill>
      <BrandBg />
      {/* green triangles from the profile cover */}
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <polygon points={`-40,1920 -40,${1250 + rise * 500} 330,1920`} fill={C.green} />
        <polygon points={`1120,1920 1120,${1180 + rise * 500} 740,1920`} fill={C.green} />
      </svg>
      {/* HQ building rising */}
      <div style={{ position: 'absolute', left: -110, width: 1300, top: 1060 + rise * 700, transform: `scale(${interpolate(f, [a, s2f(14.65)], [1.0, 1.06])})`, transformOrigin: '50% 100%' }}>
        <Img src={staticFile('img/hq_building.png')} style={{ width: 1300 }} />
      </div>
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(4,11,46,0.0) 70%, rgba(4,11,46,0.55) 100%)' }} />
      {/* lockup */}
      <AbsoluteFill style={{ alignItems: 'center', paddingTop: 300 }}>
        <div style={{ transform: `scale(${lerp(f, name - 4, name + 10, 0.85, 1)})`, opacity: lerp(f, name - 6, name, 0, 1) }}>
          <Lockup scale={0.98} p={interpolate(f, [name - 6, name + 16], [0, 1], clamp)} textP={lerp(f, name + 2, name + 22, 0, 1)} />
        </div>
      </AbsoluteFill>
      {/* badges */}
      <AbsoluteFill style={{ alignItems: 'center', paddingTop: 620, direction: 'rtl', gap: 34 }}>
        {f >= lic - 3 && (
          <div style={{ transform: `translateX(${lerp(f, lic - 3, lic + 8, -700, 0)}px)`, display: 'flex', alignItems: 'center', gap: 20, padding: '18px 44px 24px', borderRadius: 99, background: C.green, boxShadow: '0 18px 40px rgba(0,0,0,0.35)' }}>
            <IcCheck size={64} color="#fff" p={lerp(f, lic + 4, lic + 14, 0, 1)} sw={6} />
            <span style={{ fontFamily: AR, fontWeight: 800, fontSize: 64, color: '#fff' }}>مكتب مرخّص</span>
          </div>
        )}
        {f >= exp - 3 && (
          <div style={{ transform: `translateX(${lerp(f, exp - 3, exp + 8, 700, 0)}px)`, display: 'flex', alignItems: 'center', gap: 22, padding: '10px 46px 18px', borderRadius: 36, background: 'rgba(8,24,84,0.82)', border: `3px solid ${C.mint}`, boxShadow: '0 18px 40px rgba(0,0,0,0.35)' }}>
            <span style={{ fontFamily: AR, fontWeight: 700, fontSize: 54, color: '#fff' }}>خبرة أكثر من</span>
            <span style={{ fontFamily: EN, fontWeight: 700, fontSize: 120, color: C.mint, lineHeight: 1.1 }}>{years}</span>
            <span style={{ fontFamily: AR, fontWeight: 700, fontSize: 54, color: '#fff' }}>سنة</span>
          </div>
        )}
      </AbsoluteFill>
      <Bokeh opacity={0.5} />
      <Vignette strength={0.5} />
    </AbsoluteFill>
  );
};

/* ======================= 4. SERVICES (14.65 – 30.5 s) ======================= */
type Svc = { t: number; title: string; sub: string; Icon: React.FC<{ size?: number; color?: string; p?: number; sw?: number }> };
const GROUPS: { from: number; to: number; bg: string; pos?: string; svcs: Svc[]; top: number; gap: number; blueprint?: boolean }[] = [
  {
    from: 14.65, to: T.zatca - 0.05, bg: 'img/tower.jpg', pos: '30% 50%', top: 560, gap: 290,
    svcs: [
      { t: T.svcSijil, title: 'السجلات التجارية', sub: 'إصدار وتجديد وحجز الأسماء التجارية', Icon: IcDoc },
      { t: T.svcBaladiya, title: 'رخص البلدية', sub: 'بكافة الأنشطة وكامل إجراءاتها', Icon: IcShop },
      { t: T.svcSalama, title: 'تصاريح السلامة', sub: 'الدفاع المدني وتقارير السلامة', Icon: IcShield },
    ],
  },
  {
    from: T.zatca - 0.05, to: T.binaa - 0.05, bg: 'img/curved.jpg', top: 640, gap: 330,
    svcs: [
      { t: T.zatca, title: 'التسجيل في الزكاة والدخل', sub: 'وتحديث بيانات المنشأة', Icon: IcGov },
      { t: T.taxNo, title: 'الرقم الضريبي', sub: 'استخراجه للمنشأة ورفع الفواتير', Icon: IcTax },
    ],
  },
  {
    from: T.binaa - 0.05, to: T.nadhafa - 0.05, bg: 'img/cranes.jpg', pos: '20% 50%', top: 560, gap: 330, blueprint: true,
    svcs: [
      { t: T.binaa, title: 'رخص البناء والكروكيات', sub: 'بكافة أنواعها', Icon: IcCrane },
      { t: T.mukhattat, title: 'المخططات الهندسية والإشراف', sub: 'تصميم واعتماد وإشراف على التنفيذ', Icon: IcPlan },
    ],
  },
  {
    from: T.nadhafa - 0.05, to: 30.5, bg: 'img/screens.jpg', top: 560, gap: 290,
    svcs: [
      { t: T.nadhafa, title: 'عقود النظافة', sub: 'المعتمدة للمنشآت التجارية', Icon: IcSpark },
      { t: T.hasharat, title: 'مكافحة الحشرات', sub: 'عقود معتمدة صديقة للبيئة', Icon: IcBug },
      { t: T.ijar, title: 'الإيجار الموحّد', sub: 'للعقارات السكنية والتجارية', Icon: IcKey },
    ],
  },
];
const ALL_SVCS = GROUPS.flatMap((g) => g.svcs);

const ServiceCard: React.FC<Svc & { y: number; exitAt: number }> = ({ t, title, sub, Icon, y, exitAt }) => {
  const f = useCurrentFrame();
  const at = s2f(t) - 3;
  if (f < at) return null;
  const p = lerp(f, at, at + 12, 0, 1);
  const check = lerp(f, at + 12, at + 17, 0, 1, back);
  const ex = lerp(f, exitAt - 8, exitAt, 0, 1, easeIn);
  return (
    <div style={{ position: 'absolute', left: 70, right: 70, top: y, height: 240, transform: `perspective(1400px) translateY(${(1 - p) * 220}px) rotateX(${(1 - p) * -55}deg) translateX(${-ex * 1300}px)`, opacity: Math.min(1, p * 1.6), filter: ex > 0 ? `blur(${ex * 10}px)` : undefined }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 36, background: 'linear-gradient(135deg, rgba(13,35,112,0.93), rgba(8,24,84,0.93))', border: '2px solid rgba(111,227,174,0.55)', boxShadow: '0 26px 60px rgba(0,0,15,0.55)', display: 'flex', alignItems: 'center', direction: 'rtl', padding: '0 40px', gap: 34 }}>
        <div style={{ width: 150, height: 150, flexShrink: 0, borderRadius: 34, background: 'rgba(59,173,127,0.16)', border: `2px solid ${C.green}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={96} p={lerp(f, at + 3, at + 22, 0, 1)} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: AR, fontWeight: 800, fontSize: title.length > 18 ? 54 : 64, color: '#fff', lineHeight: 1.25 }}>{title}</div>
          <div style={{ fontFamily: AR, fontWeight: 400, fontSize: 36, color: '#bfe9d6', marginTop: 8 }}>{sub}</div>
        </div>
      </div>
      {/* the "done" check stamp */}
      <div style={{ position: 'absolute', left: -14, top: -26, width: 104, height: 104, borderRadius: 52, background: C.green, border: '5px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${check}) rotate(${(1 - check) * -60}deg)`, boxShadow: `0 0 30px rgba(111,227,174,0.8)` }}>
        <IcCheck size={64} color="#fff" sw={7} />
      </div>
    </div>
  );
};

const Blueprint: React.FC<{ from: number }> = ({ from }) => {
  const f = useCurrentFrame();
  const p = lerp(f, from, from + 60, 0, 1, easeInOut);
  return (
    <AbsoluteFill style={{ opacity: 0.8 }}>
      <AbsoluteFill style={{ backgroundImage: 'linear-gradient(rgba(111,227,174,0.13) 2px, transparent 2px), linear-gradient(90deg, rgba(111,227,174,0.13) 2px, transparent 2px)', backgroundSize: '60px 60px', backgroundPosition: `${f}px ${f * 0.5}px` }} />
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <path d="M 160 1300 h 760 v 440 h -760 z M 160 1500 h 320 v 240 M 480 1300 v 120 M 600 1500 h 320 M 600 1500 v 120 M 760 1740 v -120 M 340 1300 v 80" stroke={C.mint} strokeWidth={6} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
        <path d="M 160 1260 h 760 M 160 1250 v 20 M 920 1250 v 20" stroke="#fff" strokeWidth={3} fill="none" opacity={p} />
        <text x={540} y={1240} fill="#fff" opacity={p} fontFamily={EN} fontSize={30} textAnchor="middle">
          24.00 m
        </text>
      </svg>
    </AbsoluteFill>
  );
};

const Services: React.FC = () => {
  const f = useCurrentFrame();
  const head = s2f(T.nukhallis);
  const done = ALL_SVCS.filter((s) => f >= s2f(s.t) + 12).length;
  return (
    <AbsoluteFill>
      {GROUPS.map((g, gi) => (
        <Range key={gi} from={s2f(g.from)} to={s2f(g.to)}>
          <Photo src={g.bg} from={s2f(g.from)} dur={s2f(g.to - g.from)} pos={g.pos} grade={0.66} zoom={[1.15, 1.32]} pan={[gi % 2 ? -30 : 30, gi % 2 ? 30 : -30]} />
          {g.blueprint && <Blueprint from={s2f(g.from)} />}
          {g.svcs.map((s, i) => (
            <ServiceCard key={i} {...s} y={g.top + i * g.gap} exitAt={s2f(g.to)} />
          ))}
          <Sweep at={s2f(g.from)} dur={16} />
        </Range>
      ))}
      <Bokeh opacity={0.4} seed="svc" />
      <Bug />
      {/* header pill like the flyer «< خدماتنا» */}
      <AbsoluteFill style={{ alignItems: 'center', paddingTop: 300 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, direction: 'rtl', transform: `scale(${lerp(f, head, head + 8, 0.6, 1, back)})`, opacity: lerp(f, head, head + 5, 0, 1) }}>
          <span style={{ fontFamily: AR, fontWeight: 800, fontSize: 96, color: C.mint, textShadow: '0 6px 24px rgba(0,0,10,0.6)' }}>نخلّص لك</span>
          <svg width={60} height={70} viewBox="0 0 60 70">
            <polygon points="40,0 60,0 25,35 60,70 40,70 5,35" fill={C.mint} />
          </svg>
        </div>
      </AbsoluteFill>
      {/* running tally */}
      <div style={{ position: 'absolute', bottom: 150, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 14, direction: 'rtl' }}>
        {ALL_SVCS.map((_, i) => (
          <div key={i} style={{ width: 54, height: 14, borderRadius: 7, background: i < done ? C.mint : 'rgba(255,255,255,0.18)', boxShadow: i < done ? `0 0 14px ${C.mint}` : 'none' }} />
        ))}
      </div>
      <Vignette strength={0.55} />
    </AbsoluteFill>
  );
};

/* ======================= 5. 40+ GOV BODIES + values (30.5 – 36.1 s) ======================= */
const Gov: React.FC = () => {
  const f = useCurrentFrame();
  const a = s2f(T.arbaeen);
  const review = s2f(T.nurajiha);
  const vals = s2f(T.diqqa);
  const n = Math.round(interpolate(f, [a + 3, a + 40], [0, 40], { ...clamp, easing: ease }));
  const out = lerp(f, vals - 6, vals + 4, 0, 1, easeIn);
  const COLS = 6, ROWS = 7;
  return (
    <AbsoluteFill>
      <BrandBg />
      {/* tile grid */}
      <AbsoluteFill style={{ opacity: 1 - out, transform: `scale(${1 + out * 0.3})` }}>
        {new Array(COLS * ROWS).fill(0).map((_, i) => {
          const c = i % COLS, r = Math.floor(i / COLS);
          const appear = a + Math.floor(random(`ga${i}`) * 34);
          const p = lerp(f, appear, appear + 8, 0, 1, back);
          const flipAt = review + Math.floor((i / (COLS * ROWS)) * 30);
          const flip = lerp(f, flipAt, flipAt + 6, 0, 1);
          return (
            <div key={i} style={{ position: 'absolute', left: 75 + c * 158, top: 860 + r * 140, width: 138, height: 120, borderRadius: 22, transform: `scale(${p}) rotateY(${flip * 180}deg)`, background: flip > 0.5 ? C.green : 'rgba(255,255,255,0.07)', border: `2px solid ${flip > 0.5 ? '#fff' : 'rgba(111,227,174,0.35)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ transform: flip > 0.5 ? 'scaleX(-1)' : undefined }}>{flip > 0.5 ? <IcCheck size={66} color="#fff" sw={6} /> : <IcGov size={64} color="rgba(255,255,255,0.75)" />}</div>
            </div>
          );
        })}
        <AbsoluteFill style={{ alignItems: 'center', paddingTop: 290, direction: 'rtl' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, transform: `scale(${lerp(f, a, a + 8, 1.6, 1, back)})` }}>
            <span style={{ fontFamily: AR, fontWeight: 800, fontSize: 70, color: '#fff' }}>أكثر من</span>
            <span style={{ fontFamily: EN, fontWeight: 700, fontSize: 250, color: C.mint, lineHeight: 1, textShadow: '0 0 50px rgba(111,227,174,0.45)' }}>{n}</span>
          </div>
          <H size={84} style={{ opacity: lerp(f, a + 14, a + 22, 0, 1), marginTop: -10 }}>جهة حكومية</H>
          {f >= review && (
            <div style={{ marginTop: 1060, transform: `scale(${lerp(f, review, review + 7, 1.5, 1, back)})`, padding: '12px 50px 20px', borderRadius: 99, background: C.green }}>
              <span style={{ fontFamily: AR, fontWeight: 800, fontSize: 76, color: '#fff' }}>نراجعها عنك</span>
            </div>
          )}
        </AbsoluteFill>
      </AbsoluteFill>
      {/* precision · speed · clarity */}
      {f >= vals - 2 && (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', gap: 60 }}>
          {[
            { t: T.diqqa, w: 'بدقّة', Icon: IcTarget, dir: -1 },
            { t: T.sura, w: 'وسرعة', Icon: IcBolt, dir: 1 },
            { t: T.wudooh, w: 'ووضوح', Icon: IcEye, dir: -1 },
          ].map((v, i) => {
            const at = s2f(v.t) - 2;
            const p = lerp(f, at, at + 9, 0, 1, back);
            return (
              <div key={i} style={{ opacity: f >= at ? 1 : 0, transform: `translateX(${(1 - p) * 900 * v.dir}px) skewX(${(1 - p) * 20 * v.dir}deg)`, display: 'flex', alignItems: 'center', gap: 36, direction: 'rtl', width: 760, padding: '20px 50px 30px', borderRadius: 40, background: i === 1 ? C.green : 'rgba(8,24,84,0.85)', border: `3px solid ${i === 1 ? '#fff' : C.mint}`, boxShadow: '0 24px 50px rgba(0,0,0,0.4)' }}>
                <v.Icon size={120} color={i === 1 ? '#fff' : C.mint} p={lerp(f, at + 4, at + 18, 0, 1)} sw={4} />
                <span style={{ fontFamily: AR, fontWeight: 800, fontSize: 120, color: '#fff' }}>{v.w}</span>
              </div>
            );
          })}
        </AbsoluteFill>
      )}
      <Flash at={vals} dur={5} max={0.3} color={C.mint} />
      <Bug />
      <Vignette strength={0.55} />
    </AbsoluteFill>
  );
};

/* ======================= 6. SLOGAN (36.1 – 39.4 s) ======================= */
const Slogan: React.FC = () => {
  const f = useCurrentFrame();
  const a = s2f(36.1);
  const shiar = s2f(T.shiarna);
  const n1 = s2f(T.najahkum);
  const n2 = s2f(T.najahLana);
  return (
    <AbsoluteFill>
      <Photo src="img/jeddah.jpg" from={a} dur={s2f(3.4)} zoom={[1.05, 1.18]} grade={0.55} pos="70% 50%" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ opacity: lerp(f, shiar, shiar + 8, 0, 1), transform: `translateY(${lerp(f, shiar, shiar + 10, 30, 0)}px)`, fontFamily: AR, fontWeight: 700, fontSize: 64, color: C.mint, direction: 'rtl', marginBottom: 40 }}>
          لأن شعارنا
        </div>
        <div style={{ position: 'relative', padding: '40px 60px' }}>
          <div style={{ position: 'absolute', right: -10, top: -90, fontFamily: 'Georgia, serif', fontSize: 260, color: C.green, opacity: lerp(f, shiar + 4, shiar + 12, 0, 1), lineHeight: 1 }}>”</div>
          {f >= n1 - 2 && (
            <div style={{ transform: `scale(${lerp(f, n1 - 2, n1 + 8, 1.4, 1, back)})`, opacity: lerp(f, n1 - 2, n1 + 3, 0, 1) }}>
              <H size={170}>نجاحكم</H>
            </div>
          )}
          {f >= n2 - 2 && (
            <div style={{ transform: `scale(${lerp(f, n2 - 2, n2 + 8, 1.4, 1, back)})`, opacity: lerp(f, n2 - 2, n2 + 3, 0, 1) }}>
              <H size={170} color={C.mint} glow="rgba(111,227,174,0.5)">نجاحٌ لنا</H>
            </div>
          )}
          <div style={{ position: 'absolute', left: -10, bottom: -170, fontFamily: 'Georgia, serif', fontSize: 260, color: C.green, opacity: lerp(f, n2, n2 + 8, 0, 1), lineHeight: 1 }}>“</div>
        </div>
        <Sweep at={n2 + 10} dur={20} y={700} h={560} />
      </AbsoluteFill>
      <Bug />
      <Vignette strength={0.5} />
    </AbsoluteFill>
  );
};

/* ======================= 7. CTA + end card (39.4 – 49.5 s) ======================= */
const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const call = s2f(T.tawasal);
  const name = s2f(T.name2);
  const jed = s2f(T.jeddah);
  const card = s2f(43.3);
  const fin = s2f(T.finalHit);
  const markP = interpolate(f, [name - 14, name + 8], [0, 1], clamp);
  const callP = lerp(f, call - 2, call + 8, 0, 1, back);
  const up = lerp(f, card - 6, card + 14, 0, 1, easeInOut); // move logo up for the contact card
  const pulse = 1 + Math.sin((f - call) / 6) * 0.025;
  return (
    <AbsoluteFill>
      <BrandBg />
      {/* big brand chevrons at the bottom (profile page 13) */}
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, opacity: 1 - up * 0.7 }}>
        <polygon points={`200,1920 540,${1580 + (1 - lerp(f, s2f(39.4), s2f(40.2), 0, 1)) * 400} 880,1920`} fill={C.green} />
        <polygon points={`-60,1920 -60,1700 120,1920`} fill={C.green} opacity={0.8} />
        <polygon points={`1140,1920 1140,1700 960,1920`} fill={C.green} opacity={0.8} />
      </svg>
      <AbsoluteFill style={{ alignItems: 'center', transform: `translateY(${-up * 190}px)` }}>
        {/* call to action */}
        <div style={{ marginTop: 250, transform: `scale(${callP * (f > call + 10 ? pulse : 1)})`, opacity: Math.min(1, callP * 2), padding: '20px 60px 32px', borderRadius: 99, background: `linear-gradient(180deg, #7ff0bd, ${C.green})`, boxShadow: `0 0 60px rgba(111,227,174,0.55), 0 16px 0 #1f7a56` }}>
          <span style={{ fontFamily: AR, fontWeight: 800, fontSize: 84, color: C.navy, direction: 'rtl' }}>تواصل معنا الحين!</span>
        </div>
        {/* vertical lockup */}
        <div style={{ marginTop: 110 - up * 40, transform: `scale(${1 - up * 0.35})` }}>
          <Mark size={400} p={markP} glow={f >= name ? 1 : 0} spin={interpolate(f, [name - 14, name + 8], [-90, 0], { ...clamp, easing: ease })} arrowLift={f >= fin ? lerp(f, fin, fin + 8, 0, 14, back) : 0} />
        </div>
        <div style={{ marginTop: 20 - up * 120, textAlign: 'center', opacity: lerp(f, name, name + 10, 0, 1), transform: `translateY(${lerp(f, name, name + 12, 30, 0)}px)` }}>
          <div style={{ fontFamily: KUFI, fontWeight: 700, fontSize: 84, color: '#fff', direction: 'rtl', lineHeight: 1.3 }}>الشاطر لخدمات الأعمال</div>
          <div style={{ fontFamily: EN, fontWeight: 500, fontSize: 50, color: '#dfe6ff', letterSpacing: 1 }}>EL-SHATER Business Services</div>
        </div>
        {f >= jed - 2 && (
          <div style={{ marginTop: 36 - up * 30, display: 'flex', alignItems: 'center', gap: 14, direction: 'rtl', transform: `scale(${lerp(f, jed - 2, jed + 7, 0.4, 1, back)})`, padding: '8px 34px 14px', borderRadius: 99, border: `3px solid ${C.mint}`, background: 'rgba(8,24,84,0.7)' }}>
            <IcPin size={56} />
            <span style={{ fontFamily: AR, fontWeight: 800, fontSize: 54, color: '#fff' }}>جدة</span>
          </div>
        )}
      </AbsoluteFill>
      {/* contact card */}
      {f >= card - 4 && (
        <div style={{ position: 'absolute', left: 60, right: 60, top: 1080, transform: `translateY(${(1 - up) * 900}px)`, borderRadius: 40, background: 'rgba(5,14,58,0.88)', border: `2px solid rgba(111,227,174,0.6)`, boxShadow: '0 30px 70px rgba(0,0,0,0.5)', padding: '34px 44px 40px', direction: 'rtl' }}>
          {CONTACT.phones.map((ph, i) => {
            const p = lerp(f, card + 6 + i * 5, card + 16 + i * 5, 0, 1);
            return (
              <div key={ph} style={{ display: 'flex', alignItems: 'center', gap: 24, opacity: p, transform: `translateX(${(1 - p) * 60}px)`, marginBottom: 14 }}>
                <IcPhone size={58} />
                <span style={{ fontFamily: EN, fontWeight: 700, fontSize: 66, color: '#fff', letterSpacing: 3, direction: 'ltr' }}>{ph}</span>
              </div>
            );
          })}
          <div style={{ height: 2, background: 'rgba(111,227,174,0.35)', margin: '18px 0 22px' }} />
          {[
            { Icon: IcGlobe, t: CONTACT.web },
            { Icon: IcAt, t: CONTACT.social },
          ].map((r, i) => {
            const p = lerp(f, card + 22 + i * 5, card + 32 + i * 5, 0, 1);
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 24, opacity: p, transform: `translateX(${(1 - p) * 60}px)`, marginBottom: 12 }}>
                <r.Icon size={54} />
                <span style={{ fontFamily: EN, fontWeight: 700, fontSize: 52, color: C.mint, direction: 'ltr' }}>{r.t}</span>
              </div>
            );
          })}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 10, opacity: lerp(f, card + 34, card + 44, 0, 1) }}>
            <IcPin size={54} />
            <div style={{ fontFamily: AR, fontWeight: 700, fontSize: 38, color: '#dfe6ff', lineHeight: 1.45 }}>
              {CONTACT.hq}
              <br />
              {CONTACT.branch}
            </div>
          </div>
        </div>
      )}
      <Sweep at={fin - 4} dur={18} />
      <Flash at={fin} dur={10} color={C.mint} max={0.45} />
      <Shockwave at={name} cy={700} />
      <Bokeh opacity={0.5} seed="cta" />
      <Vignette strength={0.45} />
    </AbsoluteFill>
  );
};

/** Always-on disclosure (as in the previous ads): the narration is AI-generated. */
const Disclosure: React.FC = () => (
  <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', pointerEvents: 'none' }}>
    <div style={{ marginBottom: 46, display: 'flex', alignItems: 'center', gap: 12, direction: 'rtl', padding: '6px 22px 10px', borderRadius: 99, background: 'rgba(0,0,0,0.5)', border: '1.5px solid rgba(255,255,255,0.3)', fontFamily: AR, fontWeight: 700, fontSize: 26, color: '#fff' }}>
      <span style={{ fontFamily: EN, fontWeight: 700, fontSize: 21, padding: '1px 9px', borderRadius: 7, background: '#fff', color: '#111' }}>AI</span>
      التعليق الصوتي مولّد بالذكاء الاصطناعي
    </div>
  </AbsoluteFill>
);

export const CUTS = { punch: s2f(7.3), brand: s2f(9.5), services: s2f(14.65), gov: s2f(30.5), slogan: s2f(36.1), cta: s2f(39.4) };

export const AlshaterAd: React.FC = () => (
  <AbsoluteFill style={{ background: C.navyDeep }}>
    <Range from={0} to={CUTS.punch}><Hook /></Range>
    <Range from={CUTS.punch} to={CUTS.brand}><Punch /></Range>
    <Range from={CUTS.brand} to={CUTS.services}><Brand /></Range>
    <Range from={CUTS.services} to={CUTS.gov}><Services /></Range>
    <Range from={CUTS.gov} to={CUTS.slogan}><Gov /></Range>
    <Range from={CUTS.slogan} to={CUTS.cta}><Slogan /></Range>
    <Range from={CUTS.cta} to={DURATION}><Cta /></Range>
    <ChevronWipe at={CUTS.brand} />
    <ChevronWipe at={CUTS.services} />
    <ChevronWipe at={CUTS.gov} />
    <ChevronWipe at={CUTS.slogan} dur={14} />
    <ChevronWipe at={CUTS.cta} />
    <Disclosure />
    <Grain />
  </AbsoluteFill>
);
