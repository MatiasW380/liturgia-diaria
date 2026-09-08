import Layout from '../components/Layout';
import Link from 'next/link';

export default function Home() {
  const opciones = [
    { 
      icono: '📖', 
      nombre: 'Evangelio del Día', 
      descripcion: 'La Palabra de Dios para hoy', 
      ruta: '/evangelio', 
      color: '#c0392b' 
    },
    { 
      icono: '⛪', 
      nombre: 'Santo del Día', 
      descripcion: 'Conoce al santo que celebramos hoy', 
      ruta: '/santo', 
      color: '#8e44ad' 
    },
    { 
      icono: '✝️', 
      nombre: 'Reflexión del Día', 
      descripcion: 'Comentario del Papa Francisco', 
      ruta: '/reflexion', 
      color: '#856404' 
    },
    { 
      icono: '🕯️', 
      nombre: 'Liturgia de las Horas', 
      descripcion: 'Laudes • Vísperas • Completas', 
      ruta: '/liturgia-horas', 
      color: '#2c3e50' 
    },
  ];

  return (
    <Layout>
      <h1 style={{ 
        textAlign: 'center', 
        color: '#2c3e50', 
        marginBottom: '5px',
        fontSize: 'clamp(1.5rem, 5vw, 2.5rem)'
      }}>
        📖 Liturgia Diaria
      </h1>
      <p style={{ 
        textAlign: 'center', 
        color: '#666', 
        marginBottom: '25px', 
        fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)'
      }}>
        {new Date().toLocaleDateString('es-ES', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric', 
          weekday: 'long' 
        })}
      </p>

      <div style={{ 
        display: 'grid', 
        gap: '12px',
        gridTemplateColumns: '1fr'
      }}>
        {opciones.map((opcion) => (
          <Link key={opcion.ruta} href={opcion.ruta}>
            <div style={{
              backgroundColor: 'white',
              padding: '16px 20px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              borderLeft: `5px solid ${opcion.color}`,
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              minHeight: '70px',
              touchAction: 'manipulation'
            }}>
              <span style={{ fontSize: 'clamp(2rem, 6vw, 2.8rem)', flexShrink: 0 }}>{opcion.icono}</span>
              <div>
                <h3 style={{ 
                  margin: 0, 
                  color: '#2c3e50', 
                  fontSize: 'clamp(1rem, 3vw, 1.3rem)'
                }}>
                  {opcion.nombre}
                </h3>
                <p style={{ 
                  margin: '3px 0 0 0', 
                  color: '#666', 
                  fontSize: 'clamp(0.75rem, 2vw, 0.9rem)'
                }}>
                  {opcion.descripcion}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        @media (min-width: 600px) {
          div {
            grid-template-columns: 1fr 1fr !important;
            gap: 15px !important;
          }
        }
        @media (min-width: 1024px) {
          div {
            grid-template-columns: 1fr 1fr 1fr 1fr !important;
            gap: 20px !important;
          }
        }
        /* Efecto hover solo en escritorio */
        @media (hover: hover) {
          div div:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.12);
          }
        }
        /* Efecto active para táctil */
        @media (hover: none) {
          div div:active {
            transform: scale(0.97);
            background-color: #f0f0f0;
          }
        }
      `}</style>
    </Layout>
  );
}
