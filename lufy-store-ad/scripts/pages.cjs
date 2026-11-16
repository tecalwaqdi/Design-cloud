// Step 3: clean full-page screenshots (sticky/fixed elements un-pinned so they don't repeat mid-page)
// + a high-res capture of the ALQadi 15-month product image from its page. Read-only.
const { chromium, devices } = require('playwright');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'assets/store');
const PAGES = [
  ['home_mobile_full', 'https://lufy.store/'],
  ['hulk_mobile_full', 'https://lufy.store/ar/اشتراكات-هولك-hulk/c576095672'],
  ['alqadi_mobile_full', 'https://lufy.store/ar/اشتراكات-القاضي-alqadi-4k/c2083759289'],
  ['products/alqadi_15_page', 'https://lufy.store/ar/اشتراك-القاضي-alqadi-4k-سنة-3-أشهر-15-شهرًا/p1862502051'],
  ['products/snap_plus_page', 'https://lufy.store/ar/اشتراك-سناب-لوفي-بلس-سنة-49-ريال-أول-اشتراك-فقط/p293713253'],
  ['products/hulk_12_page', 'https://lufy.store/ar/hulk-12-months/p813641723'],
];
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices['iPhone 14 Pro Max'], locale: 'ar-SA' });
  const page = await ctx.newPage();
  for (const [name, url] of PAGES) {
    try { await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 }); } catch {}
    for (let i = 0; i < 10; i++) { await page.mouse.wheel(0, 800); await page.waitForTimeout(200); }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1200);
    await page.evaluate(() => {
      for (const el of document.querySelectorAll('body *')) {
        const cs = getComputedStyle(el);
        if (cs.position === 'sticky') el.style.setProperty('position', 'relative', 'important');
        if (cs.position === 'fixed') {
          const r = el.getBoundingClientRect();
          if (r.top < 200 && r.height < 400) el.style.setProperty('position', 'absolute', 'important');
          else el.style.setProperty('display', 'none', 'important'); // bottom bars / floating chat bubble
        }
      }
    });
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: true });
    console.log('shot', name);
    if (name === 'products/alqadi_15_page') {
      const img = page.locator('main img, .product-single img, .swiper-slide img').first();
      if (await img.count()) { await img.screenshot({ path: path.join(OUT, 'products/alqadi_15_hires.png') }); console.log('hires ok'); }
    }
  }
  await browser.close();
})();
