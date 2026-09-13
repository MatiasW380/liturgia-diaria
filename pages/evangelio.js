// pages/evangelio.js
import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import { ChevronDown, BookOpen, Church, Share2 } from 'lucide-react';
import { compartirTexto } from '../lib/compartir';

async function obtenerLecturas() {
  const res = await fetch('/api/lecturas');
  if (!res.ok) throw new Error('Error al obtener lecturas');
  return res.json();
}

function Acordeon({ id, abierto, onToggle, etiqueta, cita, textoCompartir, children }) {
  return (
    <div style={{
      border: '1px solid rgba(232, 227, 216, 0.12)',
      borderRadius: '8px',
      marginBottom: '12px',
      overflow: 'hidden',
    }}>
      <button
        onClick={() => onToggle(id)}
        style={{
          width: '100%',
          textAlign: 'left',
          background: '#21262e',
          border: 'none',
          color: '#e8e3d8',
          fontFamily: "'Lora', Georgia, serif",
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
          {cita && <span style={{ color: '#9aa0a8', marginLeft: '10px', fontSize: '14px' }}>{cita}</span>}
        </span>
        <span className={`acordeon-chevron ${abierto ? 'open' : ''}`}>
          <ChevronDown size={18} color="#c9a44c" strokeWidth={2} />
        </span>
      </button>
      <div className={`acordeon-content ${abierto ? 'open' : ''}`} style={{ lineHeight: '1.8' }}>
        {children}
        {textoCompartir && (
          <button
            onClick={() => compartirTexto(`${etiqueta}${cita ? ' — ' + cita : ''}`, textoCompartir)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '15px',
              background: 'none',
              border: '1px solid rgba(201, 164, 76, 0.35)',
              borderRadius: '20px',
              padding: '6px 14px',
              color: '#c9a44c',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            <Share2 size={15} strokeWidth={1.5} />
            Compartir
          </button>
        )}
      </div>
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
        <h2 className="card-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}><BookOpen size={22} color="#c9a44c" strokeWidth={1.5} /> Lecturas del Día</h2>

        {cargando && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ fontSize: '18px', color: '#9aa0a8' }}>⏳ Cargando las lecturas de hoy...</p>
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: 'rgba(162, 68, 68, 0.15)',
            padding: '20px',
            borderRadius: '8px',
            borderLeft: '3px solid #a24444'
          }}>
            <p style={{ margin: 0, color: '#e8e3d8' }}>
              ⚠️ No se pudieron cargar las lecturas. Por favor, intentá más tarde.
            </p>
          </div>
        )}

        {datos && !cargando && (
          <>
            <p style={{ fontSize: '14px', color: '#9aa0a8', textAlign: 'center', marginBottom: '15px' }}>
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
                backgroundColor: '#21262e',
                borderRadius: '8px',
                borderLeft: '3px solid #c9a44c',
                marginBottom: '20px'
              }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#c9a44c', fontFamily: "'Lora', Georgia, serif", display: "flex", alignItems: "center", gap: "8px" }}><Church size={16} strokeWidth={1.5} /> Celebración</h4>
                <p style={{ margin: 0, fontSize: '15px', color: '#e8e3d8' }}>{datos.celebracion}</p>
              </div>
            )}

            {datos.primeraLectura && (
              <Acordeon
                id="primera"
                abierto={!!abiertos.primera}
                onToggle={toggle}
                etiqueta="Primera Lectura"
                cita={datos.citaPrimeraLectura}
                textoCompartir={datos.primeraLectura}
              >
                {datos.tituloPrimeraLectura && (
                  <p style={{ fontWeight: 'bold', marginBottom: '12px' }}>{datos.tituloPrimeraLectura}</p>
                )}
                <p style={{ whiteSpace: 'pre-line', textAlign: 'justify' }}>{datos.primeraLectura}</p>
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
                textoCompartir={datos.segundaLectura}
              >
                {datos.tituloSegundaLectura && (
                  <p style={{ fontWeight: 'bold', marginBottom: '12px' }}>{datos.tituloSegundaLectura}</p>
                )}
                <p style={{ whiteSpace: 'pre-line', textAlign: 'justify' }}>{datos.segundaLectura}</p>
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
                textoCompartir={datos.salmo}
              >
                <p style={{ whiteSpace: 'pre-line', textAlign: 'justify' }}>{datos.salmo}</p>
              </Acordeon>
            )}

            <Acordeon
              id="evangelio"
              abierto={!!abiertos.evangelio}
              onToggle={toggle}
              etiqueta="Evangelio"
              cita={datos.citaEvangelio}
              textoCompartir={datos.evangelio}
            >
              {datos.tituloEvangelio && (
                <p style={{ fontWeight: 'bold', marginBottom: '12px' }}>{datos.tituloEvangelio}</p>
              )}
              <p style={{ whiteSpace: 'pre-line', textAlign: 'justify' }}>{datos.evangelio}</p>
              <p style={{ fontWeight: 'bold', marginTop: '15px', textAlign: 'right' }}>Palabra de Dios.</p>
            </Acordeon>
          </>
        )}
      </div>
    </Layout>
  );
}
