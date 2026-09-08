// pages/reflexion.js
import Layout from '../components/Layout';
import { useEffect, useState } from 'react';

async function obtenerReflexion() {
  const res = await fetch('/api/reflexion');
  if (!res.ok) throw new Error('Error al obtener la reflexión del día');
  return res.json();
}

export default function Reflexion() {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const resultado = await obtenerReflexion();
        setDatos(resultado);
        setCargando(false);
      } catch (err) {
        console.error('Error al cargar la reflexión:', err);
        setError(true);
        setCargando(false);
      }
    }
    cargarDatos();
  }, []);

  return (
    <Layout>
      <div className="card card-reflexion">
        <h2 className="card-title">✝️ Reflexión del Día</h2>

        {cargando && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ fontSize: '18px', color: '#666' }}>⏳ Cargando la reflexión de hoy...</p>
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
              ⚠️ No se pudo cargar la reflexión. Por favor, intentá más tarde.
            </p>
          </div>
        )}

        {datos && !cargando && !datos.error && (
          <>
            {datos.seccion && (
              <p style={{ fontSize: '13px', color: '#999', textTransform: 'uppercase', marginBottom: '4px' }}>
                {datos.seccion}
              </p>
            )}

            <h3 style={{ color: '#c0392b', marginTop: 0, marginBottom: '10px' }}>{datos.titulo}</h3>

            {datos.descripcion && (
              <p style={{ fontStyle: 'italic', color: '#555', marginBottom: '10px' }}>
                {datos.descripcion}
              </p>
            )}

            {datos.autor && (
              <p style={{ fontSize: '13px', color: '#888', marginBottom: '20px' }}>{datos.autor}</p>
            )}

            {datos.imagen && (
              <img
                src={datos.imagen}
                alt={datos.titulo}
                style={{ maxWidth: '100%', borderRadius: '8px', marginBottom: '20px' }}
              />
            )}

            <div style={{ lineHeight: '1.8' }}>
              <p style={{ whiteSpace: 'pre-line' }}>{datos.texto}</p>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
