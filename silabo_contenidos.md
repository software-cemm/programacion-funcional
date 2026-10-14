# SISTEMA DE CONTENIDOS: PROGRAMACIÓN FUNCIONAL (UPSE)
**Carrera:** Ingeniería de Software - Matriz[cite: 5]  
**Nivel / Semestre:** Quinto Semestre[cite: 5]  
**Docente:** Ing. Carlos Muñoz Mendoza[cite: 1]  

---

## Resultados de Aprendizaje de la Asignatura (RAA)
1. **RAA 1:** Comprende el cambio de paradigma hacia la programación funcional e identifica sus fundamentos conceptuales y sintácticos[cite: 5].
2. **RAA 2:** Aplica funciones de orden superior, lambdas, closures, inmutabilidad y pureza en la construcción de soluciones funcionales[cite: 5].
3. **RAA 3:** Utiliza estrategias funcionales para el manejo de ausencia de valor, errores, metaprogramación y evaluación diferida[cite: 5].
4. **RAA 4:** Integra concurrencia, programación asíncrona, testing funcional y arquitectura funcional en soluciones de software[cite: 5].
5. **RAA 5:** Desarrolla y presenta un proyecto integrador aplicando los principios de programación funcional[cite: 5].

---

## 4.- Sistema de Contenidos (Desagregación de las Unidades Temáticas)

### UNIDAD 1: Fundamentos y Pensamiento Funcional
* **U1-T1:** 1— El Cambio de Paradigma, del "Cómo" al "Qué"[cite: 5]
* **U1-T2:** 2— Dando Vida a los Tipos, El Poder del Pattern Matching Estructural[cite: 5]
* **U1-T3:** 3— Funciones de Orden Superior (HOFs)[cite: 5]

### UNIDAD 2: Patrones Funcionales Esenciales
* **U2-T1:** 1— Lambdas y la HOF Universal[cite: 5]
* **U2-T2:** 2— Closures y Estado Encapsulado[cite: 5]
* **U2-T3:** 3— El Principio de Inmutabilidad[cite: 5]
* **U2-T4:** 4— Pureza y Efectos Secundarios[cite: 5]

### UNIDAD 3: Manejo Avanzado de Efectos y Abstracciones
* **U3-T1:** 1— El Problema de la Ausencia de Valor[cite: 5]
* **U3-T2:** 2— Manejo de Errores Funcional[cite: 5]
* **U3-T3:** 3— Decoradores y Metaprogramación Funcional[cite: 5]
* **U3-T4:** 4— Generadores y Evaluación Lazy[cite: 5]

### UNIDAD 4: Concurrencia y Aplicaciones en el Mundo Real
* **U4-T1:** 1— Concurrencia y Paralelismo[cite: 5]
* **U4-T2:** 2— Programación Asíncrona[cite: 5]
* **U4-T3:** 3— Paradigmas Reactivos y Testing Funcional[cite: 5]
* **U4-T4:** 4— Arquitectura de Software Funcional[cite: 5]

### UNIDAD 5: Proyecto Final y Temas Avanzados
* **U5-T1:** 1— Lanzamiento del Proyecto Final[cite: 5]
* **U5-T2:** 2— Desarrollo del Proyecto[cite: 5]
* **U5-T3:** 3— Preparación de la Presentación del Proyecto[cite: 5]
* **U5-T4:** 4— Presentaciones Finales de Proyectos, Conclusiones y Futuro de la PF[cite: 5]

---

## Mapeo de Implementación Técnica en este Repositorio

| Unidad | Tema Oficial | Concepto Clave a Implementar | Componente Backend / Frontend |
| :--- | :--- | :--- | :--- |
| **U2** | Closures y Estado Encapsulado[cite: 5] | Fábricas de funciones, variables en entorno léxico[cite: 3] | `Modulos.Unidad2` / `U2ClosuresView.jsx` |
| **U2** | El Principio de Inmutabilidad[cite: 5] | Transformación pura $A \to B$, sin mutación in-place[cite: 5] | `Modulos.Unidad2` / `U2InmutabilidadView.jsx` |
| **U2** | Pureza y Efectos Secundarios[cite: 5] | Razonamiento ecuacional $f(x) + f(x) == 2 \cdot f(x)$, $IO$ explícito | `Modulos.Unidad2` / `U2PurezaView.jsx` |
| **U3** | Ausencia de Valor[cite: 5] | Tipo algebraico `Maybe` (`Just` / `Nothing`) eliminando `null` | `Modulos.Unidad3` / `U3MaybeView.jsx` |
| **U3** | Manejo de Errores Funcional[cite: 5] | Tipo algebraico `Either` (`Left Error` / `Right Exito`) | `Modulos.Unidad3` / `U3EitherView.jsx` |
| **U3** | Generadores y Evaluación Lazy[cite: 5] | Streams infinitos, evaluación diferida, consumo acotado (`take`) | `Modulos.Unidad3` / `U3LazyView.jsx` |
| **U4** | Concurrencia y Paralelismo[cite: 5] | Hilos ligeros puros con `Control.Concurrent.Async`[cite: 1] | `Modulos.Unidad4` / `U4ConcurrenciaView.jsx` |
| **U4** | Testing Funcional[cite: 5] | Tests basados en propiedades con `QuickCheck`[cite: 1] | `Modulos.Unidad4` / `U4QuickCheckView.jsx` |
| **U4** | Arquitectura Funcional[cite: 5] | *Functional Core, Imperative Shell* / *Ports & Adapters* | Estructura general `Core` vs `Shell` |
| **U5** | Proyecto Final Integrador[cite: 5] | Sistema de eventos/transacciones real sobre PostgreSQL | Panel completo e integración total |