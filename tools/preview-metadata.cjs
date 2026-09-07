// Final public-head pass: all generators share one reviewed preview identity.
// Does not alter article text, dates, robots directives, URLs or verification tags.
const fs = require('node:fs');
const path = require('node:path');
const DOMAIN = 'https://zacharyvorsteg.com';
const IMAGE = `${DOMAIN}/images/preview-founder.png`;
const ALT = 'Zachary Vorsteg — practical AI, connected operations and custom software. Founder and builder in West Palm Beach.';
const resourcePreviews = {
  'proforma.html': ['preview-proforma.png', 'Real estate pro forma by Zachary Vorsteg. Rental income, financing and cash flow. Make every assumption visible.'],
  'resources/index.html': ['preview-resources.png', 'The resource collection by Zachary Vorsteg. Financial templates and interactive tools for your next business decision.'],
  'workflow-check/index.html': ['preview-workflow.png', 'Workflow opportunity worksheet by Zachary Vorsteg. Map a repetitive process and choose a practical starting point.'],
};
const overrides = {
  'about/index.html': ['About Zachary Vorsteg | Founder & Builder', 'Meet Zachary Vorsteg, a technical founder in West Palm Beach building business systems, AI workflows and custom software. Explore his work and approach.'],
  'portfolio/index.html': ['Selected Work & Ventures | Zachary Vorsteg', 'Explore software, automation and property projects built by Zachary Vorsteg, including Trusenda and Palm Beach Warehouses. Discuss a similar business problem.'],
  'blog/index.html': ['Business Systems & Founder Insights | Zachary Vorsteg', 'Notes from Zachary Vorsteg on building software, automating business workflows, finance and real estate. Explore practical lessons from his own ventures.'],
  'macro.html': ['Macroeconomic Research Dashboard | Zachary Vorsteg', "Explore macroeconomic indicators and scenarios in Zachary Vorsteg's research dashboard."],
  'proforma.html': ['Free Real Estate Pro Forma | Zachary Vorsteg', 'Model rental-property income, expenses, financing and cash flow. Make assumptions visible, save scenarios and print a clear report. No email required.'],
};
// Decode once, so an intentionally literal &amp;apos; stays literal after re-encoding.
const decode = text => text.replace(/&(amp|quot|apos|lt|gt|#\d+|#x[\da-f]+);/gi, (entity, code) => {
  const named = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>' };
  if (named[code.toLowerCase()]) return named[code.toLowerCase()];
  const point = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
  return point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : entity;
});
const escape = text => String(text).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const attr = (tag, key) => decode(tag.match(new RegExp(`\\b${key}=["']([^"']*)["']`, 'i'))?.[1] || '');
const meta = (head, key) => {
  const tag = (head.match(/<meta\b[^>]*>/gi) || []).find(t => attr(t, 'name') === key || attr(t, 'property') === key);
  // Metadata in this repository uses double-quoted content; apostrophes are plain text.
  return tag ? decode(tag.match(/\bcontent="([^"]*)"/i)?.[1] || '') : '';
};
function normalizePreview(file, relative) {
  let html = fs.readFileSync(file, 'utf8');
  if (!/<head[\s>]/i.test(html)) return false; // Search ownership verification file.
  html = html.replace(/(<head\b[^>]*>)([\s\S]*?)(<\/head>)/i, (_, start, head, end) => {
    let title = decode(head.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '').trim();
    if (!title) throw new Error(`Missing title: ${relative}`);
    let description = meta(head, 'description');
    [title, description] = overrides[relative] || [title, description];
    if (!description) {
      const kind = relative.split('/').slice(-2, -1)[0];
      const app = title.split(/\s[—|]\s/)[0];
      description = kind === 'support' ? `Find support and contact information for ${app}.` : `${kind === 'privacy' ? 'Privacy policy' : 'Terms of service'} for ${app}. Read the information provided for users of the app.`;
    }
    const canonicalTag = (head.match(/<link\b[^>]*>/gi) || []).find(t => attr(t, 'rel') === 'canonical');
    const canonical = canonicalTag ? attr(canonicalTag, 'href') : DOMAIN + '/' + relative.replace(/index\.html$/, '');
    const type = meta(head, 'og:type') || (relative.startsWith('blog/') && relative !== 'blog/index.html' ? 'article' : 'website');
    const utility = /^(bidpro|customlabcrm|detailpro|pressurewashpro)\//.test(relative);
    const resourcePreview = resourcePreviews[relative];
    const image = utility ? `${DOMAIN}/apple-touch-icon.png` : resourcePreview ? `${DOMAIN}/images/${resourcePreview[0]}` : IMAGE;
    const alt = utility ? 'Zachary Vorsteg, app developer' : resourcePreview ? resourcePreview[1] : ALT;
    const tags = {
      description,
      'og:type': type, 'og:url': canonical, 'og:site_name': 'Zachary Vorsteg', 'og:locale': 'en_US',
      'og:title': title, 'og:description': description,
      'og:image': image, 'og:image:secure_url': image, 'og:image:type': 'image/png',
      'og:image:width': utility ? '180' : '1200', 'og:image:height': utility ? '180' : '630', 'og:image:alt': alt,
      'twitter:card': utility ? 'summary' : 'summary_large_image', 'twitter:title': title,
      'twitter:description': description, 'twitter:image': image, 'twitter:image:alt': alt,
    };
    head = head.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escape(title)}</title>`)
      .replace(/\s*<meta\b[^>]*>/gi, tag => Object.hasOwn(tags, attr(tag, 'name') || attr(tag, 'property')) ? '' : tag)
      .replace(/\s*<link\b[^>]*>/gi, tag => ['icon', 'shortcut icon', 'apple-touch-icon', 'canonical'].includes(attr(tag, 'rel')) ? '' : tag);
    head += '\n    ' + Object.entries(tags).map(([key, value]) => `<meta ${key.startsWith('og:') ? 'property' : 'name'}="${key}" content="${escape(value)}">`).join('\n    ');
    head += `\n    <link rel="canonical" href="${escape(canonical)}">\n    <link rel="icon" type="image/png" sizes="180x180" href="/apple-touch-icon.png">\n    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">\n`;
    // Existing Article image references must describe the same preview; Person portraits remain intact.
    head = head.replaceAll(`${DOMAIN}/og-image.jpg`, IMAGE);
    return start + head + end;
  });
  fs.writeFileSync(file, html);
  return true;
}
function normalizePublic(root) {
  let count = 0;
  function visit(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) visit(file);
      else if (entry.name.endsWith('.html')) count += Number(normalizePreview(file, path.relative(root, file).split(path.sep).join('/')));
    }
  }
  visit(root);
  console.log(`Normalized previews on ${count} public HTML pages.`);
}
module.exports = { normalizePublic };
