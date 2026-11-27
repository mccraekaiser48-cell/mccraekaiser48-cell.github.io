/* Desktop launcher for the mirrored unkernel desktop.
 * One app icon: the free shared PS5 at playmyconsole.com (the newer domain of
 * the PlayMyPS5 project, whose host network makes the queue shorter). It opens
 * in its own window, or this tab when the browser blocks pop-ups: the desktop
 * page is cross-origin isolated, and an isolated page refuses to frame a
 * third-party site.
 * No dependencies, and every step is wrapped so a page change can never take
 * the desktop down.
 */
(function () {
  "use strict";

  if (window.__kwPs5Icon) return;
  window.__kwPs5Icon = true;

  var PS5_URL = "https://playmyconsole.com/";

  function el(tag, styles, text) {
    var node = document.createElement(tag);
    if (styles) node.setAttribute("style", styles);
    if (text != null) node.textContent = text;
    return node;
  }

  function openPs5() {
    var win = null;
    try {
      win = window.open(PS5_URL, "cloudps5", "popup=yes,width=1280,height=820,noopener");
    } catch (err) {
      win = null;
    }
    if (!win) {
      window.location.href = PS5_URL;
    }
  }

  function build() {
    if (document.getElementById("kw-ps5-icon")) return;

    var wrap = el(
      "button",
      [
        "position:fixed",
        "right:16px",
        "bottom:56px",
        "z-index:2147483000",
        "display:flex",
        "flex-direction:column",
        "align-items:center",
        "gap:4px",
        "padding:0",
        "border:0",
        "background:none",
        "color:#f2f4f8",
        "font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif",
        "font-size:13px",
        "cursor:pointer"
      ].join(";")
    );
    wrap.id = "kw-ps5-icon";
    wrap.type = "button";
    wrap.title = "Cloud PS5 - playmyconsole.com";
    wrap.setAttribute("aria-label", "Cloud PS5");

    var face = el(
      "span",
      [
        "display:flex",
        "align-items:center",
        "justify-content:center",
        "width:46px",
        "height:46px",
        "border-radius:12px",
        "border:1px solid rgba(255,255,255,.22)",
        "box-shadow:0 6px 18px rgba(0,0,0,.45)",
        "font-size:13px",
        "font-weight:700",
        "letter-spacing:.4px",
        "background:linear-gradient(180deg,#1f6feb,#0b3d91)"
      ].join(";"),
      "PS5"
    );

    var cap = el(
      "span",
      "font-size:10px;line-height:1;padding:2px 5px;border-radius:6px;background:rgba(0,0,0,.55);white-space:nowrap",
      "Cloud PS5"
    );

    wrap.appendChild(face);
    wrap.appendChild(cap);

    wrap.addEventListener("click", function (event) {
      event.stopPropagation();
      openPs5();
    });

    document.body.appendChild(wrap);
  }

  function start() {
    try {
      build();
    } catch (err) {
      if (window.console) console.warn("ps5 icon: skipped", err);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
