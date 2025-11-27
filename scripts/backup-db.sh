#!/bin/bash
# ===========================================
# BACKUP DATABASE - BALCONAZO
# Crea backups de todas las bases de datos
# ===========================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="$PROJECT_DIR/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Bases de datos a respaldar
DATABASES=("users" "spaces" "bookings")

usage() {
    echo "Uso: $0 [opciones]"
    echo ""
    echo "Opciones:"
    echo "  -r, --restore FILE   Restaurar desde un backup"
    echo "  -l, --list           Listar backups disponibles"
    echo "  -c, --clean DAYS     Eliminar backups mas antiguos de N dias"
    echo "  -h, --help           Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  $0                         # Crear backup de todas las DBs"
    echo "  $0 -l                      # Listar backups"
    echo "  $0 -r backups/users_xxx    # Restaurar backup"
    echo "  $0 -c 30                   # Eliminar backups de mas de 30 dias"
}

list_backups() {
    echo ""
    echo "==========================================="
    echo "     BACKUPS DISPONIBLES"
    echo "==========================================="
    echo ""
    
    if [ ! -d "$BACKUP_DIR" ]; then
        echo "No existe directorio de backups"
        exit 0
    fi
    
    for db in "${DATABASES[@]}"; do
        echo -e "${BLUE}--- $db ---${NC}"
        ls -lh "$BACKUP_DIR"/${db}_*.sql.gz 2>/dev/null || echo "  Sin backups"
        echo ""
    done
}

restore_backup() {
    local backup_file=$1
    
    if [ ! -f "$backup_file" ]; then
        echo -e "${RED}ERROR: Archivo no encontrado: $backup_file${NC}"
        exit 1
    fi
    
    # Detectar que base de datos es
    local db_name=""
    for db in "${DATABASES[@]}"; do
        if [[ "$backup_file" == *"${db}_"* ]]; then
            db_name=$db
            break
        fi
    done
    
    if [ -z "$db_name" ]; then
        echo -e "${RED}ERROR: No se pudo detectar la base de datos del archivo${NC}"
        exit 1
    fi
    
    local container="postgres-$db_name"
    local db_database="balconazo_$db_name"
    
    echo -e "${YELLOW}ATENCION: Esto sobreescribira la base de datos $db_database${NC}"
    read -p "Continuar? (s/N): " confirm
    if [ "$confirm" != "s" ] && [ "$confirm" != "S" ]; then
        echo "Cancelado"
        exit 0
    fi
    
    echo -e "${BLUE}Restaurando $backup_file en $db_database...${NC}"
    
    gunzip -c "$backup_file" | docker exec -i "$container" psql -U balconazo -d "$db_database"
    
    echo -e "${GREEN}Restauracion completada${NC}"
}

clean_old_backups() {
    local days=$1
    
    echo -e "${BLUE}Eliminando backups de mas de $days dias...${NC}"
    
    find "$BACKUP_DIR" -name "*.sql.gz" -mtime +$days -delete -print
    
    echo -e "${GREEN}Limpieza completada${NC}"
}

create_backups() {
    echo ""
    echo "==========================================="
    echo "     BACKUP BASES DE DATOS - $TIMESTAMP"
    echo "==========================================="
    echo ""
    
    # Crear directorio de backups
    mkdir -p "$BACKUP_DIR"
    
    for db in "${DATABASES[@]}"; do
        local container="postgres-$db"
        local db_database="balconazo_$db"
        local backup_file="$BACKUP_DIR/${db}_${TIMESTAMP}.sql.gz"
        
        printf "%-20s" "Respaldando $db..."
        
        # Verificar que el contenedor existe y esta corriendo
        if ! docker ps --format '{{.Names}}' | grep -q "^${container}$"; then
            echo -e "${RED}[ERROR] Contenedor $container no encontrado${NC}"
            continue
        fi
        
        # Crear backup
        docker exec "$container" pg_dump -U balconazo "$db_database" | gzip > "$backup_file"
        
        local size=$(ls -lh "$backup_file" | awk '{print $5}')
        echo -e "${GREEN}[OK] $size${NC}"
    done
    
    echo ""
    echo "==========================================="
    echo -e "${GREEN}     BACKUP COMPLETADO${NC}"
    echo "==========================================="
    echo ""
    echo "Ubicacion: $BACKUP_DIR"
    echo ""
    ls -lh "$BACKUP_DIR"/*_${TIMESTAMP}.sql.gz 2>/dev/null
}

# Parsear argumentos
case "${1:-}" in
    -l|--list)
        list_backups
        ;;
    -r|--restore)
        if [ -z "${2:-}" ]; then
            echo "ERROR: Especifica el archivo de backup"
            usage
            exit 1
        fi
        restore_backup "$2"
        ;;
    -c|--clean)
        if [ -z "${2:-}" ]; then
            echo "ERROR: Especifica el numero de dias"
            usage
            exit 1
        fi
        clean_old_backups "$2"
        ;;
    -h|--help)
        usage
        ;;
    "")
        create_backups
        ;;
    *)
        echo "Opcion desconocida: $1"
        usage
        exit 1
        ;;
esac
