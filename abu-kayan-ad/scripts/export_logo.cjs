// Renders the Abu Kayan logo (traced mark + new name) to PNG files with Playwright.
// Usage: node scripts/export_logo.cjs   -> brand_export/*.png
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const fontUrl = (f) => 'data:font/ttf;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts', f)).toString('base64');
const mark = fs.readFileSync(path.join(ROOT, 'assets/brand/mark.svg'), 'utf8')
  .replace('<svg ', '<svg class="mark" ')
  .replace(/stroke="#C7926D"/, 'stroke="url(#cg)"').replace(/<g fill="#C7926D">/, '<g fill="url(#cg)">')
  .replace('<g fill="none"', '<defs><linearGradient id="cg" gradientUnits="userSpaceOnUse" x1="60" y1="60" x2="720" y2="700"><stop offset="0" stop-color="#E0B08A"/><stop offset=".5" stop-color="#C7926D"/><stop offset="1" stop-color="#A9744F"/></linearGradient></defs><g fill="none"');
const css = `
@font-face{font-family:DIN;src:url(${fontUrl('DINNextLTArabic-Bold.ttf')});font-weight:700}
@font-face{font-family:DIN;src:url(${fontUrl('DINNextLTArabic-Medium.ttf')});font-weight:500}
html,body{margin:0}
.lock{display:flex;flex-direction:column;align-items:center}
.ar{font-family:DIN;font-weight:700;color:#F3ECE2;direction:rtl;white-space:nowrap;line-height:1.15}
.en{font-family:DIN;font-weight:500;color:#C7926D;letter-spacing:.34em;margin-right:-.34em;white-space:nowrap}
.dark .ar{color:#12223C}`;
const bgSvg = (w, h) => `<svg width="${w}" height="${h}" style="position:absolute;inset:0" viewBox="0 0 1672 941" preserveAspectRatio="xMidYMid slice">
 <defs><radialGradient id="rg" cx=".5" cy=".45" r=".7"><stop offset="0" stop-color="#1B2F51"/><stop offset=".6" stop-color="#12223C"/><stop offset="1" stop-color="#0B1628"/></radialGradient>
 <linearGradient id="pl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#24395E" stop-opacity=".8"/><stop offset="1" stop-color="#0B1628" stop-opacity=".1"/></linearGradient>
 <radialGradient id="eg"><stop offset="0" stop-color="#C7926D" stop-opacity=".45"/><stop offset="1" stop-color="#C7926D" stop-opacity="0"/></radialGradient></defs>
 <rect width="1672" height="941" fill="url(#rg)"/>
 <path d="M160 941 L160 520 Q160 20 836 20 Q1512 20 1512 520 L1512 941" fill="none" stroke="#C7926D" stroke-opacity=".35" stroke-width="1.6"/>
 <path d="M240 941 L240 560 Q240 100 836 100 Q1432 100 1432 560 L1432 941" fill="none" stroke="#C7926D" stroke-opacity=".14" stroke-width="1.2"/>
 <path d="M0 280 L155 350 L155 941 L0 941Z" fill="url(#pl)"/><path d="M1672 280 L1517 350 L1517 941 L1672 941Z" fill="url(#pl)"/>
 <line x1="155" y1="350" x2="155" y2="941" stroke="#C7926D" stroke-opacity=".45" stroke-width="2"/><line x1="1517" y1="350" x2="1517" y2="941" stroke="#C7926D" stroke-opacity=".45" stroke-width="2"/>
 <ellipse cx="155" cy="520" rx="40" ry="200" fill="url(#eg)"/><ellipse cx="1517" cy="520" rx="40" ry="200" fill="url(#eg)"/>
 <path d="M0 620 L620 941 L0 941Z" fill="url(#pl)" opacity=".6"/><path d="M1672 580 L1050 941 L1672 941Z" fill="url(#pl)" opacity=".6"/>
</svg>`;
const lock = (markW, ar, en, cls = '') => `<div class="lock ${cls}" style="position:relative">${mark.replace('width="780" height="720"', `width="${markW}" height="${markW * 720 / 780}"`)}
  <div class="ar" style="font-size:${ar}px;margin-top:${markW * 0.17}px">أبو كيان للخدمات العقارية</div>
  <div class="en" style="font-size:${en}px;margin-top:${ar * 0.3}px">ABU KAYAN REAL ESTATE SERVICES</div></div>`;
const jobs = [
  { name: 'abu_kayan_logo_navy_1672x941.png', w: 1672, h: 941, html: `${bgSvg(1672, 941)}<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">${lock(330, 84, 31)}</div>` },
  { name: 'abu_kayan_logo_square_1080.png', w: 1080, h: 1080, html: `${bgSvg(1080, 1080)}<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">${lock(330, 72, 26.5)}</div>` },
  { name: 'abu_kayan_logo_transparent_on_dark.png', w: 1400, h: 900, transparent: true, html: `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">${lock(380, 96, 35.5)}</div>` },
  { name: 'abu_kayan_logo_transparent_on_light.png', w: 1400, h: 900, transparent: true, html: `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">${lock(380, 96, 35.5, 'dark')}</div>` },
];
(async () => {
  const b = await chromium.launch();
  for (const j of jobs) {
    const p = await b.newPage({ viewport: { width: j.w, height: j.h }, deviceScaleFactor: 2 });
    await p.setContent(`<html><head><style>${css}</style></head><body style="width:${j.w}px;height:${j.h}px;position:relative;overflow:hidden;background:${j.transparent ? 'transparent' : '#12223C'}">${j.html}</body></html>`);
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(ROOT, 'brand_export', j.name), omitBackground: !!j.transparent });
    await p.close();
  }
  await b.close();
})();
