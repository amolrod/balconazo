# 📓 Diario de Desarrollo - TFG BalconazoApp

**Proyecto:** BalconazoApp - Marketplace de alquiler de espacios por horas  
**Autor:** Ángel Molina Rodríguez  
**Repositorio:** [github.com/amolrod/balconazo](https://github.com/amolrod/balconazo)

---

## Sesión 1 - 26 de Noviembre de 2025

### 1. Análisis Inicial del Proyecto

Comencé analizando toda la documentación existente en el repositorio. El proyecto estaba al **0% de implementación** - solo existía documentación y estructura de carpetas vacías.

**Documentos revisados:**
- PROJECT_SETUP.md
- BACKEND_DEVELOPMENT_GUIDE.md
- FRONTEND_DEVELOPMENT_GUIDE.md
- DATABASE_SCHEMAS.md
- KEYCLOAK_CONFIG.md
- KRAKEND_CONFIG.md

**Conclusión del análisis:** El proyecto tenía una planificación muy detallada pero ningún código implementado.

---

### 2. Scaffolding Completo del Proyecto

Creé toda la estructura del proyecto desde cero:

**Backend (Java 21 + Spring Boot 3.2.0):**
- `users-service` - Gestión de usuarios
- `spaces-service` - Gestión de espacios
- `bookings-service` - Gestión de reservas

Cada microservicio incluye:
- Entidades JPA
- Repositorios
- Servicios
- Controladores REST
- DTOs
- Configuración de seguridad OAuth2
- Migraciones Flyway

**Frontend (Next.js 15 + React 19):**
- Estructura de páginas
- Componentes base
- Configuración de Tailwind CSS

**Infraestructura:**
- `docker-compose.yml` con todos los servicios
- Configuración de Keycloak (`realm-export.json`)
- Configuración de KrakenD (`krakend.json`)

---

### 3. Configuración de Git y GitHub

**Repositorio:** https://github.com/amolrod/balconazo

**Push inicial:** 93 archivos subidos

**Ramas creadas:**
- `main` - Rama de producción
- `develop` - Rama de integración
- `feature/backend-setup` - Trabajo en backend
- `feature/frontend-setup` - Trabajo en frontend

---

### 4. Decisión: Bun vs npm

Se evaluó usar Bun en lugar de npm para el frontend por sus ventajas:
- Velocidad de instalación ~10x más rápida
- Runtime más eficiente
- Compatible con npm

**Cambios realizados:**
- Actualizado `package.json` con scripts de Bun
- Actualizado `Dockerfile` del frontend
- Actualizado workflow de CI/CD

---

### 5. Levantamiento del Backend

#### 5.1 Creación del archivo .env

Copié `.env.example` a `.env` con las variables de entorno necesarias.

#### 5.2 Inicio de las bases de datos

```bash
docker-compose up -d postgres-users postgres-spaces postgres-bookings
```

Las 3 instancias de PostgreSQL iniciaron correctamente en puertos 5433, 5434 y 5435.

#### 5.3 Inicio de Keycloak

```bash
docker-compose up -d keycloak
```

Keycloak inició en el puerto 8081.

---

### 6. Errores Encontrados y Soluciones

#### ❌ Error 1: Flyway - Versión no especificada

**Error:**
```
Cannot find artifact 'org.flywaydb:flyway-database-postgresql:jar:${flyway.version}'
```

**Causa:** Faltaba la propiedad `flyway.version` en los archivos `pom.xml`.

**Solución:** Añadí la propiedad en los 3 microservicios:
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

#### ❌ Error 2: SpaceRepository - función lower(bytea)

**Error:**
```
ERROR: function lower(bytea) does not exist
Hint: No function matches the given name and argument types.
```

**Causa:** La consulta JPQL con parámetros NULL en Hibernate 6+ causaba problemas de tipado.

**Consulta problemática:**
```java
@Query("SELECT s FROM Space s WHERE s.active = true " +
       "AND (:city IS NULL OR LOWER(s.city) LIKE LOWER(CONCAT('%', :city, '%')))")
Page<Space> findWithFilters(@Param("city") String city, ...);
```

**Solución:** Creé una nueva clase `SpaceSpecification.java` usando el patrón Specification de JPA:

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
            // ... más filtros
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
```

**Archivos creados/modificados:**
- `backend/spaces-service/src/main/java/com/balconazo/spaces/repository/SpaceSpecification.java` (nuevo)
- `backend/spaces-service/src/main/java/com/balconazo/spaces/service/SpaceService.java` (modificado)

---

#### ❌ Error 3: Keycloak - HTTPS Required

**Error:**
```json
{"error": "invalid_request", "error_description": "HTTPS required"}
```

**Causa:** Keycloak por defecto requiere HTTPS para los endpoints de autenticación.

**Solución:** 
1. Modifiqué `realm-export.json`:
```json
"sslRequired": "none"
```

2. Ejecuté comandos en el contenedor de Keycloak:
```bash
docker exec balconazoapp-keycloak /opt/keycloak/bin/kcadm.sh config credentials \
  --server http://localhost:8080 --realm master --user admin --password admin

docker exec balconazoapp-keycloak /opt/keycloak/bin/kcadm.sh update realms/master \
  -s sslRequired=NONE

docker exec balconazoapp-keycloak /opt/keycloak/bin/kcadm.sh update realms/balconazo \
  -s sslRequired=NONE
```

---

#### ❌ Error 4: JWT Issuer Mismatch

**Error:**
```
The iss claim is not valid
Failed to authenticate since the JWT was invalid
```

**Causa:** El token JWT se generaba con issuer `http://localhost:8081/realms/balconazo` pero los microservicios dentro de Docker esperaban `http://keycloak:8080/realms/balconazo`.

**Solución:** Configuré los microservicios para:
- Validar el issuer como `http://localhost:8081/realms/balconazo`
- Obtener las claves JWK desde `http://keycloak:8080/realms/balconazo/protocol/openid-connect/certs`

**Cambios en docker-compose.yml:**
```yaml
environment:
  SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_ISSUER_URI: http://localhost:8081/realms/balconazo
  SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_JWK_SET_URI: http://keycloak:8080/realms/balconazo/protocol/openid-connect/certs
```

---

#### ❌ Error 5: Duplicate Key - Email único

**Error:**
```
ERROR: duplicate key value violates unique constraint "users_email_key"
Detail: Key (email)=(unknown@balconazo.local) already exists.
```

**Causa:** Cuando el token JWT no incluía email, el sistema usaba un email por defecto (`unknown@balconazo.local`) para todos los usuarios nuevos.

**Solución:** Modifiqué `UserService.java` para usar el `keycloakId` como parte del email cuando no hay email en el token:

```java
// Antes
String userEmail = email != null ? email : "unknown@balconazo.local";

// Después
String userEmail = email != null ? email : keycloakId + "@balconazo.local";
```

---

#### ❌ Error 6: KrakenD - Invalid Health Endpoint

**Error:**
```
ERROR parsing the configuration file: ignoring the 'GET /__health' endpoint, since it is invalid!!!
```

**Causa:** El endpoint `/__health` estaba mal configurado, apuntando a sí mismo como backend.

**Solución:** Eliminé el endpoint personalizado de health y dejé que KrakenD use su endpoint interno.

---

### 7. Configuración de Usuarios de Prueba

Las contraseñas no se importaban correctamente desde el `realm-export.json`, así que las configuré manualmente:

```bash
docker exec balconazoapp-keycloak /opt/keycloak/bin/kcadm.sh set-password \
  -r balconazo --username user_guest --new-password guest123

docker exec balconazoapp-keycloak /opt/keycloak/bin/kcadm.sh set-password \
  -r balconazo --username host_demo --new-password host123

docker exec balconazoapp-keycloak /opt/keycloak/bin/kcadm.sh set-password \
  -r balconazo --username admin_host --new-password admin123
```

---

### 8. Verificación Final

**Health Checks:**
```bash
curl http://localhost:8082/actuator/health  # users-service: UP
curl http://localhost:8083/actuator/health  # spaces-service: UP
curl http://localhost:8084/actuator/health  # bookings-service: UP
curl http://localhost:8080/__health         # krakend: ok
```

**Test de Autenticación Completo:**
```bash
# 1. Obtener token
ACCESS_TOKEN=$(curl -s -X POST "http://localhost:8081/realms/balconazo/protocol/openid-connect/token" \
  -d "client_id=balconazo-frontend" \
  -d "grant_type=password" \
  -d "username=user_guest" \
  -d "password=guest123" | jq -r '.access_token')

# 2. Llamar endpoint protegido
curl -H "Authorization: Bearer $ACCESS_TOKEN" http://localhost:8080/api/users/me
```

**Respuesta exitosa:**
```json
{
  "id": "467e606d-da42-4fff-98ac-db0a02759502",
  "email": "f0868e72-2006-4074-a665-f089dc9d7e17@balconazo.local",
  "fullName": "Usuario Nuevo",
  "roles": ["ROLE_USER"]
}
```

---

### 9. Commit y Push

```bash
git add -A
git commit -m "feat(backend): Backend completamente funcional con autenticación JWT"
git push origin feature/backend-setup
```

---

## Resumen de la Sesión 1

| Tarea | Estado |
|-------|--------|
| Análisis de documentación | ✅ |
| Scaffolding completo | ✅ |
| Configuración Git/GitHub | ✅ |
| Migración a Bun | ✅ |
| Backend funcional | ✅ |
| Autenticación JWT | ✅ |
| Gateway KrakenD | ✅ |
| Documentación | ✅ |

**Tiempo aproximado:** ~3 horas

**Próximos pasos:**
- Añadir datos de prueba (seed data)
- Implementar tests
- Desarrollar frontend

---

*Última actualización: 26 de Noviembre de 2025*
