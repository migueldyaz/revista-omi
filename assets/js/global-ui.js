window.addEventListener("DOMContentLoaded", () => {
  // ===== Fade-in
  document.body.classList.add("loaded");

  // ===== NAV ACTIVO (sin falsos positivos y sin tocar breadcrumbs)
  const menuLinks = document.querySelectorAll("nav.menu a");
  // Soporta /ruta/ y /ruta/index.html
  const path = location.pathname;
  const currentLeaf =
    (path.endsWith("/") ? "index.html" : path.split("/").pop()) || "index.html";

  menuLinks.forEach(link => {
    const href = link.getAttribute("href") || "";
    const leaf = (href.endsWith("/") ? "index.html" : href.split("/").pop()) || "";
    if (leaf === currentLeaf) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  // ===== View Transition API (solo navegación interna y sin hashes)
  menuLinks.forEach(link => {
    const sameOrigin = link.origin === location.origin;
    const hasHash = link.getAttribute("href")?.includes("#");
    const blocked = link.target === "_blank" ||
                    link.hasAttribute("download") ||
                    link.rel?.includes("external") ||
                    link.dataset.noVt !== undefined;

    if (!sameOrigin || hasHash || blocked || !document.startViewTransition) return;

    link.addEventListener("click", function (e) {
      // no interceptar modificadores ni clic no-izquierdo
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      document.startViewTransition(() => {
        window.location.href = this.href;
      });
    });
  });

  // ===== Menú hamburguesa (abrir/cerrar)
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const navMenu = document.querySelector("nav.menu");

  hamburgerBtn?.addEventListener("click", () => {
    navMenu?.classList.toggle("open");
    const isOpen = navMenu?.classList.contains("open");
    hamburgerBtn?.setAttribute("aria-expanded", String(!!isOpen));
  });

  // Cerrar el menú al hacer clic en cualquier enlace (móvil)
  navMenu?.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (a && navMenu.classList.contains("open")) {
      navMenu.classList.remove("open");
      hamburgerBtn?.setAttribute("aria-expanded", "false");
    }
  });

  // ===== Índice (TOC) plegable: abierto en desktop, cerrado en móvil
  const toc = document.querySelector("details.indice-contenido");
  if (toc) {
    const mqDesktop = window.matchMedia("(min-width: 769px)");
    const syncTocOpen = () => { toc.open = mqDesktop.matches; };
    syncTocOpen();

    if (mqDesktop.addEventListener) {
      mqDesktop.addEventListener("change", syncTocOpen);
    } else if (mqDesktop.addListener) {
      mqDesktop.addListener(syncTocOpen);
    }

    const tocLinks = toc.querySelectorAll('.toc-body a[href^="#"]');
    tocLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        const id = link.getAttribute("href").slice(1);
        const target = document.getElementById(id);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", `#${id}`);

        setTimeout(() => {
          try { window.getSelection().removeAllRanges(); } catch {}
          link.blur();
          if (window.matchMedia("(max-width: 768px)").matches) {
            toc.open = false; // retraer en móvil
          }
        }, 350);
      });
    });
  } else {
    // (Fallback) TOC clásico sin <details>
    const tocLinks = document.querySelectorAll('.indice-contenido a[href^="#"]');
    tocLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        const id = link.getAttribute("href").slice(1);
        const target = document.getElementById(id);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", `#${id}`);
        setTimeout(() => {
          try { window.getSelection().removeAllRanges(); } catch {}
          link.blur();
        }, 300);
      });
    });
  }

  // ===== Botón "Volver arriba" (robusto con deduplicación y auto-inyección)
  function setupBackToTop() {
    let btnTop = document.getElementById("btn-top");
    if (!btnTop) {
      // auto-inyecta si no estaba en el HTML
      btnTop = document.createElement("button");
      btnTop.id = "btn-top";
      btnTop.type = "button";
      btnTop.setAttribute("aria-label", "Volver arriba");
      btnTop.textContent = "↑";
      document.body.appendChild(btnTop);
    }

    // quita handler previo si existía
    if (window._backToTopToggle) {
      window.removeEventListener("scroll", window._backToTopToggle);
    }

    const mqReduced = matchMedia("(prefers-reduced-motion: reduce)");
    const toggle = () => {
      btnTop.classList.toggle("show", window.scrollY > 300);
    };
    window._backToTopToggle = toggle;

    window.addEventListener("scroll", toggle, { passive: true });
    btnTop.onclick = () => {
      const behavior = mqReduced.matches ? "auto" : "smooth";
      window.scrollTo({ top: 0, behavior });
      try { window.getSelection().removeAllRanges(); } catch {}
      btnTop.blur();
    };

    toggle(); // estado inicial
  }

  setupBackToTop();

  // Reenganchar al volver desde bfcache
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) setupBackToTop();
  });
});
