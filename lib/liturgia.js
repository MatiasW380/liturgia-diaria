// Función para obtener el texto completo de Laudes
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
    himno: `"Amanece un nuevo día,\nSeñor, te damos gracias,\npor tu luz y tu vida,\nque nos llenan de esperanza.\n\nTu amor nos sostiene,\ntu paz nos acompaña,\nen este amanecer\nque nos regalas con ternura.\n\nQue nuestras palabras,\nque nuestras acciones,\nsean siempre un reflejo\nde tu bondad y misericordia. Amén."`,
    salmodia: `Salmo 63: "Dios mío, tú eres mi Dios, por ti madrugo,\nmi alma está sedienta de ti; mi carne tiene ansia de ti,\ncomo tierra reseca, agostada, sin agua.\n\nQuiero contemplarte en el santuario,\nviendo tu poder y tu gloria,\nporque tu gracia vale más que la vida,\ny mis labios te alabarán.\n\nToda mi vida te bendeciré,\ny levantaré mis manos en tu nombre.\nComo de enjundia y de grasa queda saciada mi alma,\ny con labios jubilosos te alaba mi boca.\n\nCuando en mi lecho me acuerdo de ti,\nen las vigilias medito en ti,\nporque has sido mi auxilio,\ny a la sombra de tus alas canto con júbilo.\nMi alma está unida a ti,\ny tu diestra me sostiene."`,
    canticos: `Benedictus (Cántico de Zacarías):\n\n"Bendito sea el Señor, Dios de Israel,\nporque ha visitado y redimido a su pueblo,\ny ha suscitado una fuerza de salvación\nen la casa de David, su siervo,\ncomo lo había anunciado desde antiguo\npor boca de sus santos profetas:\n\nque nos salvaría de nuestros enemigos\ny de la mano de todos los que nos odian;\nrealizando la misericordia con nuestros padres,\ny recordando su santa alianza,\n\nel juramento que hizo a nuestro padre Abraham,\nde concedernos que, libres de temor,\narrancados de la mano de nuestros enemigos,\nle sirvamos en santidad y justicia\ndurante toda nuestra vida.\n\nY tú, niño, serás llamado profeta del Altísimo,\nporque irás delante del Señor a preparar sus caminos,\nanunciando a su pueblo la salvación,\nel perdón de sus pecados,\npor la entrañable misericordia de nuestro Dios,\nque hará brillar desde lo alto una luz\nsobre los que habitan en tinieblas y en sombra de muerte,\ny guiará nuestros pasos por el camino de la paz."`,
    oracion: 'Señor, Dios todopoderoso,\nque has traído un nuevo día a nuestras vidas,\nte pedimos que este amanecer sea para nosotros\nun tiempo de gracia y bendición.\n\nGuía nuestros pasos por tus caminos,\nilumina nuestra mente con tu sabiduría,\ny llena nuestro corazón de tu amor.\n\nQue todo lo que hagamos hoy\nsea para tu gloria y para el bien de nuestros hermanos.\n\nTe lo pedimos por Jesucristo, nuestro Señor. Amén.'
  };
}

// Función para obtener el texto completo de Vísperas
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
    himno: `"Ya la luz del día declina,\nSeñor, te damos gracias\npor este día que termina,\ny por tu amor que nos acompaña.\n\nEn tus manos encomendamos\nel trabajo realizado,\nlas alegrías compartidas,\nlas penas y los cansancios.\n\nTe pedimos que esta noche\nsea para nosotros tiempo de descanso,\ny que mañana, al despertar,\npodamos alabarte de nuevo. Amén."`,
    salmodia: `Salmo 141: "Señor, a ti te llamo, date prisa, escúchame,\natiende mi voz cuando te invoco.\nSuba mi oración como incienso a tu presencia,\nmis manos levantadas como ofrenda de la tarde.\n\nPon, Señor, un guardián en mi boca,\nun centinela en el umbral de mis labios.\nNo dejes que mi corazón se incline al mal,\nque cometa acciones perversas con los malhechores.\n\nQue el justo me corrija, será un favor,\nque me reprenda, será un bálsamo para mi cabeza;\nno la rechace mi cabeza,\npues mi oración los condena.\n\nA ti, Señor, mi Dios, están mis ojos,\nme refugio en ti, no me dejes desamparado.\nLíbrame de la red que me han tendido,\nde los lazos de los malhechores.\nQue caigan en sus propias redes los impíos,\nmientras yo paso de largo."`,
    canticos: `Magníficat (Cántico de María):\n\n"Proclama mi alma la grandeza del Señor,\nse alegra mi espíritu en Dios mi salvador,\nporque ha mirado la humildad de su esclava.\nDesde ahora me felicitarán todas las generaciones,\nporque el Poderoso ha hecho en mí obras grandes,\nsanto es su nombre,\ny su misericordia llega a sus fieles\nde generación en generación.\n\nÉl hace proezas con su brazo:\ndispersa a los soberbios de corazón,\nderriba del trono a los poderosos\ny enaltece a los humildes,\na los hambrientos los colma de bienes\ny a los ricos los despide vacíos.\n\nAuxilia a Israel, su siervo,\nrecordando su misericordia,\ncomo lo había prometido a nuestros padres,\nen favor de Abraham y de su descendencia por siempre."`,
    oracion: 'Señor, Dios de la Alianza,\nal llegar la tarde te damos gracias\npor todas las bendiciones de este día.\n\nPerdona nuestras faltas,\nsana nuestras heridas,\ny concédenos un descanso reparador.\n\nQue tu paz que sobrepasa todo entendimiento\nllene nuestros corazones y nuestros hogares.\n\nPor Jesucristo, nuestro Señor. Amén.'
  };
}

// Función para obtener el texto completo de Completas
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
    examen: `"Antes de dormir, hagamos un breve examen de conciencia:\n\n• ¿Dónde estuve hoy?\n• ¿Qué hice?\n• ¿Qué sentí?\n• ¿Dónde estaba Dios en mi día?\n• ¿A quién amé?\n• ¿A quién pude haber amado más?\n\nDamos gracias por lo bueno,\npedimos perdón por lo que no estuvo bien,\ny nos encomendamos a la misericordia de Dios."`,
    himno: `"Al llegar la noche, Señor,\nte damos gracias por tu protección.\nEn tus manos encomendamos nuestra vida,\nconfiando en tu amor sin medida.\n\nCustodia nuestro descanso,\naleja de nosotros todo mal,\ny que al despertar mañana\npodamos alabarte de nuevo.\n\nBendice a quienes nos rodean,\ncuidá de los que sufren,\ny concedé a los difuntos la luz eterna.\nAmén."`,
    salmodia: `Salmo 91: "El que habita al amparo del Altísimo,\nse acoge a la sombra del Omnipotente.\nDiré al Señor: 'Tú eres mi refugio, mi alcázar,\nmi Dios, en quien confío'.\n\nÉl te librará de la red del cazador,\nde la peste funesta.\nCon sus plumas te cubrirá,\nbajo sus alas te refugiarás,\nsu fidelidad será tu escudo y tu armadura.\n\nNo temerás el terror de la noche,\nni la flecha que vuela de día,\nni la peste que se desliza en las tinieblas,\nni la epidemia que devasta a pleno sol.\n\nCaerán a tu izquierda mil,\ndiez mil a tu derecha,\npero a ti no te alcanzará.\nCon tus ojos verás la recompensa de los impíos.\n\nPorque has hecho del Señor tu refugio,\nal Altísimo como tu defensa,\nno te sobrevendrá el mal,\nni la plaga tocará tu tienda.\n\nPorque a sus ángeles ha dado órdenes acerca de ti,\npara que te guarden en todos tus caminos.\nTe llevarán en sus manos,\npara que tu pie no tropiece en piedra.\n\nPisotees al león y a la víbora,\npisarás al cachorro de león y a la serpiente.\n\nPorque a mí se ha acogido, lo libraré,\nlo protegeré porque ha conocido mi nombre.\nMe invocará y le responderé,\nestaré con él en la desgracia,\nlo libraré y lo glorificaré.\n\nLo saciaré de larga vida,\ny le haré ver mi salvación."`,
    canticos: `Nunc Dimittis (Cántico de Simeón):\n\n"Ahora, Señor, según tu promesa,\npuedes dejar a tu siervo irse en paz,\nporque mis ojos han visto tu salvación,\nla que has preparado a la vista de todos los pueblos,\nluz para iluminar a las naciones\ny gloria de tu pueblo Israel."`,
    oracion: 'Señor, Dios de amor y misericordia,\nal terminar este día encomendamos nuestra vida en tus manos.\n\nProtégenos durante la noche,\nconcede a los que descansan en paz su sueño,\ny a los que velan la fortaleza de tu presencia.\n\nQue tu ángel nos custodie,\nque tu paz nos envuelva,\ny que al despertar mañana,\npodamos alabarte con un corazón agradecido.\n\nTe lo pedimos por Jesucristo, nuestro Señor. Amén.\n\n🙏 Salve, Reina y Madre de misericordia,\nvida, dulzura y esperanza nuestra, Salve.\nA ti clamamos los desterrados hijos de Eva,\na ti suspiramos, gimiendo y llorando en este valle de lágrimas.\nEa, pues, Señora, abogada nuestra,\nvuelve a nosotros esos tus ojos misericordiosos,\ny después de este destierro, muéstranos a Jesús,\nfruto bendito de tu vientre.\nOh, clemente, oh, piadosa, oh, dulce Virgen María.'
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
