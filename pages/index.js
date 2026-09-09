import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';

export default function Home() {
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch('/api/noticias')
      .then((res) => res.json())
      .then((data) => {
        setNoticias(data.noticias || []);
        setCargando(false);
      })
      .catch(() => {
        setNoticias([]);
        setCargando(false);
      });
  }, []);

  // Opciones del menú principal
  const opcionesMenu = [
    { icono: '📖', nombre: 'Lecturas de hoy', ruta: '/evangelio' },
    { icono: '⛪', nombre: 'Santo del día', ruta: '/santo' },
    { icono: '✝️', nombre: 'Reflexión', ruta: '/reflexion' },
    { icono: '🕯️', nombre: 'Liturgia de las Horas', ruta: '/liturgia-horas' },
  ];

  return (
    <Layout>
      {/* HERO - Título, subtítulo, fecha y botones */}
      <div style={{
        textAlign: 'center',
        padding: 'clamp(20px, 5vh, 50px) 0',
        marginBottom: 'clamp(30px, 5vh, 50px)',
        borderBottom: '1px solid rgba(201, 164, 76, 0.10)'
      }}>
        <h1 style={{
          fontFamily: "'Lora', Georgia, serif",
          fontSize: 'clamp(3rem, 10vw, 5.5rem)',
          fontWeight: 600,
          color: '#c9a44c',
          margin: 0,
          lineHeight: 1.1,
          textShadow: '0 0 60px rgba(201, 164, 76, 0.12)',
          letterSpacing: '-0.02em'
        }}>
          Cristo en tu día
        </h1>
        <p style={{
          fontFamily: "'Inter', Arial, sans-serif",
          fontSize: 'clamp(1rem, 2vw, 1.4rem)',
          color: '#9aa0a8',
          margin: '12px 0 0 0',
          letterSpacing: '0.06em',
          fontWeight: 300
        }}>
          Evangelio y Liturgia para tu día a día
        </p>
        <div style={{
          marginTop: '18px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '14px',
          color: '#9aa0a8',
          fontSize: 'clamp(0.85rem, 1.2vw, 1rem)',
          fontFamily: "'Inter', Arial, sans-serif"
        }}>
          <span style={{ color: '#c9a44c' }}>✦</span>
          <span>
            {new Date().toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long'
            })}
          </span>
          <span style={{ color: '#c9a44c' }}>✦</span>
        </div>

        {/* BOTONES DE NAVEGACIÓN */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '12px',
          marginTop: 'clamp(30px, 5vh, 50px)',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          {opcionesMenu.map((opcion) => (
            <Link key={opcion.ruta} href={opcion.ruta} style={{ textDecoration: 'none' }}>
              <div style={{
                backgroundColor: '#1c2027',
                border: '1px solid rgba(232, 227, 216, 0.08)',
                borderRadius: '12px',
                padding: '16px 20px',
                transition: 'border-color 0.2s, transform 0.15s, box-shadow 0.2s',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}
              className="menu-button"
              >
                <span style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  color: '#c9a44c',
                  flexShrink: 0
                }}>
                  {opcion.icono}
                </span>
                <span style={{
                  fontFamily: "'Lora', Georgia, serif",
                  fontSize: 'clamp(1rem, 1.6vw, 1.2rem)',
                  color: '#e8e3d8',
                  fontWeight: 500
                }}>
                  {opcion.nombre}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SECCIÓN DE NOTICIAS */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px',
          borderBottom: '1px solid rgba(201, 164, 76, 0.2)',
          paddingBottom: '12px'
        }}>
          <span style={{ color: '#c9a44c', fontSize: '1.2rem' }}>✠</span>
          <h2 style={{
            fontFamily: "'Lora', Georgia, serif",
            fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
            color: '#e8e3d8',
            fontWeight: 500,
            margin: 0
          }}>
            Noticias del Vaticano
          </h2>
        </div>

        {cargando && (
          <p style={{ color: '#9aa0a8', fontSize: '0.9rem' }}>⏳ Cargando noticias...</p>
        )}

        {!cargando && noticias.length > 0 && (
          <div className="news-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '16px'
          }}>
            {noticias.map((noticia, i) => (
              <a
                key={i}
                href={noticia.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <div className="news-card" style={{
                  backgroundColor: '#1c2027',
                  border: '1px solid rgba(232, 227, 216, 0.08)',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  height: '100%',
                  transition: 'border-color 0.25s, box-shadow 0.3s, transform 0.2s'
                }}>
                  {noticia.imagen && (
                    <div style={{
                      width: '100%',
                      paddingTop: '56%',
                      position: 'relative',
                      backgroundColor: '#14171c'
                    }}>
                      <img
                        src={noticia.imagen}
                        alt=""
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  )}
                  <p style={{
                    fontFamily: "'Inter', Arial, sans-serif",
                    color: '#e8e3d8',
                    fontSize: 'clamp(0.8rem, 1.1vw, 0.9rem)',
                    lineHeight: '1.5',
                    padding: '14px 16px',
                    margin: 0
                  }}>
                    {noticia.titulo}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}

        {!cargando && noticias.length === 0 && (
          <p style={{ color: '#9aa0a8', fontSize: '0.9rem' }}>
            No se pudieron cargar las noticias por ahora.
          </p>
        )}
      </div>

      {/* ESTILOS RESPONSIVE Y HOVER */}
      <style jsx>{`
        @media (hover: hover) {
          .menu-button:hover {
            border-color: rgba(201, 164, 76, 0.4) !important;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
          }
          .news-card:hover {
            border-color: rgba(201, 164, 76, 0.3) !important;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
            transform: translateY(-3px);
          }
        }
        @media (min-width: 600px) {
          .news-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 18px !important;
          }
          div:has(> .menu-button) {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 14px !important;
          }
        }
        @media (min-width: 900px) {
          .news-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 20px !important;
          }
          div:has(> .menu-button) {
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 16px !important;
          }
          .menu-button {
            padding: 18px 16px !important;
            justify-content: center !important;
          }
        }
        /* Ajuste para móvil: botones en una columna */
        @media (max-width: 599px) {
          div:has(> .menu-button) {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }
        }
      `}</style>
    </Layout>
  );
}
