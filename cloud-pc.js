/* Desktop launcher for the mirrored unkernel desktop.
 * One app icon: GTA VI, opening the bare video player of the free shared
 * console's stream. No chat, no queue, no page furniture, just the game.
 * It opens in its own window, or this tab when the browser blocks pop-ups.
 * No dependencies, and every step is wrapped so a page change can never take
 * the desktop down.
 */
(function () {
  "use strict";

  if (window.__kwPs5Icon) return;
  window.__kwPs5Icon = true;

  var GTA_URL = "https://player.twitch.tv/?channel=playmyps5&parent=mccraekaiser48-cell.github.io&autoplay=true";

  function el(tag, styles, text) {
    var node = document.createElement(tag);
    if (styles) node.setAttribute("style", styles);
    if (text != null) node.textContent = text;
    return node;
  }

  function openGta() {
    var win = null;
    try {
      win = window.open(GTA_URL, "gtavi", "popup=yes,width=1280,height=760,noopener");
    } catch (err) {
      win = null;
    }
    if (!win) {
      window.location.href = GTA_URL;
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
    wrap.title = "GTA VI - live";
    wrap.setAttribute("aria-label", "GTA VI");

    var face = el(
      "span",
      [
        "display:flex",
        "flex-direction:column",
        "align-items:center",
        "justify-content:center",
        "width:46px",
        "height:46px",
        "border-radius:12px",
        "border:1px solid rgba(255,255,255,.24)",
        "background:linear-gradient(160deg,#ff8a3d,#c2185b 55%,#2b1055)",
        "font-size:11px",
        "font-weight:800",
        "letter-spacing:.6px",
        "line-height:1.05",
        "color:#fff",
        "text-shadow:0 1px 3px rgba(0,0,0,.55)"
      ].join(";")
    );
    face.appendChild(el("span", "font-size:8px;opacity:.9", "GTA"));
    face.appendChild(el("span", "font-size:15px", "VI"));

    var cap = el(
      "span",
      "font-size:10px;line-height:1;padding:2px 5px;border-radius:6px;background:rgba(0,0,0,.6);white-space:nowrap",
      "GTA VI"
    );

    wrap.appendChild(face);
    wrap.appendChild(cap);

    wrap.addEventListener("click", function (event) {
      event.stopPropagation();
      openGta();
    });

    document.body.appendChild(wrap);
  }

  function start() {
    try {
      build();
    } catch (err) {
      if (window.console) console.warn("gta icon: skipped", err);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
