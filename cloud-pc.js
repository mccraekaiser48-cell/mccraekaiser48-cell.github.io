/* Desktop launcher for the mirrored unkernel desktop.
 * Two app icons: PlayMyPS5 (free shared PS5, five-minute turns) and Warplay
 * (free PC games, 30-minute sessions, no monthly cap). Both open in their own
 * window, or this tab if the browser blocks pop-ups: the desktop page is
 * cross-origin isolated and an isolated page refuses to frame other sites.
 * No dependencies, and every step is wrapped so a page change can never take
 * the desktop down.
 */
(function () {
  "use strict";

  if (window.__kwPs5Icon) return;
  window.__kwPs5Icon = true;

  var APPS = [
    {
      id: "kw-ps5-icon",
      face: "PS5",
      caption: "PlayMyPS5",
      url: "https://playmyps5.com/",
      windowName: "playmyps5",
      background: "linear-gradient(180deg,#1f6feb,#0b3d91)"
    },
    {
      id: "kw-warplay-icon",
      face: "W",
      caption: "Warplay",
      url: "https://warplay.cloud/",
      windowName: "warplay",
      background: "linear-gradient(180deg,#7b3ff2,#3b1a8a)"
    }
  ];

  function el(tag, styles, text) {
    var node = document.createElement(tag);
    if (styles) node.setAttribute("style", styles);
    if (text != null) node.textContent = text;
    return node;
  }

  function openApp(app) {
    var win = null;
    try {
      win = window.open(app.url, app.windowName, "popup=yes,width=1280,height=820,noopener");
    } catch (err) {
      win = null;
    }
    if (!win) {
      window.location.href = app.url;
    }
  }

  function buildIcon(app) {
    if (document.getElementById(app.id)) return;

    var wrap = el(
      "button",
      [
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
    wrap.id = app.id;
    wrap.type = "button";
    wrap.title = app.caption;
    wrap.setAttribute("aria-label", app.caption);

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
        "background:" + app.background
      ].join(";"),
      app.face
    );

    var cap = el(
      "span",
      "font-size:10px;line-height:1;padding:2px 5px;border-radius:6px;background:rgba(0,0,0,.55);white-space:nowrap",
      app.caption
    );

    wrap.appendChild(face);
    wrap.appendChild(cap);

    wrap.addEventListener("click", function (event) {
      event.stopPropagation();
      openApp(app);
    });

    var dock = document.getElementById("kw-dock");
    if (!dock) {
      dock = el(
        "div",
        [
          "position:fixed",
          "right:16px",
          "bottom:56px",
          "z-index:2147483000",
          "display:flex",
          "align-items:flex-end",
          "gap:10px"
        ].join(";")
      );
      dock.id = "kw-dock";
      document.body.appendChild(dock);
    }

    dock.appendChild(wrap);
  }

  function start() {
    try {
      APPS.forEach(buildIcon);
    } catch (err) {
      if (window.console) console.warn("desktop icons: skipped", err);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
