// Step 2: product data + real browsing recordings of lufy.store.
// SAFETY: read-only. Never clicks add-to-cart / buy-now, never fills forms, never logs in.
// The "order button" is only highlighted (hover ring) — never pressed.
const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');
const https = require('https');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const STORE = path.join(ROOT, 'assets/store');
const PRODUCTS_DIR = path.join(STORE, 'products');
const REC = path.join(ROOT, 'recordings');
fs.mkdirSync(PRODUCTS_DIR, { recursive: true });
fs.mkdirSync(REC, { recursive: true });

const PRODUCTS = [
  { id: 'hulk_3', url: 'https://lufy.store/ar/hulk-3-months/p548302095' },
  { id: 'hulk_6', url: 'https://lufy.store/ar/hulk-6-months/p347464185' },
  { id: 'hulk_12', url: 'https://lufy.store/ar/hulk-12-months/p813641723' },
  { id: 'alqadi_6', url: 'https://lufy.store/ar/اشتراك-القاضي-alqadi-4k-6-أشهر/p954770860' },
  { id: 'alqadi_15', url: 'https://lufy.store/ar/اشتراك-القاضي-alqadi-4k-سنة-3-أشهر-15-شهرًا/p1862502051' },
  { id: 'alqadi_2dev', url: 'https://lufy.store/ar/اشتراك-القاضي-alqadi-4k-سنة-لجهازين-بجودة-فائقة/p179684525' },
  { id: 'snap_plus', url: 'https://lufy.store/ar/اشتراك-سناب-لوفي-بلس-سنة-49-ريال-أول-اشتراك-فقط/p293713253' },
];
const HOME = 'https://lufy.store/';
const HULK_CAT = 'https://lufy.store/ar/اشتراكات-هولك-hulk/c576095672';
const ALQADI_CAT = 'https://lufy.store/ar/اشتراكات-القاضي-alqadi-4k/c2083759289';

const download = (url, dest) => new Promise((res, rej) => {
  https.get(url, (r) => {
    if (r.statusCode >= 300 && r.statusCode < 400 && r.headers.location) return download(new URL(r.headers.location, url).href, dest).then(res, rej);
    if (r.statusCode !== 200) return rej(new Error(`${r.statusCode} ${url}`));
    const f = fs.createWriteStream(dest); r.pipe(f); f.on('finish', () => f.close(res));
  }).on('error', rej);
});

// Visual touch / cursor indicator (headless browsers draw no pointer).
const POINTER_JS = (kind) => `
  (() => {
    const kind = ${JSON.stringify(kind)};
    const install = () => {
      if (document.getElementById('__lufy_ptr')) return;
      const d = document.createElement('div'); d.id = '__lufy_ptr';
      d.style.cssText = kind === 'touch'
        ? 'position:fixed;left:0;top:0;width:46px;height:46px;margin:-23px 0 0 -23px;border-radius:50%;background:rgba(255,255,255,.35);border:3px solid rgba(255,255,255,.9);box-shadow:0 0 18px rgba(162,96,255,.9);z-index:2147483647;pointer-events:none;transition:transform .12s ease, opacity .25s;opacity:0;'
        : 'position:fixed;left:0;top:0;width:26px;height:26px;z-index:2147483647;pointer-events:none;background:no-repeat url("data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 width=%2726%27 height=%2726%27 viewBox=%270 0 26 26%27><path d=%27M3 2 L3 21 L8 16 L11.5 24 L14.5 22.7 L11 15 L18 15 Z%27 fill=%27white%27 stroke=%27black%27 stroke-width=%271.4%27/></svg>");filter:drop-shadow(0 2px 3px rgba(0,0,0,.5));';
      document.documentElement.appendChild(d);
      window.addEventListener('mousemove', (e) => { d.style.left = e.clientX + 'px'; d.style.top = e.clientY + 'px'; if (kind==='touch') d.style.opacity = 1; }, true);
      window.addEventListener('mousedown', () => { d.style.transform = 'scale(.7)'; }, true);
      window.addEventListener('mouseup', () => { d.style.transform = 'scale(1)'; if (kind==='touch') setTimeout(()=>d.style.opacity=0, 450); }, true);
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install); else install();
  })();`;

// Hide third-party chat bubble so the UI reads clean (purely cosmetic overlay, not store content).
const HIDE_JS = `(() => { const s = document.createElement('style'); s.textContent = '.wa-s-n, .whatsapp-float, salla-chat-widget{display:none!important}'; (document.head||document.documentElement).appendChild(s); })();`;

async function smoothScrollBy(page, dy, ms) {
  await page.evaluate(([dy, ms]) => new Promise((done) => {
    const y0 = window.scrollY, t0 = performance.now();
    const ease = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const step = (now) => { const t = Math.min(1, (now - t0) / ms); window.scrollTo(0, y0 + dy * ease(t)); t < 1 ? requestAnimationFrame(step) : done(); };
    requestAnimationFrame(step);
  }), [dy, ms]);
}
async function scrollToEl(page, locator, offset, ms) {
  const box = await locator.boundingBox();
  if (!box) return;
  await smoothScrollBy(page, box.y - offset, ms);
}
let pointer = { x: 200, y: 600 };
async function moveTo(page, x, y, ms = 600) {
  const steps = Math.max(8, Math.round(ms / 16));
  const sx = pointer.x, sy = pointer.y;
  // slight curved path for a human feel
  const cx = (sx + x) / 2 + (Math.random() - .5) * 80, cy = (sy + y) / 2 + (Math.random() - .5) * 60;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps, e = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const px = (1 - e) * (1 - e) * sx + 2 * (1 - e) * e * cx + e * e * x;
    const py = (1 - e) * (1 - e) * sy + 2 * (1 - e) * e * cy + e * e * y;
    await page.mouse.move(px, py); await page.waitForTimeout(16);
  }
  pointer = { x, y };
}
async function tapEl(page, locator, { press = true } = {}) {
  const box = await locator.boundingBox();
  const x = box.x + box.width / 2, y = box.y + Math.min(box.height / 2, 120);
  await moveTo(page, x, y, 650);
  await page.waitForTimeout(180);
  if (press) { await page.mouse.down(); await page.waitForTimeout(110); await page.mouse.up(); }
  return { x, y };
}


async function tapNavigate(page, selector, urlRe) {
  const loc = page.locator(selector + ':visible').first();
  await loc.scrollIntoViewIfNeeded().catch(() => {});
  const href = await loc.getAttribute('href');
  await tapEl(page, loc, { press: false });
  await page.mouse.down(); await page.waitForTimeout(110); await page.mouse.up();
  const ok = await page.waitForURL(urlRe, { timeout: 2500 }).then(() => true).catch(() => false);
  if (!ok) { await loc.click({ timeout: 3000 }).catch(() => {}); }
  const ok2 = ok || await page.waitForURL(urlRe, { timeout: 2500 }).then(() => true).catch(() => false);
  if (!ok2 && href) { await page.goto(new URL(href, page.url()).href, { waitUntil: 'domcontentloaded' }); }
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(1300);
}

// CDP screencast recorder -> frames with timestamps -> constant-fps mp4
async function startScreencast(page, name, maxW, maxH) {
  const dir = path.join(REC, `${name}_frames`);
  fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const cdp = await page.context().newCDPSession(page);
  const frames = [];
  cdp.on('Page.screencastFrame', async (f) => {
    const file = path.join(dir, `${String(frames.length).padStart(5, '0')}.jpg`);
    fs.writeFileSync(file, Buffer.from(f.data, 'base64'));
    frames.push({ file, t: f.metadata.timestamp });
    try { await cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }); } catch {}
  });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 95, maxWidth: maxW, maxHeight: maxH, everyNthFrame: 1 });
  return async () => {
    await cdp.send('Page.stopScreencast');
    await new Promise((r) => setTimeout(r, 300));
    const list = path.join(dir, 'list.txt');
    let txt = '';
    frames.forEach((f, i) => {
      const next = frames[i + 1] ? frames[i + 1].t : f.t + 0.5;
      txt += `file '${f.file}'\nduration ${Math.max(0.001, next - f.t).toFixed(4)}\n`;
    });
    txt += `file '${frames[frames.length - 1].file}'\n`;
    fs.writeFileSync(list, txt);
    const out = path.join(REC, `${name}.mp4`);
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list,
      '-vf', 'fps=30,scale=trunc(iw/2)*2:trunc(ih/2)*2,format=yuv420p', '-c:v', 'libx264', '-crf', '14', '-preset', 'slow', out]);
    console.log('recorded', out, frames.length, 'frames', (frames[frames.length - 1].t - frames[0].t).toFixed(1) + 's');
    return out;
  };
}

async function gotoReady(page, url) {
  try { await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 }); } catch (e) { console.log('goto warn', e.message.split('\n')[0]); }
  await page.waitForTimeout(1200);
}

(async () => {
  const browser = await chromium.launch();

  // ---------- 1. Product data + images ----------
  const mctx = await browser.newContext({ ...devices['iPhone 14 Pro Max'], locale: 'ar-SA' });
  await mctx.addInitScript(HIDE_JS);
  const p = await mctx.newPage();
  const products = [];
  for (const prod of (process.env.SKIP_PRODUCTS ? [] : PRODUCTS)) {
    await gotoReady(p, prod.url);
    const info = await p.evaluate(() => {
      const h1 = document.querySelector('h1');
      const og = document.querySelector('meta[property="og:image"]');
      const priceEl = document.querySelector('.total-price, .product-price, [class*="price"]');
      const desc = document.querySelector('.product__description, .article--main, .product-description, [class*="description"]');
      return {
        name: h1 ? h1.innerText.trim() : document.title,
        image: og ? og.content : null,
        priceText: priceEl ? priceEl.innerText.trim().replace(/\s+/g, ' ') : null,
        description: desc ? desc.innerText.trim().slice(0, 1200) : null,
        title: document.title,
      };
    });
    const imgFile = path.join(PRODUCTS_DIR, `${prod.id}.jpg`);
    if (info.image) { try { await download(info.image, imgFile); } catch (e) { console.log('img fail', prod.id, e.message); } }
    await p.screenshot({ path: path.join(PRODUCTS_DIR, `${prod.id}_page.png`), fullPage: true });
    products.push({ ...prod, ...info, imageFile: path.relative(ROOT, imgFile), capturedAt: new Date().toISOString() });
    console.log(prod.id, '|', info.name, '|', info.priceText);
  }
  if (products.length) fs.writeFileSync(path.join(STORE, 'products.json'), JSON.stringify(products, null, 2));
  await mctx.close();

  // ---------- 2. Mobile browsing recording (phone screen) ----------
  const VW = 430, VH = 932; // iPhone 14 Pro Max CSS px
  const rctx = await browser.newContext({ ...devices['iPhone 14 Pro Max'], hasTouch: false, locale: 'ar-SA' });
  await rctx.addInitScript(POINTER_JS('touch'));
  await rctx.addInitScript(HIDE_JS);
  const r = await rctx.newPage();
  await gotoReady(r, HOME);
  pointer = { x: VW / 2, y: VH * 0.7 };
  const stop = await startScreencast(r, 'mobile_browse', VW * 3, VH * 3);
  await r.waitForTimeout(1500);
  // 1) home -> 2) open Hulk category from "تصفح الأقسام"
  await smoothScrollBy(r, 140, 900); await r.waitForTimeout(500);
  await tapNavigate(r, 'a[href*="c576095672"]', /c576095672/);
  // 3) browse product cards
  await smoothScrollBy(r, 260, 1400); await r.waitForTimeout(700);
  await smoothScrollBy(r, 420, 1600); await r.waitForTimeout(700);
  await smoothScrollBy(r, -300, 1200); await r.waitForTimeout(600);
  // 4) open a real product page (Hulk 12 months)
  await tapNavigate(r, 'a[href*="p813641723"]', /p813641723/);
  // 5) scroll to the details / duration
  await smoothScrollBy(r, 520, 1800); await r.waitForTimeout(900);
  await smoothScrollBy(r, 380, 1500); await r.waitForTimeout(900);
  // 6) show WHERE the order button is — hover ring only, never pressed
  const buyBtn = r.locator('salla-add-product-button, button:has-text("أضف إلى السلة"), button:has-text("اشترِ الآن")').first();
  if (await buyBtn.count()) {
    await scrollToEl(r, buyBtn, VH * 0.55, 1300); await r.waitForTimeout(500);
    await r.evaluate(() => {
      const b = document.querySelector('salla-add-product-button') || [...document.querySelectorAll('button')].find((x) => /أضف إلى السلة|اشترِ الآن/.test(x.innerText));
      if (b) { b.style.transition = 'box-shadow .4s'; b.style.boxShadow = '0 0 0 4px rgba(162,96,255,.85), 0 0 28px rgba(162,96,255,.9)'; b.style.borderRadius = '12px'; }
    });
    await tapEl(r, buyBtn, { press: false });
  }
  await r.waitForTimeout(2200);
  await stop();
  await rctx.close();

  // ---------- 3. Desktop browsing recording (laptop screen) ----------
  const dctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5, locale: 'ar-SA' });
  await dctx.addInitScript(POINTER_JS('cursor'));
  await dctx.addInitScript(HIDE_JS);
  const d = await dctx.newPage();
  await gotoReady(d, HOME);
  pointer = { x: 900, y: 500 };
  const stopD = await startScreencast(d, 'desktop_browse', 2160, 1350);
  await d.mouse.move(900, 500); await d.waitForTimeout(1200);
  await smoothScrollBy(d, 300, 1300); await d.waitForTimeout(600);
  await tapNavigate(d, 'a[href*="c2083759289"]', /c2083759289/);
  await smoothScrollBy(d, 250, 1400); await d.waitForTimeout(600);
  if (await d.locator('a[href*="p1862502051"]:visible').count()) {
    await tapNavigate(d, 'a[href*="p1862502051"]', /p1862502051/);
    await smoothScrollBy(d, 350, 1600); await d.waitForTimeout(1500);
  }
  await stopD();
  await dctx.close();
  await browser.close();
})();
