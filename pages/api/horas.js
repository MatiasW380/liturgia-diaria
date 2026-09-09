// pages/api/horas.js
// Se ejecuta en el servidor de Vercel (Node.js), no en el navegador.
// Uso: /api/horas?hora=laudes | visperas | completas

import { obtenerHora } from '../../lib/liturgiaHorasApi';

// La página de Completas es más larga que Laudes/Vísperas (trae varias
// antífonas marianas al final) y puede tardar más en generarse del lado
// de la fuente. Ampliamos el límite de esta función serverless (por
// defecto 10s en el plan gratuito de Vercel) para darle margen.
export const config = {
  maxDuration: 30,
};

export default async function handler(req, res) {
  const { hora } = req.query;
  if (!['laudes', 'visperas', 'completas'].includes(hora)) {
    res.status(400).json({ error: 'Parámetro "hora" inválido.' });
    return;
  }

  try {
    const datos = await obtenerHora(hora);
    if (datos.error) {
      // No cachear errores: si el próximo pedido llega en un momento en que
      // la fuente ya responde bien, no queremos seguir sirviendo el fallo viejo.
      res.setHeader('Cache-Control', 'no-store');
    } else {
      res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');
    }
    res.status(200).json(datos);
  } catch (error) {
    res.setHeader('Cache-Control', 'no-store');
    res.status(500).json({ error: `No se pudo obtener ${hora}.` });
  }
}
