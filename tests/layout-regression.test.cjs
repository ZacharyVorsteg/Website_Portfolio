const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

// Serve the actual checked-out pages and styles. No production request or form submission is permitted.
const root = path.resolve(__dirname, '..');
const mime = {
    '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8', '.json': 'application/json',
    '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2',
    '.mp4': 'video/mp4', '.vtt': 'text/vtt'
};
let browser, server, base;
const attemptedWrites = [];

before(async () => {
    server = http.createServer((req, res) => {
        if (!['GET', 'HEAD'].includes(req.method)) {
            attemptedWrites.push(`${req.method} ${req.url}`);
            res.writeHead(405); return res.end('Writes are disabled in layout tests.');
        }
        let filename;
        try {
            const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
            filename = path.resolve(root, `.${pathname}`);
        } catch (_) { res.writeHead(400); return res.end(); }
        if (filename !== root && !filename.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
        try {
            if (fs.statSync(filename).isDirectory()) filename = path.join(filename, 'index.html');
            const content = fs.readFileSync(filename);
            res.writeHead(200, { 'Content-Type': mime[path.extname(filename)] || 'application/octet-stream' });
            return res.end(req.method === 'HEAD' ? undefined : content);
        } catch (_) { res.writeHead(404); return res.end('Not found'); }
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    base = `http://127.0.0.1:${server.address().port}`;
    browser = await chromium.launch({
        headless: true,
        executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    });
});

after(async () => {
    await browser?.close();
    if (server) await new Promise(resolve => server.close(resolve));
    assert.deepEqual(attemptedWrites, [], 'Layout checks must never attempt a write.');
});

async function openPage(t, width, height = 844, route = '/') {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
    t.after(() => context.close());
    await context.route('**/*', requestRoute => {
        const request = requestRoute.request();
        if (!['GET', 'HEAD'].includes(request.method())) {
            attemptedWrites.push(`${request.method()} ${new URL(request.url()).pathname}`);
            return requestRoute.abort();
        }
        if (new URL(request.url()).origin !== base) return requestRoute.abort();
        return requestRoute.continue();
    });
    const page = await context.newPage();
    page.setDefaultTimeout(10000);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    t.after(() => assert.deepEqual(errors, [], `No uncaught page errors on ${route} at ${width}px`));
    const response = await page.goto(base + route, { waitUntil: 'load' });
    assert.equal(response.status(), 200, `Local page exists: ${route}`);
    await page.waitForFunction(() => document.body.classList.contains('menu-ready'));
    // Readiness classes can precede the style/layout update. Measure only after two animation frames allow styles to settle.
    await page.evaluate(async () => {
        await document.fonts.ready;
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    });
    return page;
}

async function assertNoOverflow(page, label) {
    const sizes = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
    assert.ok(sizes.document <= sizes.viewport + 1, `${label}: document ${sizes.document}px exceeds viewport ${sizes.viewport}px`);
}

test('the hero CTA does not jump at the 639/640px breakpoint', async t => {
    const measurements = [];
    for (const width of [639, 640]) {
        const page = await openPage(t, width, 800);
        const box = await page.locator('.home-actions a[href="#contact"]').boundingBox();
        assert.ok(box && box.width > 0 && box.height > 0, `Primary CTA is rendered at ${width}px`);
        measurements.push({ width, top: box.y });
        await assertNoOverflow(page, `${width}px hero`);
    }
    const jump = Math.abs(measurements[1].top - measurements[0].top);
    assert.ok(jump <= 40, `A 1px viewport change moved the CTA ${jump.toFixed(2)}px: ${JSON.stringify(measurements)}`);
});

test('mobile primary CTA exposes the message field and focuses contact before the venture directory', async t => {
    const page = await openPage(t, 390, 844);
    const order = await page.evaluate(() => {
        const contact = document.getElementById('contact');
        const ventures = document.getElementById('ventures');
        return Boolean(contact && ventures && (contact.compareDocumentPosition(ventures) & Node.DOCUMENT_POSITION_FOLLOWING));
    });
    assert.equal(order, true, 'Contact must precede the venture directory in document order.');
    const contactPosition = await page.locator('#contact').boundingBox();
    const venturePosition = await page.locator('#ventures').boundingBox();
    assert.ok(contactPosition.y < venturePosition.y, 'Contact must also precede ventures in the rendered layout.');
    await page.locator('.home-actions a[href="#contact"]').click();
    await page.waitForFunction(() => document.activeElement.id === 'contact');
    assert.equal(new URL(page.url()).hash, '#contact');
    const message = await page.locator('#message').boundingBox();
    const label = await page.locator('label[for="message"]').boundingBox();
    const header = await page.locator('header').boundingBox();
    assert.ok(label.y >= header.y + header.height, 'The message label must not be obscured by the fixed header.');
    assert.ok(message.y < 844, `Message field starts at ${message.y.toFixed(2)}px, outside the initial contact viewport.`);
    assert.ok(message.y + Math.min(message.height, 48) <= 844, 'The landing must expose an actionable portion of the message field.');
    t.diagnostic(`390px contact landing: message starts at ${message.y.toFixed(2)}px; focus is #contact.`);
    const form = await page.locator('#discoveryForm').boundingBox();
    const support = await page.locator('.home-contact-support').boundingBox();
    assert.ok(support.y >= form.y + form.height - 1, 'Mobile response/direct-contact support follows the form.');
    await assertNoOverflow(page, '390px contact landing');
});

test('peer card CTA baselines stay aligned whenever cards share a row', async t => {
    for (const width of [640, 768, 900, 1000, 1200, 1440]) {
        await t.test(`${width}px card rows`, async rowTest => {
            const page = await openPage(rowTest, width, 900);
            for (const selector of ['.home-supporting-work > article', '.home-outcomes > article']) {
                const cards = await page.locator(selector).evaluateAll(elements => elements.map(element => {
                    const box = element.getBoundingClientRect();
                    const link = element.querySelector('a.home-text-link');
                    const linkBox = link?.getBoundingClientRect();
                    return { top: box.top, linkBottom: linkBox?.bottom, text: link?.textContent.trim() };
                }));
                assert.ok(cards.length >= 2, `Expected peer cards for ${selector}`);
                const rows = [];
                for (const card of cards) {
                    assert.ok(Number.isFinite(card.linkBottom), `Each card needs its next-action link: ${selector}`);
                    const existing = rows.find(row => Math.abs(row[0].top - card.top) <= 2);
                    if (existing) existing.push(card); else rows.push([card]);
                }
                for (const row of rows.filter(items => items.length > 1)) {
                    const difference = Math.max(...row.map(card => card.linkBottom)) - Math.min(...row.map(card => card.linkBottom));
                    assert.ok(difference <= 2, `${width}px ${selector} CTA bottoms differ by ${difference.toFixed(2)}px: ${JSON.stringify(row)}`);
                }
            }
            await assertNoOverflow(page, `${width}px card rows`);
        });
    }
});

test('home, About, blog, and production share usable header/footer layouts', async t => {
    for (const width of [390, 1000]) {
        const headerHeights = [];
        for (const route of ['/', '/about/', '/blog/', '/production/']) {
            await t.test(`${route} at ${width}px`, async routeTest => {
                const page = await openPage(routeTest, width, 844, route);
                const header = page.locator('header.site-header');
                assert.equal(await header.count(), 1, 'Exactly one shared header is present.');
                const box = await header.boundingBox();
                assert.ok(box && box.height > 0, 'Shared header is rendered.');
                headerHeights.push({ route, height: box.height });
                await assertNoOverflow(page, `${route} ${width}px at page top`);
                if (width < 1000) {
                    await page.getByRole('button', { name: 'Open menu', exact: true }).click();
                    assert.equal(await page.locator('#mobileMenu').isVisible(), true);
                    await page.keyboard.press('Escape');
                    assert.equal(await page.locator('#mobileMenu').isVisible(), false);
                    assert.equal(await page.evaluate(() => document.activeElement.classList.contains('mobile-menu-btn')), true);
                } else {
                    const logoBox = await header.locator('.logo').boundingBox();
                    const navigation = await header.locator('.desktop-nav').boundingBox();
                    assert.ok(navigation.x >= logoBox.x + logoBox.width, 'Desktop navigation must not overlap the identity block.');
                    const links = await header.locator('.desktop-nav a').evaluateAll(elements => elements.map(element => {
                        const rect = element.getBoundingClientRect();
                        return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
                    }));
                    for (let index = 0; index < links.length; index++) {
                        const link = links[index];
                        assert.ok(link.left >= 0 && link.right <= width + 1, 'Desktop navigation link fits the viewport.');
                        assert.ok(link.top >= box.y - 1 && link.bottom <= box.y + box.height + 1, 'Desktop navigation link fits the header vertically.');
                        if (index) assert.ok(link.left >= links[index - 1].right - 1, 'Desktop navigation links must not overlap.');
                    }
                }
                const footer = page.locator('footer.home-footer');
                assert.equal(await footer.count(), 1, 'Exactly one shared footer is present.');
                await footer.scrollIntoViewIfNeeded();
                for (const destination of ['/about/', '/blog/', '/production/']) {
                    assert.equal(await footer.locator(`a[href="${destination}"]`).count(), 1, `Footer keeps ${destination} reachable.`);
                }
                assert.equal(await footer.locator('a.logo[href="/"]').count(), 1, 'Footer identity returns home.');
                const contactURL = new URL(await footer.getByRole('link', { name: "Let's talk", exact: true }).getAttribute('href'), page.url());
                assert.equal(contactURL.origin, base, 'Footer conversation stays on this site.');
                assert.equal(contactURL.hash, '#contact', 'Footer conversation link targets contact.');
                assert.ok(contactURL.pathname === '/' || contactURL.pathname === '/index.html', 'Footer conversation returns to the homepage form.');
                await assertNoOverflow(page, `${route} ${width}px at footer`);
                const scrolledHeader = await header.boundingBox();
                assert.ok(Math.abs(scrolledHeader.height - box.height) <= 1, 'Header height stays stable when scrolled.');
            });
        }
        const spread = Math.max(...headerHeights.map(item => item.height)) - Math.min(...headerHeights.map(item => item.height));
        assert.ok(spread <= 1, `Shared header heights differ at ${width}px: ${JSON.stringify(headerHeights)}`);
    }
});
