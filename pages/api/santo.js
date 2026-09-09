// pages/api/santo.js
// Se ejecuta en el servidor de Vercel (Node.js), no en el navegador.

import { obtenerSantosDelDia } from '../../lib/santoApi';

export default async function handler(req, res) {
  try {
    const datos = await obtenerSantosDelDia();
    if (datos.error) {
      res.setHeader('Cache-Control', 'no-store');
    } else {
      res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');
    }
    res.status(200).json(datos);
  } catch (error) {
    res.setHeader('Cache-Control', 'no-store');
    res.status(500).json({ error: 'No se pudo obtener el santo del día.' });
  }
}
