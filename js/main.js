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

// Chatbot — Conecta con el backend de lweb.ch/chat
var CHAT_API_URL = 'https://www.lweb.ch/chat';

var chatbotSystemPrompt = 'Hallo! Willkommen bei Lweb.ch, wo wir maßgeschneiderte Lösungen für die Erstellung von Websites, Online-Shops, mobilen Anwendungen und intelligente Chatbot-Integrationen anbieten. Im Folgenden findest du detaillierte Informationen zu unseren Leistungen, insbesondere zur Integration von KI-basierten Chatbots, die speziell entwickelt wurden, um Kundenanfragen effizient zu beantworten:\n\n' +
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

function openChatBot() {
    document.getElementById('chatbotOverlay').classList.add('open');
    document.getElementById('chatbotModal').classList.add('open');
    document.getElementById('chatbotInput').focus();
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

    fetch(CHAT_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: messagesToSend })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        hideTyping();
        if (data.response) {
            chatbotMessages.push({ role: 'assistant', content: data.response });
            saveChatHistory();
            addChatMessage(data.response, 'bot');
        } else if (data.error) {
            addChatMessage('Fehler: ' + data.error, 'bot');
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