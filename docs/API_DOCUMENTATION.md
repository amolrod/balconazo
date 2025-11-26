# **API_DOCUMENTATION.md**

Documentación de APIs – BalconazoApp

---

## **Índice**

1. [Introducción](#1-introducción)

2. [Convenciones generales](#2-convenciones-generales)

3. [Autenticación y seguridad](#3-autenticación-y-seguridad)

4. [API de usuarios (users-service)](#4-api-de-usuarios-users-service)

5. [API de espacios (spaces-service)](#5-api-de-espacios-spaces-service)

6. [API de reservas (bookings-service)](#6-api-de-reservas-bookings-service)

7. [Formato de errores](#7-formato-de-errores)

8. [Ejemplos completos con curl](#8-ejemplos-completos-con-curl)

9. [Troubleshooting API](#9-troubleshooting-api)

---

## **1. Introducción**

Este documento describe la **API pública** de BalconazoApp, tal y como se expone a través del **API Gateway KrakenD**.

Base URL por defecto:

```
 http://localhost:8080/api
```

---

## **2. Convenciones generales**

* Formato de datos: **JSON**.

* Codificación: **UTF-8**.

* Notación de fechas/horas: **ISO-8601** (ej. `2025-05-01T18:00:00Z`).

* Identificadores: `UUID` en formato texto.

---

## **3. Autenticación y seguridad**

La mayoría de endpoints requieren autenticación basada en **JWT** emitidos por Keycloak.

Cabecera obligatoria:

```
 Authorization: Bearer <ACCESS_TOKEN>
```

*   
* Los roles (`ROLE_USER`, `ROLE_HOST`, `ROLE_ADMIN`) se usan para controlar el acceso a determinados endpoints.

---

## **4. API de usuarios (users-service)**

### **4.1 GET `/api/users/me`**

Obtiene el perfil del usuario autenticado.

* **Método**: `GET`

* **Path**: `/api/users/me`

* **Auth requerida**: Sí (cualquier rol)

**Headers requeridos**

* `Authorization: Bearer <token>`

**Response 200**

```json
{

  "id": "e7b4e6e4-b62a-4c6a-9f6e-4d7a3c5cfd09",

  "email": "user@example.com",

  "name": "Ángel",

  "surname": "Molina"

}
```

**Códigos de estado**

* `200 OK` – usuario encontrado.

* `401 Unauthorized` – falta token o es inválido.

---

## **5. API de espacios (spaces-service)**

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

```json
{

  "content": [

    {

      "id": "uuid-espacio-1",

      "title": "Ático con vistas",

      "city": "Madrid",

      "pricePerHour": 30.0,

      "capacity": 8,

      "thumbnailUrl": "https://.../foto1.jpg"

    }

  ],

  "page": 0,

  "size": 20,

  "totalElements": 1,

  "totalPages": 1

}
```

---

### **5.2 GET `/api/spaces/{id}`**

Detalle de un espacio.

* **Método**: `GET`

* **Path**: `/api/spaces/{id}`

* **Auth requerida**: No.

**Response 200**

```json
{

  "id": "uuid-espacio-1",

  "title": "Ático con vistas",

  "description": "Terraza amplia con vistas al centro...",

  "city": "Madrid",

  "capacity": 8,

  "pricePerHour": 30.0,

  "photos": [

    "https://.../foto1.jpg",

    "https://.../foto2.jpg"

  ],

  "features": ["wifi", "sombra", "vistas"]

}
```

---

### **5.3 POST `/api/spaces`**

Creación de un espacio (solo anfitriones).

* **Método**: `POST`

* **Path**: `/api/spaces`

* **Auth requerida**: Sí (rol `ROLE_HOST` o `ROLE_ADMIN`)

**Request body**

```json
{

  "title": "Ático con vistas",

  "description": "Terraza muy luminosa...",

  "city": "Madrid",

  "capacity": 8,

  "pricePerHour": 30.0,

  "photos": ["https://.../foto1.jpg"],

  "features": ["wifi", "sombra", "vistas"]

}
```

**Response 201**

```json
{

  "id": "uuid-nuevo-espacio",

  "title": "Ático con vistas",

  "city": "Madrid",

  "capacity": 8,

  "pricePerHour": 30.0

}
```

**Códigos de estado**

* `201 Created` – espacio creado.

* `400 Bad Request` – datos inválidos.

* `401/403` – no autenticado o sin rol de anfitrión.

---

## **6. API de reservas (bookings-service)**

### **6.1 POST `/api/bookings`**

Crea una reserva.

* **Método**: `POST`

* **Path**: `/api/bookings`

* **Auth requerida**: Sí (`ROLE_USER` o `ROLE_HOST`)

**Request body**

```json
{

  "spaceId": "uuid-espacio-1",

  "startTime": "2025-05-01T18:00:00Z",

  "endTime": "2025-05-01T20:00:00Z"

}
```

**Response 201**

```json
{

  "id": "uuid-reserva-1",

  "spaceId": "uuid-espacio-1",

  "guestId": "uuid-usuario",

  "startTime": "2025-05-01T18:00:00Z",

  "endTime": "2025-05-01T20:00:00Z",

  "totalPrice": 60.0,

  "status": "PENDING"

}
```

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

```json
[

  {

    "id": "uuid-reserva-1",

    "spaceId": "uuid-espacio-1",

    "spaceTitle": "Ático con vistas",

    "startTime": "2025-05-01T18:00:00Z",

    "endTime": "2025-05-01T20:00:00Z",

    "status": "CONFIRMED",

    "totalPrice": 60.0

  }

]
```

---

### **6.3 PUT `/api/bookings/{id}/cancel`**

Cancela una reserva (si las reglas lo permiten).

* **Método**: `PUT`

* **Path**: `/api/bookings/{id}/cancel`

* **Auth requerida**: Sí (el usuario debe ser el huésped o el anfitrión, según reglas).

**Response 200**

```json
{

  "id": "uuid-reserva-1",

  "status": "CANCELLED"

}
```

**Códigos de estado**

* `200 OK` – cancelación correcta.

* `400 Bad Request` – estado no cancelable.

* `403 Forbidden` – usuario sin permisos sobre la reserva.

* `404 Not Found` – reserva inexistente.

---

## **7. Formato de errores**

Errores típicos de Spring Boot:

```json
{

  "timestamp": "2025-01-01T12:00:00.000+00:00",

  "status": 409,

  "error": "Conflict",

  "message": "La franja horaria no está disponible",

  "path": "/api/bookings"

}
```

---

## **8. Ejemplos completos con curl**

Obtener perfil del usuario autenticado

```bash
TOKEN="PON_AQUI_EL_TOKEN"

curl -X GET http://localhost:8080/api/users/me \

  -H "Authorization: Bearer ${TOKEN}" \

  -H "Accept: application/json"
```

Buscar espacios en Madrid con precio entre 10 y 50 €/h

```bash
curl -X GET "http://localhost:8080/api/spaces?city=Madrid&minPrice=10&maxPrice=50" \

  -H "Accept: application/json"
```

Crear una reserva

```bash
TOKEN="PON_AQUI_EL_TOKEN"

curl -X POST http://localhost:8080/api/bookings \

  -H "Authorization: Bearer ${TOKEN}" \

  -H "Content-Type: application/json" \

  -d '{

    "spaceId": "uuid-espacio-1",

    "startTime": "2025-05-01T18:00:00Z",

    "endTime": "2025-05-01T20:00:00Z"

  }'
```

---

## **9. Troubleshooting API**

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
