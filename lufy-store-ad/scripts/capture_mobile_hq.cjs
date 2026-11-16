// High-res, frame-accurate mobile browsing recording of lufy.store (30 fps, 1290x2652 = 430x884 CSS @3x).
// Each output frame is a real screenshot of the live page; scrolling / pointer motion is stepped per frame
// so motion is perfectly smooth. READ-ONLY: no add-to-cart, no buy, no forms, no login.
const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const OUTDIR = path.join(ROOT, 'recordings', 'mobile_hq_frames');
const OUT = path.join(ROOT, 'recordings', 'mobile_browse_hq.mp4');
fs.rmSync(OUTDIR, { recursive: true, force: true });
fs.mkdirSync(OUTDIR, { recursive: true });

const HOME = 'https://lufy.store/';
const VW = 430, VH = 884;
let frame = 0;
const marks = [];
const list = [];
let pointer = { x: VW * 0.5, y: VH * 0.75, down: false, visible: false };

const SETUP = `(() => {
  const s = document.createElement('style');
  s.textContent = '.wa-s-n, .whatsapp-float, salla-chat-widget{display:none!important} ::-webkit-scrollbar{display:none}';
  (document.head||document.documentElement).appendChild(s);
  if (!document.getElementById('__ptr')) {
    const d = document.createElement('div'); d.id='__ptr';
    d.style.cssText='position:fixed;left:0;top:0;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;background:rgba(255,255,255,.38);border:3px solid rgba(255,255,255,.95);box-shadow:0 0 18px rgba(162,96,255,.95),0 2px 8px rgba(0,0,0,.35);z-index:2147483647;pointer-events:none;opacity:0;';
    document.documentElement.appendChild(d);
  }
})();`;

async function setPtr(page) {
  await page.evaluate((p) => {
    const d = document.getElementById('__ptr');
    if (!d) return;
    d.style.left = p.x + 'px'; d.style.top = p.y + 'px';
    d.style.opacity = p.visible ? 1 : 0;
    d.style.transform = p.down ? 'scale(.72)' : 'scale(1)';
  }, pointer);
}
async function snap(page, hold = 1) {
  const f = path.join(OUTDIR, `${String(frame).padStart(5, '0')}.jpg`);
  await setPtr(page);
  await page.screenshot({ path: f, type: 'jpeg', quality: 93 });
  list.push({ f, n: hold });
  frame += hold;
}
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
async function hold(page, n) { await snap(page, n); }
async function scroll(page, dy, n) {
  const y0 = await page.evaluate(() => window.scrollY);
  for (let i = 1; i <= n; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), y0 + dy * ease(i / n));
    await snap(page);
  }
}
async function move(page, x, y, n) {
  const sx = pointer.x, sy = pointer.y;
  const cx = (sx + x) / 2 + 40, cy = (sy + y) / 2 - 30;
  pointer.visible = true;
  for (let i = 1; i <= n; i++) {
    const t = ease(i / n);
    pointer.x = (1 - t) * (1 - t) * sx + 2 * (1 - t) * t * cx + t * t * x;
    pointer.y = (1 - t) * (1 - t) * sy + 2 * (1 - t) * t * cy + t * t * y;
    await snap(page);
  }
}
async function tapVisual(page) {
  pointer.down = true; await snap(page, 3);
  pointer.down = false; await snap(page, 3);
}
async function center(page, sel) {
  const loc = page.locator(sel).filter({ visible: true }).first();
  const b = await loc.boundingBox();
  return { loc, x: b.x + b.width / 2, y: b.y + Math.min(b.height / 2, 110) };
}
async function navigate(page, sel, re) {
  const { loc } = await center(page, sel);
  const href = await loc.getAttribute('href');
  await page.goto(new URL(href, page.url()).href, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {});
  if (!re.test(decodeURI(page.url()))) throw new Error('nav failed ' + page.url());
  await page.evaluate(SETUP);
  for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, 900); await page.waitForTimeout(150); }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(900);
  pointer.visible = false;
}
const mark = (name) => { marks.push({ name, t: +(frame / 30).toFixed(2) }); };

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices['iPhone 14 Pro Max'], viewport: { width: VW, height: VH }, locale: 'ar-SA' });
  await ctx.addInitScript(SETUP);
  const page = await ctx.newPage();
  await page.goto(HOME, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {});
  await page.evaluate(SETUP);
  for (let i = 0; i < 8; i++) { await page.mouse.wheel(0, 900); await page.waitForTimeout(150); }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1200);

  // A) home -> tap HULK category
  mark('home');
  await hold(page, 24);
  await scroll(page, 150, 40);
  await hold(page, 8);
  let c = await center(page, 'a[href*="c576095672"]');
  await move(page, c.x, c.y, 24);
  await tapVisual(page);
  await navigate(page, 'a[href*="c576095672"]', /c576095672/);
  // B) HULK category: browse cards
  mark('hulk_category');
  await hold(page, 24);
  await scroll(page, 300, 45);
  await hold(page, 15);
  await scroll(page, 230, 50);
  await hold(page, 15);
  await scroll(page, -250, 45);
  await hold(page, 10);
  c = await center(page, 'a[href*="p813641723"]');
  await move(page, c.x, c.y, 24);
  await tapVisual(page);
  await navigate(page, 'a[href*="p813641723"]', /p813641723/);
  // C) HULK 12 months product page: details + order-button location (NOT pressed)
  mark('hulk_12_product');
  await hold(page, 30);
  await scroll(page, 600, 55);
  await hold(page, 20);
  await scroll(page, 450, 50);
  await hold(page, 25);
  mark('order_button_highlight');
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('salla-add-product-button, button')].filter((x) => /أضف إلى السلة|اشترِ الآن/.test(x.innerText || '')).filter((x) => { const r = x.getBoundingClientRect(); return r.height > 0 && r.bottom > innerHeight - 140; });
    b.forEach((x) => { x.style.transition = 'box-shadow .3s'; x.style.boxShadow = '0 0 0 4px rgba(162,96,255,.9), 0 0 26px rgba(162,96,255,.95)'; x.style.borderRadius = '12px'; });
  });
  const btn = await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].filter((x) => /أضف إلى السلة/.test(x.innerText || '')).map((x) => x.getBoundingClientRect()).filter((r) => r.height > 0 && r.top < innerHeight);
    return b.length ? { x: b[0].x + b[0].width / 2, y: b[0].y + b[0].height / 2 } : null;
  });
  if (btn) await move(page, btn.x - 30, btn.y - 60, 24); // hover NEAR the button — never pressed
  await hold(page, 45);
  mark('end');

  // assemble
  let txt = '';
  for (const it of list) txt += `file '${it.f}'\nduration ${(it.n / 30).toFixed(5)}\n`;
  txt += `file '${list[list.length - 1].f}'\n`;
  fs.writeFileSync(path.join(OUTDIR, 'list.txt'), txt);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(OUTDIR, 'list.txt'),
    '-vf', 'fps=30,format=yuv420p', '-c:v', 'libx264', '-crf', '14', '-preset', 'slow', OUT]);
  fs.writeFileSync(path.join(ROOT, 'recordings', 'mobile_browse_hq_marks.json'), JSON.stringify(marks, null, 2));
  console.log('frames', frame, (frame / 30).toFixed(1) + 's', JSON.stringify(marks));
  await browser.close();
})();
