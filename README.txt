README - Estructura del sitio web "Revista OMI Internacional"
=============================================================

Este documento describe la estructura de directorios y archivos del sitio web
de la Revista OMI Internacional.

Estructura general del proyecto:
--------------------------------

revista_omi_/
├── acerca.html              -> Página "Acerca de"
├── aviso.html               -> Aviso de privacidad
├── comite.html              -> Comité editorial
├── contacto.html            -> Página de contacto
├── derechos.html            -> Derechos de autor
├── directrices.html         -> Directrices para autores/as
├── error404.html            -> Página de error personalizada
├── index.html               -> Página de inicio
├── politica.html            -> Política editorial
├── publicaciones.html       -> Publicaciones disponibles
├── series.html              -> Series o ediciones especiales
├── assets/                  -> Recursos estáticos (imágenes, PDF, CSS)
│   ├── img/                 -> Imágenes del sitio
│   │   ├── Logo-UOMI-CDMX-blanco.png
│   │   ├── cover-placeholder.jpg
│   │   └── favicon.png
    ├── originals/        # imágenes fuente en alta (no se sirven directo)
    ├── thumbs/           # miniaturas (150–400px, peso ligero)
    └── covers/           # portadas en tamaño “card/lista” (600–900px)
│   ├── pdf/                 -> Archivos PDF de los números publicados
│   │   └── omi-vol1-num2.pdf
│   └── style.css            -> Hoja de estilos principal

Notas adicionales:
------------------

- Todos los archivos HTML utilizan la hoja de estilo 'assets/style.css' para mantener coherencia visual.
- El favicon se encuentra disponible en formato PNG.
- Las publicaciones se enlazan desde 'publicaciones.html' al directorio 'assets/pdf/'.
- La estructura es compatible con la View Transition API y diseño responsive.

