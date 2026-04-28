import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

const fmt = n => n?.toLocaleString('es-US') ?? '—';

function getColor(density) {
  if (density > 500) return '#1c64f2';
  if (density >= 100) return '#0e9f6e';
  return '#c27803';
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const color = getColor(d.density);
  return (
    <div style={{
      background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8,
      padding: '0.75rem 1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.08)',
      fontSize: 13, minWidth: 180,
    }}>
      <div style={{ fontWeight: 700, marginBottom: 8, color: '#111827', fontSize: 14 }}>{d.name}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ color: '#6b7280' }}>
          Densidad:{' '}
          <span style={{ fontFamily: 'DM Mono, monospace', fontWeight: 700, color }}>
            {fmt(d.density)} hab/mi²
          </span>
        </div>
        <div style={{ color: '#6b7280' }}>
          Población:{' '}
          <span style={{ fontFamily: 'DM Mono, monospace', fontWeight: 600, color: '#111827' }}>
            {fmt(d.pop)}
          </span>
        </div>
        <div style={{ color: '#6b7280' }}>
          Región: <span style={{ color: '#374151', fontWeight: 500 }}>{d.region}</span>
        </div>
      </div>
    </div>
  );
};

const RotatedTick = ({ x, y, payload }) => (
  <g transform={`translate(${x},${y})`}>
    <text
      x={0} y={0} dy={4}
      textAnchor="end"
      fill="#374151"
      fontSize={11}
      fontFamily="DM Sans, sans-serif"
      transform="rotate(-42)"
    >
      {payload.value}
    </text>
  </g>
);

// Custom bar label rendered as SVG text — avoids LabelList + Cell conflict in Recharts 2.x
const BarValueLabel = ({ x, y, width, value }) => {
  if (value == null) return null;
  return (
    <text
      x={x + width / 2}
      y={y - 5}
      textAnchor="middle"
      fill="#374151"
      fontSize={10}
      fontFamily="DM Mono, monospace"
      fontWeight={600}
    >
      {fmt(value)}
    </text>
  );
};

export default function BarChartTop15({ filtered }) {
  const top15 = [...filtered]
    .sort((a, b) => b.density - a.density)
    .slice(0, 15);

  return (
    <div style={{
      background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10,
      padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    }}>
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 2 }}>
          Top 15 condados por densidad poblacional
        </div>
        <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>
          Habitantes por milla cuadrada (hab/mi²)
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[
            { label: 'Alta  >500',     color: '#1c64f2', bg: '#e8f0fe' },
            { label: 'Media  100–500', color: '#0e9f6e', bg: '#def7ec' },
            { label: 'Baja  <100',     color: '#c27803', bg: '#fdf6b2' },
          ].map(tier => (
            <span key={tier.label} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              fontSize: 11, fontWeight: 600, color: tier.color,
              background: tier.bg, borderRadius: 20, padding: '2px 10px',
            }}>
              {tier.label}
            </span>
          ))}
        </div>
      </div>

      {top15.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af', fontSize: 13 }}>
          Sin datos para mostrar
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={top15}
            margin={{ top: 28, right: 16, left: 0, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis
              dataKey="name"
              tick={<RotatedTick />}
              interval={0}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}
              tick={{ fontSize: 11, fontFamily: 'DM Mono, monospace', fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              label={{ value: 'hab/mi²', angle: -90, position: 'insideLeft', offset: 10, fontSize: 11, fill: '#9ca3af' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f0f5ff' }} />
            <Bar
              dataKey="density"
              radius={[4, 4, 0, 0]}
              maxBarSize={36}
              label={<BarValueLabel />}
            >
              {top15.map((entry, i) => (
                <Cell key={`bar-${i}`} fill={getColor(entry.density)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
