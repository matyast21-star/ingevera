const CACHE = 'ingevera-v8';
const SHELL = ['./', 'index.html', 'assets/styles.css?v=8', 'assets/fonts.css?v=8', 'assets/app.js?v=8', 'assets/fonts/Montserrat.woff2', 'assets/fonts/PublicSans.woff2', 'assets/img/logo-core.png?v=8', 'favicon.png?v=8'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(cc => cc.put(e.request, c)); return r; }).catch(() => caches.match(e.request)));
});
