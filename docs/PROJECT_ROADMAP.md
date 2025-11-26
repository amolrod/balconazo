# **PROJECT_ROADMAP.md**

Hoja de ruta y Plan de Sprints – BalconazoApp

---

## **Índice**

1. [Introducción](#1-introducción)
2. [Fase 1: Fundamentos (Sprint 1)](#2-fase-1-fundamentos-sprint-1)
3. [Fase 2: Gestión de Espacios (Sprint 2)](#3-fase-2-gestión-de-espacios-sprint-2)
4. [Fase 3: Reservas y Buscador (Sprint 3)](#4-fase-3-reservas-y-buscador-sprint-3)
5. [Fase 4: Frontend y Experiencia de Usuario (Sprint 4)](#5-fase-4-frontend-y-experiencia-de-usuario-sprint-4)
6. [Fase 5: Pulido y Despliegue (Sprint 5)](#6-fase-5-pulido-y-despliegue-sprint-5)

---

## **1. Introducción**

Este documento organiza el desarrollo de **BalconazoApp** en una serie de **Sprints** lógicos. Cada sprint tiene un objetivo claro y entregables definidos.

---

## **2. Fase 1: Fundamentos y Usuarios (Sprint 1)** ✅ COMPLETADO

**Objetivo:** Tener la infraestructura base y el microservicio de usuarios operativo y seguro.

**Estado:** ✅ Completado el 26/11/2025

### **2.1 Infraestructura y Configuración**
*   [x] **Docker Compose**: Definir servicios de BD, Keycloak, KrakenD.
*   [x] **Keycloak**:
    *   Acceder a `localhost:8081`.
    *   Crear Realm `balconazo`.
    *   Crear Cliente `balconazo-frontend` (Public) y `balconazo-api` (Bearer-only).
    *   Crear Roles: `ROLE_USER`, `ROLE_HOST`.
    *   Crear usuario de prueba `admin_host` (con rol HOST) y `user_guest` (con rol USER).
*   [x] **Base de Datos**: Verificar que `postgres-users` está arriba y accesible.

### **2.2 Microservicio Usuarios (`users-service`)**
*   [x] **Estructura**: Crear paquetes `model`, `repository`, `service`, `controller`, `config`.
*   [x] **Seguridad**: Configurar `SecurityConfig.java` para validar JWT de Keycloak.
*   [x] **Modelo de Datos**:
    *   Crear entidad `User` (id, email, name, surname, keycloakId).
    *   Crear migración Flyway `V1__create_users_table.sql`.
*   [x] **Lógica de Negocio**:
    *   Implementar `UserService.getOrCreate(keycloakId, userInfo)`: si el usuario no existe en BD local, lo crea con datos del token.
*   [x] **API REST**:
    *   `GET /users/me`: Devuelve datos del usuario autenticado.
    *   `PUT /users/me`: Actualizar datos básicos.

### **2.3 API Gateway**
*   [x] **KrakenD**:
    *   Configurar endpoint `/api/users/me` que redirija a `users-service`.
    *   Validar que rechaza peticiones sin token.

**✅ Entregable Sprint 1:** VERIFICADO
*   ✅ Comando `curl` a `localhost:8080/api/users/me` con token devuelve JSON 200 OK.
*   ✅ Tabla `users` en Postgres tiene 1 registro tras el primer login.

---

## **3. Fase 2: Gestión de Espacios (Sprint 2)** ✅ COMPLETADO

**Objetivo:** Permitir a los anfitriones publicar espacios (CRUD).

**Estado:** ✅ Completado el 26/11/2025

### **3.1 Microservicio Espacios (`spaces-service`)**
*   [x] **Modelo de Datos**:
    *   Entidad `Space` (id, hostId, title, description, price, city, capacity, active).
    *   Entidad `SpacePhoto` (id, spaceId, url).
    *   Migración Flyway `V1__create_spaces_tables.sql`.
*   [x] **Repositorio**:
    *   `findByHostId(UUID hostId)`
    *   `findByCityAndPrice...(filtros)` (Specification o Query).
*   [x] **Servicio**:
    *   `createSpace(dto, hostId)`: Validar que el usuario tiene rol `ROLE_HOST`.
    *   `updateSpace(id, dto, hostId)`: Validar que el espacio pertenece al usuario.
*   [x] **API REST**:
    *   `POST /spaces` (Solo Hosts).
    *   `GET /spaces` (Público, con filtros).
    *   `GET /spaces/{id}` (Público).
    *   `DELETE /spaces/{id}` (Solo Owner).

### **3.2 Integración**
*   [x] **KrakenD**: Exponer rutas `/api/spaces/*`.
*   [x] **Fotos**: Para simplificar, usar URLs de texto o integrar un servicio dummy de subida (o base64 temporalmente).

**✅ Entregable Sprint 2:** VERIFICADO
*   ✅ Usuario con rol HOST puede crear un espacio.
*   ✅ Usuario anónimo puede listar espacios filtrando por ciudad.

---

## **4. Fase 3: Reservas y Lógica de Negocio (Sprint 3)** ✅ COMPLETADO

**Objetivo:** Gestión de reservas y prevención de conflictos.

**Estado:** ✅ Completado el 26/11/2025

### **4.1 Microservicio Reservas (`bookings-service`)**
*   [x] **Modelo de Datos**:
    *   Entidad `Booking` (id, spaceId, guestId, startTime, endTime, status, totalPrice).
    *   Migración Flyway `V1__create_bookings_table.sql`.
*   [x] **Validaciones Críticas**:
    *   **Fechas**: `startTime` < `endTime`.
    *   **Disponibilidad**: Consultar BD para asegurar que NO existe reserva solapada (`WHERE space_id = ? AND status != 'CANCELLED' AND (start < ? AND end > ?)`).
*   [x] **API REST**:
    *   `POST /bookings`: Crear reserva (Pendiente/Confirmada).
    *   `GET /bookings/me`: Historial del huésped.
    *   `GET /bookings/host`: Reservas recibidas (para el anfitrión).
    *   `PUT /bookings/{id}/cancel`: Cancelar.

### **4.2 Comunicación entre Servicios**
*   [x] **Validar Espacio**: Al crear reserva, `bookings-service` debe saber si el `spaceId` existe y su precio.
    *   *Opción B (Mejor)*: `bookings-service` llama a `spaces-service` (Feign Client o RestTemplate) para validar y obtener precio.

**✅ Entregable Sprint 3:** VERIFICADO
*   ✅ No se pueden crear dos reservas para el mismo espacio a la misma hora.
*   ✅ El precio total se calcula correctamente en el backend.

---

## **5. Fase 4: Frontend Core (Sprint 4)**

**Objetivo:** Interfaz de usuario funcional conectada al backend.

### **5.1 Setup y Auth**
*   [ ] **Next.js**: Estructura de carpetas (`app/`, `components/`, `lib/`).
*   [ ] **Keycloak**: Configurar `AuthProvider` con `keycloak-js`. Proteger rutas `/account/*`.

### **5.2 Componentes UI**
*   [ ] **Navbar**: Login/Logout, Avatar de usuario.
*   [ ] **SpaceCard**: Foto, título, precio, ciudad.
*   [ ] **Buscador**: Inputs para ciudad, fecha inicio, fecha fin.

### **5.3 Páginas Principales**
*   [ ] **Home (`/`)**: Hero section + Buscador + Espacios destacados.
*   [ ] **Resultados (`/search`)**: Grid de espacios filtrados.
*   [ ] **Detalle (`/spaces/[id]`)**: Info completa + Botón "Reservar".
*   [ ] **Publicar (`/become-host`)**: Formulario para crear espacio.

**✅ Entregable Sprint 4:**
*   Flujo completo: Login -> Buscar -> Ver Detalle -> Reservar.

---

## **6. Fase 5: Dashboard y Pulido (Sprint 5)**

**Objetivo:** Gestión de usuario y experiencia visual.

### **6.1 Dashboard de Usuario**
*   [ ] **Mis Reservas**: Lista de reservas pasadas y futuras con estado (color code).
*   [ ] **Panel de Anfitrión**:
    *   Mis espacios (Editar/Borrar).
    *   Reservas entrantes (Aceptar/Rechazar si implementamos flujo manual).

### **6.2 UX/UI Premium**
*   [ ] **Tailwind**: Añadir gradientes, sombras suaves, bordes redondeados.
*   [ ] **Feedback**: Toasts/Notificaciones al reservar ("¡Reserva confirmada!").
*   [ ] **Loading States**: Skeletons mientras cargan los datos.

### **6.3 Despliegue**
*   [ ] **Docker Prod**: Revisar `docker-compose.yml` final.
*   [ ] **Nginx**: Configurar proxy inverso (opcional para local, necesario para VPS).

**✅ Entregable Sprint 5:**
*   Aplicación completa, bonita y robusta.

