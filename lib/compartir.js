// lib/compartir.js
// Comparte texto plano (no un link) usando la función nativa del celular
// (Web Share API), que abre WhatsApp/Mensajes/etc. con el texto ya cargado.
// Si el navegador no la soporta (la mayoría de las PC), copia al portapapeles.

export async function compartirTexto(titulo, cuerpo) {
  const texto = cuerpo ? `${titulo}\n\n${cuerpo}` : titulo;

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ text: texto });
      return;
    } catch (error) {
      if (error.name === 'AbortError') return; // el usuario cerró el diálogo, no hacer nada
      // si falla por otra razón, seguimos al respaldo de abajo
    }
  }

  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(texto);
      alert('Texto copiado. Pegalo donde quieras compartirlo.');
      return;
    } catch (error) {
      // seguimos al último respaldo
    }
  }

  // Último respaldo: abrir WhatsApp Web con el texto precargado
  window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
}
