const CACHE_NAME = 'day-painter-v1'
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icons/icon-180.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png'
]
const CONFIG_FALLBACK = new Response('window.config = {}', {
  headers: { 'Content-Type': 'application/javascript' }
})

const isSameOriginGet = (request) =>
  request.method === 'GET' && new URL(request.url).origin === self.location.origin

const isStaticRequest = (request) => {
  const { pathname } = new URL(request.url)

  return (
    pathname.startsWith('/assets/') ||
    pathname.startsWith('/icons/') ||
    pathname === '/manifest.webmanifest' ||
    ['font', 'image', 'script', 'style'].includes(request.destination)
  )
}

const cacheResponse = async (request, response) => {
  if (response.ok) {
    const cache = await caches.open(CACHE_NAME)
    await cache.put(request, response.clone())
  }

  return response
}

const getFallback = async (fallback) =>
  typeof fallback === 'string' ? await caches.match(fallback) : fallback

const networkFirst = async (request, fallback) => {
  try {
    return await cacheResponse(request, await fetch(request))
  } catch {
    return await caches.match(request) ?? await getFallback(fallback)
  }
}

const cacheFirst = async (request) =>
  await caches.match(request) ?? await cacheResponse(request, await fetch(request))

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  if (!isSameOriginGet(event.request)) {
    return
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(networkFirst(event.request, '/index.html'))
    return
  }

  if (new URL(event.request.url).pathname === '/config.js') {
    event.respondWith(networkFirst(event.request, CONFIG_FALLBACK))
    return
  }

  if (isStaticRequest(event.request)) {
    event.respondWith(cacheFirst(event.request))
  }
})
