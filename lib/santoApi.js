// lib/santoApi.js
// Fuente: ACI Prensa RSS oficial de Santos (https://www.aciprensa.com/rss/saints)
// Trae, para el día de hoy, uno o más santos/celebraciones con biografía completa.
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

    // El contenido real vive después del <h1> del santo y antes de la
    // sección "Últimas noticias". Tomamos los <p> del <article>/contenedor
    // principal, ignorando los del menú/footer (que no tienen tanto texto).
    const parrafos = [];
    $('article p, main p, .content p, #content p').each((_, p) => {
      const texto = $(p).text().trim();
      if (texto && texto.length > 20) parrafos.push(texto);
    });

    // Fallback más genérico si no hay un contenedor identificable: todos los
    // <p> de la página cuyo texto sea sustancioso (esto filtra menús/links cortos).
    if (parrafos.length === 0) {
      $('p').each((_, p) => {
        const texto = $(p).text().trim();
        if (texto && texto.length > 40 && !/^(síguenos|comparte|©)/i.test(texto)) {
          parrafos.push(texto);
        }
      });
    }

    return parrafos.join('\n\n');
  } catch (error) {
    console.error('⚠️ No se pudo ampliar la biografía desde', url, error.message);
    return '';
  }
}

/**
 * Obtiene el/los santo(s) del día desde el RSS de ACI Prensa.
 */
export async function obtenerSantosDelDia() {
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
