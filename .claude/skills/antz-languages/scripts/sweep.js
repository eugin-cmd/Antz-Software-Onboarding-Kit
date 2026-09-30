/* Smoke test of the guide in one or more languages against the local server (python3 serve.py 8080).
   Desktop 1440x900 and phone 390x844: page errors, raw interface keys showing (untranslated t() keys),
   horizontal overflow on phone, English search ("carcass") still finds results, feature window and phone sheet
   counters are translated, <html lang/dir>.
   Needs puppeteer-core (see SKILL.md):  NODE_PATH=<dir>/node_modules node sweep.js pl lt lv
   Env: PORT (default 8080), CHROME (default the macOS Chrome app). */
const p = require('puppeteer-core');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const LANGS = process.argv.slice(2);
if (!LANGS.length) { console.error('usage: node sweep.js <code> [code...]'); process.exit(2); }
const PORT = process.env.PORT || 8080;
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const KEY = /\b(hero|search|kit|day|modules|spot|cta|faq|pager|mod|win|gal|lang|nav|footer|brand|start)\.[a-z0-9]+\b/;
(async () => {
  const b = await p.launch({ executablePath: CHROME, headless: 'new' });
  let bad = 0;
  for (const l of LANGS) {
    const errs = [];
    const base = `http://localhost:${PORT}/?lang=${l}`;
    const d = await b.newPage();
    await d.setViewport({ width: 1440, height: 900 });
    d.on('pageerror', (e) => errs.push(e.message));
    const raw = [];
    for (const u of ['#/', '#/m/necropsy', '#/kit/getting-started', '#/kit/platform', '#/kit/objective']) {
      await d.goto(base + u, { waitUntil: 'networkidle0' }); await wait(500);
      const m = (await d.evaluate(() => document.body.innerText)).match(KEY);
      if (m) raw.push(u + ':' + m[0]);
    }
    await d.goto(base + '#/m/necropsy', { waitUntil: 'networkidle0' }); await wait(600);
    await d.click('.mfeat-row:nth-child(2) .mfeat'); await wait(900);
    const win = await d.evaluate(() => document.querySelector('.fwin-count')?.textContent);
    await d.keyboard.press('Escape'); await wait(500);
    await d.click('.nav-search'); await wait(300); await d.keyboard.type('carcass'); await wait(300);
    const hits = await d.$$eval('#qs-results a', (a) => a.length);
    await d.keyboard.press('Escape');
    const lang = await d.evaluate(() => document.documentElement.lang + '/' + document.documentElement.dir);
    await d.close();

    const m = await b.newPage();
    await m.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    m.on('pageerror', (e) => errs.push('phone: ' + e.message));
    const over = [];
    for (const u of ['#/', '#/m/necropsy', '#/kit/getting-started']) {
      await m.goto(base + u, { waitUntil: 'networkidle0' }); await wait(500);
      if (await m.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)) over.push(u);
    }
    await m.goto(base + '#/m/necropsy', { waitUntil: 'networkidle0' }); await wait(500);
    await m.evaluate(() => document.querySelector('.lang-toast')?.remove()); // the review note can cover the row
    let sheet;
    for (let i = 0; i < 3 && !sheet; i++) {
      await m.tap('.mfeat-row:nth-child(2) .mfeat'); await wait(1000);
      sheet = await m.evaluate(() => document.querySelector('.g-fcount')?.textContent);
    }
    await m.close();

    const ok = !errs.length && !raw.length && !over.length && hits > 0 && sheet && lang.startsWith(l + '/');
    if (!ok) bad++;
    console.log(`${ok ? 'OK  ' : 'FAIL'} ${l.padEnd(3)} ${lang.padEnd(7)} errors:${errs.length ? errs.join('; ').slice(0, 100) : 0}` +
      ` rawKeys:${raw.join(',') || 0} phoneOverflow:${over.join(',') || 0} carcassHits:${hits} window:"${win}" sheet:"${sheet}"`);
  }
  await b.close();
  process.exit(bad ? 1 : 0);
})();
