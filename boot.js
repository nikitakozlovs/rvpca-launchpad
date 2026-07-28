/* ============================================================
   RVP CA DARBVIRSMA — SĀKUMA SKRIPTS
   boot.js

   Divas lietas, kurām jānotiek pirms pirmās zīmēšanas. Abas agrāk bija
   <script> blokos index.html iekšpusē. Tie ir izcelti atsevišķā failā,
   lai Content-Security-Policy varētu būt `script-src 'self'` bez
   'unsafe-inline' — tas ir vienīgais veids, kā CSP tiešām aizsargā.

   Fails tiek ielādēts sinhroni <head> sākumā, tāpēc tas joprojām
   izpildās pirms lapas satura.
   ============================================================ */

(function () {
  'use strict';

  /* 1. Fontu priekšielāde. `crossorigin` ir obligāts arī tai pašai
        izcelsmei — fonti vienmēr tiek prasīti anonīmā CORS režīmā, un bez
        tā priekšielāde tiek izmesta un fails prasīts otrreiz. Bet CORS
        pieprasījumam no file:// ir sveša izcelsme un tas vienmēr krīt,
        tāpēc saites liekam tikai http(s). */
  if (location.protocol !== 'file:') {
    [['font/woff',  'brand/fonts/Gilroy-SemiBold.woff'],
     ['font/woff2', 'brand/fonts/google-sans/files/google-sans-latin-400-normal.woff2'],
     ['font/woff2', 'brand/fonts/google-sans/files/google-sans-latin-ext-400-normal.woff2'],
     ['font/woff2', 'brand/fonts/fontawesome/webfonts/fa-light-300.woff2']
    ].forEach(function (f) {
      var l = document.createElement('link');
      l.rel = 'preload'; l.as = 'font'; l.type = f[0]; l.crossOrigin = 'anonymous'; l.href = f[1];
      document.head.appendChild(l);
    });
  }

  /* 2. Saglabātā tēma pirms pirmās zīmēšanas, lai tumšā režīma lietotājam
        neuzplaiksnī gaišā lapa. */
  try {
    if (localStorage.getItem('rvpca-theme') === 'dark') {
      document.documentElement.dataset.theme = 'sintakse-dark';
      document.documentElement.classList.add('dark');
    }
  } catch (e) { /* privātais režīms — paliek noklusējuma gaišā tēma */ }
})();
