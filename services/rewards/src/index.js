const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Modelo de Recompensa
const RewardSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { type: String, required: true },
  amount: { type: Number, required: true },
  description: String,
  claimed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Reward = mongoose.model('Reward', RewardSchema);

// Rutas
app.post('/rewards/earn', async (req, res) => {
  try {
    const { userId, type, amount, description } = req.body;
    const reward = new Reward({
      userId,
      type,
      amount,
      description
    });
    await reward.save();
    res.json(reward);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear recompensa' });
  }
});

app.get('/rewards/user/:userId', async (req, res) => {
  try {
    const rewards = await Reward.find({ userId: req.params.userId });
    res.json(rewards);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener recompensas' });
  }
});

app.post('/rewards/claim/:rewardId', async (req, res) => {
  try {
    const reward = await Reward.findById(req.params.rewardId);
    if (!reward) {
      return res.status(404).json({ error: 'Recompensa no encontrada' });
    }
    if (reward.claimed) {
      return res.status(400).json({ error: 'Recompensa ya reclamada' });
    }
    reward.claimed = true;
    await reward.save();
    res.json(reward);
  } catch (error) {
    res.status(500).json({ error: 'Error al reclamar recompensa' });
  }
});

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error conectando a MongoDB:', err));

// Puerto
const PORT = process.env.REWARDS_PORT || 3002;
app.listen(PORT, () => {
  console.log(`Servicio de recompensas ejecutándose en el puerto ${PORT}`);
});
