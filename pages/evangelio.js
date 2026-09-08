// pages/evangelio.js
import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
async function obtenerDatosLiturgicos() {
  const res = await fetch('/api/lecturas');
  if (!res.ok) throw new Error('Error al obtener lecturas');
  const datos = await res.json();
  return {
    evangelio: datos.evangelio,
    cita: datos.citaEvangelio,
    traduccion: '',
    fecha: datos.fecha,
    celebracion: datos.celebracion,
    color: '',
  };
}

export default function Evangelio() {
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
        console.error('Error al cargar evangelio:', err);
        setError(true);
        setCargando(false);
      }
    }
    cargarDatos();
  }, []);

  return (
    <Layout>
      <div className="card card-evangelio">
        <h2 className="card-title">📖 Evangelio del Día</h2>
        
        {cargando && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ fontSize: '18px', color: '#666' }}>⏳ Cargando el evangelio de hoy...</p>
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
              ⚠️ No se pudo cargar el evangelio. Por favor, intentá más tarde.
            </p>
          </div>
        )}

        {datos && !cargando && (
          <>
            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '15px 20px', 
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <p style={{ fontStyle: 'italic', color: '#555', margin: 0 }}>
                "{datos.cita}"
              </p>
              {datos.traduccion && (
                <p style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
                  Traducción: {datos.traduccion}
                </p>
              )}
              <p style={{ fontSize: '14px', color: '#888', marginTop: '8px' }}>
                📅 {new Date(datos.fecha).toLocaleDateString('es-ES', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  weekday: 'long'
                })}
              </p>
            </div>

            <div style={{ lineHeight: '1.8' }}>
              <p style={{ whiteSpace: 'pre-line' }}>{datos.evangelio}</p>
            </div>

            {datos.celebracion && (
              <div style={{
                marginTop: '25px',
                padding: '15px',
                backgroundColor: '#e8f4f8',
                borderRadius: '8px',
                borderLeft: '4px solid #8e44ad'
              }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#8e44ad' }}>⛪ Celebración</h4>
                <p style={{ margin: 0, fontSize: '15px' }}>{datos.celebracion}</p>
                {datos.color && (
                  <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#666' }}>
                    Color litúrgico: {datos.color}
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
