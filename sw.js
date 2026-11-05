// Ágora PKM 3.0: cache de archivos locales con actualización de navegación.
const CACHE_NAME = 'agora-static-v3';
const PRECACHE = ['./', './index.html', './manifest.webmanifest'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(Promise.all([caches.keys().then(names => Promise.all(names.filter(n => n.startsWith('agora-static-') && n !== CACHE_NAME).map(n => caches.delete(n)))), self.clients.claim()])));
self.addEventListener('fetch', event => {
  if(event.request.method !== 'GET') return;
  const u = new URL(event.request.url), base = new URL(self.registration.scope);
  if(u.origin !== base.origin || !u.pathname.startsWith(base.pathname)) return;
  if(event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then(r => {if(r.ok){const copy=r.clone();caches.open(CACHE_NAME).then(c=>c.put('./index.html',copy))}return r}).catch(()=>caches.match('./index.html')));
  } else event.respondWith(caches.match(event.request).then(found => found || fetch(event.request)));
});
