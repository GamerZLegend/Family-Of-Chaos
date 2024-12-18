#!/bin/bash

# Configuración de entorno seguro
set -euo pipefail
export TERM=${TERM:-xterm}

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Función de log
log() {
    echo -e "${GREEN}[FAMILY OF CHAOS SETUP]${NC} $1"
}

# Función de error
error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Verificar requisitos
check_requirements() {
    log "Verificando requisitos..."
    
    # Verificar Docker
    command -v docker >/dev/null 2>&1 || error "Docker no está instalado"
    
    # Verificar Docker Compose
    docker compose version >/dev/null 2>&1 || error "Docker Compose no está instalado"
    
    # Verificar PNPM
    if ! command -v pnpm >/dev/null 2>&1; then
        log "Instalando PNPM..."
        npm install -g pnpm || error "No se pudo instalar PNPM"
    fi
}

# Configurar variables de entorno
setup_env() {
    log "Configurando variables de entorno..."
    
    if [ ! -f .env ]; then
        cp .env.example .env
        echo -e "${YELLOW}⚠️ Por favor, revisa y configura .env manualmente${NC}"
    fi
}

# Instalación de dependencias
install_dependencies() {
    log "Instalando dependencias del proyecto..."
    pnpm install || error "Fallo en la instalación de dependencias"
    pnpm recursive install || error "Fallo en la instalación recursiva"
}

# Construcción de servicios
build_services() {
    log "Construyendo servicios..."
    pnpm run build || error "Fallo en la construcción de servicios"
}

# Despliegue con Docker
deploy_docker() {
    log "Desplegando servicios con Docker Compose..."
    docker compose up -d --build || error "Fallo en el despliegue de Docker"
}

# Verificación de servicios
verify_services() {
    log "Verificando estado de servicios..."
    docker compose ps || error "No se pudieron verificar los servicios"
    docker compose logs --tail=50
}

# Función principal
main() {
    clear
    echo -e "${GREEN}🚀 Family of Chaos - Instalación y Despliegue${NC}"
    
    check_requirements
    setup_env
    install_dependencies
    build_services
    deploy_docker
    verify_services

    echo -e "\n${GREEN}✅ Instalación completada exitosamente!${NC}"
    echo -e "${YELLOW}Accede a la aplicación en:${NC}"
    echo -e "- Frontend: http://familyofchaos.local"
    echo -e "- Backend API: http://api.familyofchaos.local"
    echo -e "- Auth Service: http://auth.familyofchaos.local"
}

# Capturar errores
trap 'error "Script interrumpido inesperadamente"' ERR

# Ejecutar script
main
