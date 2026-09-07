const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'public');
function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? files(file) : entry.name.endsWith('.html') ? [file] : [];
  });
}
test('every published preview has one complete head, correct image bytes and unchanged page content', async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
  try {
    const context = await browser.newContext();
    await context.route('**/*', route => route.abort());
    const page = await context.newPage();
    const titles = new Set();
    let count = 0;
    for (const file of files(output)) {
      const html = fs.readFileSync(file, 'utf8');
      const relative = path.relative(output, file);
      if (!/<head[\s>]/i.test(html)) continue;
      const data = await page.evaluate(html => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const values = {};
        for (const tag of doc.head.querySelectorAll('meta[name],meta[property]')) {
          const key = tag.getAttribute('name') || tag.getAttribute('property');
          (values[key] ||= []).push(tag.getAttribute('content'));
        }
        return { values, title: doc.title, canonicals: [...doc.head.querySelectorAll('link[rel="canonical"]')].map(x => x.href), icons: [...doc.head.querySelectorAll('link[rel="icon"]')].map(x => x.getAttribute('href')) };
      }, html);
      assert.ok(data.title && !titles.has(data.title), `Distinct title: ${relative}`);
      titles.add(data.title);
      assert.equal(data.canonicals.length, 1, relative);
      for (const key of ['description','og:title','og:description','og:url','og:site_name','og:type','og:image','og:image:type','og:image:width','og:image:height','og:image:alt','twitter:card','twitter:title','twitter:description','twitter:image','twitter:image:alt']) {
        assert.equal(data.values[key]?.length, 1, `${relative}: one ${key} in parsed head`);
        assert.ok(data.values[key][0].trim(), `${relative}: nonempty ${key}`);
      }
      assert.equal(data.values['og:url'][0], data.canonicals[0]);
      assert.equal(data.values['og:site_name'][0], 'Zachary Vorsteg');
      assert.equal(data.values['twitter:image'][0], data.values['og:image'][0]);
      if (relative.startsWith('blog' + path.sep) && relative !== path.join('blog', 'index.html')) {
        const source = await page.evaluate(html => {
          const doc = new DOMParser().parseFromString(html, 'text/html');
          return { title: doc.title, description: doc.head.querySelector('meta[name="description"]').content };
        }, fs.readFileSync(path.join(root, relative), 'utf8'));
        assert.equal(data.title, source.title, `Authored title characters preserved: ${relative}`);
        assert.equal(data.values.description[0], source.description, `Authored description characters preserved: ${relative}`);
      }
      const imageUrl = new URL(data.values['og:image'][0]);
      assert.equal(imageUrl.origin, 'https://zacharyvorsteg.com');
      const bytes = fs.readFileSync(path.join(output, imageUrl.pathname));
      assert.equal(bytes.subarray(1, 4).toString(), 'PNG');
      assert.equal(bytes.readUInt32BE(16), Number(data.values['og:image:width'][0]));
      assert.equal(bytes.readUInt32BE(20), Number(data.values['og:image:height'][0]));
      assert.deepEqual(data.icons, ['/apple-touch-icon.png']);
      assert.equal(html.split('</head>')[1], fs.readFileSync(path.join(root, relative), 'utf8').split('</head>')[1], `Page body preserved: ${relative}`);
      count++;
    }
    assert.equal(count, 43);
    assert.equal(files(path.join(output, 'blog')).length, 15);
    const icon = fs.readFileSync(path.join(output, 'apple-touch-icon.png'));
    assert.equal(icon.readUInt32BE(16), 180);
    assert.equal(icon.readUInt32BE(20), 180);
  } finally { await browser.close(); }
});
