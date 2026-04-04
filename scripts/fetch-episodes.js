/**
 * fetch-episodes.js
 * Consulta YouTube Data API v3, genera las tarjetas HTML de la Biblioteca
 * y actualiza index.html, JSON-LD y sitemap.xml con fechas reales.
 *
 * Uso: YOUTUBE_API_KEY=tu_clave node scripts/fetch-episodes.js
 */

'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');

// ── Config ──────────────────────────────────────────────────────────
const API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_HANDLE = 'vamossomoschilenos7099';
const MAX_RESULTS = 15; // fetch enough to cover a month
const DAYS_WINDOW = 30; // only keep episodes from the last 30 days

const ROOT = path.resolve(__dirname, '..');
const INDEX_PATH = path.join(ROOT, 'index.html');
const SITEMAP_PATH = path.join(ROOT, 'sitemap.xml');
const DATA_PATH = path.join(ROOT, 'data', 'episodes.json');

// ── Helpers ─────────────────────────────────────────────────────────

function fetchJSON(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(new Error('Invalid JSON: ' + data.slice(0, 200)));
                }
            });
        }).on('error', reject);
    });
}

/**
 * Resolve @handle → channel ID → uploads playlist ID
 */
async function getUploadsPlaylistId() {
    const url = `https://www.googleapis.com/youtube/v3/channels?forHandle=${CHANNEL_HANDLE}&part=contentDetails&key=${API_KEY}`;
    const data = await fetchJSON(url);
    if (!data.items || data.items.length === 0) {
        throw new Error(`No channel found for handle @${CHANNEL_HANDLE}`);
    }
    return data.items[0].contentDetails.relatedPlaylists.uploads;
}

/**
 * Fetch latest videos from a playlist
 */
async function getPlaylistItems(playlistId) {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${playlistId}&part=snippet,contentDetails&maxResults=${MAX_RESULTS}&key=${API_KEY}`;
    const data = await fetchJSON(url);
    if (!data.items) {
        throw new Error('No items in playlist response: ' + JSON.stringify(data.error || data));
    }
    return data.items;
}

/**
 * Filter episodes to the last N days
 */
function filterRecent(items) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - DAYS_WINDOW);

    return items
        .map((item) => {
            const snippet = item.snippet;
            const publishedAt = snippet.publishedAt; // ISO 8601 from YouTube
            return {
                videoId: item.contentDetails.videoId,
                title: snippet.title,
                description: snippet.description ? snippet.description.slice(0, 200) : '',
                publishedAt: publishedAt,
                thumbnailUrl: `https://img.youtube.com/vi/${item.contentDetails.videoId}/mqdefault.jpg`,
            };
        })
        .filter((ep) => new Date(ep.publishedAt) >= cutoff)
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}

// ── Date formatting (Chile locale) ──────────────────────────────────

const DAYS_ES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const MONTHS_ES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

function formatDateChile(isoDate) {
    const d = new Date(isoDate);
    // Convert to Chile time (UTC-3 / UTC-4 depending on DST, but Chile has been UTC-4 since 2019 April)
    // Using Intl to get correct local day
    const opts = { timeZone: 'America/Santiago', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    try {
        return d.toLocaleDateString('es-CL', opts);
    } catch {
        // Fallback for environments without es-CL locale
        const utcOffset = -3;
        const local = new Date(d.getTime() + utcOffset * 3600000);
        const day = DAYS_ES[local.getUTCDay()];
        const num = local.getUTCDate();
        const month = MONTHS_ES[local.getUTCMonth()];
        const year = local.getUTCFullYear();
        return `${day} ${num} de ${month}, ${year}`;
    }
}

function getDayBadge(isoDate) {
    const d = new Date(isoDate);
    const dayStr = d.toLocaleDateString('en-US', { timeZone: 'America/Santiago', weekday: 'long' });
    if (dayStr === 'Friday') return { class: 'viernes', label: 'Viernes' };
    if (dayStr === 'Saturday') return { class: 'sabado', label: 'Sábado' };
    // For other days, determine by time
    return { class: 'viernes', label: DAYS_ES[d.getDay()] || 'Episodio' };
}

function toISOChile(isoDate) {
    // Return ISO 8601 with Chile offset
    const d = new Date(isoDate);
    const offset = -3; // CLT
    const local = new Date(d.getTime() + offset * 3600000);
    const pad = (n) => String(n).padStart(2, '0');
    return `${local.getUTCFullYear()}-${pad(local.getUTCMonth() + 1)}-${pad(local.getUTCDate())}T${pad(local.getUTCHours())}:${pad(local.getUTCMinutes())}:${pad(local.getUTCSeconds())}-03:00`;
}

// ── HTML generation ─────────────────────────────────────────────────

function generateCards(episodes) {
    if (episodes.length === 0) {
        return `
            <div class="biblioteca__empty">
                <i class="fa-solid fa-podcast"></i>
                <p>No hay episodios del último mes. Visita nuestro <a href="https://www.youtube.com/@${CHANNEL_HANDLE}" target="_blank" rel="noopener noreferrer">canal de YouTube</a> para ver todos los episodios.</p>
            </div>`;
    }

    return episodes.map((ep) => {
        const badge = getDayBadge(ep.publishedAt);
        const dateDisplay = formatDateChile(ep.publishedAt);
        const datetime = toISOChile(ep.publishedAt);
        const safeTitle = ep.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

        return `                <article class="biblioteca__card">
                    <a href="https://www.youtube.com/watch?v=${ep.videoId}" target="_blank" rel="noopener noreferrer">
                        <div class="biblioteca__thumb">
                            <img src="${ep.thumbnailUrl}" alt="${safeTitle}" loading="lazy">
                            <span class="biblioteca__play"><i class="fa-solid fa-play"></i></span>
                            <span class="biblioteca__badge biblioteca__badge--${badge.class}">${badge.label}</span>
                        </div>
                        <div class="biblioteca__info">
                            <h4>${safeTitle}</h4>
                            <time datetime="${datetime}">${dateDisplay}</time>
                        </div>
                    </a>
                </article>`;
    }).join('\n');
}

function generateVideoObjectsLD(episodes) {
    if (episodes.length === 0) return '';

    const items = episodes.map((ep, i) => {
        const safeTitle = ep.title.replace(/"/g, '\\"');
        const safeDesc = (ep.description || 'Episodio del programa Vamos Somos Chilenos en Radio Portales 89.5 FM, Valparaíso.').replace(/"/g, '\\"').replace(/\n/g, ' ');
        return `        {
          "@type": "ListItem",
          "position": ${i + 1},
          "item": {
            "@type": "VideoObject",
            "name": "${safeTitle}",
            "description": "${safeDesc}",
            "thumbnailUrl": "https://img.youtube.com/vi/${ep.videoId}/maxresdefault.jpg",
            "uploadDate": "${ep.publishedAt}",
            "embedUrl": "https://www.youtube.com/embed/${ep.videoId}",
            "contentUrl": "https://www.youtube.com/watch?v=${ep.videoId}"
          }
        }`;
    });

    // Separate <script> block for video structured data
    return `<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Biblioteca — Vamos Somos Chilenos",
      "numberOfItems": ${episodes.length},
      "itemListElement": [
${items.join(',\n')}
      ]
    }
    </script>`;
}

// ── File update functions ───────────────────────────────────────────

function updateIndexHTML(episodes) {
    let html = fs.readFileSync(INDEX_PATH, 'utf8');

    // 1. Replace biblioteca section between markers
    const bibStart = '<!-- BIBLIOTECA_START -->';
    const bibEnd = '<!-- BIBLIOTECA_END -->';
    const startIdx = html.indexOf(bibStart);
    const endIdx = html.indexOf(bibEnd);

    if (startIdx === -1 || endIdx === -1) {
        throw new Error('Markers <!-- BIBLIOTECA_START --> / <!-- BIBLIOTECA_END --> not found in index.html');
    }

    const cards = generateCards(episodes);
    const newBiblioteca = `${bibStart}
            <div class="biblioteca reveal">
                <div class="biblioteca__grid">
${cards}
                </div>
            </div>
            ${bibEnd}`;

    html = html.slice(0, startIdx) + newBiblioteca + html.slice(endIdx + bibEnd.length);

    // 2. Update "Último Episodio" iframe with the latest video
    if (episodes.length > 0) {
        const latest = episodes[0];
        const envStart = '<!-- ENVIVO_START -->';
        const envEnd = '<!-- ENVIVO_END -->';
        const envStartIdx = html.indexOf(envStart);
        const envEndIdx = html.indexOf(envEnd);

        if (envStartIdx !== -1 && envEndIdx !== -1) {
            const safeTitle = latest.title.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
            const newEnvivo = `${envStart}
                    <div class="envivo__video reveal">
                        <div class="envivo__embed">
                            <iframe
                                src="https://www.youtube.com/embed/${latest.videoId}"
                                title="${safeTitle}"
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowfullscreen
                                loading="lazy">
                            </iframe>
                        </div>
                    </div>
                    ${envEnd}`;
            html = html.slice(0, envStartIdx) + newEnvivo + html.slice(envEndIdx + envEnd.length);
            console.log(`✓ "Último Episodio" updated to: ${latest.title} (${latest.videoId})`);
        }
    }

    // 3. Replace JSON-LD VideoObject / ItemList
    const ldStart = '<!-- JSONLD_VIDEOS_START -->';
    const ldEnd = '<!-- JSONLD_VIDEOS_END -->';
    const ldStartIdx = html.indexOf(ldStart);
    const ldEndIdx = html.indexOf(ldEnd);

    if (ldStartIdx !== -1 && ldEndIdx !== -1) {
        const videoLD = generateVideoObjectsLD(episodes);
        const newLD = videoLD
            ? `${ldStart}\n    ${videoLD}\n    ${ldEnd}`
            : `${ldStart}\n    ${ldEnd}`;
        html = html.slice(0, ldStartIdx) + newLD + html.slice(ldEndIdx + ldEnd.length);
    }

    fs.writeFileSync(INDEX_PATH, html, 'utf8');
    console.log(`✓ index.html updated with ${episodes.length} episodes`);
}

function updateSitemap(episodes) {
    if (episodes.length === 0) return;

    let sitemap = fs.readFileSync(SITEMAP_PATH, 'utf8');
    const latestDate = episodes[0].publishedAt.split('T')[0]; // YYYY-MM-DD

    sitemap = sitemap.replace(
        /<lastmod>[^<]+<\/lastmod>/,
        `<lastmod>${latestDate}</lastmod>`
    );

    // Update changefreq to daily since we now update daily
    sitemap = sitemap.replace(
        /<changefreq>[^<]+<\/changefreq>/,
        '<changefreq>daily</changefreq>'
    );

    fs.writeFileSync(SITEMAP_PATH, sitemap, 'utf8');
    console.log(`✓ sitemap.xml updated (lastmod: ${latestDate})`);
}

function saveEpisodesData(episodes) {
    const data = {
        lastUpdated: new Date().toISOString(),
        episodes: episodes,
    };
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✓ data/episodes.json saved (${episodes.length} episodes)`);
}

// ── Main ────────────────────────────────────────────────────────────

async function main() {
    if (!API_KEY) {
        console.error('Error: YOUTUBE_API_KEY environment variable is required.');
        console.error('Usage: YOUTUBE_API_KEY=your_key node scripts/fetch-episodes.js');
        process.exit(1);
    }

    console.log('Fetching episodes from YouTube...');

    try {
        // 1. Resolve channel handle → uploads playlist
        const playlistId = await getUploadsPlaylistId();
        console.log(`✓ Channel resolved. Uploads playlist: ${playlistId}`);

        // 2. Fetch latest videos
        const items = await getPlaylistItems(playlistId);
        console.log(`✓ Fetched ${items.length} videos from YouTube`);

        // 3. Filter to last 30 days
        const episodes = filterRecent(items);
        console.log(`✓ ${episodes.length} episodes in the last ${DAYS_WINDOW} days`);

        // 4. Save data
        saveEpisodesData(episodes);

        // 5. Update index.html
        updateIndexHTML(episodes);

        // 6. Update sitemap
        updateSitemap(episodes);

        console.log('\nDone! All files updated successfully.');
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

main();
