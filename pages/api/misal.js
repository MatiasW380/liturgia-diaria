// pages/api/misal.js
import { obtenerMisalDelDia } from '../../lib/misalApi';

export const config = { maxDuration: 20 };

export default async function handler(req, res) {
  try {
    const datos = await obtenerMisalDelDia();
    if (datos.error) {
      res.setHeader('Cache-Control', 'no-store');
    } else {
      res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');
    }
    res.status(200).json(datos);
  } catch (error) {
    res.setHeader('Cache-Control', 'no-store');
    res.status(500).json({ error: 'No se pudo obtener el Misal del día.' });
  }
}
