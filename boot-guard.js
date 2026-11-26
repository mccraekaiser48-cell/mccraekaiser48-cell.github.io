// Some browsers never get the kernel worker going: a school Chromebook sat at
// "Starting the kernel worker" with no error at all, and the page has no way to
// recover on its own. The boot does have a 20 s worker timeout, but a stalled
// worker does not always even reach it.
//
// The kernel can also run on the page's own thread instead (?worker=0, the same
// switch the boot screen mentions), which needs no worker at all and booted on
// every browser this was tried on. So: if the worker stage stalls or fails,
// reload once without it.
(function () {
  if (!/^https?:$/.test(location.protocol)) return;
  // An explicit choice in the URL is respected, and that is also what stops a
  // retry loop: the second load carries ?worker=0.
  if (/(^|[?&])worker=/.test(location.search)) return;
  try {
    if (sessionStorage.getItem("kw-inline-tries") === "1") return;
  } catch (e) {}

  var last = "";
  var since = Date.now();
  var done = false;

  function check() {
    if (done || !document.body) return;
    var text = document.body.innerText || "";
    if (text !== last) {
      last = text;
      since = Date.now();
    }
    var stalled =
      /Starting the kernel worker|Allocating memory/.test(text) && Date.now() - since > 25000;
    var failed = /kernel worker failed to start|Worker mode failed|did not report back within/.test(text);
    if (!stalled && !failed) return;
    done = true;
    try {
      sessionStorage.setItem("kw-inline-tries", "1");
    } catch (e) {}
    location.replace(location.pathname + "?worker=0");
  }

  setInterval(check, 2000);
})();
