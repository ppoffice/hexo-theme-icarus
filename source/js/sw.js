importScripts('https://cdn.staticfile.org/workbox-sw/5.1.4/workbox-sw.min.js');

workbox.setConfig({
    modulePathPrefix: 'https://cdn.jsdelivr.net/npm/workbox-cdn@5.1.4/workbox/'
});

const { core, precaching, routing, strategies, expiration, cacheableResponse, backgroundSync } = workbox;
const { CacheFirst, NetworkFirst, NetworkOnly,StaleWhileRevalidate } = strategies;
const { ExpirationPlugin } = expiration;
const { CacheableResponsePlugin } = cacheableResponse;

const cacheSuffixVersion = '-231119a',
    // precacheCacheName = core.cacheNames.precache,
    // runtimeCacheName = core.cacheNames.runtime,
    maxEntries = 100;

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys.map((key) => {
                if (key.includes('disqus-cdn-cache')) return caches.delete(key);
                if (key.includes('disqus-img-cache')) return caches.delete(key);
                if (!key.includes(cacheSuffixVersion)) return caches.delete(key);
            }));
        })
    );
});


core.setCacheNameDetails({
    prefix: 'amane',
    suffix: cacheSuffixVersion
});

core.skipWaiting();
core.clientsClaim();
precaching.cleanupOutdatedCaches();

/*
 * Cache File From jsDelivr
 * cdn.jsdelivr.net | shadow.elemecdn.com
 *
 * Method: CacheFirst
 * cacheName: static-immutable
 * cacheTime: 30d
 */

// cdn.jsdelivr.net - cors enabled
routing.registerRoute(
    /.*lf3-cdn-tos\.bytecdntp\.com/,
    new CacheFirst({
        cacheName: 'static-immutable' + cacheSuffixVersion,
        fetchOptions: {
            mode: 'cors',
            credentials: 'omit'
        },
        plugins: [
            new ExpirationPlugin({
                maxAgeSeconds: 30 * 24 * 60 * 60,
                purgeOnQuotaError: true
            })
        ]
    })
);

registerRoute(
    /.*xgjalbum\.oss-cn-hangzhou\.aliyuncs\.com/,
    new CacheFirst({
        cacheName: 'static-immutable' + cacheSuffixVersion,
        fetchOptions: {
            mode: 'cors',
            credentials: 'omit'
        },
        plugins: [
            new ExpirationPlugin({
                maxAgeSeconds: 30 * 24 * 60 * 60,
                purgeOnQuotaError: true
            })
        ]
    })
);

routing.registerRoute(
    /.*cdn\.staticfile\.org/,
    new CacheFirst({
        cacheName: 'static-immutable' + cacheSuffixVersion,
        fetchOptions: {
            mode: 'cors',
            credentials: 'omit'
        },
        plugins: [
            new ExpirationPlugin({
                maxAgeSeconds: 30 * 24 * 60 * 60,
                purgeOnQuotaError: true
            })
        ]
    })
);

routing.registerRoute(
    /.*cdn\.nofated\.win/,
    new CacheFirst({
        cacheName: 'static-immutable' + cacheSuffixVersion,
        fetchOptions: {
            mode: 'cors',
            credentials: 'omit'
        },
        plugins: [
            new ExpirationPlugin({
                maxAgeSeconds: 30 * 24 * 60 * 60,
                purgeOnQuotaError: true
            })
        ]
    })
);

routing.registerRoute(
    /.*fonts\.googleapis\.cn/,
    new CacheFirst({
        cacheName: 'static-immutable' + cacheSuffixVersion,
        fetchOptions: {
            mode: 'cors',
            credentials: 'omit'
        },
        plugins: [
            new ExpirationPlugin({
                maxAgeSeconds: 30 * 24 * 60 * 60,
                purgeOnQuotaError: true
            })
        ]
    })
);

routing.registerRoute(
    /.*fonts\.gstatic\.com/,
    new CacheFirst({
        cacheName: 'static-immutable' + cacheSuffixVersion,
        fetchOptions: {
            mode: 'cors',
            credentials: 'omit'
        },
        plugins: [
            new ExpirationPlugin({
                maxAgeSeconds: 30 * 24 * 60 * 60,
                purgeOnQuotaError: true
            })
        ]
    })
);

routing.registerRoute(
    /.*fonts\.gstatic\.cn/,
    new CacheFirst({
        cacheName: 'static-immutable' + cacheSuffixVersion,
        fetchOptions: {
            mode: 'cors',
            credentials: 'omit'
        },
        plugins: [
            new ExpirationPlugin({
                maxAgeSeconds: 30 * 24 * 60 * 60,
                purgeOnQuotaError: true
            })
        ]
    })
);

routing.registerRoute(
    /.*www\.googletagmanager\.com/,
    new CacheFirst({
        cacheName: 'static-immutable' + cacheSuffixVersion,
        fetchOptions: {
            mode: 'cors',
            credentials: 'omit'
        },
        plugins: [
            new ExpirationPlugin({
                maxAgeSeconds: 30 * 24 * 60 * 60,
                purgeOnQuotaError: true
            })
        ]
    })
);

routing.registerRoute(
    new RegExp('https://www.google-analytics.com'),
    new NetworkOnly({
        plugins: [
            new backgroundSync.BackgroundSyncPlugin('Google_Analytics', {
                maxRetentionTime: 12 * 60
            }),
        ]
    }),
    "POST"
);

routing.registerRoute(
    new RegExp('https://comment.9595095.xyz'),
    new NetworkFirst({
        plugins: [
            new backgroundSync.BackgroundSyncPlugin('Comment', {
                maxRetentionTime: 12 * 60
            }),
        ]
    }),
    "POST"
);

routing.registerRoute(
    new RegExp('https://comment.9595095.xyz'),
    new NetworkFirst({
        plugins: [
            new backgroundSync.BackgroundSyncPlugin('Comment_GET', {
                maxRetentionTime: 12 * 60
            }),
        ]
    }),
    "GET"
);

routing.registerRoute(
    new RegExp('https://analytics.google.com'),
    new NetworkOnly({
        plugins: [
            new backgroundSync.BackgroundSyncPlugin('Google_Analytics_New', {
                maxRetentionTime: 12 * 60
            }),
        ]
    }),
    "POST"
)

const StaleWhileRevalidateInstance = new StaleWhileRevalidate();
/*
 * Others img
 * Method: staleWhileRevalidate
 * cacheName: img-cache
 */
routing.registerRoute(
    // Cache image files
    /.*\.(?:png|jpg|jpeg|gif|webp)/,
    StaleWhileRevalidateInstance
);

/*
 * Static Assets
 * Method: staleWhileRevalidate
 * cacheName: static-assets-cache
 */
routing.registerRoute(
    // Cache CSS files
    /.*\.(css|js)/,
    // Use cache but update in the background ASAP
    StaleWhileRevalidateInstance
);

/*
 * sw.js - Revalidate every time
 * staleWhileRevalidate
 */
routing.registerRoute(
    '/js/sw.js',
    StaleWhileRevalidateInstance
);



routing.registerRoute(
    /.*blog\.nofated\.win/,
    StaleWhileRevalidateInstance
);

routing.registerRoute(
    /.*localhost/,
    StaleWhileRevalidateInstance
);


routing.registerRoute(
    /.*\.(?:svg)/,
    new NetworkOnly()
);

/*
 * Default - Serve as it is
 * StaleWhileRevalidate
 */
routing.setDefaultHandler(
    new NetworkOnly()
);>
