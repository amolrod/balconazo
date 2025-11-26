#!/bin/bash
# ===========================================
# LOGS - BALCONAZO
# Ver logs de los servicios
# ===========================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Servicios disponibles
SERVICES=("users-service" "spaces-service" "bookings-service" "keycloak" "krakend" "postgres-users" "postgres-spaces" "postgres-bookings")

FOLLOW=false
LINES=100
SERVICE=""

usage() {
    echo "Uso: $0 [opciones] [servicio]"
    echo ""
    echo "Servicios disponibles:"
    echo "  users-service, spaces-service, bookings-service"
    echo "  keycloak, krakend"
    echo "  postgres-users, postgres-spaces, postgres-bookings"
    echo "  all (todos los servicios)"
    echo ""
    echo "Opciones:"
    echo "  -f, --follow     Seguir logs en tiempo real"
    echo "  -n, --lines N    Numero de lineas a mostrar (default: 100)"
    echo "  -e, --errors     Mostrar solo errores (ERROR|Exception|WARN)"
    echo "  -h, --help       Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  $0 users-service           # Ver ultimas 100 lineas"
    echo "  $0 -f users-service        # Seguir logs en tiempo real"
    echo "  $0 -n 500 spaces-service   # Ver ultimas 500 lineas"
    echo "  $0 -f all                  # Seguir todos los servicios"
    echo "  $0 -e users-service        # Solo errores de users-service"
}

ERRORS_ONLY=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -f|--follow) FOLLOW=true; shift ;;
        -n|--lines) LINES="$2"; shift 2 ;;
        -e|--errors) ERRORS_ONLY=true; shift ;;
        -h|--help) usage; exit 0 ;;
        -*) echo "Opcion desconocida: $1"; usage; exit 1 ;;
        *) SERVICE="$1"; shift ;;
    esac
done

if [ -z "$SERVICE" ]; then
    echo "ERROR: Especifica un servicio"
    echo ""
    usage
    exit 1
fi

cd "$PROJECT_DIR"

# Construir comando
CMD="docker compose logs"

if [ "$FOLLOW" = true ]; then
    CMD="$CMD -f"
fi

CMD="$CMD --tail=$LINES"

if [ "$SERVICE" != "all" ]; then
    # Verificar que el servicio existe
    valid=false
    for s in "${SERVICES[@]}"; do
        if [ "$s" == "$SERVICE" ]; then
            valid=true
            break
        fi
    done
    
    if [ "$valid" = false ]; then
        echo "ERROR: Servicio '$SERVICE' no reconocido"
        echo ""
        echo "Servicios validos: ${SERVICES[*]}"
        exit 1
    fi
    
    CMD="$CMD $SERVICE"
fi

echo -e "${BLUE}Mostrando logs de: ${SERVICE}${NC}"
echo -e "${BLUE}Lineas: $LINES${NC}"
if [ "$FOLLOW" = true ]; then
    echo -e "${BLUE}Modo: Seguimiento (Ctrl+C para salir)${NC}"
fi
echo ""

if [ "$ERRORS_ONLY" = true ]; then
    $CMD 2>&1 | grep -E "(ERROR|Exception|WARN|error|exception|warn)" --color=always
else
    $CMD
fi
