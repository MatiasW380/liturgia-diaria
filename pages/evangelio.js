// pages/evangelio.js
import Layout from '../components/Layout';
import { useEffect, useState } from 'react';

async function obtenerLecturas() {
  const res = await fetch('/api/lecturas');
  if (!res.ok) throw new Error('Error al obtener lecturas');
  return res.json();
}

function Acordeon({ id, abierto, onToggle, etiqueta, cita, children }) {
  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      marginBottom: '12px',
      overflow: 'hidden',
    }}>
      <button
        onClick={() => onToggle(id)}
        style={{
          width: '100%',
          textAlign: 'left',
          background: '#f8f9fa',
          border: 'none',
          padding: '14px 18px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '16px',
        }}
      >
        <span>
          <strong>{etiqueta}</strong>
          {cita && <span style={{ color: '#888', marginLeft: '10px', fontSize: '14px' }}>{cita}</span>}
        </span>
        <span style={{ fontSize: '14px', color: '#888' }}>{abierto ? '▲' : '▼'}</span>
      </button>
      {abierto && (
        <div style={{ padding: '18px', lineHeight: '1.8' }}>
          {children}
        </div>
      )}
    </div>
  );
}

export default function Evangelio() {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [abiertos, setAbiertos] = useState({ evangelio: true });

  useEffect(() => {
    async function cargarDatos() {
      try {
        const lecturas = await obtenerLecturas();
        setDatos(lecturas);
        setCargando(false);
      } catch (err) {
        console.error('Error al cargar lecturas:', err);
        setError(true);
        setCargando(false);
      }
    }
    cargarDatos();
  }, []);

  const toggle = (id) => setAbiertos((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <Layout>
      <div className="card card-evangelio">
        <h2 className="card-title">📖 Lecturas del Día</h2>

        {cargando && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ fontSize: '18px', color: '#666' }}>⏳ Cargando las lecturas de hoy...</p>
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: '#f8d7da',
            padding: '20px',
            borderRadius: '8px',
            borderLeft: '4px solid #dc3545'
          }}>
            <p style={{ margin: 0, color: '#721c24' }}>
              ⚠️ No se pudieron cargar las lecturas. Por favor, intentá más tarde.
            </p>
          </div>
        )}

        {datos && !cargando && (
          <>
            <p style={{ fontSize: '14px', color: '#888', textAlign: 'center', marginBottom: '15px' }}>
              📅 {new Date(datos.fecha).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
              })}
            </p>

            {datos.celebracion && (
              <div style={{
                padding: '15px',
                backgroundColor: '#e8f4f8',
                borderRadius: '8px',
                borderLeft: '4px solid #8e44ad',
                marginBottom: '20px'
              }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#8e44ad' }}>⛪ Celebración</h4>
                <p style={{ margin: 0, fontSize: '15px' }}>{datos.celebracion}</p>
              </div>
            )}

            {datos.primeraLectura && (
              <Acordeon
                id="primera"
                abierto={!!abiertos.primera}
                onToggle={toggle}
                etiqueta="Primera Lectura"
                cita={datos.citaPrimeraLectura}
              >
                {datos.tituloPrimeraLectura && (
                  <p style={{ fontWeight: 'bold', marginBottom: '12px' }}>{datos.tituloPrimeraLectura}</p>
                )}
                <p style={{ whiteSpace: 'pre-line' }}>{datos.primeraLectura}</p>
                <p style={{ fontWeight: 'bold', marginTop: '15px', textAlign: 'right' }}>Palabra de Dios.</p>
              </Acordeon>
            )}

            {datos.segundaLectura && (
              <Acordeon
                id="segunda"
                abierto={!!abiertos.segunda}
                onToggle={toggle}
                etiqueta="Segunda Lectura"
                cita={datos.citaSegundaLectura}
              >
                {datos.tituloSegundaLectura && (
                  <p style={{ fontWeight: 'bold', marginBottom: '12px' }}>{datos.tituloSegundaLectura}</p>
                )}
                <p style={{ whiteSpace: 'pre-line' }}>{datos.segundaLectura}</p>
                <p style={{ fontWeight: 'bold', marginTop: '15px', textAlign: 'right' }}>Palabra de Dios.</p>
              </Acordeon>
            )}

            {datos.salmo && (
              <Acordeon
                id="salmo"
                abierto={!!abiertos.salmo}
                onToggle={toggle}
                etiqueta="Salmo Responsorial"
                cita={datos.citaSalmo}
              >
                <p style={{ whiteSpace: 'pre-line' }}>{datos.salmo}</p>
              </Acordeon>
            )}

            <Acordeon
              id="evangelio"
              abierto={!!abiertos.evangelio}
              onToggle={toggle}
              etiqueta="📖 Evangelio"
              cita={datos.citaEvangelio}
            >
              {datos.tituloEvangelio && (
                <p style={{ fontWeight: 'bold', marginBottom: '12px' }}>{datos.tituloEvangelio}</p>
              )}
              <p style={{ whiteSpace: 'pre-line' }}>{datos.evangelio}</p>
              <p style={{ fontWeight: 'bold', marginTop: '15px', textAlign: 'right' }}>Palabra de Dios.</p>
            </Acordeon>
          </>
        )}
      </div>
    </Layout>
  );
}
