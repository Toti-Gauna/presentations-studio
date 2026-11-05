const { chromium } = require('playwright');
const S = process.argv[2];
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto(`file://${S}/intro.html`);
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
  const dur = await p.evaluate(() => window.DUR);
  const n = Math.round(dur * 30);
  for (let f = 0; f < n; f++) {
    await p.evaluate((t) => window.ir(t), f / 30);
    await p.screenshot({ path: `${S}/frames/f${String(f).padStart(4, '0')}.jpg`, type: 'jpeg', quality: 92 });
  }
  console.log('frames', n, 'dur', dur);
  await b.close();
})();
