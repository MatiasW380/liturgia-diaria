// pages/api/santo.js
// Se ejecuta en el servidor de Vercel (Node.js), no en el navegador.

import { obtenerSantosDelDia } from '../../lib/santoApi';

export default async function handler(req, res) {
  try {
    const datos = await obtenerSantosDelDia();
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');
    res.status(200).json(datos);
  } catch (error) {
    res.status(500).json({ error: 'No se pudo obtener el santo del día.' });
  }
}
