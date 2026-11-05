const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 414, height: Number(process.env.ALTO || 896) }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  p.on('pageerror', e => console.log('err', e.message));
  await p.goto('http://localhost:5191/Handy-landing-page-fe/demo/?app=1&rol=usuario');
  await p.waitForTimeout(2500);
  await p.screenshot({ path: process.argv[2] + '/paso0.png' });
  const t = await p.locator('text=Contale a HandIA').first();
  console.log('handia visible', await t.isVisible().catch(() => false));
  await t.click(); await p.waitForTimeout(1500);
  await p.screenshot({ path: process.argv[2] + '/paso1.png' });
  await p.locator('text=Se tapó la pileta de la cocina').first().click(); await p.waitForTimeout(4000);
  await p.screenshot({ path: process.argv[2] + '/paso2.png' });
  await p.locator('text=Mandar una foto').first().click(); await p.waitForTimeout(5000);
  await p.screenshot({ path: process.argv[2] + '/paso3.png' });
  await b.close();
})();
