import React, { useState, useMemo, useCallback } from 'react';
import { counties, sources } from './data/counties';
import './App.css';
import KPICards from './components/KPICards';
import FilterBar from './components/FilterBar';
import DataTable from './components/DataTable';
import BarChartTop15 from './components/BarChartTop15';
import ScatterPlot from './components/ScatterPlot';
import ExportButtons from './components/ExportButtons';
import SourcesPanel from './components/SourcesPanel';

function App() {
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [densityTier, setDensityTier] = useState('');
  const [sortBy, setSortBy] = useState('density');
  const [sortDir, setSortDir] = useState('desc');

  const filtered = useMemo(() => {
    return counties
      .filter(c => {
        const matchSearch = !search ||
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.city.toLowerCase().includes(search.toLowerCase());
        const matchRegion = !selectedRegion || c.region === selectedRegion;
        const matchTier = !densityTier ||
          (densityTier === 'alta' && c.density > 500) ||
          (densityTier === 'media' && c.density >= 100 && c.density <= 500) ||
          (densityTier === 'baja' && c.density < 100);
        return matchSearch && matchRegion && matchTier;
      })
      .sort((a, b) => {
        const mult = sortDir === 'asc' ? 1 : -1;
        if (['name', 'region', 'city'].includes(sortBy)) {
          return mult * a[sortBy].localeCompare(b[sortBy]);
        }
        return mult * (a[sortBy] - b[sortBy]);
      });
  }, [search, selectedRegion, densityTier, sortBy, sortDir]);

  const clearFilters = useCallback(() => {
    setSearch('');
    setSelectedRegion('');
    setDensityTier('');
  }, []);

  const handleSort = useCallback((col) => {
    if (sortBy === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortDir('desc');
    }
  }, [sortBy]);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1 className="header-title">🗺 Florida Population Dashboard</h1>
            <p className="header-subtitle">Densidad poblacional · 67 condados · Datos Census 2020 + ACS 2024</p>
          </div>
          <ExportButtons filtered={filtered} />
        </div>
      </header>

      <main className="app-main">
        <KPICards filtered={filtered} total={counties.length} />

        <FilterBar
          search={search}
          setSearch={setSearch}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          densityTier={densityTier}
          setDensityTier={setDensityTier}
          clearFilters={clearFilters}
          totalFiltered={filtered.length}
          total={counties.length}
        />

        <DataTable
          data={filtered}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={handleSort}
        />

        {(search || selectedRegion || densityTier) && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={clearFilters}
              style={{
                background: '#fff',
                border: '1px solid #d1d5db',
                borderRadius: 8,
                padding: '0.55rem 1.25rem',
                fontSize: 13,
                fontFamily: 'DM Sans, sans-serif',
                color: '#374151',
                cursor: 'pointer',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              }}
            >
              ← Ver todos los condados
            </button>
          </div>
        )}

        <div className="charts-grid">
          <BarChartTop15 filtered={filtered} />
          <ScatterPlot filtered={filtered} />
        </div>

        <SourcesPanel sources={sources} />
      </main>
    </div>
  );
}

export default App;
