import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);
// ... existing io setup ...
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST']
  }
});

import apiRoutes from './routes/api.js';
import authRoutes from './routes/auth.js';
import generateRoutes from './routes/generate.js';

// Middleware
app.use(cors({ 
  origin: process.env.CLIENT_URL || '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Main API Routes
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/generate', generateRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('AI Handwritten Text Enhancer API is running...');
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Collaboration logic placeholder
  socket.on('join-document', (documentId) => {
    socket.join(documentId);
    console.log(`Socket ${socket.id} joined document ${documentId}`);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
