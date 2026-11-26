/* Desktop launcher for the mirrored unkernel desktop.
 * Adds two app icons to the desktop: PlayMyPS5 (opens in its own window) and a
 * Cloud PC panel of real GPU machines. No network calls, no dependencies, and
 * every step is wrapped so a page change can never take the desktop down.
 */
(function () {
  "use strict";

  if (window.__kwCloudPc) return;
  window.__kwCloudPc = true;

  var PS5_URL = "https://playmyps5.com/";

  var PROVIDERS = [
    {
      name: "Shadow PC",
      tag: "Full Windows desktop",
      url: "https://shadow.tech/",
      price: "from $37.99/mo (about $29/mo on a yearly plan)",
      storage: "512 GB SSD included, expandable to 5 TB for an extra charge",
      detail:
        "Real Windows 11 machine with an RTX-class GPU (Power plan: 20 GB VRAM, 28 GB RAM). 120\u2013210 hours a month, sessions of 4\u20138 hours, no queue. Install Steam and play anything you own."
    },
    {
      name: "Maximum Settings",
      tag: "1 TB of space",
      url: "https://maximumsettings.com/",
      price: "from about $7/mo (CA$9.95); the big rig is CA$29.95 \u2248 $22/mo",
      storage: "Bare metal rig: 750 GB SSD + 4 TB hard drive",
      detail:
        "Dedicated cloud gaming PC with full desktop access and a daily allowance of hours. The bare-metal plan is an RX 7900 XTX with a Ryzen 9 \u2014 the cheapest way to get a big GPU and a terabyte of room."
    },
    {
      name: "airgpu",
      tag: "Pay by the hour",
      url: "https://airgpu.com/",
      price: "from $0.65/hr; an RTX 4080-class card is about $1.20/hr",
      storage: "storage billed on top: $3.50/mo per 50 GB, so 1 TB is about $70/mo",
      detail:
        "No subscription \u2014 buy credit and switch the machine on when you want it. Cheap for one long evening, expensive if you keep a terabyte sitting there month after month."
    }
  ];

  function el(tag, styles, text) {
    var node = document.createElement(tag);
    if (styles) node.setAttribute("style", styles);
    if (text != null) node.textContent = text;
    return node;
  }

  function iconButton(label, caption, background) {
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
        "font:inherit",
        "cursor:pointer"
      ].join(";")
    );
    wrap.type = "button";
    wrap.title = caption;
    wrap.setAttribute("aria-label", caption);

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
        "background:" + background
      ].join(";"),
      label
    );

    var cap = el(
      "span",
      "font-size:10px;line-height:1;padding:2px 5px;border-radius:6px;background:rgba(0,0,0,.55);white-space:nowrap",
      caption
    );

    wrap.appendChild(face);
    wrap.appendChild(cap);
    return wrap;
  }

  function openPs5() {
    var win = null;
    try {
      win = window.open(PS5_URL, "playmyps5", "popup=yes,width=1280,height=820,noopener");
    } catch (err) {
      win = null;
    }
    if (!win) {
      window.location.href = PS5_URL;
    }
  }

  function build() {
    if (document.getElementById("kw-cloudpc-root")) return;

    var root = el("div");
    root.id = "kw-cloudpc-root";
    root.setAttribute(
      "style",
      [
        "position:fixed",
        "right:16px",
        "bottom:56px",
        "z-index:2147483000",
        "font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif",
        "font-size:13px",
        "line-height:1.45",
        "color:#f2f4f8"
      ].join(";")
    );

    var panel = el(
      "div",
      [
        "display:none",
        "position:absolute",
        "right:0",
        "bottom:calc(100% + 12px)",
        "width:min(370px,calc(100vw - 32px))",
        "max-height:min(74vh,560px)",
        "overflow:auto",
        "padding:14px",
        "border:1px solid rgba(255,255,255,.18)",
        "border-radius:14px",
        "background:#11151d",
        "box-shadow:0 18px 48px rgba(0,0,0,.6)"
      ].join(";")
    );

    panel.appendChild(el("div", "font-size:15px;font-weight:700;margin-bottom:2px", "Cloud PC"));
    panel.appendChild(
      el(
        "div",
        "color:#9aa4b2;margin-bottom:10px",
        "A real Windows PC with a GPU, streamed into this tab. All of these are paid \u2014 nobody offers this free, because the machine has to stay on for you."
      )
    );

    panel.appendChild(
      el(
        "div",
        "padding:9px 10px;margin-bottom:10px;border-radius:10px;background:#131b26;border:1px solid rgba(255,255,255,.1);color:#c8d2e0;font-size:12px",
        "What a game the size of GTA VI wants: about 200 GB free, 16 GB of RAM or more, and an RTX 4080-class card. Shadow Power and the Maximum Settings bare-metal rig clear that. Your Chromebook only draws the picture, so a weak laptop is fine."
      )
    );

    PROVIDERS.forEach(function (p) {
      var card = el(
        "a",
        [
          "display:block",
          "padding:10px",
          "margin-bottom:8px",
          "border:1px solid rgba(255,255,255,.12)",
          "border-radius:10px",
          "background:#1a202b",
          "color:#f2f4f8",
          "text-decoration:none"
        ].join(";")
      );
      card.href = p.url;
      card.target = "_blank";
      card.rel = "noopener noreferrer";

      var head = el("div", "display:flex;justify-content:space-between;gap:8px;align-items:baseline");
      head.appendChild(el("span", "font-weight:700", p.name));
      head.appendChild(el("span", "font-size:11px;color:#8ad6a0;white-space:nowrap", p.tag));
      card.appendChild(head);
      card.appendChild(el("div", "font-size:11px;color:#c9a227;margin:2px 0 2px", p.price));
      card.appendChild(el("div", "font-size:11px;color:#8ea3bb;margin-bottom:4px", p.storage));
      card.appendChild(el("div", "font-size:12px;color:#aab3c0", p.detail));

      panel.appendChild(card);
    });

    panel.appendChild(
      el(
        "div",
        "font-size:11px;color:#7b8593;margin-top:6px",
        "Opening these links does nothing until you sign up. For a free turn on a real PS5 tonight, use the PS5 icon on the desktop."
      )
    );

    var dock = el("div", "display:flex;align-items:flex-end;gap:10px");

    var ps5 = iconButton("PS5", "PlayMyPS5", "linear-gradient(180deg,#1f6feb,#0b3d91)");
    ps5.addEventListener("click", function (event) {
      event.stopPropagation();
      openPs5();
    });
    ps5.addEventListener("dblclick", function (event) {
      event.stopPropagation();
      openPs5();
    });

    var cloud = iconButton("PC", "Cloud PC", "linear-gradient(180deg,#2b3a55,#1c2637)");
    cloud.setAttribute("aria-expanded", "false");

    var open = false;
    function setOpen(next) {
      open = next;
      panel.style.display = next ? "block" : "none";
      cloud.setAttribute("aria-expanded", next ? "true" : "false");
    }

    cloud.addEventListener("click", function (event) {
      event.stopPropagation();
      setOpen(!open);
    });

    panel.addEventListener("click", function (event) {
      event.stopPropagation();
    });

    document.addEventListener("click", function () {
      if (open) setOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && open) setOpen(false);
    });

    dock.appendChild(ps5);
    dock.appendChild(cloud);

    root.appendChild(panel);
    root.appendChild(dock);
    document.body.appendChild(root);
  }

  function start() {
    try {
      build();
    } catch (err) {
      if (window.console) console.warn("cloud-pc: skipped", err);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
