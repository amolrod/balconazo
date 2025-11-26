# **TROUBLESHOOTING.md**

Guía global de troubleshooting – BalconazoApp

---

## **Índice**

1. [Introducción](#1-introducción)

2. [Docker / Contenedores](#2-docker--contenedores)

3. [Keycloak / Autenticación](#3-keycloak--autenticación)

4. [Base de datos](#4-base-de-datos)

5. [CORS](#5-cors)

6. [API Gateway (KrakenD)](#6-api-gateway-krakend)

7. [Build / Compilación](#7-build--compilación)

8. [Dependencias](#8-dependencias)

9. [Networking](#9-networking)

Cada problema incluye: **síntoma → causa → solución → prevención**.

---

## **2. Docker / Contenedores**

### **Problema 1: `port is already allocated`**

* **Síntoma**: al hacer `docker compose up` aparece `Bind for 0.0.0.0:3000 failed`.

* **Causa**: ya hay un proceso usando ese puerto (otra app, contenedor viejo…).

* **Solución**:

Ver quién usa el puerto (Linux/mac):

```bash
 lsof -i :3000
```

*   
  * Parar ese proceso o cambiar el puerto en `.env`.

* **Prevención**:

  * Liberar puertos antes de levantar servicios.

  * Documentar los puertos usados por el proyecto.

---

### **Problema 2: contenedores reiniciándose en bucle**

* **Síntoma**: `docker compose ps` muestra `Restarting` en algún servicio.

* **Causa**: error en la configuración o fallo de arranque interno.

* **Solución**:

Ver logs del servicio:

```bash
 docker compose logs -f nombre-servicio
```

*   
  * Corregir el error (config, rutas, credenciales).

* **Prevención**:

  * Validar configs (JSON/YAML) antes de reconstruir.

---

### **Problema 3: cambios de código no se reflejan**

* **Síntoma**: tras modificar código Java/TS, el contenedor sigue ejecutando la versión antigua.

* **Causa**: imagen Docker no se ha reconstruido.

* **Solución**:

Reconstruir:

```bash
 docker compose up -d --build
```

*   
* **Prevención**:

  * Usar volúmenes en desarrollo para ciertos servicios o ejecutar en local.

---

## **3. Keycloak / Autenticación**

### **Problema 4: pantalla de login se ve, pero luego aparece error de redirección**

* **Síntoma**: después de login se muestra “Invalid redirect URI”.

* **Causa**: URIs de redirección no incluyen la URL exacta del frontend.

* **Solución**:

  * En `Clients → balconazo-frontend → Settings`, añadir `http://localhost:3000/*` en `Valid redirect URIs`.

* **Prevención**:

  * Configurar URIs desde el inicio y documentarlas.

---

### **Problema 5: token sin roles**

* **Síntoma**: JWT no contiene `realm_access.roles`.

* **Causa**: roles no asignados o mapper de roles no configurado.

* **Solución**:

  * Asignar roles al usuario en `Role mappings`.

  * Verificar que el client incluye un mapper de tipo `Realm roles`.

* **Prevención**:

  * Crear un usuario estándar de test con todos los roles necesarios para desarrollo.

---

## **4. Base de datos**

### **Problema 6: `relation "spaces" does not exist`**

* **Síntoma**: error de SQL al arrancar `spaces-service`.

* **Causa**: migraciones de Flyway no se han aplicado o BD vacía mal configurada.

* **Solución**:

  * Comprobar logs de Flyway.

  * Borrar volumen de la BD en desarrollo y reiniciar.

* **Prevención**:

  * Mantener las migraciones bajo control de versiones.

---

### **Problema 7: deadlocks o bloqueos al escribir reservas**

* **Síntoma**: consultas bloqueadas, tiempos de espera altos.

* **Causa**: transacciones largas o niveles de aislamiento mal configurados.

* **Solución**:

  * Revisar lógica de creación de reservas para minimizar la sección crítica.

  * Usar índices adecuados.

* **Prevención**:

  * Mantener las transacciones lo más cortas posible.

---

## **5. CORS**

### **Problema 8: error CORS en navegador (`No 'Access-Control-Allow-Origin' header`)**

* **Causa**: origen del frontend no configurado en KrakenD.

* **Solución**:

  * Añadir `http://localhost:3000` a `allow_origins` en `krakend.json`.

* **Prevención**:

  * Configurar CORS correctamente desde el inicio.

---

## **6. API Gateway (KrakenD)**

### **Problema 9: 502 Bad Gateway al llamar a `/api/spaces`**

* **Causa**:

  * `spaces-service` no está levantado o no pasa healthcheck.

  * `host` incorrecto en `krakend.json`.

* **Solución**:

  * Ver `docker compose ps` y logs de `spaces-service`.

  * Corregir `host` (`http://spaces-service:8080`).

* **Prevención**:

  * Probar los servicios directamente antes de integrarlos en el gateway.

---

### **Problema 10: 401 global tras cambiar configuración de Keycloak**

* **Causa**: cambios en realm/issuer que invalidan configuración de validación.

* **Solución**:

  * Actualizar `jwk_url`/issuer en `krakend.json` y microservicios.

* **Prevención**:

  * Evitar cambios de realm o URLs sin planificar su impacto.

---

## **7. Build / Compilación**

### **Problema 11: error de compilación Java (`source 21 but target 17`)**

* **Causa**: configuración inconsistente de `java.version` en `pom.xml` o IDE.

* **Solución**:

  * Fijar Java 21 en el `pom.xml` y en el IDE.

* **Prevención**:

  * Documentar la versión de Java requerida en el README.

---

### **Problema 12: build de frontend falla (`Cannot find module`)**

* **Causa**: imports incorrectos o paths mal configurados.

* **Solución**:

  * Revisar `tsconfig.json` y los alias (`@/*`).

* **Prevención**:

  * Evitar imports relativos complejos (`../../../../`), usar alias consistentes.

---

## **8. Dependencias**

### **Problema 13: conflictos de versiones entre librerías**

* **Síntoma**: errores de tipo “NoSuchMethodError” en runtime.

* **Causa**: versiones incompatibles en el árbol de dependencias.

* **Solución**:

  * Inspeccionar dependencias con `mvn dependency:tree`.

  * Forzar versiones compatibles en `dependencyManagement`.

* **Prevención**:

  * Actualizar dependencias de forma controlada y probar tras cada cambio grande.

---

## **9. Networking**

### **Problema 14: el frontend no encuentra el API en producción**

* **Causa**:

  * `NEXT_PUBLIC_API_BASE_URL` apunta a `localhost` en un servidor remoto.

* **Solución**:

  * Ajustar variables de entorno en producción a la URL pública real (por ejemplo, `https://api.balconazo.com`).

* **Prevención**:

  * Separar `.env.dev`, `.env.prod` y no reutilizar `localhost` fuera de desarrollo.

---

### **Problema 15: microservicios no resuelven el host de Keycloak**

* **Síntoma**: excepciones de `UnknownHostException: keycloak`.

* **Causa**: el nombre del servicio en Docker no coincide (`keycloak` vs `balconazo-keycloak`).

* **Solución**:

  * Usar el nombre correcto del servicio Docker en las URLs internas (`http://keycloak:8080`).

* **Prevención**:

  * Mantener coherencia entre nombres en `docker-compose.yml` y configuración de apps.
