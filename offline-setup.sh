#!/bin/bash

set -e

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🚀 Family of Chaos - Configuración Offline${NC}"

# Crear directorios necesarios
echo -e "${GREEN}Creando estructura de directorios...${NC}"
mkdir -p \
    frontend/src/{components,hooks,contexts,pages} \
    backend/src/{routes,models,middleware} \
    services/{auth,rewards,nft-marketplace}/src \
    packages/{contracts,shared}

# Copiar archivos de configuración
echo -e "${GREEN}Copiando archivos de configuración...${NC}"
cp .env.example .env

# Configurar Git
echo -e "${GREEN}Configurando Git...${NC}"
git init
echo "node_modules/" > .gitignore
echo "dist/" >> .gitignore
echo ".env" >> .gitignore
echo "*.log" >> .gitignore

echo -e "${GREEN}✅ Configuración básica completada${NC}"
echo -e "Por favor, sigue estos pasos:"
echo -e "1. Revisa y configura el archivo .env"
echo -e "2. Instala las dependencias cuando tengas conexión"
echo -e "3. Ejecuta 'docker compose up' para iniciar los servicios"
