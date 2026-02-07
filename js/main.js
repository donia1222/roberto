// FAQ Accordion
function toggleFaq(element) {
    const faqItem = element.parentElement;
    const isOpen = faqItem.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('open'));
    if (!isOpen) faqItem.classList.add('open');
}

// Header scroll — compact + shadow + scroll-top button
var scrollTopBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.pageYOffset > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    if (window.pageYOffset > 1200) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
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

document.querySelectorAll('.section-header, .app-featured, .services-grid, .apps-grid, .websites-grid, .techstack-scroll-wrapper, .about-inner, .why-cards, .trust-grid, .faq-list').forEach(el => {
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
            if (numbers[0]) animateCounter(numbers[0], 6, '+');
            if (numbers[1]) animateCounter(numbers[1], 50, '+');
            if (numbers[2]) animateCounter(numbers[2], 100, '%');
            metricsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const metricsGrid = document.querySelector('.metrics-grid');
if (metricsGrid) metricsObserver.observe(metricsGrid);

// Workflow staggered reveal (repeats on every scroll)
var workflowObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        var steps = entry.target.querySelectorAll('.workflow-step');
        if (entry.isIntersecting) {
            steps.forEach(function(step, i) {
                setTimeout(function() {
                    step.classList.add('visible');
                }, i * 200);
            });
        } else {
            steps.forEach(function(step) {
                step.classList.remove('visible');
            });
        }
    });
}, { threshold: 0.15 });

var workflowSteps = document.querySelector('.workflow-steps');
if (workflowSteps) workflowObserver.observe(workflowSteps);

// Phone slider
var phoneSlideIndex = 0;
var phoneSlides = document.querySelectorAll('.app-featured-slide');
var phoneDots = document.querySelectorAll('.app-featured-dot');

function slidePhone(direction) {
    phoneSlides[phoneSlideIndex].classList.remove('active');
    phoneDots[phoneSlideIndex].classList.remove('active');
    phoneSlideIndex += direction;
    if (phoneSlideIndex >= phoneSlides.length) phoneSlideIndex = 0;
    if (phoneSlideIndex < 0) phoneSlideIndex = phoneSlides.length - 1;
    phoneSlides[phoneSlideIndex].classList.add('active');
    phoneDots[phoneSlideIndex].classList.add('active');
}

phoneDots.forEach(function(dot, index) {
    dot.addEventListener('click', function() {
        phoneSlides[phoneSlideIndex].classList.remove('active');
        phoneDots[phoneSlideIndex].classList.remove('active');
        phoneSlideIndex = index;
        phoneSlides[phoneSlideIndex].classList.add('active');
        phoneDots[phoneSlideIndex].classList.add('active');
    });
});

// Auto-slide every 4s
setInterval(function() { slidePhone(1); }, 4000);

// Typing animation for "Entwickler"
var typingWords = ['Entwickler', 'App-Profi', 'Partner', 'Entwickler'];
var typingIndex = 0;
var typingCharIndex = 0;
var typingDeleting = false;
var typingEl = document.getElementById('aboutTyping');

function typeLoop() {
    if (!typingEl) return;
    var current = typingWords[typingIndex];
    if (!typingDeleting) {
        typingEl.textContent = current.substring(0, typingCharIndex + 1);
        typingCharIndex++;
        if (typingCharIndex === current.length) {
            typingDeleting = true;
            setTimeout(typeLoop, 2000);
            return;
        }
        setTimeout(typeLoop, 100);
    } else {
        typingEl.textContent = current.substring(0, typingCharIndex);
        typingCharIndex--;
        if (typingCharIndex < 0) {
            typingDeleting = false;
            typingIndex = (typingIndex + 1) % typingWords.length;
            typingCharIndex = 0;
            setTimeout(typeLoop, 400);
            return;
        }
        setTimeout(typeLoop, 60);
    }
}
setTimeout(typeLoop, 1500);

// Cookie banner
function closeCookieBanner() {
    var banner = document.getElementById('cookieBanner');
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(20px)';
    banner.style.pointerEvents = 'none';
    setTimeout(function() { banner.style.display = 'none'; }, 300);
}
function acceptCookies() {
    localStorage.setItem('cookieConsent', 'accepted');
    closeCookieBanner();
}
function declineCookies() {
    localStorage.setItem('cookieConsent', 'declined');
    closeCookieBanner();
}
if (localStorage.getItem('cookieConsent')) {
    document.getElementById('cookieBanner').style.display = 'none';
}

// vCard download
function downloadVCard() {
    var vCardContent = 'BEGIN:VCARD\n' +
        'VERSION:3.0\n' +
        'FN:Lweb Schweiz\n' +
        'ORG:Lweb\n' +
        'TITLE:App & Web Entwicklung\n' +
        'ADR:;;Buchs;Buchs;SG;9471;Switzerland\n' +
        'TEL:+41765608645\n' +
        'EMAIL:info@lweb.ch\n' +
        'URL:https://lweb.ch\n' +
        'NOTE:App Entwickler & Full-Stack Developer in Buchs SG. Native iOS & Android Apps, moderne Websites und KI-Lösungen.\n' +
        'END:VCARD';

    var blob = new Blob([vCardContent], { type: 'text/vcard;charset=utf-8' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Lweb_Visitenkarte.vcf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}