/* Tutor Casa · copia dell'app sul tablet per funzionare senza connessione.
   A ogni nuova versione cambia VERSIONE: il tablet scarica la nuova copia
   la prima volta che apri l'app con la connessione. I tuoi dati non vengono toccati. */
const VERSIONE = 'tutor-casa-0.5.1';
const FILE_APP = [
  './',
  './index.html',
  './manifest.webmanifest',
  './fonts/manrope.woff2',
  './fonts/space-grotesk.woff2',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './lib/jszip.min.js'
];

self.addEventListener('install', (evento) => {
  evento.waitUntil(caches.open(VERSIONE).then((c) => c.addAll(FILE_APP)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys()
      .then((nomi) => Promise.all(nomi.filter((n) => n !== VERSIONE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (evento) => {
  const richiesta = evento.request;
  if (richiesta.method !== 'GET' || new URL(richiesta.url).origin !== location.origin) return;
  evento.respondWith(
    caches.match(richiesta, { ignoreSearch: true }).then((copia) => {
      if (copia) return copia;
      return fetch(richiesta).catch(() =>
        richiesta.mode === 'navigate' ? caches.match('./index.html') : Response.error()
      );
    })
  );
});
