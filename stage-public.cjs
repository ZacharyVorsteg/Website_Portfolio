const fs = require('node:fs');
const path = require('node:path');
const entries = ["cef0752662da2ce0eb360708188259db.txt", "workflow-check", "MA_Model_Template.xlsx", "about", "agentic-ai-engineer-west-palm-beach", "ai-automation", "ai-automation-palm-beach-county", "ai-consultant-palm-beach-county", "ai-consulting-west-palm-beach", "ai-operating-layer", "ai-systems-architect-florida", "app.js", "apple-touch-icon.png", "apps", "bidpro", "blog", "commercial-real-estate", "custom-software", "customlabcrm", "detailpro", "entity", "favicon.ico", "finance", "financial_statements-Template.xlsx", "googlea09d70eb2ac56a46.html", "images", "index.html", "llms.txt", "macro.html", "og-image.jpg", "portfolio", "pressurewashpro", "production", "resource-styles.css", "resources", "proforma-model.js", "proforma-ui.js", "proforma-styles.css", "proforma.html", "revenue_waterfall-Template.xlsx", "robots.txt", "sitemap.xml", "site-shell.css", "styles.css"];
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
// GA4 (zacharyvorsteg.com, G-H3M3RWT19L): one gtag.js per page, loaded on first interaction or
// 3 s after load so it stays off the critical path. app.js sends generate_lead when the contact
// endpoint accepts a request; no form contents go to analytics.
const GA4_ID = 'G-H3M3RWT19L';
const GA4_SNIPPET = `<!-- GA4: config queued now; gtag.js loads once on first interaction or 3 s after load. -->
<script>(function(w,d){if(w.__zvGa4)return;w.__zvGa4=1;var ID='${GA4_ID}';w.dataLayer=w.dataLayer||[];w.gtag=w.gtag||function(){w.dataLayer.push(arguments)};w.gtag('js',new Date());w.gtag('config',ID);var done=0,ev=['pointerdown','keydown','touchstart','scroll'];function go(){if(done)return;done=1;ev.forEach(function(e){w.removeEventListener(e,go,true)});if(!d.querySelector('script[src^="https://www.googletagmanager.com/gtag/js"]')){var s=d.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+ID;d.head.appendChild(s)}}ev.forEach(function(e){w.addEventListener(e,go,{capture:true,passive:true,once:true})});function later(){setTimeout(go,3000)}if(d.readyState==='complete')later();else w.addEventListener('load',later,{once:true})})(window,document);</script>
`;
function injectGa4(dir) {
  let n = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) { n += injectGa4(full); continue; }
    if (!entry.name.endsWith('.html')) continue;
    const html = fs.readFileSync(full, 'utf8');
    if (html.includes('googletagmanager.com/gtag/js') || !html.includes('</head>')) continue;
    fs.writeFileSync(full, html.replace('</head>', `${GA4_SNIPPET}</head>`));
    n += 1;
  }
  return n;
}
console.log(`GA4 snippet injected into ${injectGa4(out)} pages.`);
require('./tools/preview-metadata.cjs').normalizePublic(out);
console.log(`llms-full.txt: ${require('./tools/build-llms-full.cjs').build(out)} pages indexed.`);
console.log(`Staged ${entries.length} public entries.`);
