// The desktop has two ways to start the kernel: in a worker (default) or on the
// page's own thread (?worker=0). The worker path is the one that can hang: on
// this host the kernel sits at "Starting the kernel worker" or "Allocating
// memory" with no error at all, and the boot's own 20 s worker timeout is not
// always reached. The inline path booted on every browser tried, so a stall
// falls back to it.
//
// What made a page load feel broken was the wait, not the fallback: the guard
// used to allow 25 s of silence before reacting. Those two stages normally
// finish in well under a second, so they now get a few seconds instead, and a
// browser that did have to fall back goes straight to the inline mode for the
// next week rather than stalling again. The memory is time-boxed so a browser
// that gets fixed later is not stuck on the slow path forever.
(function () {
  if (!/^https?:$/.test(location.protocol)) return;
  // An explicit choice in the URL is respected, and that is also what stops a
  // retry loop: the recovery load carries ?worker=0.
  if (/(^|[?&])worker=/.test(location.search)) return;

  var WEEK = 7 * 24 * 60 * 60 * 1000;
  var local = null;
  var session = null;
  try { local = window.localStorage; } catch (e) {}
  try { session = window.sessionStorage; } catch (e) {}

  function read(box, key) {
    try { return box && box.getItem(key); } catch (e) { return null; }
  }
  function write(box, key, value) {
    try { if (box) box.setItem(key, value); } catch (e) {}
  }

  function goInline(why) {
    write(session, "kw-inline-tries", "1");
    write(local, "kw-inline-until", String(Date.now() + WEEK));
    if (window.KW && typeof window.KW.report === "function") {
      window.KW.report("boot", "Switching to inline kernel mode", String(why || ""), false);
    }
    location.replace(location.pathname + "?worker=0");
  }

  // Same tab: never try the hanging mode twice in a row.
  if (read(session, "kw-inline-tries") === "1") return;

  // This browser already learned the worker path hangs here: skip it.
  var until = Number(read(local, "kw-inline-until") || "0");
  if (until > Date.now()) {
    write(session, "kw-inline-tries", "1");
    location.replace(location.pathname + "?worker=0");
    return;
  }

  var last = "";
  var since = Date.now();
  var done = false;

  function check() {
    if (done || !document.body) return;
    var ind = document.getElementById("tb-boot");
    // No indicator, or a hidden one, means the desktop is up: nothing to watch.
    if (!ind || ind.hasAttribute("data-hide")) return;
    if (ind.hasAttribute("data-error")) {
      done = true;
      goInline("boot error");
      return;
    }
    var msgEl = document.getElementById("tb-boot-msg");
    var text = (msgEl ? msgEl.textContent : "") || "";
    if (text !== last) {
      last = text;
      since = Date.now();
    }
    var idle = Date.now() - since;
    // Downloads and compiling are progress, however slow: they are left alone.
    var worker = /kernel worker/i.test(text) && !/did not report back/i.test(text);
    var memory = /Allocating memory/i.test(text);
    var failed = /failed to start|did not report back|Worker mode failed/i.test(text);
    if (!failed && !(worker && idle > 10000) && !(memory && idle > 8000)) return;
    done = true;
    goInline(text);
  }

  setInterval(check, 1000);
})();
