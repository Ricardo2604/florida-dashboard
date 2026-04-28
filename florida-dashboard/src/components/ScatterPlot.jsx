import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const fmt = n => n?.toLocaleString('es-US') ?? '—';

function getTier(density) {
  if (density > 500) return { label: 'Alta', color: '#1c64f2', bg: '#e8f0fe' };
  if (density >= 100) return { label: 'Media', color: '#0e9f6e', bg: '#def7ec' };
  return { label: 'Baja', color: '#c27803', bg: '#fdf6b2' };
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  const tier = getTier(d.density);
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: 8,
      padding: '0.75rem 1rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.08)',
      fontSize: 13,
      minWidth: 190,
    }}>
      <div style={{ fontWeight: 700, marginBottom: 6, color: '#111827', fontSize: 14 }}>{d.name}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ color: '#6b7280' }}>
          Región: <span style={{ color: '#374151', fontWeight: 500 }}>{d.region}</span>
        </div>
        <div style={{ color: '#6b7280' }}>
          Densidad:{' '}
          <span style={{ fontFamily: 'DM Mono, monospace', fontWeight: 700, color: tier.color }}>
            {fmt(d.density)} hab/mi²
          </span>
        </div>
        <div style={{ color: '#6b7280' }}>
          Población:{' '}
          <span style={{ fontFamily: 'DM Mono, monospace', fontWeight: 600, color: '#111827' }}>
            {fmt(d.pop)}
          </span>
        </div>
        <div style={{ marginTop: 4 }}>
          <span style={{
            background: tier.bg, color: tier.color, borderRadius: 20,
            padding: '1px 8px', fontSize: 11, fontWeight: 600,
          }}>
            {tier.label}
          </span>
        </div>
      </div>
    </div>
  );
};

const CustomDot = (props) => {
  const { cx, cy, payload, isMax } = props;
  if (!isMax) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={7} fill="#1c64f2" stroke="#fff" strokeWidth={2} />
      <rect x={cx - 30} y={cy - 38} width={60} height={20} rx={4} fill="#1c64f2" />
      <text x={cx} y={cy - 24} textAnchor="middle" fill="#fff" fontSize={10} fontWeight={700} fontFamily="DM Sans, sans-serif">
        {payload.name}
      </text>
      <text x={cx} y={cy - 10} textAnchor="middle" fill="#1c64f2" fontSize={10} fontWeight={600} fontFamily="DM Mono, monospace">
        {fmt(payload.density)}
      </text>
    </g>
  );
};

export default function ScatterPlot({ filtered }) {
  const sorted = [...filtered].sort((a, b) => a.density - b.density);
  const maxDensity = sorted.length > 0 ? sorted[sorted.length - 1].density : 0;

  const renderDot = (props) => {
    const isMax = props.payload?.density === maxDensity;
    return <CustomDot {...props} isMax={isMax} />;
  };

  const xInterval = Math.max(1, Math.floor(sorted.length / 12));

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: 10,
      padding: '1.25rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    }}>
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 2 }}>
          Distribución de densidad poblacional — {filtered.length} condados
        </div>
        <div style={{ fontSize: 12, color: '#6b7280' }}>
          Ordenados de menor a mayor densidad · el pico es el condado más denso del filtro activo
        </div>
      </div>

      {sorted.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af', fontSize: 13 }}>
          Sin datos para mostrar
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart
            data={sorted}
            margin={{ top: 40, right: 20, left: 10, bottom: 30 }}
          >
            <defs>
              <linearGradient id="densityGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1a56db" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#1a56db" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              dataKey="name"
              interval={xInterval}
              tick={{ fontSize: 10, fontFamily: 'DM Sans, sans-serif', fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              label={{
                value: 'Condados (menor → mayor densidad)',
                position: 'insideBottom',
                offset: -16,
                fontSize: 11,
                fill: '#6b7280',
                fontFamily: 'DM Sans, sans-serif',
              }}
            />
            <YAxis
              tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}
              tick={{ fontSize: 11, fontFamily: 'DM Mono, monospace', fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              label={{
                value: 'Densidad (hab/mi²)',
                angle: -90,
                position: 'insideLeft',
                offset: 6,
                dy: 70,
                fontSize: 11,
                fill: '#6b7280',
                fontFamily: 'DM Sans, sans-serif',
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="density"
              stroke="#1a56db"
              strokeWidth={2}
              fill="url(#densityGrad)"
              dot={renderDot}
              activeDot={{ r: 5, fill: '#1a56db', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
