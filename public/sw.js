// Minimal service worker – exists only to make the dashboard installable as
// a PWA (Android/Chrome require an active SW with a fetch handler for the
// install prompt). Intentionally does not cache anything: this is a live
// CRM, and showing stale Talente/Termine data offline would be worse than
// no offline support at all.
self.addEventListener("install", () => {
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request))
})
