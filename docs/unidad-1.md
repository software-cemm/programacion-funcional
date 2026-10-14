# Guía Didáctica — Unidad 1: Fundamentos y Pensamiento Funcional

> Cada tema se estudia en tres capas: **concepto** (qué es) → **demo** (código mínimo en el laboratorio) → **caso real** (el mismo concepto resolviendo un problema de producción). El código puro vive en `backend-haskell/src/Modulos/Unidad1.hs`; la capa HTTP en `src/Main.hs`.

---

## U1-T1 · Del "Cómo" al "Qué" — El Cambio de Paradigma

### Concepto
La programación imperativa describe **cómo** llegar al resultado (bucles, acumuladores mutables, orden de pasos). La funcional describe **qué** es el resultado (composición de transformaciones sobre datos). No hay "el paso siguiente": hay una definición.

```haskell
-- Imperativo (pseudocódigo):      -- Funcional (Haskell):
acc = 0                            sumaCuadradosPares :: [Int] -> Int
for x in lista:                    sumaCuadradosPares = sum . map (^2) . filter even
  if x mod 2 == 0: acc += x*x
```

La versión funcional se lee como la especificación matemática: *"suma los cuadrados de los pares"*. Nótese la **composición** `(.)`: cada función transforma la lista completa y pasa el resultado a la siguiente — un pipeline declarativo.

### Demo en el laboratorio
`POST /api/u1/paradigma` evalúa la composición sobre tu lista y devuelve la receta usada.

```bash
curl -X POST localhost:3000/api/u1/paradigma -H "Content-Type: application/json" \
  -d '{"numeros":[1,2,3,4,5,6]}'        # → resultado: 56  (4+16+36)
```

### Caso real — Reporte declarativo de ventas
`POST /api/u1/reporte-ventas` filtra un dataset por estado y agrega totales. Es exactamente lo que hace un `WHERE estado = 'pendiente'` en SQL o un `.filter().sum()` en cualquier backend — la consulta **declara** el criterio, no el recorrido.

```haskell
filtrarPorEstado est = filter ((== est) . ventaEstado)
totalEstado est      = sum . map ventaMonto . filtrarPorEstado est
```

---

## U1-T2 · Pattern Matching Estructural

### Concepto
En vez de inspeccionar un dato con `if/else` en cadena, se **deconstruye por su forma**: el compilador exige una ecuación por constructor posible — cobertura exhaustiva garantizada. Funciona sobre tipos algebraicos (ADT), listas (`x:xs`, `[]`), tuplas y con **guardas** para condiciones extra.

```haskell
data Figura = Circulo Double | Rectangulo Double Double | Triangulo Double Double

area :: Figura -> Double
area (Circulo r)      = pi * r * r        -- una ecuación por constructor
area (Rectangulo b h) = b * h
area (Triangulo b h)  = b * h / 2
```

Y sobre la estructura de la lista de parámetros (`(r:_)` = "al menos un elemento"):

```haskell
construirFigura :: String -> [Double] -> Maybe Figura
construirFigura "circulo"    (r:_)   = Just (Circulo r)
construirFigura "rectangulo" (b:h:_) = Just (Rectangulo b h)
construirFigura _            _       = Nothing   -- caso comodín obligatorio
```

### Demo en el laboratorio
`POST /api/u1/figuras` construye la figura haciendo matching del tipo y de la lista, y devuelve su área.

### Caso real — Router de eventos transaccionales
`POST /api/u1/eventos` es un **switch de despacho bancario**: cada evento (depósito, retiro, transferencia) define canal, prioridad y si exige PIN, con **guardas de monto**:

```haskell
enrutarEvento "deposito" monto
  | monto > 10000 = Accion "compliance"    "alta" False   -- guarda
  | otherwise     = Accion "core-bancario" "baja" False
enrutarEvento "transferencia" _ = Accion "switch-interbancario" "alta" True
enrutarEvento _               _ = Accion "rechazado"            "nula" False
```

Es el mismo patrón de los routers de mensajes, dispatchers de comandos y parsers de producción — en vez de `switch/if` anidados frágiles, ecuaciones legibles y exhaustivas.

---

## U1-T3 · Funciones de Orden Superior (HOFs)

### Concepto
Una HOF **recibe funciones como argumento** (o las devuelve). La estructura de recorrido es universal; solo cambia la función inyectada. Las tres reinas:

| HOF | Contrato | Hace |
|-----|----------|------|
| `map` | `(a -> b) -> [a] -> [b]` | transforma cada elemento |
| `filter` | `(a -> Bool) -> [a] -> [a]` | conserva los que cumplen |
| `foldl`/`foldr` | `(b -> a -> b) -> b -> [a] -> b` | reduce todo a un valor |

```haskell
map    (\x -> x * 2) [1,2,3]   -- [2,4,6]
filter (> 0)         [-2,5,-1] -- [5]
foldl  (+) 0         [1,2,3]   -- 6   (sum es foldl (+) 0)
```

### Demo en el laboratorio
`POST /api/u1/hof` recibe el nombre de la operación y la lista; el backend selecciona la HOF y la función a inyectar — **seis operaciones, una sola maquinaria**.

### Caso real — KPIs de ventas por agregación
`POST /api/u1/kpi` reduce un dataset de montos con folds: total, promedio, máximo y mínimo. Es el corazón de cualquier endpoint analítico (`/metrics`, dashboards, reportes) — agregación como reducción funcional.

---

## Preguntas para razonar en clase

1. Si `sumaCuadradosPares` se aplicara a una lista **infinita**, ¿dónde fallaría? ¿Por qué Haskell puede definirla aun así? (anticipo: U3-T4 evaluación lazy)
2. En `construirFigura`, ¿qué pasa si quitas la última ecuación comodín? Pruébalo y lee el warning `-Wincomplete-patterns` de GHC.
3. Reescribe `product` y `maximum` como un solo `foldl`. ¿Qué valor inicial necesita cada uno?
