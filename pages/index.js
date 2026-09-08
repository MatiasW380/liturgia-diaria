import Layout from '../components/Layout';
import Link from 'next/link';

export default function Home() {
  const opciones = [
    {
      icono: '📖',
      nombre: 'Lecturas de Hoy',
      descripcion: 'La Palabra de Dios para hoy',
      ruta: '/evangelio',
    },
    {
      icono: '⛪',
      nombre: 'Santo del Día',
      descripcion: 'Conoce al santo que celebramos hoy',
      ruta: '/santo',
    },
    {
      icono: '✝️',
      nombre: 'Reflexión',
      descripcion: 'Comentario del Papa',
      ruta: '/reflexion',
    },
    {
      icono: '🕯️',
      nombre: 'Liturgia de las Horas',
      descripcion: 'Laudes • Vísperas • Completas',
      ruta: '/liturgia-horas',
    },
  ];

  return (
    <Layout>
      <h1 style={{
        fontFamily: "'Lora', Georgia, serif",
        textAlign: 'center',
        color: '#e8e3d8',
        marginBottom: '5px',
        fontSize: 'clamp(1.5rem, 5vw, 2.5rem)'
      }}>
        Cristo en tu día
      </h1>
      <p style={{
        textAlign: 'center',
        color: '#9aa0a8',
        marginBottom: '30px',
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
        gap: '1px',
        gridTemplateColumns: '1fr',
        backgroundColor: 'rgba(232, 227, 216, 0.10)',
        border: '1px solid rgba(232, 227, 216, 0.10)',
        borderRadius: '10px',
        overflow: 'hidden'
      }}>
        {opciones.map((opcion) => (
          <Link key={opcion.ruta} href={opcion.ruta}>
            <div style={{
              backgroundColor: '#1b1f26',
              padding: '18px 20px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
              minHeight: '68px',
              touchAction: 'manipulation'
            }}>
              <span style={{ fontSize: 'clamp(1.5rem, 5vw, 1.9rem)', flexShrink: 0 }}>{opcion.icono}</span>
              <div>
                <h3 style={{
                  fontFamily: "'Lora', Georgia, serif",
                  margin: 0,
                  color: '#e8e3d8',
                  fontSize: 'clamp(1rem, 3vw, 1.2rem)',
                  fontWeight: 600
                }}>
                  {opcion.nombre}
                </h3>
                <p style={{
                  margin: '3px 0 0 0',
                  color: '#9aa0a8',
                  fontSize: 'clamp(0.75rem, 2vw, 0.88rem)'
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
          }
        }
        @media (min-width: 1024px) {
          div {
            grid-template-columns: 1fr 1fr 1fr 1fr !important;
          }
        }
        @media (hover: hover) {
          div div:hover {
            background-color: #21262e !important;
          }
        }
        @media (hover: none) {
          div div:active {
            background-color: #21262e !important;
          }
        }
      `}</style>
    </Layout>
  );
}
