import puppeteer from '/home/user/AWWWARDS/node_modules/puppeteer/lib/puppeteer/puppeteer.js';
import { mkdirSync } from 'fs';
mkdirSync('/tmp/vxus2', { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  executablePath: '/root/.cache/puppeteer/chrome/linux-127.0.6533.88/chrome-linux64/chrome',
  args: ['--no-sandbox','--disable-setuid-sandbox','--disable-gpu','--window-size=1440,900'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 2500));

// Scroll through to trigger IntersectionObserver
const total = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y <= total; y += 200) {
  await page.evaluate((s) => window.scrollTo(0, s), y);
  await new Promise(r => setTimeout(r, 60));
}

// Force all hidden elements visible
await page.evaluate(() => {
  document.querySelectorAll('*').forEach(el => {
    const s = window.getComputedStyle(el);
    if (s.opacity === '0') el.style.opacity = '1';
    if (s.visibility === 'hidden') el.style.visibility = 'visible';
  });
});

await new Promise(r => setTimeout(r, 800));

const heights = [0, 820, 1200, 1700, 2200, 2700, total - 900];
for (let i = 0; i < heights.length; i++) {
  await page.evaluate((y) => window.scrollTo(0, Math.max(0,y)), heights[i]);
  await new Promise(r => setTimeout(r, 700));
  await page.screenshot({ path: `/tmp/vxus2/${String(i+1).padStart(2,'0')}.png`, clip: { x:0,y:0,width:1440,height:900 } });
}

await browser.close();
console.log('Done - page height:', total);
