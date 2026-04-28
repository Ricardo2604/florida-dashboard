# 🌴 Florida Population Dashboard

Dashboard interactivo de densidad poblacional de los 67 condados de Florida.

## Inicio rápido

### Paso 1 — Abrir en VS Code
```bash
code florida-dashboard
```

### Paso 2 — Abrir Claude Code en la terminal integrada
```bash
claude
```

### Paso 3 — Pegar el prompt
Abre el archivo `PROMPT.md`, copia TODO su contenido y pégalo en Claude Code.

### Paso 4 — Instalar e iniciar
Una vez que Claude Code termine de generar los archivos:
```bash
npm install
npm start
```

La app abre automáticamente en **http://localhost:3000**

---

## Archivos del proyecto

```
florida-dashboard/
├── PROMPT.md              ← prompt completo para Claude Code
├── package.json
├── public/
│   └── index.html
└── src/
    ├── App.jsx            ← componente principal (Claude Code lo reemplaza)
    ├── index.js
    └── data/
        └── counties.js    ← datos de los 67 condados ✅
```

## Fuentes de datos

- U.S. Census Bureau — 2020 Census (densidad por condado)
- U.S. Census Bureau — ACS 2024 5-Year Estimates (población)
- BEBR, University of Florida (análisis demográfico)
- Florida Office of Economic & Demographic Research (proyecciones)
