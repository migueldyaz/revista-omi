(function () {
  const el = document.getElementById('breadcrumb');
  if (!el) return;

  const map = window.breadcrumbMap || {};

  // Utilidades de ruta
  const segments = window.location.pathname
    .replace(/index\.html?$/i, '')
    .replace(/\/+$/, '')
    .split('/')
    .filter(Boolean);

  const file = (segments[segments.length - 1] || '').replace(/\.html?$/i, '');
  const depth = Math.max(segments.length - 1, 0);
  const prefix = '../'.repeat(depth);

  const sep = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" style="vertical-align: middle;" viewBox="0 0 20 20" fill="currentColor"><path d="M7.05 4.05a1 1 0 0 1 1.414 0L13.414 9l-4.95 4.95a1 1 0 0 1-1.414-1.414L10.586 9 7.05 5.464a1 1 0 0 1 0-1.414z"/></svg>`;

  // Home (relativo a la profundidad actual)
  let html = `<a href="${prefix}index.html" class="breadcrumb-home">
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10.707 1.293a1 1 0 00-1.414 0l-8 8A1 1 0 002 10h1v7a1 1 0 001 1h4a1 1 0 001-1v-4h2v4a1 1 0 001 1h4a1 1 0 001-1v-7h1a1 1 0 00.707-1.707l-8-8z"/>
    </svg>
    <span>${map.index || 'Inicio'}</span>
  </a>`;

  const isArchivo = file === 'archivo';
  const isNumero = /^numero-\d{4}-\d{2}$/i.test(file);

  if (isArchivo) {
    // Inicio › Archivo
    html += `${sep}<span aria-current="page">${map.archivo || 'Archivo'}</span>`;
  } else if (isNumero) {
    // Inicio › Archivo › etiqueta (tomada de breadcrumbMap; si no existe, usa el slug)
    html += `${sep}<a href="${prefix}assets/archivo.html">${map.archivo || 'Archivo'}</a>`;
    const lastLabel = map[file] || file;
    html += `${sep}<span aria-current="page">${lastLabel}</span>`;
  } else if (file && file !== 'index') {
    // Caso genérico
    html += `${sep}<span aria-current="page">${map[file] || file}</span>`;
  }

  el.innerHTML = html;
})();
