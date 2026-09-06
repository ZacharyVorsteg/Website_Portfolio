(() => {
    'use strict';

    const campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign'];
    const campaignStorageKey = 'zv-campaign-attribution-v1';
    const topics = new Set(['ai', 'software', 'finance', 'real-estate', 'production', 'partnership', 'other']);
    const sourcePages = new Set([
        '/', '/index.html', '/about/', '/portfolio/', '/apps/', '/apps.html', '/proforma.html', '/macro.html',
        '/ai-operating-layer/', '/ai-automation/', '/custom-software/', '/finance/',
        '/commercial-real-estate/', '/production/', '/blog/',
        '/ai-automation-palm-beach-county/', '/ai-consultant-palm-beach-county/',
        '/ai-systems-architect-florida/', '/agentic-ai-engineer-west-palm-beach/'
    ]);
    const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
    const allowedSource = path => sourcePages.has(path) || /^\/blog\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/.test(path);
    const allowedCampaign = value => typeof value === 'string' && /^[a-z0-9][a-z0-9._-]{0,99}$/i.test(value) ? value : '';
    const visible = element => Boolean(element?.getClientRects().length) && getComputedStyle(element).visibility !== 'hidden';

    function captureCampaignAttribution() {
        const params = new URLSearchParams(location.search);
        const incoming = Object.fromEntries(campaignKeys.map(key => [key, allowedCampaign(params.get(key))]));
        let original = null;
        try {
            const stored = JSON.parse(window.sessionStorage.getItem(campaignStorageKey) || 'null');
            if (stored && typeof stored === 'object' && !Array.isArray(stored)) {
                const validated = Object.fromEntries(campaignKeys.map(key => [key, allowedCampaign(stored[key])]));
                if (Object.values(validated).some(Boolean)) original = validated;
            }
        } catch (_) { /* Storage may be denied or contain an invalid record. */ }
        const attribution = original || incoming;
        if (Object.values(attribution).some(Boolean)) {
            try {
                // Keep only validated marketing tokens. Never store URLs, referrers or form data.
                // The first valid campaign in this tab's session wins over later navigation.
                window.sessionStorage.setItem(campaignStorageKey, JSON.stringify(attribution));
            } catch (_) { /* Attribution is optional; the inquiry must still work. */ }
        } else {
            try { window.sessionStorage.removeItem(campaignStorageKey); } catch (_) { /* Storage is optional. */ }
        }
        return attribution;
    }

    function init() {
        // Capture before looking for a form: About and blog visits must retain the landing source.
        const campaignAttribution = captureCampaignAttribution();
        const menuButton = document.querySelector('.mobile-menu-btn');
        const menu = document.getElementById('mobileMenu');
        const menuClose = menu?.querySelector('.mobile-menu-close');
        let menuOpen = false;
        let previousFocus = null;
        let previousOverflow = '';

        function closeMenu(restoreFocus = true) {
            if (!menu || !menuButton || !menuOpen) return;
            menuOpen = false;
            menu.classList.remove('active');
            menu.hidden = true;
            menu.inert = true;
            menu.setAttribute('aria-hidden', 'true');
            menuButton.classList.remove('active');
            menuButton.setAttribute('aria-expanded', 'false');
            menuButton.setAttribute('aria-label', 'Open menu');
            document.body.style.overflow = previousOverflow;
            if (restoreFocus && visible(previousFocus)) previousFocus.focus({ preventScroll: true });
        }

        if (menuButton && menu && menuClose) {
            const focusable = () => [...menu.querySelectorAll('a[href],button,input,select,textarea,[tabindex]')]
                .filter(element => !element.disabled && element.tabIndex >= 0 && visible(element));
            menuButton.type = 'button';
            menuClose.type = 'button';
            menuButton.setAttribute('aria-controls', menu.id);
            menuButton.setAttribute('aria-expanded', 'false');
            menuButton.setAttribute('aria-label', 'Open menu');
            menu.setAttribute('role', 'dialog');
            menu.setAttribute('aria-modal', 'true');
            if (!menu.hasAttribute('aria-label') && !menu.hasAttribute('aria-labelledby')) menu.setAttribute('aria-label', 'Site navigation');
            menu.hidden = true;
            menu.inert = true;
            menu.setAttribute('aria-hidden', 'true');

            menuButton.addEventListener('click', () => {
                if (menuOpen) return closeMenu();
                previousFocus = document.activeElement;
                previousOverflow = document.body.style.overflow;
                menuOpen = true;
                menu.hidden = false;
                menu.inert = false;
                menu.setAttribute('aria-hidden', 'false');
                menu.classList.add('active');
                menuButton.classList.add('active');
                menuButton.setAttribute('aria-expanded', 'true');
                menuButton.setAttribute('aria-label', 'Close menu');
                document.body.style.overflow = 'hidden';
                (focusable()[0] || menuClose).focus({ preventScroll: true });
            });
            menuClose.addEventListener('click', () => closeMenu());
            menu.addEventListener('click', event => {
                if (event.target === menu) closeMenu();
                if (event.target.closest('.mobile-menu-content nav a')) closeMenu(false);
            });
            document.addEventListener('keydown', event => {
                if (!menuOpen) return;
                if (event.key === 'Escape') {
                    event.preventDefault();
                    closeMenu();
                } else if (event.key === 'Tab') {
                    const controls = focusable();
                    const first = controls[0];
                    const last = controls[controls.length - 1];
                    if (!first) return;
                    if (!menu.contains(document.activeElement) || (event.shiftKey && document.activeElement === first)) {
                        event.preventDefault();
                        (event.shiftKey ? last : first).focus();
                    } else if (!event.shiftKey && document.activeElement === last) {
                        event.preventDefault();
                        first.focus();
                    }
                }
            });
            window.addEventListener('resize', () => {
                if (window.matchMedia('(min-width: 1000px)').matches) closeMenu();
            }, { passive: true });
            document.body.classList.add('menu-ready');
        }

        const header = document.querySelector('header');
        if (header) {
            const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 100);
            window.addEventListener('scroll', updateHeader, { passive: true });
            updateHeader();
        }

        const form = document.getElementById('discoveryForm');
        const field = name => form?.elements.namedItem(name);
        const setField = (name, value) => {
            const input = field(name);
            if (input) input.value = value;
        };
        const localSource = () => {
            try {
                const referrer = new URL(document.referrer);
                if (referrer.origin === location.origin && allowedSource(referrer.pathname)) return referrer.pathname;
            } catch (_) { /* No usable referrer. */ }
            return allowedSource(location.pathname) ? location.pathname : '/';
        };
        function applyTopic(topic) {
            if (!form || !topics.has(topic)) return;
            const select = field('service');
            if (select?.options && [...select.options].some(option => option.value === topic)) {
                select.value = topic;
                const optionalDetails = select.closest('details.home-optional-details');
                if (optionalDetails) optionalDetails.open = true;
            }
            setField('source-offer', topic);
        }
        if (form) {
            const params = new URLSearchParams(location.search);
            setField('source-page', localSource());
            setField('source-offer', '');
            for (const key of campaignKeys) setField(key, campaignAttribution[key]);
            applyTopic(params.get('topic'));
            initForm(form);
        }

        function focusTarget(target) {
            if (!target.hasAttribute('tabindex') && !target.matches('a[href],button,input,select,textarea')) {
                target.setAttribute('tabindex', '-1');
                target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
            }
            target.focus({ preventScroll: true });
        }
        document.addEventListener('click', event => {
            const link = event.target.closest?.('a[href]');
            if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
            let url;
            try { url = new URL(link.href, location.href); } catch (_) { return; }
            const samePage = url.pathname === location.pathname || (['/', '/index.html'].includes(url.pathname) && ['/', '/index.html'].includes(location.pathname));
            if (url.origin !== location.origin || !samePage || !url.hash || url.hash === '#') return;
            let id;
            try { id = decodeURIComponent(url.hash.slice(1)); } catch (_) { return; }
            const target = document.getElementById(id);
            if (!target) return;
            const topic = link.dataset.topic || url.searchParams.get('topic');
            if (url.search !== location.search && (!topics.has(topic) || [...url.searchParams.keys()].some(key => key !== 'topic'))) return;
            event.preventDefault();
            closeMenu(false);
            if (id === 'contact') applyTopic(topic);
            // Only add an allowlisted offer token and a section ID. Never add form values to a URL.
            const destination = topics.has(topic) && id === 'contact'
                ? `${location.pathname}?topic=${encodeURIComponent(topic)}${url.hash}`
                : `${location.pathname}${location.search}${url.hash}`;
            if (`${location.pathname}${location.search}${location.hash}` !== destination) history.pushState(null, '', destination);
            focusTarget(target);
            target.scrollIntoView({ behavior: prefersReducedMotion() ? 'instant' : 'smooth', block: 'start' });
        });
        window.addEventListener('popstate', () => applyTopic(new URLSearchParams(location.search).get('topic')));

        // Content is useful without animation or an observer. CSS owns its default visible state.
        document.querySelectorAll('.fade-in, .fade-in-on-scroll').forEach(element => element.classList.add('visible'));
    }

    function initForm(form) {
        const submitButton = form.querySelector('button[type="submit"],input[type="submit"]');
        if (!submitButton || typeof window.fetch !== 'function') return; // Preserve native Netlify submission.
        const originalLabel = submitButton.tagName === 'INPUT' ? submitButton.value : submitButton.textContent;
        const label = text => {
            if (submitButton.tagName === 'INPUT') submitButton.value = text;
            else submitButton.textContent = text;
        };
        let pending = false;
        let sent = false;
        let status = document.getElementById('formStatus');
        if (!status) {
            status = document.createElement('div');
            status.id = 'formStatus';
            form.appendChild(status);
        }
        status.tabIndex = -1;
        status.setAttribute('role', 'status');
        status.setAttribute('aria-live', 'polite');
        status.setAttribute('aria-atomic', 'true');
        function showStatus(message, isError = false) {
            status.hidden = false;
            status.className = isError ? 'form-status form-error' : 'form-status';
            status.setAttribute('role', isError ? 'alert' : 'status');
            status.setAttribute('aria-live', isError ? 'assertive' : 'polite');
            status.textContent = message;
        }
        form.addEventListener('submit', async event => {
            event.preventDefault();
            if (pending || sent) return;
            if (!form.reportValidity()) return;
            pending = true;
            form.setAttribute('aria-busy', 'true');
            submitButton.disabled = true;
            label('Sending request…');
            showStatus('Sending your request…');
            const controller = typeof AbortController === 'function' ? new AbortController() : null;
            const timeout = controller ? window.setTimeout(() => controller.abort(), 20000) : null;
            try {
                const response = await fetch('/index.html', {
                    method: 'POST',
                    mode: 'same-origin',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(new FormData(form)).toString(),
                    ...(controller ? { signal: controller.signal } : {})
                });
                if (!response.ok) throw new Error('The form endpoint did not accept the request.');
                // Netlify's HTML response is a transport acknowledgement, not independent proof
                // of durable storage or notification. Readback remains a deployment QA gate.
                sent = true;
                form.reset();
                if (form.contains(status)) form.insertAdjacentElement('afterend', status);
                form.hidden = true;
                label('Request sent');
                showStatus('Your request was sent. I typically reply within one business day. This is an inquiry, not a scheduled appointment.');
                const alternative = document.createElement('p');
                alternative.append('If you don’t hear back, email ');
                const email = document.createElement('a');
                email.href = 'mailto:zacharyvorsteg@gmail.com';
                email.textContent = 'zacharyvorsteg@gmail.com';
                alternative.append(email, '.');
                status.appendChild(alternative);
                status.focus({ preventScroll: true });
                status.scrollIntoView({ behavior: prefersReducedMotion() ? 'instant' : 'smooth', block: 'nearest' });
            } catch (_) {
                showStatus('We couldn’t confirm that your request was sent. Your details are still here. Please try again, or email zacharyvorsteg@gmail.com.', true);
                status.focus({ preventScroll: true });
                status.scrollIntoView({ behavior: prefersReducedMotion() ? 'instant' : 'smooth', block: 'nearest' });
                label(originalLabel);
                submitButton.disabled = false;
            } finally {
                if (timeout !== null) window.clearTimeout(timeout);
                pending = false;
                form.removeAttribute('aria-busy');
            }
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
    else init();
})();
