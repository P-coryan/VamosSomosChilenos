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
├── favicon.ico             # Favicon multi-size (16+32)
├── favicon-32.png          # Favicon PNG 32x32
├── favicon.svg             # Favicon SVG
├── apple-touch-icon.png    # Apple Touch Icon 180x180
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
│       └── update-episodes.yml  # Cron diario 17:00 Chile: actualiza Biblioteca + Último Episodio
├── sitemap.xml
├── robots.txt
└── assets/
    └── images/
        ├── logoVSC.png     # Logo principal (PNG transparente)
        ├── logoVSC.jpg     # Logo original (JPG con fondo)
        ├── logo-512.png    # Logo 512x512 para JSON-LD y OG
        ├── logo-192.png    # Logo 192x192 para Android
        ├── hosts/          # Fotos del equipo por día
        │   ├── lunes.jpg
        │   ├── martes.jpg
        │   ├── miercoles.jpg
        │   ├── jueves.jpg
        │   ├── viernes.jpg
        │   ├── sabdom-libros.jpg
        │   └── sabdom-historia.jpg
        └── sponsors/       # Logos auspiciadores (pendiente)
```

## Stack Técnico
- HTML5 semántico, CSS3, JavaScript vanilla (sin frameworks ni build tools)
- Google Fonts: Montserrat (títulos) + Open Sans (cuerpo)
- Font Awesome 6 (iconos)
- Formulario de contacto via Formspree (ID: `xnjowwww`)
- YouTube Data API v3 (server-side via GitHub Actions)
- Cache busting: CSS/JS usan `?v=YYYYMMDD` (auto-actualizado por el cron)

## Auto-Actualización de Episodios

### Cómo funciona
- **GitHub Actions** ejecuta `scripts/fetch-episodes.js` diariamente a las **21:00 UTC (17:00 Chile)**
- El script consulta YouTube Data API v3 usando el handle `@vamossomoschilenos7099`
- Actualiza 3 cosas en `index.html`:
  1. **Sección Biblioteca** (entre `<!-- BIBLIOTECA_START -->` / `<!-- BIBLIOTECA_END -->`) — grid de episodios del último mes
  2. **Sección Último Episodio** (entre `<!-- ENVIVO_START -->` / `<!-- ENVIVO_END -->`) — iframe del video más reciente (clase `envivo__player`)
  3. **JSON-LD** (entre `<!-- JSONLD_VIDEOS_START -->` / `<!-- JSONLD_VIDEOS_END -->`) — ItemList de VideoObjects con `uploadDate` real de YouTube
- También actualiza `<lastmod>` en `sitemap.xml`
- Actualiza versión de cache busting (`?v=`) en CSS/JS
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

### Horarios (actualizado 2026-04-07)
| Día | Hora | Programa | Equipo |
|-----|------|----------|--------|
| Lunes | 21:00 | Vamos Somos Chilenos | Jaime Morales, Claudio Jayo, Pedro Espinoza |
| Martes | 19:00 | Vamos Somos Chilenos | Francisco Martínez, Daniel de la Hoz |
| Miércoles | 21:00 | Vamos Somos Chilenos | Josefa Fernández, Maykol Castillo, Rodrigo Salinas |
| Jueves | 19:00 | Vamos Somos Chilenos | Cristián Fuentes, Marisol Ortiz, Reinaldo Reinike |
| Viernes | 19:00 | Vamos Somos Chilenos | Héctor Sandoval, Martín Álvarez, Rodrigo Díaz, Cristóbal Laimbock, Rafael González |
| Sáb y Dom | 11:00 | Entre Libros y Películas | Pilar Soberado, Patricio Carrasco |
| Sáb y Dom | 11:30 | Reviviendo la Historia | Patricio Herrera, Jorge Vidal |

### Redes Sociales (links reales)
- Radio Portales: https://portalesfm.cl
- Spotify: https://open.spotify.com/show/0svV8CI4En4r5P4bOc6Y3r
- YouTube: https://www.youtube.com/@vamossomoschilenos7099
- X (Twitter): https://x.com/SomosVamos
- TikTok: https://tiktok.com/@vamossomoschilenos
- Instagram: https://www.instagram.com/vamossomoschilenos
- Facebook: https://www.facebook.com/vamossom.chill

## Logo
- **Archivo principal:** `assets/images/logoVSC.png` (PNG transparente, fondo removido con flood-fill desde bordes)
- **Uso en navbar:** clase `nav__logo-img` (44x44px circular con padding)
- **Uso en hero:** clase `hero__logo hero__logo--main` (280px mobile / 340px desktop, sin recorte circular)
- **Importante:** el reset global `img { height: auto }` requiere `!important` en los heights del logo para no ser sobrescrito
- El `<h1>` del hero está oculto con `sr-only` para SEO — el logo reemplaza visualmente el título

## Secciones de la Página
1. Navegación sticky (transparente → sólida al scroll) — logo + texto en navbar
2. Hero (logo grande + badge + tagline + botones + horarios 7 días)
3. En Vivo / Último Episodio (video full-width + info/horarios en 2 columnas debajo — **auto-actualizado**)
4. Redes Sociales (7 tarjetas con colores de marca)
5. Biblioteca (grid responsive — **auto-actualizado**, episodios del último mes)
6. Sobre el Programa (2 columnas + barras animadas: 7 días al aire, Actualidad+Cultura+Historia)
7. Equipo (fotos grupales por día — 5 tarjetas L-V + 2 tarjetas fin de semana)
8. Sponsors / Monetización (logos grayscale→color)
9. Contacto (formulario Formspree `xnjowwww` + horarios L-V 19:00–21:00 · S-D 11:00)
10. Footer (nav + redes + volver arriba)

## SEO
- JSON-LD: WebSite, Organization (con logo), RadioStation, 4x BroadcastEvent (con eventSchedule), ItemList con VideoObjects
- Las fechas (`uploadDate`) vienen directo de YouTube API — nunca inventar fechas
- Open Graph + Twitter Cards configurados (imagen: logo-512.png)
- Google Site Verification: `sQkjn5DB8B90z7aP5OU3oBUVGkw0WAHIy200u-lwXB4`
- Sitemap y robots.txt apuntan a `vamossomoschilenos.cl`
- Favicons: ico, png 32, svg, apple-touch-icon 180, logo-192 (Android)

## Pendientes / TODO
- [ ] Agregar logos de auspiciadores en `assets/images/sponsors/`
- [ ] Activar "Enforce HTTPS" en GitHub Pages (cuando DNS se propague)
- [x] ~~Configurar dominio personalizado~~ → `vamossomoschilenos.cl`
- [x] ~~Inicializar repo git y subir a GitHub~~
- [x] ~~Activar GitHub Pages~~
- [x] ~~Auto-actualización de episodios~~ → cron diario 17:00 Chile
- [x] ~~Formulario de contacto~~ → Formspree ID `xnjowwww`
- [x] ~~Google Search Console~~ → verificado para `vamossomoschilenos.cl` y `www`
- [x] ~~Agregar logo~~ → PNG transparente en navbar + hero
- [x] ~~Agregar fotos del equipo~~ → fotos grupales por día en `assets/images/hosts/`
- [x] ~~Horarios completos L-D~~ → actualizados en hero, En Vivo, Equipo, Contacto, JSON-LD
- [x] ~~Favicons~~ → ico, png, svg, apple-touch-icon
- [x] ~~Cache busting~~ → `?v=YYYYMMDD` en CSS/JS, auto-actualizado por cron
- [x] ~~Link Facebook~~ → `facebook.com/vamossom.chill`

## Notas Mobile
- Menú mobile: fondo 100% opaco (`#0c0c1a`), `width: 100vw; height: 100vh` (no usar `inset: 0` ni `backdrop-filter`)
- Biblioteca: NO usar clase `reveal` en el contenedor grid (el observer no se activa con elementos muy altos en mobile)
- Thumbnails: usar `display: block; width: 100%; height: auto` (no `position: absolute` con `padding-bottom` trick)
- No usar `loading="lazy"` en imágenes dentro de contenedores con position hacks
- Horarios hero: `flex-wrap: nowrap` con gap 6px y fuentes compactas (0.55rem/0.75rem) para que los 7 días quepan en una fila

## Convenciones
- CSS: metodología BEM (`bloque__elemento--modificador`)
- Breakpoints: 480px, 768px, 1024px (mobile-first)
- Animaciones: CSS @keyframes + Intersection Observer en JS (clases `anim-fade-up`, `anim-delay-1` a `anim-delay-5`)
- Links externos: siempre `target="_blank" rel="noopener noreferrer"`
- Usar skill `/frontend-design` para cambios visuales importantes
- Trabajar en branch `dev`, merge a `main` solo cuando el usuario aprueba
- Cache busting: actualizar `?v=` en CSS/JS al hacer cambios manuales
