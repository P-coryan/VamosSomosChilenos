# Vamos Somos Chilenos — Landing Page

## Proyecto
Landing page para el programa de radio **"Vamos Somos Chilenos"** en **Radio Portales 89.5 FM**, Valparaíso, Chile.

## Dominio y Hosting
- **Dominio:** `vamossomoschilenos.cl` (registrado en NIC.cl)
- **DNS:** Cloudflare (plan free) — nameservers: `igor.ns.cloudflare.com`, `melany.ns.cloudflare.com`
- **Hosting:** GitHub Pages desde branch `main`
- **Repo:** `github.com/P-coryan/VamosSomosChilenos`

## Estructura
```
VamosSomosChilenos/
├── CLAUDE.md
├── CNAME                   # Dominio personalizado para GitHub Pages
├── index.html              # Página principal (10 secciones)
├── css/
│   └── styles.css          # Estilos mobile-first (BEM)
├── js/
│   └── main.js             # JavaScript vanilla
├── scripts/
│   └── fetch-episodes.js   # Script Node.js — consulta YouTube API, actualiza HTML/JSON-LD/sitemap
├── data/
│   └── episodes.json       # Cache de episodios (generado automáticamente)
├── .github/
│   └── workflows/
│       └── update-episodes.yml  # Cron diario: actualiza Biblioteca + Último Episodio
├── sitemap.xml
├── robots.txt
└── assets/
    └── images/
        ├── hosts/          # Fotos del equipo (pendiente)
        └── sponsors/       # Logos auspiciadores (pendiente)
```

## Stack Técnico
- HTML5 semántico, CSS3, JavaScript vanilla (sin frameworks ni build tools)
- Google Fonts: Montserrat (títulos) + Open Sans (cuerpo)
- Font Awesome 6 (iconos)
- Formulario de contacto via Formspree
- YouTube Data API v3 (server-side via GitHub Actions)

## Auto-Actualización de Episodios

### Cómo funciona
- **GitHub Actions** ejecuta `scripts/fetch-episodes.js` diariamente a las 06:00 UTC (03:00 Chile)
- El script consulta YouTube Data API v3 usando el handle `@vamossomoschilenos7099`
- Actualiza 3 cosas en `index.html`:
  1. **Sección Biblioteca** (entre `<!-- BIBLIOTECA_START -->` / `<!-- BIBLIOTECA_END -->`) — grid de episodios del último mes
  2. **Sección Último Episodio** (entre `<!-- ENVIVO_START -->` / `<!-- ENVIVO_END -->`) — iframe del video más reciente
  3. **JSON-LD** (entre `<!-- JSONLD_VIDEOS_START -->` / `<!-- JSONLD_VIDEOS_END -->`) — ItemList de VideoObjects con `uploadDate` real de YouTube
- También actualiza `<lastmod>` en `sitemap.xml`
- Solo hace commit si hay episodios nuevos
- **Secreto requerido en GitHub:** `YOUTUBE_API_KEY` (Settings > Secrets > Actions)

### Marcadores en index.html
El script busca estos marcadores HTML para reemplazar contenido:
- `<!-- BIBLIOTECA_START -->` ... `<!-- BIBLIOTECA_END -->` — tarjetas de episodios
- `<!-- ENVIVO_START -->` ... `<!-- ENVIVO_END -->` — iframe de último episodio
- `<!-- JSONLD_VIDEOS_START -->` ... `<!-- JSONLD_VIDEOS_END -->` — structured data de videos

### Badge de día en Biblioteca
El badge (etiqueta superior izquierda de cada tarjeta) extrae la fecha del **título del video** (ej: "02 ABR 2026" → Jueves). Si el título no tiene fecha, usa la fecha de publicación en hora Chile.

## Paleta de Colores (bandera chilena)
- Azul: `#0039A6` / Azul profundo: `#001d54`
- Rojo: `#D52B1E` / Rojo oscuro: `#a51f15`
- Oscuro: `#0c0c1a` / Superficie: `#141428`
- Blanco: `#F5F5F5`

## Datos del Programa

### YouTube
- **Canal:** https://www.youtube.com/@vamossomoschilenos7099
- **Handle:** `@vamossomoschilenos7099`

### Horarios
- **Viernes 19:00 hrs** — Rodrigo, Rafael y Martín: Actualidad nacional e internacional
- **Sábado 11:30 hrs** — Jorge y Patricio: Reviviendo la historia de Chile y sus héroes
- También hay episodios otros días de la semana (miércoles, jueves, etc.)

### Redes Sociales (links reales)
- Radio Portales: https://portalesfm.cl
- Spotify: https://open.spotify.com/show/0svV8CI4En4r5P4bOc6Y3r
- YouTube: https://www.youtube.com/@vamossomoschilenos7099
- X (Twitter): https://x.com/SomosVamos
- TikTok: https://tiktok.com/@vamossomoschilenos
- Instagram: https://www.instagram.com/p/DV02TWPER-0/
- Facebook: https://www.facebook.com/photo/?fbid=1484762013655916

### Equipo
- Rodrigo, Rafael, Martín (viernes — actualidad)
- Jorge, Patricio (sábado — historia)

## Secciones de la Página
1. Navegación sticky (transparente → sólida al scroll)
2. Hero (pantalla completa, gradiente bandera chilena)
3. En Vivo / Último Episodio (embed YouTube — **auto-actualizado**)
4. Redes Sociales (7 tarjetas con colores de marca)
5. Biblioteca (grid responsive — **auto-actualizado**, episodios del último mes)
6. Sobre el Programa (2 columnas + barras animadas)
7. Equipo (grid de tarjetas)
8. Sponsors / Monetización (logos grayscale→color)
9. Contacto (formulario Formspree)
10. Footer (nav + redes + volver arriba)

## SEO
- JSON-LD: WebSite, Organization, RadioStation, 2x BroadcastEvent, ItemList con VideoObjects
- Las fechas (`uploadDate`) vienen directo de YouTube API — nunca inventar fechas
- Open Graph + Twitter Cards configurados
- Google Site Verification: `sQkjn5DB8B90z7aP5OU3oBUVGkw0WAHIy200u-lwXB4`
- Sitemap y robots.txt apuntan a `vamossomoschilenos.cl`

## Pendientes / TODO
- [ ] Reemplazar `YOUR_FORM_ID` en el formulario de contacto con ID real de Formspree
- [ ] Agregar fotos reales del equipo en `assets/images/hosts/`
- [ ] Agregar logos de auspiciadores en `assets/images/sponsors/`
- [x] ~~Configurar dominio personalizado~~ → `vamossomoschilenos.cl`
- [x] ~~Inicializar repo git y subir a GitHub~~
- [x] ~~Activar GitHub Pages~~
- [x] ~~Auto-actualización de episodios~~
- [ ] Activar "Enforce HTTPS" en GitHub Pages (cuando DNS se propague)

## Convenciones
- CSS: metodología BEM (`bloque__elemento--modificador`)
- Breakpoints: 480px, 768px, 1024px (mobile-first)
- Animaciones: CSS @keyframes + Intersection Observer en JS
- Links externos: siempre `target="_blank" rel="noopener noreferrer"`
- Usar skill `/frontend-design` para cambios visuales importantes
