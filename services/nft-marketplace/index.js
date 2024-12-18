const express = require('express');
const mongoose = require('mongoose');
const Web3 = require('web3');
const { ethers } = require('ethers');
const multer = require('multer');
const { Web3Storage } = require('web3.storage');

const app = express();
app.use(express.json());

// Esquema de NFT
const NFTSchema = new mongoose.Schema({
    name: String,
    description: String,
    imageUrl: String,
    creator: String,
    owner: String,
    price: Number,
    tokenId: String,
    createdAt: { type: Date, default: Date.now }
});

const NFT = mongoose.model('NFT', NFTSchema);

// Configuración de Web3 Storage para IPFS
const web3StorageClient = new Web3Storage({ 
    token: process.env.WEB3_STORAGE_TOKEN 
});

// Configuración de almacenamiento de archivos
const upload = multer({ 
    dest: 'uploads/',
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Rutas de Marketplace
app.post('/nft/create', upload.single('image'), async (req, res) => {
    try {
        const { name, description, price, creator } = req.body;
        const file = req.file;

        // Subir imagen a IPFS
        const fileBuffer = await fs.promises.readFile(file.path);
        const fileToUpload = [
            new File([fileBuffer], file.originalname)
        ];
        const cid = await web3StorageClient.put(fileToUpload);
        const imageUrl = `https://${cid}.ipfs.dweb.link/${file.originalname}`;

        // Crear NFT en blockchain
        const nftContract = new web3.eth.Contract(
            require('./NFTMarketplace.json').abi,
            process.env.NFT_MARKETPLACE_ADDRESS
        );

        const tokenId = await nftContract.methods.mintNFT(
            creator, 
            imageUrl, 
            web3.utils.toWei(price.toString(), 'ether')
        ).send({ from: creator });

        // Guardar en base de datos
        const nft = new NFT({
            name,
            description,
            imageUrl,
            creator,
            owner: creator,
            price,
            tokenId
        });

        await nft.save();

        res.json({ 
            message: 'NFT created successfully', 
            nft: nft,
            tokenId: tokenId
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/nft/marketplace', async (req, res) => {
    try {
        const nfts = await NFT.find({ owner: { $ne: null } });
        res.json(nfts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
    console.log(`NFT Marketplace service running on port ${PORT}`);
});
