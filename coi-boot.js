// Registers the isolation worker, then reloads once so the page is served with
// COOP/COEP. The first load is never isolated: the headers can only be added
// once the worker controls the page, which takes a reload. The reload waits for
// the worker to actually take control (controllerchange), with a short fallback
// for browsers that claim the page a moment later. Attempts are throttled so a
// browser that refuses service workers cannot spin, while a later visit starts
// over and tries again.
(function () {
  try {
    if (!("serviceWorker" in navigator)) return;

    if (window.crossOriginIsolated) {
      sessionStorage.removeItem("kw-coi-tries");
      return;
    }

    var now = Date.now();
    var last = Number(sessionStorage.getItem("kw-coi-at") || "0");
    var tries = now - last > 60000 ? 0 : Number(sessionStorage.getItem("kw-coi-tries") || "0");
    if (tries >= 3) return;
    sessionStorage.setItem("kw-coi-tries", String(tries + 1));
    sessionStorage.setItem("kw-coi-at", String(now));

    var reloading = false;
    function reloadOnce() {
      if (reloading) return;
      reloading = true;
      if (!window.crossOriginIsolated) {
        setTimeout(function () {
          location.reload();
        }, 60);
      }
    }

    navigator.serviceWorker
      .register("/coi-sw.js", { scope: "/" })
      .then(function () {
        if (navigator.serviceWorker.controller) {
          setTimeout(reloadOnce, 60);
          return;
        }
        navigator.serviceWorker.addEventListener("controllerchange", function () {
          setTimeout(reloadOnce, 60);
        });
        setTimeout(reloadOnce, 2500);
      })
      .catch(function () {
        // No worker: the page still runs, without the isolation.
      });
  } catch (e) {}
})();
