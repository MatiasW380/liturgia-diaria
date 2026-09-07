import Layout from '../components/Layout';
import Link from 'next/link';

export default function Home() {
  const opciones = [
    { icono: '📖', nombre: 'Evangelio del Día', descripcion: 'La Palabra de Dios para hoy', ruta: '/evangelio', color: '#c0392b' },
    { icono: '⛪', nombre: 'Santo del Día', descripcion: 'Conoce al santo que celebramos hoy', ruta: '/santo', color: '#8e44ad' },
    { icono: '✝️', nombre: 'Reflexión del Día', descripcion: 'Comentario del Papa Francisco', ruta: '/reflexion', color: '#856404' },
    { icono: '🌅', nombre: 'Laudes', descripcion: 'Oración de la mañana', ruta: '/laudes', color: '#0c5460' },
    { icono: '🌇', nombre: 'Vísperas', descripcion: 'Oración del atardecer', ruta: '/visperas', color: '#155724' },
    { icono: '🌙', nombre: 'Completas', descripcion: 'Oración antes de dormir', ruta: '/completas', color: '#383d41' },
  ];

  return (
    <Layout>
      <h1 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '10px' }}>
        📖 Liturgia Diaria
      </h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px', fontSize: '18px' }}>
        {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
      </p>

      <div style={{ display: 'grid', gap: '15px' }}>
        {opciones.map((opcion) => (
          <Link key={opcion.ruta} href={opcion.ruta}>
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              borderLeft: `5px solid ${opcion.color}`,
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              <span style={{ fontSize: '40px' }}>{opcion.icono}</span>
              <div>
                <h3 style={{ margin: 0, color: '#2c3e50' }}>{opcion.nombre}</h3>
                <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>{opcion.descripcion}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        @media (min-width: 768px) {
          div {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (min-width: 1024px) {
          div {
            grid-template-columns: 1fr 1fr 1fr;
          }
        }
      `}</style>
    </Layout>
  );
}
