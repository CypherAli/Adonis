// Empty service worker to prevent browser extension errors
// This file exists to satisfy browser extension requests for service-worker.js
// The actual errors are from browser extensions like React DevTools, not from our app

self.addEventListener('install', () => {
  // No-op
})

self.addEventListener('activate', () => {
  // No-op
})

self.addEventListener('fetch', () => {
  // No-op - we're not using service worker for caching
})
