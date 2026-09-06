const fs = require('node:fs');
const path = require('node:path');
const entries = ["MA_Model_Template.xlsx", "about", "agentic-ai-engineer-west-palm-beach", "ai-automation", "ai-automation-palm-beach-county", "ai-consultant-palm-beach-county", "ai-operating-layer", "ai-systems-architect-florida", "app.js", "apple-touch-icon.png", "apps", "bidpro", "blog", "commercial-real-estate", "custom-software", "customlabcrm", "detailpro", "entity", "favicon.ico", "finance", "financial_statements-Template.xlsx", "googlea09d70eb2ac56a46.html", "images", "index.html", "llms.txt", "macro.html", "og-image.jpg", "portfolio", "pressurewashpro", "production", "proforma-styles.css", "proforma.html", "revenue_waterfall-Template.xlsx", "robots.txt", "sitemap.xml", "styles.css"];
const out = path.join(__dirname, 'public');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const entry of entries) {
  fs.cpSync(path.join(__dirname, entry), path.join(out, entry), {
    recursive: true,
    filter(source) {
      if (fs.lstatSync(source).isSymbolicLink()) throw new Error('Symlink in public output');
      const name = path.basename(source);
      return !name.startsWith('_') && !name.startsWith('.') && !/\.(?:md|env|toml|sql|test\.js)$/.test(name);
    },
  });
}
console.log(`Staged ${entries.length} public entries.`);
