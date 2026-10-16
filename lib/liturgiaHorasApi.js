// lib/liturgiaHorasApi.js
// FUENTE ACTUAL (desde oct 2026): liturgiadelashoras.github.io — el espejo
// oficial del mismo proyecto, con el mismo texto. liturgiadelashoras.info dejó
// de funcionar (certificado SSL vencido, páginas en 404 y el servidor muestra
// un listado de carpetas). Una página por hora y por día:
//   https://liturgiadelashoras.github.io/sync/2026/oct/16/laudes.htm
// (GitHub Pages, sin robots.txt que lo prohíba.)
//
// Lo de abajo (BASE_URL, extraerHora) es el extractor viejo de .info;
// se deja por si el sitio original vuelve.
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
  oficio_lectura: 'rezar-oficio_de_lectura.html',
  laudes: 'rezar-laudes.html',
  visperas: 'rezar-visperas.html',
  completas: 'rezar-completas.html',
};

const NOMBRE_H2 = {
  oficio_lectura: 'Oficio de Lectura',
  laudes: 'Laudes',
  visperas: 'Vísperas',
  completas: 'Completas',
};

// Subsecciones que no aportan al rezo (notas explicativas, apps, donaciones)
const IGNORAR = ['notas', 'apps - android - iphone - ipad', 'conclusión'];

/**
 * Los versos de salmos/himnos usan <br> para separar líneas dentro de un
 * mismo párrafo. cheerio's .text() ignora los <br>, así que los
 * reemplazamos por saltos de línea reales antes de extraer el texto.
 * IMPORTANTE: el texto litúrgico no se modifica de ninguna otra forma —
 * se muestra exactamente como lo da la fuente oficial.
 */
function textoConSaltos($, el) {
  const html = $(el).html() || '';
  const conSaltos = html.replace(/<br\s*\/?>/gi, '\n');
  return cheerio.load(`<div>${conSaltos}</div>`).text().trim();
}

function extraerHora($, nombreHora) {
  let dentro = false;
  let subseccionActual = '';
  const secciones = {};
  const orden = [];

  $('h2, h3, h4, p, li').each((_, el) => {
    const tag = el.tagName ? el.tagName.toLowerCase() : '';
    const texto = textoConSaltos($, el);
    if (!texto) return;

    if (tag === 'h2') {
      dentro = texto.toLowerCase() === nombreHora.toLowerCase();
      subseccionActual = '';
      return;
    }
    if (!dentro) return;

    if (tag === 'h3' || tag === 'h4') {
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

async function fetchConReintento(url, intentos = 2) {
  let ultimoError;
  for (let i = 0; i < intentos; i++) {
    try {
      const urlSinCache = `${url}?_=${Date.now()}`;
      return await axios.get(urlSinCache, { headers: HEADERS, timeout: 20000 });
    } catch (error) {
      ultimoError = error;
      console.warn(`⚠️ Intento ${i + 1}/${intentos} falló para ${url} (${error.message})`);
    }
  }
  throw ultimoError;
}

// ============================================================
// FALLBACK DE COMPLETAS
// Solo se usa si liturgiadelashoras.info falla. No pretende ser el texto
// específico del día (eso solo lo tiene la fuente en vivo, que respeta el
// santoral y las lecturas propias de cada fecha) — es la forma "simple"
// universal de Completas, usada en la mayoría de los breviarios cuando no
// se sigue el salterio semanal completo. Partes marcadas [verificado] se
// confirmaron contra un scrape real exitoso de la fuente; el resto es
// texto litúrgico estándar de dominio público / uso universal en la Iglesia.
// ============================================================

function calcularDomingoPascua(anio) {
  // Algoritmo de Meeus/Jones/Butcher (cómputo eclesiástico gregoriano)
  const a = anio % 19;
  const b = Math.floor(anio / 100);
  const c = anio % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mes = Math.floor((h + l - 7 * m + 114) / 31); // 3 = marzo, 4 = abril
  const dia = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(anio, mes - 1, dia);
}

function obtenerTiempoLiturgico(fecha) {
  const anio = fecha.getFullYear();
  const pascua = calcularDomingoPascua(anio);

  const miercolesCeniza = new Date(pascua);
  miercolesCeniza.setDate(pascua.getDate() - 46);

  const pentecostes = new Date(pascua);
  pentecostes.setDate(pascua.getDate() + 49);

  if (fecha >= miercolesCeniza && fecha < pascua) return 'cuaresma';
  if (fecha >= pascua && fecha <= pentecostes) return 'pascua';

  const mes = fecha.getMonth(); // 0 = enero, 11 = diciembre
  const dia = fecha.getDate();

  // Navidad: 25 de diciembre al 6 de enero (cruza el año)
  if ((mes === 11 && dia >= 25) || (mes === 0 && dia <= 6)) return 'navidad';

  // Adviento: aproximación simple, últimos días de noviembre + diciembre hasta el 24
  if (mes === 11 && dia <= 24) return 'adviento';
  if (mes === 10 && dia >= 27) return 'adviento';

  return 'ordinario';
}

const ANTIFONAS_MARIANAS = {
  ordinario: {
    nombre: 'Salve Regina',
    texto: 'Dios te salve, Reina y Madre de misericordia,\nvida, dulzura y esperanza nuestra, Dios te salve.\nA ti llamamos los desterrados hijos de Eva,\na ti suspiramos, gimiendo y llorando\nen este valle de lágrimas.\n\nEa, pues, Señora, abogada nuestra,\nvuelve a nosotros esos tus ojos misericordiosos,\ny después de este destierro,\nmuéstranos a Jesús, fruto bendito de tu vientre.\n\n¡Oh clementísima, oh piadosa, oh dulce Virgen María!', // [verificado] — coincide con el scrape real
  },
  adviento: {
    nombre: 'Alma Redemptoris Mater',
    texto: 'Madre del Redentor, virgen fecunda,\npuerta del cielo siempre abierta,\nestrella del mar,\nven a librar al pueblo que tropieza\ny quiere levantarse.\n\nAnte la admiración de cielo y tierra,\nengendraste a tu santo Creador,\ny permaneces siempre virgen.\n\nRecibe el saludo del ángel Gabriel,\ny ten piedad de nosotros, pecadores.', // [verificado] — coincide con el scrape real
  },
  navidad: {
    nombre: 'Alma Redemptoris Mater',
    texto: 'Madre del Redentor, virgen fecunda,\npuerta del cielo siempre abierta,\nestrella del mar,\nven a librar al pueblo que tropieza\ny quiere levantarse.\n\nAnte la admiración de cielo y tierra,\nengendraste a tu santo Creador,\ny permaneces siempre virgen.\n\nRecibe el saludo del ángel Gabriel,\ny ten piedad de nosotros, pecadores.', // [verificado] — coincide con el scrape real
  },
  cuaresma: {
    nombre: 'Ave, Regina de los cielos',
    texto: 'Salve, Reina de los cielos\ny Señora de los ángeles;\nsalve, raíz; salve, puerta,\nque dio paso a nuestra luz.\n\nAlégrate, virgen gloriosa,\nentre todas la más bella;\nsalve, oh hermosa doncella,\nruega a Cristo por nosotros.', // [verificado] — coincide con el scrape real
  },
  pascua: {
    nombre: 'Reina del Cielo',
    texto: 'Reina del cielo, alégrate, aleluya,\nporque el Señor,\na quien has merecido llevar, aleluya,\nha resucitado, según su palabra, aleluya.\nRuega al Señor por nosotros, aleluya.', // [verificado] — coincide con el scrape real
  },
};

function obtenerCompletasFallback() {
  const tiempo = obtenerTiempoLiturgico(new Date());
  const antifona = ANTIFONAS_MARIANAS[tiempo];

  const secciones = [
    {
      nombre: 'Invocación',
      texto: 'V. Dios mío, ven en mi auxilio.\nR. Señor, date prisa en socorrerme.\nGloria al Padre, y al Hijo, y al Espíritu Santo. Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén. Aleluya.', // [verificado]
    },
    {
      nombre: 'Salmodia',
      texto: 'Salmo 4\n\nEscúchame cuando te invoco, Dios, defensor mío;\ntú que en el aprieto me diste anchura,\nten piedad de mí y escucha mi oración.\n\nY vosotros, ¿hasta cuándo ultrajaréis mi honor,\namaréis la falsedad y buscaréis el engaño?\nSabedlo: el Señor hizo milagros en mi favor,\ny el Señor me escuchará cuando lo invoque.\n\nTemblad y no pequéis,\nreflexionad en el silencio de vuestro lecho;\nofreced sacrificios legítimos\ny confiad en el Señor.\n\nHay muchos que dicen: «¿Quién nos hará ver la dicha,\nsi la luz de tu rostro ha huido de nosotros?»\n\nPero tú, Señor, has puesto en mi corazón más alegría\nque si abundara en trigo y en vino.\n\nEn paz me acuesto y enseguida me duermo,\nporque tú solo, Señor, me haces vivir tranquilo.', // [verificado] — coincide con el scrape real
    },
    {
      nombre: 'Lectura Breve',
      texto: 'Dt 6,4-7\n\nEscucha, Israel: El Señor, nuestro Dios, es solamente uno. Amarás al Señor, tu Dios, con todo el corazón, con toda el alma, con todas las fuerzas. Las palabras que hoy te digo quedarán en tu memoria, se las repetirás a tus hijos y hablarás de ellas estando en casa y yendo de camino, acostado y levantado.', // [verificado] — coincide con el scrape real
    },
    {
      nombre: 'Responsorio Breve',
      texto: 'R. A tus manos, Señor, * Encomiendo mi espíritu. A tus manos.\nV. Tú, el Dios leal, nos librarás. * Encomiendo. Gloria al Padre. A tus manos.', // [verificado] — coincide con el scrape real
    },
    {
      nombre: 'Canto Evangélico',
      texto: 'Antífona: Sálvanos, Señor, despiertos, protégenos mientras dormimos para que velemos con Cristo y descansemos en paz.\n\nNunc dimittis (Lc 2, 29-32)\n\nAhora, Señor, según tu promesa,\npuedes dejar a tu siervo irse en paz.\n\nPorque mis ojos han visto a tu Salvador,\na quien has presentado ante todos los pueblos:\n\nluz para alumbrar a las naciones\ny gloria de tu pueblo Israel.\n\nGloria al Padre, y al Hijo, y al Espíritu Santo.\nComo era en el principio, ahora y siempre,\npor los siglos de los siglos. Amén.', // [verificado] — coincide con el scrape real
    },
    {
      nombre: 'Oración',
      texto: 'Visita, Señor, esta casa y aleja de ella todas las asechanzas del enemigo; que tus santos ángeles habiten en ella y nos guarden en paz, y que tu bendición permanezca siempre sobre nosotros. Por Jesucristo nuestro Señor. Amén.', // oración ferial estándar de Completas, de uso universal
    },
    {
      nombre: 'Bendición',
      texto: 'V. El Señor todopoderoso nos conceda una noche tranquila y una muerte santa.\nR. Amén.', // [verificado] — coincide con el scrape real
    },
    {
      nombre: `Antífona final: ${antifona.nombre}`,
      texto: antifona.texto,
    },
  ];

  return {
    titulo: 'Completas',
    celebracion: '',
    secciones,
    fuente: 'estándar',
    esFallback: true,
  };
}

// ─────────────── liturgiadelashoras.github.io ───────────────

const GH_BASE = 'https://liturgiadelashoras.github.io/sync';
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const ARCHIVO_GH = {
  oficio_lectura: 'oficio.htm',
  laudes: 'laudes.htm',
  visperas: 'visperas.htm',
  completas: 'completas.htm',
};

/** Carpeta del día de HOY en horario de Argentina, ej. "2026/oct/16". */
function carpetaDelDia() {
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const v = (t) => partes.find((p) => p.type === t).value;
  return `${v('year')}/${MESES[parseInt(v('month'), 10) - 1]}/${v('day')}`;
}

function sinAcentos(t) {
  return t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

/**
 * Recorre el HTML del cuerpo y lo convierte en líneas, recordando de qué
 * color es cada pedazo de texto. En esta fuente los títulos de sección
 * (INVITATORIO, SALMODIA, LECTURA BREVE…) van en rojo (#FF0000) y en una
 * línea propia; el texto para rezar va en negro.
 * IMPORTANTE: el texto litúrgico no se modifica — se muestra tal cual.
 */
function lineasConColor($, raiz) {
  const lineas = [[]];
  function recorrer(nodo, rojo, italica) {
    if (nodo.type === 'text') {
      const texto = nodo.data.replace(/\s+/g, ' ');
      if (texto.trim()) lineas[lineas.length - 1].push({ texto, rojo, italica });
      return;
    }
    if (nodo.type !== 'tag') return;
    const tag = nodo.name.toLowerCase();
    if (tag === 'br') { lineas.push([]); return; }
    if (tag === 'script' || tag === 'style') return;
    let r = rojo;
    let it = italica;
    if (tag === 'font' && nodo.attribs && nodo.attribs.color) {
      r = nodo.attribs.color.toLowerCase() === '#ff0000';
    }
    if (tag === 'i' || tag === 'em') it = true;
    if (tag === 'p' || tag === 'div') lineas.push([]);
    (nodo.children || []).forEach((h) => recorrer(h, r, it));
    if (tag === 'p' || tag === 'div') lineas.push([]);
  }
  (raiz.children || []).forEach((h) => recorrer(h, false, false));
  return lineas;
}

function extraerHoraGH($, nombreHora) {
  const cuerpo = $('#cuerpo').get(0) || $('body').get(0);
  if (!cuerpo) return [];
  const lineas = lineasConColor($, cuerpo);

  const secciones = [];
  let actual = null;
  const nombreNorm = sinAcentos(nombreHora);

  for (const segs of lineas) {
    const texto = segs.map((s) => s.texto).join('').trim();
    if (!texto) {
      if (actual && actual.lineas.length && actual.lineas[actual.lineas.length - 1] !== '') {
        actual.lineas.push('');
      }
      continue;
    }
    const esTitulo =
      segs.every((s) => s.rojo && !s.italica) &&
      !/^(V\.|R\.|Ant\.?)\s*\d*\.?$/i.test(texto) &&
      texto.length > 2;

    if (esTitulo) {
      if (sinAcentos(texto) === nombreNorm) continue; // "LAUDES": ya es el título de la página
      // Solo los rótulos enteramente en mayúsculas se pasan a formato oración
      // (INVITATORIO → Invitatorio). Títulos con texto propio (ej. el nombre
      // de un himno o salmo) se dejan exactamente como vienen.
      const nombre = texto === texto.toUpperCase()
        ? texto.charAt(0) + texto.slice(1).toLowerCase()
        : texto;
      actual = { nombre, lineas: [] };
      secciones.push(actual);
      continue;
    }

    if (!actual) continue; // rúbricas sueltas antes de la primera sección
    actual.lineas.push(texto);
  }

  return secciones
    .map((s) => ({ nombre: s.nombre, texto: s.lineas.join('\n').replace(/\n{3,}/g, '\n\n').trim() }))
    .filter((s) => s.texto);
}

async function obtenerCelebracionGH(carpeta) {
  try {
    const { data: html } = await fetchConReintento(`${GH_BASE}/${carpeta}/`);
    const $ = cheerio.load(html);
    const partes = [];
    $('strong, b').each((_, el) => {
      const t = $(el).text().replace(/\s+/g, ' ').trim();
      if (t && t.length > 2 && !partes.includes(t)) partes.push(t);
    });
    return partes.join(' · ');
  } catch {
    return '';
  }
}

export async function obtenerHora(hora) {
  if (!RUTAS[hora]) throw new Error(`Hora desconocida: ${hora}`);

  try {
    const carpeta = carpetaDelDia();
    const [{ data: html }, celebracion] = await Promise.all([
      fetchConReintento(`${GH_BASE}/${carpeta}/${ARCHIVO_GH[hora]}`),
      obtenerCelebracionGH(carpeta),
    ]);
    const $ = cheerio.load(html);
    const secciones = extraerHoraGH($, NOMBRE_H2[hora]);
    if (secciones.length === 0) throw new Error('No se encontraron secciones en la página');

    return {
      titulo: NOMBRE_H2[hora],
      celebracion,
      secciones,
      fuente: 'liturgiadelashoras.github.io',
    };
  } catch (error) {
    console.error(`❌ Error al obtener ${hora}:`, error.message);

    if (hora === 'completas') {
      return obtenerCompletasFallback();
    }

    return {
      titulo: NOMBRE_H2[hora] || hora,
      celebracion: '',
      secciones: [],
      fuente: '',
      error: true,
    };
  }
}
