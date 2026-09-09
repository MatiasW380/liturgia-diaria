// pages/api/noticias.js
import { obtenerNoticias } from '../../lib/noticiasApi';

export default async function handler(req, res) {
  try {
    const datos = await obtenerNoticias();
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=600');
    res.status(200).json(datos);
  } catch (error) {
    res.status(500).json({ noticias: [], error: 'No se pudieron obtener las noticias.' });
  }
}
