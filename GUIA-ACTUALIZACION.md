# Guía de Actualización — Vamos Somos Chilenos

## Resumen: ¿Qué se actualiza automáticamente?

| Sección | Qué se actualiza | Cuándo | Fuente |
|---------|-----------------|--------|--------|
| **Último Episodio** (iframe) | El video embebido cambia al más reciente del canal | Diario a las 03:00 Chile | YouTube API |
| **Biblioteca** (grid de tarjetas) | Muestra los episodios del último mes con título, thumbnail y fecha | Diario a las 03:00 Chile | YouTube API |
| **JSON-LD** (SEO structured data) | Lista de VideoObjects con `uploadDate` real de cada episodio | Diario a las 03:00 Chile | YouTube API |
| **Sitemap** (`lastmod`) | Se actualiza con la fecha del episodio más reciente | Diario a las 03:00 Chile | YouTube API |

---

## ¿Qué NO se actualiza automáticamente?

| Sección | Cómo actualizar |
|---------|----------------|
| **Hero** (portada) | Editar `index.html` manualmente |
| **Redes Sociales** (links) | Editar `index.html` manualmente |
| **Equipo** (nombres, fotos) | Editar `index.html` manualmente |
| **Sponsors** (logos) | Agregar imágenes en `assets/images/sponsors/` y editar `index.html` |
| **Contacto** (formulario) | Configurar Formspree ID en `index.html` |
| **Horarios** (viernes/sábado) | Editar `index.html` manualmente |

---

## Cómo funciona la actualización automática

### Flujo
```
GitHub Actions (cron diario 06:00 UTC / 03:00 Chile)
    ↓
scripts/fetch-episodes.js
    ↓
Consulta YouTube Data API v3 → canal @vamossomoschilenos7099
    ↓
Filtra episodios de los últimos 30 días
    ↓
Actualiza index.html:
  - Iframe "Último Episodio" (entre marcadores ENVIVO_START/END)
  - Tarjetas "Biblioteca" (entre marcadores BIBLIOTECA_START/END)
  - JSON-LD VideoObjects (entre marcadores JSONLD_VIDEOS_START/END)
    ↓
Actualiza sitemap.xml (lastmod)
    ↓
Si hay cambios → commit automático y push
Si no hay cambios → no hace nada
```

### Secretos necesarios
- `YOUTUBE_API_KEY` → GitHub repo → Settings → Secrets and variables → Actions

---

## Cómo verificar que todo funciona

### 1. Verificar el workflow
- Ve a GitHub → repo → **Actions** → **"Update Biblioteca Episodes"**
- Debería haber una ejecución verde cada día
- Si hay un error (rojo), click para ver el log

### 2. Verificar la página
- Abre `https://vamossomoschilenos.cl`
- **Último Episodio**: el video embebido debe ser el más reciente del canal de YouTube
- **Biblioteca**: las tarjetas deben mostrar episodios del último mes con fechas correctas
- **Badge de día**: la etiqueta (Viernes, Sábado, etc.) debe coincidir con la fecha que aparece debajo

### 3. Verificar SEO
- Abre https://validator.schema.org/ → pega `https://vamossomoschilenos.cl`
- Debe mostrar: WebSite, Organization, RadioStation, BroadcastEvent (x2), ItemList con VideoObjects
- Cada VideoObject debe tener `uploadDate` con fecha real (no inventada)

### 4. Verificar sitemap
- Abre `https://vamossomoschilenos.cl/sitemap.xml`
- `<lastmod>` debe tener la fecha del episodio más reciente

---

## Ejecutar manualmente (si algo falla)

### Desde GitHub
1. Ve a **Actions** → **"Update Biblioteca Episodes"**
2. Click **"Run workflow"** → selecciona `main` → **"Run workflow"**

### Desde tu computador (requiere API key)
```bash
YOUTUBE_API_KEY=tu_clave node scripts/fetch-episodes.js
```

---

## Problemas comunes

| Problema | Causa probable | Solución |
|----------|---------------|----------|
| Workflow falla con error de API | API key expirada o cuota agotada | Verificar secreto `YOUTUBE_API_KEY` en GitHub |
| Último Episodio no cambia | Cache del navegador | `Ctrl+Shift+R` para forzar refresh |
| Biblioteca vacía | No hay episodios en los últimos 30 días | Verificar canal de YouTube tiene videos recientes |
| Badge no coincide con fecha | Título del video no tiene formato "DD MMM YYYY" | El script usa la fecha de publicación como fallback |
| "DNS check unsuccessful" en GitHub Pages | DNS aún no propagado | Esperar hasta 24 horas y click "Check again" |
| Sitio sale "Not secure" | HTTPS no activado | Settings → Pages → marcar "Enforce HTTPS" |
