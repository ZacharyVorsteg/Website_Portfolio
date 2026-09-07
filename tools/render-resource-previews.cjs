// Code-native resource share cards. Re-render with the same Chrome/font environment for reproducible PNGs.
const path = require('node:path');
const fs = require('node:fs');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const cards = [
  { file: 'preview-proforma.png', title: 'Real estate<br>pro forma.', subtitle: 'Rental income, financing and cash flow.<br>Make every assumption visible.' },
  { file: 'preview-resources.png', title: 'The resource<br>collection.', subtitle: 'Financial templates and interactive tools<br>for your next business decision.' },
  { file: 'preview-workflow.png', title: 'Workflow<br>opportunity worksheet.', subtitle: 'Map a repetitive process.<br>Choose a practical starting point.' },
];
function html(card) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Resource share preview source</title><style>
  *{box-sizing:border-box}html,body{margin:0;width:1200px;height:630px;overflow:hidden}body{background:#f8f8f5;color:#19312d;font-family:Arial,sans-serif}
  main{height:100%;padding:48px 64px 36px;border-top:12px solid #19312d;display:flex;flex-direction:column}
  header{display:flex;justify-content:space-between;align-items:baseline;gap:32px;padding-bottom:23px;border-bottom:1px solid #bdcbbf}
  .wordmark{font-size:28px;font-weight:600;letter-spacing:-1.1px;margin:0}.category{font-size:14px;letter-spacing:1.6px;text-transform:uppercase;margin:0;color:#48604f}
  section{flex:1;padding-top:32px}h1{font-family:Georgia,'Times New Roman',serif;font-weight:400;font-size:76px;line-height:1.04;letter-spacing:-2.9px;margin:0 0 22px}p.subtitle{font-size:25px;line-height:1.42;color:#48604f;margin:0}
  footer{border-top:1px solid #bdcbbf;padding-top:18px;display:flex;justify-content:space-between;align-items:center;font-size:19px;color:#48604f}.brand-rule{height:7px;width:72px;background:#19312d}
  </style></head><body><main><header><p class="wordmark">Zachary Vorsteg</p><p class="category">Free resources</p></header><section><h1>${card.title}</h1><p class="subtitle">${card.subtitle}</p></section><footer><span>zacharyvorsteg.com</span><span class="brand-rule" aria-hidden="true"></span></footer></main></body></html>`;
}
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
  try {
    const context = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, reducedMotion: 'reduce', serviceWorkers: 'block' });
    await context.route('**/*', route => route.abort());
    const page = await context.newPage();
    for (const card of cards) {
      await page.setContent(html(card));
      await page.evaluate(() => document.fonts.ready);
      const fits = await page.evaluate(() => {
        const section = document.querySelector('section').getBoundingClientRect(), footer = document.querySelector('footer').getBoundingClientRect();
        return [...document.querySelectorAll('h1,.subtitle')].every(node => {
          const box = node.getBoundingClientRect();
          return node.scrollWidth <= node.clientWidth && box.right <= 1136 && box.bottom < footer.top && box.left >= section.left;
        });
      });
      if (!fits) throw new Error('Card content does not fit: ' + card.file);
      const file = path.join(__dirname, '../images', card.file);
      await page.screenshot({ path: file, type: 'png' });
      console.log(`${card.file}: 1200×630, ${fs.statSync(file).size} bytes`);
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
