// pages/liturgia-horas.js
import Layout from '../components/Layout';
import Link from 'next/link';

export default function LiturgiaHoras() {
  const opciones = [
    { 
      icono: '🌅', 
      nombre: 'Laudes', 
      descripcion: 'Oración de la mañana',
      ruta: '/laudes', 
      color: '#c9a44c',
    },
    { 
      icono: '🌇', 
      nombre: 'Vísperas', 
      descripcion: 'Oración del atardecer',
      ruta: '/visperas', 
      color: '#c9a44c',
    },
    { 
      icono: '🌙', 
      nombre: 'Completas', 
      descripcion: 'Oración antes de dormir',
      ruta: '/completas', 
      color: '#c9a44c',
    },
  ];

  return (
    <Layout>
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <h1 style={{ 
          color: '#e8e3d8', 
          fontFamily: "'Lora', Georgia, serif",
          fontSize: 'clamp(1.5rem, 5vw, 2.2rem)',
          marginBottom: '5px'
        }}>
          🕯️ Liturgia de las Horas
        </h1>
        <p style={{ color: '#9aa0a8', fontSize: 'clamp(0.9rem, 2.5vw, 1rem)' }}>
          {new Date().toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
          })}
        </p>
        <p style={{ 
          color: '#6b7178', 
          fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
          marginTop: '5px'
        }}>
          Elige el momento del día para orar
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gap: '15px',
        gridTemplateColumns: '1fr'
      }}>
        {opciones.map((opcion) => (
          <Link key={opcion.ruta} href={opcion.ruta}>
            <div style={{
              backgroundColor: '#1b1f26',
              padding: '20px 25px',
              borderRadius: '12px',
              border: '1px solid rgba(232, 227, 216, 0.10)',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              borderLeft: `5px solid ${opcion.color}`,
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              minHeight: '80px',
              touchAction: 'manipulation'
            }}>
              <span style={{ 
                fontSize: 'clamp(2.5rem, 7vw, 3.5rem)', 
                flexShrink: 0 
              }}>
                {opcion.icono}
              </span>
              <div>
                <h3 style={{ 
                  margin: 0, 
                  color: opcion.color, 
                  fontSize: 'clamp(1.1rem, 3.5vw, 1.5rem)'
                }}>
                  {opcion.nombre}
                </h3>
                <p style={{ 
                  margin: '3px 0 0 0', 
                  color: '#9aa0a8', 
                  fontSize: 'clamp(0.8rem, 2vw, 0.95rem)'
                }}>
                  {opcion.descripcion}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#1b1f26',
        border: '1px solid rgba(232, 227, 216, 0.10)',
        borderRadius: '10px',
        textAlign: 'center',
        fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
        color: '#9aa0a8'
      }}>
        ⏰ Según la tradición de la Iglesia, las horas canónicas se rezan en estos momentos del día
      </div>

      <style jsx>{`
        @media (min-width: 600px) {
          div {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (min-width: 1024px) {
          div {
            grid-template-columns: 1fr 1fr 1fr !important;
            gap: 25px !important;
          }
        }
        @media (hover: hover) {
          div div:hover {
            transform: translateY(-4px);
            border-color: rgba(201, 164, 76, 0.35);
          }
        }
        @media (hover: none) {
          div div:active {
            transform: scale(0.97);
          }
        }
      `}</style>
    </Layout>
  );
}
