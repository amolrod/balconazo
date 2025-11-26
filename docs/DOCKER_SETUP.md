# **DOCKER_SETUP.md**

Infraestructura Docker y `docker-compose` para BalconazoApp

---

## **Índice**

* [1. Introducción](#1-introducción)

* [2. docker-compose.yml completo](#2-docker-composeyml-completo)

* [3. Descripción detallada de servicios](#3-descripción-detallada-de-servicios)

* [4. Puertos y redes](#4-puertos-y-redes)

* [5. Comandos Docker habituales](#5-comandos-docker-habituales)

* [6. Optimización para MacBook M1/M2](#6-optimización-para-macbook-m1m2)

* [7. Troubleshooting específico de Docker](#7-troubleshooting-específico-de-docker)

---

## **1. Introducción**

Este documento define y explica la infraestructura Docker de BalconazoApp. Utilizaremos **Docker Compose** para levantar:

* 3 bases de datos PostgreSQL (una por microservicio).

* Keycloak (gestión de identidad).

* KrakenD (API Gateway).

* 3 microservicios backend (users, spaces, bookings).

* Frontend Next.js.

Todo se conectará en una misma red Docker (`balconazo-net`) para facilitar la comunicación interna.

---

## **2. docker-compose.yml completo**

Reemplazar el contenido del `docker-compose.yml` raíz por el siguiente

```yaml
version: "3.9"

services:  
  # =========================  
  # Bases de datos PostgreSQL  
  # =========================

  postgres-users:  
    image: postgres:16-alpine  
    container_name: ${PROJECT_NAME}-postgres-users  
    restart: unless-stopped  
    environment:  
      POSTGRES_DB: ${USERS_DB_NAME}  
      POSTGRES_USER: ${USERS_DB_USER}  
      POSTGRES_PASSWORD: ${USERS_DB_PASSWORD}  
    ports:  
      - "${USERS_DB_PORT}:5432"  
    volumes:  
      - ./infra/db/users:/var/lib/postgresql/data  
    networks:  
      - balconazo-net  
    healthcheck:  
      test: ["CMD-SHELL", "pg_isready -U ${USERS_DB_USER} -d ${USERS_DB_NAME}"]  
      interval: 10s  
      timeout: 5s  
      retries: 5

  postgres-spaces:  
    image: postgres:16-alpine  
    container_name: ${PROJECT_NAME}-postgres-spaces  
    restart: unless-stopped  
    environment:  
      POSTGRES_DB: ${SPACES_DB_NAME}  
      POSTGRES_USER: ${SPACES_DB_USER}  
      POSTGRES_PASSWORD: ${SPACES_DB_PASSWORD}  
    ports:  
      - "${SPACES_DB_PORT}:5432"  
    volumes:  
      - ./infra/db/spaces:/var/lib/postgresql/data  
    networks:  
      - balconazo-net  
    healthcheck:  
      test: ["CMD-SHELL", "pg_isready -U ${SPACES_DB_USER} -d ${SPACES_DB_NAME}"]  
      interval: 10s  
      timeout: 5s  
      retries: 5

  postgres-bookings:  
    image: postgres:16-alpine  
    container_name: ${PROJECT_NAME}-postgres-bookings  
    restart: unless-stopped  
    environment:  
      POSTGRES_DB: ${BOOKINGS_DB_NAME}  
      POSTGRES_USER: ${BOOKINGS_DB_USER}  
      POSTGRES_PASSWORD: ${BOOKINGS_DB_PASSWORD}  
    ports:  
      - "${BOOKINGS_DB_PORT}:5432"  
    volumes:  
      - ./infra/db/bookings:/var/lib/postgresql/data  
    networks:  
      - balconazo-net  
    healthcheck:  
      test: ["CMD-SHELL", "pg_isready -U ${BOOKINGS_DB_USER} -d ${BOOKINGS_DB_NAME}"]  
      interval: 10s  
      timeout: 5s  
      retries: 5

  # ============  
  # Keycloak  
  # ============

  keycloak:  
    image: quay.io/keycloak/keycloak:22.0  
    container_name: ${PROJECT_NAME}-keycloak  
    restart: unless-stopped  
    command: ["start-dev"]  
    environment:  
      KEYCLOAK_ADMIN: ${KEYCLOAK_ADMIN_USER}  
      KEYCLOAK_ADMIN_PASSWORD: ${KEYCLOAK_ADMIN_PASSWORD}  
      KC_HTTP_PORT: 8080  
    ports:  
      - "${KEYCLOAK_HTTP_PORT}:8080"  
    networks:  
      - balconazo-net  
    healthcheck:  
      test: ["CMD-SHELL", "curl -f http://localhost:8080/realms/master || exit 1"]  
      interval: 15s  
      timeout: 5s  
      retries: 10

  # ===============  
  # KrakenD Gateway  
  # ===============

  krakend:  
    image: devopsfaith/krakend:2.4  
    container_name: ${PROJECT_NAME}-krakend  
    restart: unless-stopped  
    volumes:  
      - ./gateway/krakend.json:/etc/krakend/krakend.json  
    environment:  
      KRAKEND_PORT: ${KRAKEND_PORT}  
      KRAKEND_LOG_LEVEL: ${KRAKEND_LOG_LEVEL}  
    ports:  
      - "${KRAKEND_PORT}:8080"  
    depends_on:  
      keycloak:  
        condition: service_healthy  
      users-service:  
        condition: service_healthy  
      spaces-service:  
        condition: service_healthy  
      bookings-service:  
        condition: service_healthy  
    networks:  
      - balconazo-net  
    healthcheck:  
      test: ["CMD-SHELL", "curl -f http://localhost:8080/__health || exit 1"]  
      interval: 10s  
      timeout: 5s  
      retries: 10

  # ==================  
  # Microservicios BE  
  # ==================

  users-service:  
    build:  
      context: ./backend/users-service  
      dockerfile: Dockerfile  
    container_name: ${PROJECT_NAME}-users-service  
    restart: unless-stopped  
    environment:  
      SPRING_PROFILES_ACTIVE: ${SPRING_PROFILES_ACTIVE}  
      SPRING_DATASOURCE_URL: jdbc:postgresql://${USERS_DB_HOST}:5432/${USERS_DB_NAME}  
      SPRING_DATASOURCE_USERNAME: ${USERS_DB_USER}  
      SPRING_DATASOURCE_PASSWORD: ${USERS_DB_PASSWORD}  
      SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_ISSUER_URI: http://keycloak:8080/realms/${KEYCLOAK_REALM}  
    ports:  
      - "${USERS_SERVICE_PORT}:8080"  
    depends_on:  
      postgres-users:  
        condition: service_healthy  
      keycloak:  
        condition: service_healthy  
    networks:  
      - balconazo-net  
    healthcheck:  
      test: ["CMD-SHELL", "curl -f http://localhost:8080/actuator/health || exit 1"]  
      interval: 10s  
      timeout: 5s  
      retries: 10

  spaces-service:  
    build:  
      context: ./backend/spaces-service  
      dockerfile: Dockerfile  
    container_name: ${PROJECT_NAME}-spaces-service  
    restart: unless-stopped  
    environment:  
      SPRING_PROFILES_ACTIVE: ${SPRING_PROFILES_ACTIVE}  
      SPRING_DATASOURCE_URL: jdbc:postgresql://${SPACES_DB_HOST}:5432/${SPACES_DB_NAME}  
      SPRING_DATASOURCE_USERNAME: ${SPACES_DB_USER}  
      SPRING_DATASOURCE_PASSWORD: ${SPACES_DB_PASSWORD}  
      SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_ISSUER_URI: http://keycloak:8080/realms/${KEYCLOAK_REALM}  
    ports:  
      - "${SPACES_SERVICE_PORT}:8080"  
    depends_on:  
      postgres-spaces:  
        condition: service_healthy  
      keycloak:  
        condition: service_healthy  
    networks:  
      - balconazo-net  
    healthcheck:  
      test: ["CMD-SHELL", "curl -f http://localhost:8080/actuator/health || exit 1"]  
      interval: 10s  
      timeout: 5s  
      retries: 10

  bookings-service:  
    build:  
      context: ./backend/bookings-service  
      dockerfile: Dockerfile  
    container_name: ${PROJECT_NAME}-bookings-service  
    restart: unless-stopped  
    environment:  
      SPRING_PROFILES_ACTIVE: ${SPRING_PROFILES_ACTIVE}  
      SPRING_DATASOURCE_URL: jdbc:postgresql://${BOOKINGS_DB_HOST}:5432/${BOOKINGS_DB_NAME}  
      SPRING_DATASOURCE_USERNAME: ${BOOKINGS_DB_USER}  
      SPRING_DATASOURCE_PASSWORD: ${BOOKINGS_DB_PASSWORD}  
      SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_ISSUER_URI: http://keycloak:8080/realms/${KEYCLOAK_REALM}  
    ports:  
      - "${BOOKINGS_SERVICE_PORT}:8080"  
    depends_on:  
      postgres-bookings:  
        condition: service_healthy  
      keycloak:  
        condition: service_healthy  
    networks:  
      - balconazo-net  
    healthcheck:  
      test: ["CMD-SHELL", "curl -f http://localhost:8080/actuator/health || exit 1"]  
      interval: 10s  
      timeout: 5s  
      retries: 10

  # ==========  
  # Frontend  
  # ==========

  frontend:  
    build:  
      context: ./frontend  
      dockerfile: Dockerfile  
    container_name: ${PROJECT_NAME}-frontend  
    restart: unless-stopped  
    environment:  
      NEXT_PUBLIC_API_BASE_URL: ${NEXT_PUBLIC_API_BASE_URL}  
      NEXT_PUBLIC_KEYCLOAK_URL: ${NEXT_PUBLIC_KEYCLOAK_URL}  
      NEXT_PUBLIC_KEYCLOAK_REALM: ${NEXT_PUBLIC_KEYCLOAK_REALM}  
      NEXT_PUBLIC_KEYCLOAK_CLIENT_ID: ${NEXT_PUBLIC_KEYCLOAK_CLIENT_ID}  
      # Si usas variables del lado servidor añade aquí  
    ports:  
      - "${FRONTEND_PORT}:3000"  
    depends_on:  
      krakend:  
        condition: service_healthy  
      keycloak:  
        condition: service_healthy  
    networks:  
      - balconazo-net  
    healthcheck:  
      test: ["CMD-SHELL", "curl -f http://localhost:3000 || exit 1"]  
      interval: 15s  
      timeout: 5s  
      retries: 10

networks:  
  balconazo-net:  
    driver: bridge
```

---

## **3. Descripción detallada de servicios**

Resumen en tabla:

| Servicio | Imagen / Build | Rol principal |
| ----- | ----- | ----- |
| postgres-users | `postgres:16-alpine` | BD del microservicio de usuarios |
| postgres-spaces | `postgres:16-alpine` | BD del microservicio de espacios |
| postgres-bookings | `postgres:16-alpine` | BD del microservicio de reservas |
| keycloak | `quay.io/keycloak/keycloak:22.0` | Proveedor de identidad (IdP) |
| krakend | `devopsfaith/krakend:2.4` | API Gateway |
| users-service | `build ./backend/users-service` | Microservicio de usuarios |
| spaces-service | `build ./backend/spaces-service` | Microservicio de espacios |
| bookings-service | `build ./backend/bookings-service` | Microservicio de reservas |
| frontend | `build ./frontend` | Aplicación Next.js |

Cada servicio incluye:

* `ports`: puertos externos mappeados.

* `volumes`: persistencia (solo DBs).

* `depends_on`: orden de arranque.

* `healthcheck`: comprobación periódica de salud.

---

## **4. Puertos y redes**

### **Puertos externos (host)**

* Frontend: **3000**

* API Gateway (KrakenD): **8080**

* Keycloak: **8081**

* PostgreSQL users: **5433**

* PostgreSQL spaces: **5434**

* PostgreSQL bookings: **5435**

* Microservicios backend:

  * users-service: 8082

  * spaces-service: 8083

  * bookings-service: 8084

Ver qué contenedores están levantados y en qué puertos escuchan

```bash
docker compose ps
```

### **Red Docker**

Todos los servicios comparten la red:

```yaml
networks:  
  balconazo-net:  
    driver: bridge
```

Esto permite que se vean por nombre de servicio (por ejemplo, `users-service`, `keycloak`, `postgres-users`).

---

## **5. Comandos Docker habituales**

Levantar toda la infraestructura en segundo plano

```bash
docker compose up -d
```

Ver logs de todos los servicios

```bash
docker compose logs -f
```

Ver logs de un servicio concreto (ej., users-service)

```bash
docker compose logs -f users-service
```

Listar contenedores activos del proyecto

```bash
docker compose ps
```

Parar todos los servicios

```bash
docker compose down
```

Parar y borrar contenedores + volúmenes (¡borrarás datos de DB!)

```bash
docker compose down -v
```

Reconstruir imágenes (por cambios en Dockerfile o código)

```bash
docker compose build
```

Reconstruir y levantar servicios de una vez

```bash
docker compose up -d --build
```

Entrar en un contenedor (ej. postgres-users)

```bash
docker exec -it balconazoapp-postgres-users bash
```

---

## **6. Optimización para MacBook M1/M2**

En equipos con procesador Apple Silicon (M1/M2/M3):

* **Nativo (Recomendado)**: Las imágenes `postgres:16-alpine` y `keycloak` soportan `linux/arm64` nativamente. Esto es **mucho más rápido y consume menos batería/CPU** que la emulación. Docker Desktop lo selecciona automáticamente.
* **Emulado (amd64)**: Si necesitas forzar la arquitectura Intel/AMD (por ejemplo, para asegurar compatibilidad exacta con un servidor de producción antiguo), puedes hacerlo, pero ten en cuenta que **el rendimiento será menor** debido a la emulación Rosetta 2.

Para forzar arquitectura amd64 en un servicio concreto:

```yaml
services:  
  postgres-users:  
    platform: linux/amd64  
    image: postgres:16-alpine  
    ...
```

**Recomendación:**  
Deja que Docker elija la arquitectura por defecto (ARM64 en Mac, AMD64 en servidores). Solo fuerza `platform: linux/amd64` si encuentras un error específico de compatibilidad.

---

## **7. Troubleshooting específico de Docker**

### **Problema 1: `port is already allocated`**

* **Síntoma:**  
   Al hacer `docker compose up`, recibes errores tipo `Bind for 0.0.0.0:3000 failed: port is already allocated`.

* **Causa:**  
   Otro proceso (o contenedor anterior) ya está usando ese puerto.

* **Solución:**

  1. Ver qué proceso usa el puerto (`lsof -i :3000` en mac/Linux).

  2. Parar el proceso o liberar el puerto.

  3. O bien cambiar el puerto en `.env` y volver a levantar los servicios.

---

### **Problema 2: Keycloak aparece “unhealthy”**

* **Síntoma:**  
   `docker compose ps` indica que `keycloak` está “(unhealthy)” y otros servicios no arrancan.

* **Causa:**  
   Keycloak tarda más de lo previsto en inicializarse o hay errores de configuración.

* **Solución:**

Ver logs de Keycloak:

```bash
 docker compose logs -f keycloak
```

1.   
   2. Esperar a que termine de arrancar (puede tardar bastante la primera vez).

   3. Ajustar `retries` y `interval` del `healthcheck` si es necesario.

---

### **Problema 3: Microservicios no pueden conectar con la base de datos**

* **Síntoma:**  
   Logs de `users-service` muestran `Connection refused` a PostgreSQL.

* **Causa probable:**

  1. DB aún no ha terminado de levantar.

  2. Variables de entorno (`SPRING_DATASOURCE_URL`, usuario, password) mal definidas.

* **Solución:**

Comprobar que `postgres-users` está “healthy”:

```bash
 docker compose ps
```

1.   
   2. Revisar `.env` y asegurarse de que `USERS_DB_HOST`, `USERS_DB_NAME`, etc., son correctos.

Si cambias `.env`, ejecuta:

```bash
 docker compose down  
docker compose up -d --build
```

3. 

---

### **Problema 4: El frontend no puede acceder al Gateway (CORS o 502)**

* **Síntoma:**  
   En la consola del navegador aparecen errores CORS o respuestas 502/504 al llamar a `/api`.

* **Causa:**

  1. Configuración CORS de KrakenD incompleta.

  2. El microservicio de destino no está saludable.

* **Solución:**

  1. Revisar configuración CORS en `gateway/krakend.json` (se verá en `KRAKEND_CONFIG.md`).

  2. Verificar que `krakend` tiene `status: running` y que los servicios de backend están “healthy”.
