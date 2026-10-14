# Guía del Estudiante — Instalación y Puesta en Marcha

> Laboratorio Interactivo de Algoritmos Funcionales — Programación Funcional, 5to semestre, UPSE.
> Todo el entorno corre en contenedores Docker: **no necesitas instalar Haskell, Node ni PostgreSQL** en tu máquina.

---

## 1. Requisitos previos

| Herramienta | Versión mínima | Verificación |
|-------------|----------------|--------------|
| Docker Desktop | 4.x | `docker --version` |
| Git | 2.x | `git --version` |

**Instalar Docker Desktop (Windows):**
1. Descarga desde https://www.docker.com/products/docker-desktop/
2. Instala con WSL 2 (el instalador lo habilita automáticamente).
3. Abre Docker Desktop y espera a que la ballena del tray quede en estado "Running".

**Instalar Git:** https://git-scm.com/downloads

---

## 2. Clonar el repositorio

Abre una terminal (PowerShell, CMD o Git Bash) en la carpeta donde quieras trabajar:

```bash
git clone https://github.com/software-cemm/programacion-funcional.git
cd programacion-funcional
```

---

## 3. Levantar el entorno

```bash
docker compose up --build -d
```

> ⏱ **La primera vez tarda ~10 minutos:** Docker descarga las imágenes base y
> compila las dependencias de Haskell. Las siguientes veces arranca en segundos.

Cuando termine, verifica que los 3 contenedores estén activos:

```bash
docker ps
# postgres-funcional · backend-haskell · frontend-funcional  →  todos "Up"
```

---

## 4. Usar el laboratorio

| Recurso | Dirección |
|---------|-----------|
| **Aplicación web** | http://localhost:5173 |
| API del backend | http://localhost:3000/api/health |
| PostgreSQL | localhost:5433 |

Prueba rápida del backend desde la terminal:

```bash
curl http://localhost:3000/api/health
# {"status":"UPSE Functional Backend Operativo"}
```

En http://localhost:5173 encontrarás el **menú lateral con las unidades del sílabo**.
Cada tema tiene dos paneles: la demostración del concepto y el caso real aplicado.
Experimenta con los inputs y observa el JSON crudo que devuelve Haskell.

---

## 5. Apagar y volver a encender

```bash
docker compose down      # apaga y elimina los contenedores (datos persisten)
docker compose up -d     # vuelve a levantar (sin rebuild)
docker compose logs -f backend-haskell   # ver logs del servidor Haskell
```

---

## 6. Problemas frecuentes

| Síntoma | Causa | Solución |
|---------|-------|----------|
| `error during connect` | Docker Desktop apagado | Abrir Docker Desktop y esperar a "Running" |
| `port is already allocated` | 3000/5173/5433 ocupados | Cerrar la app que usa el puerto o `docker compose down` de otro proyecto |
| El navegador no abre 5173 | Vite aún iniciando | Esperar 10 s y recargar; ver `docker logs frontend-funcional` |
| Error CORS en consola | Backend caído | `docker compose up -d backend-haskell` y revisar `docker logs backend-haskell` |
| Build muy lento | Recursos de Docker | Docker Desktop → Settings → Resources (subir CPU/RAM) |

---

## 7. Documentación dentro del repo

- `README.md` — mapa general del proyecto
- `docs/arquitectura.md` — cómo está construido (Functional Core / Imperative Shell)
- `docs/api.md` — todos los endpoints con ejemplos `curl`
- `docs/unidad-1.md`, `docs/unidad-2.md` — guías didácticas por tema
- `docs/retos.md` — ejercicios para practicar

---

## 8. Flujo sugerido de estudio por tema

1. Lee el concepto en `docs/unidad-N.md`.
2. Ejecuta la **demo** en la vista web y observa el JSON.
3. Ejecuta el **caso real** y relaciona el concepto con el dominio.
4. Lee la función pura en `backend-haskell/src/Modulos/UnidadN.hs`.
5. Intenta el reto correspondiente en `docs/retos.md`.
