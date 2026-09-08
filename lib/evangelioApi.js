// lib/evangelioApi.js
// Fuentes: BibleAPI.com (evangelio) + LiturgicalCalendarAPI (santo)
// Documentación: https://bible-api.com/

const BASE_URL_API = 'https://litcal.johnromanodorazio.com/api';
const BIBLE_API = 'https://bible-api.com';

// Mapeo de nombres de libros al inglés (necesario para BibleAPI)
const LIBROS = {
  'Mateo': 'Matthew',
  'Marcos': 'Mark',
  'Lucas': 'Luke',
  'Juan': 'John',
  'Hechos': 'Acts',
  'Romanos': 'Romans',
  'Corintios': 'Corinthians',
  'Gálatas': 'Galatians',
  'Efesios': 'Ephesians',
  'Filipenses': 'Philippians',
  'Colosenses': 'Colossians',
  'Tesalonicenses': 'Thessalonians',
  'Timoteo': 'Timothy',
  'Tito': 'Titus',
  'Filemón': 'Philemon',
  'Hebreos': 'Hebrews',
  'Santiago': 'James',
  'Pedro': 'Peter',
  'Juan': 'John',
  'Judas': 'Jude',
  'Apocalipsis': 'Revelation',
  // Libros del Antiguo Testamento (por si acaso)
  'Génesis': 'Genesis',
  'Éxodo': 'Exodus',
  'Levítico': 'Leviticus',
  'Números': 'Numbers',
  'Deuteronomio': 'Deuteronomy',
  'Josué': 'Joshua',
  'Jueces': 'Judges',
  'Rut': 'Ruth',
  'Samuel': 'Samuel',
  'Reyes': 'Kings',
  'Crónicas': 'Chronicles',
  'Esdras': 'Ezra',
  'Nehemías': 'Nehemiah',
  'Ester': 'Esther',
  'Job': 'Job',
  'Salmos': 'Psalms',
  'Proverbios': 'Proverbs',
  'Eclesiastés': 'Ecclesiastes',
  'Cantares': 'Song of Solomon',
  'Isaías': 'Isaiah',
  'Jeremías': 'Jeremiah',
  'Lamentaciones': 'Lamentations',
  'Ezequiel': 'Ezekiel',
  'Daniel': 'Daniel',
  'Oseas': 'Hosea',
  'Joel': 'Joel',
  'Amós': 'Amos',
  'Abdías': 'Obadiah',
  'Jonás': 'Jonah',
  'Miqueas': 'Micah',
  'Nahúm': 'Nahum',
  'Habacuc': 'Habakkuk',
  'Sofonías': 'Zephaniah',
  'Hageo': 'Haggai',
  'Zacarías': 'Zechariah',
  'Malaquías': 'Malachi'
};

/**
 * Convierte una referencia en español a formato inglés para BibleAPI
 * Ejemplo: "Mateo 13, 1-9" → "Matthew 13:1-9"
 */
function formatearReferencia(referencia) {
  if (!referencia) return null;
  
  let ref = referencia;
  
  // Reemplazar nombres de libros
  for (const [es, en] of Object.entries(LIBROS)) {
    const regex = new RegExp(`\\b${es}\\b`, 'gi');
    ref = ref.replace(regex, en);
  }
  
  // Reemplazar coma por dos puntos
  ref = ref.replace(',', ':');
  
  // Eliminar espacios extra
  ref = ref.replace(/\s+/g, '');
  
  // Separar libro del resto
  const match = ref.match(/^([A-Za-z]+)(.*)$/);
  if (match) {
    const libro = match[1];
    const resto = match[2];
    // Asegurar que el libro esté correctamente capitalizado
    const libroFormateado = libro.charAt(0).toUpperCase() + libro.slice(1);
    return libroFormateado + resto;
  }
  
  return ref;
}

/**
 * Obtiene el evangelio desde BibleAPI.com usando una referencia
 */
async function obtenerEvangelioBiblia(referencia) {
  if (!referencia) return null;
  
  try {
    const refFormateada = formatearReferencia(referencia);
    if (!refFormateada) return null;
    
    const url = `${BIBLE_API}/${refFormateada}?translation=rvr1960`;
    console.log(`📖 Consultando BibleAPI: ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.text) {
      throw new Error('No se encontró texto para esta referencia');
    }
    
    return {
      texto: data.text.trim(),
      referencia: data.reference || referencia,
      traduccion: 'Reina-Valera 1960'
    };
  } catch (error) {
    console.error('❌ Error al obtener evangelio de BibleAPI:', error.message);
    return null;
  }
}

/**
 * Obtiene el santo del día desde la API LiturgicalCalendarAPI
 */
async function obtenerSantoAPI(fecha) {
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  const fechaStr = `${año}-${mes}-${dia}`;

  try {
    const response = await fetch(`${BASE_URL_API}/calendar/${fechaStr}?lang=es`);
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    const data = await response.json();
    
    return {
      santo: data.santo || 'Santo del día no disponible',
      celebracion: data.celebracion || '',
      color: data.color || '',
      tiempo: data.tiempo || ''
    };
  } catch (error) {
    console.error('❌ Error al obtener santo:', error.message);
    return {
      santo: 'Santo del día no disponible',
      celebracion: '',
      color: '',
      tiempo: ''
    };
  }
}

/**
 * Obtiene la referencia del evangelio para una fecha específica
 * Por ahora usa una referencia fija, pero idealmente vendría de una API
 */
function obtenerReferenciaDelDia(fecha) {
  // TODO: Esto es temporal. En el futuro, obtener la referencia de una fuente confiable.
  // Por ahora, devolvemos una referencia de ejemplo.
  // Para un proyecto real, deberías obtener esto de una API o base de datos.
  
  // Ejemplo: para hoy 8 de septiembre (Natividad de la Virgen)
  const hoy = fecha.toISOString().split('T')[0];
  
  // Mapeo de fechas especiales (puedes ampliarlo)
  const referenciasEspeciales = {
    '2026-09-08': 'Mateo 1, 18-23', // Natividad de la Virgen
    '2026-12-25': 'Juan 1, 1-18',   // Navidad
    '2026-01-01': 'Lucas 2, 16-21', // Santa María Madre de Dios
    '2026-04-09': 'Juan 13, 1-15',  // Jueves Santo
    '2026-04-10': 'Juan 18, 1-19',  // Viernes Santo
    '2026-04-12': 'Juan 20, 1-9',   // Domingo de Pascua
  };
  
  if (referenciasEspeciales[hoy]) {
    return referenciasEspeciales[hoy];
  }
  
  // Para días normales: usar una referencia genérica
  // En un proyecto real, esto debería venir de una base de datos de lecturas
  return 'Mateo 13, 1-9'; // Referencia por defecto
}

/**
 * Obtiene todos los datos litúrgicos del día
 */
export async function obtenerDatosLiturgicos(fecha = new Date()) {
  const hoy = fecha.toISOString().split('T')[0];
  
  // 1. Obtener la referencia del evangelio
  const referencia = obtenerReferenciaDelDia(fecha);
  
  // 2. Obtener el santo
  const santoData = await obtenerSantoAPI(fecha);
  
  // 3. Obtener el evangelio usando la referencia
  const evangelioData = await obtenerEvangelioBiblia(referencia);
  
  return {
    evangelio: evangelioData?.texto || 'Evangelio no disponible. Por favor, intentá más tarde.',
    cita: evangelioData?.referencia || referencia,
    traduccion: evangelioData?.traduccion || '',
    santo: santoData.santo,
    celebracion: santoData.celebracion,
    color: santoData.color,
    tiempo: santoData.tiempo,
    fecha: hoy
  };
}

/**
 * Obtiene solo el evangelio del día
 */
export async function obtenerEvangelio(fecha = new Date()) {
  const datos = await obtenerDatosLiturgicos(fecha);
  return {
    evangelio: datos.evangelio,
    cita: datos.cita,
    traduccion: datos.traduccion,
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
    color: datos.color,
    fecha: datos.fecha
  };
}
