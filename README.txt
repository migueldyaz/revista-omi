README - Estructura del sitio web "Revista OMI Internacional"
=============================================================

Este documento describe la estructura y convenciones del sitio web de la
Revista OMI Internacional. Refleja el estado actual del repo y cómo agregar
nuevos números y artículos.

Estructura general del proyecto
-------------------------------

revista_omi/
├── 403.html                      # Página de error 403
├── 404.html                      # Página de error 404
├── 500.html                      # Página de error 500
├── index.html                    # Página de inicio
├── acerca.html                   # Acerca de la revista
├── comite.html                   # Comité Editorial
├── directrices.html              # Directrices para autores
├── rights.html                   # Derechos de Autor y Conexos
├── sitemap.html                  # Mapa del sitio (manual)
├── robots.txt                    # Instrucciones para bots
├── favicon.ico                   # Favicon raíz (recomendado por navegadores)
├── favicon.png                   # Favicon alterno
├── README.txt                    # Este documento
└── assets/                       # Recursos y vistas públicas
    ├── style.css                 # Hoja de estilos principal (canónica)
    ├── style.omi.patch.css       # Overrides puntuales (cargas opcionales)
    ├── archivo.html              # Página de Archivo/Índice de números
    ├── css/                      # (opcional) CSS adicionales si se usan
    ├── img/                      # Imágenes del sitio
    │   ├── thumbs/               # Miniaturas ligeras
    │   ├── Logo-UOMI-CDMX-blanco.png
    │   ├── by-nc-sa.png          # Insignia CC BY-NC-SA 4.0
    │   └── ...                   # Otros recursos (banners, fondo, etc.)
    ├── js/                       # JavaScript del sitio
    │   ├── breadcrumb-map.js     # Mapa lógico para breadcrumbs
    │   ├── breadcrumb-render.js  # Render de migas de pan (defer)
    │   ├── global-ui.js          # Interacciones comunes (hamburger, to-top)
    │   ├── home-hero.js          # (si aplica) scripts de portada
    │   └── safe-metrics.js       # (si aplica) métricas sin cookies
    └── view/
        └── 202501/                               # Carpeta por número (AAAA MM)
            ├── numero-2025-01.html               # Landing del número Vol. 2 Núm. 1 (2025)
            ├── art-001/
            │   ├── html/art-001.html             # Versión HTML completa del artículo
            │   ├── epub/art-001.html             # Versión EPUB (HTML) del artículo
            │   ├── pdf/art-001.pdf               # PDF del artículo
            │   └── artview-001.html              # Vista "ligera/landing" del artículo
            ├── art-002/
            │   ├── html/art-002.html
            │   ├── epub/art-002.html
            │   ├── pdf/art-002.pdf
            │   └── artview-002.html
            ├── art-003/
            │   ├── html/art-003.html
            │   ├── epub/art-003.html
            │   ├── pdf/art-003.pdf
            │   └── artview-003.html
            ├── art-004/
            │   ├── html/art-004.html
            │   ├── epub/art-004.html
            │   ├── pdf/art-004.pdf
            │   └── artview-004.html
            └── art-005/
                ├── html/art-005.html
                ├── epub/art-005.html
                ├── pdf/art-005.pdf
                └── artview-005.html

Convenciones editoriales y de metadatos
---------------------------------------
1) Nombre institucional (unificar SIEMPRE):
   - Forma larga recomendada:  Universidad de Ciego de Ávila “Máximo Gómez Báez” (UNICA)
   - Forma corta en afiliación: Universidad “Máximo Gómez Báez”, Ciego de Ávila, Cuba
   Usa la MISMA forma dentro del bloque de autores, JSON-LD, Dublin Core y “Cómo citar”.

2) Publicador del sitio:
   - "Universidad OMI Centro de Investigación" (como publisher en JSON-LD del sitio).

3) SEO/OG/Twitter:
   - <link rel="canonical"> siempre relativo a la raíz del sitio.
   - og:site_name = "Revista OMI Internacional"; og:locale = "es_MX".
   - og:image = assets/img/og/omi-social-card.jpg (mantener ruta y proporción 1200×630).

4) JSON-LD:
   - @type: ScholarlyArticle para artículos; Periodical para la revista.
   - Incluir "license": CC BY-NC-SA 4.0 y "url" absoluto/relativo según despliegue.
   - datePublished = fecha real de publicación (AAAA-MM-DD).

5) Base dinámica:
   - Las páginas con el snippet de <base> detectan GitHub Pages y resuelven rutas automáticamente.
     Evita rutas absolutas del dominio; usa rutas relativas a la base.

6) Accesibilidad:
   - Navegación con roles aria-* (menubar/menuitem), botón “Volver arriba”, y <nav> breadcrumbs.
   - Carga diferida: scripts con `defer` y atributos `loading="lazy"` en imágenes.

7) Licencia:
   - Todo el contenido se publica bajo CC BY-NC-SA 4.0. Mantener insignia y enlaces.

Cómo agregar un nuevo número y artículos
----------------------------------------
1) Crear carpeta del número:
   assets/view/AAAAMM/

2) Dentro, crear:
   - numero-AAAA-MM.html (landing del número)
   - art-XXX/ por cada artículo (tres dígitos, ej. 006, 007…):
     * html/art-XXX.html     -> versión HTML completa
     * epub/art-XXX.html     -> versión HTML para EPUB/lector
     * pdf/art-XXX.pdf       -> PDF final
     * artview-XXX.html      -> “landing” del artículo (resumen + metadatos + enlaces)

3) Actualizar:
   - assets/archivo.html con la portada/índice del número recién publicado.
   - sitemap.html (lista ordenada de rutas canónicas).
   - En las páginas del artículo:
     * Metadatos Dublin Core y citation_* (título, autores, volumen, número, páginas).
     * JSON-LD (autores, keywords, url, datePublished).
     * Bloque lateral “Descargas” con enlaces a PDF/HTML/EPUB.

Rutas canónicas (patrones)
--------------------------
- Número:  assets/view/AAAAMM/numero-AAAA-MM.html
- Artículo (landing):      assets/view/AAAAMM/art-XXX/artview-XXX.html
- Artículo (HTML full):    assets/view/AAAAMM/art-XXX/html/art-XXX.html
- Artículo (EPUB HTML):    assets/view/AAAAMM/art-XXX/epub/art-XXX.html
- Artículo (PDF):          assets/view/AAAAMM/art-XXX/pdf/art-XXX.pdf

Limpieza y archivos en desuso
-----------------------------
- No usar duplicados semánticos (p.ej., “derechos.html”). La ruta vigente es rights.html.
- Evitar páginas huérfanas: cualquier HTML no enlazado desde index/archivo/número debe
  o eliminarse o integrarse al flujo de navegación.
- Mantener las extensiones .html en el repo (aunque el explorador las oculte).

Notas de despliegue
-------------------
- GitHub Pages: el snippet de <base> ajusta automáticamente las rutas si el sitio
  vive bajo /<usuario>.github.io/<repo>/. En entorno local, la base es '/'.
- Si se cambia el nombre del repo, no hace falta reescribir enlaces internos.
- Recomendado: minificar imágenes y usar /assets/img/thumbs para listas/portadas.

Contacto
--------
Para dudas sobre estructura o convenciones, revisar este README y los ejemplos
de 202501. Cualquier cambio transversal (metadatos, cabecera, pie) debe replicarse
en las plantillas de:
- assets/archivo.html
- assets/view/AAAAMM/numero-AAAA-MM.html
- assets/view/AAAAMM/art-XXX/artview-XXX.html
- assets/view/AAAAMM/art-XXX/html/art-XXX.html
