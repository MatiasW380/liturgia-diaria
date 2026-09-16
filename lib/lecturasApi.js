// lib/lecturasApi.js
// Fuente: Vatican News — RSS "Evangelio y palabra del día"
// (https://www.vaticannews.va/es/evangelio-de-hoy.rss.xml). Ya viene en
// español latinoamericano ("ustedes"), sin necesidad de tocar el texto.
// El texto del Evangelio y las lecturas se muestra EXACTAMENTE como lo da
// la fuente — nunca se modifica ni una palabra.
// Se ejecuta SOLO en el servidor (API route), nunca en el navegador.

import axios from 'axios';
import * as cheerio from 'cheerio';

const RSS_URL = 'https://www.vaticannews.va/es/evangelio-de-hoy.rss.xml';
const HEADERS = { 'User-Agent': 'liturgia-diaria-personal-app/1.0' };

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

function textoConSaltos($, el) {
  const html = $(el).html() || '';
  const conSaltos = html.replace(/<br\s*\/?>/gi, '\n');
  return cheerio.load(`<div>${conSaltos}</div>`).text().trim();
}

/**
 * El feed no separa las lecturas con etiquetas HTML: es una lista plana de
 * <p>, donde cada lectura empieza con una línea tipo "Lectura de..." o
 * "Comienzo de..." (nombra el libro), sigue la cita bíblica, y después el
 * texto. El último párrafo del item es siempre el comentario papal (se
 * descarta acá; eso lo usa reflexionApi.js por separado).
 */
function extraerLecturas($, item) {
  const parrafos = $(item)
    .find('description')
    .first()
    .text();
  const $desc = cheerio.load(parrafos);
  const ps = $desc('p').toArray().map((p) => textoConSaltos($desc, p)).filter(Boolean);

  if (ps.length === 0) return { primera: null, segunda: null, evangelio: null };

  // El último párrafo es el comentario papal: no es una lectura, se descarta acá.
  const soloLecturas = ps.slice(0, -1);

  const esIntro = (texto) => /^(lectura d|comienzo d)/i.test(texto);
  const esLabel = (texto) => /^(primera|segunda) lectura$/i.test(texto);

  const bloques = [];
  let actual = null;
  for (const p of soloLecturas) {
    if (esLabel(p)) continue; // "Primera lectura" / "Segunda lectura": solo un rótulo, se ignora
    if (esIntro(p)) {
      actual = { intro: p, cita: '', textoLineas: [] };
      bloques.push(actual);
      continue;
    }
    if (!actual) continue;
    if (!actual.cita) {
      actual.cita = p; // la línea justo después del intro es la cita bíblica
    } else {
      actual.textoLineas.push(p);
    }
  }

  const lecturas = bloques.map((b) => ({
    cita: b.cita,
    texto: b.textoLineas.join('\n\n'),
    esEvangelio: /evangelio/i.test(b.intro),
  }));

  const evangelio = lecturas.find((l) => l.esEvangelio) || null;
  const otras = lecturas.filter((l) => !l.esEvangelio);

  return {
    primera: otras[0] || null,
    segunda: otras[1] || null,
    evangelio,
  };
}

/**
 * Trae la celebración, el Salmo, y también Evangelio/Primera/Segunda Lectura
 * desde ACI Prensa. La Celebración y el Salmo se usan siempre (Vatican News
 * no los tiene); el Evangelio y las lecturas solo se usan como RESPALDO si
 * Vatican News falla ese día.
 */
async function obtenerDatosACI() {
  try {
    const { data: xml } = await axios.get('https://www.aciprensa.com/rss/evangelio', {
      headers: HEADERS,
      timeout: 10000,
    });
    const $ = cheerio.load(xml, { xmlMode: true });
    const item = $('item').first();
    const celebracion = item.find('title').first().text().trim();
    const $desc = cheerio.load(item.find('description').first().text());

    const bloques = [];
    $desc('h3').each((_, h3) => {
      const cita = $desc(h3).text().trim();
      const versos = [];
      $desc(h3).parent().find('.readings__text').each((_, span) => {
        versos.push(textoConSaltos($desc, span));
      });
      bloques.push({ cita, texto: versos.join(' ') });
    });

    const indiceSalmo = bloques.findIndex((b) => /^salmo/i.test(b.cita));
    const lecturas = indiceSalmo >= 0 ? bloques.slice(0, indiceSalmo) : [];
    const salmoBloque = indiceSalmo >= 0 ? bloques[indiceSalmo] : null;
    const evangelios = indiceSalmo >= 0 ? bloques.slice(indiceSalmo + 1) : bloques.slice(-1);

    return {
      celebracion,
      salmo: salmoBloque?.texto || '',
      citaSalmo: salmoBloque?.cita || '',
      primera: lecturas[0] || null,
      segunda: lecturas[1] || null,
      evangelio: evangelios[0] || null,
    };
  } catch (error) {
    console.error('⚠️ No se pudo obtener datos de ACI Prensa:', error.message);
    return { celebracion: '', salmo: '', citaSalmo: '', primera: null, segunda: null, evangelio: null };
  }
}

export async function obtenerLecturasDelDia() {
  const datosACI = await obtenerDatosACI(); // siempre se pide: da Celebración y Salmo

  let primera = null;
  let segunda = null;
  let evangelio = null;
  let usoRespaldo = false;

  try {
    const { data: xml } = await axios.get(RSS_URL, { headers: HEADERS, timeout: 10000 });
    const $ = cheerio.load(xml, { xmlMode: true });

    const fechaHoy = fechaArgentinaYYYYMMDD();
    const items = $('item').toArray();
    let item = items.find((it) => $(it).find('guid').text().includes(fechaHoy));
    if (!item) item = items[0]; // fallback: el más reciente del feed

    const extraido = extraerLecturas($, item);
    primera = extraido.primera;
    segunda = extraido.segunda;
    evangelio = extraido.evangelio;
  } catch (error) {
    console.error('❌ Error al obtener lecturas de Vatican News:', error.message);
  }

  // Respaldo: si Vatican News falló o no trajo el Evangelio/Primera Lectura
  // ese día en particular, se completa con ACI Prensa (misma cita bíblica,
  // el leccionario es el mismo para toda la Iglesia).
  if (!evangelio && datosACI.evangelio) {
    evangelio = datosACI.evangelio;
    usoRespaldo = true;
  }
  if (!primera && datosACI.primera) {
    primera = datosACI.primera;
    usoRespaldo = true;
  }
  if (!segunda && datosACI.segunda) {
    segunda = datosACI.segunda;
  }

  if (!evangelio && !primera) {
    return {
      fecha: new Date().toISOString().slice(0, 10),
      celebracion: '',
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

  return {
    fecha: new Date().toISOString().slice(0, 10),
    celebracion: datosACI.celebracion || 'Celebración del día no disponible',
    evangelio: evangelio?.texto || 'Evangelio no disponible. Por favor, intentá más tarde.',
    citaEvangelio: evangelio?.cita || '',
    tituloEvangelio: '',
    primeraLectura: primera?.texto || '',
    citaPrimeraLectura: primera?.cita || '',
    tituloPrimeraLectura: '',
    segundaLectura: segunda?.texto || '',
    citaSegundaLectura: segunda?.cita || '',
    tituloSegundaLectura: '',
    salmo: datosACI.salmo,
    citaSalmo: datosACI.citaSalmo,
    fuente: usoRespaldo
      ? 'ACI Prensa (respaldo) + Vatican News'
      : 'Vatican News (Evangelio/Lecturas) + ACI Prensa (Celebración/Salmo)',
  };
}
