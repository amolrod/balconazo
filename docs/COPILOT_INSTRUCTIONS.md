# **COPILOT_INSTRUCTIONS.md**

Instrucciones para asistentes de IA (Copilot, ChatGPT, etc.) – BalconazoApp

---

## **Índice**

1. [Contexto del proyecto](#1-contexto-del-proyecto)

2. [Arquitectura y tech stack](#2-arquitectura-y-tech-stack)

3. [Convenciones de código](#3-convenciones-de-código)

4. [Patrones arquitectónicos a seguir](#4-patrones-arquitectónicos-a-seguir)

5. [Reglas de negocio clave](#5-reglas-de-negocio-clave)

6. [Qué NO hacer (anti-patterns)](#6-qué-no-hacer-anti-patterns)

7. [Templates de código](#7-templates-de-código)

8. [Comandos frecuentes](#8-comandos-frecuentes)

9. [Errores típicos de IA y cómo evitarlos](#9-errores-típicos-de-ia-y-cómo-evitarlos)

---

## **1. Contexto del proyecto**

BalconazoApp es un **marketplace de alquiler de espacios por horas**:

* Anfitriones publican **espacios** (terrazas, balcones, salones).

* Usuarios hacen **reservas** de espacios para una franja horaria.

* Hay 3 microservicios backend, un frontend Next.js, un API Gateway KrakenD y Keycloak como IdP.

---

## **2. Arquitectura y tech stack**

* Backend:

  * Java 21 + Spring Boot 3.x

  * Spring Web, Data JPA, Security (OAuth2 Resource Server)

  * PostgreSQL + Flyway

* Frontend:

  * Next.js 15 + React 19

  * TypeScript

* Infra:

  * Docker + Docker Compose

  * Keycloak, KrakenD

Asumir siempre el patrón **database-per-service** y comunicación vía **HTTP/JSON**.

---

## **3. Convenciones de código**

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

## **4. Patrones arquitectónicos a seguir**

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

## **5. Reglas de negocio clave**

* No se pueden crear reservas solapadas para un mismo espacio y franja horaria.

* Solo usuarios con rol `ROLE_HOST` pueden publicar espacios.

* Solo el propietario de una reserva o el anfitrión pueden cancelarla (según lógica).

* Las reservas deben tener `startTime < endTime`.

Cuando implementes o modifiques código relacionado con reservas, **considera siempre estas reglas**.

---

## **6. Qué NO hacer (anti-patterns)**

* ❌ No acceder nunca a las bases de datos de otros microservicios directamente.

* ❌ No incorporar lógica de negocio compleja en el frontend; debe residir en el backend.

* ❌ No hardcodear URLs de producción en el código; usar variables de entorno.

* ❌ No exponer secretos (`client_secret`, contraseñas de BD) en el código fuente.

* ❌ No ignorar el manejo de errores; siempre propaga un error claro al frontend.

---

## **7. Templates de código**

### **7.1 Controller Spring (template)**

```java
@RestController
@RequestMapping("/spaces")
@RequiredArgsConstructor
public class SpaceController {

    private final SpaceService spaceService;

    @GetMapping
    public Page<SpaceSummaryDto> listSpaces(SpaceFilter filter, Pageable pageable) {
        return spaceService.listSpaces(filter, pageable);
    }

    @PostMapping
    @PreAuthorize("hasRole('HOST')")
    public ResponseEntity<SpaceDetailDto> createSpace(
            @Valid @RequestBody CreateSpaceRequestDto request,
            @AuthenticationPrincipal Jwt jwt
    ) {
        UUID hostId = UUID.fromString(jwt.getSubject());
        SpaceDetailDto created = spaceService.createSpace(request, hostId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
```

### **7.2 Entity + Repository (template)**

```java
@Entity
@Table(name = "spaces")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SpaceEntity {

    @Id
    private UUID id;

    @Column(nullable = false)
    private UUID hostId;

    @Column(nullable = false)
    private String title;

    // ...
}

public interface SpaceRepository extends JpaRepository<SpaceEntity, UUID> {
    Page<SpaceEntity> findByCityAndActiveIsTrue(String city, Pageable pageable);
}
```

### **7.3 Componente React (template)**

```typescript
type SpaceCardProps = {
  id: string;
  title: string;
  city: string;
  pricePerHour: number;
};

export function SpaceCard({ id, title, city, pricePerHour }: SpaceCardProps) {
  return (
    <article className="rounded-lg shadow p-4">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-gray-500">{city}</p>
      <p className="mt-2 font-bold">{pricePerHour} €/hora</p>
    </article>
  );
}
```

---

## **8. Comandos frecuentes**

Ejecutar tests backend

```bash
mvn test
```

Ejecutar microservicio en local

```bash
mvn spring-boot:run
```

Levantar la infraestructura Docker completa

```bash
docker compose up -d --build
```

Arrancar frontend en modo desarrollo

```bash
npm run dev
```

---

## **9. Errores típicos de IA y cómo evitarlos**

1. **Usar rutas de API incorrectas**

   * Evita inventar rutas; consulta siempre `API_DOCUMENTATION.md`.

2. **Ignorar validaciones**

   * Añade anotaciones de validación en DTOs y maneja errores con respuestas 400.

3. **Mezclar lógica de negocio en controladores**

   * Mantén los controladores finos y delega en servicios.

4. **Romper la configuración de Docker**

   * No modifiques `docker-compose.yml` ni `.env` sin instrucciones explícitas del usuario.

5. **No tener en cuenta roles y permisos**

   * Antes de crear/modificar un endpoint, pregúntate: “¿Qué rol necesita esto?”.

Si tienes dudas sobre cómo proceder, **prefiere generar código que siga los patrones descritos aquí aunque sea un poco más verboso**, en lugar de inventar atajos peligrosos.
