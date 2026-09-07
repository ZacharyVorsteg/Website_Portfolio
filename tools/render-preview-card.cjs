// Render code-native card source with the original portrait unchanged.
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async () => {
  const browser = await chromium.launch({executablePath:process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
  try {
    const page = await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
    await page.goto(pathToFileURL(path.join(__dirname,'preview-card.html')).href);
    await page.evaluate(async () => {await document.fonts.ready; await Promise.all([...document.images].map(image=>image.decode()));});
    await page.screenshot({path:path.join(__dirname,'../images/preview-founder.png')});
  } finally {await browser.close();}
})();
