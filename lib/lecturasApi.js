// lib/lecturasApi.js
// Fuente: lecturasdeldia.org (Diócesis de Bilbao) — textos oficiales del
// Leccionario de la Conferencia Episcopal Española. 100% católico.
// Se ejecuta SOLO en el servidor (API route), nunca en el navegador,
// para evitar problemas de CORS.

import axios from 'axios';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://lecturasdeldia.org';

/**
 * Devuelve la fecha de hoy en horario de Argentina (America/Argentina/Buenos_Aires),
 * formateada como YYYY/MM/DD, que es el formato de URL del sitio.
 */
function obtenerFechaArgentina(fecha = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  // en-CA da formato YYYY-MM-DD
  const partes = formatter.format(fecha); // "2026-09-08"
  const [anio, mes, dia] = partes.split('-');
  return { anio, mes, dia, iso: `${anio}-${mes}-${dia}` };
}

/**
 * Extrae una sección de lectura (Evangelio, Primera Lectura, Salmo Responsorial)
 * usando la estructura real del sitio: cada lectura es un <div class="reading">
 * con un botón que trae <span class="reading-label"> y <span class="reading-cita">,
 * y el texto vive en el <div class="reading-text"> asociado (párrafos <p>).
 */
function extraerSeccion($, etiqueta) {
  let resultado = null;

  $('div.reading').each((_, el) => {
    const $reading = $(el);
    const label = $reading.find('.reading-label').first().text().trim();

    if (label.toLowerCase() === etiqueta.toLowerCase()) {
      const cita = $reading.find('.reading-cita').first().text().trim();
      const titulo = $reading.find('.reading-text p.titulo').first().text().trim();
      const parrafos = [];

      $reading.find('.reading-text p').each((_, p) => {
        if ($(p).hasClass('titulo')) return; // el título va aparte, no es parte del cuerpo
        const texto = $(p).text().trim();
        if (texto) parrafos.push(texto);
      });

      resultado = { cita, titulo, texto: parrafos.join('\n\n') };
      return false; // cortar el .each, ya encontramos lo que buscábamos
    }
  });

  return resultado;
}

/**
 * Obtiene las lecturas del día (Evangelio, Primera Lectura, Salmo) y la
 * celebración litúrgica desde lecturasdeldia.org, usando el horario de Argentina.
 */
export async function obtenerLecturasDelDia(fecha = new Date()) {
  const { anio, mes, dia, iso } = obtenerFechaArgentina(fecha);
  const url = `${BASE_URL}/${anio}/${mes}/${dia}/`;

  try {
    const { data: html } = await axios.get(url, {
      headers: { 'User-Agent': 'liturgia-diaria-personal-app/1.0' },
      timeout: 10000,
    });
    const $ = cheerio.load(html);

    // Título de la celebración litúrgica (ej: "Natividad de la Virgen María")
    const celebracion = $('h1').first().text().trim();

    const evangelio = extraerSeccion($, 'Evangelio');
    const primeraLectura = extraerSeccion($, 'Primera Lectura');
    const segundaLectura = extraerSeccion($, 'Segunda Lectura'); // no todos los días existe
    const salmo = extraerSeccion($, 'Salmo Responsorial');

    return {
      fecha: iso,
      celebracion: celebracion || 'Celebración del día no disponible',
      evangelio: evangelio?.texto || 'Evangelio no disponible. Por favor, intentá más tarde.',
      citaEvangelio: evangelio?.cita || '',
      tituloEvangelio: evangelio?.titulo || '',
      primeraLectura: primeraLectura?.texto || '',
      citaPrimeraLectura: primeraLectura?.cita || '',
      tituloPrimeraLectura: primeraLectura?.titulo || '',
      segundaLectura: segundaLectura?.texto || '',
      citaSegundaLectura: segundaLectura?.cita || '',
      tituloSegundaLectura: segundaLectura?.titulo || '',
      salmo: salmo?.texto || '',
      citaSalmo: salmo?.cita || '',
      fuente: 'Leccionario de la Conferencia Episcopal Española (lecturasdeldia.org)',
    };
  } catch (error) {
    console.error('❌ Error al obtener lecturas de lecturasdeldia.org:', error.message);
    return {
      fecha: iso,
      celebracion: 'No disponible',
      evangelio: 'No se pudo cargar el evangelio. Por favor, intentá más tarde.',
      citaEvangelio: '',
      tituloEvangelio: '',
      primeraLectura: '',
      citaPrimeraLectura: '',
      tituloPrimeraLectura: '',
      segundaLectura: '',
      citaSegundaLectura: '',
      tituloSegundaLectura: '',
      salmo: '',
      citaSalmo: '',
      fuente: '',
      error: true,
    };
  }
}
