# Arquitectura del Sistema - BalconazoApp

## Índice

1. [Visión General](#1-visión-general)
2. [Diagrama de Arquitectura](#2-diagrama-de-arquitectura)
3. [Componentes del Sistema](#3-componentes-del-sistema)
4. [Flujo de Autenticación](#4-flujo-de-autenticación)
5. [Comunicación entre Servicios](#5-comunicación-entre-servicios)
6. [Modelo de Datos](#6-modelo-de-datos)
7. [Stack Tecnológico](#7-stack-tecnológico)
8. [Puertos y Endpoints](#8-puertos-y-endpoints)

---

## 1. Visión General

BalconazoApp implementa una **arquitectura de microservicios** con los siguientes principios:

- **Separación de responsabilidades**: Cada microservicio gestiona un dominio específico
- **Base de datos por servicio**: Cada microservicio tiene su propia base de datos PostgreSQL
- **API Gateway**: KrakenD centraliza el acceso y aplica políticas de seguridad
- **Autenticación centralizada**: Keycloak gestiona identidades y emite tokens JWT
- **Contenedorización**: Todos los servicios se ejecutan en contenedores Docker

---

## 2. Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENTE                                         │
│                          (Navegador Web)                                     │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (Next.js)                                 │
│                              Puerto 3000                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │    Pages    │  │ Components  │  │    Hooks    │  │  Auth (Keycloak-js) │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
┌───────────────────────────────┐   ┌───────────────────────────────┐
│         KEYCLOAK              │   │      API GATEWAY (KrakenD)    │
│        Puerto 8081            │   │         Puerto 8080           │
│  ┌─────────────────────────┐  │   │  ┌─────────────────────────┐  │
│  │   Realm: balconazo      │  │   │  │   JWT Validation        │  │
│  │   - ROLE_USER           │  │   │  │   Rate Limiting         │  │
│  │   - ROLE_HOST           │  │   │  │   Request Routing       │  │
│  │   - ROLE_ADMIN          │  │   │  │   CORS                  │  │
│  └─────────────────────────┘  │   │  └─────────────────────────┘  │
└───────────────────────────────┘   └───────────────────────────────┘
                                                    │
                    ┌───────────────────────────────┼───────────────────────────────┐
                    │                               │                               │
                    ▼                               ▼                               ▼
┌───────────────────────────┐   ┌───────────────────────────┐   ┌───────────────────────────┐
│     USERS-SERVICE         │   │     SPACES-SERVICE        │   │    BOOKINGS-SERVICE       │
│      Puerto 8082          │   │       Puerto 8083         │   │       Puerto 8084         │
│  ┌─────────────────────┐  │   │  ┌─────────────────────┐  │   │  ┌─────────────────────┐  │
│  │  Spring Boot 3.2    │  │   │  │  Spring Boot 3.2    │  │   │  │  Spring Boot 3.2    │  │
│  │  - UserController   │  │   │  │  - SpaceController  │  │   │  │  - BookingController│  │
│  │  - UserService      │  │   │  │  - SpaceService     │  │   │  │  - BookingService   │  │
│  │  - UserRepository   │  │   │  │  - SpaceRepository  │  │   │  │  - BookingRepository│  │
│  └─────────────────────┘  │   │  └─────────────────────┘  │   │  └─────────────────────┘  │
│           │               │   │           │               │   │           │               │
│           ▼               │   │           ▼               │   │           ▼               │
│  ┌─────────────────────┐  │   │  ┌─────────────────────┐  │   │  ┌─────────────────────┐  │
│  │  PostgreSQL         │  │   │  │  PostgreSQL         │  │   │  │  PostgreSQL         │  │
│  │  Puerto 5433        │  │   │  │  Puerto 5434        │  │   │  │  Puerto 5435        │  │
│  │  DB: users_db       │  │   │  │  DB: spaces_db      │  │   │  │  DB: bookings_db    │  │
│  └─────────────────────┘  │   │  └─────────────────────┘  │   │  └─────────────────────┘  │
└───────────────────────────┘   └───────────────────────────┘   └───────────────────────────┘
```

---

## 3. Componentes del Sistema

### 3.1 Frontend (Next.js 15)

**Responsabilidades:**
- Renderizado de interfaz de usuario
- Gestión del estado de la aplicación
- Integración con Keycloak para autenticación
- Llamadas a la API a través del gateway

**Tecnologías:**
- Next.js 15 con App Router
- React 19
- TypeScript
- Tailwind CSS
- Bun como runtime

### 3.2 API Gateway (KrakenD)

**Responsabilidades:**
- Punto de entrada único para todas las APIs
- Validación de tokens JWT
- Routing de peticiones a microservicios
- Rate limiting y throttling
- Gestión de CORS

**Configuración clave:**
```json
{
  "endpoint": "/api/users/me",
  "backend": [
    {
      "url_pattern": "/users/me",
      "host": ["http://users-service:8082"]
    }
  ]
}
```

### 3.3 Keycloak

**Responsabilidades:**
- Gestión de identidades (IdP)
- Emisión de tokens JWT (Access Token, ID Token, Refresh Token)
- Gestión de roles y permisos
- Soporte para login social (Google)

**Configuración:**
- Realm: `balconazo`
- Clientes:
  - `balconazo-frontend` (Public, para SPA)
  - `balconazo-api` (Bearer-only, para servicios)

### 3.4 Users Service

**Responsabilidades:**
- Gestión de perfiles de usuario
- Sincronización con Keycloak (getOrCreate)
- CRUD de datos de usuario

**Endpoints principales:**
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/users/me` | Obtener perfil del usuario autenticado |
| PUT | `/users/me` | Actualizar perfil |
| GET | `/users/{id}` | Obtener usuario por ID |

### 3.5 Spaces Service

**Responsabilidades:**
- CRUD de espacios para alquiler
- Gestión de fotos de espacios
- Búsqueda y filtrado de espacios

**Endpoints principales:**
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/spaces` | Listar espacios (con filtros) |
| GET | `/spaces/{id}` | Detalle de un espacio |
| POST | `/spaces` | Crear espacio (ROLE_HOST) |
| PUT | `/spaces/{id}` | Actualizar espacio |
| DELETE | `/spaces/{id}` | Eliminar espacio |

### 3.6 Bookings Service

**Responsabilidades:**
- Gestión de reservas
- Validación de disponibilidad
- Cálculo de precios
- Prevención de reservas solapadas

**Endpoints principales:**
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/bookings` | Crear reserva |
| GET | `/bookings/me` | Mis reservas (como huésped) |
| GET | `/bookings/host` | Reservas recibidas (como host) |
| PUT | `/bookings/{id}/cancel` | Cancelar reserva |

---

## 4. Flujo de Autenticación

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Usuario │     │ Frontend │     │ Keycloak │     │ KrakenD  │     │ Backend  │
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │                │                │
     │ 1. Click Login │                │                │                │
     │───────────────>│                │                │                │
     │                │                │                │                │
     │                │ 2. Redirect    │                │                │
     │                │───────────────>│                │                │
     │                │                │                │                │
     │                │ 3. Login Form  │                │                │
     │<───────────────┼────────────────│                │                │
     │                │                │                │                │
     │ 4. Credentials │                │                │                │
     │────────────────┼───────────────>│                │                │
     │                │                │                │                │
     │                │ 5. JWT Tokens  │                │                │
     │                │<───────────────│                │                │
     │                │                │                │                │
     │                │ 6. API Request │                │                │
     │                │ + Bearer Token │                │                │
     │                │───────────────────────────────>│                │
     │                │                │                │                │
     │                │                │                │ 7. Validate JWT│
     │                │                │                │ + Forward      │
     │                │                │                │───────────────>│
     │                │                │                │                │
     │                │                │                │ 8. Response    │
     │                │                │                │<───────────────│
     │                │                │                │                │
     │                │ 9. JSON Response               │                │
     │                │<───────────────────────────────│                │
     │                │                │                │                │
     │ 10. Render UI  │                │                │                │
     │<───────────────│                │                │                │
```

### Configuración JWT en Microservicios

Cada microservicio valida los tokens JWT con la siguiente configuración:

```yaml
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          # Issuer que aparece en el token (acceso externo)
          issuer-uri: http://localhost:8081/realms/balconazo
          # URL para obtener las claves de validación (red Docker interna)
          jwk-set-uri: http://keycloak:8080/realms/balconazo/protocol/openid-connect/certs
```

---

## 5. Comunicación entre Servicios

### 5.1 Comunicación Síncrona

Los microservicios se comunican entre sí mediante **REST APIs**:

- `bookings-service` → `spaces-service`: Para validar que un espacio existe y obtener su precio

```java
// Ejemplo: BookingService validando un espacio
@Service
public class BookingService {
    private final RestTemplate restTemplate;
    
    public SpaceDto getSpace(UUID spaceId) {
        return restTemplate.getForObject(
            "http://spaces-service:8083/spaces/" + spaceId,
            SpaceDto.class
        );
    }
}
```

### 5.2 Red Docker

Todos los servicios están en la misma red Docker (`balconazo-network`), permitiendo comunicación por nombre de servicio:

```yaml
networks:
  balconazo-network:
    driver: bridge
```

---

## 6. Modelo de Datos

### 6.1 Base de Datos Users (users_db)

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    keycloak_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(50),
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6.2 Base de Datos Spaces (spaces_db)

```sql
CREATE TABLE spaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    host_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    space_type VARCHAR(50),
    price_per_hour DECIMAL(10,2) NOT NULL,
    capacity INTEGER,
    city VARCHAR(100),
    address TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    amenities TEXT[],
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE space_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    space_id UUID REFERENCES spaces(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6.3 Base de Datos Bookings (bookings_db)

```sql
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    space_id UUID NOT NULL,
    guest_id UUID NOT NULL,
    host_id UUID NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    total_price DECIMAL(10,2) NOT NULL,
    guest_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT no_overlap EXCLUDE USING gist (
        space_id WITH =,
        tsrange(start_time, end_time) WITH &&
    ) WHERE (status != 'CANCELLED')
);
```

---

## 7. Stack Tecnológico

| Capa | Tecnología | Versión | Propósito |
|------|------------|---------|-----------|
| **Frontend** | Next.js | 15.0.3 | Framework React |
| | React | 19.0.0 | Biblioteca UI |
| | TypeScript | 5.x | Tipado estático |
| | Tailwind CSS | 3.4.x | Estilos |
| | Bun | 1.x | Runtime y gestor de paquetes |
| **Backend** | Java | 21 LTS | Lenguaje |
| | Spring Boot | 3.2.0 | Framework |
| | Spring Security | 6.x | Seguridad OAuth2 |
| | Flyway | 10.0.0 | Migraciones DB |
| | Hibernate | 6.x | ORM |
| **Base de Datos** | PostgreSQL | 16-alpine | Base de datos relacional |
| **Autenticación** | Keycloak | 22.0 | Identity Provider |
| **Gateway** | KrakenD | 2.4 | API Gateway |
| **Infraestructura** | Docker | 24+ | Contenedores |
| | Docker Compose | 2.x | Orquestación local |

---

## 8. Puertos y Endpoints

### Servicios en Desarrollo

| Servicio | Puerto Host | Puerto Interno | URL Base |
|----------|-------------|----------------|----------|
| Frontend | 3000 | 3000 | `http://localhost:3000` |
| KrakenD Gateway | 8080 | 8080 | `http://localhost:8080` |
| Keycloak | 8081 | 8080 | `http://localhost:8081` |
| Users Service | 8082 | 8082 | `http://localhost:8082` |
| Spaces Service | 8083 | 8083 | `http://localhost:8083` |
| Bookings Service | 8084 | 8084 | `http://localhost:8084` |
| PostgreSQL Users | 5433 | 5432 | `localhost:5433` |
| PostgreSQL Spaces | 5434 | 5432 | `localhost:5434` |
| PostgreSQL Bookings | 5435 | 5432 | `localhost:5435` |

### Endpoints de la API (a través de KrakenD)

```
Base URL: http://localhost:8080

/api/users/me          → users-service
/api/users/{id}        → users-service
/api/spaces            → spaces-service
/api/spaces/{id}       → spaces-service
/api/spaces/host/me    → spaces-service
/api/bookings          → bookings-service
/api/bookings/me       → bookings-service
/api/bookings/host     → bookings-service
```

### Health Checks

```bash
# KrakenD
curl http://localhost:8080/__health

# Microservicios (Spring Boot Actuator)
curl http://localhost:8082/actuator/health  # users
curl http://localhost:8083/actuator/health  # spaces
curl http://localhost:8084/actuator/health  # bookings

# Keycloak
curl http://localhost:8081/health
```

---

*Documento actualizado: 26 de Noviembre de 2025*
