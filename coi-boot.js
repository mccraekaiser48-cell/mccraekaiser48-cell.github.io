// Registers the isolation worker, then reloads once so the page is served
// with COOP/COEP. The first load is never isolated: headers can only be added
// once the worker controls the page, which takes a reload. A small counter in
// sessionStorage stops it from looping anywhere service workers are refused.
(function () {
  try {
    if (!("serviceWorker" in navigator)) return;
    if (window.crossOriginIsolated) return;

    var KEY = "kw-coi-tries";
    var tries = Number(sessionStorage.getItem(KEY) || "0");
    if (tries >= 3) return;
    sessionStorage.setItem(KEY, String(tries + 1));

    navigator.serviceWorker
      .register("/coi-sw.js", { scope: "/" })
      .then(function () {
        return navigator.serviceWorker.ready;
      })
      .then(function () {
        setTimeout(function () {
          if (!window.crossOriginIsolated) location.reload();
        }, 60);
      })
      .catch(function () {
        // No worker: the page still runs, just without the desktop windows.
      });
  } catch (e) {}
})();
