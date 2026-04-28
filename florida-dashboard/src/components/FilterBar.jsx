import React from 'react';

const REGIONS = ['Sur', 'Central', 'Tampa Bay', 'Norte', 'Suroeste', 'Costa Este', 'Panhandle'];

const inputStyle = {
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  padding: '0.5rem 0.75rem',
  fontSize: 14,
  fontFamily: 'DM Sans, sans-serif',
  color: '#111827',
  background: '#fff',
  outline: 'none',
  height: 38,
};

export default function FilterBar({
  search, setSearch,
  selectedRegion, setSelectedRegion,
  densityTier, setDensityTier,
  clearFilters,
  totalFiltered, total,
}) {
  const hasFilters = search || selectedRegion || densityTier;

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: 10,
      padding: '1rem 1.25rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      flexWrap: 'wrap',
    }}>
      {/* Search */}
      <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 180 }}>
        <span style={{
          position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
          color: '#9ca3af', fontSize: 14, pointerEvents: 'none',
        }}>🔍</span>
        <input
          type="text"
          placeholder="Buscar condado o ciudad..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...inputStyle, paddingLeft: '2rem', paddingRight: search ? '2rem' : '0.75rem', width: '100%' }}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            style={{
              position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#9ca3af', fontSize: 14, padding: '2px 4px',
              display: 'flex', alignItems: 'center', lineHeight: 1,
            }}
            title="Limpiar búsqueda"
          >
            ✕
          </button>
        )}
      </div>

      {/* Region selector */}
      <select
        value={selectedRegion}
        onChange={e => setSelectedRegion(e.target.value)}
        style={{ ...inputStyle, cursor: 'pointer', minWidth: 160 }}
      >
        <option value="">Todas las regiones</option>
        {REGIONS.map(r => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>

      {/* Density tier selector */}
      <select
        value={densityTier}
        onChange={e => setDensityTier(e.target.value)}
        style={{ ...inputStyle, cursor: 'pointer', minWidth: 170 }}
      >
        <option value="">Todos los niveles</option>
        <option value="alta">Alta (&gt;500 hab/mi²)</option>
        <option value="media">Media (100–500 hab/mi²)</option>
        <option value="baja">Baja (&lt;100 hab/mi²)</option>
      </select>

      {/* Clear button */}
      {hasFilters && (
        <button
          onClick={clearFilters}
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            padding: '0.5rem 1rem',
            fontSize: 13,
            fontFamily: 'DM Sans, sans-serif',
            background: '#f9fafb',
            color: '#6b7280',
            cursor: 'pointer',
            height: 38,
            whiteSpace: 'nowrap',
          }}
        >
          ✕ Limpiar filtros
        </button>
      )}

      {/* Counter */}
      <div style={{
        marginLeft: 'auto',
        fontFamily: 'DM Mono, monospace',
        fontSize: 13,
        color: totalFiltered === total ? '#6b7280' : '#1a56db',
        fontWeight: 500,
        whiteSpace: 'nowrap',
        background: totalFiltered === total ? '#f9fafb' : '#e8f0fe',
        border: `1px solid ${totalFiltered === total ? '#e5e7eb' : '#bdd0fb'}`,
        borderRadius: 8,
        padding: '0.4rem 0.75rem',
      }}>
        {totalFiltered} de {total} condados
      </div>
    </div>
  );
}
