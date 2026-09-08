import Link from 'next/link';
import { useState } from 'react';

export default function Layout({ children }) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const opciones = [
    { icono: '📖', nombre: 'Evangelio', ruta: '/evangelio' },
    { icono: '⛪', nombre: 'Santo', ruta: '/santo' },
    { icono: '✝️', nombre: 'Reflexión', ruta: '/reflexion' },
    { icono: '🕯️', nombre: 'Liturgia', ruta: '/liturgia-horas' },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 15px' }}>
      {/* Encabezado con menú */}
      <header style={{
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '12px 15px',
        borderRadius: '10px',
        marginTop: '15px',
        position: 'relative'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'white' }}>
            <h1 style={{ 
              fontSize: 'clamp(1.1rem, 4vw, 1.6rem)', 
              margin: 0,
              cursor: 'pointer'
            }}>
              📖 Liturgia Diaria
            </h1>
          </Link>
          
          {/* Botón menú hamburguesa (móvil) */}
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: 'clamp(1.5rem, 5vw, 2rem)',
              cursor: 'pointer',
              padding: '5px 10px',
              touchAction: 'manipulation'
            }}
            aria-label="Menú"
          >
            ☰
          </button>
        </div>

        {/* Menú de navegación */}
        <nav style={{
          display: menuAbierto ? 'block' : 'none',
          marginTop: '12px',
          paddingTop: '12px',
          borderTop: '1px solid rgba(255,255,255,0.15)'
        }}>
          {opciones.map((opcion) => (
            <Link key={opcion.ruta} href={opcion.ruta}>
              <div style={{
                padding: '12px 15px',
                margin: '4px 0',
                backgroundColor: 'rgba(255,255,255,0.08)',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                touchAction: 'manipulation',
                fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)'
              }}>
                {opcion.icono} {opcion.nombre}
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
        borderTop: '2px solid #e0e0e0',
        color: '#888',
        fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)'
      }}>
        <p style={{ margin: '3px 0' }}>
          📅 {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <p style={{ margin: '3px 0' }}>
          Uso personal • Basado en Vatican News y breviarium
        </p>
      </footer>

      {/* Estilos responsive */}
      <style jsx>{`
        @media (min-width: 768px) {
          header {
            padding: 15px 25px !important;
          }
          button {
            display: none !important;
          }
          nav {
            display: flex !important;
            gap: 8px !important;
            margin-top: 10px !important;
            padding-top: 10px !important;
            border-top: 1px solid rgba(255,255,255,0.15) !important;
          }
          nav div {
            flex: 1;
            text-align: center;
            padding: 10px 5px !important;
            margin: 0 !important;
          }
        }
        @media (min-width: 1024px) {
          header {
            padding: 18px 30px !important;
          }
          nav {
            gap: 12px !important;
          }
        }
        @media (hover: hover) {
          nav div:hover {
            background-color: rgba(255,255,255,0.2) !important;
          }
        }
        @media (hover: none) {
          nav div:active {
            background-color: rgba(255,255,255,0.25) !important;
          }
        }
      `}</style>
    </div>
  );
}
