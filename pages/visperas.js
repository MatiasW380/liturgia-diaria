// pages/visperas.js
import Layout from '../components/Layout';
import { useEffect, useState } from 'react';

export default function Visperas() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/horas?hora=visperas')
      .then((res) => res.json())
      .then((data) => setDatos(data))
      .catch(() => setError(true));
  }, []);

  if (error || (datos && datos.error)) {
    return (
      <Layout>
        <div className="card card-visperas">
          <h2 className="card-title">🌇 Vísperas</h2>
          <p style={{ color: '#e8e3d8' }}>⚠️ No se pudo cargar Vísperas. Por favor, intentá más tarde.</p>
        </div>
      </Layout>
    );
  }

  if (!datos) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <p style={{ color: '#9aa0a8' }}>⏳ Cargando Vísperas...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="card card-visperas">
        <h2 className="card-title">🌇 {datos.titulo}</h2>

        {datos.celebracion && (
          <p style={{ textAlign: 'center', color: '#9aa0a8', marginBottom: '20px' }}>
            {datos.celebracion}
          </p>
        )}

        {datos.secciones.map((seccion, i) => (
          <div key={i} style={{
            backgroundColor: '#21262e',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '15px'
          }}>
            <h4 style={{ marginTop: 0, color: '#c9a44c', fontFamily: "'Lora', Georgia, serif" }}>
              {seccion.nombre}
            </h4>
            <p style={{ whiteSpace: 'pre-line', margin: 0, textAlign: 'justify' }}>{seccion.texto}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}
