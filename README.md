# Laboratorio Interactivo de Algoritmos Funcionales — UPSE

Plataforma académica de la cátedra **Programación Funcional** (Ingeniería de Software, 5to semestre).
Cada tema del sílabo se implementa con **doble funcionalidad**: una demostración del concepto
teórico y un **caso real** extraído de sistemas de producción (tarifas, nómina, ledgers, routers, KPIs).

## Stack

| Capa | Tecnología | Rol |
|------|-----------|-----|
| Backend | Haskell — GHC 9.6, Scotty, Aeson, wai-cors | API REST pura + capa IO |
| Frontend | React 18, Vite, Tailwind CSS, lucide-react | SPA con un panel por tema |
| Base de datos | PostgreSQL 16 (append-only) | `registro_laboratorio` |
| Orquestación | Docker Compose, red `red-funcional` | 3 contenedores |

## Levantar el proyecto

```bash
docker compose up --build -d
```

| Servicio | URL |
|----------|-----|
| Frontend (SPA) | http://localhost:5173 |
| Backend (API) | http://localhost:3000/api/health |
| PostgreSQL | localhost:5433 (upse_user / upse_password) |

Verificación rápida:

```bash
curl http://localhost:3000/api/health
# {"status":"UPSE Functional Backend Operativo"}
```

## Estructura

```
APP_FUNCIONAL/
├── docker-compose.yml          # Orquestación de los 3 servicios
├── init.sql                    # Esquema append-only + datos semilla
├── requerimientos.md           # Bitácora técnica y checklist del proyecto
├── silabo_contenidos.md        # Fuente de verdad temática (U1–U5)
├── backend-haskell/
│   ├── app.cabal               # Dependencias y módulos registrados
│   ├── Dockerfile              # haskell:9.6 (incluye toolchain completo)
│   └── src/
│       ├── Main.hs             # IMPERATIVE SHELL: rutas Scotty, JSON, IO
│       └── Modulos/            # FUNCTIONAL CORE: lógica 100% pura
│           ├── Unidad1.hs
│           └── Unidad2.hs
├── frontend-web/
│   └── src/
│       ├── App.jsx             # Router de temas
│       ├── components/Sidebar.jsx  # Menú del sílabo
│       └── views/              # Una vista por tema (demo + caso real)
└── docs/                       # Documentación académica (ver índice)
    ├── arquitectura.md
    ├── api.md
    ├── unidad-1.md
    ├── unidad-2.md
    └── retos.md
```

## Documentación para el estudiante

- **[docs/arquitectura.md](docs/arquitectura.md)** — Functional Core / Imperative Shell, flujo de una petición, servicios Docker.
- **[docs/api.md](docs/api.md)** — Referencia completa de endpoints con payloads y respuestas reales.
- **[docs/unidad-1.md](docs/unidad-1.md)** — Guía didáctica: paradigma declarativo, pattern matching, HOFs.
- **[docs/unidad-2.md](docs/unidad-2.md)** — Guía didáctica: lambdas, closures, inmutabilidad, pureza.
- **[docs/retos.md](docs/retos.md)** — Ejercicios graduados para extender el laboratorio.
