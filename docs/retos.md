# Retos del Laboratorio — Ejercicios para el Estudiante

Cada reto extiende el código real del proyecto. Sigue el protocolo de
`requerimientos.md §3`: lógica pura en `Modulos/UnidadX.hs` → registro en
`app.cabal` → ruta en `Main.hs` → vista en `views/`.

Nivel: 🟢 básico · 🟡 intermedio · 🔴 avanzado

---

## Unidad 1

### R1.1 🟢 Nueva receta declarativa
Agrega al endpoint `/api/u1/paradigma` el campo `variante` para elegir entre:
`sum . map (^2) . filter even` (actual) y `length . filter (> 10)`.
*Aprende:* una misma estructura de composición, distinta especificación.

### R1.2 🟡 Nuevo constructor del ADT
Añade `Trapecio Double Double Double` a `Figura`, su ecuación en `area`
(`(b1 + b2) * h / 2`) y su patrón en `construirFigura`.
*Aprende:* el compilador te obliga a cubrir el nuevo caso en todas partes —
pattern matching exhaustivo trabajando a tu favor.

### R1.3 🟡 Guarda de negocio adicional
En `enrutarEvento`, agrega el tipo `"cierre_cuenta"` que requiera PIN y canal
`"auditoria"` siempre, y una guarda para `retiro` con `monto <= 0` → `"rechazado"`.
*Aprende:* guardas como expresión de reglas de negocio ordenadas.

### R1.4 🔴 HOF propia
Implementa en `Unidad1.hs` una `miFoldl :: (b -> a -> b) -> b -> [a] -> b`
recursiva (sin usar `foldl` de librería) y úsala en `calcularKpi`.
*Aprende:* `fold` no es magia — es recursión + acumulador.

---

## Unidad 2

### R2.1 🟢 Nueva lambda y regla de pedido
Agrega la lambda `"porcentaje"` a `aplicarLambda` y una regla en
`liquidacionPedido`: envío gratis (`envio = 0`) si el subtotal supera 500.
*Aprende:* lambdas como piezas intercambiables del pipeline.

### R2.2 🟡 Closure con dos factores capturados
Generaliza `crearCalculadoraPrecio` a `crearCalculadoraMoneda :: String -> ConfigTarifa -> (Double -> String)`
que capture además la moneda y devuelva el precio formateado (`"USD 856.80"`).
*Aprende:* el closure puede encapsular todo un contexto.

### R2.3 🟡 Ledger con saldo insuficiente
Modifica `aplicarMovimiento` para que un débito mayor al saldo **no** se aplique
(saldo se queda igual) y agrega al JSON el campo `rechazados` con la cantidad.
*Aprende:* reglas de negocio dentro de la reducción pura.

### R2.4 🔴 Propiedad de nómina como razonamiento ecuacional
Demuestra con lápiz y papel (y verifica en el endpoint) que
`liquidarSueldo b (d1 : ds) ≡ liquidarSueldo (liquidarSueldo b [d1]) ds`.
*Aprende:* las propiedades de la función se demuestran, no solo se prueban.

---

## Integradores 🔴🔴

### RI.1 Evento → ledger → registro
Conecta los tres casos reales: recibe un `EventoTx`, enrútalo con
`enrutarEvento`, y si sale aprobado aplícalo como `Movimiento` al `historialSaldos`.
*Aprende:* composición de dominios — la salida tipada de un módulo es la
entrada del siguiente.

### RI.2 Tu propio caso real
Elige un dominio que conozcas (calificaciones, inventario, reservas,
telemetría) e implementa su "caso real" siguiendo el patrón: tipo de entrada
`FromJSON` → función pura de negocio → `Value` de salida → vista React.
*Aprende:* el patrón completo del laboratorio aplicado a un problema nuevo.

---

## Rúbrica sugerida (para el docente)

| Criterio | Puntos |
|----------|--------|
| Lógica 100% pura en `Modulos/` (sin `IO`) | 3 |
| Pattern matching/guardas correctos y exhaustivos | 2 |
| Caso real coherente con un sistema productivo | 2 |
| Endpoint + vista funcionando en Docker | 2 |
| Registro `[x]` en `requerimientos.md` | 1 |
