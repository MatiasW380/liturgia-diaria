// lib/misalApi.js
// Fuente: eucaristiadiaria.cl — Arquidiócesis de Santiago de Chile, Área de
// Liturgia y Espiritualidad. Trae el Misal completo del día: antífonas,
// oración colecta, lecturas, salmo, evangelio, oración sobre las ofrendas,
// antífona de comunión y oración después de la comunión.
// El texto se muestra EXACTAMENTE como lo da la fuente, sin modificarlo.
// Se ejecuta SOLO en el servidor (API route), nunca en el navegador.

import axios from 'axios';
import * as cheerio from 'cheerio';

const URL = 'https://www.eucaristiadiaria.cl/dia.php';
const HEADERS = { 'User-Agent': 'liturgia-diaria-personal-app/1.0' };

const COLORES_LITURGICOS = ['verde', 'morado', 'blanco', 'rojo', 'rosa'];

function textoConSaltos($, el) {
  const html = $(el).html() || '';
  const conSaltos = html.replace(/<br\s*\/?>/gi, '\n');
  return cheerio.load(`<div>${conSaltos}</div>`).text().replace(/\u00a0/g, ' ').trim();
}

export async function obtenerMisalDelDia() {
  try {
    const { data: html } = await axios.get(URL, { headers: HEADERS, timeout: 15000 });
    const $ = cheerio.load(html);

    const parrafos = $('p')
      .toArray()
      .map((p) => textoConSaltos($, p))
      .filter(Boolean);

    // Encabezado: las líneas antes de "Antífona de entrada" son el nombre
    // de la celebración (1 o 2 líneas) y, al final, el color litúrgico.
    const indiceAntifonaEntrada = parrafos.findIndex((p) => /^ant[ií]fona de entrada/i.test(p));
    const encabezado = indiceAntifonaEntrada > 0 ? parrafos.slice(0, indiceAntifonaEntrada) : [];
    let colorLiturgico = '';
    let celebracion = encabezado.join(' — ');
    if (encabezado.length && COLORES_LITURGICOS.includes(encabezado[encabezado.length - 1].toLowerCase())) {
      colorLiturgico = encabezado[encabezado.length - 1];
      celebracion = encabezado.slice(0, -1).join(' — ');
    }

    // Rótulos que marcan el inicio de cada sección del Misal.
    const ES_LABEL = {
      antifonaEntrada: (p) => /^ant[ií]fona de entrada/i.test(p),
      oracionColecta: (p) => /^oraci[oó]n colecta$/i.test(p),
      lecturaIntro: (p) => /^(lectura de|comienzo de)/i.test(p),
      salmo: (p) => /^salmo responsorial/i.test(p),
      aclamacion: (p) => /^aclamaci[oó]n al evangelio/i.test(p),
      evangelioIntro: (p) => /^\+?\s*evangelio de nuestro/i.test(p),
      oracionOfrendas: (p) => /^oraci[oó]n sobre las ofrendas$/i.test(p),
      antifonaComunion: (p) => /^ant[ií]fona de comuni[oó]n/i.test(p),
      oracionComunion: (p) => /^oraci[oó]n despu[eé]s de la comuni[oó]n$/i.test(p),
    };

    const cualEsLabel = (p) => {
      for (const [clave, test] of Object.entries(ES_LABEL)) {
        if (test(p)) return clave;
      }
      return null;
    };

    const secciones = { lecturas: [] };
    let actual = null;

    for (let i = indiceAntifonaEntrada; i < parrafos.length; i++) {
      const p = parrafos[i];
      if (/^evangelio$/i.test(p)) continue; // rótulo suelto sin contenido propio, se ignora

      const label = cualEsLabel(p);
      if (label === 'lecturaIntro' || label === 'evangelioIntro') {
        actual = { tipo: label === 'evangelioIntro' ? 'evangelio' : 'lectura', cita: p, lineas: [] };
        if (label === 'evangelioIntro') secciones.evangelio = actual;
        else secciones.lecturas.push(actual);
        continue;
      }
      if (label) {
        actual = { cita: '', lineas: [] };
        if (label === 'antifonaEntrada' || label === 'salmo' || label === 'antifonaComunion') {
          actual.cita = p;
        }
        secciones[label] = actual;
        continue;
      }
      if (actual) actual.lineas.push(p);
    }

    const armar = (s) => (s ? { cita: s.cita || '', texto: s.lineas.join('\n\n') } : null);

    const lecturas = secciones.lecturas.map(armar);

    return {
      celebracion,
      colorLiturgico,
      antifonaEntrada: armar(secciones.antifonaEntrada),
      oracionColecta: armar(secciones.oracionColecta),
      primeraLectura: lecturas[0] || null,
      segundaLectura: lecturas[1] || null,
      salmo: armar(secciones.salmo),
      aclamacion: armar(secciones.aclamacion),
      evangelio: armar(secciones.evangelio),
      oracionOfrendas: armar(secciones.oracionOfrendas),
      antifonaComunion: armar(secciones.antifonaComunion),
      oracionComunion: armar(secciones.oracionComunion),
      fuente: 'eucaristiadiaria.cl (Arquidiócesis de Santiago de Chile)',
    };
  } catch (error) {
    console.error('❌ Error al obtener el Misal del día:', error.message);
    return { error: true, fuente: '' };
  }
}
