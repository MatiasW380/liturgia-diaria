import { useEffect, useState } from 'react';

export default function Home() {
  const [evangelio, setEvangelio] = useState('Cargando evangelio...');
  const [comentario, setComentario] = useState('Cargando comentario...');
  const [laudes, setLaudes] = useState('Cargando Laudes...');
  const [visperas, setVisperas] = useState('Cargando Vísperas...');
  const [completas, setCompletas] = useState('Cargando Completas...');

  useEffect(() => {
    // Por ahora mostramos datos de ejemplo
    setEvangelio('📖 "El que tenga oídos para oír, que oiga" (Mateo 13, 9)');
    setComentario('✝️ "El Evangelio nos invita a abrir el corazón a la Palabra de Dios" - Papa Francisco');
    setLaudes('🌅 Oración de la mañana: "Señor, te alabo por este nuevo día..."');
    setVisperas('🌇 Oración de la tarde: "Gracias, Señor, por tu fidelidad..."');
    setCompletas('🌙 Oración de la noche: "En tus manos, Señor, encomiendo mi espíritu..."');
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial' }}>
      <h1 style={{ color: '#1a1a1a', borderBottom: '3px solid #c0392b', paddingBottom: '10px' }}>
        📖 Liturgia del Día
      </h1>
      
      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '10px', margin: '20px 0' }}>
        <h2 style={{ color: '#c0392b' }}>📖 Evangelio</h2>
        <p style={{ fontSize: '18px', lineHeight: '1.6' }}>{evangelio}</p>
      </div>

      <div style={{ background: '#fff3cd', padding: '20px', borderRadius: '10px', margin: '20px 0' }}>
        <h2 style={{ color: '#856404' }}>✝️ Comentario del Papa</h2>
        <p style={{ fontSize: '16px', lineHeight: '1.6' }}>{comentario}</p>
      </div>

      <div style={{ background: '#d1ecf1', padding: '20px', borderRadius: '10px', margin: '20px 0' }}>
        <h2 style={{ color: '#0c5460' }}>🌅 Laudes (Mañana)</h2>
        <p>{laudes}</p>
      </div>

      <div style={{ background: '#d4edda', padding: '20px', borderRadius: '10px', margin: '20px 0' }}>
        <h2 style={{ color: '#155724' }}>🌇 Vísperas (Tarde)</h2>
        <p>{visperas}</p>
      </div>

      <div style={{ background: '#e2e3e5', padding: '20px', borderRadius: '10px', margin: '20px 0' }}>
        <h2 style={{ color: '#383d41' }}>🌙 Completas (Noche)</h2>
        <p>{completas}</p>
      </div>

      <footer style={{ textAlign: 'center', marginTop: '40px', color: '#666', fontSize: '14px' }}>
        📅 {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
      </footer>
    </div>
  );
}
