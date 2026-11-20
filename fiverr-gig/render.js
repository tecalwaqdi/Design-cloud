const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 769 }, deviceScaleFactor: 2 });
  await p.goto('file://' + path.join(__dirname, 'gig.html'));
  await p.screenshot({ path: path.join(__dirname, 'output', 'fiverr-gig-design.png') });
  await b.close();
})();
