# 📚 Trabajo de Fin de Grado: BalconazoApp

## Registro de Desarrollo del Proyecto

**Autor:** Ángel Molina Rodríguez  
**Repositorio:** https://github.com/amolrod/balconazo  
**Fecha de Inicio:** 26 de Noviembre de 2025  
**Estado:** En desarrollo

---

## 📋 Índice

1. [Descripción del Proyecto](#descripción-del-proyecto)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Arquitectura del Sistema](#arquitectura-del-sistema)
4. [Registro de Desarrollo](#registro-de-desarrollo)
5. [Estado Actual](#estado-actual)
6. [Próximos Pasos](#próximos-pasos)

---

## 📖 Descripción del Proyecto

**BalconazoApp** es un marketplace digital para el alquiler por horas de espacios con vistas privilegiadas (balcones, terrazas, azoteas) para eventos especiales como procesiones de Semana Santa, fuegos artificiales, desfiles o cualquier evento urbano.

### Problema que Resuelve
- Los propietarios de espacios con vistas privilegiadas no tienen una plataforma para rentabilizar sus espacios de forma puntual
- Los usuarios que buscan vistas privilegiadas para eventos especiales no tienen acceso fácil a estos espacios
- No existe una solución digital que conecte oferta y demanda de forma segura y eficiente

### Propuesta de Valor
- Marketplace bidireccional (anfitriones y huéspedes)
- Sistema de reservas por horas
- Gestión de pagos segura
- Sistema de valoraciones y reseñas
- Verificación de espacios

---

## 🛠 Stack Tecnológico

### Backend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Java | 21 LTS | Lenguaje principal |
| Spring Boot | 3.2.0 | Framework de microservicios |
| PostgreSQL | 16-alpine | Base de datos relacional |
| Flyway | 10.0.0 | Migraciones de BD |
| Keycloak | 22.0 | Autenticación y autorización |
| KrakenD | 2.4 | API Gateway |

### Frontend (Pendiente)
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Next.js | 15.0.3 | Framework React |
| React | 19 | Librería UI |
| TypeScript | 5 | Tipado estático |
| Tailwind CSS | 3.4 | Estilos |
| Bun | 1.x | Runtime y gestor de paquetes |

### DevOps
| Tecnología | Propósito |
|------------|-----------|
| Docker Compose | Orquestación local |
| GitHub Actions | CI/CD |

---

## 🏗 Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│                    (Next.js + React)                        │
│                      Puerto: 3000                           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    API GATEWAY                               │
│                     (KrakenD)                                │
│                    Puerto: 8080                              │
│              - Routing                                       │
│              - JWT Validation                                │
│              - Rate Limiting                                 │
│              - CORS                                          │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   USERS     │  │   SPACES    │  │  BOOKINGS   │
│  SERVICE    │  │   SERVICE   │  │   SERVICE   │
│  :8082      │  │   :8083     │  │   :8084     │
└──────┬──────┘  └──────┬──────┘  └──────┬──────┘
       │                │                │
       ▼                ▼                ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  postgres   │  │  postgres   │  │  postgres   │
│   users     │  │   spaces    │  │  bookings   │
│   :5433     │  │   :5434     │  │   :5435     │
└─────────────┘  └─────────────┘  └─────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      KEYCLOAK                                │
│                    Puerto: 8081                              │
│              - Autenticación OAuth2/OIDC                    │
│              - Gestión de usuarios                          │
│              - Roles y permisos                             │
└─────────────────────────────────────────────────────────────┘
```

### Microservicios

1. **users-service** (Puerto 8082)
   - Gestión de perfiles de usuario
   - Sincronización con Keycloak
   - CRUD de usuarios

2. **spaces-service** (Puerto 8083)
   - Gestión de espacios
   - Búsqueda con filtros
   - Fotos y características

3. **bookings-service** (Puerto 8084)
   - Gestión de reservas
   - Verificación de disponibilidad
   - Estados de reserva

---

## 📝 Registro de Desarrollo

### Sesión 1 - 26 de Noviembre de 2025

#### Fase 1: Análisis de Documentación
- ✅ Revisión de documentación existente del proyecto
- ✅ Identificación de estructura del proyecto (0% implementación previa)
- ✅ Análisis de requisitos técnicos

#### Fase 2: Scaffolding del Proyecto
- ✅ Creación de estructura completa de microservicios
- ✅ Configuración de `realm-export.json` para Keycloak
- ✅ Configuración de `krakend.json` para API Gateway
- ✅ Estructura de frontend con Next.js 15

#### Fase 3: Configuración de Git/GitHub
- ✅ Push inicial al repositorio (93 archivos)
- ✅ Creación de ramas:
  - `main` - Producción
  - `develop` - Integración
  - `feature/backend-setup` - Backend
  - `feature/frontend-setup` - Frontend

#### Fase 4: Migración a Bun
- ✅ Configuración de Bun como runtime y gestor de paquetes
- ✅ Actualización de package.json, Dockerfile, CI workflow
- ✅ Compilación exitosa del frontend

#### Fase 5: Backend - Infraestructura
- ✅ Creación de archivo `.env` desde `.env.example`
- ✅ Levantamiento de bases de datos PostgreSQL (3 instancias)
- ✅ Importación del realm de Keycloak

#### Fase 6: Backend - Corrección de Errores
- ✅ **Fix Flyway**: Añadida propiedad `<flyway.version>10.0.0</flyway.version>` en todos los pom.xml
- ✅ **Fix SpaceRepository**: Reemplazado JPQL problemático con `JpaSpecificationExecutor` para evitar error `lower(bytea)`
- ✅ **Fix JWT Issuer**: Configuración de issuer-uri como `http://localhost:8081` en docker-compose.yml para consistencia
- ✅ **Fix UserService**: Email único usando keycloakId para evitar duplicados

#### Fase 7: Backend - Validación
- ✅ Compilación exitosa de los 3 microservicios
- ✅ Construcción de imágenes Docker
- ✅ Health checks pasando para todos los servicios
- ✅ Autenticación JWT funcionando end-to-end
- ✅ Gateway KrakenD validando tokens correctamente

### Archivos Modificados/Creados Clave

```
backend/
├── users-service/
│   ├── pom.xml                    # Añadido flyway.version
│   └── src/main/java/.../service/
│       └── UserService.java       # Fix email único
├── spaces-service/
│   ├── pom.xml                    # Añadido flyway.version
│   └── src/main/java/.../repository/
│       └── SpaceSpecification.java # Nueva clase para filtros
└── bookings-service/
    └── pom.xml                    # Añadido flyway.version

gateway/
└── krakend.json                   # Fix endpoint health

keycloak/
└── realm-export.json              # sslRequired: none

docker-compose.yml                  # Variables JWT y extra_hosts
```

---

## ✅ Estado Actual

### Backend - Completado ✅

| Componente | Estado | Puerto | Health |
|------------|--------|--------|--------|
| postgres-users | ✅ Running | 5433 | Healthy |
| postgres-spaces | ✅ Running | 5434 | Healthy |
| postgres-bookings | ✅ Running | 5435 | Healthy |
| keycloak | ✅ Running | 8081 | OK |
| users-service | ✅ Running | 8082 | UP |
| spaces-service | ✅ Running | 8083 | UP |
| bookings-service | ✅ Running | 8084 | UP |
| krakend | ✅ Running | 8080 | OK |

### Endpoints Verificados

```bash
# Público - Listar espacios
GET http://localhost:8080/api/spaces → 200 OK

# Autenticado - Perfil de usuario
GET http://localhost:8080/api/users/me → 200 OK (con JWT)

# Health checks
GET http://localhost:8080/__health → {"status": "ok"}
GET http://localhost:8082/actuator/health → {"status": "UP"}
GET http://localhost:8083/actuator/health → {"status": "UP"}
GET http://localhost:8084/actuator/health → {"status": "UP"}
```

### Usuarios de Prueba Configurados

| Usuario | Password | Rol |
|---------|----------|-----|
| user_guest | guest123 | ROLE_USER |
| host_demo | host123 | ROLE_USER, ROLE_HOST |
| admin_host | admin123 | ROLE_USER, ROLE_HOST, ROLE_ADMIN |

### Flujo de Autenticación Verificado

```bash
# 1. Obtener token
curl -X POST "http://localhost:8081/realms/balconazo/protocol/openid-connect/token" \
  -d "client_id=balconazo-frontend" \
  -d "grant_type=password" \
  -d "username=user_guest" \
  -d "password=guest123"

# 2. Usar token en peticiones
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:8080/api/users/me
```

---

## 🚀 Próximos Pasos

### Corto Plazo (Backend)
- [ ] Añadir datos de prueba (seed data)
- [ ] Implementar tests unitarios e integración
- [ ] Configurar scopes de Keycloak para incluir email/nombre en tokens
- [ ] Documentar API con OpenAPI/Swagger

### Mediano Plazo (Frontend)
- [ ] Implementar páginas de autenticación (login/registro)
- [ ] Crear página de listado de espacios
- [ ] Implementar detalle de espacio
- [ ] Sistema de reservas

### Largo Plazo
- [ ] Sistema de pagos (Stripe)
- [ ] Sistema de notificaciones
- [ ] Panel de administración
- [ ] Despliegue en producción

---

## 📊 Métricas del Proyecto

| Métrica | Valor |
|---------|-------|
| Archivos totales | ~100+ |
| Microservicios | 3 |
| Contenedores Docker | 8 |
| Tiempo de desarrollo (Sesión 1) | ~3 horas |
| Líneas de código (estimado) | ~5000+ |

---

## 📚 Referencias

- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [KrakenD Documentation](https://www.krakend.io/docs/)
- [Next.js Documentation](https://nextjs.org/docs)

---

*Documento actualizado: 26 de Noviembre de 2025*
