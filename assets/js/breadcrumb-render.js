const breadcrumbContainer = document.getElementById('breadcrumb');
const path = window.location.pathname.split('/').pop().replace('.html', '');
const map = window.breadcrumbMap || {};

const separator = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" style="vertical-align: middle;" viewBox="0 0 20 20" fill="currentColor"><path d="M7.05 4.05a1 1 0 0 1 1.414 0L13.414 9l-4.95 4.95a1 1 0 0 1-1.414-1.414L10.586 9 7.05 5.464a1 1 0 0 1 0-1.414z"/></svg>`;

let html = `<a href="index.html" class="breadcrumb-home">
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10.707 1.293a1 1 0 00-1.414 0l-8 8A1 1 0 002 10h1v7a1 1 0 001 1h4a1 1 0 001-1v-4h2v4a1 1 0 001 1h4a1 1 0 001-1v-7h1a1 1 0 00.707-1.707l-8-8z"/>
  </svg>
  <span>Inicio</span>
</a>`;

if (path && path !== 'index') {
  // Si es una página distinta a index, añadir ruta adicional
  if (path === 'numero-actual' || path === 'numero-anterior') {
    html += `${separator}<a href="publicaciones.html">Publicaciones</a>`;
  }
  html += `${separator}<span>${map[path] || path}</span>`;
}

breadcrumbContainer.innerHTML = html;
