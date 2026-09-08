// lib/liturgiaApi.js
// Fuente: LiturgicalCalendarAPI - https://litcal.johnromanodorazio.com/

const BASE_URL = 'https://litcal.johnromanodorazio.com/api';

/**
 * Obtiene los datos litúrgicos del día desde la API
 * @param {Date} fecha - Fecha a consultar (opcional, por defecto hoy)
 * @returns {Object} Datos del evangelio, santo y celebración
 */
export async function obtenerDatosLiturgicos(fecha = new Date()) {
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  const fechaStr = `${año}-${mes}-${dia}`;

  try {
    console.log(`🔍 Consultando API litúrgica para ${fechaStr}...`);
    const respuesta = await fetch(`${BASE_URL}/calendar/${fechaStr}?lang=es`);
    
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }
    
    const datos = await respuesta.json();
    
    // Estructurar los datos de manera consistente
    return {
      evangelio: datos.evangelium || datos.evangelio || 'Evangelio del día no disponible',
      cita: datos.cita || datos.referencia || '',
      santo: datos.santo || datos.santos || 'Santo del día no disponible',
      celebracion: datos.celebracion || '',
      color: datos.color || '',
      tiempo: datos.tiempo || '',
      fecha: fechaStr,
      fuente: 'LiturgicalCalendarAPI'
    };
  } catch (error) {
    console.error('❌ Error al obtener datos litúrgicos:', error);
    // Devolver datos de ejemplo en caso de error
    return {
      evangelio: 'No se pudo cargar el evangelio. Por favor, intentá más tarde.',
      cita: '',
      santo: 'No se pudo cargar el santo del día.',
      celebracion: '',
      color: '',
      tiempo: '',
      fecha: fechaStr,
      fuente: 'Error'
    };
  }
}

/**
 * Obtiene solo el evangelio del día
 */
export async function obtenerEvangelio(fecha = new Date()) {
  const datos = await obtenerDatosLiturgicos(fecha);
  return {
    evangelio: datos.evangelio,
    cita: datos.cita,
    fecha: datos.fecha
  };
}

/**
 * Obtiene solo el santo del día
 */
export async function obtenerSanto(fecha = new Date()) {
  const datos = await obtenerDatosLiturgicos(fecha);
  return {
    santo: datos.santo,
    celebracion: datos.celebracion,
    fecha: datos.fecha
  };
}
