# **DEPLOYMENT_GUIDE.md**

Guía de despliegue – BalconazoApp

---

## **Índice**

1. [Objetivo](#1-objetivo)

2. [Preparación para producción](#2-preparación-para-producción)

3. [Construcción de imágenes Docker](#3-construcción-de-imágenes-docker)

4. [Configuración de entorno de producción](#4-configuración-de-entorno-de-producción)

5. [Despliegue en servidor con Docker Compose](#5-despliegue-en-servidor-con-docker-compose)

6. [Dominios y HTTPS](#6-dominios-y-https)

7. [Monitorización básica](#7-monitorización-básica)

8. [Backups de base de datos](#8-backups-de-base-de-datos)

9. [Rollback](#9-rollback)

10. [Troubleshooting de despliegue](#10-troubleshooting-de-despliegue)

---

## **1. Objetivo**

Definir cómo pasar de un entorno local de desarrollo a un entorno “tipo producción” usando **Docker Compose** en un servidor.

---

## **2. Preparación para producción**

Checklist:

* Configurar variables de entorno de producción (`.env.prod`).

* Cambiar contraseñas por valores seguros (no usar `admin/admin`).

* Desactivar logs excesivamente verbosos.

* Asegurar que los servicios usan `SPRING_PROFILES_ACTIVE=prod` o similar.

---

## **3. Construcción de imágenes Docker**

Backend (ejemplo `users-service`):

Construir imagen de un microservicio

```bash
cd backend/users-service
mvn clean package
docker build -t balconazo/users-service:1.0.0 .
```

Frontend:

Construir imagen del frontend

```bash
cd frontend/balconazo-web
npm install
npm run build
docker build -t balconazo/frontend:1.0.0 .
```

Puedes usar `docker compose build` para construir todas las imágenes de una vez.

---

## **4. Configuración de entorno de producción**

Crear un fichero `.env.prod` en el servidor:

Variables específicas para producción:

```
PROJECT_NAME=balconazoapp
KRAKEND_PORT=80
FRONTEND_PORT=3000
KEYCLOAK_HTTP_PORT=8080

# Bases de datos con contraseñas seguras
USERS_DB_PASSWORD=********
SPACES_DB_PASSWORD=********
BOOKINGS_DB_PASSWORD=********
```

* 

No subir nunca `.env.prod` al repositorio.

---

## **5. Despliegue en servidor con Docker Compose**

1. Copiar el código al servidor (por ejemplo, con `git clone` o `scp`).

2. Crear `.env.prod` y copiarlo a `.env`.

Levantar servicios

```bash
docker compose --env-file .env up -d
```

Comprobar estado

```bash
docker compose ps
```

---

## **6. Dominios y HTTPS**

Escenario simple:

* Servidor expone HTTP en el puerto 80.

* Se usa un **reverse proxy** (Nginx, Caddy, Traefik) delante del gateway y el frontend.

Pasos generales:

1. Configurar DNS para apuntar `app.balconazo.com` y `api.balconazo.com` al servidor.

2. Configurar Nginx con certificados Let’s Encrypt.

3. Redirigir tráfico HTTPS a los puertos internos de Docker (`frontend`, `krakend`).

---

## **7. Monitorización básica**

* Usar `docker compose logs -f` como herramienta básica.

* Activar endpoints de salud:

  * `GET /actuator/health` en microservicios.

  * Healthcheck en KrakenD y Keycloak.

Para un entorno más avanzado se pueden añadir **Prometheus + Grafana**.

---

## **8. Backups de base de datos**

Ejemplo backup manual de una BD:

Hacer backup de `usersdb` desde el host

```bash
docker exec -t balconazo-postgres-users \
  pg_dump -U ${USERS_DB_USER} ${USERS_DB_NAME} > usersdb_backup.sql
```

Restaurar:

```bash
cat usersdb_backup.sql | docker exec -i balconazo-postgres-users \
  psql -U ${USERS_DB_USER} -d ${USERS_DB_NAME}
```

---

## **9. Rollback**

Opciones de rollback:

* Volver a las imágenes Docker anteriores (etiquetas `1.0.0`, `0.9.0`, etc.).

* Revertir cambios en `docker-compose.yml` y `.env`.

* Restaurar backups de base de datos si el problema afecta a datos.

---

## **10. Troubleshooting de despliegue**

### **Problema 1: todo funciona en local pero no en el servidor**

* **Causas**:

  * Puertos bloqueados por firewall.

  * DNS no apunta correctamente.

* **Solución**:

  * Abrir puertos HTTP/HTTPS en el servidor.

  * Verificar que el dominio resuelve a la IP correcta.

---

### **Problema 2: Keycloak accesible solo dentro del servidor**

* **Causa**: Nginx no reenvía peticiones externas a Keycloak.

* **Solución**:

  * Configurar un vhost específico para Keycloak o exponerlo solo en red interna y gestionar login siempre a través del frontend.

---

### **Problema 3: consumo excesivo de recursos**

* **Causas**:

  * Contenedores Java con memoria por defecto alta.

* **Solución**:

  * Establecer límites de memoria/CPU en `docker-compose.yml`.
