// pages/api/horas.js
// Se ejecuta en el servidor de Vercel (Node.js), no en el navegador.
// Uso: /api/horas?hora=laudes | visperas | completas

import { obtenerHora } from '../../lib/liturgiaHorasApi';

export default async function handler(req, res) {
  const { hora } = req.query;
  if (!['laudes', 'visperas', 'completas'].includes(hora)) {
    res.status(400).json({ error: 'Parámetro "hora" inválido.' });
    return;
  }

  try {
    const datos = await obtenerHora(hora);
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');
    res.status(200).json(datos);
  } catch (error) {
    res.status(500).json({ error: `No se pudo obtener ${hora}.` });
  }
}
