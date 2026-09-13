// pages/laudes.js
import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import { Sunrise } from 'lucide-react';

export default function Laudes() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/horas?hora=laudes')
      .then((res) => res.json())
      .then((data) => setDatos(data))
      .catch(() => setError(true));
  }, []);

  if (error || (datos && datos.error)) {
    return (
      <Layout>
        <div className="card card-laudes">
          <h2 className="card-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}><Sunrise size={22} color="#c9a44c" strokeWidth={1.5} /> Laudes</h2>
          <p style={{ color: '#e8e3d8' }}>⚠️ No se pudo cargar Laudes. Por favor, intentá más tarde.</p>
        </div>
      </Layout>
    );
  }

  if (!datos) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <p style={{ color: '#9aa0a8' }}>⏳ Cargando Laudes...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="card card-laudes">
        <h2 className="card-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}><Sunrise size={22} color="#c9a44c" strokeWidth={1.5} /> {datos.titulo}</h2>

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
