# Informe de Estado — Liturgia Diaria

**Fecha del informe:** 8 de septiembre de 2026
**Repositorio:** https://github.com/MatiasW380/liturgia-diaria
**Deploy:** https://liturgia-diaria-pi.vercel.app/

---

## 1. Qué es esta app

Aplicación web personal (no comercial) en Next.js que muestra cada día:

- 📖 Evangelio del día (texto oficial completo)
- ⛪ Celebración litúrgica del día (nombre de la fiesta/santo)
- ✝️ Reflexión del día — **pendiente** (placeholder)
- 🌅🌇🌙 Laudes, Vísperas y Completas (Liturgia de las Horas)

Desplegada gratis en Vercel, conectada a GitHub: cada `git push` a `main` dispara un redeploy automático.

---

## 2. Estructura del proyecto

```
liturgia-diaria/
├── components/
│   └── Layout.js          # Menú y estructura visual común
├── lib/
│   ├── lecturasApi.js      # ✅ ACTIVO — scraping de lecturasdeldia.org
│   ├── evangelioApi.js      # ⚠️ obsoleto, ya no se usa (bible-api.com/litcal)
│   ├── liturgiaApi.js       # sin uso confirmado, revisar si tiene lógica viva
│   └── liturgiaHoras.js     # Laudes/Vísperas/Completas con texto fijo
├── pages/
│   ├── index.js             # Menú principal
│   ├── evangelio.js         # ✅ Evangelio + Celebración (funcional)
│   ├── santo.js              # ✅ usa la celebración como "santo" (funcional)
│   ├── reflexion.js          # ⏳ placeholder, sin fuente todavía
│   ├── liturgia-horas.js, laudes.js, visperas.js, completas.js
│   └── api/
│       ├── lecturas.js       # ✅ endpoint server-side que expone lecturasApi.js
│       └── debug-html.js     # 🔧 temporal, para diagnóstico — se puede borrar
└── styles/globals.css
```

---

## 3. Cómo funciona el Evangelio/Celebración (lo que se arregló hoy)

**Fuente:** [lecturasdeldia.org](https://lecturasdeldia.org) — Diócesis de Bilbao, con los
**textos oficiales del Leccionario de la Conferencia Episcopal Española** (100% católico,
sin traducciones protestantes).

**Flujo:**
1. `pages/api/lecturas.js` corre **en el servidor de Vercel** (no en el navegador) y llama a
   `lib/lecturasApi.js`.
2. `lecturasApi.js` calcula la fecha de **hoy en horario de Argentina**
   (`America/Argentina/Buenos_Aires`), arma la URL `lecturasdeldia.org/AAAA/MM/DD/` y la scrapea
   con `axios` + `cheerio`.
3. Busca cada lectura por su estructura real (`div.reading` → `.reading-label`,
   `.reading-cita`, `.reading-text p`), separando el título en cursiva
   (`p.titulo`, ej: *"La criatura que hay en ella viene del Espíritu Santo"*) del cuerpo del texto.
4. Devuelve JSON con: `celebracion`, `evangelio`, `citaEvangelio`, `tituloEvangelio`,
   `primeraLectura`, `salmo`, etc.
5. `pages/evangelio.js` pide ese JSON a `/api/lecturas` (`fetch` del lado del cliente, pero al
   endpoint propio — sin problema de CORS porque el scraping real ya lo hizo el servidor) y
   muestra: **Fecha → Celebración → título en negrita → texto del Evangelio → "Palabra de Dios."**
6. `pages/santo.js` usa el mismo endpoint y muestra la `celebracion` como "santo del día"
   (nota: es la celebración litúrgica, no una biografía del santo).

**Por qué antes no funcionaba:** la implementación previa (`evangelioApi.js`) pedía una
traducción bíblica (`rvr1960`) que `bible-api.com` no ofrece (es protestante/no soportada), y
consultaba una API de santoral con URL y campos incorrectos. Se reemplazó por completo.

---

## 4. Lo que falta / quedó pendiente

| Sección | Estado | Nota |
|---|---|---|
| Evangelio | ✅ Funcional | Fuente oficial CEE, horario Argentina |
| Celebración/Santo | ✅ Funcional (parcial) | Muestra el nombre de la fiesta, no biografía del santo |
| Primera Lectura / Salmo | 🟡 Ya se scrapea en `lecturasApi.js` pero **no se muestra** en ninguna página todavía |
| Reflexión del día | ⏳ Placeholder | **Próximo paso: buscar fuente** |
| Laudes / Vísperas / Completas | 🟡 Funciona pero con **texto fijo** (no varía día a día); el plan original era usar la librería `breviarium`, que no parece estar conectada realmente |
| `lib/evangelioApi.js`, `lib/liturgiaApi.js` | 🧹 Código muerto, candidatos a borrar cuando se confirme que no se usan |
| `pages/api/debug-html.js` | 🧹 Temporal de diagnóstico, borrar cuando ya no se necesite |
| Biografía del santo | No implementado | Necesitaría otra fuente (ej. Vatican News/santoral) |

---

## 5. Próximo paso acordado

Buscar una fuente confiable (idealmente católica y en español) para la **Reflexión/comentario
diario** — el comentario espiritual sobre el Evangelio del día — y conectarla a `pages/reflexion.js`
siguiendo el mismo patrón: scraping server-side vía una nueva API route, para evitar problemas de
CORS y mantener la app 100% funcional en Vercel.
