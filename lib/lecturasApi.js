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
 * Extrae el texto de una sección a partir de un encabezado que contiene
 * cierta palabra clave (ej: "Evangelio", "Primera Lectura").
 * Estrategia resiliente: busca el encabezado por texto (no por clase CSS,
 * que puede cambiar), y junta los párrafos hasta el próximo encabezado de sección.
 */
function extraerSeccion($, palabraClave) {
  const encabezados = $('h1, h2, h3, h4, strong, b').filter((_, el) => {
    return $(el).text().trim().toLowerCase().startsWith(palabraClave.toLowerCase());
  });

  if (encabezados.length === 0) return null;

  const encabezado = encabezados.first();
  const citaCompleta = encabezado.text().trim(); // ej: "Evangelio Mt 1, 18-23"
  const cita = citaCompleta.replace(new RegExp(palabraClave, 'i'), '').trim();

  // Recorremos los hermanos siguientes hasta el próximo h1-h4 (nueva sección)
  let contenedor = encabezado.closest('section, div, article');
  if (contenedor.length === 0) contenedor = encabezado.parent();

  const parrafos = [];
  let nodo = encabezado.length ? encabezado[0].next : null;

  // Fallback simple: tomamos todos los <p> dentro del mismo contenedor padre
  // que vienen después del encabezado, hasta toparnos con otro encabezado.
  let siguienteEsOtraSeccion = false;
  contenedor.find('*').each((_, el) => {
    const $el = $(el);
    const esEncabezado = /^h[1-4]$/i.test(el.tagName || '') || el.tagName === 'STRONG' || el.tagName === 'B';
    if (esEncabezado && $el.text().trim() && $el !== encabezado[0]) {
      // si ya pasamos el encabezado buscado y encontramos otro, cortamos
      if (parrafos.length > 0) siguienteEsOtraSeccion = true;
    }
    if (!siguienteEsOtraSeccion && el.tagName === 'P') {
      const texto = $el.text().trim();
      if (texto) parrafos.push(texto);
    }
  });

  return {
    cita,
    texto: parrafos.join('\n\n'),
  };
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
    const salmo = extraerSeccion($, 'Salmo Responsorial');

    return {
      fecha: iso,
      celebracion: celebracion || 'Celebración del día no disponible',
      evangelio: evangelio?.texto || 'Evangelio no disponible. Por favor, intentá más tarde.',
      citaEvangelio: evangelio?.cita || '',
      primeraLectura: primeraLectura?.texto || '',
      citaPrimeraLectura: primeraLectura?.cita || '',
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
      primeraLectura: '',
      citaPrimeraLectura: '',
      salmo: '',
      citaSalmo: '',
      fuente: '',
      error: true,
    };
  }
}
