// Native anchors remain functional without JavaScript.
document.documentElement.classList.add("js");
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#primary-nav");
toggle.hidden = false;
const setMenu = (open) => {
  toggle.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("is-open", open);
  toggle.querySelector(".menu-label").textContent = open ? "Close" : "Menu";
};
toggle.addEventListener("click", () =>
  setMenu(toggle.getAttribute("aria-expanded") !== "true"),
);
nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenu(false);
});
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    toggle.getAttribute("aria-expanded") === "true"
  ) {
    setMenu(false);
    toggle.focus();
  }
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) setMenu(false);
});
const desktop = window.matchMedia("(min-width: 761px)");
desktop.addEventListener("change", () => setMenu(false));
const links = [...nav.querySelectorAll(".nav-link")];
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting);
      if (!visible.length) return;
      const id = visible[0].target.id;
      links.forEach((link) => {
        if (link.hash === `#${id}`)
          link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-15% 0px -55% 0px", threshold: 0 },
  );
  document
    .querySelectorAll("main section[id]")
    .forEach((section) => observer.observe(section));
}
document.querySelector("#year").textContent = new Date().getFullYear();


/* Seasonal greeting overlay. Times are Singapore/China time (UTC+8). */
(() => {
  const SEASONAL_GREETINGS = [
    {
      id: "christmas",
      effect: "snow",
      until: "2027-01-03T00:00:00+08:00",
      image: "/assets/greeting-christmas-2026.webp",
      label:
        "WisdomAsia, Transcultural Intelligence. Season's Greetings from China. Merry Christmas and Happy New Year 2027. May this festive season bring joy and peace, and may the year ahead open new horizons of opportunity and discovery. The WisdomAsia Team.",
    },
    {
      id: "cny",
      effect: "petals",
      until: "2027-02-21T00:00:00+08:00",
      image: "/assets/greeting-cny-2027.webp",
      label:
        "三陽開泰 萬象更新. Renewed Harmony, New Possibilities. Happy Chinese New Year 2027, the Year of the Goat. The WisdomAsia Team, Transcultural Intelligence.",
    },
  ];
  const SECONDS = 10;

  const overlay = document.getElementById("seasonal-greeting");
  if (!overlay) return;

  let forced = null;
  try {
    forced = new URLSearchParams(location.search).get("greeting");
  } catch (e) {}
  if (forced === "none") return;

  const now = Date.now();
  const greeting = forced
    ? SEASONAL_GREETINGS.find((g) => g.id === forced)
    : SEASONAL_GREETINGS.find((g) => now < Date.parse(g.until));
  if (!greeting) return;

  const seenKey = "wa-greeting-seen-" + greeting.id;
  if (!forced) {
    try {
      if (sessionStorage.getItem(seenKey)) return;
    } catch (e) {}
  }

  const card = overlay.querySelector(".greeting-card");
  const img = overlay.querySelector(".greeting-image");
  const label = overlay.querySelector("#greeting-label");
  const countdown = overlay.querySelector(".greeting-countdown");
  const closeBtn = overlay.querySelector(".greeting-close");

  img.src = greeting.image;
  img.alt = greeting.label;
  label.textContent = greeting.label;

  let remaining = SECONDS;
  let paused = false;
  let timer = null;
  const previousFocus = document.activeElement;

  const render = () => {
    countdown.textContent = paused
      ? "Paused"
      : "Closes in " + remaining + "s";
  };

  const close = () => {
    clearInterval(timer);
    setTimeout(() => fx.stop(), 250);
    overlay.classList.remove("is-open");
    document.removeEventListener("keydown", onKey);
    setTimeout(() => {
      overlay.hidden = true;
    }, 250);
    try {
      sessionStorage.setItem(seenKey, "1");
    } catch (e) {}
    if (previousFocus && previousFocus.focus) previousFocus.focus();
  };

  const onKey = (e) => {
    if (e.key === "Escape") close();
    if (e.key === "Tab") {
      e.preventDefault();
      closeBtn.focus();
    }
  };

  const tick = () => {
    if (paused) return;
    remaining -= 1;
    if (remaining <= 0) {
      close();
      return;
    }
    render();
  };

  /* Falling snow or plum-blossom petals over the greeting. */
  const fx = (() => {
    const canvas = overlay.querySelector(".greeting-fx");
    const reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canvas || !canvas.getContext || reduce || !greeting.effect) {
      return { start() {}, stop() {} };
    }
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf = 0, last = 0, parts = [];
    const petal = greeting.effect === "petals";
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const make = (anyY) => {
      const r = petal ? 4 + Math.random() * 5 : 1.2 + Math.random() * 2.8;
      return {
        x: Math.random() * w,
        y: anyY ? Math.random() * h : -12,
        r,
        vy: petal ? 28 + Math.random() * 34 : 22 + r * 14 + Math.random() * 18,
        sway: 10 + Math.random() * 26,
        phase: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 2.4,
        rot: Math.random() * Math.PI * 2,
        a: petal ? 0.75 + Math.random() * 0.25 : 0.55 + Math.random() * 0.4,
        hue: Math.random(),
      };
    };
    const draw = (p) => {
      ctx.globalAlpha = p.a;
      if (petal) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.hue < 0.55 ? "#d8242f" : p.hue < 0.85 ? "#f06a7a" : "#f3c46b";
        ctx.beginPath();
        ctx.ellipse(0, 0, p.r, p.r * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else {
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "rgba(70, 80, 110, 0.55)";
        ctx.shadowBlur = 3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    };
    const frame = (t) => {
      const dt = Math.min((t - (last || t)) / 1000, 0.05);
      last = t;
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.phase += dt * 1.3;
        p.y += p.vy * dt;
        p.x += Math.sin(p.phase) * p.sway * dt;
        p.rot += p.spin * dt;
        if (p.y > h + 12) Object.assign(p, make(false));
        draw(p);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };
    return {
      start() {
        resize();
        const n = Math.round(Math.min(w * h / (petal ? 16000 : 7000), petal ? 70 : 160));
        parts = Array.from({ length: n }, () => make(true));
        window.addEventListener("resize", resize);
        raf = requestAnimationFrame(frame);
      },
      stop() {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", resize);
        ctx.clearRect(0, 0, w, h);
      },
    };
  })();

  const open = () => {
    overlay.hidden = false;
    fx.start();
    requestAnimationFrame(() => overlay.classList.add("is-open"));
    render();
    closeBtn.focus({ preventScroll: true });
    timer = setInterval(tick, 1000);
    document.addEventListener("keydown", onKey);
  };

  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  card.addEventListener("mouseenter", () => {
    paused = true;
    render();
  });
  card.addEventListener("mouseleave", () => {
    paused = false;
    render();
  });

  if (img.complete) {
    open();
  } else {
    img.addEventListener("load", open, { once: true });
    img.addEventListener("error", () => {}, { once: true });
  }
})();
