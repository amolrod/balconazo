# **KEYCLOAK_CONFIG.md**

Configuración de Keycloak para BalconazoApp

---

## **Índice**

* [1. Introducción](#1-introducción)

* [2. Acceso al panel de administración](#2-acceso-al-panel-de-administración)

* [3. Creación del realm `balconazo`](#3-creación-del-realm-balconazo)

* [4. Creación de roles](#4-creación-de-roles)

* [5. Creación de clients](#5-creación-de-clients)

  * [5.1 Client para frontend (`balconazo-frontend`)](#51-client-para-frontend-balconazo-frontend)

  * [5.2 Client para API/backend (`balconazo-api`)](#52-client-para-apibackend-balconazo-api)

* [6. Mappers de claims](#6-mappers-de-claims)

* [7. Creación de usuarios de prueba](#7-creación-de-usuarios-de-prueba)

* [8. Configuración de social login (Google)](#8-configuración-de-social-login-google)

* [9. Exportar / importar configuración](#9-exportar--importar-configuración)

* [10. Uso de la CLI de Keycloak](#10-uso-de-la-cli-de-keycloak)

* [11. Problemas frecuentes y troubleshooting](#11-problemas-frecuentes-y-troubleshooting)

---

## **1. Introducción**

Keycloak es el servidor de identidad (IdP) elegido para gestionar:

* Registro y autenticación de usuarios.

* Roles y permisos.

* Emisión de tokens JWT (Access Token, ID Token).

* Integración con proveedores externos (Google, etc.).

Este documento explica, **paso a paso**, cómo configurar Keycloak para BalconazoApp.

---

## **2. Acceso al panel de administración**

Con Docker Compose levantado, Keycloak estará disponible en:

* URL: `http://localhost:8081/`

* Admin Console: `http://localhost:8081/admin/`

Credenciales iniciales (definidas en `.env`):

* Usuario: `KEYCLOAK_ADMIN_USER` (por defecto `admin`)

* Contraseña: `KEYCLOAK_ADMIN_PASSWORD` (por defecto `admin`)

Acceder al panel de administración

1. Abre el navegador y entra en `http://localhost:8081/`.

2. Haz clic en **Administration Console**.

3. Introduce el usuario y contraseña de administrador.

4. Pulsa en **Sign In**.

---

## **3. Creación del realm `balconazo`**

Keycloak agrupa usuarios y configuraciones en **realms**.

Crear el realm `balconazo`

1. En la esquina superior izquierda, en el selector de realm, haz clic en `Master`.

2. Pulsa en **Add realm** (o **Create realm** en versiones nuevas).

3. En el campo **Name**, escribe: `balconazo`.

4. (Opcional) Rellena descripción.

5. Pulsa en **Create**.

A partir de ahora, asegúrate de que el realm seleccionado arriba es **balconazo** y no `Master`.

---

## **4. Creación de roles**

Crearemos roles a nivel de realm:

* `ROLE_USER` – usuario base (huésped).

* `ROLE_HOST` – anfitrión (puede publicar espacios).

* `ROLE_ADMIN` – administrador (gestión global).

Crear roles en el realm `balconazo`

1. En el menú lateral, ve a **Realm roles**.

2. Pulsa **Create role**.

3. En **Role name**, escribe `ROLE_USER` y pulsa **Save**.

4. Repite el proceso para `ROLE_HOST` y `ROLE_ADMIN`.

Estos roles se asignarán a los usuarios y se incluirán en el token JWT.

---

## **5. Creación de clients**

Crearemos dos clientes OIDC:

* `balconazo-frontend` → usado por la app Next.js (cliente público).

* `balconazo-api` → usado por los microservicios (cliente *bearer-only* u opcionalmente *confidential*).

### **5.1 Client para frontend (`balconazo-frontend`)**

Crear client para el frontend

1. Menú lateral → **Clients** → botón **Create client**.

2. En **Client ID**, escribe: `balconazo-frontend`.

3. En **Client type**, selecciona **OpenID Connect**.

4. Pulsa **Next**.

5. En **Valid redirect URIs**, añade:

   * `http://localhost:3000/*`

6. En **Home URL**, pon:

   * `http://localhost:3000`

7. En **Web origins**, añade:

   * `http://localhost:3000`

8. Asegúrate de que **Standard flow** está habilitado (Authorization Code).

9. Guarda los cambios.

Este client será de tipo **public** (sin secreto), adecuado para aplicaciones SPA/browser.

### **5.2 Client para API/backend (`balconazo-api`)**

Crear client para la API

1. Menú lateral → **Clients** → **Create client**.

2. **Client ID**: `balconazo-api`.

3. **Client type**: OpenID Connect.

4. Pulsa **Next**.

5. Marca el client como **Bearer-only** (dependiendo de la versión, puede estar en una pestaña “Settings”).

   * Un client *bearer-only* no realiza flujos de login, solo valida tokens recibidos.

6. No es necesario configurar redirect URIs para un client `bearer-only`.

7. Guarda cambios.

Este client se utiliza para representar el backend en términos de protección de recursos.

---

## **6. Mappers de claims**

Queremos que los tokens incluyan:

* Roles de realm (`realm_access.roles`).

* Email.

* Nombre y apellidos.

En muchos casos, Keycloak ya incluye estos datos por defecto, pero es buena práctica revisarlo.

Verificar mapper de roles en el client

1. En **Clients**, selecciona `balconazo-frontend`.

2. Ve a la pestaña **Client scopes** o **Mappers** (según versión).

3. Asegúrate de tener un mapper del tipo **Realm roles** → **User Realm Role** incluido.

   * Esto hace que los roles se incluyan en el claim `realm_access`.

Crear mapper para incluir el email como claim (si no está)

1. En **Clients** → `balconazo-frontend` → pestaña **Mappers** → **Create**.

2. **Name**: `email`.

3. **Mapper Type**: `User Property`.

4. **Property**: `email`.

5. **Token Claim Name**: `email`.

6. Marca `Add to ID token` y `Add to access token`.

7. Guarda.

Puedes crear mappers similares para `given_name` y `family_name` según necesidades.

---

## **7. Creación de usuarios de prueba**

Crearemos dos usuarios de ejemplo:

* `guest1` → rol `ROLE_USER`.

* `host1` → roles `ROLE_USER` + `ROLE_HOST`.

Crear usuario `guest1`

1. Menú lateral → **Users** → botón **Add user**.

2. **Username**: `guest1`.

3. Establece **Email**, **First name** y **Last name** si lo deseas.

4. Marca `Email verified` si quieres omitir verificación.

5. Guarda.

6. Ve a la pestaña **Credentials**, establece una contraseña (por ejemplo, `guest1`), desactiva “Temporary” para que no obligue a cambiarla.

7. Ve a la pestaña **Role mappings**.

8. En **Realm roles**, selecciona `ROLE_USER` y pulsa **Add selected**.

Crear usuario `host1`

* Repite los pasos anteriores cambiando `Username` a `host1`.

* En **Role mappings**, asigna `ROLE_USER` y `ROLE_HOST`.

---

## **8. Configuración de social login (Google)**

*(Opcional pero recomendable para una experiencia más realista)*

Resumen de pasos (la configuración detallada depende de la consola de Google):

Configurar Google como Identity Provider

1. En la consola de Google Cloud, crea un proyecto y habilita OAuth 2.0.

2. Crea credenciales de tipo **OAuth client ID** (tipo aplicación web).

3. Define las **Authorized redirect URIs** hacia Keycloak, por ejemplo:

   * `http://localhost:8081/realms/balconazo/broker/google/endpoint`

4. Copia el **Client ID** y **Client secret** de Google.

5. En Keycloak, menú lateral → **Identity Providers** → selecciona `Google`.

6. Introduce `Client ID` y `Client secret`.

7. Guarda.

Tras esto, la pantalla de login de Keycloak mostrará un botón “Login with Google”.

---

## **9. Exportar / importar configuración**

Para replicar la configuración del realm en otros entornos es útil exportarlo.

### **Exportar realm desde la consola**

Exportar realm `balconazo` desde el panel

1. Ve a **Realm settings** (con el realm `balconazo` seleccionado).

2. Dependiendo de la versión, tendrás una opción de exportar realm (por ejemplo, “Export”).

3. Exporta incluyendo usuarios o sin ellos (según se desee).

4. Descarga el fichero JSON y guárdalo en `keycloak/realm-export.json`.

### **Importar realm al arrancar Keycloak (modo avanzado)**

Keycloak permite arrancar importando un realm desde un fichero, pero eso requeriría ajustar el comando de arranque del contenedor (out of scope del modo “start-dev”). Se recomienda usar la exportación manual para fines de TFG.

---

## **10. Uso de la CLI de Keycloak**

Dentro del contenedor existe la herramienta `kcadm.sh` para automatizar tareas.

Entrar en el contenedor de Keycloak

```bash
docker exec -it balconazoapp-keycloak bash
```

Autenticarse en la CLI (dentro del contenedor)

```bash
/opt/keycloak/bin/kcadm.sh config credentials \
  --server http://localhost:8080 \
  --realm master \
  --user ${KEYCLOAK_ADMIN} \
  --password ${KEYCLOAK_ADMIN_PASSWORD}
```

Listar realms existentes

```bash
/opt/keycloak/bin/kcadm.sh get realms
```

Crear un nuevo realm via CLI (ejemplo simplificado)

```bash
/opt/keycloak/bin/kcadm.sh create realms -s realm=balconazo -s enabled=true
```

*(La CLI es útil para automatizar scripts de despliegue; para el TFG, la configuración manual vía UI suele ser suficiente.)*

---

## **11. Problemas frecuentes y troubleshooting**

### **Problema 1: “Invalid redirect URI” al iniciar sesión**

* **Síntoma:**  
   Tras login, Keycloak muestra un error “Invalid redirect URI”.

* **Causa:**  
   La URL de retorno del frontend no coincide exactamente con las configuradas en el client.

* **Solución:**

  1. En `Clients` → `balconazo-frontend` → pestaña **Settings**, revisa **Valid redirect URIs**.

  2. Asegúrate de incluir `http://localhost:3000/*`.

  3. Guarda y repite el login.

---

### **Problema 2: 401/403 desde los microservicios**

* **Síntoma:**  
   El frontend recibe 401/403 al llamar a endpoints protegidos.

* **Causa:**

  1. El token no se está enviando en la cabecera `Authorization`.

  2. El issuer configurado en Spring (`SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_ISSUER_URI`) no coincide con Keycloak.

* **Solución:**

  1. Confirmar en las peticiones que se envía `Authorization: Bearer <token>`.

  2. Revisar que la variable `SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_ISSUER_URI` apunte a `http://keycloak:8080/realms/balconazo`.

---

### **Problema 3: No se ven los roles en el token**

* **Síntoma:**  
   El token JWT no contiene `realm_access.roles` o los roles esperados.

* **Causa:**

  1. Usuarios sin roles asignados.

  2. Mapper de roles no incluido en el client.

* **Solución:**

  1. Revisar `Users` → usuario → **Role mappings**.

  2. Revisar `Clients` → `balconazo-frontend` → **Client scopes / Mappers** y asegurarse de que hay un mapper de `realm roles`.

---

### **Problema 4: No se puede acceder al Admin Console**

* **Síntoma:**  
   `http://localhost:8081/admin` no carga o devuelve error.

* **Causa:**

  1. Keycloak aún no ha terminado de arrancar.

  2. Puertos mal configurados.

* **Solución:**

Ver logs de Keycloak:

```bash
 docker compose logs -f keycloak
```

1.   
   2. Esperar a que aparezca un mensaje tipo “Started in Xs”.

   3. Verificar que `KEYCLOAK_HTTP_PORT` en `.env` coincide con el puerto del mapeo en `docker-compose.yml`.
