#!/bin/bash
# ===========================================
# TEST COMPLETO BACKEND BALCONAZO
# ===========================================

set -e

BASE_URL="http://localhost:8080"
KEYCLOAK_URL="http://localhost:8081"

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASS=0
FAIL=0

test_endpoint() {
    local method=$1
    local endpoint=$2
    local token=$3
    local data=$4
    local expected_code=$5
    local description=$6
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" \
            -H "Authorization: Bearer $token" \
            -H "Content-Type: application/json" \
            -d "$data")
    elif [ -n "$token" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" \
            -H "Authorization: Bearer $token")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -eq "$expected_code" ]; then
        echo -e "${GREEN}[PASS]${NC} $description (HTTP $http_code)"
        ((PASS++))
        return 0
    else
        echo -e "${RED}[FAIL]${NC} $description - Expected $expected_code, got $http_code"
        echo "       Response: ${body:0:100}..."
        ((FAIL++))
        return 1
    fi
}

echo "==========================================="
echo "     TEST COMPLETO BACKEND BALCONAZO"
echo "==========================================="
echo ""

# Obtener tokens
echo "Obteniendo tokens de autenticacion..."
GUEST_TOKEN=$(curl -s -X POST "$KEYCLOAK_URL/realms/balconazo/protocol/openid-connect/token" \
    -d "client_id=balconazo-frontend" -d "grant_type=password" \
    -d "username=user_guest" -d "password=guest123" | jq -r '.access_token')

HOST_TOKEN=$(curl -s -X POST "$KEYCLOAK_URL/realms/balconazo/protocol/openid-connect/token" \
    -d "client_id=balconazo-frontend" -d "grant_type=password" \
    -d "username=host_demo" -d "password=host123" | jq -r '.access_token')

ADMIN_TOKEN=$(curl -s -X POST "$KEYCLOAK_URL/realms/balconazo/protocol/openid-connect/token" \
    -d "client_id=balconazo-frontend" -d "grant_type=password" \
    -d "username=admin_host" -d "password=admin123" | jq -r '.access_token')

if [ "$GUEST_TOKEN" == "null" ] || [ -z "$GUEST_TOKEN" ]; then
    echo -e "${RED}ERROR: No se pudo obtener GUEST_TOKEN${NC}"
    exit 1
fi

echo -e "${GREEN}Tokens obtenidos correctamente${NC}"
echo ""

# =========================================
echo "==========================================="
echo "          1. USERS-SERVICE"
echo "==========================================="

test_endpoint "GET" "/api/users/me" "$GUEST_TOKEN" "" 200 "GET /api/users/me (guest)"
test_endpoint "GET" "/api/users/me" "$HOST_TOKEN" "" 200 "GET /api/users/me (host)"
test_endpoint "GET" "/api/users/me" "$ADMIN_TOKEN" "" 200 "GET /api/users/me (admin)"

# Test sin token (debe fallar)
test_endpoint "GET" "/api/users/me" "" "" 401 "GET /api/users/me (sin token - debe fallar)"

# Obtener ID del usuario guest para tests posteriores
GUEST_ID=$(curl -s -X GET "$BASE_URL/api/users/me" -H "Authorization: Bearer $GUEST_TOKEN" | jq -r '.id')
HOST_ID=$(curl -s -X GET "$BASE_URL/api/users/me" -H "Authorization: Bearer $HOST_TOKEN" | jq -r '.id')
echo "   GUEST_ID: $GUEST_ID"
echo "   HOST_ID: $HOST_ID"

# Update profile
test_endpoint "PUT" "/api/users/me" "$GUEST_TOKEN" '{"name":"Guest","surname":"Usuario Test"}' 200 "PUT /api/users/me (actualizar perfil)"

# Get user by ID (admin) - Este endpoint no está expuesto en el gateway por seguridad
# test_endpoint "GET" "/api/users/$GUEST_ID" "$ADMIN_TOKEN" "" 200 "GET /api/users/{id} (admin)"

# Get all users - Este endpoint tampoco está en el gateway
# test_endpoint "GET" "/api/users" "$ADMIN_TOKEN" "" 200 "GET /api/users (admin - listar todos)"
# test_endpoint "GET" "/api/users" "$GUEST_TOKEN" "" 403 "GET /api/users (guest - debe fallar 403)"

echo ""

# =========================================
echo "==========================================="
echo "          2. SPACES-SERVICE"
echo "==========================================="

# Endpoints publicos
test_endpoint "GET" "/api/spaces" "" "" 200 "GET /api/spaces (publico - listar)"
test_endpoint "GET" "/api/spaces?city=Barcelona" "" "" 200 "GET /api/spaces?city=Barcelona (filtro)"
test_endpoint "GET" "/api/spaces?spaceType=TERRACE" "" "" 200 "GET /api/spaces?spaceType=TERRACE (filtro)"

# Crear espacio (solo HOST)
SPACE_DATA='{
    "title":"Espacio Test Script Automatizado",
    "description":"Descripcion completa del espacio para testing automatizado con mas de 20 caracteres",
    "pricePerHour":45.00,
    "capacity":20,
    "city":"Madrid",
    "address":"Calle Gran Via 123"
}'

test_endpoint "POST" "/api/spaces" "$HOST_TOKEN" "$SPACE_DATA" 200 "POST /api/spaces (host - crear espacio)"

# KrakenD devuelve 200 con error_backend cuando Spring devuelve 403
# Verificamos directamente que Spring rechaza con 403
echo -n "[TEST] POST /api/spaces (guest - verificando restriccion roles): "
GUEST_RESPONSE=$(curl -s -w "%{http_code}" -X POST "http://localhost:8083/spaces" \
    -H "Authorization: Bearer $GUEST_TOKEN" \
    -H "Content-Type: application/json" \
    -d "$SPACE_DATA")
GUEST_HTTP=${GUEST_RESPONSE: -3}
if [ "$GUEST_HTTP" == "403" ]; then
    echo -e "${GREEN}[PASS]${NC} Spring devuelve 403 Forbidden"
    ((PASS++))
else
    echo -e "${RED}[FAIL]${NC} Esperado 403, recibido $GUEST_HTTP"
    ((FAIL++))
fi

# Obtener el espacio creado por el host (usamos el servicio directo para evitar transformaciones de KrakenD)
SPACE_ID=$(curl -s -X GET "http://localhost:8083/spaces/my" -H "Authorization: Bearer $HOST_TOKEN" | jq -r '.content[0].id // .[0].id // empty')
if [ -n "$SPACE_ID" ]; then
    echo "   SPACE_ID: $SPACE_ID"
    test_endpoint "GET" "/api/spaces/$SPACE_ID" "" "" 200 "GET /api/spaces/{id} (publico)"
    
    # Update espacio (solo owner) - usa los mismos campos que CreateSpaceRequest
    UPDATE_DATA='{"title":"Espacio Test Actualizado","description":"Descripcion actualizada del espacio con mas de veinte caracteres","pricePerHour":50.00,"capacity":25,"city":"Barcelona"}'
    test_endpoint "PUT" "/api/spaces/$SPACE_ID" "$HOST_TOKEN" "$UPDATE_DATA" 200 "PUT /api/spaces/{id} (owner)"
    
    # Mis espacios (host)
    test_endpoint "GET" "/api/spaces/my" "$HOST_TOKEN" "" 200 "GET /api/spaces/my (mis espacios)"
fi

echo ""

# =========================================
echo "==========================================="
echo "          3. BOOKINGS-SERVICE"
echo "==========================================="

# Crear reserva (cualquier usuario autenticado)
if [ -n "$SPACE_ID" ]; then
    BOOKING_DATA="{
        \"spaceId\":\"$SPACE_ID\",
        \"startTime\":\"2025-12-15T10:00:00\",
        \"endTime\":\"2025-12-15T14:00:00\"
    }"
    
    test_endpoint "POST" "/api/bookings" "$GUEST_TOKEN" "$BOOKING_DATA" 200 "POST /api/bookings (guest - crear reserva)"
    
    # Obtener booking ID (servicio directo)
    BOOKING_ID=$(curl -s -X GET "http://localhost:8084/bookings/me" -H "Authorization: Bearer $GUEST_TOKEN" | jq -r '.content[0].id // .[0].id // empty')
    
    if [ -n "$BOOKING_ID" ]; then
        echo "   BOOKING_ID: $BOOKING_ID"
        test_endpoint "GET" "/api/bookings/$BOOKING_ID" "$GUEST_TOKEN" "" 200 "GET /api/bookings/{id} (guest)"
        test_endpoint "GET" "/api/bookings/me" "$GUEST_TOKEN" "" 200 "GET /api/bookings/me (mis reservas)"
        
        # Host ve las reservas de sus espacios
        test_endpoint "GET" "/api/bookings/host" "$HOST_TOKEN" "" 200 "GET /api/bookings/host (reservas de mis espacios)"
        
        # Cancelar reserva
        test_endpoint "PUT" "/api/bookings/$BOOKING_ID/cancel" "$GUEST_TOKEN" "" 200 "PUT /api/bookings/{id}/cancel"
    fi
fi

# Test sin token
test_endpoint "GET" "/api/bookings/me" "" "" 401 "GET /api/bookings/me (sin token)"

echo ""

# =========================================
echo "==========================================="
echo "          4. HEALTH CHECKS"
echo "==========================================="

# Health endpoints directos (sin gateway)
for port in 8082 8083 8084; do
    service_name=""
    case $port in
        8082) service_name="users-service" ;;
        8083) service_name="spaces-service" ;;
        8084) service_name="bookings-service" ;;
    esac
    
    health=$(curl -s "http://localhost:$port/actuator/health" | jq -r '.status')
    if [ "$health" == "UP" ]; then
        echo -e "${GREEN}[PASS]${NC} $service_name health: UP"
        ((PASS++))
    else
        echo -e "${RED}[FAIL]${NC} $service_name health: $health"
        ((FAIL++))
    fi
done

# KrakenD health
krakend_health=$(curl -s "http://localhost:8080/__health" | jq -r '.status')
if [ "$krakend_health" == "ok" ]; then
    echo -e "${GREEN}[PASS]${NC} KrakenD health: ok"
    ((PASS++))
else
    echo -e "${RED}[FAIL]${NC} KrakenD health: $krakend_health"
    ((FAIL++))
fi

echo ""
echo "==========================================="
echo "              RESUMEN"
echo "==========================================="
echo -e "${GREEN}Tests pasados: $PASS${NC}"
echo -e "${RED}Tests fallidos: $FAIL${NC}"
TOTAL=$((PASS + FAIL))
PERCENT=$((PASS * 100 / TOTAL))
echo "Porcentaje de exito: $PERCENT%"
echo "==========================================="

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}BACKEND 100% FUNCIONAL - LISTO PARA FRONTEND${NC}"
    exit 0
else
    echo -e "${YELLOW}Hay $FAIL tests fallidos que revisar${NC}"
    exit 1
fi
