#!/bin/bash
# ===========================================
# API TEST - BALCONAZO
# Tests rapidos de la API
# ===========================================

set -e

BASE_URL="http://localhost:8080"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

usage() {
    echo "Uso: $0 <comando> [opciones]"
    echo ""
    echo "Comandos:"
    echo "  users       - Probar endpoints de usuarios"
    echo "  spaces      - Probar endpoints de espacios"
    echo "  bookings    - Probar endpoints de reservas"
    echo "  all         - Ejecutar test-backend.sh completo"
    echo "  quick       - Test rapido de conectividad"
    echo ""
    echo "Opciones:"
    echo "  -t TOKEN    - Usar token especifico"
    echo "  -v          - Modo verbose (mostrar respuestas completas)"
    echo ""
    echo "Ejemplos:"
    echo "  $0 quick                    # Test rapido"
    echo "  $0 users                    # Test usuarios"
    echo "  $0 spaces -v                # Test espacios con respuestas"
}

VERBOSE=false
TOKEN=""

# Parsear argumentos
COMMAND=""
while [[ $# -gt 0 ]]; do
    case $1 in
        users|spaces|bookings|all|quick)
            COMMAND="$1"
            shift
            ;;
        -t)
            TOKEN="$2"
            shift 2
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *)
            echo "Comando desconocido: $1"
            usage
            exit 1
            ;;
    esac
done

if [ -z "$COMMAND" ]; then
    usage
    exit 1
fi

# Funcion para obtener token si no se proporciono
get_token() {
    local user=$1
    local pass=$2
    curl -s -X POST "http://localhost:8081/realms/balconazo/protocol/openid-connect/token" \
        -d "client_id=balconazo-frontend" \
        -d "grant_type=password" \
        -d "username=$user" \
        -d "password=$pass" | jq -r '.access_token'
}

# Funcion para hacer request
api_call() {
    local method=$1
    local endpoint=$2
    local token=$3
    local data=$4
    local description=$5
    
    printf "%-50s" "$description"
    
    local curl_opts="-s -w \n%{http_code}"
    
    if [ -n "$data" ]; then
        response=$(curl $curl_opts -X "$method" "$BASE_URL$endpoint" \
            -H "Authorization: Bearer $token" \
            -H "Content-Type: application/json" \
            -d "$data")
    elif [ -n "$token" ]; then
        response=$(curl $curl_opts -X "$method" "$BASE_URL$endpoint" \
            -H "Authorization: Bearer $token")
    else
        response=$(curl $curl_opts -X "$method" "$BASE_URL$endpoint")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [[ "$http_code" =~ ^2 ]]; then
        echo -e "${GREEN}[OK] HTTP $http_code${NC}"
    elif [[ "$http_code" =~ ^4 ]]; then
        echo -e "${YELLOW}[WARN] HTTP $http_code${NC}"
    else
        echo -e "${RED}[FAIL] HTTP $http_code${NC}"
    fi
    
    if [ "$VERBOSE" = true ]; then
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
        echo ""
    fi
}

case $COMMAND in
    quick)
        echo ""
        echo -e "${BLUE}=== TEST RAPIDO DE CONECTIVIDAD ===${NC}"
        echo ""
        
        api_call "GET" "/__health" "" "" "KrakenD Health"
        api_call "GET" "/api/spaces" "" "" "Listar espacios (publico)"
        
        echo ""
        echo "Para tests completos usa: $0 all"
        ;;
        
    users)
        echo ""
        echo -e "${BLUE}=== TEST USERS SERVICE ===${NC}"
        echo ""
        
        if [ -z "$TOKEN" ]; then
            echo "Obteniendo token..."
            TOKEN=$(get_token "user_guest" "guest123")
        fi
        
        api_call "GET" "/api/users/me" "$TOKEN" "" "GET /api/users/me"
        api_call "PUT" "/api/users/me" "$TOKEN" '{"name":"Test","surname":"User"}' "PUT /api/users/me"
        api_call "GET" "/api/users/me" "" "" "GET /api/users/me (sin token)"
        ;;
        
    spaces)
        echo ""
        echo -e "${BLUE}=== TEST SPACES SERVICE ===${NC}"
        echo ""
        
        if [ -z "$TOKEN" ]; then
            echo "Obteniendo token de host..."
            TOKEN=$(get_token "host_demo" "host123")
        fi
        
        api_call "GET" "/api/spaces" "" "" "GET /api/spaces (publico)"
        api_call "GET" "/api/spaces?city=Madrid" "" "" "GET /api/spaces?city=Madrid"
        api_call "GET" "/api/spaces/my" "$TOKEN" "" "GET /api/spaces/my (mis espacios)"
        
        SPACE_DATA='{"title":"Test Space","description":"Descripcion de mas de veinte caracteres para el test","pricePerHour":50,"capacity":10,"city":"Madrid"}'
        api_call "POST" "/api/spaces" "$TOKEN" "$SPACE_DATA" "POST /api/spaces (crear)"
        ;;
        
    bookings)
        echo ""
        echo -e "${BLUE}=== TEST BOOKINGS SERVICE ===${NC}"
        echo ""
        
        if [ -z "$TOKEN" ]; then
            echo "Obteniendo token..."
            TOKEN=$(get_token "user_guest" "guest123")
        fi
        
        api_call "GET" "/api/bookings/me" "$TOKEN" "" "GET /api/bookings/me"
        
        # Obtener un space ID para crear reserva
        SPACE_ID=$(curl -s "$BASE_URL/api/spaces" | jq -r '.content[0].id // empty')
        if [ -n "$SPACE_ID" ]; then
            BOOKING_DATA="{\"spaceId\":\"$SPACE_ID\",\"startTime\":\"2025-12-20T10:00:00\",\"endTime\":\"2025-12-20T12:00:00\"}"
            api_call "POST" "/api/bookings" "$TOKEN" "$BOOKING_DATA" "POST /api/bookings (crear reserva)"
        else
            echo -e "${YELLOW}No hay espacios disponibles para probar reservas${NC}"
        fi
        ;;
        
    all)
        echo ""
        echo -e "${BLUE}Ejecutando test completo...${NC}"
        echo ""
        "$SCRIPT_DIR/test-backend.sh"
        ;;
esac
