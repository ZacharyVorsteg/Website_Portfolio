const fs = require('node:fs');
const path = require('node:path');
const entries = ["cef0752662da2ce0eb360708188259db.txt", "workflow-check", "MA_Model_Template.xlsx", "about", "links", "agentic-ai-engineer-west-palm-beach", "ai-automation", "ai-automation-palm-beach-county", "ai-consultant-palm-beach-county", "ai-consulting-west-palm-beach", "ai-operating-layer", "ai-systems-architect-florida", "app.js", "apple-touch-icon.png", "apps", "bidpro", "blog", "commercial-real-estate", "custom-software", "customlabcrm", "detailpro", "entity", "favicon.ico", "finance", "financial_statements-Template.xlsx", "googlea09d70eb2ac56a46.html", "images", "index.html", "llms.txt", "macro.html", "og-image.jpg", "portfolio", "pressurewashpro", "production", "resource-styles.css", "resources", "proforma-model.js", "proforma-ui.js", "proforma-styles.css", "proforma.html", "revenue_waterfall-Template.xlsx", "robots.txt", "sitemap.xml", "site-shell.css", "styles.css", "terms", "ventures"];
const out = path.join(__dirname, 'public');
// Keep the original creative sources in Git, but publish only the reviewed,
// disclosed Sloane excerpt. The originals contain unverified commercial claims.
const unpublishedSources = new Set([
  'images/production/ugc-sloane-ads.jpg',
  'images/production/ugc-sloane-ads.mp4',
  'images/production/ugc-sloane-reveal.jpg',
  'images/production/ugc-sloane-reveal.mp4',
]);
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const entry of entries) {
  fs.cpSync(path.join(__dirname, entry), path.join(out, entry), {
    recursive: true,
    filter(source) {
      if (fs.lstatSync(source).isSymbolicLink()) throw new Error('Symlink in public output');
      if (unpublishedSources.has(path.relative(__dirname, source).split(path.sep).join('/'))) return false;
      const name = path.basename(source);
      return !name.startsWith('_') && !name.startsWith('.') && !/\.(?:md|env|toml|sql|test\.js)$/.test(name);
    },
  });
}
// Hybrid consent (US default-on / EU+CA opt-in; honor GPC/DNT). Assets filled at stage time
// from tools/analytics template with origin lock for zacharyvorsteg.com + zachvorsteg.com.
const crypto = require('node:crypto');
const GA4_ID = 'G-H3M3RWT19L';
const CONSENT_ORIGIN = 'https://zacharyvorsteg.com';
const CONSENT_TITLE = 'Zachary Vorsteg';
const templatePath = path.join(__dirname, 'tools', 'analytics', 'analytics-consent.js.template');
const cssPath = path.join(__dirname, 'tools', 'analytics', 'analytics-consent.css');
// Fall back to portfolio tools path on the box if local tools/analytics is absent.
const fallbackTemplate = '/workspace/sites/portfolio/tools/analytics/analytics-consent.js.template';
const fallbackCss = '/workspace/sites/portfolio/tools/analytics/analytics-consent.css';
let template = fs.existsSync(templatePath) ? fs.readFileSync(templatePath, 'utf8') : fs.readFileSync(fallbackTemplate, 'utf8');
let css = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf8') : fs.readFileSync(fallbackCss, 'utf8');
template = template.replaceAll('__SITE_ORIGIN__', CONSENT_ORIGIN).replaceAll('__SITE_TITLE__', CONSENT_TITLE);
// Allow zachvorsteg.com alias host
template = template.replace(
  "if (location.origin !== origin || !/^G-[A-Z0-9]+$/.test(id) || !page.startsWith(origin + '/')) return;",
  "const allowedOrigins = ['https://zacharyvorsteg.com','https://www.zacharyvorsteg.com','https://zachvorsteg.com','https://www.zachvorsteg.com'];\n  if (!allowedOrigins.includes(location.origin) || !/^G-[A-Z0-9]+$/.test(id)) return;\n  if (!allowedOrigins.some((o) => page.startsWith(o + '/'))) return;"
);
const jsh = crypto.createHash('sha256').update(template).digest('hex').slice(0, 12);
const csh = crypto.createHash('sha256').update(css).digest('hex').slice(0, 12);
const assetsOut = path.join(out, 'assets');
fs.mkdirSync(assetsOut, { recursive: true });
fs.writeFileSync(path.join(assetsOut, 'analytics-consent.js'), template);
fs.writeFileSync(path.join(assetsOut, 'analytics-consent.css'), css);
const CONSENT_SNIPPET = `<link rel="stylesheet" href="/assets/analytics-consent.css?v=${csh}">\n<script data-site-analytics defer src="/assets/analytics-consent.js?v=${jsh}" data-measurement-id="${GA4_ID}"></script>\n`;
function injectConsent(dir) {
  let n = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) { n += injectConsent(full); continue; }
    if (!entry.name.endsWith('.html')) continue;
    let html = fs.readFileSync(full, 'utf8');
    if (!html.includes('</head>')) continue;
    // Drop legacy ungated GA4 bootstraps if present
    html = html.replace(/<!--\s*GA4[^>]*-->\s*<script>\(function\(w,d\)\{if\(w\.__zvGa4\).*?<\/script>/is, '');
    html = html.replace(/<script>\(function\(w,d\)\{if\(w\.__zvGa4\).*?<\/script>/gs, '');
    if (html.includes('data-site-analytics')) {
      html = html.replace(/<link rel="stylesheet" href="\/assets\/analytics-consent\.css(?:\?v=[^"]*)?">/, `<link rel="stylesheet" href="/assets/analytics-consent.css?v=${csh}">`);
      html = html.replace(/<script data-site-analytics[^>]*><\/script>/, `<script data-site-analytics defer src="/assets/analytics-consent.js?v=${jsh}" data-measurement-id="${GA4_ID}"></script>`);
    } else {
      html = html.replace('</head>', `${CONSENT_SNIPPET}</head>`);
    }
    fs.writeFileSync(full, html);
    n += 1;
  }
  return n;
}
console.log(`Hybrid consent injected into ${injectConsent(out)} pages (js=${jsh}).`);

// CF Web Analytics (gray-cloud host token for zacharyvorsteg.com)
const CF_BEACON = `<!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "213353d38d024606a7b2352be2616ebf"}'></script><!-- End Cloudflare Web Analytics -->\n`;
function injectCfBeacon(dir) {
  let n = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) { n += injectCfBeacon(full); continue; }
    if (!entry.name.endsWith('.html')) continue;
    let html = fs.readFileSync(full, 'utf8');
    if (html.includes('data-cf-beacon') || !html.includes('</body>')) continue;
    fs.writeFileSync(full, html.replace(/<\/body>/i, CF_BEACON + '</body>'));
    n += 1;
  }
  return n;
}
console.log(`CF Web Analytics beacon injected into ${injectCfBeacon(out)} pages.`);

require('./tools/preview-metadata.cjs').normalizePublic(out);
console.log(`llms-full.txt: ${require('./tools/build-llms-full.cjs').build(out)} pages indexed.`);
console.log(`Staged ${entries.length} public entries.`);
