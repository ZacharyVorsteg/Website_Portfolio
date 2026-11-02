/* Hybrid consent: US default-on with thin strip notice; EU/EEA/UK + California stay opt-in. Honor GPC/DNT. */
(() => {
  'use strict';
  if (window.__siteAnalyticsConsent) return;
  const script = document.currentScript;
  const id = script.dataset.measurementId;
  const pageAttr = script.dataset.page;
  const origin = 'https://zacharyvorsteg.com';
  if (location.origin !== origin || !/^G-[A-Z0-9]+$/.test(id)) return;
  /* Missing/invalid data-page: fall back to current URL (do not throw). */
  let page;
  if (typeof pageAttr === 'string' && pageAttr.startsWith(origin + '/')) page = pageAttr;
  else page = origin + location.pathname + location.search;
  if (window.gtag || window.google_tag_manager || document.querySelector('script[src*="googletagmanager.com"]')) return;
  window.__siteAnalyticsConsent = true;

  const sources = new Set(['google', 'bing', 'duckduckgo', 'facebook', 'instagram', 'linkedin', 'youtube', 'x', 'twitter', 'newsletter', 'chatgpt', 'perplexity', 'claude']);
  const mediums = new Set(['organic', 'cpc', 'ppc', 'paid_social', 'social', 'email', 'referral', 'display']);
  const params = new URLSearchParams(location.search);
  function allowedParam(name, allowed) {
    const values = params.getAll(name);
    if (values.length !== 1) return undefined;
    const value = values[0].toLowerCase();
    return allowed.has(value) ? value : undefined;
  }
  const attribution = { campaign_source: '', campaign_medium: '', campaign_name: '', campaign_content: '', campaign_term: '', campaign_id: '' };
  const source = allowedParam('utm_source', sources), medium = allowedParam('utm_medium', mediums);
  if (source) attribution.campaign_source = source;
  if (medium) attribution.campaign_medium = medium;

  const referrerHosts = new Set(['google.com', 'www.google.com', 'bing.com', 'www.bing.com', 'duckduckgo.com', 'www.duckduckgo.com', 'facebook.com', 'www.facebook.com', 'm.facebook.com', 'l.facebook.com', 'instagram.com', 'www.instagram.com', 'linkedin.com', 'www.linkedin.com', 'youtube.com', 'www.youtube.com', 'x.com', 'www.x.com', 'twitter.com', 'www.twitter.com', 't.co', 'chatgpt.com', 'chat.openai.com', 'perplexity.ai', 'www.perplexity.ai', 'claude.ai']);
  let referrer = '';
  try {
    const incoming = new URL(document.referrer);
    if (['http:', 'https:'].includes(incoming.protocol) && referrerHosts.has(incoming.hostname) && !incoming.port && !incoming.username && !incoming.password) referrer = 'https://' + incoming.hostname;
  } catch (_) {}

  /* Lead-form attribution (hidden fields only; never invent emails or submit). */
  try {
    const lsKey = 'site-landing-v1';
    let landing = sessionStorage.getItem(lsKey);
    if (!landing) {
      landing = location.pathname + location.search;
      sessionStorage.setItem(lsKey, landing);
    }
    const fill = () => {
      document.querySelectorAll('form').forEach((form) => {
        const set = (name, value) => {
          if (value == null || value === '') return;
          let el = form.querySelector('[name="' + name + '"]');
          if (!el) {
            el = document.createElement('input');
            el.type = 'hidden';
            el.name = name;
            form.appendChild(el);
          }
          if (!el.value) el.value = String(value).slice(0, 500);
        };
        set('utm_source', params.get('utm_source'));
        set('utm_medium', params.get('utm_medium'));
        set('utm_campaign', params.get('utm_campaign'));
        set('utm_content', params.get('utm_content'));
        set('utm_term', params.get('utm_term'));
        set('gclid', params.get('gclid'));
        set('fbclid', params.get('fbclid'));
        set('landing_page', landing);
        if (document.referrer) set('referrer', document.referrer);
      });
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fill);
    else fill();
  } catch (_) {}

  const EU_EEA_UK = new Set(['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','IS','LI','NO','GB']);
  const key = 'site-analytics-consent-v1';
  const noticeKey = 'site-analytics-notice-v1';
  const disabled = 'ga-disable-' + id;
  const denied = { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' };
  let loaded = false;
  let counted = false;
  let clarityLoaded = false;
  let mode = 'pending'; /* optin | optout */
  let scrollDismissBound = false;

  function privacySignalsDenied() {
    return !!(navigator.globalPrivacyControl || navigator.doNotTrack === '1');
  }
  function readChoice() {
    if (privacySignalsDenied()) return 'denied';
    try {
      const saved = JSON.parse(localStorage.getItem(key));
      if (saved && Date.now() - saved.at >= 0 && Date.now() - saved.at < 180 * 86400000 && ['granted', 'denied'].includes(saved.value)) return saved.value;
    } catch (_) {}
    return 'unknown';
  }
  function noticeDismissed() {
    try { return localStorage.getItem(noticeKey) === '1'; } catch (_) { return false; }
  }
  let choice = readChoice();
  window[disabled] = choice !== 'granted';

  function button(label, action, parent) {
    const b = document.createElement('button'); b.type = 'button'; b.textContent = label;
    b.addEventListener('click', action); parent.appendChild(b); return b;
  }

  const panel = document.createElement('section');
  panel.className = 'analytics-consent';
  panel.hidden = true;
  document.body.appendChild(panel);

  const strip = document.createElement('section');
  strip.className = 'analytics-consent ac-strip';
  strip.hidden = true;
  document.body.appendChild(strip);

  const settings = document.createElement('button');
  settings.type = 'button';
  settings.className = 'analytics-choices';
  settings.textContent = 'Your Privacy Choices';
  settings.addEventListener('click', () => {
    buildPanel(true);
    panel.hidden = false;
    strip.hidden = true;
    const focusable = panel.querySelector('button');
    if (focusable) focusable.focus({ preventScroll: true });
  });

  function placeSettings() {
    if (settings.isConnected) return;
    const footer = document.querySelector('footer');
    if (footer) {
      const eco = footer.querySelector('.eco');
      const disc = footer.querySelector('.disc, .disclaimer, p:last-of-type');
      const host = eco || disc || footer;
      const wrap = document.createElement('span');
      wrap.className = 'ac-footer-choices';
      wrap.style.cssText = 'display:inline-block;margin:0 0 0 .75rem';
      if (eco) {
        wrap.style.margin = '0';
        eco.appendChild(wrap);
      } else if (disc && disc.parentNode) {
        wrap.style.display = 'block';
        wrap.style.margin = '8px 0 0';
        disc.parentNode.insertBefore(wrap, disc.nextSibling);
      } else {
        footer.appendChild(wrap);
      }
      wrap.appendChild(settings);
      return;
    }
    settings.classList.add('ac-fallback');
    document.body.appendChild(settings);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', placeSettings);
  else placeSettings();

  function gtag() { window.dataLayer.push(arguments); }
  function pageview() {
    if (counted || choice !== 'granted') return;
    counted = true;
    gtag('event', 'page_view', { send_to: id, page_location: page, page_referrer: referrer, page_title: 'Palm Beach Flex' });
  }
  function mayMeasure() {
    return loaded && choice === 'granted' && !window[disabled] && !privacySignalsDenied();
  }
  const measuredContacts = new WeakSet();
  document.addEventListener('click', event => {
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!link || !mayMeasure() || measuredContacts.has(link)) return;
    const href = link.getAttribute('href');
    const method = /^tel:/i.test(href) ? 'phone' : /^mailto:/i.test(href) ? 'email' : null;
    if (!method) return;
    measuredContacts.add(link);
    gtag('event', 'contact_click', { send_to: id, method });
  });
  let measuredLead = false;
  window.addEventListener('site:lead-accepted', () => {
    if (!mayMeasure() || measuredLead) return;
    measuredLead = true;
    gtag('event', 'generate_lead', { send_to: id, method: 'form' });
  });

  function startClarity() {
    const cid = script.dataset.clarityProjectId;
    if (clarityLoaded || !cid || !/^[A-Za-z0-9]+$/.test(cid) || choice !== 'granted') return;
    clarityLoaded = true;
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', cid);
  }
  function start() {
    if (loaded || choice !== 'granted') return;
    loaded = true;
    window[disabled] = false;
    window.dataLayer = window.dataLayer || [];
    gtag('consent', 'default', denied);
    gtag('consent', 'update', { ...denied, analytics_storage: 'granted' });
    gtag('js', new Date());
    gtag('config', id, {
      ...attribution,
      send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false,
      page_location: page, page_referrer: referrer, page_title: 'Palm Beach Flex',
      cookie_domain: 'none', cookie_expires: 15552000, cookie_update: false
    });
    pageview();
    const tag = document.createElement('script'); tag.async = true;
    tag.referrerPolicy = 'no-referrer';
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.appendChild(tag);
    startClarity();
  }
  function choose(value) {
    choice = privacySignalsDenied() ? 'denied' : value;
    try { localStorage.setItem(key, JSON.stringify({ value: choice, at: Date.now() })); } catch (_) {}
    try { localStorage.setItem(noticeKey, '1'); } catch (_) {}
    if (choice === 'denied') {
      window[disabled] = true;
      for (const item of document.cookie.split(';')) {
        const name = item.split('=')[0].trim();
        if (name === '_ga' || name.startsWith('_ga_')) document.cookie = name + '=; Max-Age=0; Path=/; SameSite=Lax';
      }
      if (loaded) { location.reload(); return; }
    } else start();
    panel.hidden = true;
    strip.hidden = true;
    settings.focus({ preventScroll: true });
  }

  function dismissStrip() {
    try { localStorage.setItem(noticeKey, '1'); } catch (_) {}
    strip.hidden = true;
  }

  function positionStrip() {
    const mcta = document.querySelector('.mcta');
    if (mcta) {
      const cs = getComputedStyle(mcta);
      const box = mcta.getBoundingClientRect();
      /* Fixed .mcta: offsetParent is null; use geometry. */
      const shown = cs.display !== 'none' && cs.visibility !== 'hidden' && box.height > 0 && box.width > 0;
      if (shown) {
        strip.style.bottom = Math.ceil(box.height) + 'px';
        return;
      }
    }
    strip.style.bottom = '0px';
  }

  function buildStrip() {
    strip.innerHTML = '';
    strip.className = 'analytics-consent ac-strip';
    strip.setAttribute('aria-label', 'Analytics notice');
    const text = document.createElement('p');
    text.className = 'ac-copy';
    text.textContent = script.dataset.consentOptoutCopy || 'This site uses analytics to improve your visit.';
    strip.appendChild(text);
    const priv = document.createElement('button');
    priv.type = 'button';
    priv.className = 'ac-priv';
    priv.textContent = 'Privacy choices';
    priv.addEventListener('click', () => {
      buildPanel(true);
      panel.hidden = false;
      const focusable = panel.querySelector('button');
      if (focusable) focusable.focus({ preventScroll: true });
    });
    strip.appendChild(priv);
    const x = document.createElement('button');
    x.type = 'button';
    x.className = 'ac-strip-x';
    x.setAttribute('aria-label', 'Dismiss');
    x.textContent = '\u00d7';
    x.addEventListener('click', dismissStrip);
    strip.appendChild(x);
    positionStrip();
  }

  function buildPanel(forceOptIn) {
    panel.innerHTML = '';
    panel.className = 'analytics-consent';
    panel.setAttribute('aria-label', 'Optional analytics');
    let brand = script.dataset.brandColor || '#177a8b';
    if (!/^#[0-9A-Fa-f]{6}$/.test(brand)) brand = '#177a8b';
    panel.style.setProperty('--consent-brand', brand);
    const text = document.createElement('p');
    text.className = 'ac-copy';
    text.textContent = script.dataset.consentCopy || 'Allow optional Google Analytics cookies to help us understand page visits and contact actions? We do not send form entries or use this for advertising. You can change your choice anytime.';
    panel.appendChild(text);
    const actions = document.createElement('div');
    actions.className = 'ac-actions';
    actions.setAttribute('role', 'group');
    button('Reject analytics', () => choose('denied'), actions);
    button('Allow analytics', () => choose('granted'), actions);
    panel.appendChild(actions);
    const privacy = document.createElement('a');
    const privHref = script.dataset.privacyHref || '/privacy/';
    privacy.href = (typeof privHref === 'string' && privHref.startsWith('/') && !privHref.startsWith('//')) ? privHref : '/privacy/';
    privacy.textContent = 'Privacy policy';
    panel.appendChild(privacy);
    if (privacySignalsDenied()) {
      const status = document.createElement('p');
      status.setAttribute('role', 'status');
      status.textContent = 'Your browser privacy preference keeps analytics off.';
      panel.appendChild(status);
    }
  }

  function showUsStrip() {
    if (noticeDismissed()) return;
    buildStrip();
    strip.hidden = false;
    if (!scrollDismissBound) {
      scrollDismissBound = true;
      const onScroll = () => { dismissStrip(); window.removeEventListener('scroll', onScroll); };
      window.addEventListener('scroll', onScroll, { passive: true });
    }
    window.addEventListener('resize', positionStrip);
  }

  function requiresOptIn(geo) {
    const country = (geo.country || '').toUpperCase();
    const region = (geo.region || geo.regionCode || '').toUpperCase();
    if (EU_EEA_UK.has(country)) return true;
    if (country === 'US' && (region === 'CA' || region === 'CALIFORNIA')) return true;
    return false;
  }

  function parseTrace(text) {
    const loc = /(?:^|\n)loc=([A-Z]{2})/i.exec(text);
    return { country: loc ? loc[1].toUpperCase() : '' };
  }

  async function detectGeo() {
    const geo = { country: '', region: '' };
    try {
      const trace = await fetch('/cdn-cgi/trace', { credentials: 'omit', cache: 'no-store' }).then((r) => r.text());
      Object.assign(geo, parseTrace(trace));
    } catch (_) {}
    /* Region (California) via shared Worker; fails open to country-only. */
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 1200);
      const res = await fetch('https://analytics-geo.zvorsteg1.workers.dev/', { credentials: 'omit', cache: 'no-store', signal: ctrl.signal });
      clearTimeout(t);
      if (res.ok) {
        const j = await res.json();
        if (j && typeof j.country === 'string' && j.country) geo.country = j.country.toUpperCase();
        if (j && typeof j.region === 'string') geo.region = j.region.toUpperCase();
      }
    } catch (_) {}
    return geo;
  }

  async function boot() {
    if (privacySignalsDenied()) {
      choice = 'denied';
      window[disabled] = true;
      mode = 'optin';
      buildPanel(true);
      panel.hidden = false;
      return;
    }
    if (choice === 'denied') {
      mode = 'optin';
      return;
    }
    if (choice === 'granted') {
      mode = 'optout';
      start();
      return;
    }
    /* choice unknown — geo decides default */
    const geo = await detectGeo();
    if (requiresOptIn(geo)) {
      mode = 'optin';
      buildPanel(true);
      panel.hidden = false;
      return;
    }
    mode = 'optout';
    choice = 'granted';
    window[disabled] = false;
    try { localStorage.setItem(key, JSON.stringify({ value: choice, at: Date.now() })); } catch (_) {}
    start();
    showUsStrip();
  }

  window.addEventListener('storage', event => {
    if (event.key === key && loaded) { window[disabled] = true; location.reload(); }
  });
  window.addEventListener('pageshow', event => {
    if (!event.persisted) return;
    choice = readChoice();
    if (loaded && choice !== 'granted') { window[disabled] = true; location.reload(); return; }
    counted = false;
    if (loaded) pageview(); else if (choice === 'granted') start();
  });

  boot();
})();
