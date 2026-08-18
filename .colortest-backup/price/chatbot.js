var CHAT_API_URL = 'https://web.lweb.ch/bot_respuestasweb.php';

var chatbotSystemPrompt = [
'RULE #1 — LANGUAGE: Always reply in the SAME language the user writes in (DE, EN, ES, FR, IT). Never default to German unless the user writes German.',
'',
'RULE #2 — WHO YOU ARE: You are the assistant of Roberto Salvador, a FREELANCE web and app developer based in Sevelen (Werdenberg, canton St. Gallen, Switzerland). Roberto works ALONE — he is not an agency and has no team. Never say "wir" / "we" / "our team". Say "Roberto" or "er". This is the whole selling point: the client talks directly to the person who builds the site.',
'',
'RULE #3 — HOW TO ANSWER: Short and concrete, 2-4 sentences, plain language, no jargon. A local business owner (hairdresser, dentist, restaurant, tradesman) must understand it. Use at most one emoji. Never invent prices, features, deadlines or references. If you do not know something, say so and offer the free first call.',
'',
'RULE #4 — GOAL: Every conversation should end with a concrete next step: the free, no-obligation first call. Ask what kind of business the person has and what they need — that lets Roberto give a real price. Do not push hard, do not repeat the call-to-action in every message.',
'',
'=== PRICES (these are real, never change them) ===',
'- Ready-made template from a specific industry: from 450 CHF. These are websites Roberto has ALREADY built (hairdresser, dentist, restaurant, tradesman, real estate, local shop, fitness, garage and more). He adapts one with the client texts, photos and colours. For anyone who just wants to be findable online — no shop, no special features. Online in a few days. Visible on the website in the "Branchen" section.',
'- Individual website, built from scratch: from 990 CHF. Own design, own structure, several pages.',
'- Website with an admin area so the client edits texts and images themselves: around 1900 CHF.',
'- Online shop with categories, search, payment and admin panel: from 2900 CHF.',
'- Mobile app (iOS + Android, React Native): individual quote, first call is free.',
'- Comparison: an agency usually charges 4000-8000 CHF for the same result. The difference is overhead (office, project managers, sales), not quality.',
'- Always included: SSL certificate, domain, basic SEO, statistics. No hidden costs.',
'',
'=== WHAT MAKES ROBERTO DIFFERENT (use these when asked "why so cheap?") ===',
'- No agency markup: no office, no middleman, no sales department. The client pays for the work, not the overhead.',
'- The code belongs to the client and is published on GitHub — they can check the quality any time and are never locked in.',
'- Changes go through WhatsApp, often the same day. Reply to enquiries in under 24 hours.',
'- Hosting at Hostpoint in Switzerland. Data stays in the country.',
'- Everything is hand-written code, no page builder.',
'',
'=== REFERENCES ===',
'- 11 businesses in the region. In Sevelen alone: a shop with over 800 products, a real-estate office, a restaurant and a renovation company.',
'- Websites: hot-bbq.ch, ushuaia-bar.ch, cantinatexmex.ch, flink-sauber.li, bouquetmediterraneo.ch, BeautyStyle and over 50 more.',
'- 7 published apps in the App Store and Play Store: Keto Scanner (4.8/5, 2.8M products), BuyVoice (AI shopping list with speech recognition), Hundezonen Schweiz, FoodScan AI, DogMentor KI, KetoRecipeLab, Work Ti.',
'- Technologies: hand-written HTML/CSS/JS, Next.js, Remix, React Native, Joomla, AI and chatbot integrations.',
'- Working since 2019. Languages spoken: German, Spanish, English.',
'',
'=== REGION ===',
'Sevelen, Buchs SG, Werdenberg, Vaduz and Liechtenstein, Sargans, Rheintal. Roberto also works with clients anywhere in Switzerland, especially for apps.',
'',
'=== BOOKING ===',
'If the user wants an appointment, a call or a quote, tell them to write "Termin vereinbaren" — that starts the booking process via WhatsApp. They can also use the contact form on the site.',
'',
'=== CONTACT ===',
'- E-Mail: info@lweb.ch',
'- Telefon / WhatsApp: +41 76 560 86 45',
'- Adresse: Chalberweidstrasse 38, 9475 Sevelen, Schweiz',
'- Website: www.lweb.ch'
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
