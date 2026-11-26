// GitHub Pages cannot send COOP/COEP response headers, and the guest needs a
// cross-origin isolated page: shared memory, more than one vCPU and the window
// layer (Wayland compositor) all hang off that. This worker adds those headers
// to navigations and marks same-origin resources with CORP, which the kernel
// worker (started from a blob: URL) needs before it may import them.
self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) { e.waitUntil(self.clients.claim()); });

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  // The distro image is streamed with Range requests and must not be re-wrapped.
  if (url.pathname.indexOf("/distros/") === 0) return;
  var nav = req.mode === "navigate";
  event.respondWith(
    fetch(req).then(function (res) {
      if (res.status === 304 || res.status === 206 || res.type === "opaque" || res.type === "opaqueredirect") return res;
      var h = new Headers(res.headers);
      h.set("Cross-Origin-Resource-Policy", "cross-origin");
      if (nav) {
        h.set("Cross-Origin-Opener-Policy", "same-origin");
        h.set("Cross-Origin-Embedder-Policy", "require-corp");
      }
      return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
    }).catch(function () { return fetch(req); })
  );
});
