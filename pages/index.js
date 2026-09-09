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
      <p style={{
        textAlign: 'center',
        color: '#9aa0a8',
        marginBottom: '20px',
        fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)'
      }}>
        {new Date().toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long'
        })}
      </p>

      <h2 style={{
        fontFamily: "'Lora', Georgia, serif",
        fontSize: '1.1rem',
        color: '#c9a44c',
        fontWeight: 600,
        marginBottom: '12px'
      }}>
        Noticias del Vaticano
      </h2>

      {cargando && (
        <p style={{ color: '#9aa0a8', fontSize: '0.9rem' }}>⏳ Cargando noticias...</p>
      )}

      {!cargando && noticias.length > 0 && (
        <div className="news-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '12px'
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
                borderRadius: '8px',
                overflow: 'hidden',
                height: '100%',
                transition: 'border-color 0.2s'
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
                  padding: '10px 12px',
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
