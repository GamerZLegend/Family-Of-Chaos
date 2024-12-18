const express = require('express');
const mongoose = require('mongoose');
const Web3 = require('web3');
const { ethers } = require('ethers');

const app = express();
app.use(express.json());

// Esquema de Usuario con Puntos
const UserSchema = new mongoose.Schema({
    walletAddress: { type: String, unique: true },
    totalPoints: { type: Number, default: 0 },
    achievements: [{ 
        name: String, 
        points: Number, 
        dateEarned: { type: Date, default: Date.now } 
    }]
});

const User = mongoose.model('RewardsUser', UserSchema);

// Configuración de Web3
const web3 = new Web3(process.env.WEB3_PROVIDER);
const chaosTokenContract = new web3.eth.Contract(
    require('./ChaosToken.json').abi, 
    process.env.CHAOS_TOKEN_ADDRESS
);

// Sistema de Logros
const ACHIEVEMENTS = {
    FIRST_MESSAGE: { name: 'First Message', points: 50 },
    DAILY_CHAT: { name: 'Daily Chatter', points: 20 },
    NFT_TRADE: { name: 'NFT Trader', points: 100 }
};

// Rutas de Recompensas
app.post('/rewards/claim', async (req, res) => {
    const { walletAddress, achievementType } = req.body;
    
    try {
        const achievement = ACHIEVEMENTS[achievementType];
        if (!achievement) {
            return res.status(400).json({ error: 'Invalid achievement' });
        }

        let user = await User.findOne({ walletAddress });
        if (!user) {
            user = new User({ walletAddress });
        }

        user.totalPoints += achievement.points;
        user.achievements.push({
            name: achievement.name,
            points: achievement.points
        });

        await user.save();

        // Mintear tokens en el contrato
        await chaosTokenContract.methods.claimReward(achievement.points)
            .send({ from: walletAddress });

        res.json({
            message: 'Reward claimed successfully',
            points: achievement.points,
            totalPoints: user.totalPoints
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/rewards/user/:walletAddress', async (req, res) => {
    const { walletAddress } = req.params;
    
    try {
        const user = await User.findOne({ walletAddress });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            totalPoints: user.totalPoints,
            achievements: user.achievements
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Rewards service running on port ${PORT}`);
});
