const express = require('express');
const jwt = require('jsonwebtoken');
const Web3 = require('web3');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const web3 = new Web3(process.env.WEB3_PROVIDER);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Verificar firma de Ethereum
const verifySignature = (message, signature, address) => {
  try {
    const recoveredAddress = web3.eth.accounts.recover(message, signature);
    return recoveredAddress.toLowerCase() === address.toLowerCase();
  } catch (error) {
    return false;
  }
};

// Ruta de autenticación Web3
app.post('/auth/web3', async (req, res) => {
  try {
    const { message, signature, address } = req.body;

    if (!message || !signature || !address) {
      return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }

    const isValid = verifySignature(message, signature, address);
    if (!isValid) {
      return res.status(401).json({ error: 'Firma inválida' });
    }

    // Generar JWT
    const token = jwt.sign(
      { address, type: 'web3' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    res.json({ token });
  } catch (error) {
    console.error('Error en autenticación:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Middleware de verificación de JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// Ruta protegida de ejemplo
app.get('/auth/me', verifyToken, (req, res) => {
  res.json({ user: req.user });
});

// Puerto
const PORT = process.env.AUTH_PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servicio de autenticación ejecutándose en el puerto ${PORT}`);
});
