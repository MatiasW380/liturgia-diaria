// pages/index.js (hero)
<div style={{
  textAlign: 'center',
  padding: 'clamp(30px, 8vh, 80px) 0 clamp(20px, 4vh, 40px) 0',
}}>
  <h1 style={{
    fontFamily: "'Lora', Georgia, serif",
    fontSize: 'clamp(2.5rem, 8vw, 4.8rem)',
    fontWeight: 600,
    color: '#c9a44c',
    margin: 0,
    lineHeight: 1.1,
    textShadow: '0 0 60px rgba(201, 164, 76, 0.15)'
  }}>
    Cristo en tu día
  </h1>
  <p style={{
    fontSize: 'clamp(0.9rem, 1.6vw, 1.2rem)',
    color: '#9aa0a8',
    margin: '10px 0 0 0',
    letterSpacing: '0.04em'
  }}>
    Evangelio y Liturgia para tu día a día
  </p>
  <div style={{
    marginTop: '18px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    color: '#9aa0a8',
    fontSize: 'clamp(0.85rem, 1.2vw, 1rem)'
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
