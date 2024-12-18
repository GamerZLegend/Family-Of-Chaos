# Family of Chaos - Arquitectura del Sistema

## Visión General

Family of Chaos es una plataforma social descentralizada que combina tecnología blockchain, microservicios y gamificación para crear una experiencia única de interacción social.

## Componentes Principales

### 1. Frontend
- **Tecnología**: React + TypeScript
- **Características**:
  - Integración con Web3 para interacción blockchain
  - Chat en tiempo real con WebSocket
  - Interfaz moderna con TailwindCSS
  - Sistema de recompensas gamificado

### 2. Backend
- **Tecnología**: Node.js + Express
- **Servicios**:
  - API RESTful
  - WebSocket para comunicación en tiempo real
  - Integración con MongoDB y Redis
  - Sistema de caché distribuido

### 3. Servicios

#### Auth Service
- Autenticación Web3
- Gestión de JWT
- Control de acceso y permisos

#### Rewards Service
- Sistema de puntos y logros
- Distribución de recompensas
- Integración con smart contracts

#### NFT Marketplace
- Creación y gestión de NFTs
- Sistema de compra/venta
- Integración con IPFS

### 4. Smart Contracts

#### ChaosToken (ERC20)
- Token nativo de la plataforma
- Sistema de recompensas
- Gobernanza descentralizada

#### ChaosNFT (ERC721)
- NFTs personalizados
- Marketplace integrado
- Metadatos en IPFS

## Infraestructura

### Base de Datos
- **MongoDB**: Datos principales
- **Redis**: Caché y sesiones

### Almacenamiento
- **IPFS**: Contenido descentralizado
- **MongoDB GridFS**: Archivos grandes

### Despliegue
- **Docker**: Contenedorización
- **Docker Compose**: Orquestación local
- **GitHub Actions**: CI/CD

## Seguridad

### Autenticación
- Web3 para autenticación principal
- JWT para sesiones
- Firmas de mensajes para verificación

### Protección
- Rate limiting
- CORS configurado
- Headers de seguridad con Helmet
- Sanitización de entrada

## Escalabilidad

### Horizontal
- Microservicios independientes
- Caché distribuida
- Base de datos replicada

### Vertical
- Optimización de consultas
- Índices eficientes
- Compresión de datos

## Monitoreo

### Logs
- Winston para logging
- Rotación de logs
- Niveles de severidad

### Métricas
- Latencia de servicios
- Uso de recursos
- Transacciones blockchain

## Flujo de Desarrollo

1. **Local**:
   - `pnpm install`
   - `docker compose up`
   - Tests unitarios

2. **CI/CD**:
   - Push a GitHub
   - GitHub Actions
   - Tests automáticos
   - Build de Docker
   - Despliegue automático

## Variables de Entorno

Configuradas en `.env`:
- Conexiones de DB
- Claves API
- Configuración de servicios
- Endpoints de blockchain
