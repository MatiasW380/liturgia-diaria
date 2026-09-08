// pages/api/debug-html.js
// TEMPORAL: solo para diagnosticar la estructura real del HTML de la fuente.
// Se puede borrar una vez resuelto el scraping.
import axios from 'axios';

export default async function handler(req, res) {
  try {
    const { data: html } = await axios.get('https://lecturasdeldia.org/', {
      headers: { 'User-Agent': 'liturgia-diaria-debug/1.0' },
    });
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.status(200).send(html.slice(0, 15000));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
