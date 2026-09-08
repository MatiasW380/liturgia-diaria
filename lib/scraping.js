import axios from 'axios';
import * as cheerio from 'cheerio';

const URL_VATICAN = 'https://www.vaticannews.va/es/evangelio-de-hoy.html';

export async function obtenerDatosVatican() {
  try {
    console.log('🔍 Scraping Vatican News...');
    const response = await axios.get(URL_VATICAN, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LiturgiaBot/1.0; +https://github.com/MatiasW380/liturgia-diaria)'
      },
      timeout: 15000
    });

    const $ = cheerio.load(response.data);
    
    // Variables para almacenar los datos
    let evangelio = '';
    let cita = '';
    let reflexion = '';
    let santo = '';

    // Buscar el título de la lectura (ej: "Evangelio según San Mateo")
    $('h2, h3, h4, .title, .heading').each((i, el) => {
      const texto = $(el).text().trim();
      if (texto.includes('Evangelio') || texto.includes('Lectura') || texto.includes('Mateo') || texto.includes('Juan') || texto.includes('Lucas') || texto.includes('Marcos')) {
        cita = texto;
      }
    });

    // Buscar el texto del evangelio (generalmente está en párrafos dentro de un contenedor)
    $('article p, .content p, .text p, .evangelio p, .lectura p').each((i, el) => {
      const texto = $(el).text().trim();
      // Si el párrafo es largo y no tiene palabras clave de navegación, es probable que sea el evangelio
      if (texto.length > 50 && !texto.includes('compartir') && !texto.includes('redes sociales') && !texto.includes('Síguenos')) {
        evangelio += texto + '\n\n';
      }
    });

    // Buscar el comentario del Papa (suelen estar en párrafos con estilos especiales o después del evangelio)
    $('article p, .content p, .text p, .comentario p').each((i, el) => {
      const texto = $(el).text().trim();
      if (texto.includes('Papa') || texto.includes('Francisco') || texto.includes('Ángelus') || texto.includes('homilía')) {
        if (texto.length > 30) {
          reflexion = texto;
        }
      }
    });

    // Buscar el santo del día (suele estar en títulos o párrafos destacados)
    $('h2, h3, .title, .santo, .santos').each((i, el) => {
      const texto = $(el).text().trim();
      if (texto.includes('Santo') || texto.includes('Beato') || texto.includes('Santa')) {
        santo = texto;
      }
    });

    // Si no encontramos el evangelio, buscamos en todo el artículo
    if (!evangelio) {
      $('article p').each((i, el) => {
        const texto = $(el).text().trim();
        if (texto.length > 100 && !texto.includes('compartir') && !texto.includes('redes sociales')) {
          evangelio = texto;
          return false; // Salir del bucle
        }
      });
    }

    // Si no encontramos nada, usamos datos de respaldo
    if (!evangelio) {
      evangelio = 'No se pudo obtener el evangelio de hoy. Por favor, visitá Vatican News directamente.';
      cita = 'Evangelio del día';
    }
    
    if (!reflexion) {
      reflexion = 'No se pudo obtener la reflexión de hoy. Por favor, visitá Vatican News directamente.';
    }
    
    if (!santo) {
      santo = 'Consultar el santoral en Vatican News';
    }

    // Limpiar el evangelio (quitar espacios extra y líneas vacías)
    evangelio = evangelio.trim().replace(/\n{3,}/g, '\n\n');

    return {
      evangelio,
      cita,
      reflexion,
      santo,
      fecha: new Date().toISOString().split('T')[0],
      fuente: 'Vatican News'
    };
  } catch (error) {
    console.error('❌ Error en scraping:', error.message);
    return {
      evangelio: 'Error al cargar el evangelio. Por favor, intentá más tarde o visitá Vatican News directamente.',
      cita: 'Evangelio del día',
      reflexion: 'Error al cargar la reflexión. Por favor, intentá más tarde.',
      santo: 'Error al cargar el santo del día.',
      fecha: new Date().toISOString().split('T')[0],
      fuente: 'Vatican News'
    };
  }
}
