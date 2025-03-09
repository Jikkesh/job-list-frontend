// service-worker.js

const CACHE_NAME = 'job-image-cache-v1';

// Install event: runs when the service worker is first installed
self.addEventListener('install', (event) => {
  // Activate the SW immediately without waiting
  event.waitUntil(self.skipWaiting());
});

// Activate event: runs after install
self.addEventListener('activate', (event) => {
  // Take control of all pages immediately
  event.waitUntil(self.clients.claim());
});

// Fetch event: intercepts network requests
self.addEventListener('fetch', (event) => {
    
  // Convert the request URL to something we can inspect
  const requestUrl = new URL(event.request.url);

  // Check if this request is for your job image endpoint
  // (Adjust the condition/path to match your real endpoint)

  // For example: /api/jobs/:jobId/image
  if (requestUrl.pathname.endsWith('/image')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          // If the image is in cache, return it immediately
          if (cachedResponse) {
            return cachedResponse;
          }

          // Otherwise, fetch it from the network
          return fetch(event.request).then((networkResponse) => {
            // Store a clone of the response in the cache
            cache.put(event.request, networkResponse.clone());
            // Return the network response to the browser
            return networkResponse;
          });
        });
      })
    );
  }
  // If it's not an image request, do nothing special
});
