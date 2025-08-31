/* OMI — Safe Metrics (bloquea saltos por sticky y breadcrumbs) */
(function () {
  const root = document.documentElement;

  function px(n){ return (Math.max(0, Math.round(n)) || 0) + 'px'; }

  function syncHeaderMenu() {
    const header = document.querySelector('header');
    const menu   = document.querySelector('nav.menu');
    if (header) root.style.setProperty('--header-h', px(header.getBoundingClientRect().height));
    if (menu)   root.style.setProperty('--menu-h',   px(menu.getBoundingClientRect().height));
    root.style.setProperty('--safe-top', `calc(var(--header-h) + var(--menu-h))`);
  }

  function syncBreadcrumb() {
    const bc = document.getElementById('breadcrumb');
    if (!bc) return;
    root.style.setProperty('--breadcrumb-h', px(bc.getBoundingClientRect().height));
  }

  // Ejecuta al cargar
  const onReady = () => { syncHeaderMenu(); syncBreadcrumb(); };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady, { once:true });
  } else { onReady(); }

  // Observa cambios de tamaño
  const ro = new ResizeObserver(() => { syncHeaderMenu(); syncBreadcrumb(); });
  const header = document.querySelector('header');
  const menu   = document.querySelector('nav.menu');
  if (header) ro.observe(header);
  if (menu)   ro.observe(menu);
  const bc = document.getElementById('breadcrumb');
  if (bc) ro.observe(bc);

  // Recalcula en resize / orientación
  window.addEventListener('resize', syncHeaderMenu, { passive:true });
})();

