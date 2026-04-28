import React, { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { counties as allCounties } from '../data/counties';

const fmt = n => n?.toLocaleString('es-US') ?? '—';

function getTier(density) {
  if (density > 500) return { label: 'Alta', color: '#1c64f2', bg: '#e8f0fe' };
  if (density >= 100) return { label: 'Media', color: '#0e9f6e', bg: '#def7ec' };
  return { label: 'Baja', color: '#c27803', bg: '#fdf6b2' };
}

function getTierLabel(density) {
  if (density > 500) return 'Alta';
  if (density >= 100) return 'Media';
  return 'Baja';
}

const today = () => new Date().toISOString().slice(0, 10);
const HEADERS = ['Rank', 'Condado', 'Región', 'Ciudad', 'Densidad (hab/mi²)', 'Población', 'Área (mi²)', 'Nivel'];

function toRows(rows) {
  return rows.map(c => [c.rank, c.name, c.region, c.city, c.density, c.pop, c.area, getTierLabel(c.density)]);
}

function exportCSV(rows) {
  const csv = [HEADERS, ...toRows(rows)].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `florida_seleccion_${today()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportExcel(rows) {
  const data = toRows(rows);
  const ws = XLSX.utils.aoa_to_sheet([HEADERS, ...data]);
  const range = XLSX.utils.decode_range(ws['!ref']);
  for (let C = range.s.c; C <= range.e.c; C++) {
    const addr = XLSX.utils.encode_cell({ r: 0, c: C });
    if (ws[addr]) ws[addr].s = { font: { bold: true } };
  }
  ws['!cols'] = HEADERS.map((h, i) => ({
    wch: Math.max(h.length, ...data.map(r => String(r[i]).length)) + 2,
  }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Selección Florida');
  XLSX.writeFile(wb, `florida_seleccion_${today()}.xlsx`);
}

const COLS = [
  { key: 'rank',    label: 'Rank',               align: 'center', numeric: true },
  { key: 'name',    label: 'Condado',             align: 'left',   numeric: false },
  { key: 'region',  label: 'Región',              align: 'left',   numeric: false },
  { key: 'city',    label: 'Ciudad principal',    align: 'left',   numeric: false },
  { key: 'density', label: 'Densidad (hab/mi²)',  align: 'left',   numeric: true },
  { key: 'pop',     label: 'Población',           align: 'right',  numeric: true },
  { key: 'area',    label: 'Área (mi²)',          align: 'right',  numeric: true },
  { key: 'tier',    label: 'Nivel',               align: 'center', sortable: false },
];

const totalCounties = allCounties.length;
const avgDensity = Math.round(allCounties.reduce((s, c) => s + c.density, 0) / totalCounties);
const maxCountyDensity = Math.max(...allCounties.map(c => c.density));

function CountyDetailPanel({ county, onClose }) {
  const tier = getTier(county.density);
  const topPct = Math.round((county.rank / totalCounties) * 100);
  const densierThan = totalCounties - county.rank;
  const aboveAvg = county.density > avgDensity;

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const StatRow = ({ label, value, mono }) => (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '0.55rem 0', borderBottom: '1px solid #f3f4f6',
    }}>
      <span style={{ fontSize: 13, color: '#6b7280' }}>{label}</span>
      <span style={{
        fontSize: 13, fontWeight: 600, color: '#111827',
        fontFamily: mono ? 'DM Mono, monospace' : 'DM Sans, sans-serif',
      }}>{value}</span>
    </div>
  );

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '35vw',
      minWidth: 300,
      maxWidth: 440,
      height: '100vh',
      background: '#fff',
      boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
      zIndex: 200,
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      borderLeft: '1px solid #e5e7eb',
    }}>
      {/* Header */}
      <div style={{
        padding: '1.25rem 1.25rem 1rem',
        borderBottom: '1px solid #e5e7eb',
        background: '#f9fafb',
        position: 'sticky',
        top: 0,
        zIndex: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}>
        <div>
          <div style={{
            fontSize: 11, fontWeight: 600, color: '#9ca3af',
            textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4,
          }}>
            Detalle del condado
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#111827', lineHeight: 1.2 }}>
            {county.name}
          </div>
          <div style={{ marginTop: 6 }}>
            <span style={{
              background: tier.bg, color: tier.color,
              borderRadius: 20, padding: '3px 12px', fontSize: 12, fontWeight: 700,
            }}>
              {tier.label}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: '#f3f4f6', border: 'none', borderRadius: 8,
            width: 32, height: 32, cursor: 'pointer', fontSize: 18,
            color: '#6b7280', display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0, lineHeight: 1,
          }}
          title="Cerrar (Esc)"
        >
          ×
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: '1.25rem', flex: 1 }}>
        <div style={{
          fontSize: 11, fontWeight: 600, color: '#9ca3af',
          textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10,
        }}>
          Datos principales
        </div>
        <StatRow label="Región" value={county.region} />
        <StatRow label="Ciudad principal" value={county.city} />
        <StatRow label="Densidad" value={`${fmt(county.density)} hab/mi²`} mono />
        <StatRow label="Población total" value={fmt(county.pop)} mono />
        <StatRow label="Área" value={`${fmt(county.area)} mi²`} mono />
        <StatRow label="Rank estatal" value={`#${county.rank} de ${totalCounties}`} mono />

        {/* Density bar */}
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: '#6b7280' }}>Densidad relativa al máximo estatal</span>
            <span style={{ fontSize: 12, fontFamily: 'DM Mono, monospace', fontWeight: 600, color: tier.color }}>
              {Math.round((county.density / maxCountyDensity) * 100)}%
            </span>
          </div>
          <div style={{ height: 8, background: '#f3f4f6', borderRadius: 6, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${(county.density / maxCountyDensity) * 100}%`,
              background: tier.color,
              borderRadius: 6,
            }} />
          </div>
        </div>

        {/* Stats block */}
        <div style={{
          marginTop: '1.5rem',
          background: '#f8faff',
          border: '1px solid #dde6fb',
          borderRadius: 10,
          padding: '1rem',
        }}>
          <div style={{
            fontSize: 11, fontWeight: 600, color: '#1a56db',
            textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10,
          }}>
            Resumen estadístico
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>
              Está en el{' '}
              <strong style={{ color: '#1a56db' }}>top {topPct}%</strong>
              {' '}de densidad de Florida
            </div>
            <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>
              Es más denso que{' '}
              <strong style={{ color: '#111827' }}>{densierThan}</strong>
              {' '}de los {totalCounties} condados
            </div>
            <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>
              Densidad{' '}
              <strong style={{ color: aboveAvg ? '#0e9f6e' : '#c27803' }}>
                {aboveAvg ? 'superior' : 'inferior'}
              </strong>
              {' '}al promedio estatal ({fmt(avgDensity)} hab/mi²)
            </div>
            {county.rank === 1 && (
              <div style={{ fontSize: 13, color: '#1c64f2', fontWeight: 700, marginTop: 2 }}>
                El condado más denso de Florida
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DataTable({ data, sortBy, sortDir, onSort }) {
  const [hovered, setHovered] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [detailCounty, setDetailCounty] = useState(null);
  const selectAllRef = useRef(null);
  const maxDensity = data.reduce((m, c) => Math.max(m, c.density), 1);

  const allSelected = data.length > 0 && data.every(c => selectedIds.has(c.rank));
  const someSelected = data.some(c => selectedIds.has(c.rank));

  // Push main layout left when panel is open
  useEffect(() => {
    const appEl = document.querySelector('.app');
    if (!appEl) return;
    appEl.style.transition = 'padding-right 0.3s ease';
    appEl.style.paddingRight = detailCounty ? '35vw' : '0px';
  }, [detailCounty]);

  // Reset on unmount
  useEffect(() => () => {
    const appEl = document.querySelector('.app');
    if (appEl) { appEl.style.paddingRight = ''; appEl.style.transition = ''; }
  }, []);

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected && !allSelected;
      selectAllRef.current.checked = allSelected;
    }
  }, [allSelected, someSelected]);

  function toggleAll() {
    if (allSelected) {
      setSelectedIds(prev => { const n = new Set(prev); data.forEach(c => n.delete(c.rank)); return n; });
    } else {
      setSelectedIds(prev => { const n = new Set(prev); data.forEach(c => n.add(c.rank)); return n; });
    }
  }

  function toggleRow(rank) {
    setSelectedIds(prev => {
      const n = new Set(prev);
      n.has(rank) ? n.delete(rank) : n.add(rank);
      return n;
    });
  }

  const selectedCount = data.filter(c => selectedIds.has(c.rank)).length;
  const selectedRows = data.filter(c => selectedIds.has(c.rank));

  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 10,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '1rem 1.25rem 0.75rem', borderBottom: '1px solid #e5e7eb' }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Tabla de datos · {data.length} condados
          </span>
          <span style={{ marginLeft: 8, fontSize: 11, color: '#9ca3af' }}>
            · Click en una fila para ver el detalle
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '0.65rem 0.5rem 0.65rem 1rem', width: 36 }}>
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    onChange={toggleAll}
                    style={{ cursor: 'pointer', accentColor: '#1a56db', width: 15, height: 15 }}
                    title={allSelected ? 'Deseleccionar todos' : 'Seleccionar todos'}
                  />
                </th>
                {COLS.map(col => {
                  const sortable = col.sortable !== false;
                  const isActive = sortBy === col.key;
                  return (
                    <th
                      key={col.key}
                      onClick={sortable ? () => onSort(col.key) : undefined}
                      style={{
                        padding: '0.65rem 0.85rem',
                        textAlign: col.align,
                        fontWeight: 600,
                        color: isActive ? '#1a56db' : '#374151',
                        fontSize: 12,
                        whiteSpace: 'nowrap',
                        cursor: sortable ? 'pointer' : 'default',
                        userSelect: 'none',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {col.label}
                      {isActive && <span style={{ marginLeft: 4, fontSize: 10 }}>{sortDir === 'asc' ? '▲' : '▼'}</span>}
                      {sortable && !isActive && <span style={{ marginLeft: 4, fontSize: 10, color: '#d1d5db' }}>⇅</span>}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {data.map((c, i) => {
                const tier = getTier(c.density);
                const barPct = Math.round((c.density / maxDensity) * 100);
                const isHovered = hovered === c.rank;
                const isSelected = selectedIds.has(c.rank);
                const isDetail = detailCounty?.rank === c.rank;

                let rowBg = i % 2 === 0 ? '#fff' : '#fafafa';
                if (isSelected) rowBg = '#eef3ff';
                if (isDetail) rowBg = '#e8f0fe';
                if (isHovered && !isSelected && !isDetail) rowBg = '#f0f5ff';
                if (isHovered && (isSelected || isDetail)) rowBg = '#dde8ff';

                return (
                  <tr
                    key={c.rank}
                    onMouseEnter={() => setHovered(c.rank)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => setDetailCounty(prev => prev?.rank === c.rank ? null : c)}
                    style={{
                      borderBottom: isSelected ? '1px solid #c7d9f8' : '1px solid #f3f4f6',
                      borderLeft: isDetail ? '3px solid #1a56db' : '3px solid transparent',
                      background: rowBg,
                      transition: 'background 0.1s',
                      cursor: 'pointer',
                    }}
                  >
                    <td
                      style={{ padding: '0.6rem 0.5rem 0.6rem 1rem', textAlign: 'center' }}
                      onClick={e => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRow(c.rank)}
                        style={{ cursor: 'pointer', accentColor: '#1a56db', width: 15, height: 15 }}
                      />
                    </td>

                    <td style={{ padding: '0.6rem 0.85rem', textAlign: 'center' }}>
                      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, fontWeight: 500, color: '#9ca3af' }}>
                        {c.rank}
                      </span>
                    </td>

                    <td style={{ padding: '0.6rem 0.85rem', fontWeight: 600, color: '#111827' }}>
                      {c.name}
                    </td>

                    <td style={{ padding: '0.6rem 0.85rem', color: '#6b7280' }}>{c.region}</td>
                    <td style={{ padding: '0.6rem 0.85rem', color: '#6b7280' }}>{c.city}</td>

                    <td style={{ padding: '0.6rem 0.85rem', minWidth: 160 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, fontWeight: 500, color: '#111827', minWidth: 42, textAlign: 'right' }}>
                          {fmt(c.density)}
                        </span>
                        <div style={{ flex: 1, background: '#f3f4f6', borderRadius: 4, height: 6, minWidth: 60 }}>
                          <div style={{
                            width: `${barPct}%`, height: '100%',
                            background: tier.color, borderRadius: 4, opacity: 0.8,
                          }} />
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '0.6rem 0.85rem', textAlign: 'right', fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#374151' }}>
                      {fmt(c.pop)}
                    </td>
                    <td style={{ padding: '0.6rem 0.85rem', textAlign: 'right', fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#374151' }}>
                      {fmt(c.area)}
                    </td>

                    <td style={{ padding: '0.6rem 0.85rem', textAlign: 'center' }}>
                      <span style={{
                        background: tier.bg, color: tier.color,
                        borderRadius: 20, padding: '2px 10px',
                        fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap',
                      }}>
                        {tier.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {data.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '2.5rem', color: '#9ca3af', fontSize: 14 }}>
                    No hay condados que coincidan con los filtros seleccionados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action bar */}
      {selectedCount > 0 && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          background: '#1e293b', color: '#f8fafc', borderRadius: 12,
          padding: '0.7rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)', zIndex: 1000,
          whiteSpace: 'nowrap', fontSize: 13, fontWeight: 500,
        }}>
          <span style={{ color: '#94a3b8' }}>
            <span style={{ color: '#fff', fontWeight: 700 }}>{selectedCount}</span>
            {' '}condado{selectedCount !== 1 ? 's' : ''} seleccionado{selectedCount !== 1 ? 's' : ''}
          </span>
          <div style={{ width: 1, height: 20, background: '#334155' }} />
          <button onClick={() => exportCSV(selectedRows)} style={{
            background: '#334155', color: '#e2e8f0', border: 'none', borderRadius: 8,
            padding: '0.35rem 0.85rem', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: 5,
          }}>
            📄 Exportar CSV
          </button>
          <button onClick={() => exportExcel(selectedRows)} style={{
            background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: 8,
            padding: '0.35rem 0.85rem', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: 5,
          }}>
            📊 Exportar Excel
          </button>
          <button onClick={() => setSelectedIds(new Set())} style={{
            background: 'transparent', color: '#94a3b8',
            border: '1px solid #334155', borderRadius: 8,
            padding: '0.35rem 0.85rem', fontSize: 12, fontWeight: 500,
            cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
          }}>
            Limpiar selección
          </button>
        </div>
      )}

      {/* Detail panel — no overlay, pure sidebar */}
      {detailCounty && (
        <CountyDetailPanel
          county={detailCounty}
          onClose={() => setDetailCounty(null)}
        />
      )}
    </div>
  );
}
