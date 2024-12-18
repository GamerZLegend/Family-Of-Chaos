const express = require('express');
const mongoose = require('mongoose');
const Web3 = require('web3');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const web3 = new Web3(process.env.WEB3_PROVIDER);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Modelo de NFT
const NFTSchema = new mongoose.Schema({
  tokenId: { type: String, required: true, unique: true },
  owner: { type: String, required: true },
  metadata: {
    name: String,
    description: String,
    image: String,
    attributes: [{ trait_type: String, value: String }]
  },
  price: { type: Number },
  forSale: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const NFT = mongoose.model('NFT', NFTSchema);

// Rutas
app.post('/nft/mint', async (req, res) => {
  try {
    const { tokenId, owner, metadata } = req.body;
    const nft = new NFT({
      tokenId,
      owner,
      metadata
    });
    await nft.save();
    res.json(nft);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear NFT' });
  }
});

app.get('/nft/list', async (req, res) => {
  try {
    const nfts = await NFT.find({ forSale: true });
    res.json(nfts);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener NFTs' });
  }
});

app.post('/nft/:tokenId/list', async (req, res) => {
  try {
    const { price } = req.body;
    const nft = await NFT.findOne({ tokenId: req.params.tokenId });
    if (!nft) {
      return res.status(404).json({ error: 'NFT no encontrado' });
    }
    nft.price = price;
    nft.forSale = true;
    await nft.save();
    res.json(nft);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar NFT' });
  }
});

app.post('/nft/:tokenId/buy', async (req, res) => {
  try {
    const { buyer } = req.body;
    const nft = await NFT.findOne({ tokenId: req.params.tokenId });
    if (!nft) {
      return res.status(404).json({ error: 'NFT no encontrado' });
    }
    if (!nft.forSale) {
      return res.status(400).json({ error: 'NFT no está a la venta' });
    }
    nft.owner = buyer;
    nft.forSale = false;
    nft.price = null;
    await nft.save();
    res.json(nft);
  } catch (error) {
    res.status(500).json({ error: 'Error al comprar NFT' });
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
const PORT = process.env.NFT_PORT || 3003;
app.listen(PORT, () => {
  console.log(`Servicio NFT Marketplace ejecutándose en el puerto ${PORT}`);
});
