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

  return (
    <Layout>
      <div className="card card-santo">
        <h2 className="card-title">⛪ Santo del Día</h2>

        {cargando && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ fontSize: '18px', color: '#666' }}>⏳ Cargando el santoral de hoy...</p>
          </div>
        )}

        {(error || (datos && datos.error)) && (
          <div style={{
            backgroundColor: '#f8d7da',
            padding: '20px',
            borderRadius: '8px',
            borderLeft: '4px solid #dc3545'
          }}>
            <p style={{ margin: 0, color: '#721c24' }}>
              ⚠️ No se pudo cargar el santoral. Por favor, intentá más tarde.
            </p>
          </div>
        )}

        {datos && !cargando && !datos.error && datos.santos.length === 0 && (
          <p style={{ color: '#666' }}>No hay información del santoral para hoy.</p>
        )}

        {datos && !cargando && datos.santos.map((santo, i) => (
          <div key={i} style={{
            marginBottom: '25px',
            paddingBottom: '25px',
            borderBottom: i < datos.santos.length - 1 ? '1px solid #eee' : 'none',
          }}>
            <h3 style={{ color: '#8e44ad', marginBottom: '10px' }}>{santo.titulo}</h3>
            {santo.imagen && (
              <img
                src={santo.imagen}
                alt={santo.titulo}
                style={{ maxWidth: '100%', borderRadius: '8px', marginBottom: '15px' }}
              />
            )}
            <p style={{ whiteSpace: 'pre-line', lineHeight: '1.8' }}>{santo.biografia}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}
