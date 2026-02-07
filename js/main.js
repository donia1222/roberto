// FAQ Accordion
function toggleFaq(element) {
    const faqItem = element.parentElement;
    const isOpen = faqItem.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('open'));
    if (!isOpen) faqItem.classList.add('open');
}

// Header scroll — compact + shadow
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.pageYOffset > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const burger = document.getElementById('menuBurger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

// Close menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
    });
});

// Smooth scroll for nav
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Intersection Observer fade-in
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.section-header, .app-featured, .services-grid, .apps-grid, .workflow-steps, .websites-grid, .techstack-grid, .about-inner, .why-cards, .trust-grid, .faq-list').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Counter animation for metrics
function animateCounter(element, target, suffix) {
    let current = 0;
    const increment = target / 40;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, 30);
}

const metricsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const numbers = entry.target.querySelectorAll('.metric-number');
            if (numbers[0]) animateCounter(numbers[0], 5, '+');
            if (numbers[1]) animateCounter(numbers[1], 30, '+');
            if (numbers[2]) animateCounter(numbers[2], 100, '%');
            metricsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const metricsGrid = document.querySelector('.metrics-grid');
if (metricsGrid) metricsObserver.observe(metricsGrid);