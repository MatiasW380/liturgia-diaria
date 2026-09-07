import Layout from '../components/Layout';

export default function Visperas() {
  return (
    <Layout>
      <div className="card card-visperas">
        <h2 className="card-title">🌇 Vísperas - Oración de la Tarde</h2>
        
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '15px' }}>
          <h4 style={{ marginTop: 0, color: '#155724' }}>Himno</h4>
          <p style={{ fontStyle: 'italic' }}>
            "Ya la luz del día declina,<br />
            Señor, te damos gracias<br />
            por este día que termina,<br />
            y por tu amor que nos acompaña."
          </p>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '15px' }}>
          <h4 style={{ marginTop: 0, color: '#155724' }}>Salmodia</h4>
          <p>
            <strong>Salmo 141</strong><br />
            "Señor, a ti te llamo, date prisa, escúchame,<br />
            atiende mi voz cuando te invoco.<br />
            Suba mi oración como incienso a tu presencia,<br />
            mis manos levantadas como ofrenda de la tarde."
          </p>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '15px' }}>
          <h4 style={{ marginTop: 0, color: '#155724' }}>Magníficat (Cántico de María)</h4>
          <p style={{ fontStyle: 'italic' }}>
            "Proclama mi alma la grandeza del Señor,<br />
            se alegra mi espíritu en Dios mi salvador,<br />
            porque ha mirado la humildad de su esclava..."
          </p>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
          <h4 style={{ marginTop: 0, color: '#155724' }}>Oración Final</h4>
          <p>
            Señor, al caer la tarde te pedimos que bendigas nuestro descanso. 
            Perdona nuestras faltas y concédenos vivir siempre en tu amor. 
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
