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
    var isOpen = mobileMenu.classList.contains('open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
    document.querySelector('.header').classList.toggle('menu-open', isOpen);
});

// Close menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
        document.querySelector('.header').classList.remove('menu-open');
    });
});

// Smooth scroll for nav
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        var href = this.getAttribute('href');
        if (!href || !href.startsWith('#') || href === '#' || href.length < 2) return;
        e.preventDefault();
        try {
            var target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } catch(err) {}
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
var showcaseBgs = [
    'linear-gradient(155deg, #dbeafe 0%, #bfdbfe 50%, #e0eafc 100%)',
    'linear-gradient(155deg, #fef3e2 0%, #fde6c4 50%, #fff0db 100%)',
    'linear-gradient(155deg, #d1fae5 0%, #a7f3d0 50%, #dcfce7 100%)'
];
var appShowcase = document.getElementById('appShowcase');

function updateShowcaseBg() {
    if (appShowcase) appShowcase.style.background = showcaseBgs[phoneSlideIndex];
}

function slidePhone(direction) {
    phoneSlides[phoneSlideIndex].classList.remove('active');
    phoneDots[phoneSlideIndex].classList.remove('active');
    phoneSlideIndex += direction;
    if (phoneSlideIndex >= phoneSlides.length) phoneSlideIndex = 0;
    if (phoneSlideIndex < 0) phoneSlideIndex = phoneSlides.length - 1;
    phoneSlides[phoneSlideIndex].classList.add('active');
    phoneDots[phoneSlideIndex].classList.add('active');
    updateShowcaseBg();
}

phoneDots.forEach(function(dot, index) {
    dot.addEventListener('click', function() {
        phoneSlides[phoneSlideIndex].classList.remove('active');
        phoneDots[phoneSlideIndex].classList.remove('active');
        phoneSlideIndex = index;
        phoneSlides[phoneSlideIndex].classList.add('active');
        phoneDots[phoneSlideIndex].classList.add('active');
        updateShowcaseBg();
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

// Language switcher
var i18nMap = [
    // Metrics
    {s: '.metric-label', keys: ['metric.label1','metric.label2','metric.label3']},
    // Services
    {s: '.services .section-header h2', k: 'services.title'},
    {s: '.services .section-header p', k: 'services.desc'},
    {s: '.service-card:nth-child(1) h4', k: 'service1.title'},
    {s: '.service-card:nth-child(1) p', k: 'service1.desc'},
    {s: '.service-card:nth-child(1) .service-link', k: 'service1.link', suffix: ' →'},
    {s: '.service-card:nth-child(2) h4', k: 'service2.title'},
    {s: '.service-card:nth-child(2) p', k: 'service2.desc'},
    {s: '.service-card:nth-child(2) .service-link', k: 'service2.link', suffix: ' →'},
    {s: '.service-card--cta h3', k: 'services.cta.title'},
    {s: '.service-card--cta > p', k: 'services.cta.desc'},
    {s: '.service-cta-btn', k: 'services.cta.btn'},
    {s: '.service-card:nth-child(4) h4', k: 'service3.title'},
    {s: '.service-card:nth-child(4) p', k: 'service3.desc'},
    {s: '.service-card:nth-child(4) .service-link', k: 'service3.link', suffix: ' →'},
    {s: '.service-card:nth-child(5) h4', k: 'service4.title'},
    {s: '.service-card:nth-child(5) p', k: 'service4.desc'},
    {s: '.service-card:nth-child(5) .service-link', k: 'service4.link', suffix: ' →'},
    // Apps
    {s: '.apps .section-header h2', k: 'apps.title', html: true},
    {s: '.apps .section-header p', k: 'apps.desc'},
    {s: '.app-featured-tagline', k: 'apps.featured.tagline'},
    {s: '.app-featured-content > p', k: 'apps.featured.desc'},
    {s: '.app-featured-rating span:last-child', k: 'apps.featured.rating'},
    {s: '.apps-subtitle', k: 'apps.subtitle'},
    {s: '.app-card:nth-child(1) .app-card-content p', k: 'app1.desc'},
    {s: '.app-card:nth-child(2) .app-card-content p', k: 'app2.desc'},
    {s: '.app-card:nth-child(3) .app-card-content p', k: 'app3.desc'},
    {s: '.app-card:nth-child(4) .app-card-content p', k: 'app4.desc'},
    {s: '.app-card:nth-child(5) .app-card-content p', k: 'app5.desc'},
    {s: '.app-card:nth-child(6) .app-card-content p', k: 'app6.desc'},
    // Workflow
    {s: '.workflow .section-header h2', k: 'workflow.title'},
    {s: '.workflow .section-header p', k: 'workflow.desc'},
    {s: '.workflow-step:nth-child(1) h4', k: 'wf1.title'},
    {s: '.workflow-step:nth-child(1) p', k: 'wf1.desc'},
    {s: '.workflow-step:nth-child(2) h4', k: 'wf2.title'},
    {s: '.workflow-step:nth-child(2) p', k: 'wf2.desc'},
    {s: '.workflow-step:nth-child(3) h4', k: 'wf3.title'},
    {s: '.workflow-step:nth-child(3) p', k: 'wf3.desc'},
    {s: '.workflow-step:nth-child(4) h4', k: 'wf4.title'},
    {s: '.workflow-step:nth-child(4) p', k: 'wf4.desc'},
    // Websites
    {s: '.websites .section-header h2', k: 'websites.title', html: true},
    {s: '.websites .section-header p', k: 'websites.desc'},
    {s: '.website-card:nth-child(1) .website-card-content p', k: 'web1.desc'},
    {s: '.website-card:nth-child(2) .website-card-content p', k: 'web2.desc'},
    {s: '.website-card:nth-child(3) .website-card-content p', k: 'web3.desc'},
    {s: '.website-card:nth-child(4) .website-card-content p', k: 'web4.desc'},
    {s: '.website-card:nth-child(5) .website-card-content p', k: 'web5.desc'},
    {s: '.website-card:nth-child(6) .website-card-content p', k: 'web6.desc'},
    {s: '.website-card--cta h4', k: 'webcta.title'},
    {s: '.website-card--cta p', k: 'webcta.desc'},
    {s: '.website-card--cta .gbcta', k: 'webcta.btn'},
    // Tech
    {s: '.techstack .section-header h2', k: 'tech.title', html: true},
    {s: '.techstack .section-header p', k: 'tech.desc'},
    // About
    {s: '.about-content h2', k: 'about.title', html: true},
    {s: '.about-content > p', k: 'about.desc'},
    {s: '.about-point', keys: ['about.point1','about.point2','about.point3','about.point4'], textOnly: true},
    // Why Me
    {s: '.why-me .section-header h2', k: 'why.title'},
    {s: '.why-me .section-header p', k: 'why.desc'},
    {s: '.why-card:nth-child(1) h4', k: 'why1.title'},
    {s: '.why-card:nth-child(1) p', k: 'why1.desc'},
    {s: '.why-card:nth-child(2) h4', k: 'why2.title'},
    {s: '.why-card:nth-child(2) p', k: 'why2.desc'},
    {s: '.why-card:nth-child(3) h4', k: 'why3.title'},
    {s: '.why-card:nth-child(3) p', k: 'why3.desc'},
    // Trust
    {s: '.trust-stat-label', keys: ['trust.label1','trust.label2','trust.label3','trust.label4']},
    // FAQ
    {s: '.faq .section-header h2', k: 'faq.title'},
    {s: '.faq-item:nth-child(1) .faq-question h4', k: 'faq1.q'},
    {s: '.faq-item:nth-child(1) .faq-answer p', k: 'faq1.a'},
    {s: '.faq-item:nth-child(2) .faq-question h4', k: 'faq2.q'},
    {s: '.faq-item:nth-child(2) .faq-answer p', k: 'faq2.a'},
    {s: '.faq-item:nth-child(3) .faq-question h4', k: 'faq3.q'},
    {s: '.faq-item:nth-child(3) .faq-answer p', k: 'faq3.a'},
    {s: '.faq-item:nth-child(4) .faq-question h4', k: 'faq4.q'},
    {s: '.faq-item:nth-child(4) .faq-answer p', k: 'faq4.a'},
    {s: '.faq-item:nth-child(5) .faq-question h4', k: 'faq5.q'},
    {s: '.faq-item:nth-child(5) .faq-answer p', k: 'faq5.a'},
    {s: '.faq-item:nth-child(6) .faq-question h4', k: 'faq6.q'},
    {s: '.faq-item:nth-child(6) .faq-answer p', k: 'faq6.a'},
    {s: '.faq-item:nth-child(7) .faq-question h4', k: 'faq7.q'},
    {s: '.faq-item:nth-child(7) .faq-answer p', k: 'faq7.a'},
    {s: '.faq-bot-cta > p', k: 'faq.bot.text'},
    {s: '.faq-bot-btn', k: 'faq.bot.btn', keepSvg: true},
    // CTA
    {s: '.cta-banner h2', k: 'cta.title'},
    {s: '.cta-banner > .container > p', k: 'cta.desc'},
    // Footer
    {s: '.footer-brand > p', k: 'footer.desc'},
    {s: '.vcard-btn--footer', k: 'footer.vcard', keepSvg: true},
    {s: '.footer-col:nth-child(2) h4', k: 'footer.col1'},
    {s: '.footer-col:nth-child(2) li:nth-child(1) a', k: 'footer.s1'},
    {s: '.footer-col:nth-child(2) li:nth-child(2) a', k: 'footer.s2'},
    {s: '.footer-col:nth-child(2) li:nth-child(3) a', k: 'footer.s3'},
    {s: '.footer-col:nth-child(2) li:nth-child(4) a', k: 'footer.s4'},
    {s: '.footer-col:nth-child(4) h4', k: 'footer.col3'},
    // Cookie
    {s: '.cookie-banner > p', k: 'cookie.text'},
    {s: '.cookie-btn--accept', k: 'cookie.accept'},
    {s: '.cookie-btn--decline', k: 'cookie.decline'},
];

function switchLang(lang) {
    if (!translations[lang]) return;
    var t = translations[lang];

    // data-i18n attributes
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
        var key = el.getAttribute('data-i18n');
        if (t[key]) el.textContent = t[key];
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function(el) {
        var key = el.getAttribute('data-i18n-html');
        if (t[key]) el.innerHTML = t[key];
    });

    // Selector-based mapping
    i18nMap.forEach(function(item) {
        if (item.keys) {
            var els = document.querySelectorAll(item.s);
            els.forEach(function(el, idx) {
                if (item.keys[idx] && t[item.keys[idx]]) {
                    if (item.textOnly) {
                        // Keep child elements (icons), only replace text nodes
                        var textNodes = [];
                        for (var c = 0; c < el.childNodes.length; c++) {
                            if (el.childNodes[c].nodeType === 3) textNodes.push(el.childNodes[c]);
                        }
                        if (textNodes.length > 0) {
                            textNodes[textNodes.length - 1].textContent = '\n                        ' + t[item.keys[idx]] + '\n                    ';
                        }
                    } else {
                        el.textContent = t[item.keys[idx]];
                    }
                }
            });
        } else if (item.k && t[item.k]) {
            var el = document.querySelector(item.s);
            if (!el) return;
            if (item.html) {
                el.innerHTML = t[item.k];
            } else if (item.keepSvg) {
                var svg = el.querySelector('svg');
                el.textContent = '';
                if (svg) el.appendChild(svg);
                el.appendChild(document.createTextNode(' ' + t[item.k]));
            } else {
                el.textContent = t[item.k] + (item.suffix || '');
            }
        }
    });

    // Update lang buttons
    document.querySelectorAll('.lang-btn').forEach(function(btn) { btn.classList.remove('active'); });
    var activeBtn = document.querySelector('.lang-btn[onclick*="' + lang + '"]');
    if (activeBtn) activeBtn.classList.add('active');

    // Save preference
    localStorage.setItem('lweb_lang', lang);
    document.documentElement.lang = lang === 'de' ? 'de-CH' : lang;
}

// Restore saved language
var savedLang = localStorage.getItem('lweb_lang');
if (savedLang && savedLang !== 'de') {
    switchLang(savedLang);
}

// Chatbot — via backend PHP
var CHAT_API_URL = 'https://web.lweb.ch/bot_respuestasweb.php';

var chatbotSystemPrompt = 'RULE #1: You MUST reply in the SAME language the user writes in. If the user writes in Spanish, reply in Spanish. If in English, reply in English. If in French, reply in French. If in German, reply in German. NEVER default to German unless the user writes in German.\n\n' +
'Willkommen bei Lweb.ch — maßgeschneiderte Lösungen für Websites, Online-Shops, mobile Apps und Chatbot-Integrationen. Hier sind die Details:\n\n' +
'1. **Erstellung von maßgeschneiderten Websites**: Bei Lweb.ch erstellen wir individuelle Websites, die du vollständig anpassen kannst – ohne Programmierkenntnisse. Bereits ab 990 CHF erhältst du eine Website mit einem benutzerfreundlichen Admin-Panel zur Anpassung von Bildern, Texten, Farben und mehr.\n\n' +
'2. **Online-Shops (E-Commerce)**: Wir bieten komplette Online-Shop-Lösungen ab 2450 CHF, die von der Inventarverwaltung bis zur sicheren Zahlungsabwicklung alles abdecken.\n\n' +
'3. **Integration von Künstlicher Intelligenz (KI) und Chatbots**: Unser intelligenter Chatbot basiert auf modernsten KI-Technologien (wie ChatGPT) und ist speziell dafür konzipiert, häufig gestellte Fragen in Echtzeit zu beantworten.\n\n' +
'4. **Entwicklung mit Joomla, Next.js und Remix**: Moderne Websites mit den neuesten Frameworks.\n\n' +
'5. **Entwicklung von mobilen Anwendungen (React Native)**: Unsere mobilen Apps für iOS und Android basieren auf React Native, was die Entwicklung einer hochwertigen Anwendung mit nur einer Codebasis ermöglicht.\n\n' +
'6. **Veröffentlichte Apps**: Keto Scanner (Barcode-Scanner für Keto-Lebensmittel, 4.8/5 Sterne, 2.8 Mio Produkte), BuyVoice (KI-Einkaufsliste mit Spracherkennung), Hundezonen Schweiz, FoodScan AI (Rezepte aus Zutaten), DogMentor KI (Hundeerziehung), KetoRecipeLab (Keto-Rezepte mit KI), Work Ti (Zeiterfassung). Alle im App Store und Play Store.\n\n' +
'7. **Realisierte Websites**: HOT & BBQ (hot-bbq.ch), BeautyStyle, Ushuaia Bar (ushuaia-bar.ch), Cantina Tex-Mex (cantinatexmex.ch), Flinck Sauber (flink-sauber.li), Bouquet Mediterraneo (bouquetmediterraneo.ch) und über 33+ weitere Websites.\n\n' +
'8. **Hosting und Domainverwaltung (Hostpoint)**: Sichere, zuverlässige Server in der Schweiz.\n\n' +
'9. **SEO und Website-Leistung**: Optimierung für Geschwindigkeit, Benutzerfreundlichkeit und mobile Kompatibilität.\n\n' +
'10. **Kontinuierliche Unterstützung und Wartung**: Fortlaufender Support, regelmässige Updates und Sicherheitsverbesserungen.\n\n' +
'11. **Über den Gründer, Roberto Salvador**: Seit über 6 Jahren im Geschäft, über 50+ Apps & Websites realisiert. Ansässig in Buchs SG, Kanton St. Gallen, Schweiz. Arbeitet auch mit Kunden in Liechtenstein, Rheintal, Sargans, Sevelen. Sprachen: Deutsch, Spanisch, Englisch.\n\n' +
'**Kurze und prägnante Antworten mit Emoticons.**\n\n' +
'Wenn der Benutzer einen Termin vereinbaren oder buchen möchte, genügt es, „termin vereinbaren" oder „termin buchen" zu schreiben, um den Prozess zur Terminreservierung über WhatsApp zu starten.\n\n' +
'**Kontakt**:\n' +
'- 📧 E-Mail: info@lweb.ch\n' +
'- 📞 Telefon: +41 76 560 86 45\n' +
'- 🏢 Adresse: Buchs SG, 9471, Schweiz\n' +
'- 🌐 Website: www.lweb.ch';

var chatbotMessages = [];

// Load chat history from localStorage
var savedChat = localStorage.getItem('lweb_chat_history');
if (savedChat) {
    try {
        var parsed = JSON.parse(savedChat);
        if (Array.isArray(parsed) && parsed.length > 0) {
            chatbotMessages = parsed;
        }
    } catch(e) {}
}

function saveChatHistory() {
    localStorage.setItem('lweb_chat_history', JSON.stringify(chatbotMessages));
}

function openChatFromMenu() {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    document.querySelector('.header').classList.remove('menu-open');
    setTimeout(function() { openChatBot(); }, 350);
}

var chatModeChosen = false;

function openChatBot() {
    document.getElementById('chatbotOverlay').classList.add('open');
    document.getElementById('chatbotModal').classList.add('open');
    document.body.classList.add('chatbot-open');

    // Show welcome if no mode chosen yet and no chat history
    if (!chatModeChosen && chatbotMessages.length === 0) {
        document.getElementById('chatbotWelcome').style.display = 'flex';
        document.getElementById('chatbotMessages').style.display = 'none';
        document.getElementById('chatbotSuggestions').style.display = 'none';
        document.querySelector('.chatbot-input-area').style.display = 'none';
        document.querySelector('.chatbot-clear').style.display = 'none';
    } else {
        showChatView();
    }
}

function chooseChatMode(mode) {
    chatModeChosen = true;
    document.getElementById('chatbotWelcome').style.display = 'none';
    if (mode === 'voice') {
        showChatView();
        startVoiceCall();
    } else {
        showChatView();
        if (window.innerWidth > 768) document.getElementById('chatbotInput').focus();
    }
}

function showChatView() {
    document.getElementById('chatbotWelcome').style.display = 'none';
    document.getElementById('chatbotMessages').style.display = 'flex';
    document.querySelector('.chatbot-input-area').style.display = 'flex';
    document.querySelector('.chatbot-clear').style.display = chatbotMessages.length > 0 ? 'inline-flex' : 'none';
    if (chatbotMessages.length === 0) {
        document.getElementById('chatbotSuggestions').style.display = 'flex';
    }
    // Restore saved messages in UI
    var container = document.getElementById('chatbotMessages');
    if (container.children.length <= 1 && chatbotMessages.length > 0) {
        for (var i = 0; i < chatbotMessages.length; i++) {
            var m = chatbotMessages[i];
            if (m.role === 'system') continue;
            addChatMessage(m.content, m.role === 'user' ? 'user' : 'bot', true);
        }
    }
    container.scrollTop = container.scrollHeight;
}

function closeChatBot() {
    if (voiceCallActive) stopVoiceCall();
    if (micActive) stopMic();
    document.getElementById('chatbotOverlay').classList.remove('open');
    document.getElementById('chatbotModal').classList.remove('open');
    document.body.classList.remove('chatbot-open');
}

function clearChat() {
    chatbotMessages = [];
    chatModeChosen = false;
    localStorage.removeItem('lweb_chat_history');
    if (voiceCallActive) stopVoiceCall();
    var container = document.getElementById('chatbotMessages');
    container.innerHTML = '<div class="chatbot-msg chatbot-msg--bot"><p>Hallo! Wie kann ich Ihnen helfen? 👋</p></div>';
    // Show welcome screen again
    document.getElementById('chatbotWelcome').style.display = 'flex';
    document.getElementById('chatbotMessages').style.display = 'none';
    document.getElementById('chatbotSuggestions').style.display = 'none';
    document.querySelector('.chatbot-input-area').style.display = 'none';
    document.querySelector('.chatbot-clear').style.display = 'none';
}

function sendSuggestion(text) {
    document.getElementById('chatbotSuggestions').style.display = 'none';
    addChatMessage(text, 'user');
    chatbotMessages.push({ role: 'user', content: text });
    document.querySelector('.chatbot-clear').style.display = 'inline-flex';
    saveChatHistory();
    sendToChat();
}

function sendChatMessage() {
    var input = document.getElementById('chatbotInput');
    var text = input.value.trim();
    if (!text) return;
    input.value = '';
    input.style.height = 'auto';
    document.getElementById('chatbotSuggestions').style.display = 'none';
    addChatMessage(text, 'user');
    chatbotMessages.push({ role: 'user', content: text });
    document.querySelector('.chatbot-clear').style.display = 'inline-flex';
    saveChatHistory();
    sendToChat();
}

function addChatMessage(text, sender, skipAnim) {
    var container = document.getElementById('chatbotMessages');
    var msg = document.createElement('div');
    msg.className = 'chatbot-msg chatbot-msg--' + sender;
    if (skipAnim) msg.style.animation = 'none';
    var p = document.createElement('p');
    if (sender === 'bot') {
        p.innerHTML = text;
    } else {
        p.textContent = text;
    }
    msg.appendChild(p);
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
}

function showTyping() {
    var container = document.getElementById('chatbotMessages');
    var typing = document.createElement('div');
    typing.className = 'chatbot-typing';
    typing.id = 'chatbotTyping';
    typing.innerHTML = '<span></span><span></span><span></span>';
    container.appendChild(typing);
    container.scrollTop = container.scrollHeight;
}

function hideTyping() {
    var typing = document.getElementById('chatbotTyping');
    if (typing) typing.parentNode.removeChild(typing);
}

function sendToChat() {
    showTyping();

    // Build messages array like the example: system prompt + last 10 messages
    var recentMessages = chatbotMessages.slice(-10);
    var messagesToSend = [
        { role: 'system', content: chatbotSystemPrompt }
    ].concat(recentMessages);

    // Convertir historial al formato Gemini que espera bot_respuestas.php
    var convHistory = [];
    for (var i = 0; i < recentMessages.length; i++) {
        var m = recentMessages[i];
        convHistory.push({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
        });
    }
    var userMsg = recentMessages.length > 0 ? recentMessages[recentMessages.length - 1].content : '';

    fetch(CHAT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            conversationHistory: convHistory,
            prompt: chatbotSystemPrompt,
            userMessage: userMsg
        })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        hideTyping();
        if (data.status === 'success' && data.botReply) {
            chatbotMessages.push({ role: 'assistant', content: data.botReply });
            saveChatHistory();
            addChatMessage(data.botReply, 'bot');
            if (voiceCallActive) {
                var clean = data.botReply.replace(/<[^>]*>/g, '').replace(/\*\*/g, '');
                voiceSetStatus('Antwort', clean);
                document.getElementById('chatbotVoiceCircle').className = 'chatbot-voice-circle';
                setTimeout(function() { if (voiceCallActive) voiceListen(); }, 3000);
            }
        } else if (data.message) {
            addChatMessage('Fehler: ' + data.message, 'bot');
        } else {
            addChatMessage('Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.', 'bot');
        }
    })
    .catch(function(err) {
        hideTyping();
        addChatMessage('Verbindungsfehler. Bitte kontaktieren Sie uns direkt: <a href="mailto:info@lweb.ch">info@lweb.ch</a>', 'bot');
        if (voiceCallActive) {
            voiceSetStatus('Fehler', 'Verbindungsfehler');
            setTimeout(function() { if (voiceCallActive) voiceListen(); }, 3000);
        }
    });
}

// ===== VOICE / SPEECH =====
var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
var micRecognition = null;
var voiceRecognition = null;
var micActive = false;
var voiceCallActive = false;

// --- Mic button (input area) ---
function toggleMic() {
    toggleVoiceCall();
}

function startMic() {
    try {
        micRecognition = new SpeechRecognition();
    } catch(e) {
        alert('Spracherkennung konnte nicht gestartet werden.');
        return;
    }
    micRecognition.lang = 'de-DE';
    micRecognition.interimResults = true;
    micRecognition.continuous = false;
    micActive = true;
    document.getElementById('chatbotMicBtn').classList.add('recording');
    document.getElementById('chatbotInput').placeholder = 'Ich höre zu...';

    micRecognition.onresult = function(e) {
        var transcript = '';
        for (var i = e.resultIndex; i < e.results.length; i++) {
            transcript += e.results[i][0].transcript;
        }
        document.getElementById('chatbotInput').value = transcript;
        if (e.results[e.results.length - 1].isFinal) {
            stopMic();
            sendChatMessage();
        }
    };
    micRecognition.onerror = function(e) {
        console.log('Mic error:', e.error);
        stopMic();
    };
    micRecognition.onend = function() {
        if (micActive) stopMic();
    };
    try {
        micRecognition.start();
    } catch(e) {
        console.log('Mic start error:', e);
        stopMic();
    }
}

function stopMic() {
    micActive = false;
    document.getElementById('chatbotMicBtn').classList.remove('recording');
    document.getElementById('chatbotInput').placeholder = 'Ihre Frage eingeben...';
    if (micRecognition) {
        try { micRecognition.stop(); } catch(e) {}
        micRecognition = null;
    }
}

// --- Voice call mode (header button) ---
function toggleVoiceCall() {
    if (!SpeechRecognition) {
        alert('Ihr Browser unterstützt keine Spracherkennung.');
        return;
    }
    if (voiceCallActive) {
        stopVoiceCall();
    } else {
        startVoiceCall();
    }
}

function startVoiceCall() {
    voiceCallActive = true;
    document.getElementById('chatbotMicBtn').classList.add('recording');
    document.getElementById('chatbotVoiceOverlay').classList.add('active');
    voiceSetStatus('Zuhören...', 'Sprechen Sie jetzt');
    document.getElementById('chatbotVoiceCircle').className = 'chatbot-voice-circle listening';
    voiceListen();
}

function stopVoiceCall() {
    voiceCallActive = false;
    document.getElementById('chatbotMicBtn').classList.remove('recording');
    document.getElementById('chatbotVoiceOverlay').classList.remove('active');
    document.getElementById('chatbotVoiceCircle').className = 'chatbot-voice-circle';
    if (voiceRecognition) {
        try { voiceRecognition.stop(); } catch(e) {}
        voiceRecognition = null;
    }
}

function voiceSetStatus(status, text) {
    document.getElementById('chatbotVoiceStatus').textContent = status;
    document.getElementById('chatbotVoiceText').textContent = text || '';
}

function voiceListen() {
    if (!voiceCallActive) return;
    try {
        voiceRecognition = new SpeechRecognition();
    } catch(e) {
        voiceSetStatus('Fehler', 'Spracherkennung nicht verfügbar');
        return;
    }
    voiceRecognition.lang = 'de-DE';
    voiceRecognition.interimResults = true;
    voiceRecognition.continuous = false;

    document.getElementById('chatbotVoiceCircle').className = 'chatbot-voice-circle listening';
    voiceSetStatus('Zuhören...', 'Sprechen Sie jetzt...');

    voiceRecognition.onresult = function(e) {
        var transcript = '';
        var isFinal = false;
        for (var i = e.resultIndex; i < e.results.length; i++) {
            transcript += e.results[i][0].transcript;
            if (e.results[i].isFinal) isFinal = true;
        }
        voiceSetStatus('Zuhören...', '«' + transcript + '»');
        if (isFinal && transcript.trim()) {
            document.getElementById('chatbotSuggestions').style.display = 'none';
            addChatMessage(transcript.trim(), 'user');
            chatbotMessages.push({ role: 'user', content: transcript.trim() });
            saveChatHistory();
            voiceSetStatus('Verarbeiten...', '«' + transcript.trim() + '»');
            document.getElementById('chatbotVoiceCircle').className = 'chatbot-voice-circle';
            sendToChat();
        }
    };
    voiceRecognition.onerror = function(e) {
        console.log('Voice error:', e.error);
        if (voiceCallActive) {
            voiceListenAfterSpeak();
        }
    };
    voiceRecognition.onend = function() {
        if (voiceCallActive) {
            voiceListenAfterSpeak();
        }
    };
    try {
        voiceRecognition.start();
    } catch(e) {
        console.log('Voice start error:', e);
        if (voiceCallActive) voiceListenAfterSpeak();
    }
}

function voiceListenAfterSpeak() {
    if (!voiceCallActive) return;
    setTimeout(function() {
        if (voiceCallActive) voiceListen();
    }, 500);
}

// vCard download
function downloadVCard() {
    var imageUrl = 'img/logolweb.png';

    fetch(imageUrl)
        .then(function(res) {
            if (!res.ok) throw new Error('Error al obtener la imagen: ' + res.statusText);
            return res.blob();
        })
        .then(function(blob) {
            var reader = new FileReader();
            reader.onloadend = function() {
                var base64data = reader.result.split(',')[1];

                var vCardContent = 'BEGIN:VCARD\n' +
                    'VERSION:3.0\n' +
                    'FN:Lweb Schweiz\n' +
                    'ORG:Lweb\n' +
                    'TITLE:App & Web Entwicklung\n' +
                    'ADR:;;Sevelen;Sevelen;SG;9475;Switzerland\n' +
                    'TEL:+41765608645\n' +
                    'EMAIL:info@lweb.ch\n' +
                    'URL:https://lweb.ch\n' +
                    'NOTE:App Entwickler & Full-Stack Developer in Buchs SG. Native iOS & Android Apps\\, moderne Websites und KI-Loesungen.\n' +
                    'PHOTO;ENCODING=b;TYPE=PNG:' + base64data + '\n' +
                    'END:VCARD';

                var vCardBlob = new Blob([vCardContent], { type: 'text/vcard;charset=utf-8' });
                var link = document.createElement('a');
                link.href = URL.createObjectURL(vCardBlob);
                link.download = 'Lweb_Visitenkarte.vcf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            };
            reader.onerror = function() {
                downloadVCardNoImage();
            };
            reader.readAsDataURL(blob);
        })
        .catch(function() {
            downloadVCardNoImage();
        });
}

function downloadVCardNoImage() {
    var vCardContent = 'BEGIN:VCARD\n' +
        'VERSION:3.0\n' +
        'FN:Lweb Schweiz\n' +
        'ORG:Lweb\n' +
        'TITLE:App & Web Entwicklung\n' +
        'ADR:;;Sevelen;Sevelen;SG;9475;Switzerland\n' +
        'TEL:+41765608645\n' +
        'EMAIL:info@lweb.ch\n' +
        'URL:https://lweb.ch\n' +
        'NOTE:App Entwickler & Full-Stack Developer in Buchs SG. Native iOS & Android Apps\\, moderne Websites und KI-Loesungen.\n' +
        'END:VCARD';

    var vCardBlob = new Blob([vCardContent], { type: 'text/vcard;charset=utf-8' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(vCardBlob);
    link.download = 'Lweb_Visitenkarte.vcf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ===== SERVICE MODAL =====
var serviceIcons = {
    mobile: {
        svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
        cls: 'svc-modal-icon--mobile'
    },
    web: {
        svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>',
        cls: 'svc-modal-icon--web'
    },
    ai: {
        svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>',
        cls: 'svc-modal-icon--ai'
    },
    support: {
        svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
        cls: 'svc-modal-icon--support'
    }
};

var checkSvg = '<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>';

function getCurrentLang() {
    return localStorage.getItem('lweb_lang') || 'de';
}

function svcT(key) {
    var lang = getCurrentLang();
    var t = translations[lang] || translations['de'];
    return t[key] || (translations['de'][key] || '');
}

function openServiceModal(type) {
    var icon = serviceIcons[type];
    if (!icon) return;

    var modal = document.getElementById('svcModal');
    var overlay = document.getElementById('svcModalOverlay');
    var prefix = 'svc.' + type + '.';

    // Icon
    var iconEl = document.getElementById('svcModalIcon');
    iconEl.className = 'svc-modal-icon ' + icon.cls;
    iconEl.innerHTML = icon.svg;

    // Title & subtitle
    document.getElementById('svcModalTitle').textContent = svcT(prefix + 'title');
    document.getElementById('svcModalSubtitle').textContent = svcT(prefix + 'subtitle');

    // Features
    var featuresEl = document.getElementById('svcModalFeatures');
    featuresEl.innerHTML = '';
    var idx = 0;
    for (var i = 1; i <= 6; i++) {
        var text = svcT(prefix + 'f' + i);
        if (!text) continue;
        var div = document.createElement('div');
        div.className = 'svc-modal-feature web-modal-stagger';
        div.style.animationDelay = (idx * 80) + 'ms';
        div.innerHTML = '<span class="svc-modal-feature-icon">' + checkSvg + '</span><span>' + text + '</span>';
        featuresEl.appendChild(div);
        idx++;
    }

    // Pricing
    document.getElementById('svcModalPrice').textContent = svcT(prefix + 'price');
    document.getElementById('svcModalPriceNote').textContent = svcT(prefix + 'priceNote');

    // CTA
    document.getElementById('svcModalCta').textContent = svcT(prefix + 'cta');

    // Open
    overlay.classList.add('open');
    modal.classList.add('open');
    document.body.classList.add('svc-modal-open');
}

function closeServiceModal() {
    document.getElementById('svcModalOverlay').classList.remove('open');
    document.getElementById('svcModal').classList.remove('open');
    document.body.classList.remove('svc-modal-open');
}

// Close on Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeServiceModal();
        closeWebModal();
        closePriceCalc();
        closeLegalModal();
    }
});

// ===== PRICE CALCULATOR =====
var calcState = {
    step: 1,
    type: '',
    scope: '',
    features: [],
    design: '',
    ai: ''
};

var calcTotalSteps = 5;
var arrowSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';

function cT(key) { return svcT(key); }

function openPriceCalc() {
    calcState = { step: 1, type: '', scope: '', features: [], design: '', ai: '' };
    calcRenderStep1();
    calcGoToStep(1);
    document.getElementById('calcOverlay').classList.add('open');
    document.getElementById('calcModal').classList.add('open');
    document.body.classList.add('calc-open');
    var opts = document.querySelectorAll('.calc-option');
    for (var i = 0; i < opts.length; i++) opts[i].classList.remove('selected');
    document.getElementById('calcNextBtn').disabled = true;
}

function closePriceCalc() {
    document.getElementById('calcOverlay').classList.remove('open');
    document.getElementById('calcModal').classList.remove('open');
    document.body.classList.remove('calc-open');
}

function calcRenderStep1() {
    var step1 = document.querySelector('.calc-step[data-step="1"]');
    var badge = step1.querySelector('.calc-step-badge');
    var h3 = step1.querySelector('.calc-step-header h3');
    var p = step1.querySelector('.calc-step-header p');
    badge.textContent = cT('calc.step') + ' 1 ' + cT('calc.of') + ' 5';
    h3.textContent = cT('calc.s1.title');
    p.textContent = cT('calc.s1.desc');

    var opts = step1.querySelectorAll('.calc-option');
    var keys = ['website', 'app', 'combo'];
    for (var i = 0; i < opts.length; i++) {
        var k = keys[i];
        opts[i].querySelector('.calc-option-text strong').textContent = cT('calc.s1.' + k);
        opts[i].querySelector('.calc-option-text span').textContent = cT('calc.s1.' + k + '.desc');
    }
}

function calcRenderStep4() {
    var step4 = document.querySelector('.calc-step[data-step="4"]');
    var badge = step4.querySelector('.calc-step-badge');
    var h3 = step4.querySelector('.calc-step-header h3');
    var p = step4.querySelector('.calc-step-header p');
    badge.textContent = cT('calc.step') + ' 4 ' + cT('calc.of') + ' 5';
    h3.textContent = cT('calc.s4.title');
    p.textContent = cT('calc.s4.desc');

    var opts = step4.querySelectorAll('.calc-option');
    var keys = ['ready', 'idea', 'scratch'];
    for (var i = 0; i < opts.length; i++) {
        opts[i].querySelector('.calc-option-text strong').textContent = cT('calc.design.' + keys[i]);
        opts[i].querySelector('.calc-option-text span').textContent = cT('calc.design.' + keys[i] + '.desc');
    }
}

function calcRenderStep5() {
    var step5 = document.querySelector('.calc-step[data-step="5"]');
    var badge = step5.querySelector('.calc-step-badge');
    var h3 = step5.querySelector('.calc-step-header h3');
    var p = step5.querySelector('.calc-step-header p');
    badge.textContent = cT('calc.step') + ' 5 ' + cT('calc.of') + ' 5';
    h3.textContent = cT('calc.s5.title');
    p.textContent = cT('calc.s5.desc');

    var opts = step5.querySelectorAll('.calc-option');
    var keys = ['yes', 'no', 'maybe'];
    for (var i = 0; i < opts.length; i++) {
        opts[i].querySelector('.calc-option-text strong').textContent = cT('calc.ai.' + keys[i]);
        opts[i].querySelector('.calc-option-text span').textContent = cT('calc.ai.' + keys[i] + '.desc');
    }
}

function calcRenderResultLabels() {
    var resultStep = document.querySelector('.calc-step[data-step="result"]');
    resultStep.querySelector('.calc-result h3').textContent = cT('calc.result.title');
    resultStep.querySelector('.calc-result-note').textContent = cT('calc.result.note');
    document.getElementById('calcResultWhatsapp').textContent = cT('calc.result.whatsapp');
}

function calcGoToStep(step) {
    calcState.step = step;
    var steps = document.querySelectorAll('.calc-step');
    for (var i = 0; i < steps.length; i++) steps[i].classList.remove('active');

    var isResult = step > calcTotalSteps;
    var targetStep = isResult ? 'result' : String(step);
    var target = document.querySelector('.calc-step[data-step="' + targetStep + '"]');
    if (target) {
        target.classList.add('active');
        var opts = target.querySelectorAll('.calc-option');
        for (var j = 0; j < opts.length; j++) {
            opts[j].classList.remove('web-modal-stagger');
            void opts[j].offsetWidth;
            opts[j].classList.add('web-modal-stagger');
            opts[j].style.animationDelay = (j * 70) + 'ms';
        }
    }

    var pct = isResult ? 100 : (step / calcTotalSteps) * 100;
    document.getElementById('calcProgressBar').style.width = pct + '%';

    var backBtn = document.getElementById('calcBackBtn');
    var nextBtn = document.getElementById('calcNextBtn');
    var navEl = document.getElementById('calcNav');

    if (isResult) {
        navEl.style.display = 'none';
        calcRenderResultLabels();
        calcShowResult();
    } else {
        navEl.style.display = 'flex';
        backBtn.classList.toggle('visible', step > 1);
        backBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg> ' + cT('calc.nav.back');
        nextBtn.disabled = !calcStepValid(step);

        if (step === calcTotalSteps) {
            nextBtn.innerHTML = cT('calc.nav.calculate') + ' ' + arrowSvg;
        } else {
            nextBtn.innerHTML = cT('calc.nav.next') + ' ' + arrowSvg;
        }
    }

    if (step === 1) calcRenderStep1();
    if (step === 2) calcBuildScopeStep();
    if (step === 3) calcBuildFeatureStep();
    if (step === 4) calcRenderStep4();
    if (step === 5) calcRenderStep5();
}

function calcStepValid(step) {
    switch (step) {
        case 1: return calcState.type !== '';
        case 2: return calcState.scope !== '';
        case 3: return true;
        case 4: return calcState.design !== '';
        case 5: return calcState.ai !== '';
        default: return true;
    }
}

function calcNext() {
    if (!calcStepValid(calcState.step)) return;
    calcGoToStep(calcState.step + 1);
}

function calcBack() {
    if (calcState.step > 1) calcGoToStep(calcState.step - 1);
}

function calcSelectType(el) {
    var siblings = el.parentNode.querySelectorAll('.calc-option');
    for (var i = 0; i < siblings.length; i++) siblings[i].classList.remove('selected');
    el.classList.add('selected');
    calcState.type = el.getAttribute('data-value');
    calcState.scope = '';
    calcState.features = [];
    document.getElementById('calcNextBtn').disabled = false;
}

function calcSelectSingle(el, field) {
    var siblings = el.parentNode.querySelectorAll('.calc-option');
    for (var i = 0; i < siblings.length; i++) siblings[i].classList.remove('selected');
    el.classList.add('selected');
    calcState[field] = el.getAttribute('data-value');
    document.getElementById('calcNextBtn').disabled = false;
}

function calcToggleFeature(el) {
    el.classList.toggle('selected');
    var val = el.getAttribute('data-value');
    var idx = calcState.features.indexOf(val);
    if (idx > -1) {
        calcState.features.splice(idx, 1);
    } else {
        calcState.features.push(val);
    }
    document.getElementById('calcNextBtn').disabled = false;
}

function calcBuildScopeStep() {
    var container = document.getElementById('calcScopeOptions');
    container.innerHTML = '';
    var options = [];

    var badge = document.querySelector('.calc-step[data-step="2"] .calc-step-badge');
    badge.textContent = cT('calc.step') + ' 2 ' + cT('calc.of') + ' 5';

    if (calcState.type === 'website') {
        document.getElementById('calcStep2Title').textContent = cT('calc.s2w.title');
        document.getElementById('calcStep2Desc').textContent = cT('calc.s2w.desc');
        options = [
            { value: 'landing', key: 'landing' },
            { value: 'small', key: 'small' },
            { value: 'medium', key: 'medium' },
            { value: 'large', key: 'large' },
            { value: 'shop', key: 'shop' }
        ];
    } else {
        document.getElementById('calcStep2Title').textContent = cT('calc.s2a.title');
        document.getElementById('calcStep2Desc').textContent = cT('calc.s2a.desc');
        options = [
            { value: 'simple', key: 'simple' },
            { value: 'medium', key: 'appmedium' },
            { value: 'complex', key: 'complex' }
        ];
    }

    for (var i = 0; i < options.length; i++) {
        var o = options[i];
        var btn = document.createElement('button');
        btn.className = 'calc-option web-modal-stagger';
        btn.style.animationDelay = (i * 70) + 'ms';
        btn.setAttribute('data-value', o.value);
        if (calcState.scope === o.value) btn.classList.add('selected');
        btn.innerHTML =
            '<div class="calc-option-icon calc-option-icon--scope">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>' +
            '</div>' +
            '<div class="calc-option-text"><strong>' + cT('calc.scope.' + o.key) + '</strong><span>' + cT('calc.scope.' + o.key + '.desc') + '</span></div>' +
            '<div class="calc-option-check"><svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg></div>';
        btn.onclick = (function(b) { return function() { calcSelectSingle(b, 'scope'); }; })(btn);
        container.appendChild(btn);
    }
}

function calcBuildFeatureStep() {
    var container = document.getElementById('calcFeatureOptions');
    container.innerHTML = '';
    var featureKeys = [];

    var badge = document.querySelector('.calc-step[data-step="3"] .calc-step-badge');
    badge.textContent = cT('calc.step') + ' 3 ' + cT('calc.of') + ' 5';
    document.querySelector('.calc-step[data-step="3"] .calc-step-header p').textContent = cT('calc.s3.desc');

    if (calcState.type === 'website') {
        document.getElementById('calcStep3Title').textContent = cT('calc.s3.title');
        featureKeys = ['contact', 'cms', 'multilang', 'blog', 'booking', 'seo', 'analytics', 'vcard'];
    } else {
        document.getElementById('calcStep3Title').textContent = cT('calc.s3.titleApp');
        featureKeys = ['auth', 'push', 'payment', 'camera', 'gps', 'chat', 'api', 'admin', 'stores'];
    }

    for (var i = 0; i < featureKeys.length; i++) {
        var k = featureKeys[i];
        var btn = document.createElement('button');
        btn.className = 'calc-option web-modal-stagger';
        btn.style.animationDelay = (i * 70) + 'ms';
        btn.setAttribute('data-value', k);
        if (calcState.features.indexOf(k) > -1) btn.classList.add('selected');
        btn.innerHTML =
            '<div class="calc-option-icon calc-option-icon--feature">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>' +
            '</div>' +
            '<div class="calc-option-text"><strong>' + cT('calc.feat.' + k) + '</strong><span>' + cT('calc.feat.' + k + '.desc') + '</span></div>' +
            '<div class="calc-option-check"><svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg></div>';
        btn.onclick = (function(b) { return function() { calcToggleFeature(b); }; })(btn);
        container.appendChild(btn);
    }
}

function calcComputePrice() {
    var min = 0;
    var max = 0;
    var weeksRange = '';

    if (calcState.type === 'website') {
        switch (calcState.scope) {
            case 'landing': min = 700; max = 1200; weeksRange = '1–2'; break;
            case 'small':   min = 900; max = 1800; weeksRange = '2–3'; break;
            case 'medium':  min = 1800; max = 3200; weeksRange = '3–5'; break;
            case 'large':   min = 3200; max = 5500; weeksRange = '5–8'; break;
            case 'shop':    min = 2800; max = 6000; weeksRange = '5–9'; break;
        }
        var webFeaturePrices = {
            contact: [100, 200], cms: [400, 700], multilang: [400, 900],
            blog: [250, 500], booking: [500, 1000], seo: [300, 600], analytics: [100, 200],
            vcard: [150, 300]
        };
        for (var i = 0; i < calcState.features.length; i++) {
            var fp = webFeaturePrices[calcState.features[i]];
            if (fp) { min += fp[0]; max += fp[1]; }
        }
    } else {
        var isCombo = calcState.type === 'app-landing';
        switch (calcState.scope) {
            case 'simple':  min = 4500; max = 7500; weeksRange = '4–6'; break;
            case 'medium':  min = 7500; max = 14000; weeksRange = '6–10'; break;
            case 'complex': min = 14000; max = 25000; weeksRange = '10–16'; break;
        }
        var appFeaturePrices = {
            auth: [500, 900], push: [300, 600], payment: [900, 1800],
            camera: [400, 800], gps: [400, 800], chat: [1200, 2500],
            api: [1500, 3500], admin: [1500, 3000], stores: [300, 600]
        };
        for (var i = 0; i < calcState.features.length; i++) {
            var ap = appFeaturePrices[calcState.features[i]];
            if (ap) { min += ap[0]; max += ap[1]; }
        }
        if (isCombo) { min += 950; max += 2000; }
    }

    switch (calcState.design) {
        case 'ready': break;
        case 'idea': min += 300; max += 600; break;
        case 'scratch': min += 600; max += 1500; break;
    }

    if (calcState.ai === 'yes') { min += 1500; max += 3500; }
    if (calcState.ai === 'maybe') { min += 500; max += 1500; }

    return { min: min, max: max, weeksRange: weeksRange };
}

function calcFormatCHF(n) {
    return 'CHF ' + n.toLocaleString('de-CH');
}

function calcShowResult() {
    var price = calcComputePrice();

    var summaryEl = document.getElementById('calcResultSummary');
    var tags = [];

    tags.push(cT('calc.type.' + (calcState.type === 'app-landing' ? 'combo' : calcState.type)));

    var scopeKeyMap = {
        landing: 'landing', small: 'smallLabel', medium: 'mediumLabel',
        large: 'largeLabel', shop: 'shopLabel',
        simple: 'simpleLabel', complex: 'complexLabel'
    };
    var sk = scopeKeyMap[calcState.scope];
    if (sk) tags.push(cT('calc.scope.' + sk));

    if (calcState.features.length > 0) tags.push(calcState.features.length + ' ' + cT('calc.result.features'));
    if (calcState.ai === 'yes') tags.push(cT('calc.result.withAI'));
    if (calcState.design === 'scratch') tags.push(cT('calc.result.newDesign'));

    summaryEl.innerHTML = '';
    for (var i = 0; i < tags.length; i++) {
        summaryEl.innerHTML += '<span class="calc-result-tag web-modal-stagger" style="animation-delay:' + (i * 70) + 'ms">' + tags[i] + '</span>';
    }

    document.getElementById('calcResultPrice').textContent = calcFormatCHF(price.min) + ' – ' + calcFormatCHF(price.max);

    document.getElementById('calcResultTime').innerHTML =
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' +
        cT('calc.result.duration') + ': ' + price.weeksRange + ' ' + cT('calc.weeks');

    // Build WhatsApp message with all selected data
    var msg = calcBuildWhatsAppMsg(price, tags);
    calcState.waUrl = 'https://wa.me/41765608645?text=' + encodeURIComponent(msg);
}

function calcOpenWhatsApp() {
    if (calcState.waUrl) {
        window.open(calcState.waUrl, '_blank');
    }
}

function calcBuildWhatsAppMsg(price, tags) {
    var typeLabels = { website: 'Website', app: 'Mobile App', 'app-landing': 'App + Landing Page' };
    var scopeLabels = {
        landing: 'Landing Page', small: 'Kleine Website (1-3 Seiten)',
        medium: 'Mittlere Website (4-7 Seiten)', large: 'Grosse Website (8+ Seiten)',
        shop: 'Online-Shop', simple: 'Einfache App', complex: 'Komplexe App'
    };
    if (calcState.scope === 'medium' && calcState.type !== 'website') scopeLabels.medium = 'Mittlere App';

    var featureLabels = {
        contact: 'Kontaktformular', cms: 'CMS', multilang: 'Mehrsprachig', blog: 'Blog',
        booking: 'Buchungssystem', seo: 'SEO', analytics: 'Analytics', vcard: 'Digitale Visitenkarte',
        auth: 'Login/Benutzer', push: 'Push-Benachrichtigungen', payment: 'In-App Zahlung',
        camera: 'Kamera/Scanner', gps: 'GPS/Standort', chat: 'Chat/Messaging',
        api: 'Backend/API', admin: 'Admin-Panel', stores: 'Store-Veröffentlichung'
    };
    var designLabels = { ready: 'Design vorhanden', idea: 'Ungefähre Vorstellung', scratch: 'Design von Grund auf' };
    var aiLabels = { yes: 'Ja', no: 'Nein', maybe: 'Unsicher' };

    var lines = [];
    lines.push('Hallo! Ich habe den Preisrechner auf lweb.ch benutzt. Hier meine Angaben:');
    lines.push('');
    lines.push('Projekt: ' + (typeLabels[calcState.type] || calcState.type));
    lines.push('Umfang: ' + (scopeLabels[calcState.scope] || calcState.scope));

    if (calcState.features.length > 0) {
        var fList = [];
        for (var i = 0; i < calcState.features.length; i++) {
            fList.push(featureLabels[calcState.features[i]] || calcState.features[i]);
        }
        lines.push('Funktionen: ' + fList.join(', '));
    }

    lines.push('Design: ' + (designLabels[calcState.design] || calcState.design));
    lines.push('KI: ' + (aiLabels[calcState.ai] || calcState.ai));
    lines.push('');
    lines.push('Geschätztes Budget: ' + calcFormatCHF(price.min) + ' – ' + calcFormatCHF(price.max));
    lines.push('Geschätzte Dauer: ' + price.weeksRange + ' Wochen');
    lines.push('');
    lines.push('Ich freue mich auf Ihre Rückmeldung!');

    return lines.join('\n');
}

function calcGoToContact() {
    closePriceCalc();
    setTimeout(function() {
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    }, 300);
}

// ===== WEB PROJECT MODAL =====
var webProjects = {
    hotbbq: {
        title: 'HOT & BBQ',
        url: 'https://hot-bbq.ch',
        image: 'img/hotbbq.jpg',
        complexity: 'complex',
        desc: 'Online-Shop für BBQ-Produkte, Grills, Gewürze und Zubehör mit vollständigem E-Commerce, Warenkorb, Produktfiltern und Bestellsystem.',
        techs: ['Next.js', 'React', 'eCommerce', 'Stripe', 'Admin Panel'],
        features: ['Produktkatalog mit Kategorien & Filter', 'Warenkorb & Checkout', 'Online-Zahlung', 'Bestellverwaltung', 'Responsive Design', 'SEO-optimiert'],
        price: 'CHF 2\'800 – 5\'000'
    },
    beauty: {
        title: 'BeautyStyle',
        url: 'https://beautystyles.vercel.app',
        image: 'img/beautystyle.jpg',
        complexity: 'medium',
        desc: 'Moderne Website für ein Kosmetikstudio mit Dienstleistungen, Preisliste, Bildergalerie und Buchungsmöglichkeit.',
        techs: ['Remix', 'React', 'Framer Motion', 'CSS Modules'],
        features: ['Dienstleistungen & Preise', 'Animierte Bildergalerie', 'Online-Terminbuchung', 'Kontaktformular', 'Responsive Design', 'Smooth Animations'],
        price: 'CHF 1\'800 – 3\'200'
    },
    ushuaia: {
        title: 'Ushuaia Bar',
        url: 'https://ushuaia-bar.ch',
        image: 'img/ushuaia.png',
        complexity: 'medium',
        desc: 'Stilvolle Website für die Ushuaia Bar in Buchs SG mit Speise- und Getränkekarte, Events, Reservierungssystem und Galerie.',
        techs: ['Next.js', 'React', 'Tailwind CSS', 'Vercel'],
        features: ['Speise- & Getränkekarte', 'Event-Kalender', 'Tischreservierung', 'Bildergalerie', 'Google Maps Integration', 'Responsive Design'],
        price: 'CHF 1\'800 – 3\'000'
    },
    cantina: {
        title: 'Cantina Tex-Mex',
        url: 'https://cantinatexmex.ch',
        image: 'img/cantina.jpeg',
        complexity: 'medium',
        desc: 'Restaurant-Website für die Cantina Tex-Mex in Buchs SG mit Speisekarte, Online-Bestellung, Reservierungen und Fotogalerie.',
        techs: ['Remix', 'React', 'CSS3', 'Vercel'],
        features: ['Digitale Speisekarte', 'Tischreservierung', 'Fotogalerie', 'Öffnungszeiten & Standort', 'Kontaktformular', 'Responsive Design'],
        price: 'CHF 1\'800 – 3\'000'
    },
    flinck: {
        title: 'Flinck Sauber',
        url: 'https://flink-sauber.li',
        image: 'img/flinck.jpeg',
        complexity: 'easy',
        desc: 'Professionelle Website für einen Reinigungsservice in Liechtenstein mit Dienstleistungsübersicht, Preisen und Kontaktmöglichkeiten.',
        techs: ['Next.js', 'React', 'Tailwind CSS', 'Vercel'],
        features: ['Dienstleistungsübersicht', 'Preisübersicht', 'Kontaktformular', 'Google Maps', 'Responsive Design', 'SEO-optimiert'],
        price: 'CHF 900 – 1\'800'
    },
    bouquet: {
        title: 'Bouquet Mediterraneo',
        url: 'https://bouquetmediterraneo.ch',
        image: 'img/bouquet.jpeg',
        complexity: 'medium',
        desc: 'Elegante Restaurant-Website für das Bouquet Mediterraneo mit mediterraner Speisekarte, Reservierungssystem und Eventbereich.',
        techs: ['Remix', 'React', 'CSS3', 'Vercel'],
        features: ['Speisekarte mit Kategorien', 'Tischreservierung', 'Event-Bereich', 'Bildergalerie', 'Standort & Öffnungszeiten', 'Responsive Design'],
        price: 'CHF 1\'800 – 3\'000'
    },
    crypto: {
        title: 'Crypto Dashboard',
        url: 'https://remix-crypto.vercel.app',
        image: 'img/crypto.png',
        complexity: 'complex',
        desc: 'Echtzeit-Kryptowährungs-Dashboard mit Live-Kursen, Marktdaten, Charts und Portfolio-Übersicht über verschiedene Coins.',
        techs: ['Remix', 'React', 'CoinGecko API', 'Charts.js', 'Web3'],
        features: ['Echtzeit-Krypto-Kurse', 'Interaktive Charts', 'Portfolio-Übersicht', 'Marktdaten & Trends', 'API-Integration', 'Responsive Design'],
        price: 'CHF 2\'500 – 4\'500'
    },
    renovation: {
        title: 'Renovation',
        url: 'https://renovation-tau.vercel.app',
        image: 'img/renovation.jpg',
        complexity: 'easy',
        desc: 'Professionelle Unternehmenswebsite für einen Renovierungsbetrieb mit Projektgalerie, Dienstleistungen und Kontaktformular.',
        techs: ['Next.js', 'React', 'Tailwind CSS', 'Vercel'],
        features: ['Projektgalerie (Vorher/Nachher)', 'Dienstleistungsübersicht', 'Kontaktformular', 'Referenzen', 'Responsive Design', 'SEO-optimiert'],
        price: 'CHF 900 – 1\'800'
    },
    webm: {
        title: 'WebM Converter',
        url: 'https://webm-converter.vercel.app',
        image: 'img/webmconverter.jpg',
        complexity: 'medium',
        desc: 'Web-App zum Konvertieren von Videodateien ins WebM-Format direkt im Browser mit FFmpeg-Integration und Drag-and-Drop.',
        techs: ['Next.js', 'React', 'FFmpeg.wasm', 'Web Workers'],
        features: ['Drag & Drop Upload', 'Browser-basierte Konvertierung', 'Fortschrittsanzeige', 'Verschiedene Formate', 'Kein Server nötig', 'Responsive Design'],
        price: 'CHF 1\'500 – 2\'800'
    },
    rrapi: {
        title: 'Rrapi Immobilien',
        url: 'https://rrapi.ch',
        image: 'img/rrapi.jpg',
        complexity: 'easy',
        desc: 'Firmenwebsite für eine Immobilienverwaltung mit Objektübersicht, Kontaktformular und Unternehmensdarstellung.',
        techs: ['HTML', 'CSS', 'JavaScript', 'PHP'],
        features: ['Immobilienübersicht', 'Kontaktformular', 'Über uns Seite', 'Standort & Kontaktdaten', 'Responsive Design', 'SEO-optimiert'],
        price: 'CHF 900 – 1\'500'
    }
};

var currentWebProject = '';

function openWebModal(id) {
    var project = webProjects[id];
    if (!project) return;
    currentWebProject = id;

    // Image
    var imgEl = document.getElementById('webModalImage');
    imgEl.innerHTML = '<img src="' + project.image + '" alt="' + project.title + '">';

    // Complexity badge
    var badgeEl = document.getElementById('webModalBadge');
    var badgeLabels = { easy: 'Einfach', medium: 'Mittel', complex: 'Komplex' };
    badgeEl.textContent = badgeLabels[project.complexity] || project.complexity;
    badgeEl.className = 'web-modal-badge web-modal-badge--' + project.complexity;

    // Title & description
    document.getElementById('webModalTitle').textContent = project.title;
    document.getElementById('webModalDesc').textContent = project.desc;

    // Technologies
    var techsEl = document.getElementById('webModalTechs');
    techsEl.innerHTML = '';
    for (var i = 0; i < project.techs.length; i++) {
        var span = document.createElement('span');
        span.className = 'web-modal-tech web-modal-stagger';
        span.style.animationDelay = (i * 60) + 'ms';
        span.textContent = project.techs[i];
        techsEl.appendChild(span);
    }

    // Features
    var featEl = document.getElementById('webModalFeatures');
    featEl.innerHTML = '';
    var baseDelay = project.techs.length * 60;
    for (var j = 0; j < project.features.length; j++) {
        var div = document.createElement('div');
        div.className = 'svc-modal-feature web-modal-stagger';
        div.style.animationDelay = (baseDelay + j * 80) + 'ms';
        div.innerHTML = '<span class="svc-modal-feature-icon">' + checkSvg + '</span><span>' + project.features[j] + '</span>';
        featEl.appendChild(div);
    }

    // Price
    document.getElementById('webModalPrice').textContent = project.price;

    // Visit URL
    var visitBtn = document.getElementById('webModalVisit');
    visitBtn.href = project.url;

    // Open modal
    document.getElementById('webModalOverlay').classList.add('open');
    document.getElementById('webModal').classList.add('open');
    document.body.classList.add('svc-modal-open');
}

function closeWebModal() {
    document.getElementById('webModalOverlay').classList.remove('open');
    document.getElementById('webModal').classList.remove('open');
    document.body.classList.remove('svc-modal-open');
}

function webModalWhatsApp() {
    var project = webProjects[currentWebProject];
    if (!project) return;
    var msg = 'Hallo! Ich habe auf lweb.ch das Projekt «' + project.title + '» gesehen und hätte gerne ein ähnliches Projekt.\n\n' +
              'Geschätzter Preis: ' + project.price + '\n\n' +
              'Ich freue mich auf Ihre Rückmeldung!';
    window.open('https://wa.me/41765608645?text=' + encodeURIComponent(msg), '_blank');
}

// ===== LEGAL MODALS =====
var legalContent = {
    impressum: {
        title: 'Impressum',
        icon: 'svc-modal-icon--web',
        html: '<h4>Angaben gemäss Schweizer Recht</h4>' +
            '<p><strong>Lweb</strong><br>Roberto Salvador<br>9475 Sevelen<br>Schweiz</p>' +
            '<h4>Kontakt</h4>' +
            '<p>Telefon: +41 76 560 86 45<br>E-Mail: info@lweb.ch<br>Website: <a href="https://lweb.ch" style="color:var(--cerulean500)">lweb.ch</a></p>' +
            '<h4>Unternehmensform</h4>' +
            '<p>Einzelunternehmen</p>' +
            '<h4>Verantwortlich für den Inhalt</h4>' +
            '<p>Roberto Salvador, 9475 Sevelen, Schweiz</p>' +
            '<h4>Haftungsausschluss</h4>' +
            '<p>Der Autor übernimmt keine Gewähr für die Richtigkeit, Genauigkeit, Aktualität, Zuverlässigkeit und Vollständigkeit der Informationen auf dieser Website.</p>' +
            '<p>Haftungsansprüche gegen den Autor wegen Schäden materieller oder immaterieller Art, die aus dem Zugriff oder der Nutzung bzw. Nichtnutzung der veröffentlichten Informationen entstanden sind, werden ausgeschlossen.</p>' +
            '<h4>Urheberrecht</h4>' +
            '<p>Die auf dieser Website enthaltenen Inhalte und Werke sind urheberrechtlich geschützt. Jede Verwertung ausserhalb der Grenzen des Urheberrechts bedarf der vorherigen schriftlichen Zustimmung des Autors.</p>'
    },
    datenschutz: {
        title: 'Datenschutzerklärung',
        icon: 'svc-modal-icon--ai',
        html: '<h4>Allgemeines</h4>' +
            '<p>Der Schutz Ihrer persönlichen Daten ist uns ein wichtiges Anliegen. In dieser Datenschutzerklärung informieren wir Sie über die Verarbeitung Ihrer personenbezogenen Daten auf unserer Website lweb.ch.</p>' +
            '<h4>Verantwortliche Stelle</h4>' +
            '<p>Lweb — Roberto Salvador<br>9475 Sevelen, Schweiz<br>E-Mail: info@lweb.ch</p>' +
            '<h4>Erhobene Daten</h4>' +
            '<p>Beim Besuch unserer Website werden folgende Daten automatisch erfasst:</p>' +
            '<ul><li>IP-Adresse (anonymisiert)</li><li>Datum und Uhrzeit des Zugriffs</li><li>Aufgerufene Seiten</li><li>Verwendeter Browser und Betriebssystem</li></ul>' +
            '<h4>Kontaktformular & WhatsApp</h4>' +
            '<p>Wenn Sie uns über das Kontaktformular oder WhatsApp kontaktieren, werden Ihre Angaben (Name, E-Mail, Nachricht) zur Bearbeitung Ihrer Anfrage gespeichert. Diese Daten werden nicht an Dritte weitergegeben.</p>' +
            '<h4>Cookies</h4>' +
            '<p>Diese Website verwendet keine Tracking-Cookies. Es werden lediglich technisch notwendige Cookies eingesetzt, die für die Funktionalität der Website erforderlich sind.</p>' +
            '<h4>Externe Dienste</h4>' +
            '<p>Unsere Website nutzt folgende externe Dienste:</p>' +
            '<ul><li>Google Fonts — zum Laden von Schriftarten</li><li>Vercel — als Hosting-Plattform</li></ul>' +
            '<h4>Ihre Rechte</h4>' +
            '<p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer personenbezogenen Daten. Kontaktieren Sie uns unter info@lweb.ch.</p>' +
            '<h4>Änderungen</h4>' +
            '<p>Wir behalten uns vor, diese Datenschutzerklärung jederzeit anzupassen. Die aktuelle Fassung gilt ab dem Zeitpunkt der Veröffentlichung auf der Website.</p>'
    },
    agb: {
        title: 'Allgemeine Geschäftsbedingungen',
        icon: 'svc-modal-icon--support',
        html: '<h4>1. Geltungsbereich</h4>' +
            '<p>Diese AGB gelten für alle Dienstleistungen von Lweb (Roberto Salvador, 9475 Sevelen, Schweiz) im Bereich App-Entwicklung, Webentwicklung und KI-Lösungen.</p>' +
            '<h4>2. Angebote & Vertragsschluss</h4>' +
            '<p>Alle Angebote sind freibleibend. Ein Vertrag kommt erst durch schriftliche Auftragsbestätigung (auch per E-Mail) zustande. Der Preiskalkulator auf der Website dient als unverbindliche Schätzung.</p>' +
            '<h4>3. Leistungen</h4>' +
            '<p>Der Umfang der Leistungen ergibt sich aus der jeweiligen Auftragsbestätigung. Änderungen oder Zusatzleistungen werden gesondert vereinbart und berechnet.</p>' +
            '<h4>4. Preise & Zahlung</h4>' +
            '<p>Alle Preise verstehen sich in Schweizer Franken (CHF) und sind Endpreise (kein MwSt-Ausweis bei Einzelunternehmen unter CHF 100\'000 Umsatz). Die Zahlung erfolgt gemäss Vereinbarung, in der Regel 50% bei Auftragserteilung und 50% bei Projektabschluss.</p>' +
            '<h4>5. Lieferfristen</h4>' +
            '<p>Liefertermine werden individuell vereinbart. Verzögerungen durch unvorhergesehene Umstände oder fehlende Zulieferungen des Kunden verlängern die Lieferfrist entsprechend.</p>' +
            '<h4>6. Mitwirkungspflicht</h4>' +
            '<p>Der Kunde stellt alle erforderlichen Inhalte (Texte, Bilder, Logos, Zugänge) rechtzeitig zur Verfügung. Verzögerungen durch fehlende Zulieferungen gehen nicht zu Lasten von Lweb.</p>' +
            '<h4>7. Urheberrecht & Nutzungsrechte</h4>' +
            '<p>Nach vollständiger Bezahlung gehen die Nutzungsrechte am erstellten Werk auf den Kunden über. Lweb behält das Recht, das Projekt als Referenz in seinem Portfolio zu zeigen.</p>' +
            '<h4>8. Gewährleistung</h4>' +
            '<p>Lweb gewährleistet, dass die gelieferten Arbeiten frei von wesentlichen Fehlern sind. Mängel werden innerhalb von 30 Tagen nach Abnahme kostenlos behoben.</p>' +
            '<h4>9. Haftung</h4>' +
            '<p>Die Haftung von Lweb ist auf den jeweiligen Auftragswert beschränkt. Ausgeschlossen sind Schäden durch höhere Gewalt, Fehler Dritter oder unsachgemässe Nutzung.</p>' +
            '<h4>10. Anwendbares Recht & Gerichtsstand</h4>' +
            '<p>Es gilt Schweizer Recht. Gerichtsstand ist Buchs SG, Schweiz.</p>'
    }
};

function openLegalModal(type) {
    var content = legalContent[type];
    if (!content) return;

    document.getElementById('legalModalIcon').className = 'svc-modal-icon ' + content.icon;
    document.getElementById('legalModalTitle').textContent = content.title;

    var body = document.getElementById('legalModalBody');
    body.innerHTML = content.html;

    // Stagger animation for h4 and p elements
    var items = body.querySelectorAll('h4, p, ul');
    for (var i = 0; i < items.length; i++) {
        items[i].classList.add('web-modal-stagger');
        items[i].style.animationDelay = (i * 50) + 'ms';
    }

    document.getElementById('legalModalOverlay').classList.add('open');
    document.getElementById('legalModal').classList.add('open');
    document.body.classList.add('svc-modal-open');
}

function closeLegalModal() {
    document.getElementById('legalModalOverlay').classList.remove('open');
    document.getElementById('legalModal').classList.remove('open');
    document.body.classList.remove('svc-modal-open');
}