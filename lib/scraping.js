import axios from 'axios';
import * as cheerio from 'cheerio';

// URL de Vatican News para el Evangelio del día
const URL_VATICAN = 'https://www.vaticannews.va/es/evangelio-de-hoy.html';

/**
 * Obtiene el evangelio, reflexión y santo del día desde Vatican News
 */
export async function obtenerDatosVatican() {
  try {
    console.log('🔍 Scraping Vatican News...');
    const response = await axios.get(URL_VATICAN, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LiturgiaBot/1.0; +https://github.com/MatiasW380/liturgia-diaria)'
      },
      timeout: 10000 // 10 segundos
    });

    const $ = cheerio.load(response.data);
    
    // Intentar extraer el evangelio
    let evangelio = '';
    let cita = '';
    let reflexion = '';
    let santo = '';
    
    // Buscar el texto del evangelio (estructura típica de Vatican News)
    // Nota: Los selectores pueden cambiar, habrá que ajustarlos
    $('article p').each((i, el) => {
      const texto = $(el).text().trim();
      if (texto.includes('Evangelio') || texto.includes('Lectura')) {
        evangelio = texto;
      }
    });
    
    // Buscar el comentario del Papa
    $('article p').each((i, el) => {
      const texto = $(el).text().trim();
      if (texto.includes('Papa') || texto.includes('Francisco')) {
        reflexion = texto;
      }
    });
    
    // Buscar el santo del día
    $('article h2, article h3').each((i, el) => {
      const texto = $(el).text().trim();
      if (texto.includes('Santo') || texto.includes('Beato')) {
        santo = texto;
      }
    });

    // Si no encontramos nada, usamos datos de ejemplo
    if (!evangelio) {
      evangelio = 'Evangelio según San Mateo 13, 1-9: "Aquel día, Jesús salió de casa y se sentó junto al mar..."';
      cita = 'Mateo 13, 1-9';
    }
    
    if (!reflexion) {
      reflexion = '"El Evangelio nos invita a abrir el corazón a la Palabra de Dios" — Papa Francisco';
    }
    
    if (!santo) {
      santo = 'Santos del día: Consultar en el calendario litúrgico';
    }

    return {
      evangelio,
      cita,
      reflexion,
      santo,
      fecha: new Date().toISOString().split('T')[0]
    };
  } catch (error) {
    console.error('❌ Error en scraping:', error.message);
    // Devolver datos de ejemplo en caso de error
    return {
      evangelio: 'Evangelio según San Mateo 13, 1-9: "Aquel día, Jesús salió de casa y se sentó junto al mar..."',
      cita: 'Mateo 13, 1-9',
      reflexion: '"El Evangelio nos invita a abrir el corazón a la Palabra de Dios" — Papa Francisco',
      santo: 'Santos del día: Consultar en el calendario litúrgico',
      fecha: new Date().toISOString().split('T')[0]
    };
  }
}
