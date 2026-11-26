// GitHub Pages cannot send COOP/COEP response headers, and unkernel needs a
// cross-origin isolated page: shared memory, more than one vCPU and the window
// layer (the Wayland compositor) all hang off that. A service worker may set
// those headers on the documents it serves, which is the only way to get the
// isolation on a static host.
//
// It also covers what the build's crawl cannot see: the desktop engine pulls
// in chunks by name the crawler never finds (assets/wland-*.js,
// assets/client-*.js), and a 404 there kills every window. Those are fetched
// from the header-adding mirror of this same site, which falls back upstream.

var FALLBACK = "https://unkernel-isolated-fxur3n-preview.freebuff.site";

self.addEventListener("install", function () {
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return;

  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // The distro image is streamed with Range requests: leave it untouched.
  if (url.pathname.indexOf("/distros/") === 0) return;

  var nav = req.mode === "navigate";

  event
    .respondWith(
      fetch(req)
        .then(function (res) {
          if (res.status === 404 && url.pathname.indexOf("/assets/") === 0) {
            return fetch(FALLBACK + url.pathname + url.search, { mode: "cors" })
              .then(function (alt) {
                return alt && alt.ok ? alt : res;
              })
              .catch(function () {
                return res;
              });
          }
          return res;
        })
        .then(function (res) {
          if (res.status === 304 || res.status === 206 || res.type === "opaque") return res;
          var h = new Headers(res.headers);
          // The body is handed over decoded, so the encoded size no longer holds.
          h.delete("content-encoding");
          h.delete("content-length");
          h.set("Cross-Origin-Resource-Policy", "cross-origin");
          if (nav) {
            h.set("Cross-Origin-Opener-Policy", "same-origin");
            h.set("Cross-Origin-Embedder-Policy", "require-corp");
          }
          return new Response(res.body, {
            status: res.status,
            statusText: res.statusText,
            headers: h,
          });
        })
        .catch(function () {
          return fetch(req);
        })
    );
});
