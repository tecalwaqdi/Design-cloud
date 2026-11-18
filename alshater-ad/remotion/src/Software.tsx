import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import '@fontsource/almarai/400.css';
import '@fontsource/almarai/700.css';
import '@fontsource/almarai/800.css';
import '@fontsource/noto-kufi-arabic/600.css';
import '@fontsource/noto-sans/500.css';
import '@fontsource/noto-sans/700.css';
import { AR, C, EN } from './fx';
import { Lockup, Mark } from './logo';
import { IcCheck, IcDoc, IcGlobe, IcPhone } from './icons';
import { CONTACT } from './data';

/* ---------- static brand background (same look as the story posts) ---------- */
const Bg: React.FC<{ h: number }> = ({ h }) => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.navyDeep} 0%, ${C.navy} 45%, #0a2a66 100%)`, overflow: 'hidden' }}>
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 60% 16% at 18% 0%, rgba(150,240,200,0.55), rgba(0,0,0,0) 70%),
                     radial-gradient(ellipse 45% 14% at 88% 2%, rgba(111,227,174,0.32), rgba(0,0,0,0) 70%),
                     radial-gradient(ellipse 55% 30% at 50% 42%, rgba(42,166,160,0.32), rgba(0,0,0,0) 70%),
                     radial-gradient(ellipse 70% 22% at 10% 96%, rgba(42,166,160,0.5), rgba(0,0,0,0) 70%)`,
      }}
    />
    {/* code grid */}
    <AbsoluteFill style={{ backgroundImage: 'linear-gradient(rgba(111,227,174,0.06) 2px, transparent 2px), linear-gradient(90deg, rgba(111,227,174,0.06) 2px, transparent 2px)', backgroundSize: '54px 54px', maskImage: 'radial-gradient(ellipse at 50% 40%, #000 20%, transparent 70%)', WebkitMaskImage: 'radial-gradient(ellipse at 50% 40%, #000 20%, transparent 70%)' }} />
    {/* brand chevron watermark */}
    <div style={{ position: 'absolute', left: -260, top: h * 0.3, opacity: 0.06 }}>
      <Mark size={900} mono="#ffffff" />
    </div>
    {/* lens flares */}
    {[
      [960, h * 0.19, 120, 0.16], [880, h * 0.225, 38, 0.25], [60, h * 0.62, 150, 0.1],
    ].map(([x, y, r, o], i) => (
      <div key={i} style={{ position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.9), rgba(200,240,255,0.25) 45%, rgba(255,255,255,0) 70%)', opacity: o }} />
    ))}
  </AbsoluteFill>
);

/* ---------- device mockups ---------- */
const Laptop: React.FC<{ w: number }> = ({ w }) => {
  const sh = w * 0.6;
  const k = w / 700;
  return (
    <div style={{ width: w }}>
      <div style={{ width: w, height: sh, borderRadius: 22 * k, background: '#0b0f1e', padding: 14 * k, boxShadow: '0 40px 80px rgba(0,0,20,0.6), 0 0 0 2px #2a3358' }}>
        {/* website UI */}
        <div style={{ width: '100%', height: '100%', borderRadius: 8 * k, overflow: 'hidden', background: '#f4f6fb', direction: 'rtl', position: 'relative' }}>
          <div style={{ height: 46 * k, background: C.navy, display: 'flex', alignItems: 'center', padding: `0 ${18 * k}px`, gap: 14 * k }}>
            <Mark size={30 * k} />
            <span style={{ fontFamily: AR, fontWeight: 800, fontSize: 15 * k, color: '#fff' }}>الشاطر</span>
            <div style={{ flex: 1 }} />
            {['الرئيسية', 'خدماتنا', 'من نحن', 'تواصل'].map((t) => (
              <span key={t} style={{ fontFamily: AR, fontWeight: 700, fontSize: 11 * k, color: '#cfd8ff' }}>{t}</span>
            ))}
          </div>
          <div style={{ display: 'flex', height: 190 * k }}>
            <div style={{ flex: 1.1, padding: `${26 * k}px ${22 * k}px` }}>
              <div style={{ fontFamily: AR, fontWeight: 800, fontSize: 25 * k, color: C.navy, lineHeight: 1.35 }}>موقعك الإلكتروني</div>
              <div style={{ fontFamily: AR, fontWeight: 800, fontSize: 25 * k, color: C.green, lineHeight: 1.35 }}>واجهة مشروعك</div>
              <div style={{ height: 8 * k, width: '85%', background: '#d9dde8', borderRadius: 4 * k, marginTop: 14 * k }} />
              <div style={{ height: 8 * k, width: '65%', background: '#d9dde8', borderRadius: 4 * k, marginTop: 8 * k }} />
              <div style={{ display: 'inline-block', marginTop: 16 * k, padding: `${7 * k}px ${18 * k}px ${9 * k}px`, borderRadius: 99, background: C.green, fontFamily: AR, fontWeight: 800, fontSize: 12 * k, color: '#fff' }}>اطلب الآن</div>
            </div>
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              <Img src={staticFile('img/tower.jpg')} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(8,24,84,0.1), rgba(8,24,84,0.55))' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 * k, padding: `${16 * k}px ${18 * k}px` }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ flex: 1, height: 120 * k, borderRadius: 12 * k, background: '#fff', boxShadow: '0 4px 14px rgba(8,24,84,0.12)', padding: 12 * k }}>
                <div style={{ width: 30 * k, height: 30 * k, borderRadius: 9 * k, background: i === 1 ? C.navy : C.green }} />
                <div style={{ height: 7 * k, width: '80%', background: '#cfd5e3', borderRadius: 4 * k, marginTop: 12 * k }} />
                <div style={{ height: 7 * k, width: '55%', background: '#e2e6ef', borderRadius: 4 * k, marginTop: 7 * k }} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ width: w * 1.16, marginLeft: -w * 0.08, height: 22 * k, borderRadius: `0 0 ${26 * k}px ${26 * k}px`, background: 'linear-gradient(180deg, #c9cfdf, #8a93ad)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }} />
    </div>
  );
};

const PhoneApp: React.FC<{ w: number }> = ({ w }) => {
  const k = w / 260;
  return (
    <div style={{ width: w, height: w * 2.05, borderRadius: 40 * k, background: '#0b0f1e', padding: 10 * k, boxShadow: '0 40px 80px rgba(0,0,20,0.65), 0 0 0 2px #2a3358' }}>
      <div style={{ width: '100%', height: '100%', borderRadius: 31 * k, overflow: 'hidden', background: '#f4f6fb', direction: 'rtl', position: 'relative' }}>
        <div style={{ background: `linear-gradient(160deg, ${C.navy}, #0d2f7a)`, padding: `${34 * k}px ${16 * k}px ${22 * k}px` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 * k }}>
            <Mark size={30 * k} />
            <span style={{ fontFamily: AR, fontWeight: 800, fontSize: 15 * k, color: '#fff' }}>تطبيقك</span>
          </div>
          <div style={{ fontFamily: AR, fontWeight: 700, fontSize: 11 * k, color: '#bfe9d6', marginTop: 12 * k }}>أهلاً بك 👋</div>
          <div style={{ fontFamily: AR, fontWeight: 800, fontSize: 17 * k, color: '#fff', marginTop: 4 * k }}>طلباتك في مكان واحد</div>
        </div>
        <div style={{ padding: 12 * k, display: 'flex', flexDirection: 'column', gap: 9 * k }}>
          {[C.green, C.navy, C.green, '#2aa6a0'].map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9 * k, background: '#fff', borderRadius: 12 * k, padding: 9 * k, boxShadow: '0 3px 10px rgba(8,24,84,0.1)' }}>
              <div style={{ width: 30 * k, height: 30 * k, borderRadius: 9 * k, background: c, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IcCheck size={20 * k} color="#fff" sw={6} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ height: 7 * k, width: '75%', background: '#cfd5e3', borderRadius: 4 * k }} />
                <div style={{ height: 6 * k, width: '50%', background: '#e2e6ef', borderRadius: 4 * k, marginTop: 6 * k }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 46 * k, background: '#fff', display: 'flex', justifyContent: 'space-around', alignItems: 'center', boxShadow: '0 -3px 10px rgba(8,24,84,0.08)' }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ width: 18 * k, height: 18 * k, borderRadius: 6 * k, background: i === 0 ? C.green : '#cfd5e3' }} />
          ))}
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC<{ w: number }> = ({ w }) => {
  const k = w / 300;
  const bars = [0.45, 0.62, 0.5, 0.78, 0.68, 0.92];
  return (
    <div style={{ width: w, borderRadius: 20 * k, background: 'rgba(255,255,255,0.97)', padding: 16 * k, boxShadow: '0 30px 60px rgba(0,0,20,0.55)', direction: 'rtl' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: AR, fontWeight: 800, fontSize: 17 * k, color: C.navy }}>لوحة التحكم</span>
        <div style={{ width: 44 * k, height: 18 * k, borderRadius: 9 * k, background: 'rgba(59,173,127,0.18)' }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 9 * k, height: 110 * k, marginTop: 14 * k, direction: 'ltr' }}>
        {bars.map((b, i) => (
          <div key={i} style={{ flex: 1, height: `${b * 100}%`, borderRadius: `${6 * k}px ${6 * k}px 0 0`, background: i === bars.length - 1 ? C.green : i % 2 ? '#9fdcc0' : C.navy }} />
        ))}
      </div>
      <svg width="100%" height={36 * k} viewBox="0 0 100 20" preserveAspectRatio="none" style={{ marginTop: 8 * k }}>
        <polyline points="0,16 18,12 36,14 54,7 72,9 100,2" fill="none" stroke={C.green} strokeWidth={2.2} />
      </svg>
    </div>
  );
};

/* the profile cover as "ملف تعريفي" example */
const ProfileBook: React.FC<{ w: number }> = ({ w }) => (
  <div style={{ position: 'relative', width: w, height: w * 0.707 }}>
    <Img src={staticFile('img/profile_p2.png')} style={{ position: 'absolute', left: w * 0.1, top: -w * 0.07, width: w, borderRadius: 10, boxShadow: '0 20px 40px rgba(0,0,0,0.5)', transform: 'rotate(5deg)' }} />
    <Img src={staticFile('img/profile_cover.png')} style={{ position: 'absolute', left: 0, top: 0, width: w, borderRadius: 10, boxShadow: '0 30px 60px rgba(0,0,20,0.6)', border: '3px solid rgba(255,255,255,0.85)' }} />
  </div>
);

/* ---------- service tiles ---------- */
const CodeIc: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={C.mint} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 18 l-14 14 l14 14 M42 18 l14 14 l-14 14 M36 12 l-8 40" />
  </svg>
);
const AppIc: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={C.mint} strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round">
    <rect x="18" y="4" width="28" height="56" rx="6" /><path d="M28 52 h8" /><rect x="24" y="14" width="7" height="7" rx="2" /><rect x="33" y="14" width="7" height="7" rx="2" /><rect x="24" y="24" width="7" height="7" rx="2" /><rect x="33" y="24" width="7" height="7" rx="2" />
  </svg>
);
const SysIc: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={C.mint} strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="8" width="56" height="40" rx="5" /><path d="M24 56 h16 M32 48 v8" /><path d="M14 38 v-8 M24 38 v-14 M34 38 v-10 M44 38 v-18 M52 38 v-6" />
  </svg>
);
const WebIc: React.FC<{ size: number }> = ({ size }) => <IcGlobe size={size} sw={3.4} />;
const DocIc: React.FC<{ size: number }> = ({ size }) => <IcDoc size={size} sw={3.4} />;

const SERVICES = [
  { title: 'ملفات تعريفية', sub: 'بروفايل احترافي لنشاطك', Icon: DocIc },
  { title: 'مواقع إلكترونية', sub: 'واجهة رقمية لمشروعك', Icon: WebIc },
  { title: 'تطبيقات جوال', sub: 'تطبيق باسمك لعملائك', Icon: AppIc },
  { title: 'أنظمة إدارية', sub: 'تابع شغلك من مكان واحد', Icon: SysIc },
];

const Tile: React.FC<{ title: string; sub: string; Icon: React.FC<{ size: number }>; h: number }> = ({ title, sub, Icon, h }) => (
  <div style={{ height: h, borderRadius: 30, background: 'linear-gradient(145deg, rgba(13,35,112,0.95), rgba(8,24,84,0.95))', border: '2px solid rgba(111,227,174,0.45)', boxShadow: '0 20px 44px rgba(0,0,15,0.45)', display: 'flex', alignItems: 'center', gap: 22, padding: '0 28px', direction: 'rtl' }}>
    <div style={{ width: 96, height: 96, flexShrink: 0, borderRadius: 26, background: 'rgba(59,173,127,0.16)', border: `2px solid ${C.green}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon size={60} />
    </div>
    <div>
      <div style={{ fontFamily: AR, fontWeight: 800, fontSize: 40, color: '#fff', lineHeight: 1.25 }}>{title}</div>
      <div style={{ fontFamily: AR, fontWeight: 400, fontSize: 24, color: '#bfe9d6', marginTop: 6, lineHeight: 1.35 }}>{sub}</div>
    </div>
  </div>
);

const NewBadge: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 18 * scale, direction: 'rtl' }}>
    <div style={{ padding: `${8 * scale}px ${28 * scale}px ${14 * scale}px`, borderRadius: 99, background: `linear-gradient(180deg, #8af5c6, ${C.green})`, boxShadow: '0 0 40px rgba(111,227,174,0.5)', fontFamily: AR, fontWeight: 800, fontSize: 44 * scale, color: C.navy }}>جديد</div>
    <div style={{ fontFamily: AR, fontWeight: 800, fontSize: 52 * scale, color: '#fff', display: 'flex', alignItems: 'center', gap: 14 * scale }}>
      قسم البرمجيات
      <span style={{ fontFamily: EN, fontWeight: 700, fontSize: 46 * scale, color: C.mint, direction: 'ltr' }}>{'</>'}</span>
    </div>
  </div>
);

const Headline: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <div style={{ textAlign: 'center', direction: 'rtl' }}>
    <div style={{ fontFamily: AR, fontWeight: 800, fontSize: 74 * scale, color: '#fff', lineHeight: 1.3, textShadow: '0 6px 24px rgba(0,0,10,0.55)' }}>حضورك الرقمي؟</div>
    <div style={{ fontFamily: AR, fontWeight: 800, fontSize: 112 * scale, color: C.mint, lineHeight: 1.2, textShadow: '0 0 40px rgba(111,227,174,0.45), 0 6px 24px rgba(0,0,10,0.55)' }}>خلّه على الشاطر!</div>
  </div>
);

const ContactRow: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 30 * scale, direction: 'rtl', flexWrap: 'wrap' }}>
    {[CONTACT.phones[0], CONTACT.phones[1]].map((p) => (
      <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 10 * scale }}>
        <IcPhone size={36 * scale} />
        <span style={{ fontFamily: EN, fontWeight: 700, fontSize: 34 * scale, color: '#fff', letterSpacing: 1.5 }}>{p}</span>
      </div>
    ))}
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 * scale }}>
      <IcGlobe size={36 * scale} />
      <span style={{ fontFamily: EN, fontWeight: 700, fontSize: 34 * scale, color: C.mint }}>{CONTACT.web}</span>
    </div>
  </div>
);

const Cta: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 18 * scale, padding: `${18 * scale}px ${60 * scale}px ${28 * scale}px`, borderRadius: 99, background: `linear-gradient(180deg, #8af5c6, ${C.green})`, boxShadow: `0 0 50px rgba(111,227,174,0.5), 0 ${12 * scale}px 0 #1f7a56`, direction: 'rtl' }}>
    <span style={{ fontFamily: AR, fontWeight: 800, fontSize: 60 * scale, color: C.navy }}>اطلب عرضك الآن</span>
    <svg width={34 * scale} height={40 * scale} viewBox="0 0 60 70"><polygon points="40,0 60,0 25,35 60,70 40,70 5,35" fill={C.navy} /></svg>
  </div>
);

const Devices: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <div style={{ position: 'relative', width: 1080, height: 600 * scale }}>
    <div style={{ position: 'absolute', left: 540 - 330 * scale, top: 40 * scale }}>
      <Laptop w={660 * scale} />
    </div>
    <div style={{ position: 'absolute', left: 30 * scale + (1 - scale) * 120, top: 230 * scale, transform: 'rotate(-6deg)' }}>
      <ProfileBook w={300 * scale} />
    </div>
    <div style={{ position: 'absolute', right: 40 * scale + (1 - scale) * 120, top: 120 * scale, transform: 'rotate(4deg)' }}>
      <PhoneApp w={210 * scale} />
    </div>
    <div style={{ position: 'absolute', left: 60 * scale + (1 - scale) * 120, top: -30 * scale, transform: 'rotate(-3deg)' }}>
      <Dashboard w={250 * scale} />
    </div>
  </div>
);

/* ---------- STORY 1080×1920 ---------- */
export const SoftwareStory: React.FC = () => (
  <AbsoluteFill>
    <Bg h={1920} />
    <AbsoluteFill style={{ alignItems: 'center' }}>
      <div style={{ marginTop: 56 }}><Lockup scale={0.56} /></div>
      <div style={{ marginTop: 48 }}><NewBadge /></div>
      <div style={{ marginTop: 20 }}><Headline /></div>
      <div style={{ marginTop: 36 }}><Devices scale={0.92} /></div>
      <div style={{ marginTop: 14, width: 980, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, direction: 'rtl' }}>
        {SERVICES.map((s) => <Tile key={s.title} {...s} h={164} />)}
      </div>
      <div style={{ marginTop: 20, width: 980, height: 90, borderRadius: 30, border: `2px dashed ${C.mint}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, direction: 'rtl', background: 'rgba(59,173,127,0.1)' }}>
        <CodeIc size={50} />
        <span style={{ fontFamily: AR, fontWeight: 800, fontSize: 40, color: '#fff' }}>وغيرها من الحلول البرمجية حسب احتياجك</span>
      </div>
      <div style={{ marginTop: 40 }}><Cta scale={0.9} /></div>
      <div style={{ marginTop: 40 }}><ContactRow /></div>
    </AbsoluteFill>
  </AbsoluteFill>
);

/* ---------- POST 1080×1350 ---------- */
export const SoftwarePost: React.FC = () => (
  <AbsoluteFill>
    <Bg h={1350} />
    <AbsoluteFill style={{ alignItems: 'center' }}>
      <div style={{ marginTop: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: 980, direction: 'rtl' }}>
        <NewBadge scale={0.78} />
        <Lockup scale={0.42} />
      </div>
      <div style={{ marginTop: 26 }}><Headline scale={0.86} /></div>
      <div style={{ marginTop: 34 }}><Devices scale={0.72} /></div>
      <div style={{ marginTop: 16, width: 980, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, direction: 'rtl' }}>
        {SERVICES.map((s) => <Tile key={s.title} {...s} h={150} />)}
      </div>
      <div style={{ marginTop: 26, display: 'flex', alignItems: 'center', gap: 30, direction: 'rtl' }}>
        <Cta scale={0.72} />
        <span style={{ fontFamily: AR, fontWeight: 700, fontSize: 30, color: '#bfe9d6' }}>+ حلول برمجية حسب احتياجك</span>
      </div>
      <div style={{ marginTop: 26 }}><ContactRow scale={0.85} /></div>
    </AbsoluteFill>
  </AbsoluteFill>
);
