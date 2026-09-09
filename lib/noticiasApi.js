// lib/noticiasApi.js
// Fuente: Vatican News — RSS general en español (vaticannews.va/es.rss.xml)
// Usado solo para mostrar unas pocas noticias recientes en la home, a modo
// de contenido adicional. Se ejecuta SOLO en el servidor.

import axios from 'axios';
import * as cheerio from 'cheerio';

const RSS_URL = 'https://www.vaticannews.va/es.rss.xml';
const HEADERS = { 'User-Agent': 'liturgia-diaria-personal-app/1.0' };
const CANTIDAD = 8;

export async function obtenerNoticias() {
  try {
    const { data: xml } = await axios.get(RSS_URL, { headers: HEADERS, timeout: 10000 });
    const $ = cheerio.load(xml, { xmlMode: true });

    const noticias = [];
    $('item').slice(0, CANTIDAD).each((_, item) => {
      const $item = $(item);
      const titulo = $item.find('title').first().text().trim();
      const link = $item.find('link').first().text().trim();
      const imagen = $item.find('media\\:content').first().attr('url') || '';

      noticias.push({ titulo, link, imagen });
    });

    return { noticias };
  } catch (error) {
    console.error('❌ Error al obtener noticias de Vatican News:', error.message);
    return { noticias: [], error: true };
  }
}
