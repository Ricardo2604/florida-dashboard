# 🗺️ PROMPT PARA CLAUDE CODE — Florida Population Dashboard

## Contexto del proyecto

Estoy construyendo un **dashboard interactivo de densidad poblacional** de los 67 condados de Florida para una investigación empresarial. Ya tengo la estructura base del proyecto React y todos los datos en `src/data/counties.js`.

---

## Lo que necesito que construyas

Toma el archivo `src/App.jsx` existente y reemplázalo con una aplicación completa, visualmente profesional y funcional. El diseño debe sentirse como una herramienta de análisis de datos seria — limpia, precisa, con datos al frente.

---

## Funcionalidades requeridas (implementa TODAS)

### 1. Header / KPI Cards
Muestra 4 tarjetas de métricas en la parte superior:
- Total de condados mostrados (dinámico según filtros)
- Población total sumada de los condados filtrados
- Densidad promedio de los condados filtrados
- Condado con mayor densidad en la selección actual

### 2. Filtros avanzados (barra de filtros)
- Búsqueda por texto (nombre de condado o ciudad)
- Selector de región: Todas, Sur, Central, Tampa Bay, Norte, Suroeste, Costa Este, Panhandle
- Selector de nivel de densidad: Todos, Alta (>500 hab/mi²), Media (100–500), Baja (<100)
- Botón "Limpiar filtros" que resetea todo
- Contador que muestra "X de 67 condados"

### 3. Tabla de datos interactiva
Columnas: Rank | Condado | Región | Ciudad principal | Densidad (hab/mi²) con barra visual | Población | Área (mi²) | Nivel
- Ordenable por cualquier columna (clic en encabezado alterna asc/desc)
- Barra de densidad visual proporcional al máximo del dataset filtrado
- Badge de color por nivel: Alta = azul, Media = verde, Baja = amarillo
- Highlight de fila al hacer hover

### 4. Gráfica de barras horizontales
Usa Recharts (`BarChart` horizontal). Muestra los TOP 15 condados por densidad del resultado filtrado. Tooltip con datos completos al hover. Ejes bien formateados.

### 5. Gráfica de dispersión (Scatter)
Usa Recharts `ScatterChart`. Eje X = Población, Eje Y = Densidad. Cada punto es un condado. Tooltip con nombre, densidad y población. Colores por región.

### 6. Exportación de datos
Implementa exportación usando la librería `xlsx` (ya en package.json):
- Botón "Exportar CSV" — descarga solo los condados filtrados actualmente
- Botón "Exportar Excel (.xlsx)" — descarga con formato: encabezados en negrita, columnas auto-ajustadas, una hoja llamada "Florida Counties"
- El archivo exportado debe incluir: Rank, Condado, Región, Ciudad, Densidad, Población, Área, Nivel
- El nombre del archivo debe incluir la fecha: `florida_condados_2024-01-15.xlsx`

### 7. Panel de fuentes
Al pie de la página, sección "Fuentes de datos" que lista las 4 fuentes del array `sources` de counties.js, cada una como link clicable.

---

## Stack y restricciones técnicas

- React 18 con hooks (useState, useMemo, useCallback)
- Recharts para todas las gráficas
- xlsx para exportación
- CSS-in-JS (estilos inline o módulos CSS) — NO usar Tailwind ni styled-components
- NO usar ninguna librería UI externa (no MUI, no Ant Design, no Chakra)
- Diseño responsive, funcional en pantallas de 1280px+
- Todos los textos de la UI en español

## Paleta de colores a usar
```
--primary: #1a56db        (azul fuerte para acciones principales)
--primary-light: #e8f0fe  (fondo azul suave)
--success: #0e9f6e        (verde para densidad alta)
--warning: #c27803        (amarillo/naranja para densidad media)
--info: #1c64f2           (azul para densidad baja)
--text: #111827
--text-muted: #6b7280
--border: #e5e7eb
--bg: #f9fafb
--white: #ffffff
```

## Tipografía
Usa Google Fonts: `'DM Sans'` para UI general, `'DM Mono'` para números y datos.
Agrega el import al `public/index.html`.

---

## Estructura de archivos a crear/modificar

```
src/
  App.jsx              ← reemplazar completamente
  App.css              ← crear con estilos globales y reset
  components/
    KPICards.jsx       ← las 4 tarjetas de métricas
    FilterBar.jsx      ← todos los filtros
    DataTable.jsx      ← tabla ordenable con barras
    BarChartTop15.jsx  ← gráfica de barras Recharts
    ScatterPlot.jsx    ← gráfica de dispersión Recharts
    ExportButtons.jsx  ← botones CSV y Excel con lógica xlsx
    SourcesPanel.jsx   ← panel de fuentes al pie
public/
  index.html           ← agregar import de Google Fonts
```

---

## Notas de implementación importantes

1. En `ExportButtons.jsx`, importa xlsx así: `import * as XLSX from 'xlsx'`
2. La función de exportación Excel debe crear el workbook, agregar encabezados en la fila 1 con negrita, y usar `XLSX.utils.aoa_to_sheet` o `json_to_sheet`
3. La exportación debe operar sobre el array `filtered` que se pasa como prop (no sobre todos los datos)
4. Las gráficas deben tener `ResponsiveContainer` envolviendo cada chart para adaptarse al ancho
5. En la tabla, el sort por columna debe mostrar un indicador visual (▲ ▼) en el encabezado activo

---

## Comando para empezar después de que Claude Code termine

```bash
npm install
npm start
```

La app abre en http://localhost:3000

---

*Datos fuente: U.S. Census Bureau 2020 Census + ACS 2024 Five-Year Estimates. 67 condados de Florida con densidad, población, área y región.*
