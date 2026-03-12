/**
 * ═══════════════════════════════════════════════════════
 * LWEB Template Editor — Visual Admin Panel
 * ═══════════════════════════════════════════════════════
 *
 * Usage:
 *   Add data-edit="text" or data-edit="image" to any element.
 *   Each editable element needs data-edit-key="unique-key".
 *
 *   <h1 data-edit="text" data-edit-key="hero-title">My Title</h1>
 *   <img data-edit="image" data-edit-key="hero-bg" src="...">
 *
 *   Initialize:
 *   TemplateEditor.init({ templateId: 'restaurant', clientId: 'demo' });
 *
 * Storage:
 *   - localStorage for now (offline mode)
 *   - Prepared for MySQL API via endpoint
 */

(function () {
    'use strict';

    // ── Config ───────────────────────────────────────
    var CONFIG = {
        templateId: 'default',
        clientId: 'demo',
        apiEndpoint: null,  // Will be set from .env or init()
        useApi: false,
        fonts: [
            { name: 'Inter', family: "'Inter', sans-serif", url: 'Inter:wght@300;400;500;600;700' },
            { name: 'Plus Jakarta Sans', family: "'Plus Jakarta Sans', sans-serif", url: 'Plus+Jakarta+Sans:wght@400;500;600;700;800' },
            { name: 'Playfair Display', family: "'Playfair Display', serif", url: 'Playfair+Display:wght@400;500;600;700;800' },
            { name: 'Poppins', family: "'Poppins', sans-serif", url: 'Poppins:wght@300;400;500;600;700' },
            { name: 'Montserrat', family: "'Montserrat', sans-serif", url: 'Montserrat:wght@300;400;500;600;700;800' },
            { name: 'Raleway', family: "'Raleway', sans-serif", url: 'Raleway:wght@300;400;500;600;700' },
            { name: 'Lato', family: "'Lato', sans-serif", url: 'Lato:wght@300;400;700;900' },
            { name: 'Roboto', family: "'Roboto', sans-serif", url: 'Roboto:wght@300;400;500;700' },
            { name: 'Oswald', family: "'Oswald', sans-serif", url: 'Oswald:wght@300;400;500;600;700' },
            { name: 'Merriweather', family: "'Merriweather', serif", url: 'Merriweather:wght@300;400;700;900' }
        ]
    };

    // ── State ────────────────────────────────────────
    var isEditing = false;
    var currentElement = null;
    var currentKey = null;
    var savedData = {};
    var fontsLoaded = {};

    // ── DOM refs (created dynamically) ───────────────
    var toggleBtn, sidebar, overlay, statusBar, toast;

    // ═══════════════════════════════════════════════════
    //  STORAGE LAYER (localStorage + API ready)
    // ═══════════════════════════════════════════════════

    function storageKey() {
        return 'te_' + CONFIG.templateId + '_' + CONFIG.clientId;
    }

    function loadData(callback) {
        if (CONFIG.useApi && CONFIG.apiEndpoint) {
            // API mode — GET data
            fetch(CONFIG.apiEndpoint + CONFIG.templateId + '/' + CONFIG.clientId + '/load.php')
                .then(function (r) { return r.json(); })
                .then(function (data) {
                    savedData = data || {};
                    if (callback) callback();
                })
                .catch(function () {
                    // Fallback to localStorage
                    loadFromLocal();
                    if (callback) callback();
                });
        } else {
            loadFromLocal();
            if (callback) callback();
        }
    }

    function loadFromLocal() {
        try {
            var raw = localStorage.getItem(storageKey());
            savedData = raw ? JSON.parse(raw) : {};
        } catch (e) {
            savedData = {};
        }
    }

    function saveData(callback) {
        // Always save to local as cache
        try {
            localStorage.setItem(storageKey(), JSON.stringify(savedData));
        } catch (e) { /* quota exceeded */ }

        if (CONFIG.useApi && CONFIG.apiEndpoint) {
            // API mode — POST data
            fetch(CONFIG.apiEndpoint + CONFIG.templateId + '/' + CONFIG.clientId + '/save.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(savedData)
            })
                .then(function (r) { return r.json(); })
                .then(function (res) {
                    showToast(res.success ? 'Gespeichert!' : 'Fehler beim Speichern', res.success ? 'success' : 'error');
                    if (callback) callback(res.success);
                })
                .catch(function () {
                    showToast('Lokal gespeichert (offline)', 'success');
                    if (callback) callback(true);
                });
        } else {
            showToast('Gespeichert!', 'success');
            if (callback) callback(true);
        }
    }

    // ═══════════════════════════════════════════════════
    //  FONT LOADING
    // ═══════════════════════════════════════════════════

    function loadFont(fontName) {
        if (fontsLoaded[fontName]) return;
        var font = CONFIG.fonts.find(function (f) { return f.name === fontName; });
        if (!font) return;
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=' + font.url + '&display=swap';
        document.head.appendChild(link);
        fontsLoaded[fontName] = true;
    }

    function loadAllEditorFonts() {
        // Preload all fonts for the selector
        CONFIG.fonts.forEach(function (f) { loadFont(f.name); });
    }

    // ═══════════════════════════════════════════════════
    //  APPLY SAVED DATA TO DOM
    // ═══════════════════════════════════════════════════

    function applyAllSaved() {
        var elements = document.querySelectorAll('[data-edit-key]');
        elements.forEach(function (el) {
            var key = el.getAttribute('data-edit-key');
            var data = savedData[key];
            if (!data) return;

            var editType = el.getAttribute('data-edit');

            if (editType === 'text') {
                if (data.text !== undefined) el.textContent = data.text;
                if (data.color) el.style.color = data.color;
                if (data.fontSize) el.style.fontSize = data.fontSize;
                if (data.fontFamily) {
                    el.style.fontFamily = data.fontFamily;
                    var fontObj = CONFIG.fonts.find(function (f) { return f.family === data.fontFamily; });
                    if (fontObj) loadFont(fontObj.name);
                }
            } else if (editType === 'image') {
                if (data.src) {
                    if (el.tagName === 'IMG') {
                        el.src = data.src;
                    } else {
                        el.style.background = 'url(' + data.src + ') center/cover no-repeat';
                    }
                }
            } else if (editType === 'logo') {
                if (data.useImage && data.logoSrc) {
                    var h = data.logoHeight || '28px';
                    el.innerHTML = '<img src="' + data.logoSrc + '" alt="Logo" style="height:' + h + ';width:auto;display:inline-block">';
                } else {
                    if (data.text !== undefined) el.textContent = data.text;
                    if (data.color) el.style.color = data.color;
                    if (data.fontSize) el.style.fontSize = data.fontSize;
                    if (data.fontFamily) {
                        el.style.fontFamily = data.fontFamily;
                        var fontObj2 = CONFIG.fonts.find(function (f) { return f.family === data.fontFamily; });
                        if (fontObj2) loadFont(fontObj2.name);
                    }
                }
            }
        });
    }

    // ═══════════════════════════════════════════════════
    //  UI CREATION
    // ═══════════════════════════════════════════════════

    function createUI() {
        // Toggle button
        toggleBtn = document.createElement('button');
        toggleBtn.className = 'te-toggle';
        toggleBtn.title = 'Editor öffnen';
        toggleBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg><span>Seite bearbeiten</span>';
        toggleBtn.addEventListener('click', toggleEditor);
        document.body.appendChild(toggleBtn);

        // Status bar
        statusBar = document.createElement('div');
        statusBar.className = 'te-status';
        statusBar.innerHTML = '<span class="te-status-dot"></span><span class="te-status-text">Editor aktiv</span><span class="te-status-sep"></span><span class="te-status-hint">Element anklicken zum Bearbeiten</span><span class="te-status-sep"></span><span class="te-status-key">ESC</span><span class="te-status-hint">Schliessen</span>';
        document.body.appendChild(statusBar);

        // Overlay
        overlay = document.createElement('div');
        overlay.className = 'te-overlay';
        overlay.addEventListener('click', closeSidebar);
        document.body.appendChild(overlay);

        // Sidebar
        sidebar = document.createElement('div');
        sidebar.className = 'te-sidebar';
        sidebar.innerHTML =
            '<div class="te-sidebar-header">' +
            '  <h3><span class="te-title-text">Element bearbeiten</span> <span class="te-el-type"></span></h3>' +
            '  <button class="te-close" title="Schliessen">' +
            '    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
            '  </button>' +
            '</div>' +
            '<div class="te-sidebar-body" id="teSidebarBody"></div>' +
            '<div class="te-sidebar-footer">' +
            '  <button class="te-btn te-btn-reset" id="teReset">Zurücksetzen</button>' +
            '  <button class="te-btn te-btn-save" id="teSave">Speichern</button>' +
            '</div>';
        document.body.appendChild(sidebar);

        sidebar.querySelector('.te-close').addEventListener('click', closeSidebar);
        sidebar.querySelector('#teSave').addEventListener('click', handleSave);
        sidebar.querySelector('#teReset').addEventListener('click', handleReset);

        // Toast
        toast = document.createElement('div');
        toast.className = 'te-toast';
        document.body.appendChild(toast);

        // ESC key to close editor / sidebar
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                if (sidebar.classList.contains('te-open')) {
                    closeSidebar();
                } else if (isEditing) {
                    toggleEditor();
                }
            }
        });
    }

    // ═══════════════════════════════════════════════════
    //  BADGES — injected edit indicators
    // ═══════════════════════════════════════════════════

    var PENCIL_SVG = '<svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>';
    var UPLOAD_SVG = '<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>';
    var LOGO_SVG = '<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';

    function injectBadges() {
        document.querySelectorAll('[data-edit]').forEach(function (el) {
            if (el.querySelector('.te-badge')) return;
            var editType = el.getAttribute('data-edit');
            var badge = document.createElement('div');
            badge.className = 'te-badge' + (editType === 'image' ? ' te-badge--image' : '');
            var icon = editType === 'image' ? UPLOAD_SVG : (editType === 'logo' ? LOGO_SVG : PENCIL_SVG);
            badge.innerHTML = icon;

            // For bg-image divs (position:absolute like hero-bg), make badge always visible & clickable
            var cs = getComputedStyle(el);
            var isBgElement = (editType === 'image' && el.tagName !== 'IMG' && cs.position === 'absolute');

            if (isBgElement) {
                // Place badge on the parent section instead
                var parent = el.parentElement;
                badge.style.cssText = 'position:absolute;top:16px;right:16px;z-index:60;opacity:1;pointer-events:auto;cursor:pointer;';
                badge.addEventListener('click', function(ev) {
                    ev.preventDefault();
                    ev.stopPropagation();
                    currentElement = el;
                    currentKey = el.getAttribute('data-edit-key');
                    openImageEditor(el);
                });
                var parentPos = getComputedStyle(parent).position;
                if (parentPos === 'static') parent.style.position = 'relative';
                parent.appendChild(badge);
            } else if (el.tagName === 'IMG') {
                // IMG can't have children — put badge on parent
                var imgParent = el.parentElement;
                var imgParentPos = getComputedStyle(imgParent).position;
                if (imgParentPos === 'static') imgParent.style.position = 'relative';
                badge.style.cssText = 'position:absolute;top:8px;right:8px;z-index:60;opacity:0.7;pointer-events:auto;cursor:pointer;';
                badge.addEventListener('click', function(ev) {
                    ev.preventDefault();
                    ev.stopPropagation();
                    currentElement = el;
                    currentKey = el.getAttribute('data-edit-key');
                    openImageEditor(el);
                });
                imgParent.appendChild(badge);
            } else {
                // Normal inline element
                if (cs.position === 'static') el.style.position = 'relative';
                el.classList.add('te-has-badge');
                el.appendChild(badge);
            }
        });
    }

    function removeBadges() {
        document.querySelectorAll('.te-badge').forEach(function (b) {
            b.remove();
        });
        document.querySelectorAll('.te-has-badge').forEach(function (el) {
            el.classList.remove('te-has-badge');
        });
    }

    // ═══════════════════════════════════════════════════
    //  TOGGLE EDITOR
    // ═══════════════════════════════════════════════════

    // ── Onboarding modal ────────────────────────────
    var onboardingShown = false;
    var TE_LANG = (document.documentElement.lang || navigator.language || 'de').slice(0,2).toLowerCase();
    var OB_TEXTS = {
        de: { title:'Editor-Modus', text:'Klicke auf einen <b>Text</b>, um ihn zu bearbeiten.<br>Klicke auf das <b>Upload-Symbol</b> bei Bildern, um sie zu ersetzen.', btn:'Verstanden' },
        en: { title:'Editor Mode', text:'Click on any <b>text</b> to edit it.<br>Click the <b>upload icon</b> on images to replace them.', btn:'Got it' },
        es: { title:'Modo Editor', text:'Haz clic en un <b>texto</b> para editarlo.<br>Haz clic en el <b>icono de subir</b> en las imágenes para reemplazarlas.', btn:'Entendido' },
        fr: { title:'Mode Éditeur', text:'Clique sur un <b>texte</b> pour le modifier.<br>Clique sur l\'<b>icône upload</b> des images pour les remplacer.', btn:'Compris' },
        it: { title:'Modalità Editor', text:'Clicca su un <b>testo</b> per modificarlo.<br>Clicca sull\'<b>icona upload</b> delle immagini per sostituirle.', btn:'Capito' }
    };

    function showOnboarding(cb) {
        var t = OB_TEXTS[TE_LANG] || OB_TEXTS.de;
        var modal = document.createElement('div');
        modal.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.55);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;transition:opacity .3s';
        modal.innerHTML =
            '<div style="background:#fff;border-radius:20px;max-width:380px;width:100%;padding:32px;text-align:center;transform:translateY(16px) scale(0.97);transition:transform .3s;box-shadow:0 32px 80px rgba(0,0,0,0.2)">' +
            '  <div style="width:56px;height:56px;border-radius:16px;background:linear-gradient(135deg,#fe6c75,#e1545d);display:flex;align-items:center;justify-content:center;margin:0 auto 16px">' +
            '    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>' +
            '  </div>' +
            '  <h3 style="font-size:20px;font-weight:800;margin:0 0 10px;color:#0f1d2c">' + t.title + '</h3>' +
            '  <p style="font-size:14px;color:#6b7d99;line-height:1.6;margin:0 0 24px">' + t.text + '</p>' +
            '  <button id="teOnboardBtn" style="width:100%;padding:14px;border:none;border-radius:12px;background:linear-gradient(135deg,#fe6c75,#e1545d);color:#fff;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;transition:transform .2s,box-shadow .2s">' + t.btn + '</button>' +
            '</div>';
        document.body.appendChild(modal);
        requestAnimationFrame(function(){ requestAnimationFrame(function(){
            modal.style.opacity = '1';
            modal.firstElementChild.style.transform = 'translateY(0) scale(1)';
        }); });
        modal.querySelector('#teOnboardBtn').addEventListener('click', function(){
            modal.style.opacity = '0';
            setTimeout(function(){ modal.remove(); if(cb) cb(); }, 300);
        });
    }

    function toggleEditor() {
        isEditing = !isEditing;
        document.body.classList.toggle('te-editing', isEditing);
        toggleBtn.classList.toggle('te-active', isEditing);
        statusBar.classList.toggle('te-show', isEditing);

        if (isEditing) {
            toggleBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg><span>Bearbeitung beenden</span>';
            toggleBtn.title = 'Editor schliessen';
            if (!onboardingShown) {
                onboardingShown = true;
                showOnboarding(function() {
                    injectBadges();
                    bindEditableClicks();
                });
                return;
            }
            injectBadges();
            bindEditableClicks();
        } else {
            toggleBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg><span>Seite bearbeiten</span>';
            toggleBtn.title = 'Editor öffnen';
            removeBadges();
            unbindEditableClicks();
            closeSidebar();
        }
    }

    // ═══════════════════════════════════════════════════
    //  EDITABLE ELEMENT CLICK HANDLING
    // ═══════════════════════════════════════════════════

    function onEditableClick(e) {
        if (!isEditing) return;
        e.preventDefault();
        e.stopPropagation();

        var el = e.currentTarget;
        currentElement = el;
        currentKey = el.getAttribute('data-edit-key');
        var editType = el.getAttribute('data-edit');

        if (editType === 'text') {
            openTextEditor(el);
        } else if (editType === 'image') {
            openImageEditor(el);
        } else if (editType === 'logo') {
            openLogoEditor(el);
        }
    }

    function bindEditableClicks() {
        document.querySelectorAll('[data-edit]').forEach(function (el) {
            el.addEventListener('click', onEditableClick, true);
        });
    }

    function unbindEditableClicks() {
        document.querySelectorAll('[data-edit]').forEach(function (el) {
            el.removeEventListener('click', onEditableClick, true);
        });
    }

    // ═══════════════════════════════════════════════════
    //  TEXT EDITOR
    // ═══════════════════════════════════════════════════

    function openTextEditor(el) {
        var body = sidebar.querySelector('#teSidebarBody');
        var data = savedData[currentKey] || {};
        var currentText = data.text !== undefined ? data.text : el.textContent.trim();
        var currentColor = data.color || getComputedStyle(el).color;
        var currentSize = data.fontSize || getComputedStyle(el).fontSize;
        var currentFontFamily = data.fontFamily || '';

        // Convert rgb to hex
        var hexColor = rgbToHex(currentColor);
        var sizeNum = parseInt(currentSize) || 16;

        sidebar.querySelector('.te-el-type').textContent = 'Text';
        sidebar.querySelector('.te-title-text').textContent = currentKey;

        body.innerHTML =
            '<div class="te-group">' +
            '  <label>Inhalt</label>' +
            '  <textarea class="te-textarea" id="teText">' + escapeHtml(currentText) + '</textarea>' +
            '</div>' +
            '<div class="te-group">' +
            '  <label>Farbe</label>' +
            '  <div class="te-color-row">' +
            '    <input type="color" class="te-color-picker" id="teColor" value="' + hexColor + '">' +
            '    <input type="text" class="te-color-hex" id="teColorHex" value="' + hexColor + '" maxlength="7">' +
            '  </div>' +
            '</div>' +
            '<div class="te-group">' +
            '  <label>Schriftgrösse</label>' +
            '  <div class="te-size-row">' +
            '    <input type="range" class="te-range" id="teSize" min="10" max="120" value="' + sizeNum + '">' +
            '    <span class="te-size-val" id="teSizeVal">' + sizeNum + 'px</span>' +
            '  </div>' +
            '</div>' +
            '<div class="te-group">' +
            '  <label>Schriftart</label>' +
            '  <select class="te-select" id="teFont">' +
            '    <option value="">— Original —</option>' +
            buildFontOptions(currentFontFamily) +
            '  </select>' +
            '</div>';

        // Live preview bindings
        var textArea = body.querySelector('#teText');
        var colorPicker = body.querySelector('#teColor');
        var colorHex = body.querySelector('#teColorHex');
        var sizeRange = body.querySelector('#teSize');
        var sizeVal = body.querySelector('#teSizeVal');
        var fontSelect = body.querySelector('#teFont');

        textArea.addEventListener('input', function () {
            el.textContent = this.value;
        });

        colorPicker.addEventListener('input', function () {
            el.style.color = this.value;
            colorHex.value = this.value;
        });

        colorHex.addEventListener('input', function () {
            if (/^#[0-9a-fA-F]{6}$/.test(this.value)) {
                el.style.color = this.value;
                colorPicker.value = this.value;
            }
        });

        sizeRange.addEventListener('input', function () {
            el.style.fontSize = this.value + 'px';
            sizeVal.textContent = this.value + 'px';
        });

        fontSelect.addEventListener('change', function () {
            if (this.value) {
                var font = CONFIG.fonts.find(function (f) { return f.family === fontSelect.value; });
                if (font) loadFont(font.name);
                el.style.fontFamily = this.value;
            } else {
                el.style.fontFamily = '';
            }
        });

        openSidebar();
    }

    function buildFontOptions(currentFamily) {
        return CONFIG.fonts.map(function (f) {
            var selected = f.family === currentFamily ? ' selected' : '';
            return '<option value="' + f.family + '"' + selected + ' style="font-family:' + f.family + '">' + f.name + '</option>';
        }).join('');
    }

    // ═══════════════════════════════════════════════════
    //  IMAGE EDITOR
    // ═══════════════════════════════════════════════════

    function openImageEditor(el) {
        var body = sidebar.querySelector('#teSidebarBody');
        var data = savedData[currentKey] || {};
        var currentSrc = '';

        if (el.tagName === 'IMG') {
            currentSrc = data.src || el.src;
        } else {
            var bgImg = getComputedStyle(el).backgroundImage;
            currentSrc = data.src || (bgImg && bgImg !== 'none' ? bgImg.replace(/^url\(["']?/, '').replace(/["']?\)$/, '') : '');
        }

        sidebar.querySelector('.te-el-type').textContent = 'Bild';
        sidebar.querySelector('.te-title-text').textContent = currentKey;

        body.innerHTML =
            '<div class="te-group">' +
            '  <label>Vorschau</label>' +
            '  <div class="te-img-preview" id="teImgPreview">' +
            (currentSrc ? '<img src="' + currentSrc + '" alt="Preview">' : '<span style="color:#94a3b8;font-size:14px">Kein Bild</span>') +
            '  </div>' +
            '</div>' +
            '<div class="te-group">' +
            '  <label>Bild hochladen</label>' +
            '  <label class="te-upload-btn" for="teUpload">' +
            '    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>' +
            '    Bild auswählen' +
            '  </label>' +
            '  <input type="file" class="te-upload-input" id="teUpload" accept="image/*">' +
            '</div>' +
            '<div class="te-group">' +
            '  <label>Oder Bild-URL eingeben</label>' +
            '  <input type="text" class="te-input" id="teImgUrl" placeholder="https://..." value="' + (currentSrc.startsWith('data:') ? '' : escapeHtml(currentSrc)) + '">' +
            '</div>';

        var fileInput = body.querySelector('#teUpload');
        var urlInput = body.querySelector('#teImgUrl');
        var preview = body.querySelector('#teImgPreview');

        fileInput.addEventListener('change', function () {
            var file = this.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function (ev) {
                var dataUrl = ev.target.result;
                preview.innerHTML = '<img src="' + dataUrl + '" alt="Preview">';
                applyImage(el, dataUrl);
                urlInput.value = '';
            };
            reader.readAsDataURL(file);
        });

        urlInput.addEventListener('input', debounce(function () {
            var url = urlInput.value.trim();
            if (url) {
                preview.innerHTML = '<img src="' + url + '" alt="Preview">';
                applyImage(el, url);
            }
        }, 500));

        openSidebar();
    }

    // ═══════════════════════════════════════════════════
    //  LOGO EDITOR (text + image upload)
    // ═══════════════════════════════════════════════════

    function openLogoEditor(el) {
        var body = sidebar.querySelector('#teSidebarBody');
        var data = savedData[currentKey] || {};
        var currentText = data.text !== undefined ? data.text : el.textContent.trim();
        var currentColor = data.color || getComputedStyle(el).color;
        var currentSize = data.fontSize || getComputedStyle(el).fontSize;
        var currentFontFamily = data.fontFamily || '';
        var currentLogoSrc = data.logoSrc || '';
        var useImage = data.useImage || false;

        var hexColor = rgbToHex(currentColor);
        var sizeNum = parseInt(currentSize) || 24;

        sidebar.querySelector('.te-el-type').textContent = 'Logo';
        sidebar.querySelector('.te-title-text').textContent = currentKey;

        body.innerHTML =
            '<div class="te-group">' +
            '  <label>Logo-Typ</label>' +
            '  <div style="display:flex;gap:8px;margin-bottom:12px">' +
            '    <button class="te-btn ' + (!useImage ? 'te-btn-save' : 'te-btn-reset') + '" id="teLogoText" style="flex:1;padding:10px">Text</button>' +
            '    <button class="te-btn ' + (useImage ? 'te-btn-save' : 'te-btn-reset') + '" id="teLogoImg" style="flex:1;padding:10px">Bild hochladen</button>' +
            '  </div>' +
            '</div>' +
            '<div id="teLogoTextPanel"' + (useImage ? ' style="display:none"' : '') + '>' +
            '  <div class="te-group">' +
            '    <label>Text</label>' +
            '    <input type="text" class="te-input" id="teLogoName" value="' + escapeHtml(currentText) + '">' +
            '  </div>' +
            '  <div class="te-group">' +
            '    <label>Farbe</label>' +
            '    <div class="te-color-row">' +
            '      <input type="color" class="te-color-picker" id="teLogoColor" value="' + hexColor + '">' +
            '      <input type="text" class="te-color-hex" id="teLogoColorHex" value="' + hexColor + '" maxlength="7">' +
            '    </div>' +
            '  </div>' +
            '  <div class="te-group">' +
            '    <label>Schriftgrösse</label>' +
            '    <div class="te-size-row">' +
            '      <input type="range" class="te-range" id="teLogoSize" min="14" max="60" value="' + sizeNum + '">' +
            '      <span class="te-size-val" id="teLogoSizeVal">' + sizeNum + 'px</span>' +
            '    </div>' +
            '  </div>' +
            '  <div class="te-group">' +
            '    <label>Schriftart</label>' +
            '    <select class="te-select" id="teLogoFont">' +
            '      <option value="">— Original —</option>' +
            buildFontOptions(currentFontFamily) +
            '    </select>' +
            '  </div>' +
            '</div>' +
            '<div id="teLogoImgPanel"' + (!useImage ? ' style="display:none"' : '') + '>' +
            '  <div class="te-group">' +
            '    <label>Logo-Bild</label>' +
            '    <div class="te-img-preview" id="teLogoPreview" style="height:100px;background:#f4f7fb">' +
            (currentLogoSrc ? '<img src="' + currentLogoSrc + '" alt="Logo" style="object-fit:contain">' : '<span style="color:#94a3b8;font-size:14px">Kein Bild</span>') +
            '    </div>' +
            '  </div>' +
            '  <div class="te-group">' +
            '    <label>Logo hochladen</label>' +
            '    <label class="te-upload-btn" for="teLogoUpload">' +
            '      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>' +
            '      Bild auswählen' +
            '    </label>' +
            '    <input type="file" class="te-upload-input" id="teLogoUpload" accept="image/*">' +
            '  </div>' +
            '</div>';

        var textPanel = body.querySelector('#teLogoTextPanel');
        var imgPanel = body.querySelector('#teLogoImgPanel');
        var btnText = body.querySelector('#teLogoText');
        var btnImg = body.querySelector('#teLogoImg');

        btnText.addEventListener('click', function() {
            textPanel.style.display = '';
            imgPanel.style.display = 'none';
            btnText.className = 'te-btn te-btn-save';
            btnImg.className = 'te-btn te-btn-reset';
            // Restore text
            el.innerHTML = '';
            el.textContent = body.querySelector('#teLogoName').value;
            el.style.backgroundImage = '';
            el.style.fontSize = '';
        });

        btnImg.addEventListener('click', function() {
            textPanel.style.display = 'none';
            imgPanel.style.display = '';
            btnImg.className = 'te-btn te-btn-save';
            btnText.className = 'te-btn te-btn-reset';
        });

        // Text bindings
        var nameInput = body.querySelector('#teLogoName');
        var colorPicker = body.querySelector('#teLogoColor');
        var colorHex = body.querySelector('#teLogoColorHex');
        var sizeRange = body.querySelector('#teLogoSize');
        var sizeVal = body.querySelector('#teLogoSizeVal');
        var fontSelect = body.querySelector('#teLogoFont');

        nameInput.addEventListener('input', function() { el.textContent = this.value; });
        colorPicker.addEventListener('input', function() { el.style.color = this.value; colorHex.value = this.value; });
        colorHex.addEventListener('input', function() {
            if (/^#[0-9a-fA-F]{6}$/.test(this.value)) { el.style.color = this.value; colorPicker.value = this.value; }
        });
        sizeRange.addEventListener('input', function() { el.style.fontSize = this.value + 'px'; sizeVal.textContent = this.value + 'px'; });
        fontSelect.addEventListener('change', function() {
            if (this.value) {
                var font = CONFIG.fonts.find(function(f) { return f.family === fontSelect.value; });
                if (font) loadFont(font.name);
                el.style.fontFamily = this.value;
            } else { el.style.fontFamily = ''; }
        });

        // Image upload
        var fileInput = body.querySelector('#teLogoUpload');
        var preview = body.querySelector('#teLogoPreview');

        fileInput.addEventListener('change', function() {
            var file = this.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function(ev) {
                var src = ev.target.result;
                preview.innerHTML = '<img src="' + src + '" alt="Logo" style="object-fit:contain">';
                // Replace text with image
                el.innerHTML = '<img src="' + src + '" alt="Logo" style="height:' + sizeNum + 'px;width:auto;display:inline-block">';
            };
            reader.readAsDataURL(file);
        });

        openSidebar();
    }

    function applyImage(el, src) {
        if (el.tagName === 'IMG') {
            el.src = src;
        } else {
            // Use background shorthand to override CSS background shorthand
            el.style.background = 'url(' + src + ') center/cover no-repeat';
        }
    }

    // ═══════════════════════════════════════════════════
    //  SIDEBAR CONTROLS
    // ═══════════════════════════════════════════════════

    function openSidebar() {
        sidebar.classList.add('te-open');
        overlay.classList.add('te-show');
    }

    function closeSidebar() {
        sidebar.classList.remove('te-open');
        overlay.classList.remove('te-show');
        currentElement = null;
        currentKey = null;
    }

    function handleSave() {
        if (!currentElement || !currentKey) return;

        var editType = currentElement.getAttribute('data-edit');

        if (editType === 'text') {
            var textArea = sidebar.querySelector('#teText');
            var colorPicker = sidebar.querySelector('#teColor');
            var sizeRange = sidebar.querySelector('#teSize');
            var fontSelect = sidebar.querySelector('#teFont');

            savedData[currentKey] = {
                text: textArea ? textArea.value : '',
                color: colorPicker ? colorPicker.value : '',
                fontSize: sizeRange ? sizeRange.value + 'px' : '',
                fontFamily: fontSelect ? fontSelect.value : ''
            };
        } else if (editType === 'image') {
            var imgEl = currentElement.tagName === 'IMG' ? currentElement : null;
            var bgEl = !imgEl ? currentElement : null;
            var src = '';

            if (imgEl) {
                src = imgEl.src;
            } else if (bgEl) {
                var bg = getComputedStyle(bgEl).backgroundImage;
                if (bg && bg !== 'none') {
                    src = bg.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
                }
            }

            savedData[currentKey] = { src: src };
        } else if (editType === 'logo') {
            var logoTextPanel = sidebar.querySelector('#teLogoTextPanel');
            var isImageMode = logoTextPanel && logoTextPanel.style.display === 'none';
            var logoImg = currentElement.querySelector('img');

            if (isImageMode && logoImg) {
                savedData[currentKey] = {
                    useImage: true,
                    logoSrc: logoImg.src,
                    logoHeight: (sidebar.querySelector('#teLogoSize') ? sidebar.querySelector('#teLogoSize').value : '24') + 'px'
                };
            } else {
                var nameInput = sidebar.querySelector('#teLogoName');
                var colorP = sidebar.querySelector('#teLogoColor');
                var sizeR = sidebar.querySelector('#teLogoSize');
                var fontS = sidebar.querySelector('#teLogoFont');
                savedData[currentKey] = {
                    useImage: false,
                    text: nameInput ? nameInput.value : '',
                    color: colorP ? colorP.value : '',
                    fontSize: sizeR ? sizeR.value + 'px' : '',
                    fontFamily: fontS ? fontS.value : ''
                };
            }
        }

        saveData(function () {
            closeSidebar();
        });
    }

    function handleReset() {
        if (!currentKey) return;
        if (!confirm('Dieses Element auf den Originalzustand zurücksetzen?')) return;

        delete savedData[currentKey];
        saveData(function () {
            // Reload the page to restore original
            location.reload();
        });
    }

    // ═══════════════════════════════════════════════════
    //  TOAST
    // ═══════════════════════════════════════════════════

    var toastTimer = null;
    function showToast(msg, type) {
        clearTimeout(toastTimer);
        toast.textContent = msg;
        toast.className = 'te-toast te-show' + (type ? ' te-' + type : '');
        toastTimer = setTimeout(function () {
            toast.classList.remove('te-show');
        }, 2500);
    }

    // ═══════════════════════════════════════════════════
    //  UTILITIES
    // ═══════════════════════════════════════════════════

    function rgbToHex(rgb) {
        if (rgb.startsWith('#')) return rgb.length === 7 ? rgb : '#000000';
        var match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (!match) return '#000000';
        return '#' + [match[1], match[2], match[3]].map(function (x) {
            return ('0' + parseInt(x).toString(16)).slice(-2);
        }).join('');
    }

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function debounce(fn, delay) {
        var timer;
        return function () {
            var ctx = this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () { fn.apply(ctx, args); }, delay);
        };
    }

    // ═══════════════════════════════════════════════════
    //  PUBLIC API
    // ═══════════════════════════════════════════════════

    window.TemplateEditor = {
        init: function (opts) {
            if (opts.templateId) CONFIG.templateId = opts.templateId;
            if (opts.clientId) CONFIG.clientId = opts.clientId;
            if (opts.apiEndpoint) {
                CONFIG.apiEndpoint = opts.apiEndpoint;
                CONFIG.useApi = true;
            }

            // Load saved data, then apply and create UI
            loadData(function () {
                applyAllSaved();
                createUI();
                loadAllEditorFonts();
            });
        },

        // Programmatic access
        getData: function () { return JSON.parse(JSON.stringify(savedData)); },
        setData: function (data) { savedData = data; saveData(); applyAllSaved(); },
        destroy: function () {
            if (isEditing) toggleEditor();
            if (toggleBtn) toggleBtn.remove();
            if (sidebar) sidebar.remove();
            if (overlay) overlay.remove();
            if (statusBar) statusBar.remove();
            if (toast) toast.remove();
        }
    };

})();
