const CACHE = 'tris-drive-v1';
const ASSETS = ['./', './index.html', './styles.css', './app.js', './manifest.json', './assets/icon-192.svg', './assets/icon-512.svg', './assets/startup.wav'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS))));
self.addEventListener('fetch', event => event.respondWith(caches.match(event.request).then(r => r || fetch(event.request))));
