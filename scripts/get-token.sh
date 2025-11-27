#!/bin/bash
# ===========================================
# GET TOKEN - BALCONAZO
# Obtener token JWT de Keycloak para testing
# ===========================================

set -e

KEYCLOAK_URL="http://localhost:8081"
REALM="balconazo"
CLIENT_ID="balconazo-frontend"

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Usuarios predefinidos
USER="user_guest"
PASSWORD="guest123"

usage() {
    echo "Uso: $0 [opciones]"
    echo ""
    echo "Usuarios predefinidos:"
    echo "  guest    - user_guest / guest123 (ROLE_USER)"
    echo "  host     - host_demo / host123 (ROLE_USER, ROLE_HOST)"
    echo "  admin    - admin_host / admin123 (ROLE_USER, ROLE_HOST, ROLE_ADMIN)"
    echo ""
    echo "Opciones:"
    echo "  -u, --user USERNAME      Usuario personalizado"
    echo "  -p, --password PASSWORD  Password personalizado"
    echo "  -d, --decode             Decodificar el token (requiere jq)"
    echo "  -c, --copy               Copiar token al portapapeles (macOS)"
    echo "  -e, --export             Imprimir export para variable de entorno"
    echo "  -h, --help               Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  $0 guest                 # Token de user_guest"
    echo "  $0 host -c               # Token de host_demo, copiar al clipboard"
    echo "  $0 -u miusuario -p pass  # Usuario personalizado"
    echo "  $0 admin -e              # Imprimir export ACCESS_TOKEN=..."
}

DECODE=false
COPY=false
EXPORT=false

while [[ $# -gt 0 ]]; do
    case $1 in
        guest)
            USER="user_guest"
            PASSWORD="guest123"
            shift
            ;;
        host)
            USER="host_demo"
            PASSWORD="host123"
            shift
            ;;
        admin)
            USER="admin_host"
            PASSWORD="admin123"
            shift
            ;;
        -u|--user)
            USER="$2"
            shift 2
            ;;
        -p|--password)
            PASSWORD="$2"
            shift 2
            ;;
        -d|--decode)
            DECODE=true
            shift
            ;;
        -c|--copy)
            COPY=true
            shift
            ;;
        -e|--export)
            EXPORT=true
            shift
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *)
            echo "Opcion desconocida: $1"
            usage
            exit 1
            ;;
    esac
done

# Verificar que Keycloak esta disponible
if ! curl -s "$KEYCLOAK_URL/health/ready" > /dev/null 2>&1; then
    echo -e "${RED}ERROR: Keycloak no esta disponible en $KEYCLOAK_URL${NC}"
    exit 1
fi

# Obtener token
response=$(curl -s -X POST "$KEYCLOAK_URL/realms/$REALM/protocol/openid-connect/token" \
    -d "client_id=$CLIENT_ID" \
    -d "grant_type=password" \
    -d "username=$USER" \
    -d "password=$PASSWORD")

ACCESS_TOKEN=$(echo "$response" | jq -r '.access_token')

if [ "$ACCESS_TOKEN" == "null" ] || [ -z "$ACCESS_TOKEN" ]; then
    error=$(echo "$response" | jq -r '.error_description // .error // "Error desconocido"')
    echo -e "${RED}ERROR: No se pudo obtener token${NC}"
    echo "Detalle: $error"
    exit 1
fi

# Output segun opciones
if [ "$EXPORT" = true ]; then
    echo "export ACCESS_TOKEN=\"$ACCESS_TOKEN\""
elif [ "$COPY" = true ]; then
    echo "$ACCESS_TOKEN" | pbcopy
    echo -e "${GREEN}Token copiado al portapapeles${NC}"
    echo -e "Usuario: ${BLUE}$USER${NC}"
else
    echo -e "${GREEN}Token obtenido para: ${BLUE}$USER${NC}"
    echo ""
    echo "$ACCESS_TOKEN"
fi

# Decodificar si se solicito
if [ "$DECODE" = true ]; then
    echo ""
    echo -e "${BLUE}--- Payload decodificado ---${NC}"
    echo "$ACCESS_TOKEN" | cut -d'.' -f2 | base64 -d 2>/dev/null | jq '.' 2>/dev/null || echo "(Error decodificando)"
fi

# Mostrar info del token
if [ "$EXPORT" = false ]; then
    expires_in=$(echo "$response" | jq -r '.expires_in')
    echo ""
    echo -e "${YELLOW}Expira en: ${expires_in}s${NC}"
fi
