# **BACKEND_DEVELOPMENT_GUIDE.md**

Guía de desarrollo backend – Microservicios Spring Boot

---

## **Índice**

* [1. Introducción](#1-introducción)

* [2. Prerrequisitos](#2-prerrequisitos)

* [3. Estructura general del backend](#3-estructura-general-del-backend)

* [4. Creación de los proyectos base](#4-creación-de-los-proyectos-base)

  * [4.1 users-service](#41-users-service)

  * [4.2 spaces-service](#42-spaces-service)

  * [4.3 bookings-service](#43-bookings-service)

* [5. Configuración común (application.yml)](#5-configuración-común-applicationyml)

* [6. Implementación por capas](#6-implementación-por-capas)

  * [6.1 Model (entidades)](#61-model-entidades)

  * [6.2 Repository](#62-repository)

  * [6.3 Service (lógica de negocio)](#63-service-lógica-de-negocio)

  * [6.4 Controller (API REST)](#64-controller-api-rest)

* [7. Base de datos y migraciones](#7-base-de-datos-y-migraciones)

* [8. Testing (unitario e integración)](#8-testing-unitario-e-integración)

* [9. Comandos útiles](#9-comandos-útiles)

* [10. Troubleshooting](#10-troubleshooting)

---

## **1. Introducción**

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

## **2. Prerrequisitos**

* JDK 21 instalado y configurado.

* Maven ≥ 3.9.

* Docker/Docker Compose (para levantar las bases de datos).

* Variables del `.env` cargadas cuando uses `docker compose`.

---

## **3. Estructura general del backend**

Estructura recomendada de carpetas:

```
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
```

Convenciones:

* Paquete raíz: `com.balconazo.<service>`

Capas internas:

```
 controller/  
service/  
repository/  
model/     (entidades JPA)  
dto/       (objetos de entrada/salida)  
config/    (seguridad, configuración)
```

---

## **4. Creación de los proyectos base**

Puedes crear cada microservicio con **Spring Initializr** (web) o la CLI `spring`. A continuación se muestra una opción usando **Maven**.

### **Dependencias comunes para todos los servicios**

En todos los `pom.xml` añade (se muestra con users-service, los otros son análogos):

```xml
<dependencies>  
    <!-- Web REST -->  
    <dependency>  
        <groupId>org.springframework.boot</groupId>  
        <artifactId>spring-boot-starter-web</artifactId>  
    </dependency>

    <!-- Seguridad + JWT (Resource Server) -->  
    <dependency>  
        <groupId>org.springframework.boot</groupId>  
        <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>  
    </dependency>

    <!-- Data JPA + PostgreSQL -->  
    <dependency>  
        <groupId>org.springframework.boot</groupId>  
        <artifactId>spring-boot-starter-data-jpa</artifactId>  
    </dependency>  
    <dependency>  
        <groupId>org.postgresql</groupId>  
        <artifactId>postgresql</artifactId>  
        <scope>runtime</scope>  
    </dependency>

    <!-- Validación -->  
    <dependency>  
        <groupId>org.springframework.boot</groupId>  
        <artifactId>spring-boot-starter-validation</artifactId>  
    </dependency>

    <!-- Actuator -->  
    <dependency>  
        <groupId>org.springframework.boot</groupId>  
        <artifactId>spring-boot-starter-actuator</artifactId>  
    </dependency>

    <!-- Flyway para migraciones -->  
    <dependency>  
        <groupId>org.flywaydb</groupId>  
        <artifactId>flyway-core</artifactId>  
    </dependency>

    <!-- Tests -->  
    <dependency>  
        <groupId>org.springframework.boot</groupId>  
        <artifactId>spring-boot-starter-test</artifactId>  
        <scope>test</scope>  
    </dependency>  
</dependencies>
```

### **4.1 users-service**

Crear estructura Maven básica (si quieres usar `mvn archetype` – opcional)

```bash
cd backend  
mvn -B archetype:generate \
  -DgroupId=com.balconazo.users \
  -DartifactId=users-service \
  -DarchetypeArtifactId=maven-archetype-quickstart \
  -DinteractiveMode=false
```

Luego adapta la estructura a Spring Boot (o crea directamente el proyecto con Spring Initializr y cópialo dentro de `backend/users-service`).

### **4.2 spaces-service**

Mismo patrón, cambiando `groupId`:

```bash
cd backend  
mvn -B archetype:generate \
  -DgroupId=com.balconazo.spaces \
  -DartifactId=spaces-service \
  -DarchetypeArtifactId=maven-archetype-quickstart \
  -DinteractiveMode=false
```

### **4.3 bookings-service**

```bash
cd backend  
mvn -B archetype:generate \
  -DgroupId=com.balconazo.bookings \
  -DartifactId=bookings-service \
  -DarchetypeArtifactId=maven-archetype-quickstart \
  -DinteractiveMode=false
```

En la práctica, es más cómodo usar Spring Initializr (web o integración del IDE) para generar cada servicio con las dependencias anteriores seleccionadas.

---

## **5. Configuración común (application.yml)**

Ejemplo de `src/main/resources/application.yml` para `users-service`:

```yaml
server:  
  port: 8080

spring:  
  application:  
    name: users-service  
  datasource:  
    url: ${SPRING_DATASOURCE_URL}  
    username: ${SPRING_DATASOURCE_USERNAME}  
    password: ${SPRING_DATASOURCE_PASSWORD}  
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
          issuer-uri: ${JWT_ISSUER_URI}

management:  
  endpoints:  
    web:  
      exposure:  
        include: health,info  
  endpoint:  
    health:  
      probes:  
        enabled: true
```

Para `spaces-service` y `bookings-service` cambia:

* `spring.application.name`

* Las variables de datasource (en Docker se inyectan con el mismo nombre)

En local sin Docker puedes definir `SPRING_DATASOURCE_URL` directamente en `application-local.yml` y usar el perfil `local`.

---

## **6. Implementación por capas**

### **6.1 Model (entidades)**

**users-service – ejemplo de entidad User**

```java
package com.balconazo.users.model;

import jakarta.persistence.*;  
import java.time.Instant;  
import java.util.Set;  
import java.util.UUID;

@Entity  
@Table(name = "users")  
public class User {

    @Id  
    @Column(name = "id", nullable = false, updatable = false)  
    private UUID id;

    @Column(name = "email", nullable = false, unique = true, length = 255)  
    private String email;

    @Column(name = "name", nullable = false, length = 100)  
    private String name;

    @Column(name = "surname", nullable = false, length = 150)  
    private String surname;

    @Column(name = "keycloak_id", nullable = false, unique = true, length = 255)  
    private String keycloakId;

    @Column(name = "created_at", nullable = false)  
    private Instant createdAt;

    // getters, setters, constructores estáticos, etc.  
}
```

### **6.2 Repository**

```java
package com.balconazo.users.repository;

import com.balconazo.users.model.User;  
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;  
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    Optional<User> findByKeycloakId(String keycloakId);  
}
```

### **6.3 Service (lógica de negocio)**

```java
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
        this.userRepository = userRepository;  
        this.keycloakUserInfoProvider = keycloakUserInfoProvider;  
    }

    public User getOrCreateCurrentUser(String keycloakId) {  
        return userRepository.findByKeycloakId(keycloakId)  
                .orElseGet(() -> createUserFromKeycloak(keycloakId));  
    }

    private User createUserFromKeycloak(String keycloakId) {  
        var info = keycloakUserInfoProvider.loadUserInfo(keycloakId);

        User user = new User();  
        user.setId(UUID.randomUUID());  
        user.setEmail(info.email());  
        user.setName(info.givenName());  
        user.setSurname(info.familyName());  
        user.setKeycloakId(keycloakId);  
        user.setCreatedAt(Instant.now());

        return userRepository.save(user);  
    }  
}
```

`KeycloakUserInfoProvider` sería un componente que extrae información del token JWT o llama al endpoint de `userinfo`.

### **6.4 Controller (API REST)**

```java
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
        this.userService = userService;  
    }

    @GetMapping("/users/me")  
    public UserResponse me(@AuthenticationPrincipal Jwt jwt) {  
        String keycloakId = jwt.getSubject();  
        User user = userService.getOrCreateCurrentUser(keycloakId);  
        return UserResponse.from(user);  
    }  
}
```

**DTO de respuesta:**

```java
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
```

El mismo patrón se aplica en `spaces-service` y `bookings-service`, adaptando entidades y lógica.

---

## **7. Base de datos y migraciones**

Usamos **Flyway** para versionar la base de datos:

* Carpeta: `src/main/resources/db/migration`.

* Nomenclatura de ficheros: `V1__create_users_table.sql`, `V2__add_index_email.sql`, etc.

**Ejemplo `V1__create_users_table.sql` para users-service:**

```sql
CREATE TABLE IF NOT EXISTS users (  
    id UUID PRIMARY KEY,  
    email VARCHAR(255) NOT NULL UNIQUE,  
    name VARCHAR(100) NOT NULL,  
    surname VARCHAR(150) NOT NULL,  
    keycloak_id VARCHAR(255) NOT NULL UNIQUE,  
    created_at TIMESTAMP NOT NULL  
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
```

Flyway ejecutará automáticamente estas migraciones al inicio del microservicio.

---

## **8. Testing (unitario e integración)**

### **8.1 Dependencias para Testcontainers**

En el `pom.xml` (solo para tests):

```xml
<dependency>  
    <groupId>org.testcontainers</groupId>  
    <artifactId>postgresql</artifactId>  
    <scope>test</scope>  
</dependency>  
<dependency>  
    <groupId>org.testcontainers</groupId>  
    <artifactId>junit-jupiter</artifactId>  
    <scope>test</scope>  
</dependency>
```

### **8.2 Ejemplo de test de integración con Testcontainers**

```java
@SpringBootTest  
@Testcontainers  
class UserRepositoryIT {

    @Container  
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")  
            .withDatabaseName("users_test")  
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
        User user = new User();  
        user.setId(UUID.randomUUID());  
        user.setEmail("test@example.com");  
        user.setName("Test");  
        user.setSurname("User");  
        user.setKeycloakId("keycloak-test");  
        user.setCreatedAt(Instant.now());

        userRepository.save(user);

        Optional<User> found = userRepository.findByEmail("test@example.com");  
        assertTrue(found.isPresent());  
    }  
}
```

---

## **9. Comandos útiles**

**Ejecutar un microservicio en local (sin Docker)**

```bash
cd backend/users-service  
mvn spring-boot:run
```

**Ejecutar todos los tests del servicio**

```bash
mvn test
```

**Construir el JAR de producción**

```bash
mvn clean package
```

**Ejecutar el JAR (por ejemplo, para users-service)**

```bash
java -jar target/users-service-0.0.1-SNAPSHOT.jar
```

---

## **10. Troubleshooting**

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
