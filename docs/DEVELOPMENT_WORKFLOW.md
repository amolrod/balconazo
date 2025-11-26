# **DEVELOPMENT_WORKFLOW.md**

Flujo de trabajo de desarrollo – BalconazoApp

---

## **Índice**

1. [Objetivo del flujo de trabajo](#1-objetivo-del-flujo-de-trabajo)

2. [Estrategia de ramas Git](#2-estrategia-de-ramas-git)

3. [Convención de commits](#3-convención-de-commits)

4. [Pull requests y revisiones](#4-pull-requests-y-revisiones)

5. [Checklist antes de hacer commit](#5-checklist-antes-de-hacer-commit)

6. [Levantar el entorno completo](#6-levantar-el-entorno-completo)

7. [Orden de arranque y validaciones](#7-orden-de-arranque-y-validaciones)

8. [Debugging por servicio](#8-debugging-por-servicio)

9. [Troubleshooting del workflow](#9-troubleshooting-del-workflow)

---

## **1. Objetivo del flujo de trabajo**

Definir una forma estándar de trabajar sobre el monorepo:

* Evitar romper el entorno compartido.

* Mantener un historial Git limpio.

* Facilitar la integración continua y el soporte de asistentes de IA.

---

## **2. Estrategia de ramas Git**

Ramas principales:

* `main` → estado estable, siempre desplegable.

Ramas de trabajo:

* `feature/<nombre>` – nuevas funcionalidades.

* `fix/<nombre>` – corrección de bugs.

* `chore/<nombre>` – tareas de mantenimiento (refactors, config).

* `docs/<nombre>` – cambios de documentación.

Crear una rama de feature

```bash
git checkout -b feature/spaces-search
```

---

## **3. Convención de commits**

Se usa **Conventional Commits**:

* `feat:` – nueva funcionalidad de negocio.

* `fix:` – corrección de bug.

* `chore:` – cambios que no afectan a la lógica (config, dev tooling).

* `docs:` – cambios en documentación.

* `refactor:` – cambios internos sin modificar comportamiento.

* `test:` – cambios en tests.

Ejemplos:

* `feat(spaces): add price and city filters`

* `fix(bookings): prevent overlapping bookings`

* `docs(api): document bookings endpoints`

---

## **4. Pull requests y revisiones**

1. Desarrollar en una rama `feature/*` o `fix/*`.

2. Hacer commits pequeños y coherentes.

3. Abrir Pull Request hacia `main`.

4. Describir:

   * Qué se ha cambiado.

   * Endpoints afectados.

   * Cómo testear el cambio.

5. Revisar el código (puede ser auto-revisión si trabajas solo) antes de hacer merge.

---

## **5. Checklist antes de hacer commit**

Antes de `git commit`:

1. **Backend**:

   * Ejecutar `mvn test` en los servicios afectados.

2. **Frontend**:

   * Ejecutar `npm run lint` y `npm test`.

3. **Formato**:

   * El código sigue las guías de estilo (IDE, Prettier).

4. **Docs**:

   * API y docs actualizadas si cambian endpoints o flujos.

---

## **6. Levantar el entorno completo**

Levantar todo con Docker Compose

```bash
docker compose up -d --build
```

Servicios incluidos:

* `postgres-users`, `postgres-spaces`, `postgres-bookings`

* `keycloak`

* `users-service`, `spaces-service`, `bookings-service`

* `krakend`

* `frontend`

Ver estado de contenedores

```bash
docker compose ps
```

---

## **7. Orden de arranque y validaciones**

Aunque Docker gestiona dependencias, el orden lógico es:

1. Bases de datos (Postgres).

2. Keycloak.

3. Microservicios backend.

4. KrakenD.

5. Frontend.

Validaciones rápidas:

* Comprobar que la home carga en `http://localhost:3000`.

* Ver que Keycloak responde en `http://localhost:8080`.

* Hacer una petición a `/api/spaces` desde Postman o curl.

---

## **8. Debugging por servicio**

### **Backend**

* Puedes ejecutar un microservicio fuera de Docker con el IDE usando el perfil `local`.

* Conectar depurador (debug) al puerto 5005 (si configuras `JAVA_TOOL_OPTIONS`).

### **Frontend**

* Ejecutar `npm run dev` en local para mejor hot reload.

* Apuntar `NEXT_PUBLIC_API_BASE_URL` al gateway.

### **Gateway y Keycloak**

Ver logs con:

```bash
 docker compose logs -f krakend
```

```bash
docker compose logs -f keycloak
```

* 

---

## **9. Troubleshooting del workflow**

### **Problema 1: conflictos de merge frecuentes**

* **Causa**: cambios concurrentes en los mismos archivos (sobre todo config o docs).

* **Solución**:

  * Hacer pull frecuente de `main`.

  * Mantener ramas de vida corta (mergear pronto).

---

### **Problema 2: “Funciona en mi máquina pero no en Docker”**

* **Causa**: diferencias entre configuración local y variables de entorno en contenedores.

* **Solución**:

  * Alinear `application.yml` y configuración de perfiles (`local` vs `docker`).

  * Revisar `.env` y `docker-compose.yml`.

---

### **Problema 3: romper el entorno al hacer merge**

* **Causa**: se mergea sin ejecutar tests ni levantar el entorno.

* **Solución**:

  * Seguir estrictamente el checklist antes de merge.

  * Idealmente, configurar CI (GitHub Actions) para ejecutar tests automáticamente.
