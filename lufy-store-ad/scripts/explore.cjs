// Step 1: read-only exploration of lufy.store — saves HTML, screenshots and product data.
// Never clicks "add to cart", never submits forms, never logs in.
const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUT = path.resolve(__dirname, '../assets/store');
fs.mkdirSync(OUT, { recursive: true });

const PAGES = {
  home: 'https://lufy.store/',
  hulk: 'https://lufy.store/ar/اشتراكات-هولك-hulk/c576095672',
  alqadi: 'https://lufy.store/ar/اشتراكات-القاضي-alqadi-4k/c2083759289',
  snap: 'https://lufy.store/ar/اشتراك-سناب-لوفي-بلس-سنة-49-ريال-أول-اشتراك-فقط/p293713253',
};

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices['iPhone 14 Pro Max'], locale: 'ar-SA' });
  const page = await ctx.newPage();
  const report = {};
  for (const [key, url] of Object.entries(PAGES)) {
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    } catch (e) {
      console.log(key, 'goto warn', e.message);
    }
    await page.waitForTimeout(2500);
    // trigger lazy images
    for (let y = 0; y < 8; y++) { await page.mouse.wheel(0, 700); await page.waitForTimeout(250); }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(800);
    fs.writeFileSync(path.join(OUT, `${key}.html`), await page.content());
    await page.screenshot({ path: path.join(OUT, `${key}_mobile_full.png`), fullPage: true });
    await page.screenshot({ path: path.join(OUT, `${key}_mobile_view.png`) });
    const data = await page.evaluate(() => {
      const abs = (u) => { try { return new URL(u, location.href).href; } catch { return u; } };
      const links = [...document.querySelectorAll('a[href]')]
        .map((a) => ({ href: abs(a.getAttribute('href')), text: (a.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 160) }))
        .filter((l) => /\/(p|c)\d+/.test(decodeURI(l.href)));
      const imgs = [...document.querySelectorAll('img')]
        .map((i) => ({ src: abs(i.currentSrc || i.src || i.getAttribute('data-src') || ''), alt: i.alt, w: i.naturalWidth, h: i.naturalHeight }))
        .filter((i) => i.src && !i.src.startsWith('data:'));
      const metas = Object.fromEntries([...document.querySelectorAll('meta[property],meta[name]')]
        .map((m) => [m.getAttribute('property') || m.getAttribute('name'), m.content]));
      const text = document.body.innerText.slice(0, 6000);
      const themeColors = (() => {
        const cs = getComputedStyle(document.documentElement);
        const out = {};
        for (const v of ['--color-primary', '--color-primary-dark', '--color-primary-light', '--color-primary-reverse', '--font-main']) out[v] = cs.getPropertyValue(v).trim();
        return out;
      })();
      return { title: document.title, links, imgs, metas, text, themeColors };
    });
    report[key] = data;
    console.log('done', key, data.title, 'links', data.links.length, 'imgs', data.imgs.length);
  }
  fs.writeFileSync(path.join(OUT, 'explore.json'), JSON.stringify(report, null, 2));
  await browser.close();
})();
