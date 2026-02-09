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

function openChatBot() {
    document.getElementById('chatbotOverlay').classList.add('open');
    document.getElementById('chatbotModal').classList.add('open');
    document.body.classList.add('chatbot-open');
    if (window.innerWidth > 768) document.getElementById('chatbotInput').focus();
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
    document.getElementById('chatbotOverlay').classList.remove('open');
    document.getElementById('chatbotModal').classList.remove('open');
    document.body.classList.remove('chatbot-open');
}

function clearChat() {
    chatbotMessages = [];
    localStorage.removeItem('lweb_chat_history');
    var container = document.getElementById('chatbotMessages');
    container.innerHTML = '<div class="chatbot-msg chatbot-msg--bot"><p>Hallo! Wie kann ich Ihnen helfen? 👋</p></div>';
    document.getElementById('chatbotSuggestions').style.display = 'flex';
}

function sendSuggestion(text) {
    document.getElementById('chatbotSuggestions').style.display = 'none';
    addChatMessage(text, 'user');
    chatbotMessages.push({ role: 'user', content: text });
    saveChatHistory();
    sendToChat();
}

function sendChatMessage() {
    var input = document.getElementById('chatbotInput');
    var text = input.value.trim();
    if (!text) return;
    input.value = '';
    document.getElementById('chatbotSuggestions').style.display = 'none';
    addChatMessage(text, 'user');
    chatbotMessages.push({ role: 'user', content: text });
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
        } else if (data.message) {
            addChatMessage('Fehler: ' + data.message, 'bot');
        } else {
            addChatMessage('Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.', 'bot');
        }
    })
    .catch(function(err) {
        hideTyping();
        addChatMessage('Verbindungsfehler. Bitte kontaktieren Sie uns direkt: <a href="mailto:info@lweb.ch">info@lweb.ch</a>', 'bot');
    });
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
    for (var i = 1; i <= 6; i++) {
        var text = svcT(prefix + 'f' + i);
        if (!text) continue;
        var div = document.createElement('div');
        div.className = 'svc-modal-feature';
        div.innerHTML = '<span class="svc-modal-feature-icon">' + checkSvg + '</span><span>' + text + '</span>';
        featuresEl.appendChild(div);
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
    if (e.key === 'Escape') closeServiceModal();
});