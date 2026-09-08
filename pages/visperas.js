// pages/visperas.js
import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import { obtenerVisperas } from '../lib/liturgiaHoras';

export default function Visperas() {
  const [datos, setDatos] = useState(null);

  useEffect(() => {
    const fecha = new Date();
    const visperasData = obtenerVisperas(fecha);
    setDatos(visperasData);
  }, []);

  if (!datos) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <p>Cargando Vísperas...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="card card-visperas">
        <h2 className="card-title">{datos.titulo}</h2>
        
        <div style={{ textAlign: 'center', color: '#9aa0a8', marginBottom: '20px' }}>
          <p style={{ margin: 0 }}>📅 {datos.fecha}</p>
        </div>

        <div style={{ backgroundColor: '#21262e', padding: '20px', borderRadius: '8px', marginBottom: '15px' }}>
          <h4 style={{ marginTop: 0, color: '#c9a44c', fontFamily: "'Lora', Georgia, serif" }}>Himno</h4>
          <p style={{ fontStyle: 'italic', whiteSpace: 'pre-line', margin: 0 }}>{datos.himno}</p>
        </div>

        <div style={{ backgroundColor: '#21262e', padding: '20px', borderRadius: '8px', marginBottom: '15px' }}>
          <h4 style={{ marginTop: 0, color: '#c9a44c', fontFamily: "'Lora', Georgia, serif" }}>Salmodia</h4>
          <p style={{ whiteSpace: 'pre-line', margin: 0 }}>{datos.salmodia}</p>
        </div>

        <div style={{ backgroundColor: '#21262e', padding: '20px', borderRadius: '8px', marginBottom: '15px' }}>
          <h4 style={{ marginTop: 0, color: '#c9a44c', fontFamily: "'Lora', Georgia, serif" }}>Cánticos</h4>
          <p style={{ fontStyle: 'italic', whiteSpace: 'pre-line', margin: 0 }}>{datos.canticos}</p>
        </div>

        <div style={{ backgroundColor: '#21262e', padding: '20px', borderRadius: '8px' }}>
          <h4 style={{ marginTop: 0, color: '#c9a44c', fontFamily: "'Lora', Georgia, serif" }}>Oración Final</h4>
          <p style={{ whiteSpace: 'pre-line', margin: 0 }}>{datos.oracion}</p>
        </div>
      </div>
    </Layout>
  );
}
