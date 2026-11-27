/* Desktop launcher for the mirrored unkernel desktop.
 * One app icon: KytyPS5 Web, a WebAssembly build of the Kyty PS5 emulator that
 * runs in the browser at shubin123.github.io/kytyps5_web. Drawn with the four
 * PlayStation-style glyphs so it reads as a console emulator at a glance.
 * It opens in its own window, or this tab when the browser blocks pop-ups.
 * No dependencies, and every step is wrapped so a page change can never take
 * the desktop down.
 */
(function () {
  "use strict";

  if (window.__kwPs5Icon) return;
  window.__kwPs5Icon = true;

  var PS5_URL = "https://shubin123.github.io/kytyps5_web/";

  var ICON_SVG = [
    '<svg viewBox="0 0 48 48" width="46" height="46" role="img" aria-label="PS5 emulator" xmlns="http://www.w3.org/2000/svg">',
    '<defs>',
    '<linearGradient id="kwBg" x1="0" y1="0" x2="0" y2="1">',
    '<stop offset="0" stop-color="#1b2f6b"/>',
    '<stop offset="1" stop-color="#070b18"/>',
    '</linearGradient>',
    '</defs>',
    '<rect x="1" y="1" width="46" height="46" rx="11" fill="url(#kwBg)" stroke="rgba(255,255,255,.28)"/>',
    '<g fill="none" stroke="#9dc0ff" stroke-width="2.1" stroke-linejoin="round" stroke-linecap="round">',
    '<path d="M15 12.5 L19.5 20.5 L10.5 20.5 Z"/>',
    '<circle cx="33" cy="16.5" r="4"/>',
    '<path d="M10.5 27.5 L19.5 27.5 M15 23 L15 32"/>',
    '<rect x="29" y="23.5" width="8" height="8" rx="1.4"/>',
    '</g>',
    '<text x="24" y="42.5" text-anchor="middle" font-family="system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-size="7" font-weight="700" letter-spacing="1.4" fill="#cfdcff">PS5</text>',
    '</svg>'
  ].join("");

  function el(tag, styles, text) {
    var node = document.createElement(tag);
    if (styles) node.setAttribute("style", styles);
    if (text != null) node.textContent = text;
    return node;
  }

  function openPs5() {
    var win = null;
    try {
      win = window.open(PS5_URL, "kytyps5web", "popup=yes,width=1280,height=820,noopener");
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
        "cursor:pointer",
        "filter:drop-shadow(0 6px 18px rgba(0,0,0,.5))"
      ].join(";")
    );
    wrap.id = "kw-ps5-icon";
    wrap.type = "button";
    wrap.title = "PS5 emulator - Kyty web";
    wrap.setAttribute("aria-label", "PS5 emulator");

    var face = el(
      "span",
      [
        "display:flex",
        "align-items:center",
        "justify-content:center",
        "width:46px",
        "height:46px",
        "pointer-events:none"
      ].join(";")
    );
    face.innerHTML = ICON_SVG;

    var cap = el(
      "span",
      "font-size:10px;line-height:1;padding:2px 5px;border-radius:6px;background:rgba(0,0,0,.6);white-space:nowrap",
      "PS5 Emu"
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
