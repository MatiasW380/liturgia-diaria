import Layout from '../components/Layout';

export default function Completas() {
  return (
    <Layout>
      <div className="card card-completas">
        <h2 className="card-title">🌙 Completas - Oración de la Noche</h2>
        
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '15px' }}>
          <h4 style={{ marginTop: 0, color: '#383d41' }}>Examen de Conciencia</h4>
          <p style={{ fontStyle: 'italic' }}>
            "Antes de dormir, repasemos el día que pasó...<br />
            ¿Dónde estuve? ¿Qué hice? ¿Qué sentí?<br />
            ¿Dónde estaba Dios en mi día?"
          </p>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '15px' }}>
          <h4 style={{ marginTop: 0, color: '#383d41' }}>Himno</h4>
          <p style={{ fontStyle: 'italic' }}>
            "Al llegar la noche, Señor,<br />
            te damos gracias por tu protección.<br />
            En tus manos encomendamos nuestra vida,<br />
            confiando en tu amor sin medida."
          </p>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '15px' }}>
          <h4 style={{ marginTop: 0, color: '#383d41' }}>Salmodia</h4>
          <p>
            <strong>Salmo 91</strong><br />
            "El que habita al amparo del Altísimo,<br />
            se acoge a la sombra del Omnipotente.<br />
            Diré al Señor: 'Tú eres mi refugio, mi alcázar,<br />
            mi Dios, en quien confío'."
          </p>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '15px' }}>
          <h4 style={{ marginTop: 0, color: '#383d41' }}>Nunc Dimittis (Cántico de Simeón)</h4>
          <p style={{ fontStyle: 'italic' }}>
            "Ahora, Señor, según tu promesa,<br />
            puedes dejar a tu siervo irse en paz,<br />
            porque mis ojos han visto tu salvación..."
          </p>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
          <h4 style={{ marginTop: 0, color: '#383d41' }}>Oración Final</h4>
          <p>
            Señor, al terminar este día, encomendamos nuestra vida en tus manos. 
            Protégenos durante la noche y concédenos un descanso reparador. 
            Amén.
          </p>
          <p style={{ marginTop: '15px', color: '#666', fontSize: '14px' }}>
            🙏 Salve Regina
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
