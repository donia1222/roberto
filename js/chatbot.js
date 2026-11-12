var CHAT_API_URL = 'https://web.lweb.ch/bot_respuestasweb.php';

var chatbotSystemPrompt = [
'RULE #1 — LANGUAGE: Always reply in the SAME language the user writes in (German, Swiss German, English, Spanish, French, Italian). Never switch to German unless the user writes German. Use the polite form (Sie / usted / vous / Lei).',
'',
'RULE #2 — WHO YOU ARE: You are the assistant of Lweb, a small family business in Sevelen (Werdenberg, canton St. Gallen, Switzerland) run by Andrea and Roberto Salvador. Andrea grew up in the region and knows the people. She is in the office in Sevelen and is the first contact: every project starts with her — she answers the phone and WhatsApp, listens and clarifies calmly what the client really needs. Roberto then builds it. If someone wants to talk to a person, say that Andrea is there for them (phone/WhatsApp below) and answers as soon as possible, usually within 24 hours — never promise she is available at any time and never invent office hours. There is no agency, no sales team, no middleman: the client always talks directly to the two people who do the work. You may say "wir" / "we" when you mean Andrea and Roberto.',
'',
'RULE #3 — HOW TO ANSWER: Short and concrete: 2–4 sentences, plain language, no jargon. A hairdresser, a dentist, a restaurant owner or a tradesman must understand it. At most one emoji. Plain text only: NO Markdown (no **, no #, no lists with *). The only HTML you may use are links, written exactly like this: <a href="booking.html">Termin vereinbaren</a>, <a href="https://wa.me/41793749032">WhatsApp</a>, <a href="mailto:info@lweb.ch">info@lweb.ch</a>. Never invent prices, features, deadlines, clients, apps or reviews. If you do not know something, say so honestly and offer the free first conversation.',
'',
'RULE #4 — GOAL: Help the person understand what they could get, and end with ONE concrete next step: either the free sample page (Gratis-Muster) or the free 30-minute first conversation. Ask what kind of business they have and what they need. Do not push, do not repeat the call-to-action in every message.',
'',
'=== PRICES — VERY IMPORTANT ===',
'- Lweb has NO fixed price list. Every project is different, so every client gets an individual, fixed quote after a short conversation — no surprises, no hidden costs, no subscription.',
'- The only figures you may mention are the ones on the website: ready-made industry templates from 650 CHF, and apps (iOS + Android) from CHF 3,500 (see ihreapp.ch). For everything else (individual website, admin area, online shop, booking system, apps with special features) say that the price depends on what is needed and that they get a fixed offer after the first conversation.',
'- Lweb is flexible with budgets: Andrea and Roberto care more about a happy client and a good Google review than about a high price. If someone has a small budget, say: tell us your budget and we will look for a solution that fits.',
'- Agencies often charge several thousand francs for the same result; the difference is overhead (office, project managers, sales), not quality.',
'- Never promise discounts or payment methods (e.g. TWINT) that are not stated here.',
'',
'=== GRATIS-MUSTER (free sample page) ===',
'On the website there is a form "Ich will mein Gratis-Muster": in about five minutes the person says what they like, and Lweb designs a personal sample page for their business — free and without obligation, sent by e-mail within 2–3 working days. Personally designed, not a template. Recommend it to anyone who is unsure or wants to see first.',
'',
'=== WHAT LWEB BUILDS ===',
'- Websites for local businesses: from a ready-made industry template (online in a few days) to an individually designed site; also modern interactive websites.',
'- Pieces that can be added at any time, without starting over: online appointment booking with confirmation e-mails, an admin area where the client changes texts, prices, photos and opening hours themselves, gift vouchers, online shop, multiple languages.',
'- An invoicing panel (invoices, expenses, customers) that belongs to the client: pay once, no monthly fee, data on their own hosting. A demo is linked on the website.',
'- Mobile apps for iOS and Android (React Native), with a free first conversation.',
'- AI features inside a website or app (e.g. a chatbot like this one), using the AI service that fits the project best.',
'- If asked about OpenAI, ChatGPT or which AI Lweb uses: Roberto develops with Claude Code (from Anthropic). For AI features inside client projects he connects whichever service fits best (for example OpenAI or Google). Lweb is not tied to one provider.',
'',
'=== HOW LWEB WORKS ===',
'- First a free conversation with Andrea (about 30 minutes): what does the business need, what is the budget.',
'- Then a fixed offer. Roberto builds the site; the client sees it before it goes online.',
'- Time: a small site in a few days, a company site usually in one to two weeks. What takes longest are usually the texts and photos, not the technology.',
'- Changes after launch: via WhatsApp, often the same day.',
'- Roberto develops with modern AI tools (Claude Code), so the work is fast and carefully tested — but every line is checked by him and everything is custom-made, no page builder.',
'- Hosting at Hostpoint in Switzerland: the data stays in the country. SSL, domain, basic SEO and statistics are included.',
'- The code belongs to the client: no lock-in.',
'- Existing websites can be redesigned; old addresses are redirected so Google rankings are kept.',
'',
'=== REFERENCES (only mention these) ===',
'- Businesses in the region (Buchs SG, Sevelen, Sax, Vaduz, Schaan, St. Gallen), for example: Cantina Tex-Mex and Ushuaia Bar in Buchs, US Fishing & Hunting in Sevelen (an online shop with hundreds of products), Flink Sauber in Vaduz, Leder-Shop in Sax, Nick Renovation and Inotec in Sevelen, Sabitas in St. Gallen, Braidz\u2019n Tips in Schaan.',
'- Four own apps currently published in the App Store and Google Play: Hundezonen (hundezonen.ch, dog zones in Switzerland), Arbeitszeitkontrolle (arbeitszeitkontrolle.app, working-time tracking), Voice Grocery (voicegrocerylist.com, shopping list by voice) and KetoScan (keto-scan.com). Do not name other apps.',
'- 5.0 stars on Google. Working since 2019.',
'',
'=== REGION ===',
'Sevelen, Buchs SG, Werdenberg, Sargans, Rheintal, St. Gallen and Liechtenstein — and anywhere in Switzerland, especially for apps. Languages: German, Swiss German, Spanish and English.',
'',
'=== BOOKING & CONTACT ===',
'- Free first conversation: <a href="booking.html">Termin vereinbaren</a> (pick a time online).',
'- WhatsApp or phone: +41 79 374 90 32 (Andrea) — <a href="https://wa.me/41793749032">WhatsApp</a>',
'- E-mail: <a href="mailto:info@lweb.ch">info@lweb.ch</a>',
'- Address: Chalberweidstrasse 38, 9475 Sevelen, Switzerland · www.lweb.ch',
'- If the user writes "Kontaktdaten" or asks for contact details, list these. If the user writes "Termin vereinbaren", give the booking link and the WhatsApp link.'
].join('\n');

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
        // On desktop (>768px), skip welcome and go straight to text mode (no voice option)
        if (window.innerWidth > 768) {
            chatModeChosen = true;
            showChatView();
            document.getElementById('chatbotInput').focus();
        } else {
            document.getElementById('chatbotWelcome').style.display = 'flex';
            document.getElementById('chatbotMessages').style.display = 'none';
            document.getElementById('chatbotSuggestions').style.display = 'none';
            document.querySelector('.chatbot-input-area').style.display = 'none';
            document.querySelector('.chatbot-clear').style.display = 'none';
        }
    } else {
        showChatView();
    }
}

function chooseChatMode(mode) {
    chatModeChosen = true;
    document.getElementById('chatbotWelcome').style.display = 'none';
    if (mode === 'voice') {
        showChatView();
        // Check microphone permission before starting voice
        if (navigator.permissions && navigator.permissions.query) {
            navigator.permissions.query({ name: 'microphone' }).then(function(result) {
                if (result.state === 'denied') {
                    alert(getVoiceDeniedMessage());
                    chatModeChosen = false;
                    document.getElementById('chatbotWelcome').style.display = 'flex';
                    document.getElementById('chatbotMessages').style.display = 'none';
                    document.getElementById('chatbotSuggestions').style.display = 'none';
                    document.querySelector('.chatbot-input-area').style.display = 'none';
                    document.querySelector('.chatbot-clear').style.display = 'none';
                } else {
                    startVoiceCall();
                }
            }).catch(function() {
                startVoiceCall();
            });
        } else {
            startVoiceCall();
        }
    } else {
        showChatView();
        if (window.innerWidth > 768) document.getElementById('chatbotInput').focus();
    }
}

function getVoiceDeniedMessage() {
    var lang = document.documentElement.lang || 'de';
    var messages = {
        'de': 'Mikrofon-Zugriff wurde verweigert. Bitte erlauben Sie den Zugriff in Ihren Browser-Einstellungen und versuchen Sie es erneut.',
        'es': 'El acceso al micrófono fue denegado. Por favor, permita el acceso en la configuración de su navegador e inténtelo de nuevo.',
        'en': 'Microphone access was denied. Please allow access in your browser settings and try again.',
        'fr': 'L\'accès au microphone a été refusé. Veuillez autoriser l\'accès dans les paramètres de votre navigateur et réessayer.'
    };
    return messages[lang] || messages['de'];
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
    document.getElementById('chatbotSuggestions').style.display = 'none';
    addChatMessage(text, 'user');
    chatbotMessages.push({ role: 'user', content: text });
    document.querySelector('.chatbot-clear').style.display = 'inline-flex';
    saveChatHistory();
    sendToChat();
}

/* Lo que escribe el bot se enseña como texto. Solo se dejan pasar los enlaces a la reserva, WhatsApp, correo,
   teléfono y las páginas de lweb, y la **negrita** de Markdown (12/11/2026). */
function limpiaBot(t) {
    var enlaces = [];
    t = String(t).replace(/<a\s+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, function(m, href, txt) {
        if (!/^(booking\.html|https:\/\/wa\.me\/\d+|mailto:[^"\s]+|tel:[+\d ]+|https:\/\/(www\.)?lweb\.ch[^"\s]*|https:\/\/(www\.)?ihreapp\.ch[^"\s]*)$/i.test(href)) return txt;
        enlaces.push('<a href="' + href.replace(/"/g, '') + '"' + (/^https:/i.test(href) ? ' target="_blank" rel="noopener"' : '') + '>' + txt.replace(/</g, '&lt;') + '</a>');
        return '\u0000' + (enlaces.length - 1) + '\u0000';
    });
    t = t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    t = t.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
    return t.replace(/\u0000(\d+)\u0000/g, function(m, n) { return enlaces[+n]; });
}

function addChatMessage(text, sender, skipAnim) {
    var container = document.getElementById('chatbotMessages');
    var msg = document.createElement('div');
    msg.className = 'chatbot-msg chatbot-msg--' + sender;
    if (skipAnim) msg.style.animation = 'none';
    var p = document.createElement('p');
    if (sender === 'bot') {
        p.innerHTML = limpiaBot(text);
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
                setTimeout(function() {
                    if (voiceCallActive) {
                        voiceWaitingResponse = false;
                        voiceSetStatus('Zuhören...', 'Sprechen Sie jetzt...');
                        document.getElementById('chatbotVoiceCircle').className = 'chatbot-voice-circle listening';
                    }
                }, 3000);
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
            setTimeout(function() {
                if (voiceCallActive) {
                    voiceWaitingResponse = false;
                    voiceSetStatus('Zuhören...', 'Sprechen Sie jetzt...');
                    document.getElementById('chatbotVoiceCircle').className = 'chatbot-voice-circle listening';
                }
            }, 3000);
        }
    });
}

// ===== VOICE / SPEECH =====
var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
var micRecognition = null;
var voiceRecognition = null;
var micActive = false;
var voiceCallActive = false;
var voiceWaitingResponse = false;

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
    voiceWaitingResponse = false;
    document.getElementById('chatbotMicBtn').classList.add('recording');
    document.getElementById('chatbotVoiceOverlay').classList.add('active');
    voiceSetStatus('Zuhören...', 'Sprechen Sie jetzt');
    document.getElementById('chatbotVoiceCircle').className = 'chatbot-voice-circle listening';

    try {
        voiceRecognition = new SpeechRecognition();
    } catch(e) {
        voiceSetStatus('Fehler', 'Spracherkennung nicht verfügbar');
        stopVoiceCall();
        return;
    }
    voiceRecognition.lang = 'de-DE';
    voiceRecognition.interimResults = true;
    voiceRecognition.continuous = true;

    voiceRecognition.onresult = function(e) {
        if (voiceWaitingResponse) return;
        var transcript = '';
        var isFinal = false;
        for (var i = e.resultIndex; i < e.results.length; i++) {
            transcript += e.results[i][0].transcript;
            if (e.results[i].isFinal) isFinal = true;
        }
        voiceSetStatus('Zuhören...', '«' + transcript + '»');
        if (isFinal && transcript.trim()) {
            voiceWaitingResponse = true;
            document.getElementById('chatbotSuggestions').style.display = 'none';
            addChatMessage(transcript.trim(), 'user');
            chatbotMessages.push({ role: 'user', content: transcript.trim() });
            document.querySelector('.chatbot-clear').style.display = 'inline-flex';
            saveChatHistory();
            voiceSetStatus('Verarbeiten...', '«' + transcript.trim() + '»');
            document.getElementById('chatbotVoiceCircle').className = 'chatbot-voice-circle';
            sendToChat();
        }
    };
    voiceRecognition.onerror = function(e) {
        console.log('Voice error:', e.error);
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
            stopVoiceCall();
            alert(getVoiceDeniedMessage());
            chatModeChosen = false;
            document.getElementById('chatbotWelcome').style.display = 'flex';
            document.getElementById('chatbotMessages').style.display = 'none';
            document.getElementById('chatbotSuggestions').style.display = 'none';
            document.querySelector('.chatbot-input-area').style.display = 'none';
            document.querySelector('.chatbot-clear').style.display = 'none';
        }
    };
    voiceRecognition.onend = function() {
        if (voiceCallActive) {
            setTimeout(function() {
                if (voiceCallActive && voiceRecognition) {
                    try { voiceRecognition.start(); } catch(e) {}
                }
            }, 300);
        }
    };

    try {
        voiceRecognition.start();
    } catch(e) {
        voiceSetStatus('Fehler', 'Spracherkennung nicht verfügbar');
    }
}

function stopVoiceCall() {
    voiceCallActive = false;
    voiceWaitingResponse = false;
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

// Auto-open chatbot if navigated from another page with #chatbot hash
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.hash === '#chatbot') {
        history.replaceState(null, null, window.location.pathname + window.location.search);
        setTimeout(function() { openChatBot(); }, 150);
    }
});
