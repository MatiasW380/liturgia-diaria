import Layout from '../components/Layout';

export default function Reflexion() {
  return (
    <Layout>
      <div className="card card-reflexion">
        <h2 className="card-title">✝️ Reflexión del Día</h2>
        
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          marginBottom: '20px',
          borderLeft: '4px solid #c0392b'
        }}>
          <p style={{ fontSize: '18px', lineHeight: '1.8', margin: 0 }}>
            "El Evangelio nos invita a abrir el corazón a la Palabra de Dios, 
            que es como una semilla que crece silenciosamente y da fruto en 
            quienes la acogen con fe."
          </p>
          <p style={{ marginTop: '15px', textAlign: 'right', color: '#666' }}>
            — Papa Francisco
          </p>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
          <h4 style={{ color: '#856404', marginTop: 0 }}>Contexto</h4>
          <p>
            Esta reflexión está tomada del Ángelus del Papa Francisco del 
            {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}.
          </p>
          <p style={{ color: '#666', fontSize: '14px' }}>
            📅 {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
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
            ⚠️ Contenido de ejemplo. Próximamente se conectará con datos reales de Vatican News.
          </p>
        </div>
      </div>
    </Layout>
  );
}
