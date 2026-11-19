// Explore the real cart + coupon flow on lufy.store (guest session).
// Adds ONE item to a guest cart and inspects the coupon field. Never checks out, never pays,
// never enters personal data.
const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');
const OUT = path.resolve(__dirname, '../assets/explore');
fs.mkdirSync(OUT, { recursive: true });
const PRODUCT = 'https://lufy.store/ar/اشتراك-القاضي-alqadi-4k-6-أشهر-لوفي-ستور/p954770860';

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices['iPhone 14 Pro Max'], viewport: { width: 430, height: 884 }, locale: 'ar-SA' });
  const page = await ctx.newPage();
  await page.goto(PRODUCT, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT, '1_product.png') });
  const btns = await page.evaluate(() => [...document.querySelectorAll('button, salla-add-product-button')].map((b) => ({ tag: b.tagName, text: (b.innerText || '').trim().slice(0, 40), cls: b.className && b.className.toString().slice(0, 80) })).filter((b) => b.text));
  console.log('buttons', JSON.stringify(btns.slice(0, 20)));
  const add = page.locator('button:has-text("أضف إلى السلة")').filter({ visible: true }).first();
  await add.click({ timeout: 10000 });
  await page.waitForTimeout(3500);
  await page.screenshot({ path: path.join(OUT, '2_after_add.png') });
  await page.goto('https://lufy.store/ar/cart', { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(2500);
  await page.screenshot({ path: path.join(OUT, '3_cart.png'), fullPage: true });
  const inputs = await page.evaluate(() => [...document.querySelectorAll('input')].map((i) => ({ name: i.name, id: i.id, ph: i.placeholder, type: i.type, vis: i.getBoundingClientRect().height > 0 })));
  console.log('inputs', JSON.stringify(inputs));
  fs.writeFileSync(path.join(OUT, 'cart.html'), await page.content());
  console.log('url', page.url());
  await browser.close();
})();
