// Builds public/llms-full.txt from the staged public/ output (run by stage-public.cjs after the blog build).
// Every line comes from a page's own <title> and meta description, so the index cannot drift from the site
// or claim anything the site does not say. Pages marked noindex are skipped.
const fs = require('node:fs');
const path = require('node:path');

const ORIGIN = 'https://zacharyvorsteg.com';

const decode = (s) => s
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&#x27;|&apos;/g, "'")
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&mdash;/g, '—').replace(/&ndash;/g, '–')
  .replace(/\s+/g, ' ').trim();

function pages(publicDir) {
  const found = [];
  (function walk(dir) {
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      if (fs.statSync(full).isDirectory()) walk(full);
      else if (name.endsWith('.html')) found.push(full);
    }
  })(publicDir);
  return found;
}

function read(file, publicDir) {
  const html = fs.readFileSync(file, 'utf8');
  if (/<meta[^>]+name=["']robots["'][^>]+noindex/i.test(html)) return null;
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!title) return null;
  const tag = (html.match(/<meta\b[^>]*\bname=["']description["'][^>]*>/i) || [''])[0];
  const desc = tag.match(/\bcontent="([^"]*)"/i) || tag.match(/\bcontent='([^']*)'/i);
  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  let rel = '/' + path.relative(publicDir, file).split(path.sep).join('/');
  rel = rel.replace(/index\.html$/, '');
  const url = canonical && canonical[1].startsWith(ORIGIN) ? canonical[1] : ORIGIN + rel;
  if (!url.startsWith(ORIGIN)) return null;
  return { url, title: decode(title[1]), desc: desc ? decode(desc[1]) : '' };
}

const GROUPS = [
  ['Core pages', (u) => /^\/(about\/|portfolio\/|apps\/|contact\/)?$/.test(u)],
  ['Ways to work together', (u) => /^\/(ai-automation|custom-software|finance|commercial-real-estate|ai-operating-layer|production)\//.test(u)],
  ['Local AI pages', (u) => /^\/(ai-consultant|ai-automation-palm|agentic-ai|ai-systems)/.test(u)],
  ['Free resources', (u) => /^\/(resources\/|proforma\.html|workflow-check)/.test(u)],
  ['Insights (blog)', (u) => /^\/blog\//.test(u)],
  ['Other pages', () => true],
];

function build(publicDir) {
  const seen = new Set();
  const entries = pages(publicDir).map((f) => read(f, publicDir)).filter(Boolean)
    .filter((e) => (seen.has(e.url) ? false : seen.add(e.url)))
    .sort((a, b) => a.url.localeCompare(b.url));
  const today = new Date().toISOString().slice(0, 10);
  const out = [
    '# Zachary Vorsteg — full site index for AI assistants',
    '',
    '> Page-by-page index of zacharyvorsteg.com. Each entry is the page\'s own title and description; nothing here is added beyond what the pages state. The short profile is at https://zacharyvorsteg.com/llms.txt',
    '',
    `Updated: ${today} (regenerated on every site build)`,
    '',
  ];
  const used = new Set();
  for (const [name, test] of GROUPS) {
    const group = entries.filter((e) => !used.has(e.url) && test(e.url.slice(ORIGIN.length)));
    if (!group.length) continue;
    out.push(`## ${name}`, '');
    for (const e of group) {
      used.add(e.url);
      out.push(`- [${e.title}](${e.url})${e.desc ? `: ${e.desc}` : ''}`);
    }
    out.push('');
  }
  out.push('## Compliance', '',
    '- Zachary Vorsteg is a Florida-licensed real estate sales associate affiliated with Cornerstone Realty, not a broker.',
    '- This file is a reading guide. It does not establish ratings, reviews, results or guarantees.', '');
  fs.writeFileSync(path.join(publicDir, 'llms-full.txt'), out.join('\n'));
  return entries.length;
}

module.exports = { build };
if (require.main === module) console.log(`llms-full.txt: ${build(path.resolve(process.argv[2] || 'public'))} pages`);
