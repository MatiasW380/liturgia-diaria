// pages/api/lecturas.js
// Se ejecuta en el servidor de Vercel (Node.js), no en el navegador.
// Por eso no hay problema de CORS al pedirle datos a lecturasdeldia.org.

import { obtenerLecturasDelDia } from '../../lib/lecturasApi';

export default async function handler(req, res) {
  try {
    const datos = await obtenerLecturasDelDia();
    // Cache de 1 hora en el edge de Vercel; el contenido cambia una vez al día.
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');
    res.status(200).json(datos);
  } catch (error) {
    res.status(500).json({ error: 'No se pudieron obtener las lecturas del día.' });
  }
}
