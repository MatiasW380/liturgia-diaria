// pages/santo.js
import Layout from '../components/Layout';
import { useEffect, useState } from 'react';

async function obtenerSantos() {
  const res = await fetch('/api/santo');
  if (!res.ok) throw new Error('Error al obtener el santo del día');
  return res.json();
}

export default function Santo() {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [expandidos, setExpandidos] = useState({});

  useEffect(() => {
    async function cargarDatos() {
      try {
        const resultado = await obtenerSantos();
        setDatos(resultado);
        setCargando(false);
      } catch (err) {
        console.error('Error al cargar el santo del día:', err);
        setError(true);
        setCargando(false);
      }
    }
    cargarDatos();
  }, []);

  const toggle = (i) => setExpandidos((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <Layout>
      <div className="card card-santo">
        <h2 className="card-title">⛪ Santo del Día</h2>

        {cargando && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ fontSize: '18px', color: '#9aa0a8' }}>⏳ Cargando el santoral de hoy...</p>
          </div>
        )}

        {(error || (datos && datos.error)) && (
          <div style={{
            backgroundColor: 'rgba(162, 68, 68, 0.15)',
            padding: '20px',
            borderRadius: '8px',
            borderLeft: '3px solid #a24444'
          }}>
            <p style={{ margin: 0, color: '#e8e3d8' }}>
              ⚠️ No se pudo cargar el santoral. Por favor, intentá más tarde.
            </p>
          </div>
        )}

        {datos && !cargando && !datos.error && datos.santos.length === 0 && (
          <p style={{ color: '#9aa0a8' }}>No hay información del santoral para hoy.</p>
        )}

        {datos && !cargando && datos.santos.map((santo, i) => (
          <div key={i} style={{
            marginBottom: '25px',
            paddingBottom: '25px',
            borderBottom: i < datos.santos.length - 1 ? '1px solid rgba(232, 227, 216, 0.10)' : 'none',
          }}>
            <h3 style={{ color: '#c9a44c', fontFamily: "'Lora', Georgia, serif", marginBottom: '10px' }}>{santo.titulo}</h3>
            {santo.imagen && (
              <img
                src={santo.imagen}
                alt={santo.titulo}
                style={{ maxWidth: '100%', borderRadius: '8px', marginBottom: '15px' }}
              />
            )}
            <p
              className={`bio-texto ${expandidos[i] ? 'expandido' : ''}`}
              style={{ whiteSpace: 'pre-line', lineHeight: '1.8', textAlign: 'justify' }}
            >
              {santo.biografia}
            </p>
            <button
              onClick={() => toggle(i)}
              className="boton-leer-mas"
              style={{
                background: 'none',
                border: 'none',
                color: '#c9a44c',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                padding: '8px 0 0 0',
                display: 'none',
              }}
            >
              {expandidos[i] ? 'Leer menos ▲' : 'Leer más ▼'}
            </button>
          </div>
        ))}
      </div>

      <style jsx>{`
        @media (max-width: 767px) {
          .bio-texto:not(.expandido) {
            display: -webkit-box;
            -webkit-line-clamp: 6;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .boton-leer-mas {
            display: block !important;
          }
        }
      `}</style>
    </Layout>
  );
}
