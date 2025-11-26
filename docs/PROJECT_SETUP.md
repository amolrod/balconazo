# **PROJECT_SETUP.md**

Guía de configuración inicial del proyecto **BalconazoApp**

---

## **Índice**

* [1. Introducción](#1-introducción)

* [2. Requisitos previos](#2-requisitos-previos)

  * [2.1 Software necesario](#21-software-necesario)

  * [2.2 Comandos de verificación](#22-comandos-de-verificación)

* [3. Estructura de carpetas del proyecto](#3-estructura-de-carpetas-del-proyecto)

* [4. Creación paso a paso de la estructura](#4-creación-paso-a-paso-de-la-estructura)

* [5. Archivos base](#5-archivos-base)

  * [5.1 .gitignore](#51-gitignore)

  * [5.2 README.md inicial](#52-readmemd-inicial)

  * [5.3 docker-compose.yml inicial (esqueleto)](#53-docker-composeyml-inicial-esqueleto)

* [6. Variables de entorno (.env.example)](#6-variables-de-entorno-envexample)

* [7. Comandos Git iniciales](#7-comandos-git-iniciales)

* [8. Problemas frecuentes y troubleshooting](#8-problemas-frecuentes-y-troubleshooting)

---

## **1. Introducción**

Este documento describe cómo preparar desde cero el entorno de desarrollo para **BalconazoApp**, incluyendo:

* Instalación y verificación del software necesario.

* Creación de la estructura de carpetas del monorepo.

* Configuración de archivos base (`.gitignore`, `README.md`, `docker-compose.yml` inicial).

* Definición de variables de entorno en un `.env.example`.

* Inicialización del repositorio Git.

El objetivo es que **cualquier desarrollador (o asistente de IA como GitHub Copilot)** pueda seguir estos pasos y terminar con un entorno listo para empezar a programar.

---

## **2. Requisitos previos**

### **2.1 Software necesario**

Se recomiendan las siguientes versiones mínimas (puedes usar versiones superiores compatibles):

* **Sistema operativo**

  * Windows 10/11, macOS (incluido Apple Silicon M1/M2) o Linux.

* **Git**

  * Versión recomendada: ≥ 2.40

* **Java Development Kit (JDK)**

  * Versión: **OpenJDK 21**

* **Maven** (o Gradle, pero aquí se asume Maven)

  * Versión recomendada: ≥ 3.9

* **Node.js + npm**

  * Node.js: ≥ 20 LTS

  * npm: versión incluida en Node ≥ 20

* **Docker Engine**

  * Versión recomendada: ≥ 24

* **Docker Compose**

  * Integrado en Docker Desktop (`docker compose`) o binario independiente `docker-compose`.

* **Cliente HTTP para pruebas**

  * Postman, Insomnia o similar (opcional pero muy recomendable).

* **IDE recomendado**

  * Backend: IntelliJ IDEA / Eclipse / VSCode con extensiones Java.

  * Frontend: VSCode con extensiones para React/TypeScript.

### **2.2 Comandos de verificación**

Ver la versión de Git instalada

```bash
git --version
```

Ver la versión de Java instalada

```bash
java -version
```

Ver la versión de Maven instalada

```bash
mvn -v
```

Ver la versión de Node.js instalada

```bash
node -v
```

Ver la versión de npm instalada

```bash
npm -v
```

Ver la versión de Docker instalada

```bash
docker --version
```

Ver la versión de Docker Compose instalada

```bash
docker compose version
```

Si alguno de los comandos devuelve “command not found” o una versión muy antigua, corrige la instalación antes de continuar.

---

## **3. Estructura de carpetas del proyecto**

El proyecto se organizará en un **monorepo** con esta estructura base:

```
balconazoapp/  
├─ backend/  
│  ├─ users-service/  
│  ├─ spaces-service/  
│  └─ bookings-service/  
├─ frontend/  
├─ gateway/  
│  └─ krakend.json  
├─ keycloak/  
│  ├─ realm-export.json  
│  └─ README.md  
├─ infra/  
│  └─ db/  
│     ├─ users/  
│     ├─ spaces/  
│     └─ bookings/  
├─ docs/  
│  ├─ PROJECT_SETUP.md  
│  ├─ DOCKER_SETUP.md  
│  ├─ KEYCLOAK_CONFIG.md  
│  └─ ...  
├─ .env  
├─ .env.example  
├─ .gitignore  
├─ docker-compose.yml  
└─ README.md
```

* `backend/`: contiene los tres microservicios en Java + Spring Boot.

* `frontend/`: contiene la aplicación Next.js + React.

* `gateway/`: configuración de KrakenD (API Gateway).

* `keycloak/`: recursos de configuración (export/import del *realm*, documentación).

* `infra/db/`: volumenes/bind mounts para datos de PostgreSQL.

* `docs/`: documentación técnica (los archivos que estamos generando).

* `.env`: fichero de variables de entorno reales (no se sube a Git).

* `.env.example`: plantilla de variables de entorno (sí se sube a Git).

* `docker-compose.yml`: orquestación completa de la infraestructura.

* `README.md`: documentación general del proyecto.

---

## **4. Creación paso a paso de la estructura**

Crear carpeta raíz del proyecto

```bash
mkdir balconazoapp  
cd balconazoapp
```

Crear carpetas principales

```bash
mkdir backend frontend gateway keycloak infra docs
```

Crear subcarpetas de backend

```bash
mkdir -p backend/users-service backend/spaces-service backend/bookings-service
```

Crear subcarpetas de infra/db

```bash
mkdir -p infra/db/users infra/db/spaces infra/db/bookings
```

Crear archivos vacíos base

```bash
touch README.md docker-compose.yml .gitignore .env.example
```

Crear archivo de configuración de KrakenD

```bash
mkdir -p gateway  
touch gateway/krakend.json
```

Crear documentación inicial

```bash
touch docs/PROJECT_SETUP.md docs/DOCKER_SETUP.md docs/KEYCLOAK_CONFIG.md
```

Después de estos pasos, la estructura básica estará creada y lista para llenarse con contenido y código.

---

## **5. Archivos base**

### **5.1 .gitignore**

Contenido recomendado (adaptable según el IDE):

```
# Maven / Java  
target/  
*.log  
*.class  
*.jar  
*.war  
*.iml  
*.ipr  
*.iws  
.idea/  
*.swp

# Node / Next.js  
node_modules/  
.next/  
dist/  
npm-debug.log*  
yarn-debug.log*  
yarn-error.log*  
coverage/

# Docker  
*.pid  
*.seed  
docker/*.log

# OS  
.DS_Store  
Thumbs.db

# Env files  
.env  
.env.local  
.env.*.local

# VSCode  
.vscode/
```

### **5.2 README.md inicial**

```markdown
# BalconazoApp

BalconazoApp es un marketplace de alquiler de espacios por horas (terrazas, balcones, jardines, salones) entre particulares.

## Estructura del proyecto

- `backend/`: microservicios Java + Spring Boot  
- `frontend/`: aplicación Next.js + React  
- `gateway/`: configuración de KrakenD (API Gateway)  
- `keycloak/`: configuración y export del realm de Keycloak  
- `infra/`: infraestructura auxiliar (bases de datos, scripts)  
- `docs/`: documentación técnica

## Puesta en marcha rápida

1. Copiar `.env.example` a `.env` y revisar valores.  
2. Levantar la infraestructura con Docker Compose:

   ```bash  
   docker compose up -d
   ```

3. Acceder a:

   * Frontend: [http://localhost:3000](http://localhost:3000/)

   * API Gateway: [http://localhost:8080](http://localhost:8080/)

   * Keycloak: [http://localhost:8081](http://localhost:8081/)
```

### **5.3 docker-compose.yml inicial (esqueleto)**

> Crear un esqueleto de `docker-compose.yml` que se completará en DOCKER_SETUP.md  

```yaml  
version: "3.9"

services:  
  # Se rellenará en detalle en DOCKER_SETUP.md  
  # Ejemplo de estructura:  
  # - bases de datos (postgres-users, postgres-spaces, postgres-bookings)  
  # - keycloak  
  # - krakend (API Gateway)  
  # - microservicios backend  
  # - frontend

networks:  
  balconazo-net:  
    driver: bridge
```

Este archivo se completará con todos los servicios en `DOCKER_SETUP.md`.

---

## **6. Variables de entorno (.env.example)**

El archivo `.env.example` define todas las variables de entorno que usará `docker-compose.yml` y los servicios.

Crear `.env.example` con contenido básico

```bash
cat > .env.example << 'EOF'  
# ================================  
# Variables globales  
# ================================  
PROJECT_NAME=balconazoapp

# ================================  
# PostgreSQL - users-service  
# ================================  
USERS_DB_HOST=postgres-users  
USERS_DB_PORT=5433  
USERS_DB_NAME=usersdb  
USERS_DB_USER=balconazo_users  
USERS_DB_PASSWORD=balconazo_users_pass

# ================================  
# PostgreSQL - spaces-service  
# ================================  
SPACES_DB_HOST=postgres-spaces  
SPACES_DB_PORT=5434  
SPACES_DB_NAME=spacesdb  
SPACES_DB_USER=balconazo_spaces  
SPACES_DB_PASSWORD=balconazo_spaces_pass

# ================================  
# PostgreSQL - bookings-service  
# ================================  
BOOKINGS_DB_HOST=postgres-bookings  
BOOKINGS_DB_PORT=5435  
BOOKINGS_DB_NAME=bookingsdb  
BOOKINGS_DB_USER=balconazo_bookings  
BOOKINGS_DB_PASSWORD=balconazo_bookings_pass

# ================================  
# Keycloak  
# ================================  
KEYCLOAK_HTTP_PORT=8081  
KEYCLOAK_ADMIN_USER=admin  
KEYCLOAK_ADMIN_PASSWORD=admin  
KEYCLOAK_REALM=balconazo  
KEYCLOAK_FRONTEND_CLIENT_ID=balconazo-frontend  
KEYCLOAK_API_CLIENT_ID=balconazo-api

# ================================  
# KrakenD (API Gateway)  
# ================================  
KRAKEND_PORT=8080  
KRAKEND_LOG_LEVEL=DEBUG  
KRAKEND_JWKS_URL=http://keycloak:${KEYCLOAK_HTTP_PORT}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/certs  
KRAKEND_ALLOWED_ORIGINS=http://localhost:3000

# ================================  
# Microservicios backend  
# ================================  
USERS_SERVICE_PORT=8082  
SPACES_SERVICE_PORT=8083  
BOOKINGS_SERVICE_PORT=8084

# Spring profiles  
SPRING_PROFILES_ACTIVE=docker

# ================================  
# Frontend (Next.js)  
# ================================  
FRONTEND_PORT=3000  
NEXT_PUBLIC_API_BASE_URL=http://localhost:${KRAKEND_PORT}  
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:${KEYCLOAK_HTTP_PORT}  
NEXT_PUBLIC_KEYCLOAK_REALM=${KEYCLOAK_REALM}  
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=${KEYCLOAK_FRONTEND_CLIENT_ID}  
EOF
```

Explicación rápida de las variables

* `USERS_DB_*`, `SPACES_DB_*`, `BOOKINGS_DB_*`: configuración de cada base de datos PostgreSQL.

* `KEYCLOAK_*`: configuración de Keycloak (puerto, admin, realm, clientes).

* `KRAKEND_*`: configuración principal del API Gateway (puerto, nivel de logs, URL de JWKS para validar JWT).

* `USERS_SERVICE_PORT`, etc.: puertos internos de los microservicios.

* `FRONTEND_PORT`: puerto donde se expondrá el frontend.

* `NEXT_PUBLIC_*`: variables de entorno accesibles desde el código del frontend (Next.js) para configurar la comunicación con Keycloak y el API.

Copiar `.env.example` a `.env` para uso real

```bash
cp .env.example .env
```

---

## **7. Comandos Git iniciales**

Inicializar repositorio Git en la carpeta raíz

```bash
git init
```

Añadir todos los archivos actuales al *staging area*

```bash
git add .
```

Crear el primer commit con un mensaje estándar

```bash
git commit -m "chore: initial project structure"
```

(Opcional) Añadir un remoto en GitHub/GitLab

```bash
git remote add origin git@github.com:TU_USUARIO/balconazoapp.git
```

(Opcional) Subir la rama principal al remoto

```bash
git push -u origin main
```

---

## **8. Problemas frecuentes y troubleshooting**

### **Problema 1: `java -version` devuelve una versión < 21**

* **Síntoma:**  
   El comando muestra Java 8, 11 o similar.

* **Causa probable:**  
   Tienes instalada una JDK antigua o el `JAVA_HOME` apunta a una versión antigua.

* **Solución:**

  1. Instala OpenJDK 21 (por ejemplo, con SDKMAN, brew o instalador oficial).

  2. Asegúrate de que `JAVA_HOME` apunta a la carpeta de Java 21.

  3. Cierra y reabre la terminal, vuelve a ejecutar `java -version`.

---

### **Problema 2: `docker compose` no se reconoce**

* **Síntoma:**  
   Al ejecutar `docker compose version`, aparece “command not found”.

* **Causa probable:**

  * Docker Desktop no está instalado o no está actualizado.

  * En Linux, falta instalar Docker Compose.

* **Solución:**

  * Instalar Docker Desktop (Windows/macOS) o Docker Engine + Compose (Linux).

  * Comprobar que Docker está en la variable PATH.

---

### **Problema 3: Conflictos de puertos (3000, 8080, 8081...)**

* **Síntoma:**  
   Al levantar servicios (más adelante) aparecerán errores de que el puerto ya está en uso.

* **Causa probable:**  
   Otro servicio (por ejemplo, una app React previa o un servidor local) ya utiliza ese puerto.

* **Solución:**

  * Identificar el proceso que usa el puerto (`lsof -i :3000` en mac/Linux).

  * Pararlo o cambiar los puertos en el `.env` y en `docker-compose.yml`.

---

### **Problema 4: `.env` no se tiene en cuenta**

* **Síntoma:**  
   Variables definidas en `.env` no parecen aplicarse al ejecutar `docker compose`.

* **Causa probable:**

  * El archivo `.env` no está en la carpeta raíz donde se ejecuta `docker compose`.

  * Nombre incorrecto (`.env.txt` en lugar de `.env`).

* **Solución:**

  * Asegurarse de que `.env` está en la raíz del proyecto (junto a `docker-compose.yml`).

  * Verificar que no hay extensiones ocultas.
