import puppeteer from '/home/user/AWWWARDS/node_modules/puppeteer/lib/puppeteer/puppeteer.js';
import { mkdirSync } from 'fs';
mkdirSync('/tmp/shots2', { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  executablePath: '/root/.cache/puppeteer/chrome/linux-127.0.6533.88/chrome-linux64/chrome',
  args: ['--no-sandbox','--disable-setuid-sandbox','--disable-gpu','--window-size=1440,900'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });

await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });

// Wait for loading screen to fully dismiss (it takes ~5s total)
await new Promise(r => setTimeout(r, 8000));

// Force dismiss loading screen via JS if still present
await page.evaluate(() => {
  document.querySelectorAll('[style*="z-index: 99998"], [style*="z-index:99998"]').forEach(el => el.remove());
  // Trigger all IntersectionObserver animations by scrolling through
});

await page.screenshot({ path: '/tmp/shots2/01-hero.png' });

// Scroll through every 800px, wait longer for animations to trigger
const totalHeight = await page.evaluate(() => document.body.scrollHeight);
console.log('Total page height:', totalHeight);

for (let y = 0; y < totalHeight; y += 800) {
  await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
  await new Promise(r => setTimeout(r, 1500));
}

// Now take section screenshots going back to top
await page.evaluate(() => window.scrollTo(0, 0));
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: '/tmp/shots2/01-hero.png' });

const steps = [900, 1800, 2700, 3600, 4500, 5400, 6300, 7200, 8100, 9000, 10000, 11000, 12000];
for (let i = 0; i < steps.length; i++) {
  await page.evaluate((y) => window.scrollTo(0, y), steps[i]);
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: `/tmp/shots2/${String(i+2).padStart(2,'0')}-y${steps[i]}.png` });
}

await browser.close();
console.log('Done');
