import Layout from '../components/Layout';

export default function Evangelio() {
  return (
    <Layout>
      <div className="card card-evangelio">
        <h2 className="card-title">📖 Evangelio del Día</h2>
        
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <p style={{ fontStyle: 'italic', color: '#666' }}>
            "El que tenga oídos para oír, que oiga" (Mateo 13, 9)
          </p>
        </div>

        <div style={{ lineHeight: '1.8' }}>
          <p><strong>Evangelio según San Mateo 13, 1-9</strong></p>
          <p style={{ marginTop: '15px' }}>
            Aquel día, Jesús salió de casa y se sentó junto al mar. 
            Y acudió a él tanta gente que tuvo que subirse a una barca; 
            se sentó, y toda la gente se quedó en la orilla. 
            Jesús les habló mucho rato en parábolas...
          </p>
          <p style={{ marginTop: '15px', color: '#666', fontSize: '14px' }}>
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
