# Diario de Desarrollo - TFG BalconazoApp

**Proyecto:** BalconazoApp - Marketplace de alquiler de espacios por horas
**Autor:** Angel Molina Rodriguez
**Repositorio:** [github.com/amolrod/balconazo](https://github.com/amolrod/balconazo)
**Fecha de inicio:** 26 de Noviembre de 2025

---

## Indice

1. [Sesion 1 - Scaffolding y Backend](#sesion-1---26-de-noviembre-de-2025)
   - [Analisis Inicial](#1-analisis-inicial-del-proyecto)
   - [Scaffolding Completo](#2-scaffolding-completo-del-proyecto)
   - [Configuracion Git](#3-configuracion-de-git-y-github)
   - [Errores y Soluciones](#4-errores-encontrados-y-soluciones)
   - [Verificacion Backend](#5-verificacion-completa-del-backend)

---

## Sesion 1 - 26 de Noviembre de 2025

### 1. Analisis Inicial del Proyecto

Comence analizando toda la documentacion existente en el repositorio. El proyecto estaba al **0% de implementacion** - solo existia documentacion y estructura de carpetas vacias.

**Documentos revisados:**
- PROJECT_SETUP.md
- BACKEND_DEVELOPMENT_GUIDE.md
- FRONTEND_DEVELOPMENT_GUIDE.md
- DATABASE_SCHEMAS.md
- KEYCLOAK_CONFIG.md
- KRAKEND_CONFIG.md

**Conclusion del analisis:** El proyecto tenia una planificacion muy detallada pero ningun codigo implementado.

---

### 2. Scaffolding Completo del Proyecto

Cree toda la estructura del proyecto desde cero:

**Backend (Java 21 + Spring Boot 3.2.0):**

| Microservicio | Puerto | Base de Datos | Descripcion |
|---------------|--------|---------------|-------------|
| users-service | 8082 | postgres-users:5433 | Gestion de usuarios |
| spaces-service | 8083 | postgres-spaces:5434 | Gestion de espacios |
| bookings-service | 8084 | postgres-bookings:5435 | Gestion de reservas |

Cada microservicio incluye:
- Entidades JPA con validaciones
- Repositorios con JpaSpecificationExecutor
- Servicios con logica de negocio
- Controladores REST
- DTOs de entrada/salida
- Configuracion de seguridad OAuth2/JWT
- Migraciones Flyway
- GlobalExceptionHandler

**Frontend (Next.js 15 + React 19):**
- Estructura de paginas con App Router
- Componentes base
- Configuracion de Tailwind CSS
- Configuracion de Bun como package manager

**Infraestructura:**
- docker-compose.yml con todos los servicios
- Configuracion de Keycloak (realm-export.json)
- Configuracion de KrakenD (krakend.json)
- Scripts de inicializacion de bases de datos

---

### 3. Configuracion de Git y GitHub

**Repositorio:** https://github.com/amolrod/balconazo

**Push inicial:** 93 archivos subidos

**Ramas creadas:**
- `main` - Rama de produccion
- `develop` - Rama de integracion
- `feature/backend-setup` - Trabajo en backend
- `feature/frontend-setup` - Trabajo en frontend

---

### 4. Errores Encontrados y Soluciones

Durante el desarrollo del backend se encontraron y solucionaron los siguientes errores:

---

#### Error 1: Flyway - Version no especificada

**Error:**
```
Cannot find artifact 'org.flywaydb:flyway-database-postgresql:jar:${flyway.version}'
```

**Causa:** Faltaba la propiedad `flyway.version` en los archivos `pom.xml`.

**Solucion:** Anadido la propiedad en los 3 microservicios:
```xml
<properties>
    <java.version>21</java.version>
    <flyway.version>10.0.0</flyway.version>
</properties>
```

**Archivos modificados:**
- `backend/users-service/pom.xml`
- `backend/spaces-service/pom.xml`
- `backend/bookings-service/pom.xml`

---

#### Error 2: SpaceRepository - funcion lower(bytea)

**Error:**
```
ERROR: function lower(bytea) does not exist
Hint: No function matches the given name and argument types.
```

**Causa:** La consulta JPQL con parametros NULL en Hibernate 6+ causaba problemas de tipado. Al pasar NULL, Hibernate no podia inferir el tipo y PostgreSQL intentaba aplicar `lower()` a bytea.

**Consulta problematica:**
```java
@Query("SELECT s FROM Space s WHERE s.active = true " +
       "AND (:city IS NULL OR LOWER(s.city) LIKE LOWER(CONCAT('%', :city, '%')))")
Page<Space> findWithFilters(@Param("city") String city, ...);
```

**Solucion:** Crear una nueva clase `SpaceSpecification.java` usando el patron Specification de JPA:

```java
public class SpaceSpecification {
    public static Specification<Space> withFilters(SpaceFilter filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.isTrue(root.get("active")));
            
            if (filter.getCity() != null && !filter.getCity().isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("city")), 
                    "%" + filter.getCity().toLowerCase() + "%"));
            }
            // ... mas filtros
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
```

**Archivos creados/modificados:**
- `backend/spaces-service/src/main/java/com/balconazo/spaces/repository/SpaceSpecification.java` (nuevo)
- `backend/spaces-service/src/main/java/com/balconazo/spaces/repository/SpaceRepository.java` (extender JpaSpecificationExecutor)
- `backend/spaces-service/src/main/java/com/balconazo/spaces/service/SpaceService.java` (usar Specification)

---

#### Error 3: Keycloak - HTTPS Required

**Error:**
```json
{"error": "invalid_request", "error_description": "HTTPS required"}
```

**Causa:** Keycloak por defecto requiere HTTPS para los endpoints de autenticacion en produccion.

**Solucion:** 

1. Modificar `realm-export.json`:
```json
"sslRequired": "none"
```

2. Ejecutar comandos en el contenedor de Keycloak:
```bash
docker exec balconazoapp-keycloak /opt/keycloak/bin/kcadm.sh config credentials \
  --server http://localhost:8080 --realm master --user admin --password admin

docker exec balconazoapp-keycloak /opt/keycloak/bin/kcadm.sh update realms/master \
  -s sslRequired=NONE

docker exec balconazoapp-keycloak /opt/keycloak/bin/kcadm.sh update realms/balconazo \
  -s sslRequired=NONE
```

---

#### Error 4: JWT Issuer Mismatch

**Error:**
```
The iss claim is not valid
Failed to authenticate since the JWT was invalid
```

**Causa:** El token JWT se generaba con issuer `http://localhost:8081/realms/balconazo` pero los microservicios dentro de Docker esperaban `http://keycloak:8080/realms/balconazo`.

**Explicacion:** Hay dos contextos de red:
- Host (tu maquina): accede a Keycloak en localhost:8081
- Docker network: los servicios acceden a Keycloak en keycloak:8080

**Solucion:** Configurar los microservicios para validar un issuer pero obtener las claves de otro:

```yaml
# docker-compose.yml
environment:
  # El issuer que viene en el token (generado desde localhost)
  SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_ISSUER_URI: http://localhost:8081/realms/balconazo
  # Donde obtener las claves JWK (dentro de Docker network)
  SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_JWK_SET_URI: http://keycloak:8080/realms/balconazo/protocol/openid-connect/certs
```

---

#### Error 5: Duplicate Key - Email unico

**Error:**
```
ERROR: duplicate key value violates unique constraint "users_email_key"
Detail: Key (email)=(unknown@balconazo.local) already exists.
```

**Causa:** Cuando el token JWT no incluia email, el sistema usaba un email por defecto (`unknown@balconazo.local`) para todos los usuarios nuevos, causando conflictos de unicidad.

**Solucion:** Modificar `UserService.java` para usar el `keycloakId` como parte del email cuando no hay email en el token:

```java
// Antes
String userEmail = email != null ? email : "unknown@balconazo.local";

// Despues
String userEmail = email != null ? email : keycloakId + "@balconazo.local";
```

---

#### Error 6: KrakenD - Invalid Health Endpoint

**Error:**
```
ERROR parsing the configuration file: ignoring the 'GET /__health' endpoint, since it is invalid!!!
```

**Causa:** El endpoint `/__health` estaba mal configurado, apuntando a si mismo como backend.

**Solucion:** Eliminar el endpoint personalizado de health y usar la configuracion nativa de KrakenD:

```json
{
  "extra_config": {
    "router": {
      "health_path": "/__health"
    }
  }
}
```

---

#### Error 7: JWT Roles No Extraidos (Granted Authorities=[])

**Error:**
```
Set SecurityContextHolder to JwtAuthenticationToken [..., Granted Authorities=[]]
```

Las peticiones POST a `/api/spaces` fallaban con 403/500 porque los roles no se extraian del token JWT.

**Causa:** El `JwtGrantedAuthoritiesConverter` de Spring Security NO soporta claims anidados como `realm_access.roles` de Keycloak. Al usar `.setAuthoritiesClaimName("realm_access.roles")` buscaba un claim llamado literalmente "realm_access.roles" en lugar de navegar el objeto anidado.

**Estructura del token JWT de Keycloak:**
```json
{
  "realm_access": {
    "roles": ["ROLE_USER", "ROLE_HOST"]
  }
}
```

**Solucion:** Crear un converter personalizado `KeycloakRealmRoleConverter` en los 3 microservicios:

```java
static class KeycloakRealmRoleConverter implements Converter<Jwt, Collection<GrantedAuthority>> {
    @Override
    @SuppressWarnings("unchecked")
    public Collection<GrantedAuthority> convert(Jwt jwt) {
        Map<String, Object> realmAccess = jwt.getClaim("realm_access");
        if (realmAccess == null || realmAccess.isEmpty()) {
            return Collections.emptyList();
        }
        
        List<String> roles = (List<String>) realmAccess.get("roles");
        if (roles == null) {
            return Collections.emptyList();
        }
        
        return roles.stream()
            .map(SimpleGrantedAuthority::new)
            .collect(Collectors.toList());
    }
}
```

**Archivos modificados:**
- `backend/users-service/src/main/java/com/balconazo/users/config/SecurityConfig.java`
- `backend/spaces-service/src/main/java/com/balconazo/spaces/config/SecurityConfig.java`
- `backend/bookings-service/src/main/java/com/balconazo/bookings/config/SecurityConfig.java`

---

#### Error 8: AccessDeniedException devuelve 500

**Error:**
```
HTTP 500 Internal Server Error
```

Cuando Spring Security rechazaba una peticion por falta de permisos, devolvia 500 en lugar de 403.

**Causa:** El `GlobalExceptionHandler` no manejaba `AccessDeniedException`, por lo que caia en el handler generico de `Exception` que devuelve 500.

**Solucion:** Anadir handler especifico para `AccessDeniedException` en los 3 microservicios:

```java
@ExceptionHandler(AccessDeniedException.class)
public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex) {
    ErrorResponse error = ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.FORBIDDEN.value())
            .error("Forbidden")
            .message("No tienes permisos para realizar esta accion")
            .build();

    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
}
```

**Archivos modificados:**
- `backend/users-service/src/main/java/com/balconazo/users/exception/GlobalExceptionHandler.java`
- `backend/spaces-service/src/main/java/com/balconazo/spaces/exception/GlobalExceptionHandler.java`
- `backend/bookings-service/src/main/java/com/balconazo/bookings/exception/GlobalExceptionHandler.java`

---

#### Error 9: KrakenD roles_key no soporta claims anidados

**Error:**
```
HTTP 403 Forbidden (desde KrakenD)
```

KrakenD rechazaba peticiones de usuarios con roles validos.

**Causa:** La configuracion de KrakenD:
```json
{
  "roles_key": "realm_access.roles",
  "roles": ["ROLE_HOST"]
}
```

No funciona porque `roles_key` no soporta navegacion de objetos anidados. KrakenD buscaba un claim de primer nivel llamado literalmente "realm_access.roles".

**Solucion:** Eliminar la validacion de roles de KrakenD y delegarla completamente a Spring Security:

```bash
cat gateway/krakend.json | jq 'del(.endpoints[].extra_config["auth/validator"].roles_key, .endpoints[].extra_config["auth/validator"].roles)' > krakend_fixed.json
```

KrakenD ahora solo valida:
- Que el JWT sea valido (firma RS256)
- Que no haya expirado

Spring Security maneja:
- Validacion de roles (@PreAuthorize)
- Control de acceso por propietario

---

### 5. Verificacion Completa del Backend

#### Configuracion de Usuarios de Prueba

Las contrasenas no se importaban correctamente desde el `realm-export.json`, asi que se configuraron manualmente:

```bash
docker exec balconazoapp-keycloak /opt/keycloak/bin/kcadm.sh set-password \
  -r balconazo --username user_guest --new-password guest123

docker exec balconazoapp-keycloak /opt/keycloak/bin/kcadm.sh set-password \
  -r balconazo --username host_demo --new-password host123

docker exec balconazoapp-keycloak /opt/keycloak/bin/kcadm.sh set-password \
  -r balconazo --username admin_host --new-password admin123
```

#### Script de Test Automatizado

Se creo `test-backend.sh` con 23 tests automatizados:

```bash
./test-backend.sh
```

#### Resultados de Tests

```
===========================================
     TEST COMPLETO BACKEND BALCONAZO
===========================================

Obteniendo tokens de autenticacion...
Tokens obtenidos correctamente

===========================================
          1. USERS-SERVICE
===========================================
[PASS] GET /api/users/me (guest) (HTTP 200)
[PASS] GET /api/users/me (host) (HTTP 200)
[PASS] GET /api/users/me (admin) (HTTP 200)
[PASS] GET /api/users/me (sin token - debe fallar) (HTTP 401)
[PASS] PUT /api/users/me (actualizar perfil) (HTTP 200)

===========================================
          2. SPACES-SERVICE
===========================================
[PASS] GET /api/spaces (publico - listar) (HTTP 200)
[PASS] GET /api/spaces?city=Barcelona (filtro) (HTTP 200)
[PASS] GET /api/spaces?spaceType=TERRACE (filtro) (HTTP 200)
[PASS] POST /api/spaces (host - crear espacio) (HTTP 200)
[PASS] POST /api/spaces (guest - Spring devuelve 403 Forbidden)
[PASS] GET /api/spaces/{id} (publico) (HTTP 200)
[PASS] PUT /api/spaces/{id} (owner) (HTTP 200)
[PASS] GET /api/spaces/my (mis espacios) (HTTP 200)

===========================================
          3. BOOKINGS-SERVICE
===========================================
[PASS] POST /api/bookings (guest - crear reserva) (HTTP 200)
[PASS] GET /api/bookings/{id} (guest) (HTTP 200)
[PASS] GET /api/bookings/me (mis reservas) (HTTP 200)
[PASS] GET /api/bookings/host (reservas de mis espacios) (HTTP 200)
[PASS] PUT /api/bookings/{id}/cancel (HTTP 200)
[PASS] GET /api/bookings/me (sin token) (HTTP 401)

===========================================
          4. HEALTH CHECKS
===========================================
[PASS] users-service health: UP
[PASS] spaces-service health: UP
[PASS] bookings-service health: UP
[PASS] KrakenD health: ok

===========================================
              RESUMEN
===========================================
Tests pasados: 23
Tests fallidos: 0
Porcentaje de exito: 100%
===========================================
BACKEND 100% FUNCIONAL - LISTO PARA FRONTEND
```

---

### 6. Resumen de la Sesion 1

| Tarea | Estado |
|-------|--------|
| Analisis de documentacion | Completado |
| Scaffolding completo | Completado |
| Configuracion Git/GitHub | Completado |
| Migracion a Bun | Completado |
| Backend funcional | Completado |
| Autenticacion JWT | Completado |
| Gateway KrakenD | Completado |
| Tests automatizados | Completado |
| Documentacion API | Completado |

**Errores solucionados:** 9

**Tiempo aproximado:** ~4 horas

---

### 7. Estado del Proyecto

| Modulo | Porcentaje |
|--------|------------|
| Backend (microservicios) | 100% |
| Autenticacion (Keycloak) | 100% |
| API Gateway (KrakenD) | 100% |
| Tests Backend | 100% |
| Frontend | 0% |
| Despliegue Cloud | 0% |
| **TOTAL** | **45%** |

---

### 8. Proximos Pasos

1. **Frontend Next.js**
   - Implementar paginas principales
   - Integracion con API
   - Autenticacion OAuth2

2. **Mejoras Backend**
   - Subida de imagenes
   - Sistema de notificaciones
   - Sistema de valoraciones

3. **DevOps**
   - CI/CD con GitHub Actions
   - Despliegue en AWS/GCP

---

### 9. Commits Realizados

```
feat(backend): Scaffolding completo de microservicios
fix: Flyway version property en pom.xml
fix: SpaceSpecification para filtros con NULL
fix: Keycloak SSL required deshabilitado
fix: JWT issuer mismatch entre localhost y docker
fix: Email unico usando keycloakId
fix: KrakenD health endpoint
fix: Custom KeycloakRealmRoleConverter para roles JWT
fix: AccessDeniedException handler (403)
fix: KrakenD sin validacion de roles
feat: Test completo backend + script automatizado
docs: Documentacion API completa
```

---

*Ultima actualizacion: 26 de Noviembre de 2025*
