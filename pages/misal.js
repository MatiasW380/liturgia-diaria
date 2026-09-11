// pages/misal.js
import Layout from '../components/Layout';
import { useEffect, useState } from 'react';

function Bloque({ etiqueta, dato }) {
  if (!dato || !dato.texto) return null;
  return (
    <div style={{
      backgroundColor: '#21262e',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '15px'
    }}>
      <h4 style={{ marginTop: 0, color: '#c9a44c', fontFamily: "'Lora', Georgia, serif" }}>
        {etiqueta}
      </h4>
      {dato.cita && (
        <p style={{ color: '#9aa0a8', fontSize: '0.85rem', marginBottom: '10px' }}>{dato.cita}</p>
      )}
      <p style={{ whiteSpace: 'pre-line', margin: 0, textAlign: 'justify' }}>{dato.texto}</p>
    </div>
  );
}

export default function Misal() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/misal')
      .then((res) => res.json())
      .then((data) => setDatos(data))
      .catch(() => setError(true));
  }, []);

  if (error || (datos && datos.error)) {
    return (
      <Layout>
        <div className="card card-misal">
          <h2 className="card-title">📕 Misal del Día</h2>
          <p style={{ color: '#e8e3d8' }}>⚠️ No se pudo cargar el Misal de hoy. Por favor, intentá más tarde.</p>
        </div>
      </Layout>
    );
  }

  if (!datos) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <p style={{ color: '#9aa0a8' }}>⏳ Cargando el Misal de hoy...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="card card-misal">
        <h2 className="card-title">📕 Misal del Día</h2>

        {datos.celebracion && (
          <p style={{ textAlign: 'center', color: '#e8e3d8', marginBottom: '4px', fontFamily: "'Lora', Georgia, serif" }}>
            {datos.celebracion}
          </p>
        )}
        {datos.colorLiturgico && (
          <p style={{ textAlign: 'center', color: '#9aa0a8', marginBottom: '20px', fontSize: '0.85rem' }}>
            Color litúrgico: {datos.colorLiturgico}
          </p>
        )}

        <Bloque etiqueta="Antífona de entrada" dato={datos.antifonaEntrada} />
        <Bloque etiqueta="Oración colecta" dato={datos.oracionColecta} />
        <Bloque etiqueta="Aclamación al Evangelio" dato={datos.aclamacion} />
        <Bloque etiqueta="Oración sobre las ofrendas" dato={datos.oracionOfrendas} />
        <Bloque etiqueta="Antífona de comunión" dato={datos.antifonaComunion} />
        <Bloque etiqueta="Oración después de la comunión" dato={datos.oracionComunion} />
      </div>
    </Layout>
  );
}
