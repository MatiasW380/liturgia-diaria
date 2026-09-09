import Link from 'next/link';

export default function Layout({ children }) {
  const opciones = [
    { icono: '📖', nombre: 'Lecturas de hoy', ruta: '/evangelio' },
    { icono: '⛪', nombre: 'Santo del día', ruta: '/santo' },
    { icono: '✝️', nombre: 'Reflexión', ruta: '/reflexion' },
    { icono: '🕯️', nombre: 'Liturgia de las Horas', ruta: '/liturgia-horas' },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 15px' }}>
      {/* Encabezado */}
      <header style={{
        backgroundColor: '#1b1f26',
        border: '1px solid rgba(232, 227, 216, 0.10)',
        color: '#e8e3d8',
        padding: '14px 15px',
        borderRadius: '10px',
        marginTop: '15px',
      }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#e8e3d8' }}>
          <h1 style={{
            fontFamily: "'Lora', Georgia, serif",
            fontWeight: 600,
            fontSize: 'clamp(1.1rem, 4vw, 1.6rem)',
            margin: 0,
            textAlign: 'center',
            cursor: 'pointer'
          }}>
            Cristo en tu día
          </h1>
        </Link>

        {/* Accesos, siempre visibles, sin menú oculto */}
        <nav className="nav-links" style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '12px',
          paddingTop: '12px',
          borderTop: '1px solid rgba(232, 227, 216, 0.10)'
        }}>
          {opciones.map((opcion) => (
            <Link key={opcion.ruta} href={opcion.ruta} style={{ textDecoration: 'none' }}>
              <div className="nav-item" style={{
                padding: '8px 14px',
                backgroundColor: 'rgba(232, 227, 216, 0.04)',
                border: '1px solid rgba(232, 227, 216, 0.10)',
                borderRadius: '20px',
                cursor: 'pointer',
                transition: 'background-color 0.2s, border-color 0.2s',
                touchAction: 'manipulation',
                fontSize: '0.85rem',
                whiteSpace: 'nowrap',
                fontFamily: "'Inter', sans-serif",
                color: '#e8e3d8'
              }}>
                <span style={{ marginRight: '6px' }}>{opcion.icono}</span>{opcion.nombre}
              </div>
            </Link>
          ))}
        </nav>
      </header>

      {/* Contenido principal */}
      <main style={{ marginTop: '20px', paddingBottom: '20px' }}>
        {children}
      </main>

      {/* Pie de página */}
      <footer style={{
        textAlign: 'center',
        marginTop: '40px',
        padding: '20px 0',
        borderTop: '1px solid rgba(232, 227, 216, 0.10)',
        color: '#6b7178',
        fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)'
      }}>
        <p style={{ margin: '3px 0' }}>
          {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </footer>

      <style jsx>{`
        @media (min-width: 768px) {
          header h1 {
            text-align: left !important;
          }
        }
        @media (hover: hover) {
          :global(.nav-item):hover {
            background-color: rgba(201, 164, 76, 0.10) !important;
            border-color: rgba(201, 164, 76, 0.35) !important;
          }
        }
        @media (hover: none) {
          :global(.nav-item):active {
            background-color: rgba(201, 164, 76, 0.15) !important;
          }
        }
      `}</style>
    </div>
  );
}
