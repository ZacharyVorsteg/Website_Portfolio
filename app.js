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

// Header scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    header.classList.toggle('scrolled', window.scrollY > 100);
});

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

// Fade-in on scroll
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
