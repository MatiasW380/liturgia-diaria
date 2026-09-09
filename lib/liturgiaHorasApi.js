// lib/liturgiaHorasApi.js
// Fuente: liturgiadelashoras.info — texto oficial completo en español de
// Laudes, Vísperas y Completas, con una página por hora y por día
// (hoy/ayer/manana). A diferencia de iBreviary (cuyo robots.txt prohíbe el
// scraping), este sitio sí permite el acceso automatizado.
// Se ejecuta SOLO en el servidor (API route), nunca en el navegador.

import axios from 'axios';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://www.liturgiadelashoras.info/hoy';
const HEADERS = { 'User-Agent': 'liturgia-diaria-personal-app/1.0' };

const RUTAS = {
  laudes: 'rezar-laudes.html',
  visperas: 'rezar-visperas.html',
  completas: 'rezar-completas.html',
};

const NOMBRE_H2 = {
  laudes: 'Laudes',
  visperas: 'Vísperas',
  completas: 'Completas',
};

// Subsecciones que no aportan al rezo (notas explicativas, apps, donaciones)
const IGNORAR = ['notas', 'apps - android - iphone - ipad', 'conclusión'];

function extraerHora($, nombreHora) {
  let dentro = false;
  let subseccionActual = '';
  const secciones = {};
  const orden = [];

  $('h2, h3, p, li').each((_, el) => {
    const tag = el.tagName ? el.tagName.toLowerCase() : '';
    const texto = $(el).text().trim();
    if (!texto) return;

    if (tag === 'h2') {
      dentro = texto.toLowerCase() === nombreHora.toLowerCase();
      subseccionActual = '';
      return;
    }
    if (!dentro) return;

    if (tag === 'h3') {
      subseccionActual = texto;
      if (!IGNORAR.includes(subseccionActual.toLowerCase()) && !orden.includes(subseccionActual)) {
        secciones[subseccionActual] = [];
        orden.push(subseccionActual);
      }
      return;
    }

    if (!subseccionActual || IGNORAR.includes(subseccionActual.toLowerCase())) return;
    if (!secciones[subseccionActual]) return;
    secciones[subseccionActual].push(texto);
  });

  return orden
    .filter((nombre) => secciones[nombre] && secciones[nombre].length > 0)
    .map((nombre) => ({ nombre, texto: secciones[nombre].join('\n\n') }));
}

export async function obtenerHora(hora) {
  const ruta = RUTAS[hora];
  if (!ruta) throw new Error(`Hora desconocida: ${hora}`);

  try {
    const url = `${BASE_URL}/${ruta}`;
    const { data: html } = await axios.get(url, { headers: HEADERS, timeout: 10000 });
    const $ = cheerio.load(html);

    const tituloCompleto = $('h1').first().text().trim(); // ej: "Laudes - MARTES XXIII SEMANA..."
    const celebracion = tituloCompleto.split(' - ')[1] || '';

    const secciones = extraerHora($, NOMBRE_H2[hora]);

    return {
      titulo: NOMBRE_H2[hora],
      celebracion,
      secciones,
      fuente: 'liturgiadelashoras.info',
    };
  } catch (error) {
    console.error(`❌ Error al obtener ${hora}:`, error.message);
    return {
      titulo: NOMBRE_H2[hora] || hora,
      celebracion: '',
      secciones: [],
      fuente: '',
      error: true,
    };
  }
}
