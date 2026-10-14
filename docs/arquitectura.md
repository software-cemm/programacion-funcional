# Arquitectura del Laboratorio — Functional Core, Imperative Shell

## 1. El principio rector del proyecto

Todo el backend obedece una única regla arquitectónica, que además es uno de los
temas del sílabo (U4-T4):

```
┌────────────────────────────────────────────────────┐
│  IMPERATIVE SHELL  (capa impura, delgada)          │
│  src/Main.hs                                       │
│  · Rutas Scotty, HTTP, JSON, IO, red, base de datos │
├────────────────────────────────────────────────────┤
│  FUNCTIONAL CORE  (núcleo puro, grueso)            │
│  src/Modulos/UnidadX.hs                            │
│  · Toda la lógica: funciones puras, ADTs,          │
│    pattern matching, HOFs, sin IO, determinista    │
└────────────────────────────────────────────────────┘
```

**Regla de oro:** en `Modulos/` jamás aparece `IO`. Una función pura recibe datos,
devuelve datos. El efecto (leer el body HTTP, escribir en PostgreSQL) vive solo en
`Main.hs`. Esto es exactamente cómo se estructura el software funcional en producción:
el núcleo es trivialmente testeable y razonable; la cáscara es delgada e intercambiable.

## 2. Flujo de una petición (ejemplo real)

`POST /api/u2/nomina {"bruto":1500,"deducciones":[150,75.5,30]}`

```
Browser (fetch) ──HTTP──▶ Scotty (Warp :3000)
                              │
                   1. jsonData :: ActionM ReqNomina   ← IO: deserializa JSON
                              │
                   2. U2.procesarNomina 1500 [150,75.5,30]
                      └── núcleo puro: liquidarSueldo = br - sum ds
                              │
                   3. json $ Value                     ← IO: serializa respuesta
                              │
Browser ◀──JSON── {"neto":1244.5, "verificacion_pura":true}
```

El estudiante debe notar: toda la decisión de negocio ocurre en el paso 2,
que es una función pura `Double -> [Double] -> Value`. Podría probarse en GHCi
sin levantar ningún servidor.

## 3. Servicios Docker

| Servicio | Imagen | Puerto host→contenedor | Responsabilidad |
|----------|--------|------------------------|-----------------|
| `postgres-db` | postgres:16-alpine | 5433→5432 | Tabla `registro_laboratorio` (append-only) |
| `backend-haskell` | build local (haskell:9.6) | 3000→3000 | API Scotty |
| `frontend-web` | build local (node:20-alpine) | 5173→5173 | Dev server Vite con hot-reload |

- Red interna `red-funcional` (bridge): los contenedores se resuelven por nombre
  de servicio (p. ej. `postgres-db`).
- El frontend monta `./frontend-web` sobre `/app` (hot-reload) protegiendo
  `node_modules` con un volumen anónimo.
- El backend **no** monta volumen: `dist-newstyle` queda dentro de la imagen y
  `cabal run` arranca el binario ya compilado.

## 4. CORS

`wai-cors` con política explícita en `Main.hs`: origen abierto (`*`) +
`Content-Type`/`Authorization` permitidos. Nota didáctica: `simpleCors` **no**
admite `Content-Type: application/json` en el preflight — fue un bug real que
este proyecto resolvió; los estudiantes pueden reproducirlo revisando el commit.

## 5. Persistencia: filosofía append-only

`init.sql` crea `registro_laboratorio` — tabla donde los eventos **solo se
insertan, nunca se actualizan ni borran**. Es la aplicación en base de datos del
principio de inmutabilidad (U2-T3): el estado actual no se muta, se **deriva**
reduciendo el historial de eventos — exactamente lo que `scanl` hace con el
ledger bancario en `/api/u2/ledger`.

## 6. Cómo agregar un tema nuevo (protocolo)

1. Lógica pura en `src/Modulos/UnidadX.hs` (sin `IO`).
2. Registrar el módulo en `app.cabal → other-modules`.
3. Ruta Scotty en `src/Main.hs` (deserializa → llama núcleo puro → serializa).
4. Vista en `frontend-web/src/views/UXTemaView.jsx` (panel config + visor JSON).
5. Habilitar `disponible: true` en `Sidebar.jsx` y el `case` en `App.jsx`.
6. Marcar `[x]` en `requerimientos.md`.
