/* Desktop launcher for the mirrored unkernel desktop.
 * One app icon: PlayMyPS5. It opens inside the desktop now, in a real window
 * frame, because the site's isolation header was relaxed from require-corp to
 * credentialless (see coi-sw.js). Falls back to a popup link if the frame is
 * blocked. No dependencies, and every step is wrapped so a page change can
 * never take the desktop down.
 */
(function () {
  "use strict";

  if (window.__kwPs5Icon) return;
  window.__kwPs5Icon = true;

  var PS5_URL = "https://playmyps5.com/";

  function el(tag, styles, text) {
    var node = document.createElement(tag);
    if (styles) node.setAttribute("style", styles);
    if (text != null) node.textContent = text;
    return node;
  }

  function openWindow() {
    var sheet = el(
      "div",
      [
        "position:fixed",
        "inset:0",
        "z-index:2147483001",
        "display:flex",
        "align-items:center",
        "justify-content:center",
        "padding:2.4vh 2.4vw",
        "background:rgba(4,7,12,.82)",
        "backdrop-filter:blur(2px)"
      ].join(";")
    );
    sheet.id = "kw-ps5-sheet";

    var frameBox = el(
      "div",
      [
        "display:flex",
        "flex-direction:column",
        "width:100%",
        "height:100%",
        "max-width:1500px",
        "border-radius:14px",
        "overflow:hidden",
        "border:1px solid rgba(255,255,255,.16)",
        "background:#0b0e13",
        "box-shadow:0 24px 70px rgba(0,0,0,.65)"
      ].join(";")
    );

    var bar = el(
      "div",
      [
        "display:flex",
        "align-items:center",
        "gap:10px",
        "padding:8px 10px",
        "background:#141a24",
        "border-bottom:1px solid rgba(255,255,255,.1)",
        "font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif",
        "font-size:13px",
        "color:#f2f4f8"
      ].join(";")
    );

    bar.appendChild(el("span", "font-weight:700;letter-spacing:.3px", "PlayMyPS5"));
    bar.appendChild(el("span", "flex:1"));

    var pop = el(
      "a",
      "color:#8ab4f8;text-decoration:none;font-size:12px;padding:4px 8px;border-radius:8px;border:1px solid rgba(255,255,255,.14)",
      "Open in its own window"
    );
    pop.href = PS5_URL;
    pop.target = "_blank";
    pop.rel = "noopener";

    var close = el(
      "button",
      [
        "width:28px",
        "height:28px",
        "border-radius:8px",
        "border:1px solid rgba(255,255,255,.16)",
        "background:#1d2431",
        "color:#fff",
        "font:inherit",
        "font-size:15px",
        "line-height:1",
        "cursor:pointer"
      ].join(";"),
      "\u00d7"
    );
    close.type = "button";
    close.title = "Close";
    close.setAttribute("aria-label", "Close PlayMyPS5");

    bar.appendChild(pop);
    bar.appendChild(close);

    var frame = document.createElement("iframe");
    frame.src = PS5_URL;
    frame.title = "PlayMyPS5";
    frame.setAttribute("allow", "autoplay; fullscreen; gamepad; encrypted-media; clipboard-write");
    frame.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
    frame.setAttribute(
      "style",
      "flex:1;width:100%;border:0;display:block;background:#000"
    );

    frameBox.appendChild(bar);
    frameBox.appendChild(frame);
    sheet.appendChild(frameBox);
    document.body.appendChild(sheet);

    function shut() {
      document.removeEventListener("keydown", onKey, true);
      if (sheet.parentNode) sheet.parentNode.removeChild(sheet);
    }

    function onKey(event) {
      if (event.key === "Escape") {
        event.stopPropagation();
        shut();
      }
    }

    close.addEventListener("click", shut);
    document.addEventListener("keydown", onKey, true);
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
    wrap.title = "PlayMyPS5";
    wrap.setAttribute("aria-label", "PlayMyPS5");

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
      "PlayMyPS5"
    );

    wrap.appendChild(face);
    wrap.appendChild(cap);

    wrap.addEventListener("click", function (event) {
      event.stopPropagation();
      var open = document.getElementById("kw-ps5-sheet");
      if (open) {
        open.parentNode.removeChild(open);
        return;
      }
      openWindow();
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
