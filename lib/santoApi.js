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
 * línea técnica "Feast date: ..." que no aporta al lector.
 */
function parsearDescripcion(html) {
  const $ = cheerio.load(html);

  const imagen = $('img').first().attr('src') || '';

  const parrafos = [];
  $('p').each((_, p) => {
    const texto = $(p).text().trim();
    if (!texto) return;
    if (/^feast date:/i.test(texto)) return; // descartamos la línea técnica en inglés
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
    $('item').each((_, item) => {
      const $item = $(item);
      const titulo = $item.find('title').first().text().trim();
      const link = $item.find('link').first().text().trim();
      const descripcionHtml = $item.find('description').first().text();

      const { imagen, biografia } = parsearDescripcion(descripcionHtml);

      santos.push({
        titulo,
        link,
        imagen,
        biografia: biografia || 'Biografía no disponible.',
      });
    });

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
