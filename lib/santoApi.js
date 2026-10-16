// lib/santoApi.js
// Fuente principal: Vatican News — Santo del día (https://www.vaticannews.va/es/santos/MM/DD.html)
//   Desde octubre 2026 el RSS de ACI Prensa solo trae el nombre y "Fiesta: ..."
//   con link a EWTN (sin imagen ni biografía), así que pasamos a Vatican News,
//   que publica en español la biografía completa + imagen de cada santo.
// Respaldo: RSS de ACI Prensa (lo de antes), si Vatican News falla.
// Se ejecuta SOLO en el servidor (API route), nunca en el navegador.

import axios from 'axios';
import * as cheerio from 'cheerio';

const RSS_URL = 'https://www.aciprensa.com/rss/saints';

/**
 * Limpia el HTML de la <description> de cada <item>: separa la imagen (si hay)
 * y arma el texto de la biografía a partir de los párrafos, descartando la
 * línea técnica "Feast date: ..." y la línea de "Más información..." con
 * el link pelado, que no aportan al lector.
 */
function parsearDescripcion(html) {
  const $ = cheerio.load(html);

  const imagen = $('img').first().attr('src') || '';

  const parrafos = [];
  $('p').each((_, p) => {
    const texto = $(p).text().trim();
    if (!texto) return;
    if (/^feast date:/i.test(texto)) return; // línea técnica en inglés
    if (/^\*?\s*más información/i.test(texto)) return; // línea con link pelado
    parrafos.push(texto);
  });

  // Algunos items traen el texto suelto sin <p> (ver ejemplo "Nuestra Señora del
  // Cobre" en el feed real). Si no encontramos párrafos, tomamos el texto plano
  // del contenedor completo, sacando la imagen y la línea de "Feast date".
  let biografia = parrafos.join('\n\n');
  if (!biografia) {
    biografia = $.root()
      .text()
      .replace(/Feast date:.*(\n|$)/i, '')
      .trim();
  }

  return { imagen, biografia };
}

/**
 * Algunos items del RSS vienen truncados (biografías viejas migradas de otro
 * sistema, ver "Nuestra Señora del Cobre"). Si el texto es muy corto,
 * completamos yendo a buscar la biografía completa a la página del santo.
 */
const LARGO_MINIMO = 500;

async function obtenerBiografiaCompleta(url) {
  try {
    const { data: html } = await axios.get(url, {
      headers: { 'User-Agent': 'liturgia-diaria-personal-app/1.0' },
      timeout: 10000,
    });
    const $ = cheerio.load(html);

    // Estructura real de aciprensa.com: el contenido vive en
    // <div class="page-content"><p>...</p>...</div>
    const parrafos = [];
    $('.page-content p').each((_, p) => {
      const $p = $(p);
      if ($p.find('img').length > 0) return; // saltar el párrafo que solo trae la imagen
      const texto = $p.text().trim();
      if (texto) parrafos.push(texto);
    });

    return parrafos.join('\n\n');
  } catch (error) {
    console.error('⚠️ No se pudo ampliar la biografía desde', url, error.message);
    return '';
  }
}

/**
 * Obtiene el/los santo(s) del día desde el RSS de ACI Prensa.
 */
async function obtenerSantosACI() {
  try {
    const { data: xml } = await axios.get(RSS_URL, {
      headers: { 'User-Agent': 'liturgia-diaria-personal-app/1.0' },
      timeout: 10000,
    });

    const $ = cheerio.load(xml, { xmlMode: true });

    const santos = [];
    const items = $('item').toArray();
    for (const item of items) {
      const $item = $(item);
      const titulo = $item.find('title').first().text().trim();
      const link = $item.find('link').first().text().trim();
      const descripcionHtml = $item.find('description').first().text();

      const { imagen, biografia } = parsearDescripcion(descripcionHtml);

      let biografiaFinal = biografia;
      if (!biografiaFinal || biografiaFinal.length < LARGO_MINIMO) {
        const ampliada = await obtenerBiografiaCompleta(link);
        if (ampliada && ampliada.length > biografiaFinal.length) {
          biografiaFinal = ampliada;
        }
      }

      santos.push({
        titulo,
        link,
        imagen,
        biografia: biografiaFinal || 'Biografía no disponible.',
      });
    }

    return {
      santos,
      fuente: 'ACI Prensa — Santoral Católico (aciprensa.com/rss/saints)',
    };
  } catch (error) {
    console.error('❌ Error al obtener santos del día:', error.message);
    return {
      santos: [],
      fuente: '',
      error: true,
    };
  }
}


// ─────────────────────────── Vatican News ───────────────────────────

const VN_BASE = 'https://www.vaticannews.va';
const HEADERS_VN = { 'User-Agent': 'liturgia-diaria-personal-app/1.0' };

/** Mes y día de HOY en horario de Argentina, con dos dígitos ("10", "16"). */
function mesDiaArgentina() {
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const mes = partes.find((p) => p.type === 'month').value;
  const dia = partes.find((p) => p.type === 'day').value;
  return { mes, dia };
}

function absoluta(url) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return VN_BASE + (url.startsWith('/') ? '' : '/') + url;
}

/** Lee la página de un santo: título, imagen y biografía (párrafos + subtítulos). */
async function obtenerSantoVN(url) {
  const { data: html } = await axios.get(url, { headers: HEADERS_VN, timeout: 8000 });
  const $ = cheerio.load(html);
  const $detalle = $('.santi--detail').first();
  if (!$detalle.length) return null;

  const titulo = $('h1').first().text().trim() || $detalle.find('img').first().attr('alt') || '';

  // La imagen real viene "lazy": src es un gif vacío y la ruta está en data-original.
  const $img = $detalle.find('img').first();
  let imagen = $img.attr('data-original') || '';
  if (!imagen) {
    const src = $img.attr('src') || '';
    if (src && !src.startsWith('data:')) imagen = src;
  }

  const partes = [];
  $detalle.find('h2, p').each((_, el) => {
    if ($(el).closest('figure').length) return;
    const texto = $(el).text().replace(/\s+/g, ' ').trim();
    if (texto) partes.push(texto);
  });
  const biografia = partes.join('\n\n');
  if (!biografia) return null;

  return { titulo, link: url, imagen: absoluta(imagen), biografia };
}

async function obtenerSantosVaticanNews() {
  const { mes, dia } = mesDiaArgentina();
  const urlDia = `${VN_BASE}/es/santos/${mes}/${dia}.html`;
  const { data: html } = await axios.get(urlDia, { headers: HEADERS_VN, timeout: 8000 });
  const $ = cheerio.load(html);

  const prefijo = `/es/santos/${mes}/${dia}/`;
  const links = [];
  $('a[href]').each((_, a) => {
    const href = $(a).attr('href') || '';
    if (href.includes(prefijo) && href.endsWith('.html')) {
      const url = absoluta(href);
      if (!links.includes(url)) links.push(url);
    }
  });
  if (links.length === 0) throw new Error('Vatican News: no se encontraron santos para ' + urlDia);

  const resultados = await Promise.allSettled(links.map(obtenerSantoVN));
  const santos = resultados
    .filter((r) => r.status === 'fulfilled' && r.value)
    .map((r) => r.value);
  if (santos.length === 0) throw new Error('Vatican News: no se pudo leer ninguna biografía');

  return { santos, fuente: 'Vatican News — El Santo del día (vaticannews.va)' };
}

/**
 * Santo(s) del día: primero Vatican News; si falla, ACI Prensa como respaldo.
 */
export async function obtenerSantosDelDia() {
  try {
    return await obtenerSantosVaticanNews();
  } catch (error) {
    console.error('⚠️ Vatican News (santo) falló, uso ACI Prensa:', error.message);
    return obtenerSantosACI();
  }
}
