/* LWEB · METRIK (23/11/2026) — qué hacen los visitantes, de forma anónima.
   Sin cookies, sin IP, sin nada que identifique: un número al azar por visita
   que vive solo en esta pestaña (sessionStorage) y muere al cerrarla.
   Los eventos se juntan y salen en lotes con sendBeacon a web.lweb.ch/metrik/m.php.
   En local no manda nada (para no ensuciar las cifras), salvo que la página
   defina window.LW_METRIK_URL para probar. */
(function () {
  'use strict';
  var host = location.hostname.replace(/^www\./, '');
  var URL_M = window.LW_METRIK_URL || (host === 'lweb.ch' ? 'https://web.lweb.ch/metrik/m.php' : '');
  if (!URL_M || !navigator.sendBeacon) { window.lwMetrik = function () {}; return; }

  function ss(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } }

  /* ── la visita ── */
  var s = ss('lwm_s'), nueva = false;
  if (!s || !/^[a-z0-9]{8,20}$/.test(s)) {
    s = (Math.random().toString(36).slice(2) + Date.now().toString(36)).replace(/[^a-z0-9]/g, '').slice(0, 16);
    ss('lwm_s', s); nueva = true;
  }

  /* De dónde viene: solo se mira en la primera página de la visita. */
  var src = ss('lwm_src'), camp = ss('lwm_c') || '';
  if (src === null) {
    var q = new URLSearchParams(location.search), ref = '';
    try { ref = document.referrer ? new URL(document.referrer).hostname.replace(/^www\./, '') : ''; } catch (e) {}
    if (q.get('utm_source')) src = q.get('utm_source');
    else if (q.get('fbclid')) src = 'facebook';
    else if (q.get('gclid')) src = 'google-ads';
    else if (!ref || /(^|\.)lweb\.ch$/.test(ref)) src = 'direkt';
    else if (/facebook\.com$|fb\.com$/.test(ref)) src = 'facebook';
    else if (/instagram\.com$/.test(ref)) src = 'instagram';
    else if (/(^|\.)google\./.test(ref)) src = 'google';
    else if (/bing\.com$/.test(ref)) src = 'bing';
    else if (/duckduckgo\.com$/.test(ref)) src = 'duckduckgo';
    else if (/linkedin\.com$|lnkd\.in$/.test(ref)) src = 'linkedin';
    else src = ref;
    src = String(src).toLowerCase().replace(/[^a-z0-9._-]/g, '').slice(0, 40) || 'direkt';
    camp = String(q.get('utm_campaign') || '').toLowerCase().replace(/[^a-z0-9._-]/g, '').slice(0, 40);
    ss('lwm_src', src); ss('lwm_c', camp);
  }

  var w = Math.min(screen.width || innerWidth, innerWidth);
  var dv = w < 768 ? 'm' : (w < 1100 && matchMedia('(pointer:coarse)').matches ? 't' : 'd');
  var pag = /booking\.html/.test(location.pathname) ? 'booking' : (/muster\.html/.test(location.pathname) ? 'muster' : (/^\/(index\.html)?$/.test(location.pathname) ? 'index' : 'otra'));
  var lang = (document.documentElement.lang || '').slice(0, 2).toLowerCase();

  /* ── la cola ── */
  var cola = [], hechos = {};
  function poner(e, v) { cola.push([e, v | 0]); if (cola.length >= 40) enviar(); }
  function unaVez(e, v) { if (hechos[e]) return; hechos[e] = 1; poner(e, v); }
  function enviar() {
    if (!cola.length) return;
    var cuerpo = JSON.stringify({ s: s, p: pag, dv: dv, src: src, c: camp, l: lang, ev: cola.splice(0, 80) });
    try { navigator.sendBeacon(URL_M, new Blob([cuerpo], { type: 'text/plain' })); } catch (e) {}
  }
  setInterval(enviar, 15000);

  window.lwMetrik = function (e, v) { if (/^[a-z0-9_]{1,40}$/.test(e || '')) poner(e, v || 0); };

  /* Lo que ya se manda a Google/Meta (window.lwTrack) entra también aquí:
     así los eventos de muster.html (muster_start, muster_gesendet) se cuentan. */
  function envolver() {
    var orig = window.lwTrack;
    if (orig && orig.__lwm) return;
    var nuevo = function (n, p) { window.lwMetrik(n); if (orig) return orig(n, p); };
    nuevo.__lwm = 1; window.lwTrack = nuevo;
  }

  /* ── 1. la visita ── */
  poner('visita', nueva ? 1 : 0);

  /* ── 2. hasta dónde baja ── */
  var maxPct = 0;
  function medir() {
    var alto = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) - innerHeight;
    var pct = alto > 0 ? Math.round((scrollY / alto) * 100) : 100;
    if (pct > maxPct) maxPct = Math.min(100, pct);
    [25, 50, 75, 100].forEach(function (m) { if (maxPct >= (m === 100 ? 97 : m)) unaVez('scroll_' + m); });
  }
  addEventListener('scroll', function () { requestAnimationFrame(medir); }, { passive: true });

  /* ── 3. qué bloques ve (cuando el bloque cruza el centro de la pantalla) ── */
  function vigilarBloques() {
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        unaVez('ver_' + en.target.id.replace(/-/g, '_'));
        io.unobserve(en.target);
      });
    }, { rootMargin: '-40% 0px -40% 0px' });
    document.querySelectorAll('section[id]').forEach(function (sec) {
      if (sec.offsetParent !== null && /^[a-z0-9-]{2,30}$/.test(sec.id)) io.observe(sec);
    });
  }

  /* ── 4. qué pulsa (todo lo marcado con data-lw-event) ── */
  document.addEventListener('click', function (ev) {
    var el = ev.target.closest && ev.target.closest('[data-lw-event]');
    if (el) window.lwMetrik(el.getAttribute('data-lw-event'));
  }, { passive: true, capture: true });

  /* ── 5. cuánto se queda (solo cuenta el tiempo con la pestaña a la vista) ── */
  var visible = 0, desde = document.visibilityState === 'visible' ? Date.now() : 0;
  function cerrarTramo() { if (desde) { visible += Date.now() - desde; desde = 0; } }
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
      cerrarTramo();
      poner('tiempo', Math.min(3600, Math.round(visible / 1000)));
      poner('scroll_max', maxPct);
      visible = 0;
      enviar();
    } else { desde = Date.now(); }
  });
  addEventListener('pagehide', function () { enviar(); });

  function arrancar() { envolver(); vigilarBloques(); medir(); setTimeout(envolver, 1500); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar); else arrancar();
})();
