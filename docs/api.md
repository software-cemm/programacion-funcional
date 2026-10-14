# Referencia de API — Backend Haskell (Scotty)

Base: `http://localhost:3000` — todas las respuestas son JSON.
Salud: `GET /api/health` → `{"status":"UPSE Functional Backend Operativo"}`

---

## Unidad 1 — Fundamentos y Pensamiento Funcional

### `POST /api/u1/paradigma` — composición declarativa (demo)
```json
→ {"numeros": [1,2,3,4,5,6]}
← {"entrada":[1,2,3,4,5,6], "resultado":56,
   "receta_declarativa":"sum . map (^2) . filter even"}
```

### `POST /api/u1/reporte-ventas` — reporte declarativo (caso real)
```json
→ {"estadoObjetivo":"pendiente",
   "ventas":[{"ventaId":1,"ventaMonto":120.5,"ventaEstado":"aprobada"},
             {"ventaId":2,"ventaMonto":89.99,"ventaEstado":"pendiente"}]}
← {"estado":"pendiente","cantidad_total":2,"cantidad_filtrada":1,
   "total_monto":89.99,"ventas":[{...}]}
```

### `POST /api/u1/figuras` — pattern matching sobre ADT (demo)
```json
→ {"figuraTipo":"rectangulo","figuraParams":[4,6]}
← {"figura":"Rectangulo 4.0 6.0","area":24}
# tipos válidos: circulo [r] · rectangulo [b,h] · triangulo [b,h]
# params incorrectos → {"error":"figura o parametros invalidos"}
```

### `POST /api/u1/eventos` — router transaccional (caso real)
```json
→ {"eventoTipo":"deposito","eventoMonto":15000}
← {"accionCanal":"compliance","accionPrioridad":"alta","accionRequierePin":false}
# tipos: deposito · retiro · transferencia · (desconocido → rechazado)
```

### `POST /api/u1/hof` — map/filter/fold (demo)
```json
→ {"hofOperacion":"mayores_10","hofValores":[2,-4,6,8,15]}
← {"operacion":"mayores_10","entrada":[2,-4,6,8,15],"salida":[15]}
# operaciones: duplicar · cuadrados · positivos · mayores_10 · suma · producto
```

### `POST /api/u1/kpi` — agregación de montos (caso real)
```json
→ {"montos":[120.5,89.99,340,15,210.75]}
← {"cantidad":5,"total":776.24,"promedio":155.248,"maximo":340,"minimo":15}
```

---

## Unidad 2 — Patrones Funcionales Esenciales

### `POST /api/u2/lambdas` — lambda inyectada en `map` (demo)
```json
→ {"lamExpresion":"cuadrado","lamValores":[1,2,3,4]}
← {"expresion":"cuadrado","entrada":[1,2,3,4],"salida":[1,4,9,16]}
# expresiones: inc · doble · cuadrado · mitad · abs
```

### `POST /api/u2/pipeline-pedidos` — pipeline de lambdas (caso real)
```json
→ {"items":[{"itemNombre":"Laptop","itemPrecio":850,"itemCantidad":1},
            {"itemNombre":"Mouse","itemPrecio":25,"itemCantidad":2}]}
← {"lineas":[{"nombre":"Laptop","subtotal":850,"final":856.8},
             {"nombre":"Mouse","subtotal":50,"final":56.0}],
   "total_pedido":912.8}
# pipeline: subtotal → 10% desc. si >100 → IVA 12%
```

### `POST /api/u2/closures` — factor capturado en closure (demo)
```json
→ {"factorBase":1.15,"valores":[100,250,400,50]}
← {"factorAplicado":1.15,"resultados":[115.0,287.5,460.0,57.5]}
```

### `POST /api/u2/tarifas` — motor de tarifas (caso real)
```json
→ {"iva":0.12,"umbral":100,"descuento":0.10,
   "productos":[{"prodNombre":"Laptop","prodPrecio":850},
                {"prodNombre":"Cable","prodPrecio":8}]}
← {"config":{"iva":0.12,"umbral":100,"descuento":0.1},
   "resultados":[{"pfNombre":"Laptop","pfBase":850,"pfFinal":856.8},
                 {"pfNombre":"Cable","pfBase":8,"pfFinal":8.96}]}
# regla: precio ≥ umbral → aplica descuento, luego IVA a todos
```

### `POST /api/u2/inmutabilidad` — transformación sin mutación (demo)
```json
→ {"inmOperacion":"agregar_inicio","inmLista":[1,2,3],"inmElemento":9}
← {"operacion":"agregar_inicio","original":[1,2,3],
   "transformada":[9,1,2,3],"original_intacta":true}
# operaciones: agregar_inicio · agregar_final · duplicar · quitar_pares · invertir
```

### `POST /api/u2/ledger` — cadena de saldos con `scanl` (caso real)
```json
→ {"ledSaldo":1000,
   "ledMovimientos":[{"movTipo":"credito","movMonto":500},
                   {"movTipo":"debito","movMonto":120}]}
← {"saldo_inicial":1000,"saldos":[1000,1500,1380],"saldo_final":1380,
   "nota":"scanl: cada saldo es un valor nuevo; el inicial nunca se muta"}
```

### `GET /api/u2/pureza/:num` — razonamiento ecuacional (demo)
```
GET /api/u2/pureza/7
← {"valor_entrada":7,"f_x_mas_f_x":44,"dos_por_f_x":44,"es_equivalente":true}
```

### `POST /api/u2/nomina` — liquidador de nómina puro (caso real)
```json
→ {"bruto":1500,"deducciones":[150,75.5,30]}
← {"bruto":1500,"deducciones":[150,75.5,30],"total_deducciones":255.5,
   "neto":1244.5,"verificacion_pura":true}
# invariante auditado: neto + Σ deducciones == bruto
```

---

## CORS

El backend acepta `Origin: *` con métodos `GET, HEAD, POST` y headers
`Content-Type`, `Authorization`. Preflight `OPTIONS` respondido por `wai-cors`.
