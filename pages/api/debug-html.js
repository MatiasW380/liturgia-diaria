// pages/api/debug-html.js
// TEMPORAL: solo para diagnosticar estructura HTML real de una fuente.
// Uso: ?url=...&find=...&offset=N
// Siempre responde 200 (aunque la fuente falle) para poder ver el error real.
import axios from 'axios';
import https from 'https';

export default async function handler(req, res) {
  const target = req.query.url || 'https://lecturasdeldia.org/';
  const find = req.query.find;
  const offset = parseInt(req.query.offset || '0', 10) || 0;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');

  try {
    const respuesta = await axios.get(target, {
      headers: { 'User-Agent': 'liturgia-diaria-personal-app/1.0' },
      timeout: 20000,
      ...(req.query.insecure ? { httpsAgent: new https.Agent({ rejectUnauthorized: false }) } : {}),
      validateStatus: () => true,
      responseType: 'text',
      transformResponse: (d) => d,
    });
    const html = String(respuesta.data || '');
    const cabecera =
      `STATUS: ${respuesta.status}\n` +
      `URL FINAL: ${respuesta.request?.res?.responseUrl || target}\n` +
      `CONTENT-TYPE: ${respuesta.headers['content-type'] || ''}\n` +
      `SERVER: ${respuesta.headers['server'] || ''}\n` +
      `LARGO: ${html.length}\n\n`;

    if (find) {
      const idx = html.indexOf(find);
      if (idx === -1) {
        res.status(200).send(cabecera + `No se encontró "${find}" en el HTML.`);
        return;
      }
      const desde = Math.max(0, idx - 500);
      res.status(200).send(cabecera + html.slice(desde, desde + 8000));
      return;
    }

    res.status(200).send(cabecera + html.slice(offset, offset + 15000));
  } catch (error) {
    res.status(200).send(`ERROR DE RED: ${error.code || ''} ${error.message}`);
  }
}
