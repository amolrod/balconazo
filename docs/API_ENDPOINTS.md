# API Endpoints - BalconazoApp

Documentacion completa de todos los endpoints disponibles en el backend de BalconazoApp.

**Base URL:** `http://localhost:8080` (via KrakenD Gateway)

**Autenticacion:** Bearer Token JWT (Keycloak)

---

## Indice

1. [Autenticacion](#1-autenticacion)
2. [Users Service](#2-users-service)
3. [Spaces Service](#3-spaces-service)
4. [Bookings Service](#4-bookings-service)
5. [Health Checks](#5-health-checks)
6. [Codigos de Error](#6-codigos-de-error)

---

## 1. Autenticacion

### Obtener Token JWT

```
POST http://localhost:8081/realms/balconazo/protocol/openid-connect/token
Content-Type: application/x-www-form-urlencoded
```

**Body (form-urlencoded):**
| Campo | Tipo | Requerido | Descripcion |
|-------|------|-----------|-------------|
| client_id | string | Si | `balconazo-frontend` |
| grant_type | string | Si | `password` |
| username | string | Si | Email o username del usuario |
| password | string | Si | Contrasena del usuario |

**Respuesta exitosa (200):**
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI...",
  "expires_in": 300,
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI...",
  "refresh_expires_in": 1800,
  "token_type": "Bearer"
}
```

### Usuarios de prueba

| Usuario | Password | Roles |
|---------|----------|-------|
| user_guest | guest123 | ROLE_USER |
| host_demo | host123 | ROLE_USER, ROLE_HOST |
| admin_host | admin123 | ROLE_USER, ROLE_HOST, ROLE_ADMIN |

---

## 2. Users Service

### GET /api/users/me

Obtiene el perfil del usuario autenticado. Si es la primera vez que accede, se crea automaticamente.

**Autenticacion:** Requerida (Bearer Token)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Respuesta exitosa (200):**
```json
{
  "id": "467e606d-da42-4fff-98ac-db0a02759502",
  "email": "user@example.com",
  "name": "Juan",
  "surname": "Garcia",
  "fullName": "Juan Garcia",
  "roles": ["ROLE_USER"],
  "createdAt": "2025-11-26T17:00:00"
}
```

**Errores:**
- `401 Unauthorized` - Token no proporcionado o invalido

---

### PUT /api/users/me

Actualiza los datos del usuario autenticado.

**Autenticacion:** Requerida (Bearer Token)

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Juan",
  "surname": "Garcia Lopez"
}
```

| Campo | Tipo | Requerido | Validacion |
|-------|------|-----------|------------|
| name | string | Si | 2-100 caracteres |
| surname | string | Si | 2-150 caracteres |

**Respuesta exitosa (200):**
```json
{
  "id": "467e606d-da42-4fff-98ac-db0a02759502",
  "email": "user@example.com",
  "name": "Juan",
  "surname": "Garcia Lopez",
  "fullName": "Juan Garcia Lopez",
  "roles": ["ROLE_USER"],
  "createdAt": "2025-11-26T17:00:00"
}
```

**Errores:**
- `400 Bad Request` - Validacion fallida
- `401 Unauthorized` - Token no proporcionado o invalido

---

## 3. Spaces Service

### GET /api/spaces

Lista espacios publicos con filtros opcionales. Endpoint publico (no requiere autenticacion).

**Autenticacion:** No requerida

**Query Parameters:**
| Parametro | Tipo | Requerido | Descripcion |
|-----------|------|-----------|-------------|
| city | string | No | Filtrar por ciudad |
| minPrice | decimal | No | Precio minimo por hora |
| maxPrice | decimal | No | Precio maximo por hora |
| capacity | integer | No | Capacidad minima |
| page | integer | No | Numero de pagina (default: 0) |
| size | integer | No | Elementos por pagina (default: 20) |
| sort | string | No | Ordenacion (ej: `pricePerHour,asc`) |

**Ejemplo:**
```
GET /api/spaces?city=Barcelona&minPrice=20&maxPrice=100&capacity=10&page=0&size=10
```

**Respuesta exitosa (200):**
```json
{
  "content": [
    {
      "id": "441f6404-8138-428c-9e32-6841da2c3052",
      "title": "Terraza con vistas al mar",
      "city": "Barcelona",
      "capacity": 15,
      "pricePerHour": 30.00,
      "thumbnailUrl": "https://...",
      "active": true
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 20
  },
  "totalElements": 1,
  "totalPages": 1
}
```

---

### GET /api/spaces/{id}

Obtiene el detalle completo de un espacio. Endpoint publico.

**Autenticacion:** No requerida

**Path Parameters:**
| Parametro | Tipo | Descripcion |
|-----------|------|-------------|
| id | UUID | ID del espacio |

**Respuesta exitosa (200):**
```json
{
  "id": "441f6404-8138-428c-9e32-6841da2c3052",
  "hostId": "f40b66f1-9d32-4dab-b098-4b518eab0eb0",
  "title": "Terraza con vistas al mar",
  "description": "Amplia terraza de 50m2 con vistas panoramicas...",
  "city": "Barcelona",
  "address": "Calle Marina 123",
  "capacity": 15,
  "pricePerHour": 30.00,
  "active": true,
  "photos": ["https://..."],
  "features": ["WiFi", "Barbacoa", "Piscina"],
  "createdAt": "2025-11-26T17:00:00"
}
```

**Errores:**
- `404 Not Found` - Espacio no encontrado

---

### POST /api/spaces

Crea un nuevo espacio. Solo disponible para usuarios con rol HOST o ADMIN.

**Autenticacion:** Requerida (ROLE_HOST o ROLE_ADMIN)

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Mi terraza en Barcelona",
  "description": "Amplia terraza de 50m2 con vistas panoramicas al mar...",
  "city": "Barcelona",
  "address": "Calle Marina 123",
  "capacity": 15,
  "pricePerHour": 30.00,
  "photoUrls": ["https://..."],
  "features": ["WiFi", "Barbacoa"]
}
```

| Campo | Tipo | Requerido | Validacion |
|-------|------|-----------|------------|
| title | string | Si | 5-150 caracteres |
| description | string | Si | 20-2000 caracteres |
| city | string | Si | Max 100 caracteres |
| address | string | No | Max 255 caracteres |
| capacity | integer | Si | 1-500 |
| pricePerHour | decimal | Si | 1.00-10000.00 |
| photoUrls | array[string] | No | URLs de imagenes |
| features | array[string] | No | Caracteristicas |

**Respuesta exitosa (200/201):**
```json
{
  "id": "nuevo-uuid-generado",
  "hostId": "uuid-del-host",
  "title": "Mi terraza en Barcelona",
  ...
}
```

**Errores:**
- `400 Bad Request` - Validacion fallida
- `401 Unauthorized` - Token invalido
- `403 Forbidden` - Usuario no tiene rol HOST

---

### PUT /api/spaces/{id}

Actualiza un espacio existente. Solo el propietario o ADMIN pueden actualizar.

**Autenticacion:** Requerida (ROLE_HOST o ROLE_ADMIN, debe ser propietario)

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Path Parameters:**
| Parametro | Tipo | Descripcion |
|-----------|------|-------------|
| id | UUID | ID del espacio |

**Body:** Mismo formato que POST /api/spaces

**Respuesta exitosa (200):** Mismo formato que POST

**Errores:**
- `400 Bad Request` - Validacion fallida
- `403 Forbidden` - No es propietario del espacio
- `404 Not Found` - Espacio no encontrado

---

### DELETE /api/spaces/{id}

Elimina un espacio. Solo el propietario o ADMIN pueden eliminar.

**Autenticacion:** Requerida (ROLE_HOST o ROLE_ADMIN, debe ser propietario)

**Path Parameters:**
| Parametro | Tipo | Descripcion |
|-----------|------|-------------|
| id | UUID | ID del espacio |

**Respuesta exitosa (204):** No Content

**Errores:**
- `403 Forbidden` - No es propietario del espacio
- `404 Not Found` - Espacio no encontrado

---

### GET /api/spaces/my

Lista los espacios del usuario autenticado (como anfitrion).

**Autenticacion:** Requerida (ROLE_HOST o ROLE_ADMIN)

**Query Parameters:**
| Parametro | Tipo | Requerido | Descripcion |
|-----------|------|-----------|-------------|
| page | integer | No | Numero de pagina (default: 0) |
| size | integer | No | Elementos por pagina (default: 20) |

**Respuesta exitosa (200):** Mismo formato paginado que GET /api/spaces

---

## 4. Bookings Service

### POST /api/bookings

Crea una nueva reserva. Cualquier usuario autenticado puede crear reservas.

**Autenticacion:** Requerida

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Body:**
```json
{
  "spaceId": "441f6404-8138-428c-9e32-6841da2c3052",
  "startTime": "2025-12-15T10:00:00",
  "endTime": "2025-12-15T14:00:00",
  "notes": "Celebracion de cumpleanos"
}
```

| Campo | Tipo | Requerido | Validacion |
|-------|------|-----------|------------|
| spaceId | UUID | Si | ID del espacio |
| startTime | datetime | Si | Debe ser fecha futura |
| endTime | datetime | Si | Debe ser fecha futura, posterior a startTime |
| notes | string | No | Notas adicionales |

**Respuesta exitosa (200/201):**
```json
{
  "id": "33eb7239-17cb-4020-92a5-07cf78925884",
  "spaceId": "441f6404-8138-428c-9e32-6841da2c3052",
  "guestId": "467e606d-da42-4fff-98ac-db0a02759502",
  "hostId": "f40b66f1-9d32-4dab-b098-4b518eab0eb0",
  "startTime": "2025-12-15T10:00:00",
  "endTime": "2025-12-15T14:00:00",
  "totalPrice": 120.00,
  "status": "CONFIRMED",
  "notes": "Celebracion de cumpleanos",
  "durationHours": 4,
  "createdAt": "2025-11-26T17:30:00"
}
```

**Errores:**
- `400 Bad Request` - Validacion fallida o horario no disponible
- `401 Unauthorized` - Token invalido
- `404 Not Found` - Espacio no encontrado

---

### GET /api/bookings/me

Obtiene las reservas del usuario actual como huesped.

**Autenticacion:** Requerida

**Query Parameters:**
| Parametro | Tipo | Requerido | Descripcion |
|-----------|------|-----------|-------------|
| status | string | No | Filtrar por estado (PENDING, CONFIRMED, CANCELLED, COMPLETED) |
| page | integer | No | Numero de pagina |
| size | integer | No | Elementos por pagina |

**Respuesta exitosa (200):**
```json
{
  "content": [
    {
      "id": "33eb7239-17cb-4020-92a5-07cf78925884",
      "spaceId": "441f6404-8138-428c-9e32-6841da2c3052",
      "guestId": "467e606d-da42-4fff-98ac-db0a02759502",
      "hostId": "f40b66f1-9d32-4dab-b098-4b518eab0eb0",
      "startTime": "2025-12-15T10:00:00",
      "endTime": "2025-12-15T14:00:00",
      "totalPrice": 120.00,
      "status": "CONFIRMED",
      "durationHours": 4,
      "createdAt": "2025-11-26T17:30:00"
    }
  ],
  "totalElements": 1,
  "totalPages": 1
}
```

---

### GET /api/bookings/host

Obtiene las reservas recibidas como anfitrion (reservas en tus espacios).

**Autenticacion:** Requerida (ROLE_HOST o ROLE_ADMIN)

**Query Parameters:** Igual que GET /api/bookings/me

**Respuesta exitosa (200):** Mismo formato paginado

---

### GET /api/bookings/{id}

Obtiene el detalle de una reserva especifica. Solo el huesped o anfitrion pueden verla.

**Autenticacion:** Requerida

**Path Parameters:**
| Parametro | Tipo | Descripcion |
|-----------|------|-------------|
| id | UUID | ID de la reserva |

**Respuesta exitosa (200):** Objeto BookingResponse

**Errores:**
- `403 Forbidden` - No autorizado para ver esta reserva
- `404 Not Found` - Reserva no encontrada

---

### PUT /api/bookings/{id}/cancel

Cancela una reserva. Solo el huesped o anfitrion pueden cancelar.

**Autenticacion:** Requerida

**Path Parameters:**
| Parametro | Tipo | Descripcion |
|-----------|------|-------------|
| id | UUID | ID de la reserva |

**Respuesta exitosa (200):**
```json
{
  "id": "33eb7239-17cb-4020-92a5-07cf78925884",
  "status": "CANCELLED",
  ...
}
```

**Errores:**
- `400 Bad Request` - Reserva no puede ser cancelada (ya completada)
- `403 Forbidden` - No autorizado para cancelar
- `404 Not Found` - Reserva no encontrada

---

### GET /api/bookings/space/{spaceId}/availability

Obtiene los slots ocupados de un espacio en un rango de fechas. Endpoint publico.

**Autenticacion:** No requerida

**Path Parameters:**
| Parametro | Tipo | Descripcion |
|-----------|------|-------------|
| spaceId | UUID | ID del espacio |

**Query Parameters:**
| Parametro | Tipo | Requerido | Descripcion |
|-----------|------|-----------|-------------|
| startDate | datetime | Si | Fecha inicio del rango |
| endDate | datetime | Si | Fecha fin del rango |

**Ejemplo:**
```
GET /api/bookings/space/441f6404.../availability?startDate=2025-12-01T00:00:00&endDate=2025-12-31T23:59:59
```

**Respuesta exitosa (200):**
```json
[
  {
    "startTime": "2025-12-15T10:00:00",
    "endTime": "2025-12-15T14:00:00"
  },
  {
    "startTime": "2025-12-20T16:00:00",
    "endTime": "2025-12-20T20:00:00"
  }
]
```

---

## 5. Health Checks

### Gateway Health

```
GET http://localhost:8080/__health
```

**Respuesta:**
```json
{
  "status": "ok"
}
```

### Services Health (acceso directo)

| Servicio | URL |
|----------|-----|
| Users Service | `http://localhost:8082/actuator/health` |
| Spaces Service | `http://localhost:8083/actuator/health` |
| Bookings Service | `http://localhost:8084/actuator/health` |

**Respuesta:**
```json
{
  "status": "UP",
  "components": {
    "db": { "status": "UP" },
    "diskSpace": { "status": "UP" }
  }
}
```

---

## 6. Codigos de Error

### Formato de error estandar

```json
{
  "timestamp": "2025-11-26T17:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Descripcion del error",
  "details": {
    "campo": "Mensaje de validacion"
  }
}
```

### Codigos HTTP

| Codigo | Significado |
|--------|-------------|
| 200 | OK - Operacion exitosa |
| 201 | Created - Recurso creado |
| 204 | No Content - Eliminacion exitosa |
| 400 | Bad Request - Error de validacion |
| 401 | Unauthorized - Token no proporcionado o expirado |
| 403 | Forbidden - Sin permisos para esta operacion |
| 404 | Not Found - Recurso no encontrado |
| 409 | Conflict - Conflicto (ej: horario ya reservado) |
| 500 | Internal Server Error - Error del servidor |

---

## Resumen de Endpoints

### Endpoints Publicos (sin autenticacion)

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | /api/spaces | Listar espacios |
| GET | /api/spaces/{id} | Detalle de espacio |
| GET | /api/bookings/space/{id}/availability | Disponibilidad |
| GET | /__health | Health del gateway |

### Endpoints Autenticados (cualquier usuario)

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | /api/users/me | Mi perfil |
| PUT | /api/users/me | Actualizar perfil |
| POST | /api/bookings | Crear reserva |
| GET | /api/bookings/me | Mis reservas |
| GET | /api/bookings/{id} | Detalle reserva |
| PUT | /api/bookings/{id}/cancel | Cancelar reserva |

### Endpoints para Hosts (ROLE_HOST)

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| POST | /api/spaces | Crear espacio |
| PUT | /api/spaces/{id} | Actualizar espacio |
| DELETE | /api/spaces/{id} | Eliminar espacio |
| GET | /api/spaces/my | Mis espacios |
| GET | /api/bookings/host | Reservas recibidas |

---

*Documentacion generada el 26 de Noviembre de 2025*
*Version: 1.0.0*
