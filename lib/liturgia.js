// Nota: breviarium puede no estar disponible para español.
// Esta es una versión adaptada con contenido de ejemplo.
// Cuando esté disponible, se reemplaza con la librería real.

export function obtenerLaudes(fecha) {
  const fechaStr = fecha.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
  
  return {
    titulo: '🌅 Laudes - Oración de la Mañana',
    fecha: fechaStr,
    invitacion: 'Señor, ábreme los labios, y mi boca proclamará tu alabanza.',
    himno: '"Amanece un nuevo día, Señor, te damos gracias, por tu luz y tu vida, que nos llenan de esperanza..."',
    salmodia: 'Salmo 63: "Dios mío, tú eres mi Dios, por ti madrugo, mi alma está sedienta de ti..."',
    canticos: 'Benedictus: "Bendito sea el Señor, Dios de Israel, porque ha visitado y redimido a su pueblo..."',
    oracion: 'Señor, que este nuevo día sea para nosotros un tiempo de gracia. Guíanos por tus caminos. Amén.'
  };
}

export function obtenerVisperas(fecha) {
  const fechaStr = fecha.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
  
  return {
    titulo: '🌇 Vísperas - Oración de la Tarde',
    fecha: fechaStr,
    himno: '"Ya la luz del día declina, Señor, te damos gracias por este día que termina..."',
    salmodia: 'Salmo 141: "Señor, a ti te llamo, date prisa, escúchame, atiende mi voz cuando te invoco..."',
    canticos: 'Magníficat: "Proclama mi alma la grandeza del Señor, se alegra mi espíritu en Dios mi salvador..."',
    oracion: 'Señor, al caer la tarde te pedimos que bendigas nuestro descanso. Amén.'
  };
}

export function obtenerCompletas(fecha) {
  const fechaStr = fecha.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
  
  return {
    titulo: '🌙 Completas - Oración de la Noche',
    fecha: fechaStr,
    examen: '"Antes de dormir, repasemos el día que pasó... ¿Dónde estuve? ¿Qué hice? ¿Dónde estaba Dios?"',
    himno: '"Al llegar la noche, Señor, te damos gracias por tu protección..."',
    salmodia: 'Salmo 91: "El que habita al amparo del Altísimo, se acoge a la sombra del Omnipotente..."',
    canticos: 'Nunc Dimittis: "Ahora, Señor, según tu promesa, puedes dejar a tu siervo irse en paz..."',
    oracion: 'Señor, al terminar este día, encomendamos nuestra vida en tus manos. Amén.'
  };
}

// Función para obtener la liturgia completa del día
export function obtenerLiturgiaDelDia(fecha = new Date()) {
  return {
    laudes: obtenerLaudes(fecha),
    visperas: obtenerVisperas(fecha),
    completas: obtenerCompletas(fecha)
  };
}
