// pages/santo.js
import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
async function obtenerDatosLiturgicos() {
  const res = await fetch('/api/lecturas');
  if (!res.ok) throw new Error('Error al obtener lecturas');
  const datos = await res.json();
  return {
    santo: datos.celebracion,
    celebracion: '',
    color: '',
    fecha: datos.fecha,
  };
}

export default function Santo() {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const datosLiturgicos = await obtenerDatosLiturgicos();
        setDatos(datosLiturgicos);
        setCargando(false);
      } catch (err) {
        console.error('Error al cargar santo:', err);
        setError(true);
        setCargando(false);
      }
    }
    cargarDatos();
  }, []);

  return (
    <Layout>
      <div className="card">
        <h2 className="card-title" style={{ color: '#8e44ad', borderBottomColor: '#8e44ad' }}>
          ⛪ Santo del Día
        </h2>
        
        {cargando && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ fontSize: '18px', color: '#666' }}>⏳ Cargando el santo de hoy...</p>
          </div>
        )}

        {error && (
          <div style={{ 
            backgroundColor: '#f8d7da', 
            padding: '20px', 
            borderRadius: '8px',
            borderLeft: '4px solid #dc3545'
          }}>
            <p style={{ margin: 0, color: '#721c24' }}>
              ⚠️ No se pudo cargar el santo del día. Por favor, intentá más tarde.
            </p>
          </div>
        )}

        {datos && !cargando && (
          <>
            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '20px', 
              borderRadius: '8px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#8e44ad', margin: 0, fontSize: 'clamp(1.2rem, 3vw, 1.8rem)' }}>
                {datos.santo}
              </h3>
              <p style={{ color: '#666', margin: '8px 0 0 0', fontSize: '14px' }}>
                📅 {new Date(datos.fecha).toLocaleDateString('es-ES', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>

            {datos.celebracion && (
              <div style={{
                padding: '15px',
                backgroundColor: '#f0e6ff',
                borderRadius: '8px',
                marginBottom: '20px',
                borderLeft: '4px solid #8e44ad'
              }}>
                <h4 style={{ margin: '0 0 5px 0', color: '#6c3483', fontSize: '14px' }}>Celebración</h4>
                <p style={{ margin: 0 }}>{datos.celebracion}</p>
              </div>
            )}

            <div style={{ lineHeight: '1.8' }}>
              <p>
                El santoral de hoy nos invita a recordar la vida y obra de los santos que la Iglesia celebra en esta fecha.
                Ellos son modelos de fe y ejemplos de vida cristiana que nos inspiran en nuestro caminar diario.
              </p>
              <p style={{ marginTop: '15px' }}>
                Te invitamos a conocer más sobre la vida de estos santos a través de las fuentes oficiales de la Iglesia.
              </p>
            </div>

            {datos.color && (
              <div style={{
                marginTop: '25px',
                padding: '12px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                textAlign: 'center',
                fontSize: '14px',
                color: '#666'
              }}>
                🎨 Color litúrgico: <strong>{datos.color}</strong>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
