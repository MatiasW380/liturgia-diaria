import Link from 'next/link';
import { useState } from 'react';

export default function Layout({ children }) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const opciones = [
    { icono: '📖', nombre: 'Evangelio', ruta: '/evangelio' },
    { icono: '⛪', nombre: 'Santo del Día', ruta: '/santo' },
    { icono: '✝️', nombre: 'Reflexión', ruta: '/reflexion' },
    { icono: '🌅', nombre: 'Laudes', ruta: '/laudes' },
    { icono: '🌇', nombre: 'Vísperas', ruta: '/visperas' },
    { icono: '🌙', nombre: 'Completas', ruta: '/completas' },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
      {/* Encabezado con menú */}
      <header style={{
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '15px 20px',
        borderRadius: '10px',
        marginTop: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '24px', margin: 0 }}>
            📖 Liturgia Diaria
          </h1>
          
          {/* Botón menú hamburguesa (móvil) */}
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '30px',
              cursor: 'pointer',
              display: 'block'
            }}
          >
            ☰
          </button>
        </div>

        {/* Menú de navegación */}
        <nav style={{
          display: menuAbierto ? 'block' : 'none',
          marginTop: '15px'
        }}>
          {opciones.map((opcion) => (
            <Link key={opcion.ruta} href={opcion.ruta}>
              <div style={{
                padding: '12px 15px',
                margin: '5px 0',
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}>
                {opcion.icono} {opcion.nombre}
              </div>
            </Link>
          ))}
        </nav>
      </header>

      {/* Contenido principal */}
      <main style={{ marginTop: '30px' }}>
        {children}
      </main>

      {/* Pie de página */}
      <footer style={{
        textAlign: 'center',
        marginTop: '50px',
        padding: '20px',
        borderTop: '2px solid #e0e0e0',
        color: '#666',
        fontSize: '14px'
      }}>
        <p>📅 {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <p>Uso personal - Basado en Vatican News y breviarium</p>
      </footer>

      {/* Estilos responsive (CSS embebido) */}
      <style jsx>{`
        @media (min-width: 768px) {
          header {
            padding: 15px 30px;
          }
          button {
            display: none !important;
          }
          nav {
            display: flex !important;
            gap: 10px;
            margin-top: 10px !important;
          }
          nav div {
            flex: 1;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
