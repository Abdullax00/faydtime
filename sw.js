const CACHE_NAME = 'faydtime-calc-v1.0.1';
const CDN_CACHE = 'faydtime-cdn-v1';

const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './apple-touch-icon.png',
  './favicon-32x32.png',
  './favicon.svg',
  './icon-192.png',
  './icon-512.png',
  './assets/bg_dark.svg',
  './assets/bg_light.svg',
  './assets/btn_calendar_dark.svg',
  './assets/btn_calendar_light.svg',
  './assets/btn_pdf_dark.svg',
  './assets/btn_pdf_light.svg',
  './assets/button_icon_dark.svg',
  './assets/button_icon_light.svg',
  './assets/calendar.svg',
  './assets/calendar_figma.svg',
  './assets/copy.svg',
  './assets/export_dark.png',
  './assets/export_light.png',
  './assets/logo.svg',
  './assets/logo_dark.svg',
  './assets/logo_light.svg',
  './assets/moon.svg',
  './assets/moon_button.svg',
  './assets/pencil.svg',
  './assets/pie.svg',
  './assets/pie_figma.svg',
  './assets/sun.svg',
  './assets/sun_figma.svg',
  './assets/theme_btn_dark.svg',
  './assets/trend.svg',
  './assets/trend_figma.svg',
  './assets/figma/dark_03622.svg',
  './assets/figma/dark_62f2d.svg',
  './assets/figma/dark_6d32b.svg',
  './assets/figma/dark_f1259.svg',
  './assets/figma/light_0e27f.svg',
  './assets/figma/light_206e5.svg',
  './assets/figma/light_42878.svg',
  './assets/figma/light_5b78d.svg',
  './assets/figma/light_77b62.svg',
  './assets/figma/light_b0494.svg',
  './assets/figma/light_b40ef.svg',
  './assets/figma/light_bc600.svg',
  './assets/figma/light_c40c0.svg',
  './assets/figma/light_d4988.svg',
  './assets/figma/light_e86e8.svg',
  './assets/figma/light_f49b9.svg',
  './assets/figma/light_f7836.svg'
];

// Install: precache all core static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        }).then(() => self.skipWaiting())
    );
});

// Activate: cleanup outdated caches and claim clients immediately
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME && key !== CDN_CACHE) {
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch: serve from cache, update in background, cache external CDNs (Tailwind, Fonts)
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // 1. External CDNs: Tailwind CSS, Google Fonts
    if (
        url.origin === 'https://cdn.tailwindcss.com' ||
        url.origin === 'https://fonts.googleapis.com' ||
        url.origin === 'https://fonts.gstatic.com'
    ) {
        event.respondWith(
            caches.open(CDN_CACHE).then((cache) => {
                return cache.match(event.request).then((cachedResponse) => {
                    const fetchPromise = fetch(event.request).then((networkResponse) => {
                        if (networkResponse && networkResponse.status === 200) {
                            cache.put(event.request, networkResponse.clone());
                        }
                        return networkResponse;
                    }).catch(() => cachedResponse);

                    return cachedResponse || fetchPromise;
                });
            })
        );
        return;
    }

    // 2. Same-origin or local relative requests: Stale-While-Revalidate
    if (url.origin === self.location.origin) {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.match(event.request).then((cachedResponse) => {
                    const fetchPromise = fetch(event.request).then((networkResponse) => {
                        if (networkResponse && networkResponse.status === 200) {
                            cache.put(event.request, networkResponse.clone());
                        }
                        return networkResponse;
                    }).catch(() => {
                        // Offline fallback: if navigation fails, return cached index.html
                        if (event.request.mode === 'navigate') {
                            return cache.match('./index.html') || cache.match('./');
                        }
                        return cachedResponse;
                    });

                    return cachedResponse || fetchPromise;
                });
            })
        );
        return;
    }

    // 3. Fallback for any other request
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || fetch(event.request).catch(() => null);
        })
    );
});
