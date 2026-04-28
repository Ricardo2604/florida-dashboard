import React from 'react';

export default function SourcesPanel({ sources }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: 10,
      padding: '1.25rem 1.5rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    }}>
      <div style={{ marginBottom: '0.75rem' }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Fuentes de datos
        </span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem' }}>
        {sources.map((src, i) => (
          <a
            key={i}
            href={src.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              textDecoration: 'none',
              padding: '0.6rem 0.9rem',
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              flex: '1 1 200px',
              maxWidth: 320,
              transition: 'border-color 0.15s, background 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#1a56db';
              e.currentTarget.style.background = '#e8f0fe';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.background = '#f9fafb';
            }}
          >
            <span style={{ fontWeight: 600, color: '#1a56db', fontSize: 13 }}>
              {src.name}
            </span>
            <span style={{ fontSize: 11, color: '#6b7280' }}>
              {src.detail}
            </span>
          </a>
        ))}
      </div>
      <p style={{ marginTop: '0.75rem', fontSize: 11, color: '#9ca3af' }}>
        Datos: U.S. Census Bureau 2020 Census + ACS 2024 Five-Year Estimates · 67 condados de Florida
      </p>
    </div>
  );
}
