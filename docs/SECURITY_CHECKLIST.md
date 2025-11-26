# **SECURITY_CHECKLIST.md**

Checklist de seguridad – BalconazoApp

---

## **Índice**

1. [Objetivo](#1-objetivo)

2. [Autenticación y autorización](#2-autenticación-y-autorización)

3. [Validación de entradas](#3-validación-de-entradas)

4. [Gestión de secretos](#4-gestión-de-secretos)

5. [Comunicación segura](#5-comunicación-segura)

6. [Protecciones OWASP Top 10](#6-protecciones-owasp-top-10)

7. [Logging y auditoría](#7-logging-y-auditoría)

8. [Dependencias y actualizaciones](#8-dependencias-y-actualizaciones)

9. [Checklist rápida](#9-checklist-rápida)

---

## **1. Objetivo**

Garantizar que BalconazoApp cumple un mínimo de buenas prácticas de seguridad siguiendo las recomendaciones de **OWASP**.

---

## **2. Autenticación y autorización**

* Todo endpoint sensible requiere **JWT** válido.

* Los microservicios se configuran como **Resource Servers** (no gestionan credenciales directamente).

* Se usan roles (`ROLE_USER`, `ROLE_HOST`, `ROLE_ADMIN`) para limitar acciones.

* Solo `ROLE_HOST` puede crear/editar/eliminar espacios.

* Solo el usuario propietario puede consultar/modificar sus reservas (salvo admins).

---

## **3. Validación de entradas**

* Se validan todos los DTOs de entrada con anotaciones (`@NotNull`, `@Email`, `@Size`, etc.).

* No se confía en los datos de cliente (precio, IDs, fechas).

* Las fechas de reserva se validan (`start < end`) y rangos razonables.

---

## **4. Gestión de secretos**

* No se incluyen contraseñas ni tokens en el código fuente.

* `.env` no se sube a Git; solo `.env.example`.

* Las contraseñas de BD y las credenciales de Keycloak en producción son únicas y robustas.

* Se rotan los secretos periódicamente en entornos reales.

---

## **5. Comunicación segura**

* En producción, todo el tráfico externo pasa por **HTTPS**.

* No se exponen servicios internos directamente a Internet (Postgres, microservicios).

* El firewall limita puertos abiertos a los estrictamente necesarios (80/443).

---

## **6. Protecciones OWASP Top 10**

* **A01 – Broken Access Control**

  * Tests que comprueban que un usuario sin rol no puede acceder a endpoints restringidos.

* **A02 – Cryptographic Failures**

  * Tokens firmados con clave robusta (RS256).

  * Passwords gestionadas únicamente por Keycloak.

* **A03 – Injection**

  * Uso exclusivo de JPA y consultas parametrizadas (no concatenar SQL manualmente).

* **A05 – Security Misconfiguration**

  * Perfiles de Spring bien definidos (`dev`, `prod`).

  * Deshabilitados endpoints de Actuator que no se necesitan (o protegidos).

* **A07 – Identification and Authentication Failures**

  * Flujos de login/logout gestionados por Keycloak.

  * Configurado bloqueo/limitación de intentos de login en Keycloak (si se requiere).

* **A08 – Software and Data Integrity Failures**

  * Dependencias actualizadas sin vulnerabilidades críticas conocidas.

* **A09 – Security Logging and Monitoring Failures**

  * Logs de errores críticos y de accesos anómalos.

---

## **7. Logging y auditoría**

* No se loguean nunca contraseñas ni tokens completos.

* Se registra quién crea/edita espacios y reservas.

* Se almacena la IP de origen de una petición solo si es necesario y cumpliendo protección de datos.

---

## **8. Dependencias y actualizaciones**

* Revisar periódicamente dependencias con herramientas como `mvn versions:display-dependency-updates` o Snyk.

* Actualizar Spring Boot y librerías de seguridad con prioridad.

---

## **9. Checklist rápida**

Antes de desplegar:

* No hay credenciales por defecto (`admin/admin`) en Keycloak en producción.

* `.env` de producción contiene valores seguros y no se ha subido al repositorio.

* Los endpoints de Actuator están desactivados o protegidos por firewall o auth.

* Se ha probado un flujo completo de login → acción → logout en el entorno final.
