import Layout from '../components/Layout';

export default function Laudes() {
  return (
    <Layout>
      <div className="card card-laudes">
        <h2 className="card-title">🌅 Laudes - Oración de la Mañana</h2>
        
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '15px' }}>
          <h4 style={{ marginTop: 0, color: '#0c5460' }}>Invitación</h4>
          <p>Señor, ábreme los labios, y mi boca proclamará tu alabanza.</p>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '15px' }}>
          <h4 style={{ marginTop: 0, color: '#0c5460' }}>Himno</h4>
          <p style={{ fontStyle: 'italic' }}>
            "Amanece un nuevo día,<br />
            Señor, te damos gracias,<br />
            por tu luz y tu vida,<br />
            que nos llenan de esperanza..."
          </p>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '15px' }}>
          <h4 style={{ marginTop: 0, color: '#0c5460' }}>Salmodia</h4>
          <p>
            <strong>Salmo 63</strong><br />
            "Dios mío, tú eres mi Dios, por ti madrugo,<br />
            mi alma está sedienta de ti; mi carne tiene ansia de ti,<br />
            como tierra reseca, agostada, sin agua."
          </p>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '15px' }}>
          <h4 style={{ marginTop: 0, color: '#0c5460' }}>Benedictus (Cántico de Zacarías)</h4>
          <p style={{ fontStyle: 'italic' }}>
            "Bendito sea el Señor, Dios de Israel,<br />
            porque ha visitado y redimido a su pueblo..."
          </p>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
          <h4 style={{ marginTop: 0, color: '#0c5460' }}>Oración Final</h4>
          <p>
            Señor, que este nuevo día sea para nosotros un tiempo de gracia. 
            Guíanos por tus caminos y ayúdanos a vivir según tu voluntad. 
            Amén.
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
            ⚠️ Contenido de ejemplo. Próximamente se conectará con datos reales de breviarium.
          </p>
        </div>
      </div>
    </Layout>
  );
}
