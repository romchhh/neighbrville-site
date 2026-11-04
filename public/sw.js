/* NeighbrVille media service worker — cache-first for images & optimized assets. */
const CACHE_NAME = "nv-media-v2";
const MEDIA_PATHS = ["/images/", "/brand/", "/_next/image", "/_next/static/media"];

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith("nv-media-") && key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

function isMediaRequest(request, url) {
  if (request.method !== "GET") return false;
  if (url.origin !== self.location.origin) return false;
  return MEDIA_PATHS.some(
    (prefix) =>
      url.pathname === prefix || url.pathname.startsWith(prefix),
  );
}

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (!isMediaRequest(event.request, url)) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(event.request, { ignoreVary: true });
      if (cached) return cached;

      try {
        const response = await fetch(event.request);
        if (response.ok) {
          await cache.put(event.request, response.clone());
        }
        return response;
      } catch (error) {
        if (cached) return cached;
        throw error;
      }
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "WARM" && Array.isArray(event.data.urls)) {
    event.waitUntil(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        await Promise.all(
          event.data.urls.map(async (url) => {
            try {
              const request = new Request(url, { credentials: "same-origin" });
              if (await cache.match(request, { ignoreVary: true })) return;
              const response = await fetch(request);
              if (response.ok) await cache.put(request, response.clone());
            } catch {
              // ignore warm failures
            }
          }),
        );
      })(),
    );
  }
});
