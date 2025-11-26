# BalconazoApp

BalconazoApp es un marketplace de alquiler de espacios por horas (terrazas, balcones, jardines, salones) entre particulares.

## Estructura del proyecto

- `backend/`: microservicios Java + Spring Boot
- `frontend/`: aplicación Next.js + React
- `gateway/`: configuración de KrakenD (API Gateway)
- `keycloak/`: configuración y export del realm de Keycloak
- `infra/`: infraestructura auxiliar (bases de datos, scripts)
- `docs/`: documentación técnica

## Quickstart

1. Copia `.env.example` a `.env` y ajusta valores.
2. Ejecuta:

   ```bash
   docker compose up -d --build
   ```

3. Abre:

   * Frontend: http://localhost:3000
   * API Gateway: http://localhost:8080
   * Keycloak: http://localhost:8081

## Documentación

Consulta la carpeta `docs/` para guías detalladas de configuración, desarrollo y despliegue.
