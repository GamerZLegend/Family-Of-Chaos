require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const socketIo = require('socket.io');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Basic health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// In-memory storage for chat rooms (can be replaced with Redis later)
const chatRooms = new Map();

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Join a chat room
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);

    // Retrieve and send previous messages for the room
    const roomMessages = chatRooms.get(roomId) || [];
    socket.emit('room_history', roomMessages);
  });

  // Leave a chat room
  socket.on('leave_room', (roomId) => {
    socket.leave(roomId);
    console.log(`User left room: ${roomId}`);
  });
  
  // Handle chat messages
  socket.on('send_message', (messageData) => {
    const { roomId, message, sender, timestamp } = messageData;
    
    // Store message in room history
    const roomMessages = chatRooms.get(roomId) || [];
    roomMessages.push({ message, sender, timestamp });
    
    // Limit room history to last 100 messages
    if (roomMessages.length > 100) {
      roomMessages.shift();
    }
    
    chatRooms.set(roomId, roomMessages);
    
    // Broadcast message to all users in the room
    io.to(roomId).emit('receive_message', { message, sender, timestamp });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server is ready for connections`);
});
