#!/bin/bash
# ===========================================
# DEPLOY - BALCONAZO
# Script de despliegue completo
# ===========================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Opciones
BUILD=false
DETACH=true
LOGS=false
ENV="dev"

usage() {
    echo "Uso: $0 [opciones]"
    echo ""
    echo "Opciones:"
    echo "  -b, --build      Reconstruir imagenes Docker"
    echo "  -f, --foreground Ejecutar en primer plano (sin -d)"
    echo "  -l, --logs       Mostrar logs despues de iniciar"
    echo "  -e, --env        Entorno (dev|prod) - default: dev"
    echo "  -h, --help       Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  $0                    # Deploy normal"
    echo "  $0 -b                 # Deploy con rebuild"
    echo "  $0 -b -l              # Deploy con rebuild y mostrar logs"
    echo "  $0 -e prod            # Deploy en produccion"
}

while [[ $# -gt 0 ]]; do
    case $1 in
        -b|--build) BUILD=true; shift ;;
        -f|--foreground) DETACH=false; shift ;;
        -l|--logs) LOGS=true; shift ;;
        -e|--env) ENV="$2"; shift 2 ;;
        -h|--help) usage; exit 0 ;;
        *) echo "Opcion desconocida: $1"; usage; exit 1 ;;
    esac
done

cd "$PROJECT_DIR"

echo ""
echo "==========================================="
echo "     DEPLOY BALCONAZO - Entorno: $ENV"
echo "==========================================="
echo ""

# Verificar Docker
echo -e "${BLUE}[1/6] Verificando Docker...${NC}"
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}ERROR: Docker no esta corriendo${NC}"
    exit 1
fi
echo -e "${GREEN}Docker OK${NC}"

# Verificar archivo .env
echo -e "${BLUE}[2/6] Verificando configuracion...${NC}"
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        echo -e "${YELLOW}Copiando .env.example a .env...${NC}"
        cp .env.example .env
    else
        echo -e "${RED}ERROR: No existe archivo .env ni .env.example${NC}"
        exit 1
    fi
fi
echo -e "${GREEN}Configuracion OK${NC}"

# Detener servicios existentes
echo -e "${BLUE}[3/6] Deteniendo servicios existentes...${NC}"
docker compose down --remove-orphans 2>/dev/null || true
echo -e "${GREEN}Servicios detenidos${NC}"

# Build si es necesario
if [ "$BUILD" = true ]; then
    echo -e "${BLUE}[4/6] Construyendo imagenes...${NC}"
    docker compose build --no-cache
    echo -e "${GREEN}Build completado${NC}"
else
    echo -e "${BLUE}[4/6] Usando imagenes existentes (usa -b para rebuild)${NC}"
fi

# Iniciar servicios
echo -e "${BLUE}[5/6] Iniciando servicios...${NC}"
if [ "$DETACH" = true ]; then
    docker compose up -d
else
    docker compose up
    exit 0
fi
echo -e "${GREEN}Servicios iniciados${NC}"

# Esperar a que los servicios esten saludables
echo -e "${BLUE}[6/6] Esperando a que los servicios esten listos...${NC}"
echo ""

wait_for_service() {
    local name=$1
    local url=$2
    local max_attempts=60
    local attempt=0
    
    printf "   Esperando %-20s" "$name..."
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            echo -e "${GREEN}OK${NC}"
            return 0
        fi
        sleep 2
        ((attempt++))
        printf "."
    done
    
    echo -e "${RED}TIMEOUT${NC}"
    return 1
}

# Esperar bases de datos (via Docker health)
echo "   Esperando bases de datos..."
sleep 10

wait_for_service "Keycloak" "http://localhost:8081/health/ready"
wait_for_service "users-service" "http://localhost:8082/actuator/health"
wait_for_service "spaces-service" "http://localhost:8083/actuator/health"
wait_for_service "bookings-service" "http://localhost:8084/actuator/health"
wait_for_service "KrakenD" "http://localhost:8080/__health"

echo ""
echo "==========================================="
echo -e "${GREEN}     DEPLOY COMPLETADO${NC}"
echo "==========================================="
echo ""
echo "URLs disponibles:"
echo "  - API Gateway:    http://localhost:8080"
echo "  - Keycloak Admin: http://localhost:8081 (admin/admin)"
echo "  - Frontend:       http://localhost:3000 (si esta iniciado)"
echo ""

# Mostrar logs si se solicito
if [ "$LOGS" = true ]; then
    echo "Mostrando logs (Ctrl+C para salir)..."
    docker compose logs -f
fi

# Ejecutar health check
echo "Ejecutando health check..."
"$SCRIPT_DIR/health-check.sh"
