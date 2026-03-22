#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const SITE_URL = 'https://zacharyvorsteg.com';
const CONTENT_DIR = path.join(__dirname, 'blog-content');
const OUTPUT_DIR = path.join(__dirname, 'blog');
const TEMPLATE_PATH = path.join(__dirname, 'blog', '_template.html');
const INDEX_TEMPLATE_PATH = path.join(__dirname, 'blog', '_index-template.html');
const SITEMAP_PATH = path.join(__dirname, 'sitemap.xml');

marked.setOptions({ gfm: true, breaks: false, headerIds: true, mangle: false });

// Parse frontmatter from markdown
function parseFrontmatter(content) {
  const lines = content.split('\n');
  if (lines[0] !== '---') return { metadata: {}, content };

  let endIdx = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === '---') {
      endIdx = i;
      break;
    }
  }

  if (endIdx === -1) return { metadata: {}, content };

  const frontmatter = lines.slice(1, endIdx).join('\n');
  const body = lines.slice(endIdx + 1).join('\n');

  const metadata = {};
  frontmatter.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length) {
      const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
      metadata[key.trim()] = value;
    }
  });

  return { metadata, content: body.trim() };
}

// Validate frontmatter fields
function validateFrontmatter(slug, metadata, warnings) {
  const requiredFields = {
    title: { maxLen: 70, warnAt: 60 },
    description: { maxLen: 160, warnAt: 155 },
    date: { format: 'YYYY-MM-DD' },
    pillar: { maxLen: null },
    keywords: { maxLen: null }
  };

  for (const [field, rules] of Object.entries(requiredFields)) {
    const value = metadata[field];

    if (!value || value.trim() === '') {
      warnings.push(`⚠ [${slug}]: Missing required field "${field}"`);
      continue;
    }

    if (rules.format === 'YYYY-MM-DD') {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        warnings.push(`⚠ [${slug}]: Invalid date format "${value}" (expected YYYY-MM-DD)`);
      }
    }

    if (rules.maxLen) {
      if (value.length > rules.maxLen) {
        warnings.push(`⚠ [${slug}]: Field "${field}" exceeds max length ${rules.maxLen} (${value.length} chars)`);
      } else if (rules.warnAt && value.length > rules.warnAt) {
        warnings.push(`⚠ [${slug}]: Field "${field}" is ${value.length} chars (recommended max: ${rules.warnAt})`);
      }
    }
  }
}

// Count words in content
function countWords(content) {
  return content.trim().split(/\s+/).length;
}

// Validate word count
function validateWordCount(slug, content, warnings) {
  const wordCount = countWords(content);
  if (wordCount < 1500) {
    warnings.push(`⚠ [${slug}]: Word count ${wordCount} (minimum recommended: 1500)`);
  } else if (wordCount > 4000) {
    warnings.push(`⚠ [${slug}]: Word count ${wordCount} (maximum recommended: 4000)`);
  }
}

// Format date as readable string
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Format date as ISO for schema
function formatDateISO(dateStr) {
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0];
}

// Calculate read time
function readTime(content) {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

// Decode HTML entities in extracted text
function decodeEntities(text) {
  return text
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–');
}

// Extract FAQ pairs from HTML content (looks for H3 questions followed by paragraph answers)
function extractFAQPairs(htmlContent) {
  const pairs = [];
  // Match H3s that appear after an H2 containing "FAQ" or "Frequently Asked"
  const faqSectionMatch = htmlContent.match(/<h2[^>]*>.*?(?:FAQ|Frequently Asked).*?<\/h2>([\s\S]*?)(?=<h2|<hr|$)/i);
  if (!faqSectionMatch) return pairs;

  const faqSection = faqSectionMatch[1];
  const h3Regex = /<h3[^>]*>(.*?)<\/h3>([\s\S]*?)(?=<h3|$)/g;
  let match;
  while ((match = h3Regex.exec(faqSection)) !== null) {
    const question = decodeEntities(match[1].replace(/<[^>]+>/g, '').trim());
    // Get text content from the paragraphs following the H3
    const answerHtml = match[2];
    const answer = decodeEntities(answerHtml
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim());
    if (question && answer) {
      pairs.push({ question, answer });
    }
  }
  return pairs;
}

// Generate extra schema blocks (FAQPage + Speakable)
function generateExtraSchema(article, faqPairs) {
  const schemas = [];

  // FAQPage schema
  if (faqPairs.length > 0) {
    schemas.push(`<script type="application/ld+json">
    ${JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqPairs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    }, null, 6)}
    </script>`);
  }

  // Speakable schema
  if (article.speakable) {
    schemas.push(`<script type="application/ld+json">
    ${JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": [".article-header h1", ".article-description"]
      },
      "url": `https://zacharyvorsteg.com/blog/${article.slug}/`
    }, null, 6)}
    </script>`);
  }

  return schemas.length > 0 ? '\n    ' + schemas.join('\n\n    ') : '';
}

// Get related articles by pillar tag
function getRelatedArticles(articles, currentSlug, pillar, limit = 3) {
  return articles
    .filter(a => a.slug !== currentSlug && a.pillar === pillar)
    .slice(0, limit)
    .map(a => ({
      slug: a.slug,
      title: a.title,
      description: a.description,
      date: a.dateFormatted,
      pillar: a.pillar
    }));
}

// Check for broken internal links
function validateInternalLinks(slug, htmlContent, validSlugs, warnings) {
  const linkRegex = /href="\/blog\/([^/]+)\//g;
  let match;
  while ((match = linkRegex.exec(htmlContent)) !== null) {
    const linkedSlug = match[1];
    if (!validSlugs.has(linkedSlug)) {
      warnings.push(`⚠ [${slug}]: Broken internal link to /blog/${linkedSlug}/`);
    }
  }
}

// Generate RSS feed
function generateRSS(articles) {
  const items = articles
    .map(a => {
      const pubDate = new Date(a.dateStr);
      const rfc822Date = pubDate.toUTCString();
      const guid = `${SITE_URL}/blog/${a.slug}/`;
      const link = `${SITE_URL}/blog/${a.slug}/`;

      return `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${guid}</guid>
      <pubDate>${rfc822Date}</pubDate>
      <description>${escapeXml(a.description)}</description>
      <category>${escapeXml(a.pillar)}</category>
    </item>`;
    })
    .join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Zachary Vorsteg</title>
    <link>${SITE_URL}/blog/</link>
    <description>Insights on finance, real estate, automation, and building.</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/blog/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'feed.xml'), rss);
}

// Escape XML special characters
function escapeXml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Build all articles
function build() {
  if (!fs.existsSync(CONTENT_DIR)) {
    console.log('No blog-content directory found. Skipping build.');
    return { articles: [], warnings: [] };
  }

  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
  if (files.length === 0) {
    console.log('No markdown files found in blog-content. Skipping build.');
    return { articles: [], warnings: [] };
  }

  const articles = [];
  const warnings = [];

  files.forEach(file => {
    const content = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf-8');
    const { metadata, content: body } = parseFrontmatter(content);

    const slug = path.basename(file, '.md');
    const title = metadata.title || 'Untitled';
    const description = metadata.description || '';
    const keywords = metadata.keywords || '';
    const dateStr = metadata.date || new Date().toISOString().split('T')[0];
    const pillar = metadata.pillar || 'Finance';

    // Validate frontmatter
    validateFrontmatter(slug, metadata, warnings);

    // Validate word count
    validateWordCount(slug, body, warnings);

    const speakable = metadata.speakable || '';
    const dateFormatted = formatDate(dateStr);
    const dateISO = formatDateISO(dateStr);
    const readTimeStr = readTime(body);
    const htmlContent = marked(body);

    articles.push({
      slug,
      title,
      description,
      keywords,
      dateStr,
      dateFormatted,
      dateISO,
      pillar,
      speakable,
      readTime: readTimeStr,
      content: htmlContent
    });
  });

  // Sort by date descending
  articles.sort((a, b) => new Date(b.dateStr) - new Date(a.dateStr));

  // Build a set of valid slugs for link validation
  const validSlugs = new Set(articles.map(a => a.slug));

  // Read template
  const template = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

  // Generate article pages
  articles.forEach(article => {
    // Validate internal links
    validateInternalLinks(article.slug, article.content, validSlugs, warnings);

    const relatedArticles = getRelatedArticles(articles, article.slug, article.pillar);
    const relatedHtml = relatedArticles.length > 0
      ? relatedArticles
          .map(
            a => `
      <div class="related-card">
        <a href="/blog/${a.slug}/">
          <h4>${a.title}</h4>
          <p class="related-desc">${a.description}</p>
          <span class="related-meta">${a.date}</span>
        </a>
      </div>
    `
          )
          .join('')
      : '';

    const faqPairs = extractFAQPairs(article.content);
    const extraSchema = generateExtraSchema(article, faqPairs);

    const html = template
      .replace(/{{TITLE}}/g, article.title)
      .replace(/{{DESCRIPTION}}/g, article.description)
      .replace(/{{KEYWORDS}}/g, article.keywords)
      .replace(/{{SLUG}}/g, article.slug)
      .replace(/{{DATE}}/g, article.dateISO)
      .replace(/{{DATE_FORMATTED}}/g, article.dateFormatted)
      .replace(/{{CONTENT}}/g, article.content)
      .replace(/{{PILLAR}}/g, article.pillar)
      .replace(/{{READ_TIME}}/g, article.readTime)
      .replace(/{{RELATED_ARTICLES}}/g, relatedHtml)
      .replace(/{{EXTRA_SCHEMA}}/g, extraSchema);

    const articleDir = path.join(OUTPUT_DIR, article.slug);
    if (!fs.existsSync(articleDir)) fs.mkdirSync(articleDir, { recursive: true });
    fs.writeFileSync(path.join(articleDir, 'index.html'), html);
    console.log(`✓ ${article.slug}`);
  });

  return { articles, warnings };
}

// Generate blog index
function generateIndex(articles) {
  const indexTemplate = fs.readFileSync(INDEX_TEMPLATE_PATH, 'utf-8');

  const cardHtml = articles
    .map(
      a => `
    <article class="article-card fade-in">
      <span class="article-pillar">${a.pillar}</span>
      <h3><a href="/blog/${a.slug}/">${a.title}</a></h3>
      <p>${a.description}</p>
      <div class="article-meta">
        <time>${a.dateFormatted}</time>
        <span>${a.readTime}</span>
      </div>
    </article>
  `
    )
    .join('');

  const html = indexTemplate
    .replace('{{ARTICLE_CARDS}}', cardHtml)
    .replace('{{ARTICLE_COUNT}}', articles.length);

  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), html);
  console.log(`✓ Blog index (${articles.length} articles)`);
}

// Update sitemap
function updateSitemap(articles) {
  let sitemap = fs.existsSync(SITEMAP_PATH) ? fs.readFileSync(SITEMAP_PATH, 'utf-8') : '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n</urlset>';

  // Remove existing blog entries
  sitemap = sitemap.replace(/\s*<url>\s*<loc>https:\/\/zacharyvorsteg\.com\/blog\/[\s\S]*?<\/url>/g, '');

  const blogEntries = articles
    .map(
      a => `
  <url>
    <loc>${SITE_URL}/blog/${a.slug}/</loc>
    <lastmod>${a.dateISO}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join('');

  // Insert before closing tag
  sitemap = sitemap.replace('</urlset>', `${blogEntries}\n</urlset>`);
  fs.writeFileSync(SITEMAP_PATH, sitemap);
  console.log('✓ Sitemap updated');
}

// Main
console.log('Building blog...\n');
const { articles, warnings } = build();

if (articles.length > 0) {
  generateIndex(articles);
  updateSitemap(articles);
  generateRSS(articles);
  console.log('✓ RSS feed generated');

  if (warnings.length > 0) {
    console.log('\nWarnings:');
    warnings.forEach(w => console.log(w));
  }

  console.log(`\n✓ Blog built: ${articles.length} articles, ${warnings.length} warnings`);
} else {
  console.log('\n✓ No articles to build.');
}
