# ESPECIFICACIÓN Y REGISTRO DE REQUERIMIENTOS: LABORATORIO FUNCIONAL

**Materia:** Programación Funcional (Nivel 5) - UPSE  
**Docente:** Ing. Carlos Muñoz Mendoza  
**Stack Base:** Haskell (GHC 9.6 / Scotty), React 18 (Vite + Tailwind CSS), PostgreSQL 16, Docker Compose.

---

## 1. Arquitectura Base del Entorno

| Componente | Especificación Técnica | Estado |
| :--- | :--- | :--- |
| **Infraestructura** | Red `red-funcional` con Docker Compose multcontenedor | ✅ Implementado |
| **Base de Datos** | PostgreSQL 16 append-only con tabla `registro_laboratorio` | ✅ Implementado |
| **Backend** | API REST en Haskell con Scotty, Aeson y middleware CORS | ✅ Implementado |
| **Frontend** | SPA con Layout modular (Sidebar con temas del sílabo + panel dinámico) | ✅ Implementado |

---

## 2. Registro Modular de Funcionalidades por Unidad

> **Estructura dual por tema:** cada tema implementa (a) una *funcionalidad demostrativa* del concepto teórico y (b) un *caso real aplicado* que resuelve un problema de sistemas de producción (inserción de datos, cálculo de valores de negocio, lectura de archivos, consultas a PostgreSQL, etc.). Ambos comparten el mismo módulo puro y la misma vista.

### UNIDAD 1: Fundamentos y Pensamiento Funcional
- [x] **U1-T1: Del "Cómo" al "Qué" — Cambio de Paradigma**
  - *Backend:* Endpoint `POST /api/u1/paradigma` que evalúa `sum . map (^2) . filter even` (composición declarativa) sobre una lista.
  - *Frontend:* `U1ParadigmaView.jsx` con comparador visual de pseudocódigo imperativo vs. funcional.
  - [x] *Caso real — Reporte declarativo de ventas:* `POST /api/u1/reporte-ventas` filtra un dataset de ventas por estado (`pendiente`/`aprobada`/`rechazada`) y agrega el monto total — el tipo de consulta declarativa que un reporte gerencial real ejecuta a diario.
- [x] **U1-T2: Pattern Matching Estructural**
  - *Backend:* Endpoint `POST /api/u1/figuras` que calcula áreas de un ADT `Figura` (Circulo/Rectangulo/Triangulo) por despacho estructural sobre cada constructor.
  - *Frontend:* `U1PatternView.jsx` con constructor interactivo de figuras.
  - [x] *Caso real — Router de eventos transaccionales:* `POST /api/u1/eventos` despacha eventos bancarios (`deposito`/`retiro`/`transferencia`) por patrón + guardas de monto, devolviendo canal, prioridad y requisito de PIN — como un switch de mensajes productivo.
- [x] **U1-T3: Funciones de Orden Superior (HOFs)**
  - *Backend:* Endpoint `POST /api/u1/hof` que aplica la operación solicitada (`map`, `filter` o `fold`) a una lista, mostrando que la estructura de recorrido es universal y solo cambia la función inyectada.
  - *Frontend:* `U1HofView.jsx` con selector de operación y panel de KPIs.
  - [x] *Caso real — KPIs de ventas por agregación:* `POST /api/u1/kpi` reduce un dataset de montos con folds para devolver total, promedio, máximo y mínimo — el núcleo de cualquier panel analítico.

---

### UNIDAD 2: Patrones Funcionales Esenciales
- [x] **U2-T1: Lambdas y la HOF Universal**
  - *Backend:* Endpoint `POST /api/u2/lambdas` que inyecta lambdas anónimas (`\x -> ...`) en `map` según la operación solicitada.
  - *Frontend:* `U2LambdasView.jsx` con selector de lambda y visor de JSON.
  - [x] *Caso real — Liquidación de pedido:* `POST /api/u2/pipeline-pedidos` compone lambdas de negocio (`subtotal → descuento 10% si >100 → IVA 12%`) aplicadas a cada línea del pedido y devuelve el total — un motor de cálculo de e-commerce real.
- [x] **U2-T2: Closures y Estado Encapsulado**
  - *Backend:* Endpoint `POST /api/u2/closures` que captura un factor inmutable y transforma una lista mediante `map`.
  - *Frontend:* `U2ClosuresView.jsx` con formulario de entrada y visor de JSON.
  - [x] *Caso real — Motor de tarifas (pricing engine):* un closure captura una sola vez la configuración vigente (tasa IVA, moneda, descuento por volumen) y genera las funciones de cálculo para todo el catálogo. Endpoint `POST /api/u2/tarifas` que recibe productos, calcula el precio final de cada uno y persiste la operación (`INSERT` append-only en `registro_laboratorio`).
- [x] **U2-T3: El Principio de Inmutabilidad**
  - *Backend:* Endpoint `POST /api/u2/inmutabilidad` que demuestre la preservación del estado original $A \to B$.
  - *Frontend:* Comparador interactivo de listas antes/después de la transformación (`U2InmutabilidadView.jsx`).
  - [x] *Caso real — Ledger de cuenta bancaria:* aplicar una secuencia de movimientos (créditos/débitos) sobre un saldo inicial mediante `scanl`, produciendo la cadena completa de estados nuevos sin mutar jamás el saldo original (auditoría punto a punto). Endpoint `POST /api/u2/ledger` que devuelve el historial de saldos e inserta el evento en `registro_laboratorio`. Vista: línea de tiempo del saldo antes/después de cada movimiento.
- [x] **U2-T4: Pureza y Efectos Secundarios**
  - *Backend:* Endpoint `GET /api/u2/pureza/:num` con validación de Razonamiento Ecuacional ($f(x) + f(x) = 2 \cdot f(x)$).
  - *Frontend:* `U2PurezaView.jsx` con panel de comprobación matemática.
  - [x] *Caso real — Liquidador de nómina:* función 100% pura `liquidarSueldo :: Double -> [Double] -> Nomina` que calcula sueldo neto = bruto − deducciones. Al ser determinista y sin efectos, el mismo rol de pagos siempre produce el mismo resultado auditable. Endpoint `POST /api/u2/nomina` que calcula la nómina y registra la liquidación en `registro_laboratorio` (el `INSERT` queda confinado a la capa `IO` de `Main`, separando cálculo puro de efecto).

---

### UNIDAD 3: Manejo de Efectos y Tipos Algebraicos
- [ ] **U3-T1: Ausencia de Valor (`Maybe`)**
  - *Requerimiento:* Endpoint de búsqueda de registros en PostgreSQL que retorne `Just record` o `Nothing` sin lanzar errores de puntero nulo (`null`).
  - *Vista:* Buscador por ID con interfaz amigable de resultado encontrado/ausente.
  - [ ] *Caso real — Consulta de cliente por ID:* `GET /api/u3/clientes/:id` ejecuta un `SELECT` real sobre PostgreSQL y responde `200 + Just cliente` con los datos o `404 + Nothing` con mensaje tipado "cliente no registrado". Demuestra que los sistemas reales modelan la ausencia en el tipo, no con `null` ni excepciones.
- [ ] **U3-T2: Manejo Funcional de Errores (`Either`)**
  - *Requerimiento:* Validador transaccional que devuelva `Left ErrorValidacion` o `Right TransaccionValida`.
  - *Vista:* Formularios de débito bancario con retroalimentación tipada de errores sin excepciones.
  - [ ] *Caso real — Procesador de débito bancario:* `POST /api/u3/debito` valida una operación real (monto > 0, saldo suficiente, cuenta activa) devolviendo `Left ErrorValidacion` con el motivo tipado o `Right DebitoAprobado`. Tanto los intentos aprobados como los rechazados se insertan append-only en `registro_laboratorio`, igual que un log de transacciones productivo.
- [ ] **U3-T4: Generadores y Evaluación Lazy**
  - *Requerimiento:* Endpoint que exponga un stream infinito de datos evaluado con consumo acotado (`take n`).
  - *Vista:* Consola interactiva de simulación de telemetría bajo demanda.
  - [ ] *Caso real — Telemetría industrial bajo demanda:* `GET /api/u3/telemetria/:n` genera una lista infinita perezosa de lecturas de sensores (temperatura, presión, timestamp) y solo materializa las `n` que el cliente solicita con `take`. Aplicable a procesamiento de logs/archivos gigantes donde cargar todo en memoria es inviable — en Haskell la lectura diferida evalúa solo lo consumido.

---

### UNIDAD 4: Concurrencia y Arquitectura
- [ ] **U4-T1: Concurrencia y Paralelismo**
  - *Requerimiento:* Procesamiento concurrente de tareas puras utilizando la biblioteca `async` sin condiciones de carrera.
  - [ ] *Caso real — Consolidación concurrente de reportes:* `POST /api/u4/reporte` lanza en paralelo con `mapConcurrently` el cálculo de agregados (ventas, promedio, máximo) de varias sucursales y combina los resultados, midiendo y devolviendo el tiempo secuencial vs. concurrente. Demuestra la ventaja real de los hilos ligeros en cargas de consolidación de datos.
- [ ] **U4-T3: Testing Funcional con QuickCheck**
  - *Requerimiento:* Módulo de pruebas basadas en propiedades automáticas (generación de 100 casos aleatorios).
  - [ ] *Caso real — Verificación del motor de cálculo:* `GET /api/u4/quickcheck` ejecuta propiedades QuickCheck sobre las funciones de negocio ya construidas (p. ej. `neto ≤ bruto`, `precio ≥ 0`, `length (map f xs) == length xs`, idempotencia de ordenamiento) con 100 casos aleatorios y reporta cuáles pasaron — QA automático como en un pipeline de CI real.
- [ ] **U4-T4: Arquitectura Funcional**
  - *Requerimiento:* Integración desacoplada *Ports and Adapters* consolidada.
  - [ ] *Caso real — Pipeline transaccional end-to-end:* `POST /api/u4/pipeline` implementa el flujo completo de un sistema productivo: entrada HTTP (adaptador) → validación `Either` → transformación pura (núcleo) → `INSERT` en PostgreSQL (adaptador) → respuesta JSON. Es el ejemplo canónico de *Functional Core, Imperative Shell* aplicado a una transacción real.

---

### UNIDAD 5: Proyecto Final Integrador
- [ ] **Sistema Transaccional Completo**
  - *Requerimiento:* Integración de todos los módulos en una plataforma real de eventos financieros o telemetría industrial con persistencia en PostgreSQL y panel web integral.
  - [ ] *Caso real — Plataforma operativa final:* aplicación de producción simulada (billetera de eventos financieros o consola de telemetría) donde cada módulo aporta su caso real: tarifas por closures, ledger inmutable, nómina pura, consultas `Maybe`, validación `Either`, streams lazy, consolidación concurrente, tests de propiedades y pipeline transaccional — todo con persistencia append-only y panel web integral.

---

## 3. Documentación Académica y Recursos del Estudiante

> El proyecto es material didáctico: cada pieza de código implementado debe existir también como recurso de aprendizaje. Toda nueva funcionalidad se documenta en el archivo de su unidad antes de marcarse `[x]`.

| Recurso | Contenido | Estado |
| :--- | :--- | :--- |
| `README.md` | Visión general, stack, levantamiento con Docker, mapa de carpetas | ✅ Implementado |
| `docs/arquitectura.md` | *Functional Core / Imperative Shell*, flujo de petición, servicios Docker, CORS, append-only, protocolo de nuevos temas | ✅ Implementado |
| `docs/api.md` | Referencia de los 15 endpoints con payloads y respuestas JSON reales verificadas | ✅ Implementado |
| `docs/unidad-1.md` | Guía didáctica U1: paradigma declarativo, pattern matching, HOFs (concepto → demo → caso real → preguntas) | ✅ Implementado |
| `docs/unidad-2.md` | Guía didáctica U2: lambdas, closures, inmutabilidad, pureza (concepto → demo → caso real → preguntas) | ✅ Implementado |
| `docs/retos.md` | Banco de ejercicios graduados (🟢/🟡/🔴) + retos integradores + rúbrica docente | ✅ Implementado |
| `docs/guia-estudiante.md` | Guía de instalación: requisitos, clone, `docker compose up`, URLs, troubleshooting y flujo de estudio — publicada en Moodle | ✅ Implementado |
| `docs/unidad-3.md` | Guía didáctica U3 (Maybe/Either/Lazy) — se crea al implementar la unidad | ⬜ Pendiente |
| `docs/unidad-4.md` | Guía didáctica U4 (concurrencia, QuickCheck, arquitectura) — se crea al implementar la unidad | ⬜ Pendiente |
| `docs/unidad-5.md` | Guía del proyecto final integrador | ⬜ Pendiente |

**Regla de documentación:** cada guía `docs/unidad-N.md` sigue la plantilla fija —
*Concepto → Demo en el laboratorio (endpoint + curl) → Caso real (código + dominio) → Preguntas para razonar en clase*.

---

## 4. Protocolo de Incorporación de Nuevos Temas
Al agregar un nuevo módulo:
1. Crear el archivo de lógica pura en `backend-haskell/src/Modulos/UnidadX.hs`.
2. Registrar el módulo en `backend-haskell/app.cabal` bajo `other-modules`.
3. Exponer la ruta en `backend-haskell/src/Main.hs`.
4. Crear la vista correspondiente en `frontend-web/src/views/UXTemaView.jsx`.
5. Habilitar el ítem en `frontend-web/src/components/Sidebar.jsx` cambiando `disponible: true`.
6. Marcar la casilla `[x]` en este documento.