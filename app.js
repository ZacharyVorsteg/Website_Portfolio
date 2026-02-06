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

        fetch('/', {
            method: 'POST',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(formData).toString()
        })
        .then(() => {
            submitBtn.textContent = 'Sent!';
            discoveryForm.reset();
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        })
        .catch(error => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            alert('Error submitting. Please call (561) 718-6725.');
        });
    });
}

// Fade-in on scroll — unobserve after visible to stop firing during scroll
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
