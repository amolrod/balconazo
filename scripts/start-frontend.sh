#!/bin/bash
# ===========================================
# START FRONTEND - BALCONAZO
# Iniciar el frontend en modo desarrollo
# ===========================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
FRONTEND_DIR="$PROJECT_DIR/frontend"

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

usage() {
    echo "Uso: $0 [opciones]"
    echo ""
    echo "Opciones:"
    echo "  -i, --install    Instalar dependencias antes de iniciar"
    echo "  -b, --build      Hacer build de produccion"
    echo "  -p, --port PORT  Puerto (default: 3000)"
    echo "  -h, --help       Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  $0               # Iniciar en modo dev"
    echo "  $0 -i            # Instalar deps e iniciar"
    echo "  $0 -b            # Build de produccion"
}

INSTALL=false
BUILD=false
PORT=3000

while [[ $# -gt 0 ]]; do
    case $1 in
        -i|--install) INSTALL=true; shift ;;
        -b|--build) BUILD=true; shift ;;
        -p|--port) PORT="$2"; shift 2 ;;
        -h|--help) usage; exit 0 ;;
        *) echo "Opcion desconocida: $1"; usage; exit 1 ;;
    esac
done

cd "$FRONTEND_DIR"

echo ""
echo "==========================================="
echo "     FRONTEND BALCONAZO"
echo "==========================================="
echo ""

# Verificar que bun esta instalado
if ! command -v bun &> /dev/null; then
    echo -e "${RED}ERROR: Bun no esta instalado${NC}"
    echo "Instala Bun con: curl -fsSL https://bun.sh/install | bash"
    exit 1
fi

# Verificar backend
echo -e "${BLUE}Verificando backend...${NC}"
if ! curl -s "http://localhost:8080/__health" > /dev/null 2>&1; then
    echo -e "${YELLOW}ADVERTENCIA: El backend no parece estar corriendo${NC}"
    echo "Ejecuta: ./scripts/deploy.sh"
    echo ""
    read -p "Continuar de todos modos? (s/N): " confirm
    if [ "$confirm" != "s" ] && [ "$confirm" != "S" ]; then
        exit 1
    fi
fi

# Instalar dependencias si es necesario
if [ "$INSTALL" = true ] || [ ! -d "node_modules" ]; then
    echo -e "${BLUE}Instalando dependencias...${NC}"
    bun install
    echo -e "${GREEN}Dependencias instaladas${NC}"
fi

# Build o dev
if [ "$BUILD" = true ]; then
    echo -e "${BLUE}Construyendo para produccion...${NC}"
    bun run build
    echo -e "${GREEN}Build completado${NC}"
    echo ""
    echo "Para iniciar en produccion:"
    echo "  bun run start"
else
    echo -e "${BLUE}Iniciando servidor de desarrollo...${NC}"
    echo ""
    echo "URL: http://localhost:$PORT"
    echo "Keycloak: http://localhost:8081"
    echo "API: http://localhost:8080"
    echo ""
    echo -e "${YELLOW}Presiona Ctrl+C para detener${NC}"
    echo ""
    
    PORT=$PORT bun run dev
fi
