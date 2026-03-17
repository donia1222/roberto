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
