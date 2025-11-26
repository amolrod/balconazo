# Scripts de BalconazoApp

Este directorio contiene scripts de utilidad para el desarrollo, despliegue y mantenimiento del proyecto.

## Indice de Scripts

| Script | Descripcion |
|--------|-------------|
| `deploy.sh` | Despliegue completo del proyecto |
| `health-check.sh` | Verificar estado de todos los servicios |
| `test-backend.sh` | Tests completos del backend (23 tests) |
| `api-test.sh` | Tests rapidos de la API |
| `get-token.sh` | Obtener tokens JWT de Keycloak |
| `logs.sh` | Ver logs de los servicios |
| `backup-db.sh` | Backup y restauracion de bases de datos |
| `clean.sh` | Limpieza del proyecto |
| `start-frontend.sh` | Iniciar el frontend Next.js |

---

## deploy.sh

Despliegue completo del proyecto con Docker Compose.

```bash
# Despliegue normal
./scripts/deploy.sh

# Reconstruir imagenes
./scripts/deploy.sh -b

# Deploy con logs en tiempo real
./scripts/deploy.sh -b -l

# Ver ayuda
./scripts/deploy.sh -h
```

**Opciones:**
- `-b, --build` - Reconstruir imagenes Docker
- `-f, --foreground` - Ejecutar en primer plano
- `-l, --logs` - Mostrar logs despues de iniciar
- `-e, --env` - Entorno (dev|prod)

---

## health-check.sh

Verifica el estado de todos los servicios del proyecto.

```bash
./scripts/health-check.sh
```

**Verifica:**
- Bases de datos PostgreSQL (via Docker health)
- Keycloak
- KrakenD API Gateway
- Microservicios (users, spaces, bookings)
- Frontend Next.js

---

## test-backend.sh

Suite completa de tests del backend. Ejecuta 23 tests que verifican todos los endpoints.

```bash
./scripts/test-backend.sh
```

**Tests incluidos:**
- Autenticacion JWT (3 usuarios diferentes)
- CRUD de usuarios
- CRUD de espacios
- CRUD de reservas
- Health checks de todos los servicios

---

## api-test.sh

Tests rapidos y especificos de la API.

```bash
# Test rapido de conectividad
./scripts/api-test.sh quick

# Test de usuarios
./scripts/api-test.sh users

# Test de espacios con respuestas completas
./scripts/api-test.sh spaces -v

# Test de reservas
./scripts/api-test.sh bookings

# Test completo (ejecuta test-backend.sh)
./scripts/api-test.sh all
```

**Opciones:**
- `-t TOKEN` - Usar token especifico
- `-v` - Modo verbose (mostrar respuestas completas)

---

## get-token.sh

Obtener tokens JWT de Keycloak para testing.

```bash
# Token de usuario guest
./scripts/get-token.sh guest

# Token de host, copiar al clipboard
./scripts/get-token.sh host -c

# Token de admin, decodificado
./scripts/get-token.sh admin -d

# Usuario personalizado
./scripts/get-token.sh -u miusuario -p password

# Exportar como variable de entorno
./scripts/get-token.sh admin -e
# Output: export ACCESS_TOKEN="eyJ..."
```

**Usuarios predefinidos:**
| Usuario | Password | Roles |
|---------|----------|-------|
| guest | user_guest / guest123 | ROLE_USER |
| host | host_demo / host123 | ROLE_USER, ROLE_HOST |
| admin | admin_host / admin123 | ROLE_USER, ROLE_HOST, ROLE_ADMIN |

**Opciones:**
- `-d, --decode` - Decodificar el token
- `-c, --copy` - Copiar al portapapeles (macOS)
- `-e, --export` - Imprimir export para variable de entorno

---

## logs.sh

Ver logs de los servicios Docker.

```bash
# Ver logs de users-service
./scripts/logs.sh users-service

# Seguir logs en tiempo real
./scripts/logs.sh -f users-service

# Ver ultimas 500 lineas
./scripts/logs.sh -n 500 spaces-service

# Solo errores
./scripts/logs.sh -e bookings-service

# Todos los servicios
./scripts/logs.sh -f all
```

**Servicios disponibles:**
- `users-service`, `spaces-service`, `bookings-service`
- `keycloak`, `krakend`
- `postgres-users`, `postgres-spaces`, `postgres-bookings`
- `all` (todos)

**Opciones:**
- `-f, --follow` - Seguir logs en tiempo real
- `-n, --lines N` - Numero de lineas (default: 100)
- `-e, --errors` - Solo errores

---

## backup-db.sh

Backup y restauracion de bases de datos PostgreSQL.

```bash
# Crear backup de todas las DBs
./scripts/backup-db.sh

# Listar backups disponibles
./scripts/backup-db.sh -l

# Restaurar un backup
./scripts/backup-db.sh -r backups/users_20251126_120000.sql.gz

# Eliminar backups de mas de 30 dias
./scripts/backup-db.sh -c 30
```

**Ubicacion de backups:** `./backups/`

**Formato:** `{database}_{YYYYMMDD_HHMMSS}.sql.gz`

---

## clean.sh

Limpieza del proyecto con diferentes niveles.

```bash
# Soft: Solo detener contenedores
./scripts/clean.sh soft

# Medium: Detener y eliminar contenedores
./scripts/clean.sh medium

# Hard: Eliminar contenedores, volumenes y redes (ELIMINA DATOS)
./scripts/clean.sh hard

# Nuclear: Todo + imagenes + cache (RECONSTRUIR TODO)
./scripts/clean.sh nuclear
```

**Niveles:**
| Nivel | Contenedores | Volumenes | Imagenes | Cache |
|-------|--------------|-----------|----------|-------|
| soft | Stop | - | - | - |
| medium | Remove | - | - | - |
| hard | Remove | Remove | - | - |
| nuclear | Remove | Remove | Remove | Remove |

---

## start-frontend.sh

Iniciar el frontend Next.js en modo desarrollo.

```bash
# Iniciar en modo desarrollo
./scripts/start-frontend.sh

# Instalar dependencias e iniciar
./scripts/start-frontend.sh -i

# Build de produccion
./scripts/start-frontend.sh -b

# Puerto personalizado
./scripts/start-frontend.sh -p 3001
```

**Opciones:**
- `-i, --install` - Instalar dependencias antes de iniciar
- `-b, --build` - Build de produccion
- `-p, --port PORT` - Puerto (default: 3000)

---

## Permisos

Si los scripts no son ejecutables:

```bash
chmod +x scripts/*.sh
```

---

## Flujo de Trabajo Tipico

### Primera vez (setup completo):

```bash
# 1. Clonar repositorio
git clone https://github.com/amolrod/balconazo.git
cd balconazo

# 2. Configurar variables de entorno
cp .env.example .env

# 3. Desplegar todo
./scripts/deploy.sh -b

# 4. Verificar que todo funciona
./scripts/health-check.sh

# 5. Ejecutar tests del backend
./scripts/test-backend.sh

# 6. Iniciar frontend (en otra terminal)
./scripts/start-frontend.sh -i
```

### Desarrollo diario:

```bash
# Iniciar servicios
./scripts/deploy.sh

# Ver logs si hay problemas
./scripts/logs.sh -f users-service

# Probar cambios
./scripts/api-test.sh quick

# Obtener token para Postman/curl
./scripts/get-token.sh host -c
```

### Antes de commit:

```bash
# Tests completos
./scripts/test-backend.sh

# Health check
./scripts/health-check.sh
```

### Mantenimiento:

```bash
# Backup de datos
./scripts/backup-db.sh

# Limpieza periodica
./scripts/clean.sh medium
./scripts/deploy.sh -b
```
