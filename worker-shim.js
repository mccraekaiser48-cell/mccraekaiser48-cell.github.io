// GitHub Pages serves this page through a service worker to get the COOP/COEP
// headers it cannot send itself. Chrome will not take a worker script from that
// worker, though: the request is refused before it reaches the page
// (coep-frame-resource-needs-coep-header), and the kernel itself runs in a
// worker, so every boot failed with "the kernel worker failed to start".
//
// A worker built from a blob URL is created locally instead of fetched, and it
// inherits the page's isolation. Importing the real script by its absolute URL
// keeps every relative import inside it resolving as it did before.
//
// This only applies to an isolated page: without the isolation there is no
// embedder policy to trip over and a plain worker loads normally, so browsers
// that never got the isolation keep the untouched path.
(function () {
  var Native = window.Worker;
  if (!Native) return;
  if (!window.crossOriginIsolated) return;
  if (!navigator.serviceWorker || !navigator.serviceWorker.controller) return;

  function fromBlob(abs, opts) {
    var src =
      opts && opts.type === "module"
        ? "import(" + JSON.stringify(abs) + ");"
        : "importScripts(" + JSON.stringify(abs) + ");";
    var url = URL.createObjectURL(new Blob([src], { type: "text/javascript" }));
    return new Native(url, opts);
  }

  function Worker(url, opts) {
    try {
      if (typeof url === "string" || url instanceof URL) {
        var abs = new URL(String(url), document.baseURI);
        if (abs.origin === location.origin && (abs.protocol === "https:" || abs.protocol === "http:")) {
          return fromBlob(abs.href, opts);
        }
      }
    } catch (e) {}
    return opts ? new Native(url, opts) : new Native(url);
  }

  Worker.prototype = Native.prototype;
  window.Worker = Worker;
})();
