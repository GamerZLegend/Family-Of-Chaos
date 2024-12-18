#!/bin/bash

set -e

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Verificar si es Arch Linux
if [ ! -f /etc/arch-release ]; then
    echo -e "${RED}Este script está diseñado para sistemas Arch Linux${NC}"
    exit 1
fi

# Función para manejar errores
handle_error() {
    echo -e "${RED}Error: $1${NC}"
    exit 1
}

# Actualizar sistema
sudo pacman -Syu --noconfirm || handle_error "No se pudo actualizar el sistema"

# Instalar Docker
sudo pacman -S --noconfirm docker docker-compose || handle_error "No se pudo instalar Docker"
sudo systemctl enable docker.service
sudo systemctl start docker.service

# Instalar Node.js y NPM
sudo pacman -S --noconfirm nodejs npm || handle_error "No se pudo instalar Node.js"

# Instalar PNPM
sudo npm install -g pnpm || handle_error "No se pudo instalar PNPM"

# Añadir usuario al grupo docker
sudo usermod -aG docker $USER || handle_error "No se pudo añadir el usuario al grupo docker"

echo -e "${GREEN}✅ Instalación de requisitos completada exitosamente${NC}"
echo -e "${GREEN}Por favor, reinicia tu sistema para aplicar todos los cambios${NC}"
