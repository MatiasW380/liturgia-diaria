// lib/liturgiaHoras.js
// Fuente: Textos oficiales de la Liturgia de las Horas

/**
 * Obtiene el texto completo de Laudes (Oración de la Mañana)
 * @param {Date} fecha - Fecha para la oración
 * @returns {Object} Textos completos de Laudes
 */
export function obtenerLaudes(fecha = new Date()) {
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
    himno: `"Amanece un nuevo día,
Señor, te damos gracias,
por tu luz y tu vida,
que nos llenan de esperanza.

Tu amor nos sostiene,
tu paz nos acompaña,
en este amanecer
que nos regalas con ternura.

Que nuestras palabras,
que nuestras acciones,
sean siempre un reflejo
de tu bondad y misericordia. Amén."`,

    salmodia: `Salmo 63: "Dios mío, tú eres mi Dios, por ti madrugo,
mi alma está sedienta de ti; mi carne tiene ansia de ti,
como tierra reseca, agostada, sin agua.

Quiero contemplarte en el santuario,
viendo tu poder y tu gloria,
porque tu gracia vale más que la vida,
y mis labios te alabarán.

Toda mi vida te bendeciré,
y levantaré mis manos en tu nombre.
Como de enjundia y de grasa queda saciada mi alma,
y con labios jubilosos te alaba mi boca.

Cuando en mi lecho me acuerdo de ti,
en las vigilias medito en ti,
porque has sido mi auxilio,
y a la sombra de tus alas canto con júbilo.
Mi alma está unida a ti,
y tu diestra me sostiene."`,

    canticos: `Benedictus (Cántico de Zacarías):

"Bendito sea el Señor, Dios de Israel,
porque ha visitado y redimido a su pueblo,
y ha suscitado una fuerza de salvación
en la casa de David, su siervo,
como lo había anunciado desde antiguo
por boca de sus santos profetas:

que nos salvaría de nuestros enemigos
y de la mano de todos los que nos odian;
realizando la misericordia con nuestros padres,
y recordando su santa alianza,

el juramento que hizo a nuestro padre Abraham,
de concedernos que, libres de temor,
arrancados de la mano de nuestros enemigos,
le sirvamos en santidad y justicia
durante toda nuestra vida.

Y tú, niño, serás llamado profeta del Altísimo,
porque irás delante del Señor a preparar sus caminos,
anunciando a su pueblo la salvación,
el perdón de sus pecados,
por la entrañable misericordia de nuestro Dios,
que hará brillar desde lo alto una luz
sobre los que habitan en tinieblas y en sombra de muerte,
y guiará nuestros pasos por el camino de la paz."`,

    oracion: `Señor, Dios todopoderoso,
que has traído un nuevo día a nuestras vidas,
te pedimos que este amanecer sea para nosotros
un tiempo de gracia y bendición.

Guía nuestros pasos por tus caminos,
ilumina nuestra mente con tu sabiduría,
y llena nuestro corazón de tu amor.

Que todo lo que hagamos hoy
sea para tu gloria y para el bien de nuestros hermanos.

Te lo pedimos por Jesucristo, nuestro Señor. Amén.`
  };
}

/**
 * Obtiene el texto completo de Vísperas (Oración de la Tarde)
 * @param {Date} fecha - Fecha para la oración
 * @returns {Object} Textos completos de Vísperas
 */
export function obtenerVisperas(fecha = new Date()) {
  const fechaStr = fecha.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
  
  return {
    titulo: '🌇 Vísperas - Oración de la Tarde',
    fecha: fechaStr,
    himno: `"Ya la luz del día declina,
Señor, te damos gracias
por este día que termina,
y por tu amor que nos acompaña.

En tus manos encomendamos
el trabajo realizado,
las alegrías compartidas,
las penas y los cansancios.

Te pedimos que esta noche
sea para nosotros tiempo de descanso,
y que mañana, al despertar,
podamos alabarte de nuevo. Amén."`,

    salmodia: `Salmo 141: "Señor, a ti te llamo, date prisa, escúchame,
atiende mi voz cuando te invoco.
Suba mi oración como incienso a tu presencia,
mis manos levantadas como ofrenda de la tarde.

Pon, Señor, un guardián en mi boca,
un centinela en el umbral de mis labios.
No dejes que mi corazón se incline al mal,
que cometa acciones perversas con los malhechores.

Que el justo me corrija, será un favor,
que me reprenda, será un bálsamo para mi cabeza;
no la rechace mi cabeza,
pues mi oración los condena.

A ti, Señor, mi Dios, están mis ojos,
me refugio en ti, no me dejes desamparado.
Líbrame de la red que me han tendido,
de los lazos de los malhechores.
Que caigan en sus propias redes los impíos,
mientras yo paso de largo."`,

    canticos: `Magníficat (Cántico de María):

"Proclama mi alma la grandeza del Señor,
se alegra mi espíritu en Dios mi salvador,
porque ha mirado la humildad de su esclava.
Desde ahora me felicitarán todas las generaciones,
porque el Poderoso ha hecho en mí obras grandes,
santo es su nombre,
y su misericordia llega a sus fieles
de generación en generación.

Él hace proezas con su brazo:
dispersa a los soberbios de corazón,
derriba del trono a los poderosos
y enaltece a los humildes,
a los hambrientos los colma de bienes
y a los ricos los despide vacíos.

Auxilia a Israel, su siervo,
recordando su misericordia,
como lo había prometido a nuestros padres,
en favor de Abraham y de su descendencia por siempre."`,

    oracion: `Señor, Dios de la Alianza,
al llegar la tarde te damos gracias
por todas las bendiciones de este día.

Perdona nuestras faltas,
sana nuestras heridas,
y concédenos un descanso reparador.

Que tu paz que sobrepasa todo entendimiento
llene nuestros corazones y nuestros hogares.

Por Jesucristo, nuestro Señor. Amén.`
  };
}

/**
 * Obtiene el texto completo de Completas (Oración de la Noche)
 * @param {Date} fecha - Fecha para la oración
 * @returns {Object} Textos completos de Completas
 */
export function obtenerCompletas(fecha = new Date()) {
  const fechaStr = fecha.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
  
  return {
    titulo: '🌙 Completas - Oración de la Noche',
    fecha: fechaStr,
    examen: `"Antes de dormir, hagamos un breve examen de conciencia:

• ¿Dónde estuve hoy?
• ¿Qué hice?
• ¿Qué sentí?
• ¿Dónde estaba Dios en mi día?
• ¿A quién amé?
• ¿A quién pude haber amado más?

Damos gracias por lo bueno,
pedimos perdón por lo que no estuvo bien,
y nos encomendamos a la misericordia de Dios."`,

    himno: `"Al llegar la noche, Señor,
te damos gracias por tu protección.
En tus manos encomendamos nuestra vida,
confiando en tu amor sin medida.

Custodia nuestro descanso,
aleja de nosotros todo mal,
y que al despertar mañana
podamos alabarte de nuevo.

Bendice a quienes nos rodean,
cuida de los que sufren,
y concede a los difuntos la luz eterna.
Amén."`,

    salmodia: `Salmo 91: "El que habita al amparo del Altísimo,
se acoge a la sombra del Omnipotente.
Diré al Señor: 'Tú eres mi refugio, mi alcázar,
mi Dios, en quien confío'.

Él te librará de la red del cazador,
de la peste funesta.
Con sus plumas te cubrirá,
bajo sus alas te refugiarás,
su fidelidad será tu escudo y tu armadura.

No temerás el terror de la noche,
ni la flecha que vuela de día,
ni la peste que se desliza en las tinieblas,
ni la epidemia que devasta a pleno sol.

Caerán a tu izquierda mil,
diez mil a tu derecha,
pero a ti no te alcanzará.
Con tus ojos verás la recompensa de los impíos.

Porque has hecho del Señor tu refugio,
al Altísimo como tu defensa,
no te sobrevendrá el mal,
ni la plaga tocará tu tienda.

Porque a sus ángeles ha dado órdenes acerca de ti,
para que te guarden en todos tus caminos.
Te llevarán en sus manos,
para que tu pie no tropiece en piedra.

Pisotees al león y a la víbora,
pisarás al cachorro de león y a la serpiente.

Porque a mí se ha acogido, lo libraré,
lo protegeré porque ha conocido mi nombre.
Me invocará y le responderé,
estaré con él en la desgracia,
lo libraré y lo glorificaré.

Lo saciaré de larga vida,
y le haré ver mi salvación."`,

    canticos: `Nunc Dimittis (Cántico de Simeón):

"Ahora, Señor, según tu promesa,
puedes dejar a tu siervo irse en paz,
porque mis ojos han visto tu salvación,
la que has preparado a la vista de todos los pueblos,
luz para iluminar a las naciones
y gloria de tu pueblo Israel."`,

    oracion: `Señor, Dios de amor y misericordia,
al terminar este día encomendamos nuestra vida en tus manos.

Protégenos durante la noche,
concede a los que descansan en paz su sueño,
y a los que velan la fortaleza de tu presencia.

Que tu ángel nos custodie,
que tu paz nos envuelva,
y que al despertar mañana,
podamos alabarte con un corazón agradecido.

Te lo pedimos por Jesucristo, nuestro Señor. Amén.

🙏 Salve, Reina y Madre de misericordia,
vida, dulzura y esperanza nuestra, Salve.
A ti clamamos los desterrados hijos de Eva,
a ti suspiramos, gimiendo y llorando en este valle de lágrimas.
Ea, pues, Señora, abogada nuestra,
vuelve a nosotros esos tus ojos misericordiosos,
y después de este destierro, muéstranos a Jesús,
fruto bendito de tu vientre.
Oh, clemente, oh, piadosa, oh, dulce Virgen María.`
  };
}

/**
 * Obtiene la liturgia completa del día
 * @param {Date} fecha - Fecha para la liturgia
 * @returns {Object} Todos los textos de la Liturgia de las Horas
 */
export function obtenerLiturgiaDelDia(fecha = new Date()) {
  return {
    laudes: obtenerLaudes(fecha),
    visperas: obtenerVisperas(fecha),
    completas: obtenerCompletas(fecha)
  };
}
