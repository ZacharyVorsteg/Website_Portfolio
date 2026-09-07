'use strict';

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

// Actual local pages and browser behavior; never allow a remote request or a server write.
const root = path.resolve(__dirname, '..');
const STORE = 'zv-proforma-v4', LEGACY = 'proforma-v3';
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css', '.json': 'application/json', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };
let browser, server, base;
const writeAttempts = [];

before(async () => {
  server = http.createServer((req, res) => {
    if (!['GET', 'HEAD'].includes(req.method)) { writeAttempts.push(req.method); res.writeHead(405); return res.end(); }
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      let filename = path.resolve(root, '.' + pathname);
      if (filename !== root && !filename.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
      if (fs.statSync(filename).isDirectory()) filename = path.join(filename, 'index.html');
      const bytes = fs.readFileSync(filename);
      res.writeHead(200, { 'Content-Type': mime[path.extname(filename)] || 'application/octet-stream' });
      res.end(req.method === 'HEAD' ? undefined : bytes);
    } catch { res.writeHead(404); res.end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
});

after(async () => {
  await browser?.close();
  if (server) await new Promise(resolve => server.close(resolve));
  assert.deepEqual(writeAttempts, [], 'Calculator interactions must not attempt a server write');
});

async function open(t, { width = 1440, init, initData, javaScriptEnabled = true, route = '/proforma.html' } = {}) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce', acceptDownloads: true, serviceWorkers: 'block', javaScriptEnabled });
  const errors = [];
  t.after(async () => { await context.close(); assert.deepEqual(errors, [], 'No uncaught browser errors'); });
  await context.route('**/*', route => {
    const request = route.request(), url = new URL(request.url());
    if (!['GET', 'HEAD'].includes(request.method())) { writeAttempts.push(request.method()); return route.abort(); }
    if (url.origin !== base || /\/(?:\.netlify\/functions|api|telemetry|collect)(?:\/|$)/.test(url.pathname)) return route.abort();
    return route.continue();
  });
  if (init) await context.addInitScript(init, initData);
  const page = await context.newPage();
  page.setDefaultTimeout(8000);
  page.on('pageerror', error => errors.push(error.message));
  const response = await page.goto(base + route, { waitUntil: 'load' });
  assert.equal(response.status(), 200);
  if (javaScriptEnabled && route === '/proforma.html') await ready(page);
  if (javaScriptEnabled) await page.evaluate(async () => { await document.fonts.ready; await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); });
  return page;
}
async function ready(page) { await page.locator('#proforma-tool[data-ready="true"]').waitFor(); }
async function text(page, selector) { return (await page.locator(selector).textContent()).trim(); }
async function exportFile(page) {
  const event = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Save scenario' }).click();
  const download = await event;
  assert.match(download.suggestedFilename(), /^proforma-[a-z0-9_-]*\.json$/i);
  assert.equal(await download.failure(), null);
  const chunks = [];
  for await (const chunk of await download.createReadStream()) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
async function importFile(page, value, raw = false) {
  await page.evaluate(() => {
    window.__testImportSettled = new Promise(resolve => {
      const node = document.getElementById('tool-status');
      const observer = new MutationObserver(() => { observer.disconnect(); resolve(); });
      observer.observe(node, { childList: true, characterData: true, subtree: true });
    });
  });
  await page.locator('#import-file').setInputFiles({ name: 'synthetic-scenario.json', mimeType: 'application/json', buffer: Buffer.from(raw ? value : JSON.stringify(value)) });
  await page.evaluate(() => window.__testImportSettled);
  assert.match(await text(page, '#tool-status'), /Scenario opened|not a supported|smaller than/);
}
async function row(page, year) { return page.locator('#projection-rows tr').nth(year - 1).locator('td').allTextContents(); }
async function noOverflow(page, label) {
  const size = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
  assert.ok(size.document <= size.viewport + 1, `${label}: document ${size.document}px exceeds ${size.viewport}px`);
}

test('default example exposes independently checked annual results and exactly five operating years', async t => {
  const page = await open(t);
  assert.equal(await text(page, '#summary-cashflow'), '$17,389');
  assert.equal(await text(page, '#summary-coc'), '12.88%');
  assert.equal(await text(page, '#summary-cap'), '9.91%');
  assert.equal(await text(page, '#summary-dscr'), '1.65×');
  assert.equal(await text(page, '[data-result="monthlyMortgage"]'), '$2,495');
  assert.equal(await page.locator('#projection-rows tr').count(), 5);
  assert.deepEqual((await row(page, 1)).slice(0, 6), ['$68,400', '$18,872', '$49,528', '$2,200', '$29,939', '$17,389']);
  assert.match(await text(page, '#scenario-kind'), /Illustrative example/);
  assert.equal(await page.locator('#remember-scenario').isChecked(), false);
  assert.equal(await page.evaluate(key => localStorage.getItem(key), STORE), null);
});

test('editing 0% financing still pays principal, and a cash deal shows No debt', async t => {
  const page = await open(t);
  await page.getByLabel('Annual interest rate', { exact: true }).fill('0');
  assert.equal(await text(page, '[data-result="monthlyMortgage"]'), '$1,042');
  assert.equal((await row(page, 1))[4], '$12,500');
  assert.equal(await text(page, '#summary-cashflow'), '$34,828');
  await page.getByLabel('Down payment', { exact: true }).fill('100');
  await page.getByLabel('Amortization term', { exact: true }).fill('0');
  assert.equal(await text(page, '#summary-dscr'), 'No debt');
  assert.equal(await text(page, '[data-result="monthlyMortgage"]'), '$0');
  assert.equal(await text(page, '#summary-cashflow'), '$47,328');
  assert.ok((await row(page, 5)).slice(4).includes('$0'));
});

test('fixed management remains in year-two operating expenses', async t => {
  const page = await open(t);
  for (let index = 0; index < 4; index++) await page.locator(`#unit-${index}-rent`).fill(index ? '0' : '2000');
  for (const key of ['vacancyPct', 'insurance', 'repairsMaintenance', 'utilities', 'trash', 'landscaping']) await page.locator('#' + key).fill('0');
  await page.getByLabel('Property taxes / year', { exact: true }).fill('3600');
  await page.getByLabel('Management fee basis', { exact: true }).selectOption('fixed');
  assert.equal(await page.locator('#managementPct').isDisabled(), true);
  await page.getByLabel('Management fee / year', { exact: true }).fill('1200');
  assert.deepEqual((await row(page, 1)).slice(0, 3), ['$24,000', '$4,800', '$19,200']);
  assert.deepEqual((await row(page, 2)).slice(0, 3), ['$24,720', '$4,896', '$19,824']);
});

test('blank and out-of-range active assumptions invalidate all results then recover with linked errors', async t => {
  const page = await open(t);
  for (const value of ['', '-1', '1000000000001']) {
    await page.locator('#purchasePrice').fill(value);
    assert.equal(await text(page, '#summary-cashflow'), '—');
    assert.equal(await page.locator('#validation-summary').isVisible(), true);
    assert.equal(await page.locator('#purchasePrice').getAttribute('aria-invalid'), 'true');
    assert.equal(await page.locator('#export-scenario').isDisabled(), true);
    assert.equal(await page.locator('#print-scenario').isDisabled(), true);
    assert.match(await text(page, '#projection-rows'), /Correct the marked assumptions/);
    await page.locator('#validation-summary a[href="#purchasePrice"]').click();
    assert.equal(await page.evaluate(() => document.activeElement.id), 'purchasePrice');
    await page.locator('#purchasePrice').fill('500000');
    assert.equal(await text(page, '#summary-cashflow'), '$17,389');
    assert.equal(await page.locator('#validation-summary').isVisible(), false);
    assert.equal(await page.locator('#export-scenario').isEnabled(), true);
  }
});

test('switching fee basis preserves invalid drafts but ignores inactive alternatives with an export warning', async t => {
  const page = await open(t);
  for (const [mode, active, invalidField, alternative] of [['managementMode', 'percent', 'managementPct', 'fixed'], ['leaseCommissionsMode', 'percent', 'leaseCommissionsPct', 'fixed'], ['tenantImprovementsMode', 'psf', 'tenantImprovementsPSF', 'fixed']]) {
    await page.locator('#' + mode).selectOption(active);
    await page.locator('#' + invalidField).fill('-1');
    assert.equal(await text(page, '#summary-cashflow'), '—');
    await page.locator('#' + mode).selectOption(alternative);
    assert.notEqual(await text(page, '#summary-cashflow'), '—');
    assert.equal(await page.locator('#' + invalidField).isDisabled(), true);
    assert.equal(await page.locator('#' + invalidField).inputValue(), '-1');
    assert.match(await text(page, '#model-warnings'), /unused.*invalid.*ignored/i);
    assert.equal((await exportFile(page)).data[invalidField], 0);
    await page.locator('#' + mode).selectOption(active);
    assert.equal(await page.locator('#' + invalidField).inputValue(), '-1');
    assert.equal(await text(page, '#summary-cashflow'), '—');
    await page.locator('#' + invalidField).fill('0');
  }
});

test('add/remove rent rows retains existing input and predictable keyboard focus', async t => {
  const page = await open(t, { width: 390 });
  await page.locator('#unit-0-unitNumber').fill('Synthetic unit A');
  await page.getByRole('button', { name: 'Add a unit' }).click();
  assert.equal(await page.locator('.rent-unit').count(), 5);
  assert.equal(await page.evaluate(() => document.activeElement.id), 'unit-4-unitNumber');
  assert.equal(await page.locator('#unit-4-rent').inputValue(), '0');
  assert.equal(await text(page, '#summary-cashflow'), '$17,389');
  await page.locator('#unit-4-unitNumber').fill('Synthetic unit E');
  await page.getByRole('button', { name: 'Remove unit 2', exact: true }).click();
  assert.equal(await page.locator('.rent-unit').count(), 4);
  assert.equal(await page.evaluate(() => document.activeElement.id), 'unit-1-unitNumber');
  assert.equal(await page.locator('#unit-0-unitNumber').inputValue(), 'Synthetic unit A');
  assert.equal(await page.locator('#unit-3-unitNumber').inputValue(), 'Synthetic unit E');
  while (await page.locator('.rent-unit').count() > 1) await page.getByRole('button', { name: 'Remove unit 1', exact: true }).click();
  assert.equal(await page.getByRole('button', { name: 'Remove unit 1', exact: true }).isDisabled(), true);
});

test('malicious text stays inert through render, save, import and print', async t => {
  const page = await open(t);
  const injection = '<img src=x onerror="window.__injected=1">';
  await page.locator('#propertyName').fill(injection);
  await page.locator('#propertyAddress').fill('<script>window.__injected=2</script>');
  await page.locator('#unit-0-tenant').fill(injection);
  await page.getByRole('button', { name: 'Add a unit' }).click();
  const saved = await exportFile(page);
  assert.equal(saved.data.propertyName, injection);
  assert.equal(saved.data.units[0].tenant, injection);
  await importFile(page, saved);
  assert.equal(await page.locator('#propertyName').inputValue(), injection);
  await page.evaluate(() => dispatchEvent(new Event('beforeprint')));
  assert.match(await text(page, '#print-scenario-title'), /<img src=x/);
  assert.equal(await page.locator('#print-scenario-title img, #rent-roll img').count(), 0);
  assert.equal(await page.evaluate(() => window.__injected), undefined);
  await page.evaluate(() => dispatchEvent(new Event('afterprint')));
});

test('v3 import migrates recurring modes and v4 export/import preserves the full scenario', async t => {
  const page = await open(t);
  const legacy = (await exportFile(page)).data;
  delete legacy.schemaVersion;
  for (const key of ['managementMode', 'leaseCommissionsMode', 'tenantImprovementsMode', 'leaseCommissionsTiming', 'tenantImprovementsTiming']) delete legacy[key];
  Object.assign(legacy, { propertyName: 'Synthetic legacy fixture', managementPct: 0, management: 1200, leaseCommissions: 350, leaseCommissionsPct: 0, tenantImprovements: 900, tenantImprovementsPSF: 0, reserves: 1200, capitalReserves: 1000 });
  await importFile(page, { version: '3.0', data: legacy });
  assert.equal(await page.locator('#managementMode').inputValue(), 'fixed');
  assert.equal(await page.locator('#leaseCommissionsTiming').inputValue(), 'annual');
  assert.equal(await page.locator('#tenantImprovementsTiming').inputValue(), 'annual');
  assert.match(await text(page, '#model-warnings'), /Legacy inputs were migrated/);
  assert.equal(await page.locator('#reserves').inputValue(), '1200');
  const saved = await exportFile(page);
  assert.equal(saved.version, '4.0');
  assert.equal(saved.data.schemaVersion, 4);
  assert.equal(saved.data.leaseCommissions, 350);
  const summary = await text(page, '#summary-cashflow');
  await page.locator('#purchasePrice').fill('700000');
  await importFile(page, saved);
  assert.equal(await text(page, '#summary-cashflow'), summary);
  assert.deepEqual((await exportFile(page)).data, saved.data);
});

test('invalid, unrelated, oversized and future-version files do not replace the open scenario', async t => {
  const page = await open(t);
  await page.locator('#propertyName').fill('Keep this synthetic scenario');
  const before = await exportFile(page);
  const samples = ['not json', JSON.stringify({ harmless: true }), JSON.stringify({ version: '99', data: before.data }), JSON.stringify({ ...before, data: { ...before.data, purchasePrice: -1 } }), ' '.repeat(1024 * 1024 + 1)];
  for (const raw of samples) {
    await importFile(page, raw, true);
    assert.match(await text(page, '#tool-status'), /current scenario has not changed/);
    assert.equal(await page.locator('#propertyName').inputValue(), before.data.propertyName);
    assert.deepEqual((await exportFile(page)).data, before.data);
  }
});

test('denied storage still permits calculation and scenario downloads', async t => {
  const page = await open(t, { init: () => { Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Synthetic denial', 'SecurityError'); } }); } });
  assert.equal(await page.locator('#remember-scenario').isDisabled(), true);
  assert.match(await text(page, '#tool-status'), /storage is unavailable/);
  await page.locator('#interestRate').fill('0');
  assert.equal(await text(page, '[data-result="monthlyMortgage"]'), '$1,042');
  assert.equal((await exportFile(page)).data.interestRate, 0);
});

test('malformed stored JSON remains untouched and cannot break calculation', async t => {
  const page = await open(t, { init: key => localStorage.setItem(key, '{malformed synthetic JSON'), initData: STORE });
  assert.match(await text(page, '#tool-status'), /could not be opened/);
  assert.equal(await text(page, '#summary-cashflow'), '$17,389');
  assert.equal(await page.evaluate(key => localStorage.getItem(key), STORE), '{malformed synthetic JSON');
  await page.locator('#purchasePrice').fill('450000');
  assert.equal(await page.evaluate(key => localStorage.getItem(key), STORE), '{malformed synthetic JSON');
});

test('quota failures disclose failed saving without losing the open scenario', async t => {
  const page = await open(t, { init: () => { Storage.prototype.setItem = function () { throw new DOMException('Synthetic quota limit', 'QuotaExceededError'); }; } });
  await page.locator('#propertyName').fill('Synthetic quota fixture');
  await page.getByLabel('Remember on this device', { exact: true }).click();
  assert.equal(await page.locator('#remember-scenario').isChecked(), false);
  assert.match(await text(page, '#tool-status'), /could not save/);
  assert.equal((await exportFile(page)).data.propertyName, 'Synthetic quota fixture');
});

test('opt-in persistence round-trips, rejects invalid edits, and unchecking removes only owned keys', async t => {
  const page = await open(t);
  await page.evaluate(({ legacy }) => { localStorage.setItem('unrelated-test-key', 'keep'); localStorage.setItem(legacy, '{}'); }, { legacy: LEGACY });
  await page.locator('#propertyName').fill('Synthetic saved scenario');
  await page.locator('#interestRate').fill('0');
  assert.equal(await page.evaluate(key => localStorage.getItem(key), STORE), null);
  await page.getByLabel('Remember on this device', { exact: true }).check();
  const saved = await page.evaluate(key => localStorage.getItem(key), STORE);
  assert.equal(JSON.parse(saved).data.interestRate, 0);
  await page.locator('#purchasePrice').fill('');
  assert.equal(await page.evaluate(key => localStorage.getItem(key), STORE), saved);
  await page.reload(); await ready(page);
  assert.equal(await page.locator('#propertyName').inputValue(), 'Synthetic saved scenario');
  assert.equal(await page.locator('#interestRate').inputValue(), '0');
  assert.equal(await page.locator('#remember-scenario').isChecked(), true);
  assert.equal(await text(page, '[data-result="monthlyMortgage"]'), '$1,042');
  await page.getByLabel('Remember on this device', { exact: true }).uncheck();
  assert.deepEqual(await page.evaluate(({ store, legacy }) => [localStorage.getItem(store), localStorage.getItem(legacy), localStorage.getItem('unrelated-test-key')], { store: STORE, legacy: LEGACY }), [null, null, 'keep']);
  assert.equal(await page.locator('#propertyName').inputValue(), 'Synthetic saved scenario');
  await page.reload(); await ready(page);
  assert.equal(await page.locator('#propertyName').inputValue(), 'My Investment Property');
});

test('keyboard controls have labels, error descriptions and visible focus', async t => {
  const page = await open(t, { width: 390 });
  const invalid = await page.locator('#assumptions input, #assumptions select').evaluateAll(nodes => nodes.filter(node => !node.disabled && (!node.labels?.length || !node.labels[0].textContent.trim() || (node.getAttribute('aria-describedby') || '').split(/\s+/).some(id => id && !document.getElementById(id)))).map(node => node.id));
  assert.deepEqual(invalid, []);
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(() => document.activeElement.classList.contains('skip-link')), true);
  await page.keyboard.press('Enter');
  assert.equal(await page.evaluate(() => document.activeElement.id), 'main');
  await page.getByRole('button', { name: 'Add a unit' }).focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.evaluate(() => document.activeElement.id), 'unit-4-unitNumber');
  const visibleFocus = await page.locator('#unit-4-unitNumber').evaluate(node => { const own = getComputedStyle(node), wrapper = getComputedStyle(node.closest('.field-control')); return own.outlineStyle !== 'none' || wrapper.boxShadow !== 'none'; });
  assert.equal(visibleFocus, true);
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(() => document.activeElement.id), 'unit-4-tenant');
  await page.locator('.table-scroll').focus();
  await page.keyboard.press('ArrowRight');
  await page.waitForFunction(() => document.querySelector('.table-scroll').scrollLeft > 0);
});

test('320/390/768/1440px layouts contain the page and keep wide projections locally scrollable', async t => {
  for (const width of [320, 390, 768, 1440]) await t.test(`${width}px`, async sub => {
    const page = await open(sub, { width });
    await noOverflow(page, 'page top');
    for (const section of ['#income', '#capital', '#projection', '.home-footer']) { await page.locator(section).scrollIntoViewIfNeeded(); await noOverflow(page, section); }
    const table = await page.locator('.table-scroll').evaluate(node => ({ client: node.clientWidth, scroll: node.scrollWidth, overflow: getComputedStyle(node).overflowX, tabIndex: node.tabIndex }));
    assert.equal(table.tabIndex, 0);
    assert.ok(['auto', 'scroll'].includes(table.overflow));
    if (width < 875) assert.ok(table.scroll > table.client);
    if (width < 1000) {
      await page.getByRole('button', { name: 'Open menu', exact: true }).click();
      assert.equal(await page.locator('#mobileMenu').isVisible(), true);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#mobileMenu').isVisible(), false);
    }
  });
});

test('print exposes all assumptions/methodology and keeps forecast columns in the page', async t => {
  const page = await open(t, { width: 768 });
  await page.locator('#propertyName').fill('Synthetic print scenario');
  const original = await page.locator('.method-grid details').evaluateAll(nodes => nodes.map(node => node.open));
  await page.evaluate(() => dispatchEvent(new Event('beforeprint')));
  await page.emulateMedia({ media: 'print' });
  assert.equal(await page.locator('#print-scenario-title').isVisible(), true);
  assert.equal(await text(page, '#print-scenario-title'), 'Synthetic print scenario');
  assert.equal(await page.locator('.tool-toolbar').isVisible(), false);
  assert.ok((await page.locator('.method-grid details').evaluateAll(nodes => nodes.map(node => node.open))).every(Boolean));
  for (const id of ['purchasePrice', 'interestRate', 'managementMode', 'capitalReserves', 'projectionYears', 'exitCapRate', 'sellingCostsPct']) assert.equal(await page.locator('#' + id).isVisible(), true, id);
  assert.match(await text(page, '#methodology'), /does not model lease rollover/);
  assert.match(await text(page, '.exit-summary'), /Annual cash flow above excludes these sale proceeds/);
  const table = await page.locator('.table-scroll').evaluate(node => ({ client: node.clientWidth, scroll: node.scrollWidth, overflow: getComputedStyle(node).overflowX }));
  assert.equal(table.overflow, 'visible');
  assert.ok(table.scroll <= table.client + 1, 'Printed columns fit without clipping');
  await noOverflow(page, 'print');
  await page.evaluate(() => dispatchEvent(new Event('afterprint')));
  await page.emulateMedia({ media: 'screen' });
  assert.deepEqual(await page.locator('.method-grid details').evaluateAll(nodes => nodes.map(node => node.open)), original);
});

test('calculator/resource/worksheet paths and workbook downloads remain reachable without a lead form', async t => {
  const page = await open(t);
  await page.locator('.resource-breadcrumb a[href="/resources/"]').click();
  assert.equal(new URL(page.url()).pathname, '/resources/');
  const paths = ['/proforma.html', '/workflow-check/', '/revenue_waterfall-Template.xlsx', '/financial_statements-Template.xlsx', '/MA_Model_Template.xlsx'];
  const links = await page.locator('a[href]').evaluateAll(nodes => nodes.map(node => node.href));
  for (const destination of paths) {
    const link = links.find(href => new URL(href).pathname === destination);
    assert.ok(link, destination);
    if (destination.endsWith('.xlsx')) assert.ok(new URL(link).searchParams.get('v'), 'Updated download bypasses older browser cache');
    const response = await page.request.get(link);
    assert.equal(response.status(), 200, destination);
    if (destination.endsWith('.xlsx')) assert.equal((await response.body()).subarray(0, 2).toString(), 'PK', 'Workbook is a ZIP package, not an HTML fallback');
  }
  await page.locator('a[href="/workflow-check/"]').first().click();
  assert.equal(new URL(page.url()).pathname, '/workflow-check/');
  assert.equal(await page.locator('form').count(), 0);
  assert.equal(await page.getByRole('button', { name: /Print/ }).isVisible(), true);
  const first = page.locator('.worksheet-steps textarea').first();
  await first.fill('Synthetic workflow: review a repetitive task.');
  await page.evaluate(() => dispatchEvent(new Event('beforeprint')));
  assert.equal(await text(page, '#worksheet-print-1'), 'Synthetic workflow: review a repetitive task.');
});

test('without JavaScript, methodology and resource alternatives remain available', async t => {
  const page = await open(t, { javaScriptEnabled: false });
  assert.equal(await page.locator('#proforma-tool').isVisible(), false);
  assert.match(await page.locator('noscript').innerText(), /needs JavaScript/);
  assert.equal(await page.locator('#methodology').isVisible(), true);
  assert.equal(await page.locator('noscript a[href="/resources/"]').isVisible(), true);
});
