import puppeteer from '/home/user/AWWWARDS/node_modules/puppeteer/lib/puppeteer/puppeteer.js';
import { mkdirSync } from 'fs';
mkdirSync('/tmp/vxus3', { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  executablePath: '/root/.cache/puppeteer/chrome/linux-127.0.6533.88/chrome-linux64/chrome',
  args: ['--no-sandbox','--disable-setuid-sandbox','--disable-gpu','--window-size=1440,900'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 2500));

// Scroll slowly through entire page
const total = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y <= total; y += 100) {
  await page.evaluate((s) => window.scrollTo(0, s), y);
  await new Promise(r => setTimeout(r, 100));
}
await new Promise(r => setTimeout(r, 1000));

// Now take full page screenshot
await page.evaluate(() => window.scrollTo(0, 0));
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: '/tmp/vxus3/fullpage.png', fullPage: true });
console.log('Done, total:', total);
await browser.close();
