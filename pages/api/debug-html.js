// pages/api/debug-html.js
// TEMPORAL: solo para diagnosticar estructura HTML real de una fuente.
import axios from 'axios';

export default async function handler(req, res) {
  const target = req.query.url || 'https://lecturasdeldia.org/';
  const find = req.query.find;
  try {
    const { data: html } = await axios.get(target, {
      headers: { 'User-Agent': 'liturgia-diaria-debug/1.0' },
    });
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    if (find) {
      const idx = html.indexOf(find);
      if (idx === -1) {
        res.status(200).send(`No se encontró "${find}" en el HTML.`);
        return;
      }
      const desde = Math.max(0, idx - 500);
      res.status(200).send(html.slice(desde, desde + 8000));
      return;
    }

    res.status(200).send(html.slice(0, 15000));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
