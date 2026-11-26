/* Cloud PC launcher for the mirrored unkernel desktop.
 * Adds one button to the desktop that opens a small panel of real cloud GPU PCs.
 * No network calls, no dependencies, and every step is wrapped so a page change
 * can never take the desktop down with it.
 */
(function () {
  "use strict";

  if (window.__kwCloudPc) return;
  window.__kwCloudPc = true;

  var PROVIDERS = [
    {
      name: "Shadow PC",
      tag: "Full Windows desktop",
      url: "https://shadow.tech/",
      price: "from $37.99/mo (about $29/mo on a yearly plan)",
      detail:
        "Real Windows 11 machine with an RTX-class GPU and 256\u2013512 GB SSD. 120\u2013210 hours a month, sessions of 4\u20138 hours, no queue. Install Steam and play anything you own."
    },
    {
      name: "airgpu",
      tag: "Pay by the hour",
      url: "https://airgpu.com/",
      price: "from $0.65/hr, plus $3.50/mo per 50 GB of storage",
      detail:
        "No subscription \u2014 you buy credit and switch the machine on when you want it. A card similar to an RTX 4080 is about $1.20/hr. Good for a single evening on one big game."
    },
    {
      name: "Maximum Settings",
      tag: "Cheapest monthly",
      url: "https://maximumsettings.com/",
      price: "from about $7/mo (CA$9.95), extra time CA$0.35/hr",
      detail:
        "Dedicated cloud gaming PC with full desktop access and a daily allowance of hours (2 peak + 4 off-peak on the starter plan). Cheapest way to have a Windows PC waiting every day."
    }
  ];

  function el(tag, styles, text) {
    var node = document.createElement(tag);
    if (styles) node.setAttribute("style", styles);
    if (text != null) node.textContent = text;
    return node;
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

    var button = el(
      "button",
      [
        "display:flex",
        "align-items:center",
        "gap:8px",
        "padding:9px 14px",
        "border:1px solid rgba(255,255,255,.22)",
        "border-radius:999px",
        "background:linear-gradient(180deg,#2b3a55,#1c2637)",
        "color:#fff",
        "font:inherit",
        "font-weight:600",
        "cursor:pointer",
        "box-shadow:0 6px 20px rgba(0,0,0,.45)"
      ].join(";")
    );
    button.type = "button";
    button.setAttribute("aria-expanded", "false");
    button.appendChild(el("span", "font-size:15px", "\u2601"));
    button.appendChild(el("span", null, "Cloud PC"));

    var panel = el(
      "div",
      [
        "display:none",
        "position:absolute",
        "right:0",
        "bottom:calc(100% + 10px)",
        "width:min(360px,calc(100vw - 32px))",
        "max-height:min(70vh,520px)",
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
        "A real Windows PC with a GPU, streamed into this tab. All three are paid \u2014 nobody offers this free, because the machine has to stay on for you."
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
      card.appendChild(el("div", "font-size:11px;color:#c9a227;margin:2px 0 4px", p.price));
      card.appendChild(el("div", "font-size:12px;color:#aab3c0", p.detail));

      panel.appendChild(card);
    });

    panel.appendChild(
      el(
        "div",
        "font-size:11px;color:#7b8593;margin-top:6px",
        "For a heavy new game, an hour on airgpu costs less than a month anywhere else. For playing most evenings, Maximum Settings or Shadow wins. Opening these links does nothing until you sign up."
      )
    );

    function setOpen(open) {
      panel.style.display = open ? "block" : "none";
      button.setAttribute("aria-expanded", open ? "true" : "false");
    }

    button.addEventListener("click", function (event) {
      event.stopPropagation();
      setOpen(panel.style.display === "none");
    });

    panel.addEventListener("click", function (event) {
      event.stopPropagation();
    });

    document.addEventListener("click", function () {
      if (panel.style.display !== "none") setOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && panel.style.display !== "none") setOpen(false);
    });

    root.appendChild(panel);
    root.appendChild(button);
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
