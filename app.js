// Mobile menu
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuClose = document.querySelector('.mobile-menu-close');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu-content nav a');

mobileMenuBtn.addEventListener('click', function() {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
    this.classList.add('active');
});

function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
    mobileMenuBtn.classList.remove('active');
}

mobileMenuClose.addEventListener('click', closeMobileMenu);
mobileMenuLinks.forEach(link => link.addEventListener('click', closeMobileMenu));
mobileMenu.addEventListener('click', function(e) {
    if (e.target === mobileMenu) closeMobileMenu();
});

// Header scroll — only toggle class when state actually changes
const headerEl = document.querySelector('header');
let headerScrolled = false;
window.addEventListener('scroll', () => {
    const shouldBeScrolled = window.scrollY > 100;
    if (shouldBeScrolled !== headerScrolled) {
        headerScrolled = shouldBeScrolled;
        headerEl.classList.toggle('scrolled', shouldBeScrolled);
    }
}, { passive: true });

// Form handling
const discoveryForm = document.getElementById('discoveryForm');

if (discoveryForm) {
    discoveryForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // POST must target /index.html — Netlify's pretty-urls processing 404s form POSTs to bare /
        fetch('/index.html', {
            method: 'POST',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(formData).toString()
        })
        .then(res => {
            if (!res.ok) throw new Error('Form POST failed: ' + res.status);
            discoveryForm.reset();
            const success = document.createElement('div');
            success.className = 'form-success';
            success.innerHTML = "<strong>Got it — your message is in.</strong> I review every inquiry personally and typically reply within one business day. Urgent? Call <a href='tel:5617186725'>(561) 718-6725</a>.";
            discoveryForm.replaceWith(success);
        })
        .catch(error => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            let err = discoveryForm.querySelector('.form-error');
            if (!err) {
                err = document.createElement('p');
                err.className = 'form-error';
                discoveryForm.appendChild(err);
            }
            err.innerHTML = "Something went wrong sending that. Email <a href='mailto:zachary.vorsteg@gmail.com'>zachary.vorsteg@gmail.com</a> or call <a href='tel:5617186725'>(561) 718-6725</a> instead.";
        });
    });
}

// Smooth scroll only for anchor clicks (not CSS scroll-behavior which jams Chrome)
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Fade-in on scroll — unobserve after visible to stop firing during scroll
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-in, .fade-in-on-scroll').forEach(el => observer.observe(el));
