import Layout from '../components/Layout';
import { useEffect, useState } from 'react';

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

  return (
    <Layout>
      {/* Hero con fecha y adornos (sin título duplicado) */}
      <div style={{
        textAlign: 'center',
        padding: 'clamp(16px, 4vh, 40px) 0 clamp(20px, 4vh, 40px) 0',
        marginBottom: 'clamp(20px, 3vh, 30px)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          color: '#9aa0a8',
          fontSize: 'clamp(0.9rem, 1.4vw, 1.1rem)',
          fontFamily: "'Inter', Arial, sans-serif",
          letterSpacing: '0.02em'
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
      </div>

      {/* Noticias */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '16px',
        borderBottom: '1px solid rgba(201, 164, 76, 0.25)',
        paddingBottom: '10px'
      }}>
        <span style={{ color: '#c9a44c', fontSize: '1.1rem' }}>✠</span>
        <h2 style={{
          fontFamily: "'Lora', Georgia, serif",
          fontSize: 'clamp(1.05rem, 2vw, 1.3rem)',
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
                backgroundColor: '#1b1f26',
                border: '1px solid rgba(232, 227, 216, 0.10)',
                borderRadius: '10px',
                overflow: 'hidden',
                height: '100%',
                transition: 'border-color 0.2s, transform 0.15s, box-shadow 0.2s'
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
                  color: '#e8e3d8',
                  fontSize: '0.85rem',
                  lineHeight: '1.4',
                  padding: '12px 14px',
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

      <style jsx>{`
        @media (hover: hover) {
          :global(.news-card):hover {
            border-color: rgba(201, 164, 76, 0.35) !important;
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
          }
        }
        @media (min-width: 600px) {
          .news-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (min-width: 900px) {
          .news-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
      `}</style>
    </Layout>
  );
}
