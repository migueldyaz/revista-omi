window.addEventListener("DOMContentLoaded", () => {
  // ===== Fade-in
  document.body.classList.add("loaded");

  // ===== NAV ACTIVO (sin falsos positivos y sin tocar breadcrumbs)
  const menuLinks = document.querySelectorAll("nav.menu a");
  const currentLeaf = (location.pathname.split("/").pop() || "index.html");

  menuLinks.forEach(link => {
    const href = link.getAttribute("href") || "";
    const leaf = href.split("/").pop() || "";
    if (leaf === currentLeaf) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  // ===== View Transition API (solo navegación interna y sin hashes)
  menuLinks.forEach(link => {
    if (
      link.target !== "_blank" &&
      !link.href.includes("#") &&
      link.origin === location.origin &&
      document.startViewTransition
    ) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        document.startViewTransition(() => {
          window.location.href = this.href;
        });
      });
    }
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

    // Compat Safari viejo
    if (mqDesktop.addEventListener) {
      mqDesktop.addEventListener("change", syncTocOpen);
    } else if (mqDesktop.addListener) {
      mqDesktop.addListener(syncTocOpen);
    }

    // Scroll suave + limpiar selección/focus + retraer en móvil tras click
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
          window.getSelection().removeAllRanges();
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
          window.getSelection().removeAllRanges();
          link.blur();
        }, 300);
      });
    });
  }

  // ===== Botón "Volver arriba" (robusto con deduplicación real)
  function setupBackToTop() {
    const btnTop = document.getElementById("btn-top");
    if (!btnTop) return;

    // Si ya teníamos un handler previo, eliminarlo
    if (window._backToTopToggle) {
      window.removeEventListener("scroll", window._backToTopToggle);
    }

    const toggle = () => {
      btnTop.classList.toggle("show", window.scrollY > 300);
    };
    // Guardamos referencia global para poder removerla después
    window._backToTopToggle = toggle;

    window.addEventListener("scroll", toggle, { passive: true });

    btnTop.onclick = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.getSelection().removeAllRanges?.();
    };

    // Estado inicial correcto sin esperar al primer scroll
    toggle();
  }

  // Ejecutar ahora que el DOM ya está listo (script con defer)
  setupBackToTop();

  // Reenganchar si volvemos desde bfcache (atrás/adelante del navegador)
  window.addEventListener("pageshow", setupBackToTop, { once: true });
});
