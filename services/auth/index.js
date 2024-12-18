require('dotenv').config();
const express = require('express');
const Web3 = require('web3');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Esquema de Usuario
const UserSchema = new mongoose.Schema({
  walletAddress: { type: String, unique: true },
  username: String,
  roles: [String],
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

// Inicializar Web3
const web3 = new Web3(process.env.WEB3_PROVIDER);

// Middleware de autenticación
const authenticateWeb3 = async (req, res, next) => {
  const { signature, message, walletAddress } = req.body;

  try {
    // Verificar firma
    const recoveredAddress = web3.eth.accounts.recover(message, signature);
    
    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Buscar o crear usuario
    let user = await User.findOne({ walletAddress });
    if (!user) {
      user = new User({ 
        walletAddress, 
        username: `User_${walletAddress.slice(0, 6)}`,
        roles: ['user'] 
      });
      await user.save();
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: user._id, 
        walletAddress: user.walletAddress,
        roles: user.roles 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Rutas
app.post('/auth/web3', authenticateWeb3, (req, res) => {
  res.json({
    token: req.token,
    user: {
      id: req.user._id,
      walletAddress: req.user.walletAddress,
      username: req.user.username
    }
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
