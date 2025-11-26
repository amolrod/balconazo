# **TESTING_GUIDE.md**

Guía de testing – BalconazoApp

---

## **Índice**

1. [Estrategia general de testing](#1-estrategia-general-de-testing)

2. [Herramientas de testing](#2-herramientas-de-testing)

3. [Tests unitarios de backend](#3-tests-unitarios-de-backend)

4. [Tests de integración de backend](#4-tests-de-integración-de-backend)

5. [Tests de frontend](#5-tests-de-frontend)

6. [Tests E2E](#6-tests-e2e)

7. [Cobertura](#7-cobertura)

8. [Mocking y buenas prácticas](#8-mocking-y-buenas-prácticas)

9. [Troubleshooting de tests](#9-troubleshooting-de-tests)

---

## **1. Estrategia general de testing**

Se sigue la **pirámide de testing**:

* Base: tests **unitarios** (rápidos, muchos).

* Centro: tests de **integración** (servicio + DB, Keycloak simulado).

* Cima: tests **end-to-end** (flujo completo UI + API + DB).

---

## **2. Herramientas de testing**

* Backend:

  * **JUnit 5**, **Spring Boot Test**, **Mockito**.

  * **Testcontainers** (PostgreSQL).

  * **REST Assured** (opcional, para test de APIs).

* Frontend:

  * **Jest**.

  * **React Testing Library**.

  * **Playwright** o **Cypress** para E2E.

---

## **3. Tests unitarios de backend**

### **Ejemplo: `UserServiceTest`**

```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void getCurrentUser_throwsIfNotFound() {
        String keycloakId = "kc-123";
        when(userRepository.findByKeycloakId(keycloakId)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class,
                () -> userService.getCurrentUser(keycloakId));
    }
}
```

Principios:

* Un test = un comportamiento específico.

* No tocar red, DB ni Keycloak en tests unitarios.

---

## **4. Tests de integración de backend**

### **Ejemplo: test de repositorio con Testcontainers**

```java
@Testcontainers
@SpringBootTest
class BookingRepositoryIT {

    @Container
    static PostgreSQLContainer<?> postgres =
            new PostgreSQLContainer<>("postgres:16-alpine")
                    .withDatabaseName("bookings_test")
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
```

Principios:

* Arrancar solo el contenedor necesario (Postgres).

* Usar migraciones Flyway reales.

---

## **5. Tests de frontend**

### **Tests unitarios**

Usar Jest + React Testing Library:

```typescript
// tests/components/Header.test.tsx
import { render, screen } from "@testing-library/react";
import Header from "@/components/Header";

test("muestra el nombre de la app", () => {
  render(<Header />);
  expect(screen.getByText(/BalconazoApp/i)).toBeInTheDocument();
});
```

### **Tests de integración (componentes + hooks)**

* Probar componentes que hacen llamadas a la API usando **mocks** de `axios` o `fetch`.

---

## **6. Tests E2E**

Con Playwright o Cypress:

* Flujo completo:

  1. Usuario visita la home.

  2. Hace login (puede usarse un usuario de test en Keycloak).

  3. Busca un espacio.

  4. Realiza una reserva.

  5. Comprueba que la reserva aparece en “Mis reservas”.

Es recomendable tener un **entorno de E2E** aislado, con una base de datos preseeded.

---

## **7. Cobertura**

Backend:

Generar informe de cobertura con JaCoCo

```bash
mvn clean test
```

El informe suele generarse en `target/site/jacoco/index.html`.

Frontend:

Generar cobertura con Jest

```bash
npm test -- --coverage
```

Objetivo orientativo:

* **Backend**: 70–80 % de cobertura en lógica de negocio.

* **Frontend**: 60–70 % en componentes y lógica crítica.

---

## **8. Mocking y buenas prácticas**

* Mockear solo **dependencias externas** o lentas (DB, red, Keycloak).

* No mockear la clase que se está testeando.

* Usar `@MockBean` en tests Spring para reemplazar beans concretos.

Ejemplo:

```java
@SpringBootTest
class BookingControllerIT {

    @MockBean
    private PriceCalculator priceCalculator;

    // ...
}
```

---

## **9. Troubleshooting de tests**

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
