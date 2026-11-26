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
      until: "2027-01-03T00:00:00+08:00",
      image: "/assets/greeting-christmas-2026.webp",
      label:
        "Season's Greetings from China. May this festive season bring joy and peace, and may the year ahead open new horizons of opportunity and discovery. Merry Christmas and Happy New Year 2027. The WisdomAsia Team, Transcultural Intelligence.",
    },
    {
      id: "cny",
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

  const open = () => {
    overlay.hidden = false;
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
