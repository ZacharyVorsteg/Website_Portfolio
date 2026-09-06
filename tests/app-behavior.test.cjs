const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

// Use the installed project-independent audit runtime; no production endpoint is contacted.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const app = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
const fixture = (minimal = false) => `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>
[hidden]{display:none!important} body{margin:0} header{height:70px} #contact{scroll-margin-top:80px;padding:20px} .mobile-menu{position:fixed;inset:0;background:white;z-index:5}.mobile-menu-content{padding:20px}.mobile-menu-content a{display:block;padding:16px}.spacer{height:900px} @media(min-width:1000px){.mobile-menu-btn{display:none}}
</style></head><body>${minimal ? '<main><h1>Minimal page</h1><a href="#">Empty anchor</a></main>' : `
<header><a href="#work">Work</a><button class="mobile-menu-btn">Menu</button></header>
<div class="mobile-menu" id="mobileMenu" hidden><div class="mobile-menu-content"><button class="mobile-menu-close">Close menu</button><nav><a href="#work">Selected work</a><a href="/?topic=production#contact">Production inquiry</a></nav></div></div>
<main><a id="software-link" href="/?topic=software#contact">Software inquiry</a><a id="invalid-link" href="#missing">Missing target</a><section id="work"><h2>Selected work</h2></section><div class="spacer"></div>
<section id="contact" tabindex="-1"><h2>Start a conversation</h2>
<form id="discoveryForm" name="contact" action="/index.html" method="POST" data-netlify="true"><input type="hidden" name="form-name" value="contact"><label>Name<input name="name" autocomplete="name"></label><label>Email<input name="email" type="email" required></label><details class="home-optional-details"><summary>Optional details</summary><label>Phone<input name="phone" type="tel"></label><label>Service<select name="service" id="service"><option value="">Not sure yet</option>${['ai','software','finance','real-estate','production','partnership','other'].map(v=>`<option value="${v}">${v}</option>`).join('')}</select></label></details><label>Message<textarea name="message" required></textarea></label><input name="bot-field" hidden tabindex="-1"><input name="source-page" type="hidden"><input name="source-offer" type="hidden"><input name="utm_source" type="hidden"><input name="utm_medium" type="hidden"><input name="utm_campaign" type="hidden"><button type="submit">Send request</button><div id="formStatus" role="status" aria-live="polite" tabindex="-1"></div></form></section><div class="spacer"></div></main>`}
<script src="/app.js" defer></script></body></html>`;
let browser, server, base;
const unexpectedRequests = [];
before(async () => {
    server = http.createServer((req, res) => {
        if (req.method !== 'GET') { unexpectedRequests.push(req.method + ' ' + req.url); res.writeHead(500); return res.end('Unmocked write refused'); }
        if (req.url === '/app.js') { res.setHeader('Content-Type', 'text/javascript; charset=utf-8'); return res.end(app); }
        res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.end(fixture(req.url.startsWith('/minimal') || req.url.startsWith('/about/')));
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    base = `http://127.0.0.1:${server.address().port}`;
    browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
});
after(async () => { await browser?.close(); await new Promise(resolve => server.close(resolve)); assert.deepEqual(unexpectedRequests, [], 'All writes must be locally mocked.'); });
async function makePage(options = {}) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, ...options });
    await context.route('**/*', route => {
        if (!route.request().url().startsWith(base + '/')) return route.abort();
        if (route.request().method() !== 'GET') return route.abort();
        return route.continue();
    });
    const page = await context.newPage();
    return { context, page };
}
async function completeRequired(page) {
    await page.locator('[name=email]').fill('audit@example.invalid');
    await page.locator('[name=message]').fill('Local mocked request; never sent to a live service.');
}

test('menu has names/state, traps focus, closes on Escape/nav/desktop, and restores scroll lock', async () => {
    const { context, page } = await makePage();
    await page.goto(base);
    assert.equal(await page.locator('body').evaluate(e => e.classList.contains('menu-ready')), true);
    assert.equal(await page.locator('#mobileMenu').isVisible(), false);
    await page.evaluate(() => { document.body.style.overflow = 'auto'; });
    await page.getByRole('button', { name: 'Open menu' }).click();
    assert.equal(await page.locator('.mobile-menu-btn').getAttribute('aria-expanded'), 'true');
    assert.equal(await page.evaluate(() => document.activeElement.className), 'mobile-menu-close');
    await page.keyboard.press('Shift+Tab');
    assert.equal(await page.evaluate(() => document.activeElement.textContent), 'Production inquiry');
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement.className), 'mobile-menu-close');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#mobileMenu').isVisible(), false);
    assert.equal(await page.evaluate(() => document.activeElement.className), 'mobile-menu-btn');
    assert.equal(await page.evaluate(() => document.body.style.overflow), 'auto');
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.getByRole('link', { name: 'Production inquiry' }).click();
    assert.equal(await page.locator('#mobileMenu').isVisible(), false);
    assert.equal(await page.locator('[name=service]').inputValue(), 'production');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'contact');
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.setViewportSize({ width: 1100, height: 844 });
    await page.locator('#mobileMenu').waitFor({ state: 'hidden' });
    assert.equal(await page.locator('#mobileMenu').isVisible(), false);
    assert.equal(await page.evaluate(() => document.body.style.overflow), 'auto');
    await context.close();
});

test('topic and source allowlists preserve intent without query/free-text leakage; anchors respect reduced motion', async () => {
    const { context, page } = await makePage({ reducedMotion: 'reduce' });
    await page.goto(base + '/?topic=ai&utm_source=portfolio&utm_campaign=fall-2026', { referer: base + '/production/?private_note=ignored' });
    assert.equal(await page.locator('[name=service]').inputValue(), 'ai');
    assert.equal(await page.locator('[name=source-offer]').inputValue(), 'ai');
    assert.equal(await page.locator('details.home-optional-details').evaluate(e => e.open), true);
    assert.equal(await page.locator('[name=source-page]').inputValue(), '/production/');
    assert.equal(await page.locator('[name=utm_source]').inputValue(), 'portfolio');
    await page.evaluate(() => { window.__scrollOptions = []; Element.prototype.scrollIntoView = function(options) { window.__scrollOptions.push(options); }; });
    await page.locator('#software-link').click();
    assert.equal(new URL(page.url()).search, '?topic=software');
    assert.equal(new URL(page.url()).hash, '#contact');
    assert.equal(await page.locator('[name=service]').inputValue(), 'software');
    assert.equal(await page.locator('[name=source-offer]').inputValue(), 'software');
    assert.equal(await page.locator('[name=utm_campaign]').inputValue(), 'fall-2026');
    assert.equal(await page.evaluate(() => window.__scrollOptions.at(-1).behavior), 'instant');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'contact');
    await page.goto(base + '/?topic=unlisted&utm_source=person%40example.invalid');
    assert.equal(await page.locator('[name=service]').inputValue(), '');
    assert.equal(await page.locator('[name=source-offer]').inputValue(), '');
    assert.equal(await page.locator('details.home-optional-details').evaluate(e => e.open), false);
    assert.equal(await page.locator('[name=utm_source]').inputValue(), 'portfolio'); // Invalid/later input cannot replace the first safe campaign.
    await context.close();
});

test('HTTP failure retains fields and presents a persistent alert; retry sends the complete native form contract', async () => {
    const { context, page } = await makePage();
    let attempts = 0, posted;
    await context.route(base + '/index.html', route => {
        if (route.request().method() !== 'POST') return route.continue();
        attempts++; posted = new URLSearchParams(route.request().postData());
        return route.fulfill({ status: attempts === 1 ? 503 : 200, contentType: 'text/html', body: attempts === 1 ? 'Local failure' : 'Local transport acknowledgement' });
    });
    await page.goto(base + '/?topic=finance&utm_medium=referral');
    await completeRequired(page);
    await page.locator('[name=name]').fill('Local audit');
    await page.getByRole('button', { name: 'Send request' }).click();
    await page.getByRole('alert').waitFor();
    assert.match(await page.locator('#formStatus').textContent(), /couldn’t confirm/);
    assert.equal(await page.locator('[name=email]').inputValue(), 'audit@example.invalid');
    assert.equal(await page.locator('[name=service]').inputValue(), 'finance');
    assert.equal(await page.getByRole('button', { name: 'Send request' }).isEnabled(), true);
    assert.equal(await page.evaluate(() => document.activeElement.id), 'formStatus');
    await page.waitForTimeout(100);
    assert.equal(await page.getByRole('alert').isVisible(), true);
    await page.getByRole('button', { name: 'Send request' }).click();
    await page.waitForFunction(() => document.querySelector('#discoveryForm').hidden);
    assert.equal(attempts, 2);
    assert.equal(posted.get('form-name'), 'contact');
    assert.equal(posted.get('source-offer'), 'finance');
    assert.equal(posted.get('service'), 'finance');
    assert.equal(posted.get('utm_medium'), 'referral');
    assert.equal(posted.get('phone'), '');
    assert.equal(posted.get('bot-field'), '');
    assert.match(await page.locator('#formStatus').textContent(), /one business day/);
    assert.match(await page.locator('#formStatus').textContent(), /not a scheduled appointment/);
    assert.equal(await page.evaluate(() => document.activeElement.id), 'formStatus');
    assert.equal(new URL(page.url()).search.includes('audit'), false);
    await context.close();
});

test('pending and successful submissions cannot be duplicated', async () => {
    const { context, page } = await makePage();
    let attempts = 0, release;
    const pendingResponse = new Promise(resolve => { release = resolve; });
    await context.route(base + '/index.html', async route => {
        if (route.request().method() !== 'POST') return route.continue();
        attempts++; await pendingResponse;
        await route.fulfill({ status: 200, body: 'Local acknowledgement' });
    });
    await page.goto(base); await completeRequired(page);
    await page.evaluate(() => { const f = document.querySelector('form'); f.requestSubmit(); f.requestSubmit(); });
    await page.waitForFunction(() => document.querySelector('form').getAttribute('aria-busy') === 'true');
    assert.equal(await page.getByRole('button', { name: 'Sending request…' }).isDisabled(), true);
    await page.waitForTimeout(100);
    assert.equal(attempts, 1);
    release();
    await page.waitForFunction(() => document.querySelector('form').hidden);
    await page.evaluate(() => document.querySelector('form').dispatchEvent(new Event('submit', { cancelable: true })));
    assert.equal(attempts, 1);
    await context.close();
});

test('network failure is recoverable; missing menus/forms do not crash initialization', async () => {
    const { context, page } = await makePage(); const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await context.route(base + '/index.html', route => route.abort('failed'));
    await page.goto(base); await completeRequired(page);
    await page.getByRole('button', { name: 'Send request' }).click();
    await page.getByRole('alert').waitFor();
    assert.equal(await page.locator('[name=message]').inputValue(), 'Local mocked request; never sent to a live service.');
    assert.equal(await page.getByRole('button', { name: 'Send request' }).isEnabled(), true);
    await page.goto(base + '/minimal');
    await page.getByRole('link', { name: 'Empty anchor' }).click();
    assert.deepEqual(errors, []);
    assert.equal(await page.locator('body').evaluate(e => e.classList.contains('menu-ready')), false);
    await context.close();
});

test('native Netlify fallback remains available without JavaScript', async () => {
    const { context, page } = await makePage({ javaScriptEnabled: false });
    await page.goto(base);
    assert.equal(await page.locator('form').getAttribute('method'), 'POST');
    assert.equal(await page.locator('form').getAttribute('action'), '/index.html');
    assert.equal(await page.locator('[name=form-name]').inputValue(), 'contact');
    assert.equal(await page.locator('[name=phone]').getAttribute('required'), null);
    assert.equal(await page.getByRole('button', { name: 'Send request' }).isVisible(), true);
    assert.equal(await page.getByRole('heading', { name: 'Start a conversation' }).count(), 1);
    await context.close();
});


test('first safe campaign survives form-free About navigation and reaches the contact payload', async () => {
    const { context, page } = await makePage();
    let posted;
    await context.route(base + '/index.html', route => {
        if (route.request().method() !== 'POST') return route.continue();
        posted = new URLSearchParams(route.request().postData());
        return route.fulfill({ status: 200, body: 'Local acknowledgement' });
    });
    await page.goto(base + '/?utm_source=example&utm_medium=referral&utm_campaign=fall-2026');
    await page.goto(base + '/about/');
    assert.equal(await page.locator('form').count(), 0);
    // A later internal campaign does not replace the original acquisition context.
    await page.goto(base + '/about/?utm_source=later');
    await page.goto(base + '/?topic=software#contact');
    assert.equal(await page.locator('[name=utm_source]').inputValue(), 'example');
    assert.equal(await page.locator('[name=utm_medium]').inputValue(), 'referral');
    assert.equal(await page.locator('[name=utm_campaign]').inputValue(), 'fall-2026');
    await completeRequired(page);
    await page.getByRole('button', { name: 'Send request' }).click();
    await page.waitForFunction(() => document.querySelector('form').hidden);
    assert.equal(posted.get('utm_source'), 'example');
    assert.equal(posted.get('utm_medium'), 'referral');
    assert.equal(posted.get('utm_campaign'), 'fall-2026');
    assert.equal(posted.get('source-offer'), 'software');
    const stored = await page.evaluate(() => JSON.parse(sessionStorage.getItem('zv-campaign-attribution-v1')));
    assert.deepEqual(stored, { utm_source: 'example', utm_medium: 'referral', utm_campaign: 'fall-2026' });
    await context.close();
});

test('denied session storage cannot break navigation or inquiry submission', async () => {
    const { context, page } = await makePage();
    const errors = []; let attempts = 0;
    page.on('pageerror', error => errors.push(error.message));
    await context.addInitScript(() => {
        Object.defineProperty(window, 'sessionStorage', { get() { throw new DOMException('Storage denied', 'SecurityError'); } });
    });
    await context.route(base + '/index.html', route => {
        if (route.request().method() !== 'POST') return route.continue();
        attempts++;
        return route.fulfill({ status: 200, body: 'Local acknowledgement' });
    });
    await page.goto(base + '/?utm_source=example');
    assert.equal(await page.locator('[name=utm_source]').inputValue(), 'example');
    await page.goto(base + '/about/');
    await page.goto(base + '/?topic=partnership#contact');
    assert.equal(await page.locator('[name=utm_source]').inputValue(), '');
    assert.equal(await page.locator('[name=service]').inputValue(), 'partnership');
    await completeRequired(page);
    await page.getByRole('button', { name: 'Send request' }).click();
    await page.waitForFunction(() => document.querySelector('form').hidden);
    assert.equal(attempts, 1);
    assert.deepEqual(errors, []);
    await context.close();
});

test('session records are revalidated and contain only the fixed campaign keys', async () => {
    const { context, page } = await makePage();
    await page.goto(base);
    await page.evaluate(() => sessionStorage.setItem('zv-campaign-attribution-v1', JSON.stringify({
        utm_source: 'person@example.invalid', utm_medium: 'referral',
        utm_campaign: 'https://example.invalid/?private=ignored', raw_referrer: 'ignored'
    })));
    await page.goto(base + '/about/');
    await page.goto(base + '/#contact');
    assert.equal(await page.locator('[name=utm_source]').inputValue(), '');
    assert.equal(await page.locator('[name=utm_medium]').inputValue(), 'referral');
    assert.equal(await page.locator('[name=utm_campaign]').inputValue(), '');
    const stored = await page.evaluate(() => JSON.parse(sessionStorage.getItem('zv-campaign-attribution-v1')));
    assert.deepEqual(stored, { utm_source: '', utm_medium: 'referral', utm_campaign: '' });
    await page.evaluate(() => sessionStorage.setItem('zv-campaign-attribution-v1', JSON.stringify({ utm_source: 'person@example.invalid', raw_query: 'ignored' })));
    await page.goto(base + '/about/');
    assert.equal(await page.evaluate(() => sessionStorage.getItem('zv-campaign-attribution-v1')), null);
    await context.close();
});
