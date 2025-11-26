# BalconazoApp 🏠

[![Backend](https://img.shields.io/badge/Backend-Spring%20Boot%203.2-6DB33F?logo=springboot)](https://spring.io/projects/spring-boot)
[![Frontend](https://img.shields.io/badge/Frontend-Next.js%2015-000000?logo=nextdotjs)](https://nextjs.org/)
[![Auth](https://img.shields.io/badge/Auth-Keycloak%2022-4D4D4D?logo=keycloak)](https://www.keycloak.org/)
[![Gateway](https://img.shields.io/badge/Gateway-KrakenD%202.4-FF6B35)](https://www.krakend.io/)

**BalconazoApp** es un marketplace de alquiler de espacios por horas (terrazas, balcones, jardines, salones) entre particulares.

## 🏗️ Estado del Proyecto

| Componente | Estado | Notas |
|------------|--------|-------|
| Backend - users-service | ✅ Funcional | Autenticación JWT completa |
| Backend - spaces-service | ✅ Funcional | CRUD de espacios con filtros |
| Backend - bookings-service | ✅ Funcional | Gestión de reservas |
| API Gateway (KrakenD) | ✅ Funcional | Routing y validación JWT |
| Autenticación (Keycloak) | ✅ Funcional | OAuth2/OIDC configurado |
| Frontend (Next.js) | 🔄 En progreso | Estructura base creada |

## 🛠️ Stack Tecnológico

- **Backend:** Java 21, Spring Boot 3.2.0, PostgreSQL 16, Flyway
- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS, Bun
- **Auth:** Keycloak 22 (OAuth2/OIDC)
- **Gateway:** KrakenD 2.4
- **Infraestructura:** Docker, Docker Compose

## 📁 Estructura del Proyecto

```
balconazo/
├── backend/
│   ├── users-service/      # Microservicio de usuarios
│   ├── spaces-service/     # Microservicio de espacios
│   └── bookings-service/   # Microservicio de reservas
├── frontend/               # Aplicación Next.js
├── gateway/                # Configuración KrakenD
├── keycloak/               # Configuración y realm export
├── infra/                  # Scripts SQL y configuración DB
└── docs/                   # Documentación técnica
```

## 🚀 Quickstart

### Prerrequisitos

- Docker y Docker Compose
- Git

### Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/amolrod/balconazo.git
   cd balconazo
   ```

2. Copia el archivo de variables de entorno:
   ```bash
   cp .env.example .env
   ```

3. Levanta todos los servicios:
   ```bash
   docker compose up -d --build
   ```

4. Espera a que todos los servicios estén saludables (~2-3 minutos la primera vez)

### URLs de Acceso

| Servicio | URL | Credenciales |
|----------|-----|--------------|
| Frontend | http://localhost:3000 | - |
| API Gateway | http://localhost:8080 | - |
| Keycloak Admin | http://localhost:8081 | admin / admin |
| Users Service | http://localhost:8082 | - |
| Spaces Service | http://localhost:8083 | - |
| Bookings Service | http://localhost:8084 | - |

### Usuarios de Prueba

| Usuario | Contraseña | Roles |
|---------|------------|-------|
| user_guest | guest123 | ROLE_USER |
| host_demo | host123 | ROLE_USER, ROLE_HOST |
| admin_host | admin123 | ROLE_USER, ROLE_HOST, ROLE_ADMIN |

### Probar la API

```bash
# Obtener token de autenticación
ACCESS_TOKEN=$(curl -s -X POST "http://localhost:8081/realms/balconazo/protocol/openid-connect/token" \
  -d "client_id=balconazo-frontend" \
  -d "grant_type=password" \
  -d "username=user_guest" \
  -d "password=guest123" | jq -r '.access_token')

# Obtener perfil del usuario
curl -H "Authorization: Bearer $ACCESS_TOKEN" http://localhost:8080/api/users/me

# Listar espacios (público)
curl http://localhost:8080/api/spaces
```

## 📚 Documentación

Consulta la carpeta `docs/` para guías detalladas:

- [Arquitectura del Sistema](docs/ARCHITECTURE.md)
- [Documentación de APIs](docs/API_DOCUMENTATION.md)
- [Configuración de Keycloak](docs/KEYCLOAK_CONFIG.md)
- [Guía de Desarrollo Backend](docs/BACKEND_DEVELOPMENT_GUIDE.md)
- [Guía de Desarrollo Frontend](docs/FRONTEND_DEVELOPMENT_GUIDE.md)
- [Roadmap del Proyecto](docs/PROJECT_ROADMAP.md)

## 📖 Diario de Desarrollo (TFG)

El archivo [TFG.md](TFG.md) contiene el diario de desarrollo con todos los pasos realizados, errores solucionados y decisiones técnicas tomadas.

## 🤝 Contribución

Este proyecto es parte de un TFG (Trabajo de Fin de Grado).

## 📄 Licencia

MIT License
