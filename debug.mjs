import puppeteer from '/home/user/AWWWARDS/node_modules/puppeteer/lib/puppeteer/puppeteer.js';

const browser = await puppeteer.launch({
  headless: true,
  executablePath: '/root/.cache/puppeteer/chrome/linux-127.0.6533.88/chrome-linux64/chrome',
  args: ['--no-sandbox','--disable-setuid-sandbox','--disable-gpu','--window-size=1440,900'],
});

const page = await browser.newPage();
page.on('console', msg => console.log('[BROWSER]', msg.type(), msg.text()));
page.on('pageerror', err => console.error('[PAGE ERROR]', err.message));

await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });

await new Promise(r => setTimeout(r, 10000));

const info = await page.evaluate(() => {
  const fixed = [...document.querySelectorAll('*')].filter(el => {
    const s = window.getComputedStyle(el);
    return s.position === 'fixed' && parseInt(s.zIndex) > 1000;
  }).map(el => ({ tag: el.tagName, z: window.getComputedStyle(el).zIndex, class: el.className.toString().slice(0,80) }));
  
  return {
    bodyHeight: document.body.scrollHeight,
    fixedHighZ: fixed,
    phaseText: document.body.innerText.slice(0, 200),
  };
});

console.log('Page info:', JSON.stringify(info, null, 2));
await browser.close();
