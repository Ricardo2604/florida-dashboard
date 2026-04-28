import React from 'react';
import * as XLSX from 'xlsx';

function getTierLabel(density) {
  if (density > 500) return 'Alta';
  if (density >= 100) return 'Media';
  return 'Baja';
}

const today = () => new Date().toISOString().slice(0, 10);

const HEADERS = ['Rank', 'Condado', 'Región', 'Ciudad', 'Densidad (hab/mi²)', 'Población', 'Área (mi²)', 'Nivel'];

function toRows(filtered) {
  return filtered.map(c => [
    c.rank, c.name, c.region, c.city, c.density, c.pop, c.area, getTierLabel(c.density),
  ]);
}

function exportCSV(filtered) {
  const rows = toRows(filtered);
  const csv = [HEADERS, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `florida_condados_${today()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportExcel(filtered) {
  const rows = toRows(filtered);
  const ws = XLSX.utils.aoa_to_sheet([HEADERS, ...rows]);

  // Bold header row
  const range = XLSX.utils.decode_range(ws['!ref']);
  for (let C = range.s.c; C <= range.e.c; C++) {
    const addr = XLSX.utils.encode_cell({ r: 0, c: C });
    if (!ws[addr]) continue;
    ws[addr].s = { font: { bold: true } };
  }

  // Auto-width columns
  ws['!cols'] = HEADERS.map((h, i) => ({
    wch: Math.max(h.length, ...rows.map(r => String(r[i]).length)) + 2,
  }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Florida Counties');
  XLSX.writeFile(wb, `florida_condados_${today()}.xlsx`);
}

const btnBase = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  padding: '0.45rem 0.9rem',
  fontSize: 13,
  fontFamily: 'DM Sans, sans-serif',
  fontWeight: 500,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'background 0.15s, border-color 0.15s',
};

export default function ExportButtons({ filtered }) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <button
        onClick={() => exportCSV(filtered)}
        style={{ ...btnBase, background: '#f9fafb', color: '#374151' }}
        title={`Exportar ${filtered.length} condados como CSV`}
      >
        📄 Exportar CSV
      </button>
      <button
        onClick={() => exportExcel(filtered)}
        style={{ ...btnBase, background: '#e8f0fe', color: '#1a56db', borderColor: '#bdd0fb' }}
        title={`Exportar ${filtered.length} condados como Excel`}
      >
        📊 Exportar Excel
      </button>
    </div>
  );
}
