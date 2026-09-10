// pages/completas.js
import Layout from '../components/Layout';
import { useEffect, useState } from 'react';

export default function Completas() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/horas?hora=completas')
      .then((res) => res.json())
      .then((data) => setDatos(data))
      .catch(() => setError(true));
  }, []);

  if (error || (datos && datos.error)) {
    return (
      <Layout>
        <div className="card card-completas">
          <h2 className="card-title">🌙 Completas</h2>
          <p style={{ color: '#e8e3d8' }}>⚠️ No se pudo cargar Completas. Por favor, intentá más tarde.</p>
        </div>
      </Layout>
    );
  }

  if (!datos) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <p style={{ color: '#9aa0a8' }}>⏳ Cargando Completas...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="card card-completas">
        <h2 className="card-title">🌙 {datos.titulo}</h2>

        {datos.esFallback && (
          <div style={{
            backgroundColor: 'rgba(201, 164, 76, 0.10)',
            border: '1px solid rgba(201, 164, 76, 0.30)',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '20px',
            fontSize: '0.85rem',
            color: '#e8e3d8'
          }}>
            ℹ️ No se pudo obtener el texto específico de hoy — mostrando la forma general de Completas.
          </div>
        )}

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
