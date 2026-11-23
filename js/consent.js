/* LWEB · Cookies con permiso de verdad (23/11/2026)
   El píxel de Meta y Google Analytics SOLO se cargan si el visitante pulsó
   «Akzeptieren» en el aviso (localStorage 'cookieConsent' = 'accepted').
   Antes se cargaban siempre al abrir la página y «Ablehnen» no hacía nada.
   Las llamadas que ya hay en la web (fbq(...), gtag(...)) comprueban
   «typeof … === 'function'», así que sin permiso simplemente no hacen nada.
   La estadística propia (js/metrik.js) no usa cookies y no depende de esto.
   Google Analytics solo en las páginas que ponen window.LW_GA = true antes. */
(function () {
  window.lwConsent = function () { try { return localStorage.getItem('cookieConsent'); } catch (e) { return null; } };

  window.lwCargarTerceros = function () {
    if (window.__lwTerceros || window.lwConsent() !== 'accepted') return;
    window.__lwTerceros = 1;

    /* Meta Pixel */
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '1750437386268481');
    fbq('track', 'PageView');

    /* Google Analytics 4 */
    if (window.LW_GA) {
      var g = document.createElement('script');
      g.async = true; g.src = 'https://www.googletagmanager.com/gtag/js?id=G-CM0GM04YJ1';
      document.head.appendChild(g);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { dataLayer.push(arguments); };
      gtag('js', new Date());
      gtag('config', 'G-CM0GM04YJ1');
    }
  };

  window.lwCargarTerceros();
})();
