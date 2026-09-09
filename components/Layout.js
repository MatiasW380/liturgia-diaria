import Link from 'next/link';
import { useState } from 'react';

export default function Layout({ children, mostrarHeader = true }) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const opcionesMenu = [
    { icono: '📖', nombre: 'Evangelio', ruta: '/evangelio' },
    { icono: '⛪', nombre: 'Santo', ruta: '/santo' },
    { icono: '✝️', nombre: 'Reflexión', ruta: '/reflexion' },
    { icono: '🕯️', nombre: 'Liturgia', ruta: '/liturgia-horas' },
  ];

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '0 20px 20px 20px',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* HEADER CONDICIONAL - Solo se muestra si mostrarHeader es true */}
      {mostrarHeader && (
        <header style={{
          backgroundColor: '#14171c',
          borderBottom: '1px solid rgba(201, 164, 76, 0.15)',
          padding: '12px 0',
          marginBottom: '20px',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
          }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <span style={{ 
                fontFamily: "'Lora', Georgia, serif", 
                fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                fontWeight: 600,
                color: '#c9a44c',
                letterSpacing: '0.02em'
              }}>
                ✠ Cristo en tu día
              </span>
            </Link>
            
            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              style={{
                background: 'none',
                border: 'none',
                color: '#e8e3d8',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '5px 10px',
                touchAction: 'manipulation',
                display: 'block'
              }}
              aria-label="Menú"
            >
              ☰
            </button>
          </div>

          <nav style={{
            display: menuAbierto ? 'block' : 'none',
            marginTop: '12px',
            paddingTop: '12px',
            borderTop: '1px solid rgba(232, 227, 216, 0.08)'
          }}>
            {opcionesMenu.map((opcion) => (
              <Link key={opcion.ruta} href={opcion.ruta}>
                <div style={{
                  padding: '10px 12px',
                  margin: '4px 0',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  touchAction: 'manipulation',
                  fontSize: 'clamp(0.9rem, 1.2vw, 1rem)',
                  color: '#e8e3d8',
                  fontFamily: "'Inter', Arial, sans-serif"
                }}>
                  {opcion.icono} {opcion.nombre}
                </div>
              </Link>
            ))}
          </nav>

          <style jsx>{`
            @media (min-width: 768px) {
              button {
                display: none !important;
              }
              nav {
                display: flex !important;
                gap: 8px !important;
                margin-top: 10px !important;
                padding-top: 10px !important;
                border-top: 1px solid rgba(255,255,255,0.08) !important;
              }
              nav div {
                flex: 1;
                text-align: center;
                padding: 8px 5px !important;
                margin: 0 !important;
              }
              @media (hover: hover) {
                nav div:hover {
                  background-color: rgba(255,255,255,0.1) !important;
                }
              }
            }
          `}</style>
        </header>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ flex: 1, paddingTop: mostrarHeader ? '0' : '20px' }}>
        {children}
      </main>

      {/* FOOTER (siempre visible) */}
      <footer style={{
        textAlign: 'center',
        marginTop: '50px',
        padding: '20px 0',
        borderTop: '1px solid rgba(201, 164, 76, 0.15)',
        color: '#9aa0a8',
        fontSize: 'clamp(0.7rem, 1.2vw, 0.8rem)',
        fontFamily: "'Inter', Arial, sans-serif"
      }}>
        <p style={{ margin: '3px 0' }}>
          ✠ Cristo en tu día — Uso personal
        </p>
      </footer>
    </div>
  );
}
