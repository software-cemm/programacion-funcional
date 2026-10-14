# Guía Didáctica — Unidad 2: Patrones Funcionales Esenciales

> Código puro en `backend-haskell/src/Modulos/Unidad2.hs` · rutas en `src/Main.hs` · vistas en `frontend-web/src/views/`.

---

## U2-T1 · Lambdas y la HOF Universal

### Concepto
Una **lambda** (`\x -> cuerpo`) es una función anónima creada exactamente donde se necesita. No requiere nombre, declaración previa ni archivo aparte. La HOF que la recibe (p. ej. `map`) no sabe qué hace — solo su tipo. Ese desacoplamiento es el punto: **el mecanismo de recorrido es fijo; la política es inyectable**.

```haskell
map (\x -> x + 1) [1,2,3]        -- [2,3,4]  lambda creada en el sitio
map (\x -> x * x) [1,2,3]        -- [1,4,9]
```

### Demo en el laboratorio
`POST /api/u2/lambdas` selecciona una lambda del catálogo y la inyecta en `map`. La función `aplicarLambda` devuelve `Maybe ([Double] -> [Double])` — **una función como valor retornado**, anticipando U3-T1.

### Caso real — Liquidación de pedido
`POST /api/u2/pipeline-pedidos` compone lambdas de negocio reales:

```haskell
subtotal = \i -> itemPrecio i * fromIntegral (itemCantidad i)
rebaja   = \s -> if s > 100 then s * 0.90 else s    -- descuento por volumen
conIva   = \s -> s * 1.12                          -- impuesto
pipeline = conIva . rebaja                          -- composición de lambdas
```

Las reglas de precio de un e-commerce **son lambdas**: se componen, se ordenan y se aplican a cada línea. Cambiar una regla = cambiar una lambda, sin tocar el pipeline.

---

## U2-T2 · Closures y Estado Encapsulado

### Concepto
Un **closure** es una lambda que *captura* valores de su entorno léxico y los conserva para siempre: la función "recuerda" el contexto donde nació. Es estado encapsulado **sin variables mutables ni objetos**.

```haskell
crearMultiplicador :: Double -> (Double -> Double)
crearMultiplicador factor = \x -> x * factor
-- factor queda CONGELADO dentro de la función devuelta

porDiez   = crearMultiplicador 10   -- closure: factor = 10
conIva15  = crearMultiplicador 1.15 -- closure: factor = 1.15
```

### Demo en el laboratorio
`POST /api/u2/closures` crea el closure con tu factor y lo aplica con `map` a una lista.

### Caso real — Motor de tarifas (pricing engine)
`POST /api/u2/tarifas`: `crearCalculadoraPrecio` captura la configuración comercial **una sola vez** (IVA, umbral y % de descuento) y devuelve la calculadora que se aplica a todo el catálogo:

```haskell
crearCalculadoraPrecio :: ConfigTarifa -> (Double -> Double)
crearCalculadoraPrecio cfg = \precio ->
    let conDescuento = if precio >= cfgUmbral cfg
                         then precio * (1 - cfgPctDesc cfg)
                         else precio
    in conDescuento * (1 + cfgIva cfg)
```

En producción esto es oro: la política de precios se carga una vez (de config, env o DB) y miles de cálculos la reutilizan encapsulada — sin pasar la config por cada llamada y sin estado global mutable.

---

## U2-T3 · El Principio de Inmutabilidad

### Concepto
En Haskell **ningún valor puede mutar**. "Modificar" una lista significa producir una **nueva**: el original sigue existiendo intacto. De ahí se derivan dos superpoderes: transparencia referencial (sustituir expresión por su valor) y estructuras compartidas seguras en concurrencia.

```haskell
xs  = [1,2,3]
xs2 = 9 : xs        -- xs2 = [9,1,2,3]; xs sigue siendo [1,2,3]
xs3 = map (*2) xs   -- xs3 = [2,4,6];   xs sigue siendo [1,2,3]
```

### Demo en el laboratorio
`POST /api/u2/inmutabilidad` devuelve `original` y `transformada` lado a lado — el original demostrablemente no cambió.

### Caso real — Ledger de cuenta bancaria
`POST /api/u2/ledger` aplica movimientos con `scanl`, que devuelve **toda la cadena de estados intermedios**:

```haskell
historialSaldos :: Double -> [Movimiento] -> [Double]
historialSaldos = scanl aplicarMovimiento
-- scanl (+) 1000 [500, -120, -80] → [1000, 1500, 1380, 1300]
```

Es el modelo real de los libros contables y de **event sourcing**: el saldo jamás se sobrescribe; cada estado es un nuevo valor derivado del anterior. Auditoría gratuita: el historial completo queda en la respuesta. Es también exactamente la filosofía de la tabla `registro_laboratorio` (append-only) de este proyecto.

---

## U2-T4 · Pureza y Efectos Secundarios

### Concepto
Una función **pura**: (a) mismo input → mismo output, siempre; (b) cero efectos observables (ni I/O, ni estado oculto, ni excepciones). La consecuencia práctica es el **razonamiento ecuacional**: puedes demostrar propiedades sustituyendo expresiones por valores, como en álgebra:

```
f x = x * 3 + 1
f n + f n  ≡  2 * f n      -- siempre verdadero para cualquier n
```

Con impureza esa equivalencia se rompe (¿y si `f` incrementara un contador global?).

### Demo en el laboratorio
`GET /api/u2/pureza/:num` evalúa ambos lados de la equivalencia y confirma que coinciden para cualquier `n`.

### Caso real — Liquidador de nómina
`POST /api/u2/nomina` — el cálculo de sueldo es el ejemplo canónico de función que **debe** ser pura en producción:

```haskell
liquidarSueldo :: Double -> [Double] -> Double
liquidarSueldo br ds = br - sum ds
-- auditado por invariante: neto + Σ deducciones ≡ bruto
```

Un liquidador de nómina real no puede depender de la hora, del orden de ejecución ni de llamadas anteriores — sería inauditable. La pureza convierte la nómina en una verdad matemática reproducible; los efectos (guardar el registro, emitir el rol) quedan confinados a la capa `IO` de `Main.hs` — Functional Core / Imperative Shell en acción.

---

## Preguntas para razonar en clase

1. En `crearCalculadoraPrecio`, ¿qué cambiaría si el IVA se leyera dentro de la lambda en vez de capturarse? ¿Qué ventaja tiene congelarlo?
2. `scanl` genera `[1000,1500,1380,1300]`. Escribe la lista equivalente con `foldl`: ¿qué información se pierde?
3. ¿Por qué `liquidarSueldo` puede ejecutarse en paralelo sobre 10 000 empleados sin locks ni `synchronized`, mientras que una versión con variable acumuladora compartida no?
