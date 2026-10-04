// 인터넷이 없어도 홈 화면 앱이 열리게 파일을 저장해 둔다.
// 인터넷이 되면 항상 새 버전을 받아오고(수정 사항 바로 반영), 안 되면 저장해 둔 것을 쓴다.
const CACHE = 'hyejin-day';
const FILES = ['./', 'index.html', 'logic.js', 'messages.js', 'manifest.webmanifest', 'icon.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
