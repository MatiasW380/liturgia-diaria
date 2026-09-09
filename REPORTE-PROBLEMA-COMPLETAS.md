# Reporte de Problema — "Completas" no carga en Liturgia de las Horas

**Proyecto:** Cristo en tu día
**Repositorio:** https://github.com/MatiasW380/liturgia-diaria
**Deploy:** https://liturgia-diaria-pi.vercel.app/
**Fecha del reporte:** 9 de septiembre de 2026

---

## 1. Resumen del problema

La app tiene tres páginas que muestran la Liturgia de las Horas: **Laudes**, **Vísperas** y **Completas**, las tres obtenidas de la misma fuente y con exactamente el mismo código. **Laudes y Vísperas funcionan correctamente.** **Completas falla siempre**, mostrando:

> ⚠️ No se pudo cargar Completas. Por favor, intentá más tarde.

El endpoint `/api/horas?hora=completas` devuelve:
```json
{"titulo":"Completas","celebracion":"","secciones":[],"fuente":"","error":true}
```

Esto pasa consistentemente, no de forma intermitente.

---

## 2. Cómo obtenemos los datos (las tres horas, mismo mecanismo)

**Fuente:** [liturgiadelashoras.info](https://www.liturgiadelashoras.info) — texto oficial completo en español. Se descartó iBreviary porque su `robots.txt` prohíbe el scraping.

**URLs por hora** (todas bajo `/hoy/`, HTML estático, sin JavaScript):
- Laudes: `https://www.liturgiadelashoras.info/hoy/rezar-laudes.html`
- Vísperas: `https://www.liturgiadelashoras.info/hoy/rezar-visperas.html`
- Completas: `https://www.liturgiadelashoras.info/hoy/rezar-completas.html`

**Arquitectura:**
1. `pages/api/horas.js` — API route de Next.js (server-side, evita CORS), recibe `?hora=laudes|visperas|completas`, con `export const config = { maxDuration: 30 }` para darle más tiempo del límite gratuito de Vercel (10s).
2. `lib/liturgiaHorasApi.js` — hace el fetch con axios + un cache-buster (`?_=timestamp`) y hasta 2 reintentos, parsea el HTML con cheerio, y estructura el contenido por sección.

**Estructura real del HTML de la fuente** (confirmada manualmente): cada página trae un `<h2>` con el nombre de la hora (ej. `<h2>Completas</h2>`) seguido de varios `<h3>` por subsección (Invocación, Himno, Salmodia, Lectura Breve, Responsorio Breve, Canto Evangélico, Oración, etc.) y párrafos `<p>` con el texto, usando `<br>` para separar versos dentro de un mismo párrafo.

**Función de extracción** (`extraerHora`, en `lib/liturgiaHorasApi.js`): recorre `$('h2, h3, p, li')` en orden; activa una bandera `dentro = true` cuando encuentra el `<h2>` cuyo texto coincide exactamente (case-insensitive) con el nombre de la hora buscada (`Laudes`, `Vísperas` o `Completas`), agrupa el contenido por cada `<h3>` que encuentra después, y corta al llegar a la siguiente hora. Descarta subsecciones irrelevantes ("Notas", "Apps...", "Conclusión").

**Código completo actual** (idéntico para las tres horas, solo cambia el string `hora`):

```javascript
// lib/liturgiaHorasApi.js
import axios from 'axios';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://www.liturgiadelashoras.info/hoy';
const HEADERS = { 'User-Agent': 'liturgia-diaria-personal-app/1.0' };

const RUTAS = {
  laudes: 'rezar-laudes.html',
  visperas: 'rezar-visperas.html',
  completas: 'rezar-completas.html',
};

const NOMBRE_H2 = {
  laudes: 'Laudes',
  visperas: 'Vísperas',
  completas: 'Completas',
};

const IGNORAR = ['notas', 'apps - android - iphone - ipad', 'conclusión'];

function textoConSaltos($, el) {
  const html = $(el).html() || '';
  const conSaltos = html.replace(/<br\s*\/?>/gi, '\n');
  return cheerio.load(`<div>${conSaltos}</div>`).text().trim();
}

function extraerHora($, nombreHora) {
  let dentro = false;
  let subseccionActual = '';
  const secciones = {};
  const orden = [];

  $('h2, h3, p, li').each((_, el) => {
    const tag = el.tagName ? el.tagName.toLowerCase() : '';
    const texto = textoConSaltos($, el);
    if (!texto) return;

    if (tag === 'h2') {
      dentro = texto.toLowerCase() === nombreHora.toLowerCase();
      subseccionActual = '';
      return;
    }
    if (!dentro) return;

    if (tag === 'h3') {
      subseccionActual = texto;
      if (!IGNORAR.includes(subseccionActual.toLowerCase()) && !orden.includes(subseccionActual)) {
        secciones[subseccionActual] = [];
        orden.push(subseccionActual);
      }
      return;
    }

    if (!subseccionActual || IGNORAR.includes(subseccionActual.toLowerCase())) return;
    if (!secciones[subseccionActual]) return;
    secciones[subseccionActual].push(texto);
  });

  return orden
    .filter((nombre) => secciones[nombre] && secciones[nombre].length > 0)
    .map((nombre) => ({ nombre, texto: secciones[nombre].join('\n\n') }));
}

async function fetchConReintento(url, intentos = 2) {
  let ultimoError;
  for (let i = 0; i < intentos; i++) {
    try {
      const urlSinCache = `${url}?_=${Date.now()}`;
      return await axios.get(urlSinCache, { headers: HEADERS, timeout: 20000 });
    } catch (error) {
      ultimoError = error;
      console.warn(`⚠️ Intento ${i + 1}/${intentos} falló para ${url} (${error.message})`);
    }
  }
  throw ultimoError;
}

export async function obtenerHora(hora) {
  const ruta = RUTAS[hora];
  if (!ruta) throw new Error(`Hora desconocida: ${hora}`);

  try {
    const url = `${BASE_URL}/${ruta}`;
    const { data: html } = await fetchConReintento(url);
    const $ = cheerio.load(html);

    const tituloCompleto = $('h1').first().text().trim();
    const celebracion = tituloCompleto.split(' - ')[1] || '';

    const secciones = extraerHora($, NOMBRE_H2[hora]);

    return {
      titulo: NOMBRE_H2[hora],
      celebracion,
      secciones,
      fuente: 'liturgiadelashoras.info',
    };
  } catch (error) {
    console.error(`❌ Error al obtener ${hora}:`, error.message);
    return {
      titulo: NOMBRE_H2[hora] || hora,
      celebracion: '',
      secciones: [],
      fuente: '',
      error: true,
    };
  }
}
```

---

## 3. El problema puntual con Completas

- La URL `https://www.liturgiadelashoras.info/hoy/rezar-completas.html` **sí carga** cuando se accede manualmente desde un navegador o herramienta externa (se verificó su contenido HTML manualmente más de una vez).
- Sin embargo, el fetch hecho **desde el servidor de Vercel** (vía esta API route) falla siempre, cayendo en el `catch` de `obtenerHora('completas')`.
- La página de Completas es notablemente **más larga** que Laudes/Vísperas: además de Invocación, Examen (con 3 fórmulas penitenciales alternativas), Himno, Salmodia, Lectura Breve, Responsorio, Canto Evangélico y Oración, termina con **5 antífonas marianas alternativas completas** (Salve Regina, Alma Redemptoris Mater, Ave Regina Caelorum, Regina Caeli, Bajo tu amparo), lo que la hace bastante más pesada de generar/transferir que las otras dos.

## 4. Qué ya se intentó (sin éxito)

1. **Reintentos automáticos** (hasta 3 intentos con backoff creciente) — sin cambio.
2. **Cache-buster** (`?_=timestamp` en la URL) para evitar servir una respuesta vieja cacheada por el sitio de origen — sin cambio.
3. **Aumentar el timeout de axios** de 10s → 12s → 15s → 20s — sin cambio.
4. **Aumentar el límite de ejecución de la función serverless de Vercel** a 30s (`maxDuration: 30`), sospechando que el límite gratuito de 10s se excedía — sin cambio.
5. **Eliminar el cacheo de respuestas de error** en el endpoint (se descubrió que `Cache-Control: s-maxage=3600` estaba guardando la primera respuesta de error por 1 hora, haciendo que pareciera un fallo persistente cuando en realidad no se estaba reintentando nada) — se corrigió esto, pero el fallo real **persiste** incluso con reintentos genuinos.
6. Se confirmó que **Laudes y Vísperas funcionan perfectamente** con código idéntico salvo el nombre de la hora y la URL.

## 5. Confirmado con los logs de Vercel

Se revisaron los Runtime Logs de Vercel y se confirma la causa exacta:

```
❌ Error al obtener completas: Request failed with status code 500
```

Esto se repite en **todos** los pedidos a `/api/horas?hora=completas` registrados, sin excepción. Es decir: **`liturgiadelashoras.info` devuelve un error HTTP 500 real y consistente** para `hoy/rezar-completas.html` cuando se le pide desde los servidores de Vercel — no es un problema de nuestro código, de timeout, ni de caché.

Esto coincide con un dato extraño detectado antes: al pedir esa misma URL manualmente (fuera de Vercel), en vez de un 500 se recibió contenido con fecha vieja (25 de mayo de 2024) en lugar del día actual. La hipótesis más probable es que **el generador de esa página específica (Completas del día de "hoy") esté roto del lado de `liturgiadelashoras.info`** para fechas actuales, tirando 500 en el momento real y dejando solo copias cacheadas antiguas dando vueltas por fuera.

## 6. Hipótesis descartadas

- ~~Timeout de la función serverless de Vercel~~ — se amplió a 30s sin cambio.
- ~~Caché de errores pegada~~ — se corrigió (`Cache-Control: no-store` en errores) y el 500 real sigue ocurriendo en cada pedido nuevo.
- ~~Bug en el parseo con cheerio~~ — descartado, el fetch ni siquiera llega a completarse (falla en el `axios.get`, antes de intentar parsear nada).

## 7. Qué sería útil para resolverlo

- **Confirmar si el problema es exclusivo de `hoy/rezar-completas.html`**, o si `ayer/rezar-completas.html` y `manana/rezar-completas.html` también fallan (ayudaría a acotar si es un bug de fecha específico del generador de esa página en el sitio de origen).
- Si se confirma que es un bug del lado de `liturgiadelashoras.info`, la solución no está de nuestro lado: habría que decidir entre (a) esperar a que ellos lo arreglen y mientras tanto mostrar un mensaje de error claro, o (b) buscar una fuente alternativa solo para Completas.

