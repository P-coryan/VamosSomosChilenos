# Vamos Somos Chilenos — Landing Page

## Proyecto
Landing page para el programa de radio **"Vamos Somos Chilenos"** en **Radio Portales 89.5 FM**, Valparaíso, Chile.

## Estructura
```
VamosSomosChilenos/
├── CLAUDE.md
├── index.html          # Página principal (10 secciones)
├── css/
│   └── styles.css      # Estilos mobile-first
├── js/
│   └── main.js         # JavaScript vanilla
└── assets/
    └── images/
        ├── hosts/      # Fotos del equipo (pendiente)
        └── sponsors/   # Logos auspiciadores (pendiente)
```

## Stack Técnico
- HTML5 semántico, CSS3, JavaScript vanilla (sin frameworks ni build tools)
- Google Fonts: Montserrat (títulos) + Open Sans (cuerpo)
- Font Awesome 6 (iconos)
- Formulario de contacto via Formspree
- Hosting: GitHub Pages (sitio estático)

## Paleta de Colores (bandera chilena)
- Azul: `#0039A6` / Azul profundo: `#001d54`
- Rojo: `#D52B1E` / Rojo oscuro: `#a51f15`
- Oscuro: `#0c0c1a` / Superficie: `#141428`
- Blanco: `#F5F5F5`

## Datos del Programa

### Horarios
- **Viernes 19:00 hrs** — Rodrigo, Rafael y Martín: Actualidad nacional e internacional
- **Sábado 11:30 hrs** — Jorge y Patricio: Reviviendo la historia de Chile y sus héroes

### Redes Sociales (links reales)
- Radio Portales: https://portalesfm.cl
- Spotify: https://open.spotify.com/show/0svV8CI4En4r5P4bOc6Y3r
- YouTube: https://youtu.be/NS6wsDt7Qwo / https://youtu.be/B9tx6gRh5oA
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
3. En Vivo / Último Episodio (embed YouTube + horarios)
4. Redes Sociales (7 tarjetas con colores de marca)
5. Episodios Recientes (carousel scroll-snap)
6. Sobre el Programa (2 columnas + barras animadas)
7. Equipo (grid de tarjetas)
8. Sponsors / Monetización (logos grayscale→color)
9. Contacto (formulario Formspree)
10. Footer (nav + redes + volver arriba)

## Pendientes / TODO
- [ ] Reemplazar `YOUR_FORM_ID` en el formulario de contacto con ID real de Formspree
- [ ] Agregar fotos reales del equipo en `assets/images/hosts/`
- [ ] Agregar logos de auspiciadores en `assets/images/sponsors/`
- [ ] Configurar dominio personalizado (ej: vamossomoschilenos.cl)
- [ ] Inicializar repo git y subir a GitHub
- [ ] Activar GitHub Pages (Settings → Pages → main / root)

## Deploy en GitHub Pages
```bash
git init
git add .
git commit -m "Landing page Vamos Somos Chilenos"
git remote add origin https://github.com/USUARIO/VamosSomosChilenos.git
git push -u origin main
# Luego en GitHub: Settings → Pages → Source → main / root
```

## Convenciones
- CSS: metodología BEM (`bloque__elemento--modificador`)
- Breakpoints: 480px, 768px, 1024px (mobile-first)
- Animaciones: CSS @keyframes + Intersection Observer en JS
- Links externos: siempre `target="_blank" rel="noopener noreferrer"`
- Usar skill `/frontend-design` para cambios visuales importantes
