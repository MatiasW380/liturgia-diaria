// pages/reflexion.js
import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import { Cross, Share2 } from 'lucide-react';
import { compartirTexto } from '../lib/compartir';

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
        <h2 className="card-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}><Cross size={22} color="#c9a44c" strokeWidth={1.5} /> Reflexión del Día</h2>

        {cargando && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ fontSize: '18px', color: '#9aa0a8' }}>⏳ Cargando la reflexión de hoy...</p>
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
              ⚠️ No se pudo cargar la reflexión. Por favor, intentá más tarde.
            </p>
          </div>
        )}

        {datos && !cargando && !datos.error && (
          <>
            <div style={{ lineHeight: '1.8' }}>
              <p style={{ whiteSpace: 'pre-line', textAlign: 'justify' }}>{datos.texto}</p>
            </div>

            {datos.papa && (
              <p style={{
                fontWeight: 'bold',
                textAlign: 'right',
                marginTop: '20px',
                color: '#c9a44c'
              }}>
                {datos.papa}
                {datos.fuenteCita && (
                  <span style={{ display: 'block', fontWeight: 'normal', fontSize: '13px', color: '#9aa0a8' }}>
                    {datos.fuenteCita}
                  </span>
                )}
              </p>
            )}

            <button
              onClick={() => compartirTexto(
                `Reflexión${datos.papa ? ' — ' + datos.papa : ''}`,
                datos.texto
              )}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '15px',
                background: 'none',
                border: '1px solid rgba(201, 164, 76, 0.35)',
                borderRadius: '20px',
                padding: '6px 14px',
                color: '#c9a44c',
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              <Share2 size={15} strokeWidth={1.5} />
              Compartir
            </button>
          </>
        )}
      </div>
    </Layout>
  );
}
