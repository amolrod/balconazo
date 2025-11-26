#!/bin/bash
# ===========================================
# HEALTH CHECK - BALCONAZO
# Verifica el estado de todos los servicios
# ===========================================

set -e

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo "==========================================="
echo "     HEALTH CHECK - BALCONAZO"
echo "==========================================="
echo ""

HEALTHY=0
UNHEALTHY=0

check_service() {
    local name=$1
    local url=$2
    local expected_field=$3
    local expected_value=$4
    
    printf "%-25s" "$name"
    
    response=$(curl -s --connect-timeout 5 "$url" 2>/dev/null || echo "CONNECTION_FAILED")
    
    if [ "$response" == "CONNECTION_FAILED" ]; then
        echo -e "${RED}[OFFLINE]${NC} No se puede conectar"
        ((UNHEALTHY++))
        return 1
    fi
    
    if [ -n "$expected_field" ]; then
        value=$(echo "$response" | jq -r ".$expected_field" 2>/dev/null)
        if [ "$value" == "$expected_value" ]; then
            echo -e "${GREEN}[HEALTHY]${NC} $expected_field: $value"
            ((HEALTHY++))
            return 0
        else
            echo -e "${RED}[UNHEALTHY]${NC} $expected_field: $value (esperado: $expected_value)"
            ((UNHEALTHY++))
            return 1
        fi
    else
        echo -e "${GREEN}[HEALTHY]${NC}"
        ((HEALTHY++))
        return 0
    fi
}

echo -e "${BLUE}--- Bases de Datos (via Docker) ---${NC}"
for db in postgres-users postgres-spaces postgres-bookings; do
    printf "%-25s" "$db"
    status=$(docker inspect --format='{{.State.Health.Status}}' $db 2>/dev/null || echo "NOT_FOUND")
    if [ "$status" == "healthy" ]; then
        echo -e "${GREEN}[HEALTHY]${NC}"
        ((HEALTHY++))
    elif [ "$status" == "NOT_FOUND" ]; then
        echo -e "${RED}[NOT FOUND]${NC}"
        ((UNHEALTHY++))
    else
        echo -e "${YELLOW}[$status]${NC}"
        ((UNHEALTHY++))
    fi
done

echo ""
echo -e "${BLUE}--- Servicios de Autenticacion ---${NC}"
check_service "Keycloak" "http://localhost:8081/health/ready" "status" "UP"

echo ""
echo -e "${BLUE}--- API Gateway ---${NC}"
check_service "KrakenD" "http://localhost:8080/__health" "status" "ok"

echo ""
echo -e "${BLUE}--- Microservicios Backend ---${NC}"
check_service "users-service" "http://localhost:8082/actuator/health" "status" "UP"
check_service "spaces-service" "http://localhost:8083/actuator/health" "status" "UP"
check_service "bookings-service" "http://localhost:8084/actuator/health" "status" "UP"

echo ""
echo -e "${BLUE}--- Frontend ---${NC}"
printf "%-25s" "Next.js (puerto 3000)"
frontend_response=$(curl -s --connect-timeout 5 -o /dev/null -w "%{http_code}" "http://localhost:3000" 2>/dev/null || echo "000")
if [ "$frontend_response" == "200" ]; then
    echo -e "${GREEN}[HEALTHY]${NC} HTTP 200"
    ((HEALTHY++))
elif [ "$frontend_response" == "000" ]; then
    echo -e "${YELLOW}[OFFLINE]${NC} No iniciado"
else
    echo -e "${YELLOW}[WARNING]${NC} HTTP $frontend_response"
fi

echo ""
echo "==========================================="
echo "              RESUMEN"
echo "==========================================="
TOTAL=$((HEALTHY + UNHEALTHY))
echo -e "${GREEN}Servicios Healthy: $HEALTHY${NC}"
echo -e "${RED}Servicios Unhealthy: $UNHEALTHY${NC}"
echo ""

if [ $UNHEALTHY -eq 0 ]; then
    echo -e "${GREEN}Todos los servicios estan funcionando correctamente${NC}"
    exit 0
else
    echo -e "${YELLOW}Hay $UNHEALTHY servicios con problemas${NC}"
    exit 1
fi
