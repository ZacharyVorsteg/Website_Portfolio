// Render a text-only disclosure band. No source photograph/video is modified here.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const path = require('node:path');
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
  try {
    const page = await browser.newPage({ viewport: { width: 720, height: 240 }, deviceScaleFactor: 1 });
    await page.setContent(`<!doctype html><html><head><style>
      *{box-sizing:border-box}html,body{margin:0;width:720px;height:240px;background:#0b0d12;color:white}
      body{display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding-top:28px;gap:12px;font-family:Arial,sans-serif;font-weight:700}
      p{margin:0;font-size:36px;line-height:44px;white-space:nowrap}p+p{font-size:34px;line-height:40px}
    </style></head><body><p>Sloane · AI-generated spokesperson</p><p>Demo</p></body></html>`);
    if (await page.locator('p').first().evaluate(el => el.getBoundingClientRect().width > 688)) throw new Error('Disclosure exceeds safe width');
    await page.screenshot({ path: path.resolve(process.argv[2]), omitBackground: false });
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
