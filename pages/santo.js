import Layout from '../components/Layout';

export default function Santo() {
  return (
    <Layout>
      <div className="card">
        <h2 className="card-title" style={{ color: '#8e44ad', borderBottomColor: '#8e44ad' }}>
          ⛪ Santo del Día
        </h2>
        
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '8px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#8e44ad', margin: 0 }}>San Pedro Claver</h3>
          <p style={{ color: '#666', margin: '5px 0' }}>9 de septiembre</p>
        </div>

        <div style={{ lineHeight: '1.8' }}>
          <p>
            San Pedro Claver (1581-1654) fue un sacerdote jesuita español conocido como 
            "el esclavo de los esclavos" por su dedicación a los africanos esclavizados 
            que llegaban a Cartagena de Indias (Colombia).
          </p>
          <p style={{ marginTop: '15px' }}>
            Dedicó más de 40 años de su vida a aliviar el sufrimiento de los esclavos, 
            bautizando a más de 300,000 personas y defendiendo su dignidad humana.
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
