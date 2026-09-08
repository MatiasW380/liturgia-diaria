import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import { obtenerDatosVatican } from '../lib/scraping';

export default function Santo() {
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
              <p style={{ color: '#666', margin: '5px 0 0 0', fontSize: '14px' }}>
                📅 {new Date(datos.fecha).toLocaleDateString('es-ES', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>

            <div style={{ lineHeight: '1.8' }}>
              <p>
                El santoral de hoy nos invita a recordar la vida y obra de los santos que la Iglesia celebra en esta fecha.
                Ellos son modelos de fe y ejemplos de vida cristiana.
              </p>
              <p style={{ marginTop: '15px' }}>
                Te invitamos a conocer más sobre la vida de estos santos a través de las fuentes oficiales de la Iglesia.
              </p>
            </div>

            <div style={{ 
              marginTop: '25px', 
              padding: '15px', 
              backgroundColor: '#fff3cd',
              borderRadius: '8px',
              borderLeft: '4px solid #856404'
            }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#856404' }}>
                📖 Para más información, consultá el Martirologio Romano o las biografías oficiales.
              </p>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
