# **PROJECT\_SETUP.md**

Guía de configuración inicial del proyecto **BalconazoApp**

---

## **Índice**

* [1\. Introducción](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#1-introducci%C3%B3n)

* [2\. Requisitos previos](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#2-requisitos-previos)

  * [2.1 Software necesario](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#21-software-necesario)

  * [2.2 Comandos de verificación](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#22-comandos-de-verificaci%C3%B3n)

* [3\. Estructura de carpetas del proyecto](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#3-estructura-de-carpetas-del-proyecto)

* [4\. Creación paso a paso de la estructura](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#4-creaci%C3%B3n-paso-a-paso-de-la-estructura)

* [5\. Archivos base](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#5-archivos-base)

  * [5.1 .gitignore](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#51-gitignore)

  * [5.2 README.md inicial](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#52-readmemd-inicial)

  * [5.3 docker-compose.yml inicial (esqueleto)](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#53-docker-composeyml-inicial-esqueleto)

* [6\. Variables de entorno (.env.example)](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#6-variables-de-entorno-envexample)

* [7\. Comandos Git iniciales](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#7-comandos-git-iniciales)

* [8\. Problemas frecuentes y troubleshooting](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#8-problemas-frecuentes-y-troubleshooting)

---

## **1\. Introducción**

Este documento describe cómo preparar desde cero el entorno de desarrollo para **BalconazoApp**, incluyendo:

* Instalación y verificación del software necesario.

* Creación de la estructura de carpetas del monorepo.

* Configuración de archivos base (`.gitignore`, `README.md`, `docker-compose.yml` inicial).

* Definición de variables de entorno en un `.env.example`.

* Inicialización del repositorio Git.

El objetivo es que **cualquier desarrollador (o asistente de IA como GitHub Copilot)** pueda seguir estos pasos y terminar con un entorno listo para empezar a programar.

---

## **2\. Requisitos previos**

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

* **Node.js \+ npm**

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

git \--version

Ver la versión de Java instalada

java \-version

Ver la versión de Maven instalada

mvn \-v

Ver la versión de Node.js instalada

node \-v

Ver la versión de npm instalada

npm \-v

Ver la versión de Docker instalada

docker \--version

Ver la versión de Docker Compose instalada

docker compose version

Si alguno de los comandos devuelve “command not found” o una versión muy antigua, corrige la instalación antes de continuar.

---

## **3\. Estructura de carpetas del proyecto**

El proyecto se organizará en un **monorepo** con esta estructura base:

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
│  ├─ PROJECT\_SETUP.md  
│  ├─ DOCKER\_SETUP.md  
│  ├─ KEYCLOAK\_CONFIG.md  
│  └─ ...  
├─ .env  
├─ .env.example  
├─ .gitignore  
├─ docker-compose.yml  
└─ README.md

* `backend/`: contiene los tres microservicios en Java \+ Spring Boot.

* `frontend/`: contiene la aplicación Next.js \+ React.

* `gateway/`: configuración de KrakenD (API Gateway).

* `keycloak/`: recursos de configuración (export/import del *realm*, documentación).

* `infra/db/`: volumenes/bind mounts para datos de PostgreSQL.

* `docs/`: documentación técnica (los archivos que estamos generando).

* `.env`: fichero de variables de entorno reales (no se sube a Git).

* `.env.example`: plantilla de variables de entorno (sí se sube a Git).

* `docker-compose.yml`: orquestación completa de la infraestructura.

* `README.md`: documentación general del proyecto.

---

## **4\. Creación paso a paso de la estructura**

Crear carpeta raíz del proyecto

mkdir balconazoapp  
cd balconazoapp

Crear carpetas principales

mkdir backend frontend gateway keycloak infra docs

Crear subcarpetas de backend

mkdir \-p backend/users-service backend/spaces-service backend/bookings-service

Crear subcarpetas de infra/db

mkdir \-p infra/db/users infra/db/spaces infra/db/bookings

Crear archivos vacíos base

touch README.md docker-compose.yml .gitignore .env.example

Crear archivo de configuración de KrakenD

mkdir \-p gateway  
touch gateway/krakend.json

Crear documentación inicial

touch docs/PROJECT\_SETUP.md docs/DOCKER\_SETUP.md docs/KEYCLOAK\_CONFIG.md

Después de estos pasos, la estructura básica estará creada y lista para llenarse con contenido y código.

---

## **5\. Archivos base**

### **5.1 .gitignore**

Contenido recomendado (adaptable según el IDE):

\# Maven / Java  
target/  
\*.log  
\*.class  
\*.jar  
\*.war  
\*.iml  
\*.ipr  
\*.iws  
.idea/  
\*.swp

\# Node / Next.js  
node\_modules/  
.next/  
dist/  
npm-debug.log\*  
yarn-debug.log\*  
yarn-error.log\*  
coverage/

\# Docker  
\*.pid  
\*.seed  
docker/\*.log

\# OS  
.DS\_Store  
Thumbs.db

\# Env files  
.env  
.env.local  
.env.\*.local

\# VSCode  
.vscode/

### **5.2 README.md inicial**

\# BalconazoApp

BalconazoApp es un marketplace de alquiler de espacios por horas (terrazas, balcones, jardines, salones) entre particulares.

\#\# Estructura del proyecto

\- \`backend/\`: microservicios Java \+ Spring Boot  
\- \`frontend/\`: aplicación Next.js \+ React  
\- \`gateway/\`: configuración de KrakenD (API Gateway)  
\- \`keycloak/\`: configuración y export del realm de Keycloak  
\- \`infra/\`: infraestructura auxiliar (bases de datos, scripts)  
\- \`docs/\`: documentación técnica

\#\# Puesta en marcha rápida

1\. Copiar \`.env.example\` a \`.env\` y revisar valores.  
2\. Levantar la infraestructura con Docker Compose:

   \`\`\`bash  
   docker compose up \-d

3. Acceder a:

   * Frontend: [http://localhost:3000](http://localhost:3000/)

   * API Gateway: [http://localhost:8080](http://localhost:8080/)

   * Keycloak: [http://localhost:8081](http://localhost:8081/)

\#\#\# 5.3 docker-compose.yml inicial (esqueleto)

\> Crear un esqueleto de \`docker-compose.yml\` que se completará en DOCKER\_SETUP.md  

\`\`\`yaml  
version: "3.9"

services:  
  \# Se rellenará en detalle en DOCKER\_SETUP.md  
  \# Ejemplo de estructura:  
  \# \- bases de datos (postgres-users, postgres-spaces, postgres-bookings)  
  \# \- keycloak  
  \# \- krakend (API Gateway)  
  \# \- microservicios backend  
  \# \- frontend

networks:  
  balconazo-net:  
    driver: bridge

Este archivo se completará con todos los servicios en `DOCKER_SETUP.md`.

---

## **6\. Variables de entorno (.env.example)**

El archivo `.env.example` define todas las variables de entorno que usará `docker-compose.yml` y los servicios.

Crear `.env.example` con contenido básico

cat \> .env.example \<\< 'EOF'  
\# \================================  
\# Variables globales  
\# \================================  
PROJECT\_NAME=balconazoapp

\# \================================  
\# PostgreSQL \- users-service  
\# \================================  
USERS\_DB\_HOST=postgres-users  
USERS\_DB\_PORT=5433  
USERS\_DB\_NAME=usersdb  
USERS\_DB\_USER=balconazo\_users  
USERS\_DB\_PASSWORD=balconazo\_users\_pass

\# \================================  
\# PostgreSQL \- spaces-service  
\# \================================  
SPACES\_DB\_HOST=postgres-spaces  
SPACES\_DB\_PORT=5434  
SPACES\_DB\_NAME=spacesdb  
SPACES\_DB\_USER=balconazo\_spaces  
SPACES\_DB\_PASSWORD=balconazo\_spaces\_pass

\# \================================  
\# PostgreSQL \- bookings-service  
\# \================================  
BOOKINGS\_DB\_HOST=postgres-bookings  
BOOKINGS\_DB\_PORT=5435  
BOOKINGS\_DB\_NAME=bookingsdb  
BOOKINGS\_DB\_USER=balconazo\_bookings  
BOOKINGS\_DB\_PASSWORD=balconazo\_bookings\_pass

\# \================================  
\# Keycloak  
\# \================================  
KEYCLOAK\_HTTP\_PORT=8081  
KEYCLOAK\_ADMIN\_USER=admin  
KEYCLOAK\_ADMIN\_PASSWORD=admin  
KEYCLOAK\_REALM=balconazo  
KEYCLOAK\_FRONTEND\_CLIENT\_ID=balconazo-frontend  
KEYCLOAK\_API\_CLIENT\_ID=balconazo-api

\# \================================  
\# KrakenD (API Gateway)  
\# \================================  
KRAKEND\_PORT=8080  
KRAKEND\_LOG\_LEVEL=DEBUG  
KRAKEND\_JWKS\_URL=http://keycloak:${KEYCLOAK\_HTTP\_PORT}/realms/${KEYCLOAK\_REALM}/protocol/openid-connect/certs  
KRAKEND\_ALLOWED\_ORIGINS=http://localhost:3000

\# \================================  
\# Microservicios backend  
\# \================================  
USERS\_SERVICE\_PORT=8082  
SPACES\_SERVICE\_PORT=8083  
BOOKINGS\_SERVICE\_PORT=8084

\# Spring profiles  
SPRING\_PROFILES\_ACTIVE=docker

\# \================================  
\# Frontend (Next.js)  
\# \================================  
FRONTEND\_PORT=3000  
NEXT\_PUBLIC\_API\_BASE\_URL=http://localhost:${KRAKEND\_PORT}  
NEXT\_PUBLIC\_KEYCLOAK\_URL=http://localhost:${KEYCLOAK\_HTTP\_PORT}  
NEXT\_PUBLIC\_KEYCLOAK\_REALM=${KEYCLOAK\_REALM}  
NEXT\_PUBLIC\_KEYCLOAK\_CLIENT\_ID=${KEYCLOAK\_FRONTEND\_CLIENT\_ID}  
EOF

Explicación rápida de las variables

* `USERS_DB_*`, `SPACES_DB_*`, `BOOKINGS_DB_*`: configuración de cada base de datos PostgreSQL.

* `KEYCLOAK_*`: configuración de Keycloak (puerto, admin, realm, clientes).

* `KRAKEND_*`: configuración principal del API Gateway (puerto, nivel de logs, URL de JWKS para validar JWT).

* `USERS_SERVICE_PORT`, etc.: puertos internos de los microservicios.

* `FRONTEND_PORT`: puerto donde se expondrá el frontend.

* `NEXT_PUBLIC_*`: variables de entorno accesibles desde el código del frontend (Next.js) para configurar la comunicación con Keycloak y el API.

Copiar `.env.example` a `.env` para uso real

cp .env.example .env

---

## **7\. Comandos Git iniciales**

Inicializar repositorio Git en la carpeta raíz

git init

Añadir todos los archivos actuales al *staging area*

git add .

Crear el primer commit con un mensaje estándar

git commit \-m "chore: initial project structure"

(Opcional) Añadir un remoto en GitHub/GitLab

git remote add origin git@github.com:TU\_USUARIO/balconazoapp.git

(Opcional) Subir la rama principal al remoto

git push \-u origin main

---

## **8\. Problemas frecuentes y troubleshooting**

### **Problema 1: `java -version` devuelve una versión \< 21**

* **Síntoma:**  
   El comando muestra Java 8, 11 o similar.

* **Causa probable:**  
   Tienes instalada una JDK antigua o el `JAVA_HOME` apunta a una versión antigua.

* **Solución:**

  1. Instala OpenJDK 21 (por ejemplo, con SDKMAN, brew o instalador oficial).

  2. Asegúrate de que `JAVA_HOME` apunta a la carpeta de Java 21\.

  3. Cierra y reabre la terminal, vuelve a ejecutar `java -version`.

---

### **Problema 2: `docker compose` no se reconoce**

* **Síntoma:**  
   Al ejecutar `docker compose version`, aparece “command not found”.

* **Causa probable:**

  * Docker Desktop no está instalado o no está actualizado.

  * En Linux, falta instalar Docker Compose.

* **Solución:**

  * Instalar Docker Desktop (Windows/macOS) o Docker Engine \+ Compose (Linux).

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

---

---

# **DOCKER\_SETUP.md**

Infraestructura Docker y `docker-compose` para BalconazoApp

---

## **Índice**

* [1\. Introducción](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#1-introducci%C3%B3n-1)

* [2\. docker-compose.yml completo](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#2-docker-composeyml-completo)

* [3\. Descripción detallada de servicios](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#3-descripci%C3%B3n-detallada-de-servicios)

* [4\. Puertos y redes](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#4-puertos-y-redes)

* [5\. Comandos Docker habituales](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#5-comandos-docker-habituales)

* [6\. Optimización para MacBook M1/M2](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#6-optimizaci%C3%B3n-para-macbook-m1m2)

* [7\. Troubleshooting específico de Docker](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#7-troubleshooting-espec%C3%ADfico-de-docker)

---

## **1\. Introducción**

Este documento define y explica la infraestructura Docker de BalconazoApp. Utilizaremos **Docker Compose** para levantar:

* 3 bases de datos PostgreSQL (una por microservicio).

* Keycloak (gestión de identidad).

* KrakenD (API Gateway).

* 3 microservicios backend (users, spaces, bookings).

* Frontend Next.js.

Todo se conectará en una misma red Docker (`balconazo-net`) para facilitar la comunicación interna.

---

## **2\. docker-compose.yml completo**

Reemplazar el contenido del `docker-compose.yml` raíz por el siguiente

version: "3.9"

services:  
  \# \=========================  
  \# Bases de datos PostgreSQL  
  \# \=========================

  postgres-users:  
    image: postgres:16-alpine  
    container\_name: ${PROJECT\_NAME}-postgres-users  
    restart: unless-stopped  
    environment:  
      POSTGRES\_DB: ${USERS\_DB\_NAME}  
      POSTGRES\_USER: ${USERS\_DB\_USER}  
      POSTGRES\_PASSWORD: ${USERS\_DB\_PASSWORD}  
    ports:  
      \- "${USERS\_DB\_PORT}:5432"  
    volumes:  
      \- ./infra/db/users:/var/lib/postgresql/data  
    networks:  
      \- balconazo-net  
    healthcheck:  
      test: \["CMD-SHELL", "pg\_isready \-U ${USERS\_DB\_USER} \-d ${USERS\_DB\_NAME}"\]  
      interval: 10s  
      timeout: 5s  
      retries: 5

  postgres-spaces:  
    image: postgres:16-alpine  
    container\_name: ${PROJECT\_NAME}-postgres-spaces  
    restart: unless-stopped  
    environment:  
      POSTGRES\_DB: ${SPACES\_DB\_NAME}  
      POSTGRES\_USER: ${SPACES\_DB\_USER}  
      POSTGRES\_PASSWORD: ${SPACES\_DB\_PASSWORD}  
    ports:  
      \- "${SPACES\_DB\_PORT}:5432"  
    volumes:  
      \- ./infra/db/spaces:/var/lib/postgresql/data  
    networks:  
      \- balconazo-net  
    healthcheck:  
      test: \["CMD-SHELL", "pg\_isready \-U ${SPACES\_DB\_USER} \-d ${SPACES\_DB\_NAME}"\]  
      interval: 10s  
      timeout: 5s  
      retries: 5

  postgres-bookings:  
    image: postgres:16-alpine  
    container\_name: ${PROJECT\_NAME}-postgres-bookings  
    restart: unless-stopped  
    environment:  
      POSTGRES\_DB: ${BOOKINGS\_DB\_NAME}  
      POSTGRES\_USER: ${BOOKINGS\_DB\_USER}  
      POSTGRES\_PASSWORD: ${BOOKINGS\_DB\_PASSWORD}  
    ports:  
      \- "${BOOKINGS\_DB\_PORT}:5432"  
    volumes:  
      \- ./infra/db/bookings:/var/lib/postgresql/data  
    networks:  
      \- balconazo-net  
    healthcheck:  
      test: \["CMD-SHELL", "pg\_isready \-U ${BOOKINGS\_DB\_USER} \-d ${BOOKINGS\_DB\_NAME}"\]  
      interval: 10s  
      timeout: 5s  
      retries: 5

  \# \============  
  \# Keycloak  
  \# \============

  keycloak:  
    image: quay.io/keycloak/keycloak:22.0  
    container\_name: ${PROJECT\_NAME}-keycloak  
    restart: unless-stopped  
    command: \["start-dev"\]  
    environment:  
      KEYCLOAK\_ADMIN: ${KEYCLOAK\_ADMIN\_USER}  
      KEYCLOAK\_ADMIN\_PASSWORD: ${KEYCLOAK\_ADMIN\_PASSWORD}  
      KC\_HTTP\_PORT: 8080  
    ports:  
      \- "${KEYCLOAK\_HTTP\_PORT}:8080"  
    networks:  
      \- balconazo-net  
    healthcheck:  
      test: \["CMD-SHELL", "curl \-f http://localhost:8080/realms/master || exit 1"\]  
      interval: 15s  
      timeout: 5s  
      retries: 10

  \# \===============  
  \# KrakenD Gateway  
  \# \===============

  krakend:  
    image: devopsfaith/krakend:2.4  
    container\_name: ${PROJECT\_NAME}-krakend  
    restart: unless-stopped  
    volumes:  
      \- ./gateway/krakend.json:/etc/krakend/krakend.json  
    environment:  
      KRAKEND\_PORT: ${KRAKEND\_PORT}  
      KRAKEND\_LOG\_LEVEL: ${KRAKEND\_LOG\_LEVEL}  
    ports:  
      \- "${KRAKEND\_PORT}:8080"  
    depends\_on:  
      keycloak:  
        condition: service\_healthy  
      users-service:  
        condition: service\_healthy  
      spaces-service:  
        condition: service\_healthy  
      bookings-service:  
        condition: service\_healthy  
    networks:  
      \- balconazo-net  
    healthcheck:  
      test: \["CMD-SHELL", "curl \-f http://localhost:8080/\_\_health || exit 1"\]  
      interval: 10s  
      timeout: 5s  
      retries: 10

  \# \==================  
  \# Microservicios BE  
  \# \==================

  users-service:  
    build:  
      context: ./backend/users-service  
      dockerfile: Dockerfile  
    container\_name: ${PROJECT\_NAME}-users-service  
    restart: unless-stopped  
    environment:  
      SPRING\_PROFILES\_ACTIVE: ${SPRING\_PROFILES\_ACTIVE}  
      SPRING\_DATASOURCE\_URL: jdbc:postgresql://${USERS\_DB\_HOST}:5432/${USERS\_DB\_NAME}  
      SPRING\_DATASOURCE\_USERNAME: ${USERS\_DB\_USER}  
      SPRING\_DATASOURCE\_PASSWORD: ${USERS\_DB\_PASSWORD}  
      SPRING\_SECURITY\_OAUTH2\_RESOURCESERVER\_JWT\_ISSUER\_URI: http://keycloak:8080/realms/${KEYCLOAK\_REALM}  
    ports:  
      \- "${USERS\_SERVICE\_PORT}:8080"  
    depends\_on:  
      postgres-users:  
        condition: service\_healthy  
      keycloak:  
        condition: service\_healthy  
    networks:  
      \- balconazo-net  
    healthcheck:  
      test: \["CMD-SHELL", "curl \-f http://localhost:8080/actuator/health || exit 1"\]  
      interval: 10s  
      timeout: 5s  
      retries: 10

  spaces-service:  
    build:  
      context: ./backend/spaces-service  
      dockerfile: Dockerfile  
    container\_name: ${PROJECT\_NAME}-spaces-service  
    restart: unless-stopped  
    environment:  
      SPRING\_PROFILES\_ACTIVE: ${SPRING\_PROFILES\_ACTIVE}  
      SPRING\_DATASOURCE\_URL: jdbc:postgresql://${SPACES\_DB\_HOST}:5432/${SPACES\_DB\_NAME}  
      SPRING\_DATASOURCE\_USERNAME: ${SPACES\_DB\_USER}  
      SPRING\_DATASOURCE\_PASSWORD: ${SPACES\_DB\_PASSWORD}  
      SPRING\_SECURITY\_OAUTH2\_RESOURCESERVER\_JWT\_ISSUER\_URI: http://keycloak:8080/realms/${KEYCLOAK\_REALM}  
    ports:  
      \- "${SPACES\_SERVICE\_PORT}:8080"  
    depends\_on:  
      postgres-spaces:  
        condition: service\_healthy  
      keycloak:  
        condition: service\_healthy  
    networks:  
      \- balconazo-net  
    healthcheck:  
      test: \["CMD-SHELL", "curl \-f http://localhost:8080/actuator/health || exit 1"\]  
      interval: 10s  
      timeout: 5s  
      retries: 10

  bookings-service:  
    build:  
      context: ./backend/bookings-service  
      dockerfile: Dockerfile  
    container\_name: ${PROJECT\_NAME}-bookings-service  
    restart: unless-stopped  
    environment:  
      SPRING\_PROFILES\_ACTIVE: ${SPRING\_PROFILES\_ACTIVE}  
      SPRING\_DATASOURCE\_URL: jdbc:postgresql://${BOOKINGS\_DB\_HOST}:5432/${BOOKINGS\_DB\_NAME}  
      SPRING\_DATASOURCE\_USERNAME: ${BOOKINGS\_DB\_USER}  
      SPRING\_DATASOURCE\_PASSWORD: ${BOOKINGS\_DB\_PASSWORD}  
      SPRING\_SECURITY\_OAUTH2\_RESOURCESERVER\_JWT\_ISSUER\_URI: http://keycloak:8080/realms/${KEYCLOAK\_REALM}  
    ports:  
      \- "${BOOKINGS\_SERVICE\_PORT}:8080"  
    depends\_on:  
      postgres-bookings:  
        condition: service\_healthy  
      keycloak:  
        condition: service\_healthy  
    networks:  
      \- balconazo-net  
    healthcheck:  
      test: \["CMD-SHELL", "curl \-f http://localhost:8080/actuator/health || exit 1"\]  
      interval: 10s  
      timeout: 5s  
      retries: 10

  \# \==========  
  \# Frontend  
  \# \==========

  frontend:  
    build:  
      context: ./frontend  
      dockerfile: Dockerfile  
    container\_name: ${PROJECT\_NAME}-frontend  
    restart: unless-stopped  
    environment:  
      NEXT\_PUBLIC\_API\_BASE\_URL: ${NEXT\_PUBLIC\_API\_BASE\_URL}  
      NEXT\_PUBLIC\_KEYCLOAK\_URL: ${NEXT\_PUBLIC\_KEYCLOAK\_URL}  
      NEXT\_PUBLIC\_KEYCLOAK\_REALM: ${NEXT\_PUBLIC\_KEYCLOAK\_REALM}  
      NEXT\_PUBLIC\_KEYCLOAK\_CLIENT\_ID: ${NEXT\_PUBLIC\_KEYCLOAK\_CLIENT\_ID}  
      \# Si usas variables del lado servidor añade aquí  
    ports:  
      \- "${FRONTEND\_PORT}:3000"  
    depends\_on:  
      krakend:  
        condition: service\_healthy  
      keycloak:  
        condition: service\_healthy  
    networks:  
      \- balconazo-net  
    healthcheck:  
      test: \["CMD-SHELL", "curl \-f http://localhost:3000 || exit 1"\]  
      interval: 15s  
      timeout: 5s  
      retries: 10

networks:  
  balconazo-net:  
    driver: bridge

---

## **3\. Descripción detallada de servicios**

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

## **4\. Puertos y redes**

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

docker compose ps

### **Red Docker**

Todos los servicios comparten la red:

networks:  
  balconazo-net:  
    driver: bridge

Esto permite que se vean por nombre de servicio (por ejemplo, `users-service`, `keycloak`, `postgres-users`).

---

## **5\. Comandos Docker habituales**

Levantar toda la infraestructura en segundo plano

docker compose up \-d

Ver logs de todos los servicios

docker compose logs \-f

Ver logs de un servicio concreto (ej., users-service)

docker compose logs \-f users-service

Listar contenedores activos del proyecto

docker compose ps

Parar todos los servicios

docker compose down

Parar y borrar contenedores \+ volúmenes (¡borrarás datos de DB\!)

docker compose down \-v

Reconstruir imágenes (por cambios en Dockerfile o código)

docker compose build

Reconstruir y levantar servicios de una vez

docker compose up \-d \--build

Entrar en un contenedor (ej. postgres-users)

docker exec \-it balconazoapp-postgres-users bash

---

## **6\. Optimización para MacBook M1/M2**

En equipos con procesador Apple Silicon (M1/M2):

* Las imágenes `postgres:16-alpine` y `quay.io/keycloak/keycloak:22.0` son **multi-arch**, por lo que deberían funcionar sin especificar `platform`.

* Si alguna imagen no funciona y aparece error de manifest, se puede forzar arquitectura:

Forzar arquitectura amd64 para un servicio concreto

services:  
  postgres-users:  
    platform: linux/amd64  
    image: postgres:16-alpine  
    ...

**Recomendación:**  
 Empieza sin `platform:` y añádelo solo si te encuentras errores relacionados con arquitectura.

---

## **7\. Troubleshooting específico de Docker**

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

 docker compose logs \-f keycloak

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

 docker compose ps

1.   
   2. Revisar `.env` y asegurarse de que `USERS_DB_HOST`, `USERS_DB_NAME`, etc., son correctos.

Si cambias `.env`, ejecuta:

 docker compose down  
docker compose up \-d \--build

3. 

---

### **Problema 4: El frontend no puede acceder al Gateway (CORS o 502\)**

* **Síntoma:**  
   En la consola del navegador aparecen errores CORS o respuestas 502/504 al llamar a `/api`.

* **Causa:**

  1. Configuración CORS de KrakenD incompleta.

  2. El microservicio de destino no está saludable.

* **Solución:**

  1. Revisar configuración CORS en `gateway/krakend.json` (se verá en `KRAKEND_CONFIG.md`).

  2. Verificar que `krakend` tiene `status: running` y que los servicios de backend están “healthy”.

---

---

# **KEYCLOAK\_CONFIG.md**

Configuración de Keycloak para BalconazoApp

---

## **Índice**

* [1\. Introducción](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#1-introducci%C3%B3n-2)

* [2\. Acceso al panel de administración](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#2-acceso-al-panel-de-administraci%C3%B3n)

* [3\. Creación del realm `balconazo`](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#3-creaci%C3%B3n-del-realm-balconazo)

* [4\. Creación de roles](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#4-creaci%C3%B3n-de-roles)

* [5\. Creación de clients](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#5-creaci%C3%B3n-de-clients)

  * [5.1 Client para frontend (`balconazo-frontend`)](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#51-client-para-frontend-balconazo-frontend)

  * [5.2 Client para API/backend (`balconazo-api`)](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#52-client-para-apibackend-balconazo-api)

* [6\. Mappers de claims](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#6-mappers-de-claims)

* [7\. Creación de usuarios de prueba](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#7-creaci%C3%B3n-de-usuarios-de-prueba)

* [8\. Configuración de social login (Google)](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#8-configuraci%C3%B3n-de-social-login-google)

* [9\. Exportar / importar configuración](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#9-exportar--importar-configuraci%C3%B3n)

* [10\. Uso de la CLI de Keycloak](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#10-uso-de-la-cli-de-keycloak)

* [11\. Problemas frecuentes y troubleshooting](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#11-problemas-frecuentes-y-troubleshooting)

---

## **1\. Introducción**

Keycloak es el servidor de identidad (IdP) elegido para gestionar:

* Registro y autenticación de usuarios.

* Roles y permisos.

* Emisión de tokens JWT (Access Token, ID Token).

* Integración con proveedores externos (Google, etc.).

Este documento explica, **paso a paso**, cómo configurar Keycloak para BalconazoApp.

---

## **2\. Acceso al panel de administración**

Con Docker Compose levantado, Keycloak estará disponible en:

* URL: `http://localhost:8081/`

* Admin Console: `http://localhost:8081/admin/`

Credenciales iniciales (definidas en `.env`):

* Usuario: `KEYCLOAK_ADMIN_USER` (por defecto `admin`)

* Contraseña: `KEYCLOAK_ADMIN_PASSWORD` (por defecto `admin`)

Acceder al panel de administración

1. Abre el navegador y entra en `http://localhost:8081/`.

2. Haz clic en **Administration Console**.

3. Introduce el usuario y contraseña de administrador.

4. Pulsa en **Sign In**.

---

## **3\. Creación del realm `balconazo`**

Keycloak agrupa usuarios y configuraciones en **realms**.

Crear el realm `balconazo`

1. En la esquina superior izquierda, en el selector de realm, haz clic en `Master`.

2. Pulsa en **Add realm** (o **Create realm** en versiones nuevas).

3. En el campo **Name**, escribe: `balconazo`.

4. (Opcional) Rellena descripción.

5. Pulsa en **Create**.

A partir de ahora, asegúrate de que el realm seleccionado arriba es **balconazo** y no `Master`.

---

## **4\. Creación de roles**

Crearemos roles a nivel de realm:

* `ROLE_USER` – usuario base (huésped).

* `ROLE_HOST` – anfitrión (puede publicar espacios).

* `ROLE_ADMIN` – administrador (gestión global).

Crear roles en el realm `balconazo`

1. En el menú lateral, ve a **Realm roles**.

2. Pulsa **Create role**.

3. En **Role name**, escribe `ROLE_USER` y pulsa **Save**.

4. Repite el proceso para `ROLE_HOST` y `ROLE_ADMIN`.

Estos roles se asignarán a los usuarios y se incluirán en el token JWT.

---

## **5\. Creación de clients**

Crearemos dos clientes OIDC:

* `balconazo-frontend` → usado por la app Next.js (cliente público).

* `balconazo-api` → usado por los microservicios (cliente *bearer-only* u opcionalmente *confidential*).

### **5.1 Client para frontend (`balconazo-frontend`)**

Crear client para el frontend

1. Menú lateral → **Clients** → botón **Create client**.

2. En **Client ID**, escribe: `balconazo-frontend`.

3. En **Client type**, selecciona **OpenID Connect**.

4. Pulsa **Next**.

5. En **Valid redirect URIs**, añade:

   * `http://localhost:3000/*`

6. En **Home URL**, pon:

   * `http://localhost:3000`

7. En **Web origins**, añade:

   * `http://localhost:3000`

8. Asegúrate de que **Standard flow** está habilitado (Authorization Code).

9. Guarda los cambios.

Este client será de tipo **public** (sin secreto), adecuado para aplicaciones SPA/browser.

### **5.2 Client para API/backend (`balconazo-api`)**

Crear client para la API

1. Menú lateral → **Clients** → **Create client**.

2. **Client ID**: `balconazo-api`.

3. **Client type**: OpenID Connect.

4. Pulsa **Next**.

5. Marca el client como **Bearer-only** (dependiendo de la versión, puede estar en una pestaña “Settings”).

   * Un client *bearer-only* no realiza flujos de login, solo valida tokens recibidos.

6. No es necesario configurar redirect URIs para un client `bearer-only`.

7. Guarda cambios.

Este client se utiliza para representar el backend en términos de protección de recursos.

---

## **6\. Mappers de claims**

Queremos que los tokens incluyan:

* Roles de realm (`realm_access.roles`).

* Email.

* Nombre y apellidos.

En muchos casos, Keycloak ya incluye estos datos por defecto, pero es buena práctica revisarlo.

Verificar mapper de roles en el client

1. En **Clients**, selecciona `balconazo-frontend`.

2. Ve a la pestaña **Client scopes** o **Mappers** (según versión).

3. Asegúrate de tener un mapper del tipo **Realm roles** → **User Realm Role** incluido.

   * Esto hace que los roles se incluyan en el claim `realm_access`.

Crear mapper para incluir el email como claim (si no está)

1. En **Clients** → `balconazo-frontend` → pestaña **Mappers** → **Create**.

2. **Name**: `email`.

3. **Mapper Type**: `User Property`.

4. **Property**: `email`.

5. **Token Claim Name**: `email`.

6. Marca `Add to ID token` y `Add to access token`.

7. Guarda.

Puedes crear mappers similares para `given_name` y `family_name` según necesidades.

---

## **7\. Creación de usuarios de prueba**

Crearemos dos usuarios de ejemplo:

* `guest1` → rol `ROLE_USER`.

* `host1` → roles `ROLE_USER` \+ `ROLE_HOST`.

Crear usuario `guest1`

1. Menú lateral → **Users** → botón **Add user**.

2. **Username**: `guest1`.

3. Establece **Email**, **First name** y **Last name** si lo deseas.

4. Marca `Email verified` si quieres omitir verificación.

5. Guarda.

6. Ve a la pestaña **Credentials**, establece una contraseña (por ejemplo, `guest1`), desactiva “Temporary” para que no obligue a cambiarla.

7. Ve a la pestaña **Role mappings**.

8. En **Realm roles**, selecciona `ROLE_USER` y pulsa **Add selected**.

Crear usuario `host1`

* Repite los pasos anteriores cambiando `Username` a `host1`.

* En **Role mappings**, asigna `ROLE_USER` y `ROLE_HOST`.

---

## **8\. Configuración de social login (Google)**

*(Opcional pero recomendable para una experiencia más realista)*

Resumen de pasos (la configuración detallada depende de la consola de Google):

Configurar Google como Identity Provider

1. En la consola de Google Cloud, crea un proyecto y habilita OAuth 2.0.

2. Crea credenciales de tipo **OAuth client ID** (tipo aplicación web).

3. Define las **Authorized redirect URIs** hacia Keycloak, por ejemplo:

   * `http://localhost:8081/realms/balconazo/broker/google/endpoint`

4. Copia el **Client ID** y **Client secret** de Google.

5. En Keycloak, menú lateral → **Identity Providers** → selecciona `Google`.

6. Introduce `Client ID` y `Client secret`.

7. Guarda.

Tras esto, la pantalla de login de Keycloak mostrará un botón “Login with Google”.

---

## **9\. Exportar / importar configuración**

Para replicar la configuración del realm en otros entornos es útil exportarlo.

### **Exportar realm desde la consola**

Exportar realm `balconazo` desde el panel

1. Ve a **Realm settings** (con el realm `balconazo` seleccionado).

2. Dependiendo de la versión, tendrás una opción de exportar realm (por ejemplo, “Export”).

3. Exporta incluyendo usuarios o sin ellos (según se desee).

4. Descarga el fichero JSON y guárdalo en `keycloak/realm-export.json`.

### **Importar realm al arrancar Keycloak (modo avanzado)**

Keycloak permite arrancar importando un realm desde un fichero, pero eso requeriría ajustar el comando de arranque del contenedor (out of scope del modo “start-dev”). Se recomienda usar la exportación manual para fines de TFG.

---

## **10\. Uso de la CLI de Keycloak**

Dentro del contenedor existe la herramienta `kcadm.sh` para automatizar tareas.

Entrar en el contenedor de Keycloak

docker exec \-it balconazoapp-keycloak bash

Autenticarse en la CLI (dentro del contenedor)

/opt/keycloak/bin/kcadm.sh config credentials \\  
  \--server http://localhost:8080 \\  
  \--realm master \\  
  \--user ${KEYCLOAK\_ADMIN} \\  
  \--password ${KEYCLOAK\_ADMIN\_PASSWORD}

Listar realms existentes

/opt/keycloak/bin/kcadm.sh get realms

Crear un nuevo realm via CLI (ejemplo simplificado)

/opt/keycloak/bin/kcadm.sh create realms \-s realm=balconazo \-s enabled=true

*(La CLI es útil para automatizar scripts de despliegue; para el TFG, la configuración manual vía UI suele ser suficiente.)*

---

## **11\. Problemas frecuentes y troubleshooting**

### **Problema 1: “Invalid redirect URI” al iniciar sesión**

* **Síntoma:**  
   Tras login, Keycloak muestra un error “Invalid redirect URI”.

* **Causa:**  
   La URL de retorno del frontend no coincide exactamente con las configuradas en el client.

* **Solución:**

  1. En `Clients` → `balconazo-frontend` → pestaña **Settings**, revisa **Valid redirect URIs**.

  2. Asegúrate de incluir `http://localhost:3000/*`.

  3. Guarda y repite el login.

---

### **Problema 2: 401/403 desde los microservicios**

* **Síntoma:**  
   El frontend recibe 401/403 al llamar a endpoints protegidos.

* **Causa:**

  1. El token no se está enviando en la cabecera `Authorization`.

  2. El issuer configurado en Spring (`SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_ISSUER_URI`) no coincide con Keycloak.

* **Solución:**

  1. Confirmar en las peticiones que se envía `Authorization: Bearer <token>`.

  2. Revisar que la variable `SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_ISSUER_URI` apunte a `http://keycloak:8080/realms/balconazo`.

---

### **Problema 3: No se ven los roles en el token**

* **Síntoma:**  
   El token JWT no contiene `realm_access.roles` o los roles esperados.

* **Causa:**

  1. Usuarios sin roles asignados.

  2. Mapper de roles no incluido en el client.

* **Solución:**

  1. Revisar `Users` → usuario → **Role mappings**.

  2. Revisar `Clients` → `balconazo-frontend` → **Client scopes / Mappers** y asegurarse de que hay un mapper de `realm roles`.

---

### **Problema 4: No se puede acceder al Admin Console**

* **Síntoma:**  
   `http://localhost:8081/admin` no carga o devuelve error.

* **Causa:**

  1. Keycloak aún no ha terminado de arrancar.

  2. Puertos mal configurados.

* **Solución:**

Ver logs de Keycloak:

 docker compose logs \-f keycloak

1.   
   2. Esperar a que aparezca un mensaje tipo “Started in Xs”.

   3. Verificar que `KEYCLOAK_HTTP_PORT` en `.env` coincide con el puerto del mapeo en `docker-compose.yml`.

---

### **DOCUMENTO 4 INCOMPLETO \- CONTINUAR**

He completado los documentos:

1. `PROJECT_SETUP.md`

2. `DOCKER_SETUP.md`

3. `KEYCLOAK_CONFIG.md`

Quedan pendientes por generar (en orden):

4. `KRAKEND_CONFIG.md`

5. `BACKEND_DEVELOPMENT_GUIDE.md`

6. `FRONTEND_DEVELOPMENT_GUIDE.md`

7. `API_DOCUMENTATION.md`

8. `DATABASE_SCHEMAS.md`

9. `DEVELOPMENT_WORKFLOW.md`

10. `TROUBLESHOOTING.md` (global, más extenso)

11. `TESTING_GUIDE.md`

12. `DEPLOYMENT_GUIDE.md`

13. `SECURITY_CHECKLIST.md`

14. `COPILOT_INSTRUCTIONS.md`

Perfecto, sigo desde el **documento 5** y avanzo en orden.

---

# **BACKEND\_DEVELOPMENT\_GUIDE.md**

Guía de desarrollo backend – Microservicios Spring Boot

---

## **Índice**

* [1\. Introducción](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#1-introducci%C3%B3n)

* [2\. Prerrequisitos](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#2-prerrequisitos)

* [3\. Estructura general del backend](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#3-estructura-general-del-backend)

* [4\. Creación de los proyectos base](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#4-creaci%C3%B3n-de-los-proyectos-base)

  * [4.1 users-service](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#41-users-service)

  * [4.2 spaces-service](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#42-spaces-service)

  * [4.3 bookings-service](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#43-bookings-service)

* [5\. Configuración común (application.yml)](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#5-configuraci%C3%B3n-com%C3%BAn-applicationyml)

* [6\. Implementación por capas](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#6-implementaci%C3%B3n-por-capas)

  * [6.1 Model (entidades)](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#61-model-entidades)

  * [6.2 Repository](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#62-repository)

  * [6.3 Service (lógica de negocio)](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#63-service-l%C3%B3gica-de-negocio)

  * [6.4 Controller (API REST)](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#64-controller-api-rest)

* [7\. Base de datos y migraciones](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#7-base-de-datos-y-migraciones)

* [8\. Testing (unitario e integración)](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#8-testing-unitario-e-integraci%C3%B3n)

* [9\. Comandos útiles](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#9-comandos-%C3%BAtiles)

* [10\. Troubleshooting](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#10-troubleshooting)

---

## **1\. Introducción**

El backend de BalconazoApp se compone de **tres microservicios** implementados con:

* **Java 21**

* **Spring Boot 3.x**

* **Maven**

* **Spring Web, Security, Data JPA y Validation**

* **PostgreSQL**

Los servicios son:

* `users-service` – información de usuarios.

* `spaces-service` – espacios publicados por anfitriones.

* `bookings-service` – reservas de espacios.

Todos se ejecutan en contenedores Docker y se comunican a través de HTTP (vía KrakenD).

---

## **2\. Prerrequisitos**

* JDK 21 instalado y configurado.

* Maven ≥ 3.9.

* Docker/Docker Compose (para levantar las bases de datos).

* Variables del `.env` cargadas cuando uses `docker compose`.

---

## **3\. Estructura general del backend**

Estructura recomendada de carpetas:

backend/  
├─ users-service/  
│  ├─ src/main/java/com/balconazo/users/...  
│  ├─ src/main/resources/application.yml  
│  └─ pom.xml  
├─ spaces-service/  
│  ├─ src/main/java/com/balconazo/spaces/...  
│  ├─ src/main/resources/application.yml  
│  └─ pom.xml  
└─ bookings-service/  
   ├─ src/main/java/com/balconazo/bookings/...  
   ├─ src/main/resources/application.yml  
   └─ pom.xml

Convenciones:

* Paquete raíz: `com.balconazo.<service>`

Capas internas:

 controller/  
service/  
repository/  
model/     (entidades JPA)  
dto/       (objetos de entrada/salida)  
config/    (seguridad, configuración)

* 

---

## **4\. Creación de los proyectos base**

Puedes crear cada microservicio con **Spring Initializr** (web) o la CLI `spring`. A continuación se muestra una opción usando **Maven**.

### **Dependencias comunes para todos los servicios**

En todos los `pom.xml` añade (se muestra con users-service, los otros son análogos):

\<dependencies\>  
    \<\!-- Web REST \--\>  
    \<dependency\>  
        \<groupId\>org.springframework.boot\</groupId\>  
        \<artifactId\>spring-boot-starter-web\</artifactId\>  
    \</dependency\>

    \<\!-- Seguridad \+ JWT (Resource Server) \--\>  
    \<dependency\>  
        \<groupId\>org.springframework.boot\</groupId\>  
        \<artifactId\>spring-boot-starter-oauth2-resource-server\</artifactId\>  
    \</dependency\>

    \<\!-- Data JPA \+ PostgreSQL \--\>  
    \<dependency\>  
        \<groupId\>org.springframework.boot\</groupId\>  
        \<artifactId\>spring-boot-starter-data-jpa\</artifactId\>  
    \</dependency\>  
    \<dependency\>  
        \<groupId\>org.postgresql\</groupId\>  
        \<artifactId\>postgresql\</artifactId\>  
        \<scope\>runtime\</scope\>  
    \</dependency\>

    \<\!-- Validación \--\>  
    \<dependency\>  
        \<groupId\>org.springframework.boot\</groupId\>  
        \<artifactId\>spring-boot-starter-validation\</artifactId\>  
    \</dependency\>

    \<\!-- Actuator \--\>  
    \<dependency\>  
        \<groupId\>org.springframework.boot\</groupId\>  
        \<artifactId\>spring-boot-starter-actuator\</artifactId\>  
    \</dependency\>

    \<\!-- Flyway para migraciones \--\>  
    \<dependency\>  
        \<groupId\>org.flywaydb\</groupId\>  
        \<artifactId\>flyway-core\</artifactId\>  
    \</dependency\>

    \<\!-- Tests \--\>  
    \<dependency\>  
        \<groupId\>org.springframework.boot\</groupId\>  
        \<artifactId\>spring-boot-starter-test\</artifactId\>  
        \<scope\>test\</scope\>  
    \</dependency\>  
\</dependencies\>

### **4.1 users-service**

Crear estructura Maven básica (si quieres usar `mvn archetype` – opcional)

cd backend  
mvn \-B archetype:generate \\  
  \-DgroupId=com.balconazo.users \\  
  \-DartifactId=users-service \\  
  \-DarchetypeArtifactId=maven-archetype-quickstart \\  
  \-DinteractiveMode=false

Luego adapta la estructura a Spring Boot (o crea directamente el proyecto con Spring Initializr y cópialo dentro de `backend/users-service`).

### **4.2 spaces-service**

Mismo patrón, cambiando `groupId`:

cd backend  
mvn \-B archetype:generate \\  
  \-DgroupId=com.balconazo.spaces \\  
  \-DartifactId=spaces-service \\  
  \-DarchetypeArtifactId=maven-archetype-quickstart \\  
  \-DinteractiveMode=false

### **4.3 bookings-service**

cd backend  
mvn \-B archetype:generate \\  
  \-DgroupId=com.balconazo.bookings \\  
  \-DartifactId=bookings-service \\  
  \-DarchetypeArtifactId=maven-archetype-quickstart \\  
  \-DinteractiveMode=false

En la práctica, es más cómodo usar Spring Initializr (web o integración del IDE) para generar cada servicio con las dependencias anteriores seleccionadas.

---

## **5\. Configuración común (application.yml)**

Ejemplo de `src/main/resources/application.yml` para `users-service`:

server:  
  port: 8080

spring:  
  application:  
    name: users-service  
  datasource:  
    url: ${SPRING\_DATASOURCE\_URL}  
    username: ${SPRING\_DATASOURCE\_USERNAME}  
    password: ${SPRING\_DATASOURCE\_PASSWORD}  
  jpa:  
    hibernate:  
      ddl-auto: validate  
    properties:  
      hibernate:  
        dialect: org.hibernate.dialect.PostgreSQLDialect  
  flyway:  
    enabled: true  
    baseline-on-migrate: true

  security:  
    oauth2:  
      resourceserver:  
        jwt:  
          issuer-uri: ${JWT\_ISSUER\_URI}

management:  
  endpoints:  
    web:  
      exposure:  
        include: health,info  
  endpoint:  
    health:  
      probes:  
        enabled: true

Para `spaces-service` y `bookings-service` cambia:

* `spring.application.name`

* Las variables de datasource (en Docker se inyectan con el mismo nombre)

En local sin Docker puedes definir `SPRING_DATASOURCE_URL` directamente en `application-local.yml` y usar el perfil `local`.

---

## **6\. Implementación por capas**

### **6.1 Model (entidades)**

**users-service – ejemplo de entidad User**

package com.balconazo.users.model;

import jakarta.persistence.\*;  
import java.time.Instant;  
import java.util.Set;  
import java.util.UUID;

@Entity  
@Table(name \= "users")  
public class User {

    @Id  
    @Column(name \= "id", nullable \= false, updatable \= false)  
    private UUID id;

    @Column(name \= "email", nullable \= false, unique \= true, length \= 255\)  
    private String email;

    @Column(name \= "name", nullable \= false, length \= 100\)  
    private String name;

    @Column(name \= "surname", nullable \= false, length \= 150\)  
    private String surname;

    @Column(name \= "keycloak\_id", nullable \= false, unique \= true, length \= 255\)  
    private String keycloakId;

    @Column(name \= "created\_at", nullable \= false)  
    private Instant createdAt;

    // getters, setters, constructores estáticos, etc.  
}

### **6.2 Repository**

package com.balconazo.users.repository;

import com.balconazo.users.model.User;  
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;  
import java.util.UUID;

public interface UserRepository extends JpaRepository\<User, UUID\> {

    Optional\<User\> findByEmail(String email);

    Optional\<User\> findByKeycloakId(String keycloakId);  
}

### **6.3 Service (lógica de negocio)**

package com.balconazo.users.service;

import com.balconazo.users.model.User;  
import com.balconazo.users.repository.UserRepository;  
import org.springframework.stereotype.Service;

import java.time.Instant;  
import java.util.UUID;

@Service  
public class UserService {

    private final UserRepository userRepository;  
    private final KeycloakUserInfoProvider keycloakUserInfoProvider;

    public UserService(UserRepository userRepository,  
                       KeycloakUserInfoProvider keycloakUserInfoProvider) {  
        this.userRepository \= userRepository;  
        this.keycloakUserInfoProvider \= keycloakUserInfoProvider;  
    }

    public User getOrCreateCurrentUser(String keycloakId) {  
        return userRepository.findByKeycloakId(keycloakId)  
                .orElseGet(() \-\> createUserFromKeycloak(keycloakId));  
    }

    private User createUserFromKeycloak(String keycloakId) {  
        var info \= keycloakUserInfoProvider.loadUserInfo(keycloakId);

        User user \= new User();  
        user.setId(UUID.randomUUID());  
        user.setEmail(info.email());  
        user.setName(info.givenName());  
        user.setSurname(info.familyName());  
        user.setKeycloakId(keycloakId);  
        user.setCreatedAt(Instant.now());

        return userRepository.save(user);  
    }  
}

`KeycloakUserInfoProvider` sería un componente que extrae información del token JWT o llama al endpoint de `userinfo`.

### **6.4 Controller (API REST)**

package com.balconazo.users.controller;

import com.balconazo.users.dto.UserResponse;  
import com.balconazo.users.model.User;  
import com.balconazo.users.service.UserService;  
import org.springframework.security.core.annotation.AuthenticationPrincipal;  
import org.springframework.security.oauth2.jwt.Jwt;  
import org.springframework.web.bind.annotation.GetMapping;  
import org.springframework.web.bind.annotation.RestController;

@RestController  
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {  
        this.userService \= userService;  
    }

    @GetMapping("/users/me")  
    public UserResponse me(@AuthenticationPrincipal Jwt jwt) {  
        String keycloakId \= jwt.getSubject();  
        User user \= userService.getOrCreateCurrentUser(keycloakId);  
        return UserResponse.from(user);  
    }  
}

**DTO de respuesta:**

package com.balconazo.users.dto;

import com.balconazo.users.model.User;

import java.util.UUID;

public record UserResponse(  
        UUID id,  
        String email,  
        String name,  
        String surname  
) {

    public static UserResponse from(User user) {  
        return new UserResponse(  
                user.getId(),  
                user.getEmail(),  
                user.getName(),  
                user.getSurname()  
        );  
    }  
}

El mismo patrón se aplica en `spaces-service` y `bookings-service`, adaptando entidades y lógica.

---

## **7\. Base de datos y migraciones**

Usamos **Flyway** para versionar la base de datos:

* Carpeta: `src/main/resources/db/migration`.

* Nomenclatura de ficheros: `V1__create_users_table.sql`, `V2__add_index_email.sql`, etc.

**Ejemplo `V1__create_users_table.sql` para users-service:**

CREATE TABLE IF NOT EXISTS users (  
    id UUID PRIMARY KEY,  
    email VARCHAR(255) NOT NULL UNIQUE,  
    name VARCHAR(100) NOT NULL,  
    surname VARCHAR(150) NOT NULL,  
    keycloak\_id VARCHAR(255) NOT NULL UNIQUE,  
    created\_at TIMESTAMP NOT NULL  
);

CREATE INDEX IF NOT EXISTS idx\_users\_email ON users(email);

Flyway ejecutará automáticamente estas migraciones al inicio del microservicio.

---

## **8\. Testing (unitario e integración)**

### **8.1 Dependencias para Testcontainers**

En el `pom.xml` (solo para tests):

\<dependency\>  
    \<groupId\>org.testcontainers\</groupId\>  
    \<artifactId\>postgresql\</artifactId\>  
    \<scope\>test\</scope\>  
\</dependency\>  
\<dependency\>  
    \<groupId\>org.testcontainers\</groupId\>  
    \<artifactId\>junit-jupiter\</artifactId\>  
    \<scope\>test\</scope\>  
\</dependency\>

### **8.2 Ejemplo de test de integración con Testcontainers**

@SpringBootTest  
@Testcontainers  
class UserRepositoryIT {

    @Container  
    static PostgreSQLContainer\<?\> postgres \= new PostgreSQLContainer\<\>("postgres:16-alpine")  
            .withDatabaseName("users\_test")  
            .withUsername("test")  
            .withPassword("test");

    @DynamicPropertySource  
    static void overrideProps(DynamicPropertyRegistry registry) {  
        registry.add("spring.datasource.url", postgres::getJdbcUrl);  
        registry.add("spring.datasource.username", postgres::getUsername);  
        registry.add("spring.datasource.password", postgres::getPassword);  
    }

    @Autowired  
    private UserRepository userRepository;

    @Test  
    void shouldPersistAndFindUser() {  
        User user \= new User();  
        user.setId(UUID.randomUUID());  
        user.setEmail("test@example.com");  
        user.setName("Test");  
        user.setSurname("User");  
        user.setKeycloakId("keycloak-test");  
        user.setCreatedAt(Instant.now());

        userRepository.save(user);

        Optional\<User\> found \= userRepository.findByEmail("test@example.com");  
        assertTrue(found.isPresent());  
    }  
}

---

## **9\. Comandos útiles**

**Ejecutar un microservicio en local (sin Docker)**

cd backend/users-service  
mvn spring-boot:run

**Ejecutar todos los tests del servicio**

mvn test

**Construir el JAR de producción**

mvn clean package

**Ejecutar el JAR (por ejemplo, para users-service)**

java \-jar target/users-service-0.0.1-SNAPSHOT.jar

---

## **10\. Troubleshooting**

**Problema:** `org.postgresql.util.PSQLException: Connection refused`

* **Causa:** base de datos no levantada o URL incorrecta.

* **Solución:**

  * Comprueba que el contenedor `postgres-users` está `healthy`.

  * Verifica `SPRING_DATASOURCE_URL` en el entorno (en Docker lo inyecta `docker-compose.yml`).

---

**Problema:** `Failed to configure a DataSource: 'url' attribute is not specified`

* **Causa:** no se estableció `SPRING_DATASOURCE_URL`.

* **Solución:**

  * Añade la variable de entorno o defínela en `application.yml` para tu perfil.

---

**Problema:** Endpoints devuelven 401/403

* **Causa:** configuración incorrecta de `issuer-uri` o token no enviado.

* **Solución:**

  * Verifica que `JWT_ISSUER_URI` apunta a `http://keycloak:8080/realms/balconazo`.

  * Comprueba que el frontend envía `Authorization: Bearer <token>`.

---

**Problema:** Error `FlywayValidateException` al arrancar

* **Causa:** discrepancia entre el esquema actual y las migraciones.

* **Solución:**

  * En desarrollo, puedes recrear la base de datos (borrando volumen).

  * Ajusta las migraciones para que reflejen el estado real de la base de datos.

---

# **FRONTEND\_DEVELOPMENT\_GUIDE.md**

Guía de desarrollo del frontend – Next.js 15 \+ React

---

## **Índice**

* [1\. Introducción](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#1-introducci%C3%B3n-1)

* [2\. Inicialización del proyecto](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#2-inicializaci%C3%B3n-del-proyecto)

* [3\. Estructura de carpetas](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#3-estructura-de-carpetas)

* [4\. Configuración básica](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#4-configuraci%C3%B3n-b%C3%A1sica)

* [5\. Cliente de API](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#5-cliente-de-api)

* [6\. Autenticación con Keycloak](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#6-autenticaci%C3%B3n-con-keycloak)

* [7\. Implementación: páginas y rutas](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#7-implementaci%C3%B3n-p%C3%A1ginas-y-rutas)

* [8\. Estilos y diseño responsive](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#8-estilos-y-dise%C3%B1o-responsive)

* [9\. Testing de frontend](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#9-testing-de-frontend)

* [10\. Comandos habituales](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#10-comandos-habituales)

* [11\. Troubleshooting](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#11-troubleshooting-1)

---

## **1\. Introducción**

El frontend de BalconazoApp está construido con:

* **Next.js 15** (App Router)

* **React**

* TypeScript

* Tailwind CSS (recomendado para estilos)

Consume la API de KrakenD (`http://localhost:8080/api`) y utiliza Keycloak para autenticación OIDC.

---

## **2\. Inicialización del proyecto**

Desde la raíz del repo:

cd frontend

npx create-next-app@latest . \\  
  \--typescript \\  
  \--eslint \\  
  \--tailwind \\  
  \--src-dir \\  
  \--app \\  
  \--import-alias "@/\*"

Si ya creaste el proyecto con otro comando, asegúrate de:

* Tener `app/` en lugar de `pages/`.

* Usar TypeScript (`.tsx`).

---

## **3\. Estructura de carpetas**

Estructura recomendada:

frontend/  
├─ app/  
│  ├─ layout.tsx  
│  ├─ page.tsx                 (Home)  
│  ├─ spaces/  
│  │  ├─ page.tsx              (Listado de espacios)  
│  │  └─ \[id\]/  
│  │      └─ page.tsx          (Detalle espacio)  
│  ├─ account/  
│  │  ├─ spaces/page.tsx       (Gestión mis espacios)  
│  │  └─ bookings/page.tsx     (Mis reservas)  
│  └─ auth/  
│     └─ callback/page.tsx     (Callback OIDC si lo necesitas)  
├─ components/  
│  ├─ Layout.tsx  
│  ├─ Header.tsx  
│  ├─ SpaceCard.tsx  
│  └─ BookingCard.tsx  
├─ lib/  
│  ├─ api.ts  
│  └─ auth/  
│     └─ keycloak.ts  
├─ styles/  
│  ├─ globals.css  
│  └─ ...  
└─ package.json

---

## **4\. Configuración básica**

### **4.1 Variables de entorno**

En `frontend/.env.local` (puedes reutilizar las `NEXT_PUBLIC_` del `.env` raíz):

NEXT\_PUBLIC\_API\_BASE\_URL=http://localhost:8080/api  
NEXT\_PUBLIC\_KEYCLOAK\_URL=http://localhost:8081  
NEXT\_PUBLIC\_KEYCLOAK\_REALM=balconazo  
NEXT\_PUBLIC\_KEYCLOAK\_CLIENT\_ID=balconazo-frontend

### **4.2 Configuración Tailwind CSS**

`tailwind.config.js` (generado por create-next-app) debe incluir:

module.exports \= {  
  content: \[  
    "./src/app/\*\*/\*.{js,ts,jsx,tsx}",  
    "./src/components/\*\*/\*.{js,ts,jsx,tsx}"  
  \],  
  theme: {  
    extend: {}  
  },  
  plugins: \[\]  
}

---

## **5\. Cliente de API**

Crea `src/lib/api.ts`:

// src/lib/api.ts  
const API\_BASE\_URL \= process.env.NEXT\_PUBLIC\_API\_BASE\_URL ?? "http://localhost:8080/api";

export async function apiFetch\<T\>(  
  path: string,  
  options: RequestInit \= {},  
  accessToken?: string  
): Promise\<T\> {  
  const headers: HeadersInit \= {  
    "Content-Type": "application/json",  
    ...(options.headers || {})  
  };

  if (accessToken) {  
    headers\["Authorization"\] \= \`Bearer ${accessToken}\`;  
  }

  const res \= await fetch(\`${API\_BASE\_URL}${path}\`, {  
    ...options,  
    headers,  
    cache: "no-store"  
  });

  if (\!res.ok) {  
    const text \= await res.text();  
    throw new Error(\`API error ${res.status}: ${text}\`);  
  }

  return res.json() as Promise\<T\>;  
}

Ejemplo de uso en un componente servidor:

import { apiFetch } from "@/lib/api";

export async function getSpaces() {  
  return apiFetch\<SpaceSummary\[\]\>("/spaces");  
}

---

## **6\. Autenticación con Keycloak**

### **6.1 Instalación de `keycloak-js`**

npm install keycloak-js

### **6.2 Inicializar Keycloak en el cliente**

`src/lib/auth/keycloak.ts`:

"use client";

import Keycloak from "keycloak-js";

const keycloak \= new Keycloak({  
  url: process.env.NEXT\_PUBLIC\_KEYCLOAK\_URL,  
  realm: process.env.NEXT\_PUBLIC\_KEYCLOAK\_REALM,  
  clientId: process.env.NEXT\_PUBLIC\_KEYCLOAK\_CLIENT\_ID  
});

export default keycloak;

### **6.3 Provider de autenticación**

`src/components/AuthProvider.tsx`:

"use client";

import { ReactNode, useEffect, useState } from "react";  
import keycloak from "@/lib/auth/keycloak";

type AuthContextValue \= {  
  initialized: boolean;  
  authenticated: boolean;  
  token?: string;  
};

export const AuthContext \= React.createContext\<AuthContextValue\>({  
  initialized: false,  
  authenticated: false  
});

export function AuthProvider({ children }: { children: ReactNode }) {  
  const \[state, setState\] \= useState\<AuthContextValue\>({  
    initialized: false,  
    authenticated: false  
  });

  useEffect(() \=\> {  
    keycloak  
      .init({ onLoad: "check-sso", silentCheckSsoRedirectUri: window.location.origin \+ "/silent-check-sso.html" })  
      .then(authenticated \=\> {  
        setState({  
          initialized: true,  
          authenticated,  
          token: keycloak.token ?? undefined  
        });  
      });  
  }, \[\]);

  return (  
    \<AuthContext.Provider value={state}\>  
      {children}  
    \</AuthContext.Provider\>  
  );  
}

En `app/layout.tsx`, envuelve tu contenido con `AuthProvider`.

---

## **7\. Implementación: páginas y rutas**

### **7.1 Home (`app/page.tsx`)**

* Buscador de espacios (ciudad, fechas).

* Lista de espacios destacados (llamada a `/spaces`).

### **7.2 Listado de espacios (`app/spaces/page.tsx`)**

* Usa el cliente de API para obtener espacios.

* Renderiza tarjetas `SpaceCard`.

### **7.3 Detalle de espacio (`app/spaces/[id]/page.tsx`)**

* Obtiene detalle por `params.id`.

* Permite seleccionar fecha/hora y lanzar acción de reserva.

### **7.4 Panel de usuario (`app/account/...`)**

* `account/spaces`: listado y edición de espacios del anfitrión.

* `account/bookings`: reservas como huésped y anfitrión.

### **7.5 Protección de rutas**

En páginas dentro de `/account`, puedes usar el `AuthContext` para redirigir si no está autenticado:

"use client";

import { useContext, useEffect } from "react";  
import { AuthContext } from "@/components/AuthProvider";  
import { useRouter } from "next/navigation";

export default function MySpacesPage() {  
  const { initialized, authenticated } \= useContext(AuthContext);  
  const router \= useRouter();

  useEffect(() \=\> {  
    if (initialized && \!authenticated) {  
      router.push("/login"); // o redireccionar a Keycloak  
    }  
  }, \[initialized, authenticated, router\]);

  if (\!initialized) return \<p\>Cargando...\</p\>;

  // contenido protegido...  
}

---

## **8\. Estilos y diseño responsive**

* Usa Tailwind para crear un diseño limpio y responsive.

* Define componentes genéricos (botones, cards, layouts).

Ejemplo de `SpaceCard`:

import Link from "next/link";

type Props \= {  
  id: string;  
  title: string;  
  city: string;  
  pricePerHour: number;  
  imageUrl?: string;  
};

export function SpaceCard({ id, title, city, pricePerHour, imageUrl }: Props) {  
  return (  
    \<Link href={\`/spaces/${id}\`} className="block rounded-lg shadow hover:shadow-lg transition"\>  
      \<div className="h-48 bg-gray-200 rounded-t-lg overflow-hidden"\>  
        {imageUrl && \<img src={imageUrl} alt={title} className="w-full h-full object-cover" /\>}  
      \</div\>  
      \<div className="p-4"\>  
        \<h3 className="font-semibold text-lg"\>{title}\</h3\>  
        \<p className="text-sm text-gray-500"\>{city}\</p\>  
        \<p className="mt-2 font-bold"\>{pricePerHour} €/hora\</p\>  
      \</div\>  
    \</Link\>  
  );  
}

---

## **9\. Testing de frontend**

Instala herramientas de test:

npm install \--save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event ts-jest

Ejemplo de test de un componente:

// src/components/\_\_tests\_\_/SpaceCard.test.tsx  
import { render, screen } from "@testing-library/react";  
import { SpaceCard } from "../SpaceCard";

test("renderiza título y precio", () \=\> {  
  render(\<SpaceCard id="1" title="Terraza centro" city="Madrid" pricePerHour={25} /\>);  
  expect(screen.getByText("Terraza centro")).toBeInTheDocument();  
  expect(screen.getByText("25 €/hora")).toBeInTheDocument();  
});

Configura Jest según documentación de Next.js (puedes basarte en `next/jest` para simplificar).

---

## **10\. Comandos habituales**

**Levantar servidor de desarrollo**

npm run dev

**Build de producción**

npm run build  
npm start

**Lint**

npm run lint

**Tests**

npm test

---

## **11\. Troubleshooting**

**Problema:** `TypeError: fetch failed` al llamar a la API

* **Causa:** `NEXT_PUBLIC_API_BASE_URL` incorrecta o KrakenD caído.

* **Solución:**

  * Asegúrate de que el gateway responde en `http://localhost:8080`.

  * Revisa la variable en `.env.local` y reinicia `npm run dev`.

---

**Problema:** Bucle de redirecciones al usar Keycloak

* **Causa:** configuración incorrecta de redirect URI en Keycloak.

* **Solución:**

  * Asegúrate de tener `http://localhost:3000/*` en **Valid redirect URIs**.

---

**Problema:** Error de hidratación en componentes con `keycloak-js`

* **Causa:** uso de APIs de `window` en componentes de servidor.

* **Solución:**

  * Marca los componentes que usan Keycloak con `"use client"` en la primera línea.

---

# **API\_DOCUMENTATION.md**

Documentación de la API – BalconazoApp

---

## **Índice**

* [1\. Introducción](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#1-introducci%C3%B3n-2)

* [2\. Convenciones generales](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#2-convenciones-generales)

* [3\. Endpoints de usuarios (users-service)](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#3-endpoints-de-usuarios-users-service)

* [4\. Endpoints de espacios (spaces-service)](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#4-endpoints-de-espacios-spaces-service)

* [5\. Endpoints de reservas (bookings-service)](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#5-endpoints-de-reservas-bookings-service)

* [6\. Códigos de estado y errores](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#6-c%C3%B3digos-de-estado-y-errores)

* [7\. Ejemplos de uso con curl](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#7-ejemplos-de-uso-con-curl)

* [8\. Troubleshooting](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#8-troubleshooting-2)

---

## **1\. Introducción**

Esta documentación describe la **API pública expuesta por KrakenD** para el frontend. Los paths documentados son los que el cliente debe usar (base URL: `http://localhost:8080/api`).

Los microservicios internos tienen paths equivalentes **sin el prefijo `/api`**, pero en la mayoría de los casos el cliente no debe acceder a ellos directamente.

---

## **2\. Convenciones generales**

* **Base URL**: `http://localhost:8080/api`

* **Autenticación**:

  * Cabecera `Authorization: Bearer <access_token>` (JWT emitido por Keycloak).

* **Formato de datos**: JSON.

* **Codificación**: UTF-8.

Ejemplo de cabecera común:

Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...  
Content-Type: application/json  
Accept: application/json

---

## **3\. Endpoints de usuarios (users-service)**

### **3.1 GET `/api/users/me`**

Obtiene el perfil del usuario autenticado.

* **Auth requerida**: Sí (`USER`, `HOST`, `ADMIN`)

* **Headers**:

  * `Authorization: Bearer <token>`

**Response 200 – JSON**

{  
  "id": "e7b4e6e4-b62a-4c6a-9f6e-4d7a3c5cfd09",  
  "email": "user1@example.com",  
  "name": "User",  
  "surname": "One"  
}

**JSON schema (simplificado)**

{  
  "type": "object",  
  "properties": {  
    "id": { "type": "string", "format": "uuid" },  
    "email": { "type": "string", "format": "email" },  
    "name": { "type": "string" },  
    "surname": { "type": "string" }  
  },  
  "required": \["id", "email", "name", "surname"\]  
}

---

## **4\. Endpoints de espacios (spaces-service)**

### **4.1 GET `/api/spaces`**

Lista espacios disponibles (paginación y filtros básicos).

* **Auth requerida**: No estrictamente, pero puede mejorar la experiencia.

* **Query params opcionales**:

  * `city`: filtra por ciudad.

  * `minPrice`: precio mínimo por hora.

  * `maxPrice`: precio máximo por hora.

  * `capacity`: capacidad mínima.

  * `page`: página (0 por defecto).

  * `size`: tamaño de página (20 por defecto).

**Response 200 – JSON**

{  
  "content": \[  
    {  
      "id": "uuid",  
      "title": "Terraza céntrica",  
      "city": "Madrid",  
      "pricePerHour": 25.0,  
      "capacity": 8,  
      "thumbnailUrl": "https://..."  
    }  
  \],  
  "page": 0,  
  "size": 20,  
  "totalElements": 1,  
  "totalPages": 1  
}

### **4.2 GET `/api/spaces/{id}`**

Devuelve el detalle de un espacio.

* **Auth requerida**: No.

**Response 200 – ejemplo**

{  
  "id": "uuid",  
  "title": "Terraza céntrica",  
  "description": "Terraza con vistas al centro...",  
  "city": "Madrid",  
  "capacity": 8,  
  "pricePerHour": 25.0,  
  "photos": \[  
    "https://...",  
    "https://..."  
  \],  
  "features": \["wifi", "sombra", "vistas"\]  
}

### **4.3 POST `/api/spaces` (crear espacio)**

* **Auth requerida**: Sí (rol `HOST` o `ADMIN`).

* **Body (JSON)**:

{  
  "title": "Terraza céntrica",  
  "description": "Terraza amplia con vistas...",  
  "city": "Madrid",  
  "capacity": 8,  
  "pricePerHour": 25.0,  
  "photos": \["https://..."\],  
  "features": \["wifi", "sombra"\]  
}

**Response 201 – creado**

{  
  "id": "uuid",  
  "title": "Terraza céntrica",  
  "city": "Madrid",  
  "capacity": 8,  
  "pricePerHour": 25.0  
}

### **4.4 PUT `/api/spaces/{id}`**

Actualiza datos de un espacio del anfitrión.

* **Auth requerida**: `HOST` o `ADMIN`.

* **Body**: igual estructura que POST (campos que se permiten actualizar).

### **4.5 DELETE `/api/spaces/{id}`**

Desactiva o elimina un espacio del anfitrión.

* **Auth requerida**: `HOST` o `ADMIN`.

* **Response 204** si se realiza correctamente.

---

## **5\. Endpoints de reservas (bookings-service)**

### **5.1 POST `/api/bookings`**

Crea una reserva.

* **Auth requerida**: `USER` (o `HOST` actuando como huésped).

* **Body (JSON)**:

{  
  "spaceId": "uuid-del-espacio",  
  "startTime": "2025-05-01T18:00:00Z",  
  "endTime": "2025-05-01T20:00:00Z"  
}

**Response 201 – reservada**

{  
  "id": "uuid-reserva",  
  "spaceId": "uuid-del-espacio",  
  "guestId": "uuid-huesped",  
  "startTime": "2025-05-01T18:00:00Z",  
  "endTime": "2025-05-01T20:00:00Z",  
  "totalPrice": 50.0,  
  "status": "PENDING"  
}

**Errores:**

* `409 Conflict` si existe solape en la franja horaria.

* `400 Bad Request` si las fechas son inválidas.

### **5.2 GET `/api/bookings/me`**

Lista reservas del usuario autenticado (como huésped).

* **Auth requerida**: Sí (cualquier usuario).

**Response 200**

\[  
  {  
    "id": "uuid-reserva",  
    "spaceId": "uuid-espacio",  
    "spaceTitle": "Terraza céntrica",  
    "startTime": "2025-05-01T18:00:00Z",  
    "endTime": "2025-05-01T20:00:00Z",  
    "status": "CONFIRMED"  
  }  
\]

### **5.3 GET `/api/bookings/host`**

Lista reservas de los espacios del anfitrión.

* **Auth requerida**: `HOST` o `ADMIN`.

### **5.4 PUT `/api/bookings/{id}/cancel`**

Cancela una reserva (según reglas de negocio: plazos, estados).

* **Auth requerida**:

  * `USER`: cancelar sus propias reservas.

  * `HOST`: cancelar reservas de sus espacios (según políticas).

**Response 200**

{  
  "id": "uuid-reserva",  
  "status": "CANCELLED"  
}

---

## **6\. Códigos de estado y errores**

* `200 OK` – petición correcta.

* `201 Created` – recurso creado correctamente.

* `204 No Content` – operación completada sin cuerpo de respuesta.

* `400 Bad Request` – datos de entrada incorrectos o incompletos.

* `401 Unauthorized` – falta token o es inválido.

* `403 Forbidden` – token válido pero sin permisos suficientes.

* `404 Not Found` – recurso no encontrado.

* `409 Conflict` – conflicto de negocio (por ejemplo, solape de reservas).

* `500 Internal Server Error` – error no controlado.

**Estructura de errores (ejemplo Spring Boot)**

{  
  "timestamp": "2025-01-01T12:00:00Z",  
  "status": 409,  
  "error": "Conflict",  
  "message": "La franja horaria no está disponible",  
  "path": "/api/bookings"  
}

---

## **7\. Ejemplos de uso con curl**

### **7.1 Obtener perfil del usuario**

TOKEN="pega\_aquí\_tu\_token"

curl \-X GET http://localhost:8080/api/users/me \\  
  \-H "Authorization: Bearer ${TOKEN}" \\  
  \-H "Accept: application/json"

### **7.2 Listar espacios filtrados por ciudad**

curl \-X GET "http://localhost:8080/api/spaces?city=Madrid\&minPrice=10\&maxPrice=50"

### **7.3 Crear un espacio (anfitrión)**

TOKEN="pega\_aquí\_tu\_token"

curl \-X POST http://localhost:8080/api/spaces \\  
  \-H "Authorization: Bearer ${TOKEN}" \\  
  \-H "Content-Type: application/json" \\  
  \-d '{  
    "title": "Ático con vistas",  
    "description": "Atico luminoso en pleno centro",  
    "city": "Barcelona",  
    "capacity": 10,  
    "pricePerHour": 40,  
    "photos": \[\],  
    "features": \["wifi","vistas"\]  
  }'

### **7.4 Crear una reserva**

TOKEN="pega\_aquí\_tu\_token"

curl \-X POST http://localhost:8080/api/bookings \\  
  \-H "Authorization: Bearer ${TOKEN}" \\  
  \-H "Content-Type: application/json" \\  
  \-d '{  
    "spaceId": "uuid-del-espacio",  
    "startTime": "2025-05-01T18:00:00Z",  
    "endTime": "2025-05-01T20:00:00Z"  
  }'

---

## **8\. Troubleshooting**

**Problema:** Respuesta 401 y mensaje `Authentication credentials were not provided`

* **Causa:** falta cabecera `Authorization`.

* **Solución:** asegúrate de enviar `Authorization: Bearer <token>` en todas las peticiones a endpoints protegidos.

---

**Problema:** Respuesta 403 y token aparentemente correcto

* **Causa:** roles insuficientes para el endpoint (por ejemplo, un `USER` intentando crear espacios).

* **Solución:** revisa la configuración de roles en Keycloak y en la política de acceso del endpoint.

---

**Problema:** Respuesta 409 en reservas (`La franja horaria no está disponible`)

* **Causa:** existe otra reserva solapada para el mismo espacio.

* **Solución:** selecciona otro horario o modifica la lógica si se desea permitir solapes bajo ciertas condiciones.

---

# **DATABASE\_SCHEMAS.md**

Esquemas de base de datos – BalconazoApp

---

## **Índice**

* [1\. Introducción](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#1-introducci%C3%B3n-3)

* [2\. Convenciones generales](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#2-convenciones-generales-1)

* [3\. Base de datos de usuarios (`users-service`)](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#3-base-de-datos-de-usuarios-users-service)

* [4\. Base de datos de espacios (`spaces-service`)](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#4-base-de-datos-de-espacios-spaces-service)

* [5\. Base de datos de reservas (`bookings-service`)](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#5-base-de-datos-de-reservas-bookings-service)

* [6\. Consultas SQL relevantes](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#6-consultas-sql-relevantes)

* [7\. Troubleshooting](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#7-troubleshooting-3)

---

## **1\. Introducción**

Cada microservicio tiene su **propia base de datos PostgreSQL** (patrón *database per service*). Este documento detalla:

* Diagramas ER en Mermaid.

* Scripts SQL de creación de tablas.

* Descripción de campos, relaciones e índices.

---

## **2\. Convenciones generales**

* Tipo de ID principal: `UUID`.

* Nombres de tablas en minúsculas con `_`.

* Timestamps en UTC (`TIMESTAMP WITH TIME ZONE` o `TIMESTAMP` \+ convención).

* Claves foráneas **lógicas** entre bases de datos (no hay FK físicas entre servicios).

---

## **3\. Base de datos de usuarios (`users-service`)**

### **3.1 Diagrama ER**

erDiagram  
    USER {  
      uuid id PK  
      varchar email  
      varchar name  
      varchar surname  
      varchar keycloak\_id  
      timestamp created\_at  
    }

    ROLE {  
      serial id PK  
      varchar name  
    }

    USER\_ROLE {  
      uuid user\_id FK  
      int role\_id FK  
    }

    USER ||--o{ USER\_ROLE : has  
    ROLE ||--o{ USER\_ROLE : has

### **3.2 Script SQL de creación**

CREATE TABLE IF NOT EXISTS users (  
    id UUID PRIMARY KEY,  
    email VARCHAR(255) NOT NULL UNIQUE,  
    name VARCHAR(100) NOT NULL,  
    surname VARCHAR(150) NOT NULL,  
    keycloak\_id VARCHAR(255) NOT NULL UNIQUE,  
    created\_at TIMESTAMP NOT NULL DEFAULT NOW()  
);

CREATE TABLE IF NOT EXISTS roles (  
    id SERIAL PRIMARY KEY,  
    name VARCHAR(50) NOT NULL UNIQUE  
);

CREATE TABLE IF NOT EXISTS user\_roles (  
    user\_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,  
    role\_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,  
    PRIMARY KEY (user\_id, role\_id)  
);

CREATE INDEX IF NOT EXISTS idx\_users\_email ON users(email);

### **3.3 Descripción**

* `users`: datos básicos y enlace a Keycloak.

* `roles`: catálogo de roles (USER, HOST, ADMIN).

* `user_roles`: relación N:M entre usuarios y roles.

---

## **4\. Base de datos de espacios (`spaces-service`)**

### **4.1 Diagrama ER**

erDiagram  
    SPACE {  
      uuid id PK  
      uuid host\_id  
      varchar title  
      text description  
      varchar city  
      integer capacity  
      numeric price\_per\_hour  
      boolean active  
      timestamp created\_at  
    }

    SPACE\_PHOTO {  
      uuid id PK  
      uuid space\_id  
      varchar url  
      integer sort\_order  
    }

    SPACE\_FEATURE {  
      uuid id PK  
      uuid space\_id  
      varchar name  
    }

    SPACE ||--o{ SPACE\_PHOTO : has  
    SPACE ||--o{ SPACE\_FEATURE : has

### **4.2 Script SQL de creación**

CREATE TABLE IF NOT EXISTS spaces (  
    id UUID PRIMARY KEY,  
    host\_id UUID NOT NULL,  
    title VARCHAR(150) NOT NULL,  
    description TEXT NOT NULL,  
    city VARCHAR(100) NOT NULL,  
    capacity INTEGER NOT NULL,  
    price\_per\_hour NUMERIC(10,2) NOT NULL,  
    active BOOLEAN NOT NULL DEFAULT TRUE,  
    created\_at TIMESTAMP NOT NULL DEFAULT NOW()  
    \-- host\_id es FK lógica a users-service.users.id  
);

CREATE TABLE IF NOT EXISTS space\_photos (  
    id UUID PRIMARY KEY,  
    space\_id UUID NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,  
    url VARCHAR(500) NOT NULL,  
    sort\_order INTEGER NOT NULL DEFAULT 0  
);

CREATE TABLE IF NOT EXISTS space\_features (  
    id UUID PRIMARY KEY,  
    space\_id UUID NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,  
    name VARCHAR(100) NOT NULL  
);

CREATE INDEX IF NOT EXISTS idx\_spaces\_city ON spaces(city);  
CREATE INDEX IF NOT EXISTS idx\_spaces\_price ON spaces(price\_per\_hour);  
CREATE INDEX IF NOT EXISTS idx\_spaces\_active ON spaces(active);

### **4.3 Descripción**

* `spaces`: tabla principal de espacios.

* `space_photos`: fotos asociadas a cada espacio.

* `space_features`: características (wifi, sombra, vistas…).

---

## **5\. Base de datos de reservas (`bookings-service`)**

### **5.1 Diagrama ER**

erDiagram  
    BOOKING {  
      uuid id PK  
      uuid space\_id  
      uuid guest\_id  
      timestamp start\_time  
      timestamp end\_time  
      numeric total\_price  
      varchar status  
      timestamp created\_at  
    }

### **5.2 Script SQL de creación**

CREATE TABLE IF NOT EXISTS bookings (  
    id UUID PRIMARY KEY,  
    space\_id UUID NOT NULL,  
    guest\_id UUID NOT NULL,  
    start\_time TIMESTAMP NOT NULL,  
    end\_time TIMESTAMP NOT NULL,  
    total\_price NUMERIC(10,2) NOT NULL,  
    status VARCHAR(20) NOT NULL,  
    created\_at TIMESTAMP NOT NULL DEFAULT NOW()  
    \-- space\_id y guest\_id son referencias lógicas a otros servicios  
);

ALTER TABLE bookings  
    ADD CONSTRAINT chk\_time\_range CHECK (start\_time \< end\_time);

CREATE INDEX IF NOT EXISTS idx\_bookings\_space\_time  
    ON bookings(space\_id, start\_time, end\_time);

CREATE INDEX IF NOT EXISTS idx\_bookings\_guest  
    ON bookings(guest\_id);

### **5.3 Descripción**

* `bookings`: representa cada reserva.

* `status`: valores posibles (`PENDING`, `CONFIRMED`, `CANCELLED`).

* Índice `idx_bookings_space_time` acelera la búsqueda de solapes.

---

## **6\. Consultas SQL relevantes**

### **6.1 Detección de solape de reservas**

SELECT \*  
FROM bookings b  
WHERE b.space\_id \= :spaceId  
  AND b.status IN ('PENDING', 'CONFIRMED')  
  AND (b.start\_time \< :endTime AND b.end\_time \> :startTime);

### **6.2 Búsqueda de espacios por filtros básicos**

SELECT \*  
FROM spaces s  
WHERE s.active \= TRUE  
  AND (:city IS NULL OR s.city \= :city)  
  AND (:minPrice IS NULL OR s.price\_per\_hour \>= :minPrice)  
  AND (:maxPrice IS NULL OR s.price\_per\_hour \<= :maxPrice)  
  AND (:capacity IS NULL OR s.capacity \>= :capacity)  
ORDER BY s.price\_per\_hour ASC  
LIMIT :size OFFSET :offset;

---

## **7\. Troubleshooting**

**Problema:** error de migración (`relation "spaces" does not exist`)

* **Causa:** orden incorrecto de migraciones o uso de una base de datos antigua.

* **Solución:**

  * En desarrollo, elimina volúmenes de la DB correspondiente y deja que Flyway recree el esquema.

---

**Problema:** consultas muy lentas en `bookings`

* **Causa:** falta de índices adecuados para filtros frecuentes.

* **Solución:**

  * Asegúrate de tener el índice `idx_bookings_space_time`.

  * Añade índices adicionales según el patrón de consultas real.

---

# **DEVELOPMENT\_WORKFLOW.md**

Flujo de trabajo de desarrollo – BalconazoApp

---

## **Índice**

* [1\. Introducción](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#1-introducci%C3%B3n-4)

* [2\. Estrategia de ramas Git](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#2-estrategia-de-ramas-git)

* [3\. Convenciones de commits](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#3-convenciones-de-commits)

* [4\. Pull requests y code review](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#4-pull-requests-y-code-review)

* [5\. Checklist antes de hacer commit](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#5-checklist-antes-de-hacer-commit)

* [6\. Levantar el entorno completo](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#6-levantar-el-entorno-completo)

* [7\. Orden de arranque y verificación](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#7-orden-de-arranque-y-verificaci%C3%B3n)

* [8\. Debugging por servicio](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#8-debugging-por-servicio)

* [9\. Troubleshooting](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#9-troubleshooting-4)

---

## **1\. Introducción**

Este documento define un flujo de trabajo estándar para:

* Coordinar cambios en el monorepo.

* Mantener calidad de código.

* Evitar romper el entorno compartido.

Es especialmente útil para que Copilot u otros asistentes sigan las mismas reglas.

---

## **2\. Estrategia de ramas Git**

Ramas principales:

* `main`: estado estable, siempre desplegable.

* `develop` (opcional): integración continua de nuevas features.

Ramas temporales:

* `feature/<nombre>` – nuevas funcionalidades.

* `fix/<nombre>` – correcciones de bugs.

* `chore/<nombre>` – tareas varias (refactors, configuración, etc.).

**Ejemplo:**

git checkout \-b feature/spaces-search

---

## **3\. Convenciones de commits**

Usa **Conventional Commits**:

* `feat:` – nueva funcionalidad.

* `fix:` – corrección de bug.

* `chore:` – tareas de mantenimiento.

* `refactor:` – cambios internos sin alterar comportamiento.

* `docs:` – cambios de documentación.

* `test:` – cambios en tests.

Ejemplos de mensajes:

* `feat(spaces): add filters by city and price`

* `fix(bookings): prevent overlapping bookings`

* `docs: update API documentation for bookings`

---

## **4\. Pull requests y code review**

Para cada rama de feature/fix:

1. Haz commit con cambios completos.

2. Sube la rama al remoto.

3. Abre un **Pull Request** hacia `main` (o `develop`).

4. Incluye en la descripción:

   * Objetivo del cambio.

   * Lista de endpoints afectados.

   * Resultados de tests.

5. Revisa el código (idealmente por otra persona o tú mismo tras un tiempo) y aprueba.

6. Haz **squash & merge** si quieres mantener un historial limpio.

---

## **5\. Checklist antes de hacer commit**

Antes de cada commit:

1. **Backend**:

   * `mvn test` pasa en los servicios afectados.

2. **Frontend**:

   * `npm run lint` y `npm test` pasan.

3. **Formateo**:

   * Código formateado con el formateador del IDE / Prettier.

4. **Docs**:

   * Documentación actualizada si se cambian endpoints o comportamiento.

---

## **6\. Levantar el entorno completo**

Desde la raíz:

docker compose up \-d \--build

Esto levantará:

* 3 PostgreSQL

* Keycloak

* Microservicios backend

* KrakenD

* Frontend

---

## **7\. Orden de arranque y verificación**

Aunque Docker Compose gestiona dependencias, el orden lógico es:

1. Bases de datos `postgres-*` (se levantan rápido).

2. `keycloak`.

3. Microservicios backend.

4. `krakend`.

5. `frontend`.

**Verificar funcionamiento:**

Comprueba contenedores:

 docker compose ps

1.   
2. Accede a:

   * Frontend: `http://localhost:3000`

   * Keycloak: `http://localhost:8081`

   * API (prueba salud): `http://localhost:8080/__health` (si lo has configurado)

---

## **8\. Debugging por servicio**

### **8.1 Backend**

* En lugar de usar el contenedor, puedes ejecutar un microservicio en local con tu IDE.

* Configura un **profile** `local` para que apunte a una base de datos distinta (por ejemplo, Postgres local o Testcontainers).

### **8.2 Frontend**

* Ejecuta `npm run dev` fuera de Docker si quieres hot reload más rápido.

* Asegúrate de apuntar a la URL adecuada del gateway (`NEXT_PUBLIC_API_BASE_URL`).

### **8.3 Logs**

Uso intensivo de logs:

docker compose logs \-f users-service  
docker compose logs \-f frontend  
docker compose logs \-f krakend  
docker compose logs \-f keycloak

---

## **9\. Troubleshooting**

**Problema:** cambios de backend no se reflejan en el contenedor

* **Causa:** imagen no se ha reconstruido.

**Solución:**

 docker compose up \-d \--build users-service

* 

---

**Problema:** frontend se actualiza muy lento en Docker

* **Causa:** hot reload más lento en contenedor.

* **Solución:** desarrolla el frontend con `npm run dev` fuera de Docker y deja que Docker solo orqueste backend/infra.

---

**Problema:** diferencias entre entorno local y CI/CD

* **Causa:** `.env` distintos o versiones diferentes de dependencias.

* **Solución:** documentar y versionar los ficheros de configuración (excepto secretos), usar contenedores también en CI/CD.

---

Genial, continúo con **todos los documentos que faltan (7 a 14\)** en orden 👇

---

# **API\_DOCUMENTATION.md**

Documentación de APIs – BalconazoApp

---

## **Índice**

1. [Introducción](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#1-introducci%C3%B3n)

2. [Convenciones generales](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#2-convenciones-generales)

3. [Autenticación y seguridad](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#3-autenticaci%C3%B3n-y-seguridad)

4. [API de usuarios (users-service)](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#4-api-de-usuarios-users-service)

5. [API de espacios (spaces-service)](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#5-api-de-espacios-spaces-service)

6. [API de reservas (bookings-service)](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#6-api-de-reservas-bookings-service)

7. [Formato de errores](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#7-formato-de-errores)

8. [Ejemplos completos con curl](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#8-ejemplos-completos-con-curl)

9. [Troubleshooting API](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#9-troubleshooting-api)

---

## **1\. Introducción**

Este documento describe la **API pública** de BalconazoApp, tal y como se expone a través del **API Gateway KrakenD**.

Base URL por defecto:

 http://localhost:8080/api

* 

---

## **2\. Convenciones generales**

* Formato de datos: **JSON**.

* Codificación: **UTF-8**.

* Notación de fechas/horas: **ISO-8601** (ej. `2025-05-01T18:00:00Z`).

* Identificadores: `UUID` en formato texto.

---

## **3\. Autenticación y seguridad**

La mayoría de endpoints requieren autenticación basada en **JWT** emitidos por Keycloak.

Cabecera obligatoria:

 Authorization: Bearer \<ACCESS\_TOKEN\>

*   
* Los roles (`ROLE_USER`, `ROLE_HOST`, `ROLE_ADMIN`) se usan para controlar el acceso a determinados endpoints.

---

## **4\. API de usuarios (users-service)**

### **4.1 GET `/api/users/me`**

Obtiene el perfil del usuario autenticado.

* **Método**: `GET`

* **Path**: `/api/users/me`

* **Auth requerida**: Sí (cualquier rol)

**Headers requeridos**

* `Authorization: Bearer <token>`

**Response 200**

{

  "id": "e7b4e6e4-b62a-4c6a-9f6e-4d7a3c5cfd09",

  "email": "user@example.com",

  "name": "Ángel",

  "surname": "Molina"

}

**Códigos de estado**

* `200 OK` – usuario encontrado.

* `401 Unauthorized` – falta token o es inválido.

---

## **5\. API de espacios (spaces-service)**

### **5.1 GET `/api/spaces`**

Listado paginado de espacios.

* **Método**: `GET`

* **Path**: `/api/spaces`

* **Auth requerida**: No obligatoria.

**Query params opcionales**

* `city` – filtra por ciudad.

* `minPrice` – precio mínimo por hora.

* `maxPrice` – precio máximo por hora.

* `capacity` – capacidad mínima.

* `page` – página (0 por defecto).

* `size` – tamaño de página (20 por defecto).

**Response 200**

{

  "content": \[

    {

      "id": "uuid-espacio-1",

      "title": "Ático con vistas",

      "city": "Madrid",

      "pricePerHour": 30.0,

      "capacity": 8,

      "thumbnailUrl": "https://.../foto1.jpg"

    }

  \],

  "page": 0,

  "size": 20,

  "totalElements": 1,

  "totalPages": 1

}

---

### **5.2 GET `/api/spaces/{id}`**

Detalle de un espacio.

* **Método**: `GET`

* **Path**: `/api/spaces/{id}`

* **Auth requerida**: No.

**Response 200**

{

  "id": "uuid-espacio-1",

  "title": "Ático con vistas",

  "description": "Terraza amplia con vistas al centro...",

  "city": "Madrid",

  "capacity": 8,

  "pricePerHour": 30.0,

  "photos": \[

    "https://.../foto1.jpg",

    "https://.../foto2.jpg"

  \],

  "features": \["wifi", "sombra", "vistas"\]

}

---

### **5.3 POST `/api/spaces`**

Creación de un espacio (solo anfitriones).

* **Método**: `POST`

* **Path**: `/api/spaces`

* **Auth requerida**: Sí (rol `ROLE_HOST` o `ROLE_ADMIN`)

**Request body**

{

  "title": "Ático con vistas",

  "description": "Terraza muy luminosa...",

  "city": "Madrid",

  "capacity": 8,

  "pricePerHour": 30.0,

  "photos": \["https://.../foto1.jpg"\],

  "features": \["wifi", "sombra", "vistas"\]

}

**Response 201**

{

  "id": "uuid-nuevo-espacio",

  "title": "Ático con vistas",

  "city": "Madrid",

  "capacity": 8,

  "pricePerHour": 30.0

}

**Códigos de estado**

* `201 Created` – espacio creado.

* `400 Bad Request` – datos inválidos.

* `401/403` – no autenticado o sin rol de anfitrión.

---

## **6\. API de reservas (bookings-service)**

### **6.1 POST `/api/bookings`**

Crea una reserva.

* **Método**: `POST`

* **Path**: `/api/bookings`

* **Auth requerida**: Sí (`ROLE_USER` o `ROLE_HOST`)

**Request body**

{

  "spaceId": "uuid-espacio-1",

  "startTime": "2025-05-01T18:00:00Z",

  "endTime": "2025-05-01T20:00:00Z"

}

**Response 201**

{

  "id": "uuid-reserva-1",

  "spaceId": "uuid-espacio-1",

  "guestId": "uuid-usuario",

  "startTime": "2025-05-01T18:00:00Z",

  "endTime": "2025-05-01T20:00:00Z",

  "totalPrice": 60.0,

  "status": "PENDING"

}

**Códigos de estado**

* `201 Created` – reserva creada.

* `400 Bad Request` – fechas inválidas (`startTime >= endTime`).

* `409 Conflict` – existe otra reserva solapada.

---

### **6.2 GET `/api/bookings/me`**

Listado de reservas del usuario autenticado (como huésped).

* **Método**: `GET`

* **Path**: `/api/bookings/me`

* **Auth requerida**: Sí (cualquier usuario autenticado).

**Response 200**

\[

  {

    "id": "uuid-reserva-1",

    "spaceId": "uuid-espacio-1",

    "spaceTitle": "Ático con vistas",

    "startTime": "2025-05-01T18:00:00Z",

    "endTime": "2025-05-01T20:00:00Z",

    "status": "CONFIRMED",

    "totalPrice": 60.0

  }

\]

---

### **6.3 PUT `/api/bookings/{id}/cancel`**

Cancela una reserva (si las reglas lo permiten).

* **Método**: `PUT`

* **Path**: `/api/bookings/{id}/cancel`

* **Auth requerida**: Sí (el usuario debe ser el huésped o el anfitrión, según reglas).

**Response 200**

{

  "id": "uuid-reserva-1",

  "status": "CANCELLED"

}

**Códigos de estado**

* `200 OK` – cancelación correcta.

* `400 Bad Request` – estado no cancelable.

* `403 Forbidden` – usuario sin permisos sobre la reserva.

* `404 Not Found` – reserva inexistente.

---

## **7\. Formato de errores**

Errores típicos de Spring Boot:

{

  "timestamp": "2025-01-01T12:00:00.000+00:00",

  "status": 409,

  "error": "Conflict",

  "message": "La franja horaria no está disponible",

  "path": "/api/bookings"

}

---

## **8\. Ejemplos completos con curl**

Obtener perfil del usuario autenticado

TOKEN="PON\_AQUI\_EL\_TOKEN"

curl \-X GET http://localhost:8080/api/users/me \\

  \-H "Authorization: Bearer ${TOKEN}" \\

  \-H "Accept: application/json"

Buscar espacios en Madrid con precio entre 10 y 50 €/h

curl \-X GET "http://localhost:8080/api/spaces?city=Madrid\&minPrice=10\&maxPrice=50" \\

  \-H "Accept: application/json"

Crear una reserva

TOKEN="PON\_AQUI\_EL\_TOKEN"

curl \-X POST http://localhost:8080/api/bookings \\

  \-H "Authorization: Bearer ${TOKEN}" \\

  \-H "Content-Type: application/json" \\

  \-d '{

    "spaceId": "uuid-espacio-1",

    "startTime": "2025-05-01T18:00:00Z",

    "endTime": "2025-05-01T20:00:00Z"

  }'

---

## **9\. Troubleshooting API**

### **Problema 1: `401 Unauthorized` en todos los endpoints protegidos**

* **Síntoma**: respuesta `401` incluso habiendo iniciado sesión.

* **Causas**:

  * No se envía la cabecera `Authorization`.

  * Token caducado.

* **Solución**:

  * Verificar que el frontend envía `Authorization: Bearer <token>`.

  * Comprobar expiración del token en jwt.io.

---

### **Problema 2: `403 Forbidden` al crear espacios**

* **Síntoma**: usuario autenticado no puede hacer `POST /api/spaces`.

* **Causa**: el usuario no tiene rol `ROLE_HOST`.

* **Solución**:

  * Asignar el rol `ROLE_HOST` al usuario en Keycloak.

---

### **Problema 3: `409 Conflict` al crear reservas “válidas”**

* **Síntoma**: el sistema indica solape, pero aparentemente no existe.

* **Causas**:

  * Zona horaria incorrecta en frontend.

  * `startTime`/`endTime` intercambiados o mal convertidos.

* **Solución**:

  * Revisar que las fechas se envían en UTC (`Z`).

  * Validar en el frontend que `startTime < endTime` antes de enviar.

---

---

# **DATABASE\_SCHEMAS.md**

Esquemas de base de datos – BalconazoApp

---

## **Índice**

1. [Introducción](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#1-introducci%C3%B3n-1)

2. [Convenciones](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#2-convenciones)

3. [Base de datos de usuarios (`users-service`)](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#3-base-de-datos-de-usuarios-users-service)

4. [Base de datos de espacios (`spaces-service`)](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#4-base-de-datos-de-espacios-spaces-service)

5. [Base de datos de reservas (`bookings-service`)](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#5-base-de-datos-de-reservas-bookings-service)

6. [Consultas SQL frecuentes](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#6-consultas-sql-frecuentes)

7. [Troubleshooting de base de datos](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#7-troubleshooting-de-base-de-datos)

---

## **1\. Introducción**

BalconazoApp sigue el patrón **database-per-service**:

* Cada microservicio tiene su propia base de datos PostgreSQL.

* No hay claves foráneas físicas entre servicios (solo **referencias lógicas**).

---

## **2\. Convenciones**

* Tipo de ID: `UUID` (PRIMARY KEY).

* Nombres de tabla: `snake_case` en minúsculas.

* Timestamps: `TIMESTAMP` (se recomienda almacenarlos en UTC).

---

## **3\. Base de datos de usuarios (`users-service`)**

### **3.1 Diagrama ER**

erDiagram

    USER {

      uuid id PK

      varchar email

      varchar name

      varchar surname

      varchar keycloak\_id

      timestamp created\_at

    }

    ROLE {

      serial id PK

      varchar name

    }

    USER\_ROLE {

      uuid user\_id FK

      int role\_id FK

    }

    USER ||--o{ USER\_ROLE : has

    ROLE ||--o{ USER\_ROLE : has

### **3.2 Script de creación**

CREATE TABLE IF NOT EXISTS users (

    id UUID PRIMARY KEY,

    email VARCHAR(255) NOT NULL UNIQUE,

    name VARCHAR(100) NOT NULL,

    surname VARCHAR(150) NOT NULL,

    keycloak\_id VARCHAR(255) NOT NULL UNIQUE,

    created\_at TIMESTAMP NOT NULL DEFAULT NOW()

);

CREATE TABLE IF NOT EXISTS roles (

    id SERIAL PRIMARY KEY,

    name VARCHAR(50) NOT NULL UNIQUE

);

CREATE TABLE IF NOT EXISTS user\_roles (

    user\_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    role\_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,

    PRIMARY KEY (user\_id, role\_id)

);

CREATE INDEX IF NOT EXISTS idx\_users\_email ON users(email);

---

## **4\. Base de datos de espacios (`spaces-service`)**

### **4.1 Diagrama ER**

erDiagram

    SPACE {

      uuid id PK

      uuid host\_id

      varchar title

      text description

      varchar city

      integer capacity

      numeric price\_per\_hour

      boolean active

      timestamp created\_at

    }

    SPACE\_PHOTO {

      uuid id PK

      uuid space\_id FK

      varchar url

      integer sort\_order

    }

    SPACE\_FEATURE {

      uuid id PK

      uuid space\_id FK

      varchar name

    }

    SPACE ||--o{ SPACE\_PHOTO : has

    SPACE ||--o{ SPACE\_FEATURE : has

### **4.2 Script de creación**

CREATE TABLE IF NOT EXISTS spaces (

    id UUID PRIMARY KEY,

    host\_id UUID NOT NULL,

    title VARCHAR(150) NOT NULL,

    description TEXT NOT NULL,

    city VARCHAR(100) NOT NULL,

    capacity INTEGER NOT NULL,

    price\_per\_hour NUMERIC(10,2) NOT NULL,

    active BOOLEAN NOT NULL DEFAULT TRUE,

    created\_at TIMESTAMP NOT NULL DEFAULT NOW()

    \-- host\_id referencia lógica a users.id en users-service

);

CREATE TABLE IF NOT EXISTS space\_photos (

    id UUID PRIMARY KEY,

    space\_id UUID NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,

    url VARCHAR(500) NOT NULL,

    sort\_order INTEGER NOT NULL DEFAULT 0

);

CREATE TABLE IF NOT EXISTS space\_features (

    id UUID PRIMARY KEY,

    space\_id UUID NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,

    name VARCHAR(100) NOT NULL

);

CREATE INDEX IF NOT EXISTS idx\_spaces\_city ON spaces(city);

CREATE INDEX IF NOT EXISTS idx\_spaces\_price ON spaces(price\_per\_hour);

CREATE INDEX IF NOT EXISTS idx\_spaces\_active ON spaces(active);

---

## **5\. Base de datos de reservas (`bookings-service`)**

### **5.1 Diagrama ER**

erDiagram

    BOOKING {

      uuid id PK

      uuid space\_id

      uuid guest\_id

      timestamp start\_time

      timestamp end\_time

      numeric total\_price

      varchar status

      timestamp created\_at

    }

### **5.2 Script de creación**

CREATE TABLE IF NOT EXISTS bookings (

    id UUID PRIMARY KEY,

    space\_id UUID NOT NULL,

    guest\_id UUID NOT NULL,

    start\_time TIMESTAMP NOT NULL,

    end\_time TIMESTAMP NOT NULL,

    total\_price NUMERIC(10,2) NOT NULL,

    status VARCHAR(20) NOT NULL,

    created\_at TIMESTAMP NOT NULL DEFAULT NOW()

    \-- space\_id referencia lógica a spaces.id

    \-- guest\_id referencia lógica a users.id

);

ALTER TABLE bookings

    ADD CONSTRAINT chk\_booking\_time\_range CHECK (start\_time \< end\_time);

CREATE INDEX IF NOT EXISTS idx\_bookings\_space\_time

    ON bookings(space\_id, start\_time, end\_time);

CREATE INDEX IF NOT EXISTS idx\_bookings\_guest

    ON bookings(guest\_id);

---

## **6\. Consultas SQL frecuentes**

### **6.1 Comprobar solapes de reserva**

SELECT \*

FROM bookings b

WHERE b.space\_id \= :spaceId

  AND b.status IN ('PENDING', 'CONFIRMED')

  AND (b.start\_time \< :endTime AND b.end\_time \> :startTime);

### **6.2 Buscar espacios con filtros**

SELECT \*

FROM spaces s

WHERE s.active \= TRUE

  AND (:city IS NULL OR s.city \= :city)

  AND (:minPrice IS NULL OR s.price\_per\_hour \>= :minPrice)

  AND (:maxPrice IS NULL OR s.price\_per\_hour \<= :maxPrice)

  AND (:capacity IS NULL OR s.capacity \>= :capacity)

ORDER BY s.price\_per\_hour ASC

LIMIT :size OFFSET :offset;

---

## **7\. Troubleshooting de base de datos**

### **Problema 1: conflicto entre esquema real y migraciones Flyway**

* **Síntoma**: Flyway lanza `Validate failed` al arrancar.

* **Causa**: cambios manuales en tablas o migraciones alteradas.

* **Solución**:

  * En desarrollo: borrar el volumen de la BD y dejar que Flyway regenere el esquema.

  * En producción: crear nuevas migraciones que ajusten el esquema actual (nunca tocar migraciones ya ejecutadas).

---

### **Problema 2: lentitud en consultas de reservas**

* **Síntoma**: consultas a reservas tardan mucho con muchas filas.

* **Causa**: falta de índices en campos usados en filtros (`space_id`, `start_time`, `end_time`).

* **Solución**:

  * Verificar la existencia de `idx_bookings_space_time`.

  * Añadir índices adicionales según patrones de uso.

---

### **Problema 3: errores de integridad en espacios/usuarios**

* **Síntoma**: referencias a `host_id` o `space_id` inexistentes.

* **Causa**: al no tener FK físicas entre servicios, se han borrado registros en un servicio sin limpiar referencias en otro.

* **Solución**:

  * Implementar lógica de “soft delete” y validaciones antes de eliminar registros.

  * Añadir validaciones de existencia de `spaceId`/`hostId` al crear o modificar entidades.

---

# **DEVELOPMENT\_WORKFLOW.md**

Flujo de trabajo de desarrollo – BalconazoApp

---

## **Índice**

1. [Objetivo del flujo de trabajo](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#1-objetivo-del-flujo-de-trabajo)

2. [Estrategia de ramas Git](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#2-estrategia-de-ramas-git)

3. [Convención de commits](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#3-convenci%C3%B3n-de-commits)

4. [Pull requests y revisiones](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#4-pull-requests-y-revisiones)

5. [Checklist antes de hacer commit](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#5-checklist-antes-de-hacer-commit)

6. [Levantar el entorno completo](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#6-levantar-el-entorno-completo)

7. [Orden de arranque y validaciones](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#7-orden-de-arranque-y-validaciones)

8. [Debugging por servicio](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#8-debugging-por-servicio)

9. [Troubleshooting del workflow](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#9-troubleshooting-del-workflow)

---

## **1\. Objetivo del flujo de trabajo**

Definir una forma estándar de trabajar sobre el monorepo:

* Evitar romper el entorno compartido.

* Mantener un historial Git limpio.

* Facilitar la integración continua y el soporte de asistentes de IA.

---

## **2\. Estrategia de ramas Git**

Ramas principales:

* `main` → estado estable, siempre desplegable.

Ramas de trabajo:

* `feature/<nombre>` – nuevas funcionalidades.

* `fix/<nombre>` – corrección de bugs.

* `chore/<nombre>` – tareas de mantenimiento (refactors, config).

* `docs/<nombre>` – cambios de documentación.

Crear una rama de feature

git checkout \-b feature/spaces-search

---

## **3\. Convención de commits**

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

## **4\. Pull requests y revisiones**

1. Desarrollar en una rama `feature/*` o `fix/*`.

2. Hacer commits pequeños y coherentes.

3. Abrir Pull Request hacia `main`.

4. Describir:

   * Qué se ha cambiado.

   * Endpoints afectados.

   * Cómo testear el cambio.

5. Revisar el código (puede ser auto-revisión si trabajas solo) antes de hacer merge.

---

## **5\. Checklist antes de hacer commit**

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

## **6\. Levantar el entorno completo**

Levantar todo con Docker Compose

docker compose up \-d \--build

Servicios incluidos:

* `postgres-users`, `postgres-spaces`, `postgres-bookings`

* `keycloak`

* `users-service`, `spaces-service`, `bookings-service`

* `krakend`

* `frontend`

Ver estado de contenedores

docker compose ps

---

## **7\. Orden de arranque y validaciones**

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

## **8\. Debugging por servicio**

### **Backend**

* Puedes ejecutar un microservicio fuera de Docker con el IDE usando el perfil `local`.

* Conectar depurador (debug) al puerto 5005 (si configuras `JAVA_TOOL_OPTIONS`).

### **Frontend**

* Ejecutar `npm run dev` en local para mejor hot reload.

* Apuntar `NEXT_PUBLIC_API_BASE_URL` al gateway.

### **Gateway y Keycloak**

Ver logs con:

 docker compose logs \-f krakend

docker compose logs \-f keycloak

* 

---

## **9\. Troubleshooting del workflow**

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

---

# **TROUBLESHOOTING.md**

Guía global de troubleshooting – BalconazoApp

---

## **Índice**

1. [Introducción](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#1-introducci%C3%B3n-2)

2. [Docker / Contenedores](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#2-docker--contenedores)

3. [Keycloak / Autenticación](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#3-keycloak--autenticaci%C3%B3n)

4. [Base de datos](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#4-base-de-datos)

5. [CORS](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#5-cors)

6. [API Gateway (KrakenD)](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#6-api-gateway-krakend)

7. [Build / Compilación](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#7-build--compilaci%C3%B3n)

8. [Dependencias](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#8-dependencias)

9. [Networking](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#9-networking)

Cada problema incluye: **síntoma → causa → solución → prevención**.

---

## **2\. Docker / Contenedores**

### **Problema 1: `port is already allocated`**

* **Síntoma**: al hacer `docker compose up` aparece `Bind for 0.0.0.0:3000 failed`.

* **Causa**: ya hay un proceso usando ese puerto (otra app, contenedor viejo…).

* **Solución**:

Ver quién usa el puerto (Linux/mac):

 lsof \-i :3000

*   
  * Parar ese proceso o cambiar el puerto en `.env`.

* **Prevención**:

  * Liberar puertos antes de levantar servicios.

  * Documentar los puertos usados por el proyecto.

---

### **Problema 2: contenedores reiniciándose en bucle**

* **Síntoma**: `docker compose ps` muestra `Restarting` en algún servicio.

* **Causa**: error en la configuración o fallo de arranque interno.

* **Solución**:

Ver logs del servicio:

 docker compose logs \-f nombre-servicio

*   
  * Corregir el error (config, rutas, credenciales).

* **Prevención**:

  * Validar configs (JSON/YAML) antes de reconstruir.

---

### **Problema 3: cambios de código no se reflejan**

* **Síntoma**: tras modificar código Java/TS, el contenedor sigue ejecutando la versión antigua.

* **Causa**: imagen Docker no se ha reconstruido.

* **Solución**:

Reconstruir:

 docker compose up \-d \--build

*   
* **Prevención**:

  * Usar volúmenes en desarrollo para ciertos servicios o ejecutar en local.

---

## **3\. Keycloak / Autenticación**

### **Problema 4: pantalla de login se ve, pero luego aparece error de redirección**

* **Síntoma**: después de login se muestra “Invalid redirect URI”.

* **Causa**: URIs de redirección no incluyen la URL exacta del frontend.

* **Solución**:

  * En `Clients → balconazo-frontend → Settings`, añadir `http://localhost:3000/*` en `Valid redirect URIs`.

* **Prevención**:

  * Configurar URIs desde el inicio y documentarlas.

---

### **Problema 5: token sin roles**

* **Síntoma**: JWT no contiene `realm_access.roles`.

* **Causa**: roles no asignados o mapper de roles no configurado.

* **Solución**:

  * Asignar roles al usuario en `Role mappings`.

  * Verificar que el client incluye un mapper de tipo `Realm roles`.

* **Prevención**:

  * Crear un usuario estándar de test con todos los roles necesarios para desarrollo.

---

## **4\. Base de datos**

### **Problema 6: `relation "spaces" does not exist`**

* **Síntoma**: error de SQL al arrancar `spaces-service`.

* **Causa**: migraciones de Flyway no se han aplicado o BD vacía mal configurada.

* **Solución**:

  * Comprobar logs de Flyway.

  * Borrar volumen de la BD en desarrollo y reiniciar.

* **Prevención**:

  * Mantener las migraciones bajo control de versiones.

---

### **Problema 7: deadlocks o bloqueos al escribir reservas**

* **Síntoma**: consultas bloqueadas, tiempos de espera altos.

* **Causa**: transacciones largas o niveles de aislamiento mal configurados.

* **Solución**:

  * Revisar lógica de creación de reservas para minimizar la sección crítica.

  * Usar índices adecuados.

* **Prevención**:

  * Mantener las transacciones lo más cortas posible.

---

## **5\. CORS**

### **Problema 8: error CORS en navegador (`No 'Access-Control-Allow-Origin' header`)**

* **Causa**: origen del frontend no configurado en KrakenD.

* **Solución**:

  * Añadir `http://localhost:3000` a `allow_origins` en `krakend.json`.

* **Prevención**:

  * Configurar CORS correctamente desde el inicio.

---

## **6\. API Gateway (KrakenD)**

### **Problema 9: 502 Bad Gateway al llamar a `/api/spaces`**

* **Causa**:

  * `spaces-service` no está levantado o no pasa healthcheck.

  * `host` incorrecto en `krakend.json`.

* **Solución**:

  * Ver `docker compose ps` y logs de `spaces-service`.

  * Corregir `host` (`http://spaces-service:8080`).

* **Prevención**:

  * Probar los servicios directamente antes de integrarlos en el gateway.

---

### **Problema 10: 401 global tras cambiar configuración de Keycloak**

* **Causa**: cambios en realm/issuer que invalidan configuración de validación.

* **Solución**:

  * Actualizar `jwk_url`/issuer en `krakend.json` y microservicios.

* **Prevención**:

  * Evitar cambios de realm o URLs sin planificar su impacto.

---

## **7\. Build / Compilación**

### **Problema 11: error de compilación Java (`source 21 but target 17`)**

* **Causa**: configuración inconsistente de `java.version` en `pom.xml` o IDE.

* **Solución**:

  * Fijar Java 21 en el `pom.xml` y en el IDE.

* **Prevención**:

  * Documentar la versión de Java requerida en el README.

---

### **Problema 12: build de frontend falla (`Cannot find module`)**

* **Causa**: imports incorrectos o paths mal configurados.

* **Solución**:

  * Revisar `tsconfig.json` y los alias (`@/*`).

* **Prevención**:

  * Evitar imports relativos complejos (`../../../../`), usar alias consistentes.

---

## **8\. Dependencias**

### **Problema 13: conflictos de versiones entre librerías**

* **Síntoma**: errores de tipo “NoSuchMethodError” en runtime.

* **Causa**: versiones incompatibles en el árbol de dependencias.

* **Solución**:

  * Inspeccionar dependencias con `mvn dependency:tree`.

  * Forzar versiones compatibles en `dependencyManagement`.

* **Prevención**:

  * Actualizar dependencias de forma controlada y probar tras cada cambio grande.

---

## **9\. Networking**

### **Problema 14: el frontend no encuentra el API en producción**

* **Causa**:

  * `NEXT_PUBLIC_API_BASE_URL` apunta a `localhost` en un servidor remoto.

* **Solución**:

  * Ajustar variables de entorno en producción a la URL pública real (por ejemplo, `https://api.balconazo.com`).

* **Prevención**:

  * Separar `.env.dev`, `.env.prod` y no reutilizar `localhost` fuera de desarrollo.

---

### **Problema 15: microservicios no resuelven el host de Keycloak**

* **Síntoma**: excepciones de `UnknownHostException: keycloak`.

* **Causa**: el nombre del servicio en Docker no coincide (`keycloak` vs `balconazo-keycloak`).

* **Solución**:

  * Usar el nombre correcto del servicio Docker en las URLs internas (`http://keycloak:8080`).

* **Prevención**:

  * Mantener coherencia entre nombres en `docker-compose.yml` y configuración de apps.

---

# **TESTING\_GUIDE.md**

Guía de testing – BalconazoApp

---

## **Índice**

1. [Estrategia general de testing](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#1-estrategia-general-de-testing)

2. [Herramientas de testing](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#2-herramientas-de-testing)

3. [Tests unitarios de backend](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#3-tests-unitarios-de-backend)

4. [Tests de integración de backend](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#4-tests-de-integraci%C3%B3n-de-backend)

5. [Tests de frontend](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#5-tests-de-frontend-1)

6. [Tests E2E](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#6-tests-e2e)

7. [Cobertura](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#7-cobertura)

8. [Mocking y buenas prácticas](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#8-mocking-y-buenas-pr%C3%A1cticas)

9. [Troubleshooting de tests](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#9-troubleshooting-de-tests)

---

## **1\. Estrategia general de testing**

Se sigue la **pirámide de testing**:

* Base: tests **unitarios** (rápidos, muchos).

* Centro: tests de **integración** (servicio \+ DB, Keycloak simulado).

* Cima: tests **end-to-end** (flujo completo UI \+ API \+ DB).

---

## **2\. Herramientas de testing**

* Backend:

  * **JUnit 5**, **Spring Boot Test**, **Mockito**.

  * **Testcontainers** (PostgreSQL).

  * **REST Assured** (opcional, para test de APIs).

* Frontend:

  * **Jest**.

  * **React Testing Library**.

  * **Playwright** o **Cypress** para E2E.

---

## **3\. Tests unitarios de backend**

### **Ejemplo: `UserServiceTest`**

@ExtendWith(MockitoExtension.class)

class UserServiceTest {

    @Mock

    private UserRepository userRepository;

    @InjectMocks

    private UserService userService;

    @Test

    void getCurrentUser\_throwsIfNotFound() {

        String keycloakId \= "kc-123";

        when(userRepository.findByKeycloakId(keycloakId)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class,

                () \-\> userService.getCurrentUser(keycloakId));

    }

}

Principios:

* Un test \= un comportamiento específico.

* No tocar red, DB ni Keycloak en tests unitarios.

---

## **4\. Tests de integración de backend**

### **Ejemplo: test de repositorio con Testcontainers**

@Testcontainers

@SpringBootTest

class BookingRepositoryIT {

    @Container

    static PostgreSQLContainer\<?\> postgres \=

            new PostgreSQLContainer\<\>("postgres:16-alpine")

                    .withDatabaseName("bookings\_test")

                    .withUsername("test")

                    .withPassword("test");

    @DynamicPropertySource

    static void overrideProps(DynamicPropertyRegistry registry) {

        registry.add("spring.datasource.url", postgres::getJdbcUrl);

        registry.add("spring.datasource.username", postgres::getUsername);

        registry.add("spring.datasource.password", postgres::getPassword);

    }

    @Autowired

    private BookingRepository bookingRepository;

    @Test

    void shouldDetectOverlappingBookings() {

        // setup datos iniciales y comprobar consulta de solapes

    }

}

Principios:

* Arrancar solo el contenedor necesario (Postgres).

* Usar migraciones Flyway reales.

---

## **5\. Tests de frontend**

### **Tests unitarios**

Usar Jest \+ React Testing Library:

// tests/components/Header.test.tsx

import { render, screen } from "@testing-library/react";

import Header from "@/components/Header";

test("muestra el nombre de la app", () \=\> {

  render(\<Header /\>);

  expect(screen.getByText(/BalconazoApp/i)).toBeInTheDocument();

});

### **Tests de integración (componentes \+ hooks)**

* Probar componentes que hacen llamadas a la API usando **mocks** de `axios` o `fetch`.

---

## **6\. Tests E2E**

Con Playwright o Cypress:

* Flujo completo:

  1. Usuario visita la home.

  2. Hace login (puede usarse un usuario de test en Keycloak).

  3. Busca un espacio.

  4. Realiza una reserva.

  5. Comprueba que la reserva aparece en “Mis reservas”.

Es recomendable tener un **entorno de E2E** aislado, con una base de datos preseeded.

---

## **7\. Cobertura**

Backend:

Generar informe de cobertura con JaCoCo

mvn clean test

El informe suele generarse en `target/site/jacoco/index.html`.

Frontend:

Generar cobertura con Jest

npm test \-- \--coverage

Objetivo orientativo:

* **Backend**: 70–80 % de cobertura en lógica de negocio.

* **Frontend**: 60–70 % en componentes y lógica crítica.

---

## **8\. Mocking y buenas prácticas**

* Mockear solo **dependencias externas** o lentas (DB, red, Keycloak).

* No mockear la clase que se está testeando.

* Usar `@MockBean` en tests Spring para reemplazar beans concretos.

Ejemplo:

@SpringBootTest

class BookingControllerIT {

    @MockBean

    private PriceCalculator priceCalculator;

    // ...

}

---

## **9\. Troubleshooting de tests**

### **Problema 1: tests lentos**

* **Causa**: exceso de tests de integración/E2E o uso de contenedores para tests unitarios.

* **Solución**:

  * Separar tests unitarios de integración.

  * Ejecutar contenedores solo cuando sea necesario.

---

### **Problema 2: tests E2E inestables (flaky)**

* **Causa**: dependencias de tiempo (timeouts muy cortos, esperas fijas).

* **Solución**:

  * Usar waits explícitos en Playwright/Cypress (esperar a elementos o respuestas).

---

### **Problema 3: cobertura baja a pesar de “muchos tests”**

* **Causa**: tests que no ejercitan rutas alternativas ni casos de error.

* **Solución**:

  * Añadir tests para casos límite y errores (datos inválidos, roles insuficientes, etc.).

---

# **DEPLOYMENT\_GUIDE.md**

Guía de despliegue – BalconazoApp

---

## **Índice**

1. [Objetivo](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#1-objetivo)

2. [Preparación para producción](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#2-preparaci%C3%B3n-para-producci%C3%B3n)

3. [Construcción de imágenes Docker](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#3-construcci%C3%B3n-de-im%C3%A1genes-docker)

4. [Configuración de entorno de producción](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#4-configuraci%C3%B3n-de-entorno-de-producci%C3%B3n)

5. [Despliegue en servidor con Docker Compose](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#5-despliegue-en-servidor-con-docker-compose)

6. [Dominios y HTTPS](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#6-dominios-y-https)

7. [Monitorización básica](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#7-monitorizaci%C3%B3n-b%C3%A1sica)

8. [Backups de base de datos](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#8-backups-de-base-de-datos)

9. [Rollback](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#9-rollback)

10. [Troubleshooting de despliegue](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#10-troubleshooting-de-despliegue)

---

## **1\. Objetivo**

Definir cómo pasar de un entorno local de desarrollo a un entorno “tipo producción” usando **Docker Compose** en un servidor.

---

## **2\. Preparación para producción**

Checklist:

* Configurar variables de entorno de producción (`.env.prod`).

* Cambiar contraseñas por valores seguros (no usar `admin/admin`).

* Desactivar logs excesivamente verbosos.

* Asegurar que los servicios usan `SPRING_PROFILES_ACTIVE=prod` o similar.

---

## **3\. Construcción de imágenes Docker**

Backend (ejemplo `users-service`):

Construir imagen de un microservicio

cd backend/users-service

mvn clean package

docker build \-t balconazo/users-service:1.0.0 .

Frontend:

Construir imagen del frontend

cd frontend/balconazo-web

npm install

npm run build

docker build \-t balconazo/frontend:1.0.0 .

Puedes usar `docker compose build` para construir todas las imágenes de una vez.

---

## **4\. Configuración de entorno de producción**

Crear un fichero `.env.prod` en el servidor:

Variables específicas para producción:

 PROJECT\_NAME=balconazoapp

KRAKEND\_PORT=80

FRONTEND\_PORT=3000

KEYCLOAK\_HTTP\_PORT=8080

\# Bases de datos con contraseñas seguras

USERS\_DB\_PASSWORD=\*\*\*\*\*\*\*\*

SPACES\_DB\_PASSWORD=\*\*\*\*\*\*\*\*

BOOKINGS\_DB\_PASSWORD=\*\*\*\*\*\*\*\*

* 

No subir nunca `.env.prod` al repositorio.

---

## **5\. Despliegue en servidor con Docker Compose**

1. Copiar el código al servidor (por ejemplo, con `git clone` o `scp`).

2. Crear `.env.prod` y copiarlo a `.env`.

Levantar servicios

docker compose \--env-file .env up \-d

Comprobar estado

docker compose ps

---

## **6\. Dominios y HTTPS**

Escenario simple:

* Servidor expone HTTP en el puerto 80\.

* Se usa un **reverse proxy** (Nginx, Caddy, Traefik) delante del gateway y el frontend.

Pasos generales:

1. Configurar DNS para apuntar `app.balconazo.com` y `api.balconazo.com` al servidor.

2. Configurar Nginx con certificados Let’s Encrypt.

3. Redirigir tráfico HTTPS a los puertos internos de Docker (`frontend`, `krakend`).

---

## **7\. Monitorización básica**

* Usar `docker compose logs -f` como herramienta básica.

* Activar endpoints de salud:

  * `GET /actuator/health` en microservicios.

  * Healthcheck en KrakenD y Keycloak.

Para un entorno más avanzado se pueden añadir **Prometheus \+ Grafana**.

---

## **8\. Backups de base de datos**

Ejemplo backup manual de una BD:

Hacer backup de `usersdb` desde el host

docker exec \-t balconazo-postgres-users \\

  pg\_dump \-U ${USERS\_DB\_USER} ${USERS\_DB\_NAME} \> usersdb\_backup.sql

Restaurar:

cat usersdb\_backup.sql | docker exec \-i balconazo-postgres-users \\

  psql \-U ${USERS\_DB\_USER} \-d ${USERS\_DB\_NAME}

---

## **9\. Rollback**

Opciones de rollback:

* Volver a las imágenes Docker anteriores (etiquetas `1.0.0`, `0.9.0`, etc.).

* Revertir cambios en `docker-compose.yml` y `.env`.

* Restaurar backups de base de datos si el problema afecta a datos.

---

## **10\. Troubleshooting de despliegue**

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

  * Configurar un vhost especíﬁco para Keycloak o exponerlo solo en red interna y gestionar login siempre a través del frontend.

---

### **Problema 3: consumo excesivo de recursos**

* **Causas**:

  * Contenedores Java con memoria por defecto alta.

* **Solución**:

  * Establecer límites de memoria/CPU en `docker-compose.yml`.

---

# **SECURITY\_CHECKLIST.md**

Checklist de seguridad – BalconazoApp

---

## **Índice**

1. [Objetivo](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#1-objetivo-1)

2. [Autenticación y autorización](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#2-autenticaci%C3%B3n-y-autorizaci%C3%B3n)

3. [Validación de entradas](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#3-validaci%C3%B3n-de-entradas)

4. [Gestión de secretos](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#4-gesti%C3%B3n-de-secretos)

5. [Comunicación segura](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#5-comunicaci%C3%B3n-segura)

6. [Protecciones OWASP Top 10](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#6-protecciones-owasp-top-10)

7. [Logging y auditoría](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#7-logging-y-auditor%C3%ADa)

8. [Dependencias y actualizaciones](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#8-dependencias-y-actualizaciones)

9. [Checklist rápida](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#9-checklist-r%C3%A1pida)

---

## **1\. Objetivo**

Garantizar que BalconazoApp cumple un mínimo de buenas prácticas de seguridad siguiendo las recomendaciones de **OWASP**.

---

## **2\. Autenticación y autorización**

* Todo endpoint sensible requiere **JWT** válido.

* Los microservicios se configuran como **Resource Servers** (no gestionan credenciales directamente).

* Se usan roles (`ROLE_USER`, `ROLE_HOST`, `ROLE_ADMIN`) para limitar acciones.

* Solo `ROLE_HOST` puede crear/editar/eliminar espacios.

* Solo el usuario propietario puede consultar/modificar sus reservas (salvo admins).

---

## **3\. Validación de entradas**

* Se validan todos los DTOs de entrada con anotaciones (`@NotNull`, `@Email`, `@Size`, etc.).

* No se confía en los datos de cliente (precio, IDs, fechas).

* Las fechas de reserva se validan (`start < end`) y rangos razonables.

---

## **4\. Gestión de secretos**

* No se incluyen contraseñas ni tokens en el código fuente.

* `.env` no se sube a Git; solo `.env.example`.

* Las contraseñas de BD y las credenciales de Keycloak en producción son únicas y robustas.

* Se rotan los secretos periódicamente en entornos reales.

---

## **5\. Comunicación segura**

* En producción, todo el tráfico externo pasa por **HTTPS**.

* No se exponen servicios internos directamente a Internet (Postgres, microservicios).

* El firewall limita puertos abiertos a los estrictamente necesarios (80/443).

---

## **6\. Protecciones OWASP Top 10**

* **A01 – Broken Access Control**

  * Tests que comprueban que un usuario sin rol no puede acceder a endpoints restringidos.

* **A02 – Cryptographic Failures**

  * Tokens firmados con clave robusta (RS256).

  * Passwords gestionadas únicamente por Keycloak.

* **A03 – Injection**

  * Uso exclusivo de JPA y consultas parametrizadas (no concatenar SQL manualmente).

* **A05 – Security Misconfiguration**

  * Perfiles de Spring bien definidos (`dev`, `prod`).

  * Deshabilitados endpoints de Actuator que no se necesitan (o protegidos).

* **A07 – Identification and Authentication Failures**

  * Flujos de login/logout gestionados por Keycloak.

  * Configurado bloqueo/limitación de intentos de login en Keycloak (si se requiere).

* **A08 – Software and Data Integrity Failures**

  * Dependencias actualizadas sin vulnerabilidades críticas conocidas.

* **A09 – Security Logging and Monitoring Failures**

  * Logs de errores críticos y de accesos anómalos.

---

## **7\. Logging y auditoría**

* No se loguean nunca contraseñas ni tokens completos.

* Se registra quién crea/edita espacios y reservas.

* Se almacena la IP de origen de una petición solo si es necesario y cumpliendo protección de datos.

---

## **8\. Dependencias y actualizaciones**

* Revisar periódicamente dependencias con herramientas como `mvn versions:display-dependency-updates` o Snyk.

* Actualizar Spring Boot y librerías de seguridad con prioridad.

---

## **9\. Checklist rápida**

Antes de desplegar:

* No hay credenciales por defecto (`admin/admin`) en Keycloak en producción.

* `.env` de producción contiene valores seguros y no se ha subido al repositorio.

* Los endpoints de Actuator están desactivados o protegidos por firewall o auth.

* Se ha probado un flujo completo de login → acción → logout en el entorno final.

---

# **COPILOT\_INSTRUCTIONS.md**

Instrucciones para asistentes de IA (Copilot, ChatGPT, etc.) – BalconazoApp

---

## **Índice**

1. [Contexto del proyecto](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#1-contexto-del-proyecto)

2. [Arquitectura y tech stack](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#2-arquitectura-y-tech-stack)

3. [Convenciones de código](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#3-convenciones-de-c%C3%B3digo)

4. [Patrones arquitectónicos a seguir](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#4-patrones-arquitect%C3%B3nicos-a-seguir)

5. [Reglas de negocio clave](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#5-reglas-de-negocio-clave)

6. [Qué NO hacer (anti-patterns)](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#6-qu%C3%A9-no-hacer-anti-patterns)

7. [Templates de código](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#7-templates-de-c%C3%B3digo)

8. [Comandos frecuentes](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#8-comandos-frecuentes)

9. [Errores típicos de IA y cómo evitarlos](https://chatgpt.com/g/g-p-691e410199708191af4cd342a1bc3612-tfg/c/69262f1e-6ad0-8331-aa41-53f2a0202b92#9-errores-t%C3%ADpicos-de-ia-y-c%C3%B3mo-evitarlos)

---

## **1\. Contexto del proyecto**

BalconazoApp es un **marketplace de alquiler de espacios por horas**:

* Anfitriones publican **espacios** (terrazas, balcones, salones).

* Usuarios hacen **reservas** de espacios para una franja horaria.

* Hay 3 microservicios backend, un frontend Next.js, un API Gateway KrakenD y Keycloak como IdP.

---

## **2\. Arquitectura y tech stack**

* Backend:

  * Java 21 \+ Spring Boot 3.x

  * Spring Web, Data JPA, Security (OAuth2 Resource Server)

  * PostgreSQL \+ Flyway

* Frontend:

  * Next.js 15 \+ React 19

  * TypeScript

* Infra:

  * Docker \+ Docker Compose

  * Keycloak, KrakenD

Asumir siempre el patrón **database-per-service** y comunicación vía **HTTP/JSON**.

---

## **3\. Convenciones de código**

### **Java / Spring**

* Paquetes: `com.balconazo.<servicio>`.

* Sufijos de clases:

  * `*Controller`, `*Service`, `*Repository`, `*Entity`, `*Dto`.

* Usar `record` para DTOs simples cuando sea posible.

* Preferir **constructores** para inyección (`@RequiredArgsConstructor` con Lombok si está habilitado).

### **TypeScript / React**

* Componentes en `PascalCase`.

* Hooks en `camelCase` con prefijo `use` (ej. `useSpaces`).

* Evitar lógica compleja directamente en componentes de presentación; delegar a hooks/librerías.

---

## **4\. Patrones arquitectónicos a seguir**

* **RESTful APIs**:

  * Verbos HTTP correctos (`GET`, `POST`, `PUT`, `DELETE`).

  * Códigos de estado apropiados (200, 201, 400, 401, 403, 404, 409...).

* **Capa de servicio**:

  * La lógica de negocio reside en servicios, no en los controladores.

* **Validación**:

  * Validar entradas con anotaciones (`@Valid`, `@NotNull`, etc.).

* **Seguridad**:

  * No gestionar credenciales manualmente; confiar en JWT de Keycloak.

---

## **5\. Reglas de negocio clave**

* No se pueden crear reservas solapadas para un mismo espacio y franja horaria.

* Solo usuarios con rol `ROLE_HOST` pueden publicar espacios.

* Solo el propietario de una reserva o el anfitrión pueden cancelarla (según lógica).

* Las reservas deben tener `startTime < endTime`.

Cuando implementes o modifiques código relacionado con reservas, **considera siempre estas reglas**.

---

## **6\. Qué NO hacer (anti-patterns)**

* ❌ No acceder nunca a las bases de datos de otros microservicios directamente.

* ❌ No incorporar lógica de negocio compleja en el frontend; debe residir en el backend.

* ❌ No hardcodear URLs de producción en el código; usar variables de entorno.

* ❌ No exponer secretos (`client_secret`, contraseñas de BD) en el código fuente.

* ❌ No ignorar el manejo de errores; siempre propaga un error claro al frontend.

---

## **7\. Templates de código**

### **7.1 Controller Spring (template)**

@RestController

@RequestMapping("/spaces")

@RequiredArgsConstructor

public class SpaceController {

    private final SpaceService spaceService;

    @GetMapping

    public Page\<SpaceSummaryDto\> listSpaces(SpaceFilter filter, Pageable pageable) {

        return spaceService.listSpaces(filter, pageable);

    }

    @PostMapping

    @PreAuthorize("hasRole('HOST')")

    public ResponseEntity\<SpaceDetailDto\> createSpace(

            @Valid @RequestBody CreateSpaceRequestDto request,

            @AuthenticationPrincipal Jwt jwt

    ) {

        UUID hostId \= UUID.fromString(jwt.getSubject());

        SpaceDetailDto created \= spaceService.createSpace(request, hostId);

        return ResponseEntity.status(HttpStatus.CREATED).body(created);

    }

}

### **7.2 Entity \+ Repository (template)**

@Entity

@Table(name \= "spaces")

@Getter

@Setter

@NoArgsConstructor

@AllArgsConstructor

public class SpaceEntity {

    @Id

    private UUID id;

    @Column(nullable \= false)

    private UUID hostId;

    @Column(nullable \= false)

    private String title;

    // ...

}

public interface SpaceRepository extends JpaRepository\<SpaceEntity, UUID\> {

    Page\<SpaceEntity\> findByCityAndActiveIsTrue(String city, Pageable pageable);

}

### **7.3 Componente React (template)**

type SpaceCardProps \= {

  id: string;

  title: string;

  city: string;

  pricePerHour: number;

};

export function SpaceCard({ id, title, city, pricePerHour }: SpaceCardProps) {

  return (

    \<article className="rounded-lg shadow p-4"\>

      \<h3 className="font-semibold text-lg"\>{title}\</h3\>

      \<p className="text-sm text-gray-500"\>{city}\</p\>

      \<p className="mt-2 font-bold"\>{pricePerHour} €/hora\</p\>

    \</article\>

  );

}

---

## **8\. Comandos frecuentes**

Ejecutar tests backend

mvn test

Ejecutar microservicio en local

mvn spring-boot:run

Levantar la infraestructura Docker completa

docker compose up \-d \--build

Arrancar frontend en modo desarrollo

npm run dev

---

## **9\. Errores típicos de IA y cómo evitarlos**

1. **Usar rutas de API incorrectas**

   * Evita inventar rutas; consulta siempre `API_DOCUMENTATION.md`.

2. **Ignorar validaciones**

   * Añade anotaciones de validación en DTOs y maneja errores con respuestas 400\.

3. **Mezclar lógica de negocio en controladores**

   * Mantén los controladores finos y delega en servicios.

4. **Romper la configuración de Docker**

   * No modifiques `docker-compose.yml` ni `.env` sin instrucciones explícitas del usuario.

5. **No tener en cuenta roles y permisos**

   * Antes de crear/modificar un endpoint, pregúntate: “¿Qué rol necesita esto?”.

Si tienes dudas sobre cómo proceder, **prefiere generar código que siga los patrones descritos aquí aunque sea un poco más verboso**, en lugar de inventar atajos peligrosos.

---

