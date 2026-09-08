// lib/reflexionApi.js
// Fuente: Catholic.net — RSS de meditación diaria (es.catholic.net/rss/meditacion.xml)
// El RSS solo trae un resumen corto; para el texto completo se scrapea el
// artículo enlazado, usando la estructura real de esa página:
//   .art_titulo       -> título
//   .art_descripcion  -> bajada/resumen
//   .art_autor        -> autor
//   #art_texto p      -> cuerpo del artículo (párrafos)
//   primera <img>     -> imagen ilustrativa
// Se ejecuta SOLO en el servidor (API route), nunca en el navegador.

import axios from 'axios';
import * as cheerio from 'cheerio';

const RSS_URL = 'http://es.catholic.net/rss/meditacion.xml';
const HEADERS = { 'User-Agent': 'liturgia-diaria-personal-app/1.0' };

async function obtenerLinkDeHoy() {
  const { data: xml } = await axios.get(RSS_URL, { headers: HEADERS, timeout: 10000 });
  const $ = cheerio.load(xml, { xmlMode: true });
  const primerItem = $('item').first();
  return {
    link: primerItem.find('link').first().text().trim(),
    tituloRss: primerItem.find('title').first().text().trim(),
  };
}

async function scrapearArticulo(url) {
  const { data: html } = await axios.get(url, { headers: HEADERS, timeout: 10000 });
  const $ = cheerio.load(html);

  const titulo = $('.art_titulo').first().text().trim();
  const seccion = $('.art_subtitulo').first().text().trim();
  const descripcion = $('.art_descripcion').first().text().trim();
  const autor = $('.art_autor').first().text().trim().replace(/\s+/g, ' ');
  const imagen = $('#art_texto').prevAll('img').first().attr('src')
    || $('#articulo img').first().attr('src')
    || '';

  const parrafos = [];
  $('#art_texto p').each((_, p) => {
    const texto = $(p).text().trim();
    if (texto) parrafos.push(texto);
  });

  return {
    titulo,
    seccion,
    descripcion,
    autor,
    imagen,
    texto: parrafos.join('\n\n'),
  };
}

/**
 * Obtiene la reflexión/meditación diaria completa (Catholic.net).
 */
export async function obtenerReflexionDelDia() {
  try {
    const { link, tituloRss } = await obtenerLinkDeHoy();
    if (!link) throw new Error('No se encontró el artículo del día en el RSS');

    const articulo = await scrapearArticulo(link);

    return {
      titulo: articulo.titulo || tituloRss,
      seccion: articulo.seccion,
      descripcion: articulo.descripcion,
      autor: articulo.autor,
      imagen: articulo.imagen,
      texto: articulo.texto || 'Reflexión no disponible. Por favor, intentá más tarde.',
      fuente: 'Catholic.net',
    };
  } catch (error) {
    console.error('❌ Error al obtener la reflexión del día:', error.message);
    return {
      titulo: '',
      seccion: '',
      descripcion: '',
      autor: '',
      imagen: '',
      texto: 'No se pudo cargar la reflexión de hoy. Por favor, intentá más tarde.',
      fuente: '',
      error: true,
    };
  }
}
