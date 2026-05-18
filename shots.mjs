import puppeteer from '/home/user/AWWWARDS/node_modules/puppeteer/lib/puppeteer/puppeteer.js';
import { mkdirSync } from 'fs';
mkdirSync('/tmp/shots', { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  executablePath: '/root/.cache/puppeteer/chrome/linux-127.0.6533.88/chrome-linux64/chrome',
  args: ['--no-sandbox','--disable-setuid-sandbox','--disable-gpu','--window-size=1440,900'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });

await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });
await new Promise(r => setTimeout(r, 5000));

await page.screenshot({ path: '/tmp/shots/01-hero.png' });

const scrollPoints = [900, 1800, 2700, 3600, 4500, 5400, 6300, 7200, 8100, 9000, 10000];
for (let i = 0; i < scrollPoints.length; i++) {
  await page.evaluate((y) => window.scrollTo(0, y), scrollPoints[i]);
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: `/tmp/shots/${String(i+2).padStart(2,'0')}-y${scrollPoints[i]}.png` });
}

await browser.close();
console.log('Done');
