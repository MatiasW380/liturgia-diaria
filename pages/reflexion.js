// pages/reflexion.js
import Layout from '../components/Layout';

export default function Reflexion() {
  return (
    <Layout>
      <div className="card card-reflexion">
        <h2 className="card-title">✝️ Reflexión del Día</h2>
        
        <div style={{ 
          backgroundColor: 'white', 
          padding: '25px', 
          borderRadius: '8px',
          marginBottom: '20px',
          borderLeft: '4px solid #c0392b',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', lineHeight: '1.8', margin: 0, color: '#666' }}>
            "La reflexión del día estará disponible próximamente."
          </p>
          <p style={{ marginTop: '15px', fontSize: '14px', color: '#999' }}>
            📅 {new Date().toLocaleDateString('es-ES', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              weekday: 'long'
            })}
          </p>
        </div>

        <div style={{ 
          padding: '15px', 
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          textAlign: 'center',
          fontSize: '14px',
          color: '#666'
        }}>
          💡 Próximamente integraremos la reflexión del Papa Francisco
        </div>

        <div style={{ 
          marginTop: '25px', 
          padding: '15px', 
          backgroundColor: '#fff3cd',
          borderRadius: '8px',
          borderLeft: '4px solid #856404'
        }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#856404' }}>
            ⚠️ Sección en desarrollo. Próximamente disponible.
          </p>
        </div>
      </div>
    </Layout>
  );
}
