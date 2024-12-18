const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const winston = require('winston');

// Configuración del logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => logger.info('Conectado a MongoDB'))
.catch(err => logger.error('Error conectando a MongoDB:', err));

// Rutas básicas
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Manejo de errores
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('¡Algo salió mal!');
});

// Puerto
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  logger.info(`Servidor ejecutándose en el puerto ${PORT}`);
});
