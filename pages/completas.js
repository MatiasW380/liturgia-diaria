import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import { obtenerCompletas } from '../lib/liturgia';

export default function Completas() {
  const [datos, setDatos] = useState(null);

  useEffect(() => {
    const fecha = new Date();
    const completasData = obtenerCompletas(fecha);
    setDatos(completasData);
  }, []);

  if (!datos) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <p>Cargando Completas...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="card card-completas">
        <h2 className="card-title">{datos.titulo}</h2>
        
        <div style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>
          <p style={{ margin: 0 }}>📅 {datos.fecha}</p>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '15px' }}>
          <h4 style={{ marginTop: 0, color: '#383d41' }}>Examen de Conciencia</h4>
          <p style={{ fontStyle: 'italic' }}>{datos.examen}</p>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '15px' }}>
          <h4 style={{ marginTop: 0, color: '#383d41' }}>Himno</h4>
          <p style={{ fontStyle: 'italic' }}>{datos.himno}</p>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '15px' }}>
          <h4 style={{ marginTop: 0, color: '#383d41' }}>Salmodia</h4>
          <p>{datos.salmodia}</p>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '15px' }}>
          <h4 style={{ marginTop: 0, color: '#383d41' }}>Cánticos</h4>
          <p style={{ fontStyle: 'italic' }}>{datos.canticos}</p>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
          <h4 style={{ marginTop: 0, color: '#383d41' }}>Oración Final</h4>
          <p>{datos.oracion}</p>
        </div>
      </div>
    </Layout>
  );
}
