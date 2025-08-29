/* breadcrumb-render.js — raíz configurable + fallback y fix de índice YYYYMM
   + “sentence case” del último título si viene TODO EN MAYÚSCULAS
*/
(function () {
  const el = document.getElementById('breadcrumb');
  if (!el) return;

  const map = window.breadcrumbMap || {};
  const cfg = window.breadcrumbConfig || {};

  // ===== Util: sentence-case SOLO si todo viene en mayúsculas =====
  function toSentenceIfAllCaps(str) {
    if (!str) return str;
    const s = String(str).trim();

    const hasUpper = /[A-ZÁÉÍÓÚÜÑ]/.test(s);
    const hasLower = /[a-záéíóúüñ]/.test(s);
    if (!(hasUpper && !hasLower)) return s; // no es “todo caps”: respeta original

    // rebaja a minúsculas…
    let out = s.toLowerCase();

    // …y capitaliza la primera letra de la frase
    out = out.replace(/^\s*([a-záéíóúüñ])/, (_, c) => c.toUpperCase());

    // restaura siglas comunes (ajusta aquí si necesitas más)
    const ACRONYMS = ['IA', 'UNESCO', 'OMI', 'UOMI', 'PCC', 'UJC'];
    ACRONYMS.forEach(ac => {
      const re = new RegExp(`\\b${ac.toLowerCase()}\\b`, 'g');
      out = out.replace(re, ac);
    });

    return out;
  }

  // ===== Config (puedes cambiarla en breadcrumb-map.js) =====
  const viewRoot    = String(cfg.viewRoot    || 'assets/view').replace(/^\/+|\/+$/g, '');
  const archiveHref = String(cfg.archiveHref || 'assets/archivo.html');
  const homeHref    = String(cfg.homeHref    || 'index.html');

  // ===== Utils de ruta =====
  const segments = window.location.pathname
    .replace(/index\.html?$/i, '')
    .replace(/\/+$/, '')
    .split('/')
    .filter(Boolean);

  const file  = (segments[segments.length - 1] || '').replace(/\.html?$/i, '');
  const depth = Math.max(segments.length - 1, 0);

  // Si hay <base>, no generamos prefijos relativos
  const hasBase = !!document.querySelector('base[href]');
  const prefix  = hasBase ? '' : '../'.repeat(depth);

  const sep = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" style="vertical-align: middle;" viewBox="0 0 20 20" fill="currentColor"><path d="M7.05 4.05a1 1 0 0 1 1.414 0L13.414 9l-4.95 4.95a1 1 0 0 1-1.414-1.414L10.586 9 7.05 5.464a1 1 0 0 1 0-1.414z"/></svg>`;

  // Home
  let html = `<a href="${prefix}${homeHref}" class="breadcrumb-home">
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10.707 1.293a1 1 0 00-1.414 0l-8 8A1 1 0 002 10h1v7a1 1 0 001 1h4a1 1 0 001-1v-4h2v4a1 1 0 001 1h4a1 1 0 001-1v-7h1a1 1 0 00.707-1.707l-8-8z"/>
    </svg>
    <span>${map.index || 'Inicio'}</span>
  </a>`;

  const isArchivo = file === 'archivo';
  const isNumero  = /^numero-\d{4}-\d{2}$/i.test(file);

  // ---- Buscar raíz de vistas de forma robusta ----
  const rootSegs = viewRoot.split('/').filter(Boolean);
  const findRootIdx = (haystack, needle) => {
    for (let i = 0; i <= haystack.length - needle.length; i++) {
      let ok = true;
      for (let j = 0; j < needle.length; j++) {
        if (haystack[i + j] !== needle[j]) { ok = false; break; }
      }
      if (ok) return i;
    }
    return -1;
  };

  // 1) Intento con la raíz configurada (p. ej., 'assets/view')
  let rootIdx = findRootIdx(segments, rootSegs);
  let effectiveRoot = viewRoot;

  // 2) Fallback: si no está, prueba con 'view' a secas
  if (rootIdx === -1) {
    const altIdx = segments.indexOf('view');
    if (altIdx !== -1) {
      rootIdx = altIdx;
      effectiveRoot = 'view';
    }
  }

  // Índice del YYYYMM = índice de la raíz + longitud de la raíz efectiva
  const effectiveRootLen = effectiveRoot.split('/').filter(Boolean).length;
  const ymIdx = rootIdx !== -1 ? rootIdx + effectiveRootLen : -1;

  // Es artview si existe raíz y el segmento siguiente es YYYYMM
  const isArtView = ymIdx !== -1 && /^\d{6}$/.test(segments[ymIdx] || '');

  if (isArchivo) {
    // Inicio › Archivo
    html += `${sep}<span aria-current="page">${map.archivo || 'Archivo'}</span>`;

  } else if (isNumero) {
    // Inicio › Archivo › Vol...
    html += `${sep}<a href="${prefix}${archiveHref}">${map.archivo || 'Archivo'}</a>`;
    const lastLabel = map[file] || file;
    html += `${sep}<span aria-current="page">${lastLabel}</span>`;

  } else if (isArtView) {
    // Inicio › Archivo › Vol... › (título del artículo)
    const ym = segments[ymIdx]; // '202501'
    const numeroSlug  = `numero-${ym.slice(0, 4)}-${ym.slice(4)}`;
    const numeroHref  = `${prefix}${effectiveRoot}/${ym}/${numeroSlug}.html`;
    const numeroLabel = map[numeroSlug] || numeroSlug;

    html += `${sep}<a href="${prefix}${archiveHref}">${map.archivo || 'Archivo'}</a>`;
    html += `${sep}<a href="${numeroHref}">${numeroLabel}</a>`;

    const rawLast =
      map[file] ||
      document.querySelector('.title-es')?.textContent?.trim() ||
      file;

    const lastLabel = toSentenceIfAllCaps(rawLast);
    html += `${sep}<span aria-current="page">${lastLabel}</span>`;

  } else if (file && file !== 'index') {
    // Genérico
    html += `${sep}<span aria-current="page">${map[file] || file}</span>`;
  }

  el.innerHTML = html;
})();
