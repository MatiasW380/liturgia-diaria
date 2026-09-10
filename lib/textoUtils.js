// lib/textoUtils.js
// Utilidades de texto compartidas entre lecturasApi.js y liturgiaHorasApi.js.

/**
 * Convierte español de España (vosotros) a español latinoamericano (ustedes),
 * como pidió el usuario (está en Argentina). Cubre pronombres, posesivos y
 * las conjugaciones regulares/irregulares más comunes. Los imperativos
 * ("venid", "escuchad") son más difíciles de convertir sin arriesgar un
 * error gramatical, así que quedan afuera de este reemplazo automático.
 */
export function convertirAUstedes(texto) {
  if (!texto) return texto;
  let t = texto;

  t = t.replace(/\bvosotros\b/gi, (m) => (m[0] === 'V' ? 'Ustedes' : 'ustedes'));
  t = t.replace(/\bvosotras\b/gi, (m) => (m[0] === 'V' ? 'Ustedes' : 'ustedes'));
  t = t.replace(/\bvuestro\b/gi, (m) => (m[0] === 'V' ? 'Su' : 'su'));
  t = t.replace(/\bvuestra\b/gi, (m) => (m[0] === 'V' ? 'Su' : 'su'));
  t = t.replace(/\bvuestros\b/gi, (m) => (m[0] === 'V' ? 'Sus' : 'sus'));
  t = t.replace(/\bvuestras\b/gi, (m) => (m[0] === 'V' ? 'Sus' : 'sus'));

  const irregulares = {
    sois: 'son', estáis: 'están', habéis: 'han', tenéis: 'tienen',
    vais: 'van', decís: 'dicen', venís: 'vienen', podéis: 'pueden',
    queréis: 'quieren', sabéis: 'saben', oís: 'oyen', dais: 'dan',
  };
  for (const [de, a] of Object.entries(irregulares)) {
    t = t.replace(new RegExp(`\\b${de}\\b`, 'gi'), (m) =>
      m[0] === m[0].toUpperCase() ? a[0].toUpperCase() + a.slice(1) : a
    );
  }

  // Futuro regular: -aréis/-eréis/-iréis → -arán/-erán/-irán
  t = t.replace(/(\p{L}+)ar(é|e)is\b/giu, '$1arán');
  t = t.replace(/(\p{L}+)er(é|e)is\b/giu, '$1erán');
  t = t.replace(/(\p{L}+)ir(é|e)is\b/giu, '$1irán');

  // Presente/subjuntivo regular: -áis → -an, -éis → -en, -ís → -en
  t = t.replace(/(\p{L}+)áis\b/giu, '$1an');
  t = t.replace(/(\p{L}+)éis\b/giu, '$1en');
  t = t.replace(/(\p{L}+)ís\b/giu, '$1en');

  return t;
}
