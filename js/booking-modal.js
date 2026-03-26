/* =========================================================
   BOOKING MODAL — Termin vereinbaren mit Lweb
   Standalone file: include with <script src="js/booking-modal.js">
   Opens with: openBookingModal()
   ========================================================= */

(function () {
  /* ─── Translations ──────────────────────────────────────── */
  const T = {
    de: {
      badge: 'Kostenlose Beratung (30 Minuten)',
      title: 'Termin vereinbaren',
      sub: 'Ich berate Sie gerne persönlich — direkt, unkompliziert und ohne Verpflichtung.',
      step1: 'Wählen Sie einen Service',
      step2: 'Datum & Uhrzeit wählen',
      step3: 'Ihre Kontaktdaten',
      step4: 'Terminbestätigung',
      services: ['Website / Webseite', 'Mobile App (iOS & Android)', 'KI-Chatbot / Automation', 'Kostenlose Beratung'],
      next: 'Weiter',
      back: 'Zurück',
      confirm: 'Termin anfragen',
      sending: 'Wird gesendet…',
      name: 'Ihr Name *',
      email: 'E-Mail-Adresse *',
      phone: 'Telefonnummer',
      msgLabel: 'Weitere Informationen (optional)',
      days: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
      months: ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'],
      noSlot: 'Kein Termin an diesem Tag',
      successTitle: 'Termin angefragt! 🎉',
      successText: 'Ich melde mich innerhalb von 24 Stunden bei Ihnen. Bis bald!',
      summaryService: 'Service',
      summaryDate: 'Datum',
      summaryTime: 'Uhrzeit',
      summaryName: 'Name',
      summaryEmail: 'E-Mail',
      summaryPhone: 'Telefon',
      newBook: 'Neuen Termin anfragen',
      requiredErr: 'Bitte füllen Sie alle Pflichtfelder aus.',
      pickDate: 'Bitte wählen Sie zuerst ein Datum.',
    },
    en: {
      badge: 'Free Consultation (30 minutes)',
      title: 'Book a Meeting',
      sub: 'I\'d love to advise you personally — direct, simple, and with no obligation.',
      step1: 'Choose a Service',
      step2: 'Select Date & Time',
      step3: 'Your Contact Details',
      step4: 'Booking Confirmation',
      services: ['Website / Web Page', 'Mobile App (iOS & Android)', 'AI Chatbot / Automation', 'Free Consultation'],
      next: 'Continue',
      back: 'Back',
      confirm: 'Request Appointment',
      sending: 'Sending…',
      name: 'Your Name *',
      email: 'Email Address *',
      phone: 'Phone Number',
      msgLabel: 'Additional Information (optional)',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
      noSlot: 'No slots on this day',
      successTitle: 'Appointment Requested! 🎉',
      successText: 'I\'ll get back to you within 24 hours. See you soon!',
      summaryService: 'Service',
      summaryDate: 'Date',
      summaryTime: 'Time',
      summaryName: 'Name',
      summaryEmail: 'Email',
      summaryPhone: 'Phone',
      newBook: 'Request New Appointment',
      requiredErr: 'Please fill in all required fields.',
      pickDate: 'Please select a date first.',
    },
    es: {
      badge: 'Consulta gratuita (30 minutos)',
      title: 'Reservar una cita',
      sub: 'Me encantaría asesorarte personalmente — directo, sencillo y sin compromiso.',
      step1: 'Elige un servicio',
      step2: 'Selecciona fecha y hora',
      step3: 'Tus datos de contacto',
      step4: 'Confirmación de cita',
      services: ['Página web / Website', 'App móvil (iOS & Android)', 'Chatbot IA / Automatización', 'Consulta gratuita'],
      next: 'Continuar',
      back: 'Atrás',
      confirm: 'Solicitar cita',
      sending: 'Enviando…',
      name: 'Tu nombre *',
      email: 'Correo electrónico *',
      phone: 'Número de teléfono',
      msgLabel: 'Información adicional (opcional)',
      days: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'],
      months: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
      noSlot: 'No hay horarios disponibles',
      successTitle: '¡Cita solicitada! 🎉',
      successText: 'Me pondré en contacto contigo en menos de 24 horas. ¡Hasta pronto!',
      summaryService: 'Servicio',
      summaryDate: 'Fecha',
      summaryTime: 'Hora',
      summaryName: 'Nombre',
      summaryEmail: 'Correo',
      summaryPhone: 'Teléfono',
      newBook: 'Solicitar nueva cita',
      requiredErr: 'Por favor, rellena todos los campos obligatorios.',
      pickDate: 'Por favor, selecciona primero una fecha.',
    },
    fr: {
      badge: 'Consultation gratuite (30 minutes)',
      title: 'Prendre rendez-vous',
      sub: 'Je vous conseille volontiers en personne — directement, simplement et sans engagement.',
      step1: 'Choisissez un service',
      step2: 'Choisissez date & heure',
      step3: 'Vos coordonnées',
      step4: 'Confirmation du rendez-vous',
      services: ['Site web / Page web', 'Application mobile (iOS & Android)', 'Chatbot IA / Automatisation', 'Consultation gratuite'],
      next: 'Continuer',
      back: 'Retour',
      confirm: 'Demander un rendez-vous',
      sending: 'Envoi en cours…',
      name: 'Votre nom *',
      email: 'Adresse e-mail *',
      phone: 'Numéro de téléphone',
      msgLabel: 'Informations supplémentaires (optionnel)',
      days: ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'],
      months: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
      noSlot: 'Aucun créneau ce jour',
      successTitle: 'Rendez-vous demandé ! 🎉',
      successText: 'Je vous recontacte dans les 24 heures. À bientôt !',
      summaryService: 'Service',
      summaryDate: 'Date',
      summaryTime: 'Heure',
      summaryName: 'Nom',
      summaryEmail: 'E-mail',
      summaryPhone: 'Téléphone',
      newBook: 'Nouveau rendez-vous',
      requiredErr: 'Veuillez remplir tous les champs obligatoires.',
      pickDate: 'Veuillez d\'abord sélectionner une date.',
    },
    it: {
      badge: 'Consulenza gratuita (30 minuti)',
      title: 'Prenota un appuntamento',
      sub: 'Sono felice di consigliarti personalmente — diretto, semplice e senza impegno.',
      step1: 'Scegli un servizio',
      step2: 'Scegli data e orario',
      step3: 'I tuoi dati di contatto',
      step4: 'Conferma appuntamento',
      services: ['Sito web / Pagina web', 'App mobile (iOS & Android)', 'Chatbot IA / Automazione', 'Consulenza gratuita'],
      next: 'Continua',
      back: 'Indietro',
      confirm: 'Richiedi appuntamento',
      sending: 'Invio in corso…',
      name: 'Il tuo nome *',
      email: 'Indirizzo e-mail *',
      phone: 'Numero di telefono',
      msgLabel: 'Informazioni aggiuntive (opzionale)',
      days: ['Lu', 'Ma', 'Me', 'Gi', 'Ve', 'Sa', 'Do'],
      months: ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'],
      noSlot: 'Nessuno slot disponibile',
      successTitle: 'Appuntamento richiesto! 🎉',
      successText: 'Ti ricontatterò entro 24 ore. A presto!',
      summaryService: 'Servizio',
      summaryDate: 'Data',
      summaryTime: 'Orario',
      summaryName: 'Nome',
      summaryEmail: 'E-mail',
      summaryPhone: 'Telefono',
      newBook: 'Nuovo appuntamento',
      requiredErr: 'Compila tutti i campi obbligatori.',
      pickDate: 'Seleziona prima una data.',
    }
  };

  /* ─── State ─────────────────────────────────────────────── */
  let state = { step: 1, service: null, date: null, time: null, calYear: null, calMonth: null };

  /* ─── Helpers ───────────────────────────────────────────── */
  function getLang() {
    const active = document.querySelector('.lang-btn.active');
    return (active && T[active.textContent.toLowerCase()]) ? active.textContent.toLowerCase() : 'de';
  }
  function t(key) { return T[getLang()][key]; }

  /* ─── Inject CSS ─────────────────────────────────────────── */
  function injectCSS() {
    if (document.getElementById('bm-style')) return;
    const s = document.createElement('style');
    s.id = 'bm-style';
    s.textContent = `
.bm-overlay{position:fixed;inset:0;background:rgba(15,29,44,.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);z-index:1300;opacity:0;pointer-events:none;transition:opacity 400ms cubic-bezier(.4,0,.2,1)}
.bm-overlay.open{opacity:1;pointer-events:all}
.bm-modal{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(.88) translateY(28px);width:560px;max-width:calc(100% - 24px);max-height:calc(100vh - 40px);background:#fff;border-radius:20px;box-shadow:0 28px 80px rgba(0,0,0,.22);z-index:1301;overflow:hidden;display:flex;flex-direction:column;opacity:0;pointer-events:none;transition:opacity 420ms cubic-bezier(.4,0,.2,1),transform 440ms cubic-bezier(.34,1.56,.64,1)}
.bm-modal.open{opacity:1;transform:translate(-50%,-50%) scale(1) translateY(0);pointer-events:all}
.bm-close{position:absolute;top:14px;right:14px;width:34px;height:34px;border-radius:50%;border:none;background:rgba(0,0,0,.06);color:#555;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:10;transition:all 180ms ease}
.bm-close:hover{background:rgba(0,0,0,.13);color:#111}
.bm-header{padding:26px 28px 0;flex-shrink:0}
.bm-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(77,211,91,.12);color:#1a9e2e;font-size:12px;font-weight:700;padding:5px 12px;border-radius:100px;margin-bottom:14px;letter-spacing:.01em}
.bm-badge svg{flex-shrink:0}
.bm-title{font-size:22px;font-weight:800;color:#0f1d2c;margin:0 0 6px;letter-spacing:-.03em}
.bm-sub{font-size:14px;color:#6b7280;margin:0 0 20px;line-height:1.5}
.bm-progress{height:3px;background:#f1f5f9;flex-shrink:0;margin:0 28px}
.bm-prog-bar{height:100%;background:linear-gradient(90deg,#fe6c75,#ff9a9e);border-radius:2px;transition:width 400ms cubic-bezier(.4,0,.2,1)}
.bm-body{flex:1;overflow-y:auto;padding:22px 28px 10px;scrollbar-width:thin;scrollbar-color:#e2e8f0 transparent}
.bm-body::-webkit-scrollbar{width:4px}
.bm-body::-webkit-scrollbar-track{background:transparent}
.bm-body::-webkit-scrollbar-thumb{background:#e2e8f0;border-radius:2px}
.bm-step-label{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#fe6c75;margin-bottom:10px}
.bm-step{display:none;animation:bmFadeIn .28s ease}
.bm-step.active{display:block}
@keyframes bmFadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}

/* Service cards */
.bm-services{display:grid;gap:10px}
.bm-svc{display:flex;align-items:center;gap:14px;padding:14px 16px;border:2px solid #e2e8f0;border-radius:12px;cursor:pointer;transition:all 180ms ease;background:#fff;text-align:left;width:100%}
.bm-svc:hover{border-color:#fe6c75;background:#fff5f5}
.bm-svc.selected{border-color:#fe6c75;background:#fff5f5;box-shadow:0 0 0 4px rgba(254,108,117,.08)}
.bm-svc-icon{width:40px;height:40px;border-radius:10px;background:#fff5f5;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:20px}
.bm-svc.selected .bm-svc-icon{background:#fe6c75;color:#fff}
.bm-svc-text strong{display:block;font-size:14px;font-weight:700;color:#0f1d2c}
.bm-svc-text span{font-size:12px;color:#9ca3af}
.bm-svc-check{margin-left:auto;width:20px;height:20px;border-radius:50%;border:2px solid #e2e8f0;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 180ms ease}
.bm-svc.selected .bm-svc-check{background:#fe6c75;border-color:#fe6c75;color:#fff}

/* Calendar */
.bm-cal-nav{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
.bm-cal-month{font-size:15px;font-weight:700;color:#0f1d2c}
.bm-cal-arrow{background:none;border:1.5px solid #e2e8f0;border-radius:8px;width:32px;height:32px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#555;transition:all 150ms ease}
.bm-cal-arrow:hover{border-color:#fe6c75;color:#fe6c75}
.bm-cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;text-align:center}
.bm-cal-dow{font-size:11px;font-weight:600;color:#9ca3af;padding:4px 0;text-transform:uppercase}
.bm-cal-day{aspect-ratio:1;display:flex;align-items:center;justify-content:center;border-radius:8px;font-size:13px;font-weight:500;cursor:pointer;transition:all 150ms ease;border:none;background:none;color:#0f1d2c}
.bm-cal-day:hover:not(.bm-day-disabled):not(.bm-day-past){background:#fff5f5;color:#fe6c75}
.bm-cal-day.selected{background:#fe6c75;color:#fff;font-weight:700}
.bm-cal-day.bm-day-today{font-weight:800;color:#fe6c75}
.bm-cal-day.bm-day-today.selected{color:#fff}
.bm-cal-day.bm-day-disabled,.bm-cal-day.bm-day-past{color:#d1d5db;cursor:default;pointer-events:none}
.bm-cal-day.bm-day-empty{pointer-events:none}

/* Time slots */
.bm-slots-wrap{margin-top:18px}
.bm-slots-label{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#6b7280;margin-bottom:10px}
.bm-slots{display:flex;flex-wrap:wrap;gap:8px}
.bm-slot{padding:8px 16px;border:1.5px solid #e2e8f0;border-radius:100px;font-size:13px;font-weight:600;color:#374151;cursor:pointer;transition:all 160ms ease;background:#fff}
.bm-slot:hover{border-color:#fe6c75;color:#fe6c75;background:#fff5f5}
.bm-slot.selected{background:#fe6c75;border-color:#fe6c75;color:#fff}
.bm-slots-empty{font-size:13px;color:#9ca3af;padding:8px 0}

/* Inputs */
.bm-field{margin-bottom:14px}
.bm-field label{display:block;font-size:12px;font-weight:700;color:#374151;margin-bottom:6px;letter-spacing:.01em}
.bm-field input,.bm-field select,.bm-field textarea{width:100%;padding:11px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;color:#0f1d2c;background:#fff;outline:none;transition:border-color 180ms ease;font-family:inherit;box-sizing:border-box}
.bm-field input:focus,.bm-field select:focus,.bm-field textarea:focus{border-color:#fe6c75}
.bm-field textarea{resize:vertical;min-height:80px;line-height:1.5}
.bm-row2{display:grid;grid-template-columns:1fr 1fr;gap:12px}

/* Footer */
.bm-footer{padding:14px 28px 22px;flex-shrink:0;display:flex;gap:10px;justify-content:flex-end}
.bm-btn{height:44px;padding:0 24px;border-radius:100px;border:none;cursor:pointer;font-size:14px;font-weight:700;display:flex;align-items:center;gap:8px;transition:all 200ms ease;font-family:inherit}
.bm-btn-back{background:transparent;border:1.5px solid #e2e8f0;color:#555}
.bm-btn-back:hover{border-color:#aaa;color:#111}
.bm-btn-next{background:#fe6c75;color:#fff;box-shadow:0 6px 20px rgba(254,108,117,.32)}
.bm-btn-next:hover{background:#ff8a91;transform:translateY(-1px)}
.bm-btn-next:disabled{background:#f1a0a5;box-shadow:none;cursor:not-allowed;transform:none}

/* Confirmation */
.bm-confirm-wrap{text-align:center;padding:8px 0 12px}
.bm-confirm-check{width:72px;height:72px;background:linear-gradient(135deg,#fe6c75,#ff9a9e);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 18px;animation:bmPop .5s cubic-bezier(.34,1.56,.64,1)}
@keyframes bmPop{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}
.bm-confirm-title{font-size:22px;font-weight:800;color:#0f1d2c;margin-bottom:8px}
.bm-confirm-text{font-size:14px;color:#6b7280;margin-bottom:22px;line-height:1.6}
.bm-summary{background:#f8fafc;border-radius:14px;padding:18px;text-align:left}
.bm-summary-row{display:flex;gap:12px;padding:7px 0;border-bottom:1px solid #f1f5f9;font-size:13px}
.bm-summary-row:last-child{border-bottom:none;padding-bottom:0}
.bm-summary-key{font-weight:700;color:#374151;min-width:72px;flex-shrink:0}
.bm-summary-val{color:#6b7280}
.bm-confirm-new{background:none;border:1.5px solid #e2e8f0;padding:10px 22px;border-radius:100px;font-size:13px;font-weight:600;color:#555;cursor:pointer;margin-top:18px;transition:all 180ms ease;font-family:inherit}
.bm-confirm-new:hover{border-color:#fe6c75;color:#fe6c75}

/* Error */
.bm-err{font-size:12px;color:#fe6c75;margin-top:4px;display:none}
.bm-err.visible{display:block}

/* Dark mode */
body.dark-mode .bm-modal{background:#1a2533}
body.dark-mode .bm-title{color:#f1f5f9}
body.dark-mode .bm-cal-month{color:#f1f5f9}
body.dark-mode .bm-cal-day{color:#e2e8f0}
body.dark-mode .bm-cal-dow{color:#64748b}
body.dark-mode .bm-svc{background:#1e2f42;border-color:#2d3f55}
body.dark-mode .bm-svc:hover,.body.dark-mode .bm-svc.selected{background:#2a1e22}
body.dark-mode .bm-svc-text strong{color:#f1f5f9}
body.dark-mode .bm-field input,.body.dark-mode .bm-field select,.body.dark-mode .bm-field textarea{background:#1e2f42;border-color:#2d3f55;color:#f1f5f9}
body.dark-mode .bm-slot{background:#1e2f42;border-color:#2d3f55;color:#e2e8f0}
body.dark-mode .bm-summary{background:#1e2f42}
body.dark-mode .bm-summary-row{border-color:#2d3f55}
body.dark-mode .bm-summary-key{color:#e2e8f0}
body.dark-mode .bm-btn-back{color:#aab}
body.dark-mode .bm-confirm-title{color:#f1f5f9}
body.dark-mode .bm-progress{background:#2d3f55}

@media(max-width:500px){
  .bm-modal{border-radius:16px 16px 0 0;top:auto;bottom:0;left:0;right:0;transform:translateY(60px);max-height:92vh;width:100%;max-width:100%}
  .bm-modal.open{transform:translateY(0)}
  .bm-row2{grid-template-columns:1fr}
  .bm-header{padding:20px 20px 0}
  .bm-body{padding:18px 20px 8px}
  .bm-footer{padding:12px 20px 20px}
  .bm-progress{margin:0 20px}
}
    `;
    document.head.appendChild(s);
  }

  /* ─── Build modal HTML ───────────────────────────────────── */
  function buildHTML() {
    const el = document.createElement('div');
    el.innerHTML = `
<div class="bm-overlay" id="bmOverlay" onclick="closeBookingModal()"></div>
<div class="bm-modal" id="bmModal" role="dialog" aria-modal="true">
  <button class="bm-close" onclick="closeBookingModal()" aria-label="Close">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  </button>

  <div class="bm-header">
    <div class="bm-badge" id="bmBadge">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      <span id="bmBadgeText"></span>
    </div>
    <div class="bm-title" id="bmTitle"></div>
    <div class="bm-sub" id="bmSub"></div>
  </div>
  <div class="bm-progress"><div class="bm-prog-bar" id="bmProgBar" style="width:25%"></div></div>

  <div class="bm-body">
    <!-- Step 1: Service -->
    <div class="bm-step active" id="bmStep1">
      <div class="bm-step-label" id="bmStepLabel1"></div>
      <div class="bm-services" id="bmServices"></div>
    </div>

    <!-- Step 2: Date & Time -->
    <div class="bm-step" id="bmStep2">
      <div class="bm-step-label" id="bmStepLabel2"></div>
      <div class="bm-cal-nav">
        <button class="bm-cal-arrow" onclick="bmCalPrev()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div class="bm-cal-month" id="bmCalMonth"></div>
        <button class="bm-cal-arrow" onclick="bmCalNext()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
      <div class="bm-cal-grid" id="bmCalDow"></div>
      <div class="bm-cal-grid" id="bmCalDays" style="margin-top:4px"></div>
      <div class="bm-slots-wrap">
        <div class="bm-slots-label" id="bmSlotsLabel">— : —</div>
        <div class="bm-slots" id="bmSlots"></div>
      </div>
      <div class="bm-err" id="bmErrDate"></div>
    </div>

    <!-- Step 3: Contact -->
    <div class="bm-step" id="bmStep3">
      <div class="bm-step-label" id="bmStepLabel3"></div>
      <div class="bm-row2">
        <div class="bm-field">
          <label id="bmLabelName"></label>
          <input type="text" id="bmName" autocomplete="name">
        </div>
        <div class="bm-field">
          <label id="bmLabelEmail"></label>
          <input type="email" id="bmEmail" autocomplete="email">
        </div>
      </div>
      <div class="bm-field">
        <label id="bmLabelPhone"></label>
        <input type="tel" id="bmPhone" autocomplete="tel">
      </div>
      <div class="bm-field">
        <label id="bmLabelMsg"></label>
        <textarea id="bmMsg" rows="3"></textarea>
      </div>
      <div class="bm-err" id="bmErrContact"></div>
    </div>

    <!-- Step 4: Confirmation -->
    <div class="bm-step" id="bmStep4">
      <div class="bm-confirm-wrap">
        <div class="bm-confirm-check">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div class="bm-confirm-title" id="bmConfirmTitle"></div>
        <div class="bm-confirm-text" id="bmConfirmText"></div>
        <div class="bm-summary" id="bmSummary"></div>
        <button class="bm-confirm-new" onclick="bmReset()" id="bmNewBtn"></button>
      </div>
    </div>
  </div>

  <div class="bm-footer" id="bmFooter">
    <button class="bm-btn bm-btn-back" id="bmBackBtn" onclick="bmBack()" style="display:none"></button>
    <button class="bm-btn bm-btn-next" id="bmNextBtn" onclick="bmNext()"></button>
  </div>
</div>
    `;
    document.body.appendChild(el.children[0]); // overlay
    document.body.appendChild(el.children[0]); // modal
  }

  /* ─── Calendar helpers ───────────────────────────────────── */
  const SLOTS = ['09:00','10:00','11:00','14:00','15:00','16:00','17:00'];

  function renderCal() {
    const lang = getLang();
    const tr = T[lang];
    const now = new Date();
    const y = state.calYear, m = state.calMonth;
    document.getElementById('bmCalMonth').textContent = tr.months[m] + ' ' + y;

    // Days of week header
    const dowEl = document.getElementById('bmCalDow');
    dowEl.innerHTML = tr.days.map(d => `<div class="bm-cal-dow">${d}</div>`).join('');

    // First day of month (Monday = 0)
    const first = new Date(y, m, 1);
    const firstDow = (first.getDay() + 6) % 7; // Mon=0
    const daysInMonth = new Date(y, m + 1, 0).getDate();

    const daysEl = document.getElementById('bmCalDays');
    let html = '';
    for (let i = 0; i < firstDow; i++) html += `<div class="bm-cal-day bm-day-empty"></div>`;

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(y, m, d);
      const dow = date.getDay(); // 0=Sun, 6=Sat
      const isWeekend = dow === 0 || dow === 6;
      const isPast = date < new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const isToday = date.toDateString() === now.toDateString();
      const dateStr = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const isSelected = state.date === dateStr;

      let cls = 'bm-cal-day';
      if (isWeekend || isPast) cls += ' bm-day-disabled bm-day-past';
      if (isToday) cls += ' bm-day-today';
      if (isSelected) cls += ' selected';

      html += `<button class="${cls}" onclick="bmPickDate('${dateStr}')">${d}</button>`;
    }
    daysEl.innerHTML = html;
    renderSlots();
  }

  function renderSlots() {
    const lang = getLang();
    const tr = T[lang];
    const slotsEl = document.getElementById('bmSlots');
    const labelEl = document.getElementById('bmSlotsLabel');

    if (!state.date) {
      slotsEl.innerHTML = `<div class="bm-slots-empty">${tr.pickDate}</div>`;
      labelEl.textContent = '— : —';
      return;
    }

    const [y, mo, d] = state.date.split('-').map(Number);
    const dateObj = new Date(y, mo-1, d);
    const lang2 = getLang();
    const tr2 = T[lang2];
    const dayName = tr2.days[(dateObj.getDay() + 6) % 7];
    labelEl.textContent = `${dayName}, ${d}. ${tr2.months[mo-1]}`;

    slotsEl.innerHTML = SLOTS.map(s => {
      const sel = state.time === s ? ' selected' : '';
      return `<button class="bm-slot${sel}" onclick="bmPickTime('${s}')">${s}</button>`;
    }).join('');
  }

  /* ─── Navigation ─────────────────────────────────────────── */
  function updateUI() {
    const lang = getLang();
    const tr = T[lang];

    // Progress
    const pct = (state.step / 4) * 100;
    document.getElementById('bmProgBar').style.width = pct + '%';

    // Step labels
    const labels = [tr.step1, tr.step2, tr.step3, tr.step4];
    for (let i = 1; i <= 4; i++) {
      document.getElementById('bmStepLabel' + i).textContent = labels[i-1];
    }

    // Active step
    for (let i = 1; i <= 4; i++) {
      document.getElementById('bmStep' + i).classList.toggle('active', i === state.step);
    }

    // Back / Next buttons
    const backBtn = document.getElementById('bmBackBtn');
    const nextBtn = document.getElementById('bmNextBtn');
    const footer = document.getElementById('bmFooter');

    if (state.step === 4) {
      footer.style.display = 'none';
    } else {
      footer.style.display = 'flex';
      backBtn.style.display = state.step > 1 ? 'flex' : 'none';
      backBtn.textContent = tr.back;
      nextBtn.textContent = state.step === 3 ? tr.confirm : tr.next;
    }

    // Step-specific renders
    if (state.step === 1) renderServices();
    if (state.step === 2) renderCal();
    if (state.step === 3) {
      document.getElementById('bmLabelName').textContent = tr.name;
      document.getElementById('bmLabelEmail').textContent = tr.email;
      document.getElementById('bmLabelPhone').textContent = tr.phone;
      document.getElementById('bmLabelMsg').textContent = tr.msgLabel;
    }
  }

  function renderServices() {
    const lang = getLang();
    const icons = ['🌐', '📱', '🤖', '💬'];
    const hints = ['Website, Landing Page, Online-Shop', 'iOS & Android, React Native', 'Chatbot, Automatisierung, KI', 'Kostenloses Erstgespräch'];
    const services = T[lang].services;
    document.getElementById('bmServices').innerHTML = services.map((s, i) => {
      const sel = state.service === i ? ' selected' : '';
      return `<button class="bm-svc${sel}" onclick="bmPickService(${i})">
        <div class="bm-svc-icon">${icons[i]}</div>
        <div class="bm-svc-text"><strong>${s}</strong><span>${hints[i]}</span></div>
        <div class="bm-svc-check">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
        </div>
      </button>`;
    }).join('');
  }

  /* ─── Public actions ─────────────────────────────────────── */
  window.openBookingModal = function () {
    injectCSS();
    if (!document.getElementById('bmModal')) buildHTML();
    bmReset(false);

    const lang = getLang();
    const tr = T[lang];
    document.getElementById('bmBadgeText').textContent = tr.badge;
    document.getElementById('bmTitle').textContent = tr.title;
    document.getElementById('bmSub').textContent = tr.sub;

    updateUI();

    requestAnimationFrame(() => {
      document.getElementById('bmOverlay').classList.add('open');
      document.getElementById('bmModal').classList.add('open');
    });
    document.body.style.overflow = 'hidden';
  };

  window.closeBookingModal = function () {
    document.getElementById('bmOverlay').classList.remove('open');
    document.getElementById('bmModal').classList.remove('open');
    document.body.style.overflow = '';
  };

  window.bmPickService = function (i) {
    state.service = i;
    renderServices();
  };

  window.bmPickDate = function (dateStr) {
    state.date = dateStr;
    state.time = null;
    renderCal();
    document.getElementById('bmErrDate').classList.remove('visible');
  };

  window.bmPickTime = function (t) {
    state.time = t;
    renderSlots();
  };

  window.bmCalPrev = function () {
    state.calMonth--;
    if (state.calMonth < 0) { state.calMonth = 11; state.calYear--; }
    renderCal();
  };

  window.bmCalNext = function () {
    state.calMonth++;
    if (state.calMonth > 11) { state.calMonth = 0; state.calYear++; }
    renderCal();
  };

  window.bmBack = function () {
    if (state.step > 1) { state.step--; updateUI(); }
  };

  window.bmNext = function () {
    const lang = getLang();
    const tr = T[lang];

    if (state.step === 1) {
      if (state.service === null) return;
      state.step = 2; updateUI(); return;
    }
    if (state.step === 2) {
      if (!state.date || !state.time) {
        const err = document.getElementById('bmErrDate');
        err.textContent = tr.pickDate;
        err.classList.add('visible');
        return;
      }
      state.step = 3; updateUI(); return;
    }
    if (state.step === 3) {
      const name = document.getElementById('bmName').value.trim();
      const email = document.getElementById('bmEmail').value.trim();
      if (!name || !email) {
        const err = document.getElementById('bmErrContact');
        err.textContent = tr.requiredErr;
        err.classList.add('visible');
        return;
      }
      submitBooking(name, email);
    }
  };

  window.bmReset = function (animate) {
    const now = new Date();
    state = { step: 1, service: null, date: null, time: null, calYear: now.getFullYear(), calMonth: now.getMonth() };
    if (animate !== false) updateUI();
    if (document.getElementById('bmName')) document.getElementById('bmName').value = '';
    if (document.getElementById('bmEmail')) document.getElementById('bmEmail').value = '';
    if (document.getElementById('bmPhone')) document.getElementById('bmPhone').value = '';
    if (document.getElementById('bmMsg')) document.getElementById('bmMsg').value = '';
  };

  /* ─── Submit ─────────────────────────────────────────────── */
  function submitBooking(name, email) {
    const lang = getLang();
    const tr = T[lang];
    const phone = document.getElementById('bmPhone').value.trim();
    const msg = document.getElementById('bmMsg').value.trim();
    const serviceName = tr.services[state.service];

    const [y, mo, d] = state.date.split('-').map(Number);
    const dateObj = new Date(y, mo-1, d);
    const dayName = tr.days[(dateObj.getDay() + 6) % 7];
    const dateFormatted = `${dayName}, ${d}. ${tr.months[mo-1]} ${y}`;

    const nextBtn = document.getElementById('bmNextBtn');
    nextBtn.disabled = true;
    nextBtn.textContent = tr.sending;

    const body = {
      _subject: `Neue Terminanfrage von ${name} — Lweb`,
      Name: name,
      Email: email,
      Telefon: phone || '—',
      Service: serviceName,
      Datum: dateFormatted,
      Uhrzeit: state.time,
      Nachricht: msg || '—',
      _template: 'table',
      _captcha: 'false'
    };

    fetch('https://formsubmit.co/ajax/info@lweb.ch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body)
    })
    .catch(() => {}) // show confirmation regardless
    .finally(() => {
      // Show confirmation
      state.step = 4;
      document.getElementById('bmConfirmTitle').textContent = tr.successTitle;
      document.getElementById('bmConfirmText').textContent = tr.successText;
      document.getElementById('bmNewBtn').textContent = tr.newBook;

      // Build summary
      const rows = [
        [tr.summaryService, serviceName],
        [tr.summaryDate, dateFormatted],
        [tr.summaryTime, state.time],
        [tr.summaryName, name],
        [tr.summaryEmail, email],
        ...(phone ? [[tr.summaryPhone, phone]] : [])
      ];
      document.getElementById('bmSummary').innerHTML = rows.map(([k, v]) =>
        `<div class="bm-summary-row"><span class="bm-summary-key">${k}</span><span class="bm-summary-val">${v}</span></div>`
      ).join('');

      updateUI();
      nextBtn.disabled = false;
      nextBtn.textContent = tr.next;
    });
  }

})();
