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
      {/* HERO - Título grande y llamativo */}
      <div style={{
        textAlign: 'center',
        padding: 'clamp(30px, 8vh, 80px) 20px clamp(20px, 4vh, 40px) 20px',
        borderBottom: '1px solid rgba(201, 164, 76, 0.10)',
        marginBottom: 'clamp(24px, 4vh, 40px)'
      }}>
        <h1 style={{
          fontFamily: "'Lora', Georgia, serif",
          fontSize: 'clamp(2.8rem, 9vw, 5.2rem)',
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
          fontSize: 'clamp(0.95rem, 1.8vw, 1.3rem)',
          color: '#9aa0a8',
          margin: '12px 0 0 0',
          letterSpacing: '0.06em',
          fontWeight: 300
        }}>
          Evangelio y Liturgia para tu día a día
        </p>
        <div style={{
          marginTop: '20px',
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
        }
        @media (min-width: 900px) {
          .news-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </Layout>
  );
}
