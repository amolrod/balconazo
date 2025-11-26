#!/bin/bash
# ===========================================
# CLEAN - BALCONAZO
# Limpieza completa del proyecto
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

LEVEL="soft"

usage() {
    echo "Uso: $0 [nivel]"
    echo ""
    echo "Niveles de limpieza:"
    echo "  soft     - Detener contenedores (default)"
    echo "  medium   - Detener y eliminar contenedores"
    echo "  hard     - Eliminar contenedores, volumenes y redes"
    echo "  nuclear  - Todo lo anterior + imagenes del proyecto"
    echo ""
    echo "Opciones:"
    echo "  -h, --help   Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  $0              # Limpieza soft"
    echo "  $0 medium       # Limpieza medium"
    echo "  $0 hard         # Limpieza hard (elimina datos)"
}

case "${1:-soft}" in
    soft|medium|hard|nuclear)
        LEVEL="$1"
        ;;
    -h|--help)
        usage
        exit 0
        ;;
    *)
        echo "Nivel desconocido: $1"
        usage
        exit 1
        ;;
esac

cd "$PROJECT_DIR"

echo ""
echo "==========================================="
echo "     LIMPIEZA BALCONAZO - Nivel: $LEVEL"
echo "==========================================="
echo ""

case $LEVEL in
    soft)
        echo -e "${BLUE}Deteniendo contenedores...${NC}"
        docker compose stop
        echo -e "${GREEN}Contenedores detenidos${NC}"
        ;;
        
    medium)
        echo -e "${BLUE}Deteniendo y eliminando contenedores...${NC}"
        docker compose down
        echo -e "${GREEN}Contenedores eliminados${NC}"
        ;;
        
    hard)
        echo -e "${YELLOW}ATENCION: Esto eliminara TODOS los datos de las bases de datos${NC}"
        read -p "Continuar? (s/N): " confirm
        if [ "$confirm" != "s" ] && [ "$confirm" != "S" ]; then
            echo "Cancelado"
            exit 0
        fi
        
        echo -e "${BLUE}Eliminando contenedores, volumenes y redes...${NC}"
        docker compose down -v --remove-orphans
        echo -e "${GREEN}Limpieza completada${NC}"
        ;;
        
    nuclear)
        echo -e "${RED}ATENCION: Esto eliminara TODO incluyendo imagenes Docker${NC}"
        echo -e "${RED}Tendras que reconstruir todo desde cero${NC}"
        read -p "Estas SEGURO? (escribe 'ELIMINAR' para confirmar): " confirm
        if [ "$confirm" != "ELIMINAR" ]; then
            echo "Cancelado"
            exit 0
        fi
        
        echo -e "${BLUE}Eliminando todo...${NC}"
        docker compose down -v --remove-orphans --rmi local
        
        # Eliminar imagenes del proyecto
        echo -e "${BLUE}Eliminando imagenes del proyecto...${NC}"
        docker images | grep -E "balconazo|balconazo_app" | awk '{print $3}' | xargs -r docker rmi -f 2>/dev/null || true
        
        # Limpiar cache de Maven
        echo -e "${BLUE}Limpiando cache de Maven...${NC}"
        for service in users-service spaces-service bookings-service; do
            rm -rf "$PROJECT_DIR/backend/$service/target" 2>/dev/null || true
        done
        
        # Limpiar node_modules del frontend
        echo -e "${BLUE}Limpiando node_modules...${NC}"
        rm -rf "$PROJECT_DIR/frontend/node_modules" 2>/dev/null || true
        rm -rf "$PROJECT_DIR/frontend/.next" 2>/dev/null || true
        
        echo -e "${GREEN}Limpieza nuclear completada${NC}"
        ;;
esac

echo ""
echo "==========================================="
echo -e "${GREEN}     LIMPIEZA COMPLETADA${NC}"
echo "==========================================="
echo ""

# Mostrar estado actual
echo "Estado de contenedores Docker:"
docker ps -a --filter "name=balconazo" --filter "name=postgres-" --filter "name=keycloak" --filter "name=krakend" --format "table {{.Names}}\t{{.Status}}" 2>/dev/null || echo "Sin contenedores"
