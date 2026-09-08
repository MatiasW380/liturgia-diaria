import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import { obtenerDatosVatican } from '../lib/scraping';

export default function Reflexion() {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const datosVatican = await obtenerDatosVatican();
        setDatos(datosVatican);
        setCargando(false);
      } catch (err) {
        console.error('Error al cargar reflexión:', err);
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

        {error && (
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

        {datos && !cargando && (
          <>
            <div style={{ 
              backgroundColor: 'white', 
              padding: '25px', 
              borderRadius: '8px',
              marginBottom: '20px',
              borderLeft: '4px solid #c0392b'
            }}>
              <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', lineHeight: '1.8', margin: 0 }}>
                {datos.reflexion}
              </p>
            </div>

            <div style={{ 
              backgroundColor: 'white', 
              padding: '20px', 
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <h4 style={{ color: '#856404', marginTop: 0 }}>📅 Fecha</h4>
              <p>{new Date(datos.fecha).toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
              })}</p>
            </div>

            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '15px', 
              borderRadius: '8px',
              borderLeft: '4px solid #888'
            }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                💡 Reflexión tomada de Vatican News - Comentario del Papa Francisco
              </p>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
