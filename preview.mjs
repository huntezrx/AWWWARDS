import puppeteer from '/home/user/AWWWARDS/node_modules/puppeteer/lib/puppeteer/puppeteer.js';
import { mkdirSync } from 'fs';
mkdirSync('/tmp/vxus', { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  executablePath: '/root/.cache/puppeteer/chrome/linux-127.0.6533.88/chrome-linux64/chrome',
  args: ['--no-sandbox','--disable-setuid-sandbox','--disable-gpu','--window-size=1440,900'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 3000));

// Hero
await page.screenshot({ path: '/tmp/vxus/01-hero.png', clip: { x:0,y:0,width:1440,height:900 } });

// Features
await page.evaluate(() => window.scrollTo(0, 1000));
await new Promise(r => setTimeout(r, 1200));
await page.screenshot({ path: '/tmp/vxus/02-trusted.png', clip: { x:0,y:0,width:1440,height:900 } });

await page.evaluate(() => window.scrollTo(0, 1900));
await new Promise(r => setTimeout(r, 1500));
await page.screenshot({ path: '/tmp/vxus/03-features-top.png', clip: { x:0,y:0,width:1440,height:900 } });

await page.evaluate(() => window.scrollTo(0, 3000));
await new Promise(r => setTimeout(r, 1500));
await page.screenshot({ path: '/tmp/vxus/04-features-mid.png', clip: { x:0,y:0,width:1440,height:900 } });

await page.evaluate(() => window.scrollTo(0, 4200));
await new Promise(r => setTimeout(r, 1200));
await page.screenshot({ path: '/tmp/vxus/05-stats.png', clip: { x:0,y:0,width:1440,height:900 } });

await page.evaluate(() => window.scrollTo(0, 5200));
await new Promise(r => setTimeout(r, 1200));
await page.screenshot({ path: '/tmp/vxus/06-pricing-top.png', clip: { x:0,y:0,width:1440,height:900 } });

await page.evaluate(() => window.scrollTo(0, 6500));
await new Promise(r => setTimeout(r, 1200));
await page.screenshot({ path: '/tmp/vxus/07-pricing-cards.png', clip: { x:0,y:0,width:1440,height:900 } });

const total = await page.evaluate(() => document.body.scrollHeight);
await page.evaluate((h) => window.scrollTo(0, h - 900), total);
await new Promise(r => setTimeout(r, 1200));
await page.screenshot({ path: '/tmp/vxus/08-footer.png', clip: { x:0,y:0,width:1440,height:900 } });

await browser.close();
console.log('Done - total height:', total);
