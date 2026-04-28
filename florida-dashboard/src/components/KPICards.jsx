import React from 'react';

const fmt = n => n?.toLocaleString('es-US') ?? '—';

export default function KPICards({ filtered, total }) {
  const totalPop = filtered.reduce((s, c) => s + c.pop, 0);
  const avgDensity = filtered.length
    ? Math.round(filtered.reduce((s, c) => s + c.density, 0) / filtered.length)
    : 0;
  const topCounty = filtered.length
    ? filtered.reduce((max, c) => (c.density > max.density ? c : max), filtered[0])
    : null;

  const cards = [
    {
      label: 'Condados mostrados',
      value: `${filtered.length} / ${total}`,
      sub: 'según filtros activos',
      color: '#1a56db',
      bg: '#e8f0fe',
      icon: '📍',
    },
    {
      label: 'Población total',
      value: fmt(totalPop),
      sub: 'hab. en selección',
      color: '#0e9f6e',
      bg: '#def7ec',
      icon: '👥',
    },
    {
      label: 'Densidad promedio',
      value: fmt(avgDensity),
      sub: 'hab/mi² (filtrados)',
      color: '#7e3af2',
      bg: '#edebfe',
      icon: '📊',
    },
    {
      label: 'Mayor densidad',
      value: topCounty ? topCounty.name : '—',
      sub: topCounty ? `${fmt(topCounty.density)} hab/mi²` : 'sin datos',
      color: '#c27803',
      bg: '#fdf6b2',
      icon: '🏆',
    },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '1rem',
    }}>
      {cards.map(card => (
        <div key={card.label} style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 10,
          padding: '1.25rem 1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          borderLeft: `4px solid ${card.color}`,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{
              fontSize: '1.25rem',
              background: card.bg,
              borderRadius: 8,
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>{card.icon}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {card.label}
            </span>
          </div>
          <div style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: card.color,
            lineHeight: 1.2,
          }}>
            {card.value}
          </div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>{card.sub}</div>
        </div>
      ))}
    </div>
  );
}
