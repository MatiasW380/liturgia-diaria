// lib/lecturasApi.js
// Fuente: ACI Prensa — RSS de Evangelio y Lecturas del Día
// (https://www.aciprensa.com/rss/evangelio). Español latinoamericano
// (ACI Prensa tiene sede en Lima, Perú), a diferencia de lecturasdeldia.org
// que usa español de España. Trae, en un solo pedido, la celebración del
// día y todas las lecturas (Primera, a veces Segunda, Salmo y Evangelio).
// Se ejecuta SOLO en el servidor (API route), nunca en el navegador.

import axios from 'axios';
import * as cheerio from 'cheerio';

const RSS_URL = 'https://www.aciprensa.com/rss/evangelio';
const HEADERS = { 'User-Agent': 'liturgia-diaria-personal-app/1.0' };

/**
 * El HTML de cada lectura trae saltos de línea como <br>, que cheerio's
 * .text() ignora (uniría las líneas sin espacio). Los reemplazamos por
 * saltos de línea reales antes de extraer el texto.
 */
function textoConSaltos(html) {
  const conSaltos = (html || '').replace(/<br\s*\/?>/gi, '\n');
  return cheerio.load(`<div>${conSaltos}</div>`).text().trim();
}

/**
 * Nota sobre horario: este RSS refleja "hoy" según el servidor de ACI Prensa
 * (con sede en Lima, Perú, UTC-5). Argentina es UTC-3, 2 horas adelantada.
 * Esto puede causar un desfasaje de hasta 2 horas después de medianoche
 * argentina (de 00:00 a 02:00 AR, ACI podría seguir mostrando el día
 * anterior). Es un caso límite aceptable; si se necesita precisión exacta
 * ahí, habría que migrar a pedir la fecha explícita en vez del feed "de hoy".
 */
export async function obtenerLecturasDelDia() {
  try {
    const { data: xml } = await axios.get(RSS_URL, { headers: HEADERS, timeout: 10000 });
    const $ = cheerio.load(xml, { xmlMode: true });

    const item = $('item').first();
    const celebracion = item.find('title').first().text().trim();
    const descripcionHtml = item.find('description').first().text();

    const $desc = cheerio.load(descripcionHtml);

    // Cada lectura es un <h3>cita</h3> seguido de varios
    // <span class="readings__text"> (uno por versículo).
    const bloques = [];
    $desc('h3').each((_, h3) => {
      const cita = $desc(h3).text().trim();
      const versos = [];
      $desc(h3)
        .parent()
        .find('.readings__text')
        .each((_, span) => {
          versos.push(textoConSaltos($desc(span).html()));
        });
      bloques.push({ cita, texto: versos.join(' ') });
    });

    // El Salmo se identifica por su cita ("Salmo ..."). Los bloques antes del
    // salmo son lecturas (Primera / Segunda); los de después son variantes
    // del Evangelio (se usa la primera, que es la forma completa).
    const indiceSalmo = bloques.findIndex((b) => /^salmo/i.test(b.cita));
    const lecturas = indiceSalmo >= 0 ? bloques.slice(0, indiceSalmo) : [];
    const salmo = indiceSalmo >= 0 ? bloques[indiceSalmo] : null;
    const evangelios = indiceSalmo >= 0 ? bloques.slice(indiceSalmo + 1) : bloques.slice(-1);

    const primeraLectura = lecturas[0] || null;
    const segundaLectura = lecturas[1] || null;
    const evangelio = evangelios[0] || null;

    return {
      fecha: new Date().toISOString().slice(0, 10),
      celebracion: celebracion || 'Celebración del día no disponible',
      evangelio: evangelio?.texto || 'Evangelio no disponible. Por favor, intentá más tarde.',
      citaEvangelio: evangelio?.cita || '',
      tituloEvangelio: '', // ACI no separa un título/subtítulo por lectura
      primeraLectura: primeraLectura?.texto || '',
      citaPrimeraLectura: primeraLectura?.cita || '',
      tituloPrimeraLectura: '',
      segundaLectura: segundaLectura?.texto || '',
      citaSegundaLectura: segundaLectura?.cita || '',
      tituloSegundaLectura: '',
      salmo: salmo?.texto || '',
      citaSalmo: salmo?.cita || '',
      fuente: 'ACI Prensa (aciprensa.com/rss/evangelio)',
    };
  } catch (error) {
    console.error('❌ Error al obtener lecturas de ACI Prensa:', error.message);
    return {
      fecha: new Date().toISOString().slice(0, 10),
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
