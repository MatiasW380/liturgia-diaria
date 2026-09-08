// lib/reflexionApi.js
// Fuente: Vatican News — RSS "Evangelio y palabra del día"
// (https://www.vaticannews.va/es/evangelio-de-hoy.rss.xml)
// Cada item trae las lecturas del día y, al final, un comentario/reflexión
// citado siempre de un Papa (Francisco, Benedicto XVI, etc.), con su fuente
// y fecha entre paréntesis. Se ejecuta SOLO en el servidor, nunca en el navegador.

import axios from 'axios';
import * as cheerio from 'cheerio';

const RSS_URL = 'https://www.vaticannews.va/es/evangelio-de-hoy.rss.xml';
const HEADERS = { 'User-Agent': 'liturgia-diaria-personal-app/1.0' };

/**
 * Nota sobre horario: Vatican News (Roma) está 5 horas adelantado respecto
 * a Argentina. Para no mostrar la reflexión de "mañana" durante la tarde/
 * noche argentina, en vez de tomar siempre el primer item del feed,
 * buscamos el item cuya fecha (en el guid, formato YYYY/MM/DD) coincide
 * con la fecha de HOY calculada en horario argentino.
 */
function fechaArgentinaYYYYMMDD() {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const [anio, mes, dia] = formatter.format(new Date()).split('-');
  return `${anio}/${mes}/${dia}`;
}

export async function obtenerReflexionDelDia() {
  try {
    const { data: xml } = await axios.get(RSS_URL, { headers: HEADERS, timeout: 10000 });
    const $ = cheerio.load(xml, { xmlMode: true });

    const fechaHoy = fechaArgentinaYYYYMMDD();
    const items = $('item').toArray();

    let itemElegido = items.find((it) => $(it).find('guid').text().includes(fechaHoy));
    if (!itemElegido) itemElegido = items[0]; // fallback: el más reciente del feed

    const descripcionHtml = $(itemElegido).find('description').first().text();
    const $desc = cheerio.load(descripcionHtml);

    const parrafos = $desc('p').toArray().map((p) => $desc(p).text().trim()).filter(Boolean);
    if (parrafos.length === 0) throw new Error('No se encontró contenido en el item del RSS');

    // El último párrafo es siempre el comentario papal, terminado en
    // "(Nombre del Papa - Fuente, fecha)".
    const ultimo = parrafos[parrafos.length - 1];
    const match = ultimo.match(/\(([^()]+)\)\s*$/);

    let texto = ultimo;
    let papa = '';
    let fuenteCita = '';

    if (match) {
      texto = ultimo.slice(0, match.index).trim();
      const partes = match[1].split(/\s-\s(.+)/s); // separa "Papa - resto"
      papa = (partes[0] || '').trim();
      fuenteCita = (partes[1] || '').trim();
    }

    return {
      texto: texto || 'Reflexión no disponible. Por favor, intentá más tarde.',
      papa,
      fuenteCita,
      fuente: 'Vatican News',
    };
  } catch (error) {
    console.error('❌ Error al obtener la reflexión del día:', error.message);
    return {
      texto: 'No se pudo cargar la reflexión de hoy. Por favor, intentá más tarde.',
      papa: '',
      fuenteCita: '',
      fuente: '',
      error: true,
    };
  }
}
