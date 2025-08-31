/* assets/js/home-hero.js
   Secuencia de portada: calcula zonas seguras (header/menu/footer) y
   activa el paso más visible usando la línea central del viewport útil. */

(() => {
  "use strict";

  const cssPx = (name) =>
    parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0;

  function setSafeVars() {
    const header = document.querySelector("header");
    const menu   = document.querySelector(".menu");
    const footer = document.querySelector(".site-footer");

    const hh = header ? header.offsetHeight : 0;
    const mh = menu   ? menu.offsetHeight   : 0;
    const fh = footer ? footer.offsetHeight : 120;

    document.documentElement.style.setProperty("--header-h", hh + "px");
    document.documentElement.style.setProperty("--menu-h",   mh + "px");
    document.documentElement.style.setProperty("--safe-top", (hh + mh) + "px");
    document.documentElement.style.setProperty("--safe-bottom", fh + "px");
  }

  function observeLayoutChanges() {
    const header = document.querySelector("header");
    const menu   = document.querySelector(".menu");
    const footer = document.querySelector(".site-footer");
    if (!("ResizeObserver" in window)) return;
    const ro = new ResizeObserver(() => setSafeVars());
    [header, menu, footer].forEach(el => { if (el) ro.observe(el); });
  }

  function initSequence() {
    const steps = Array.from(document.querySelectorAll(".seq-step"));
    if (!steps.length) return;

    let active  = -1;
    let ticking = false;

    function pickActive() {
      const safeTop    = cssPx("--safe-top");
      const safeBottom = cssPx("--safe-bottom");
      const vpH        = window.innerHeight;

      const winTop    = safeTop;
      const winBot    = vpH - safeBottom;
      const winCenter = (winTop + winBot) / 2;

      let bestIdx  = active;
      let bestDist = Infinity;

      steps.forEach((el, idx) => {
        const r = el.getBoundingClientRect();
        const visibleTop = Math.max(r.top, winTop);
        const visibleBot = Math.min(r.bottom, winBot);
        const visible    = visibleBot - visibleTop;

        if (visible > 0) {
          const center = (r.top + r.bottom) / 2;
          const dist   = Math.abs(center - winCenter);
          if (dist < bestDist) {
            bestDist = dist;
            bestIdx  = idx;
          }
        }
      });

      if (bestIdx !== -1 && bestIdx !== active) {
        if (active >= 0) {
          steps[active].classList.remove("is-active");
          steps[active].removeAttribute("aria-current");
        }
        steps[bestIdx].classList.add("is-active");
        steps[bestIdx].setAttribute("aria-current", "step");
        active = bestIdx;
      }
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => { pickActive(); ticking = false; });
        ticking = true;
      }
    }

    function onResizeOrLoad() {
      setSafeVars();
      pickActive();
    }

    window.addEventListener("load", onResizeOrLoad, { passive: true });
    window.addEventListener("resize", onResizeOrLoad);
    window.addEventListener("orientationchange", onResizeOrLoad);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("transitionend", (e) => {
      if (e.target.closest(".menu")) onResizeOrLoad();
    });
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) onResizeOrLoad();
    });

    observeLayoutChanges();
  }

  setSafeVars();
  initSequence();
})();
