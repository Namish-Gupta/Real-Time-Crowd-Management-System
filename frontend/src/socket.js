import { io } from 'socket.io-client';

// Backend server URL
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

// Create socket instance
const socket = io(SOCKET_URL, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5
});

// Connection event handlers
socket.on('connect', () => {
  console.log('✅ Connected to Socket.IO server');
});

socket.on('disconnect', (reason) => {
  console.log('❌ Disconnected from server:', reason);
});

socket.on('connect_error', (error) => {
  console.error('🔴 Connection error:', error);
});

socket.on('reconnect', (attemptNumber) => {
  console.log(`🔄 Reconnected after ${attemptNumber} attempts`);
});

socket.on('reconnect_attempt', (attemptNumber) => {
  console.log(`🔄 Reconnection attempt ${attemptNumber}`);
});

socket.on('reconnect_error', (error) => {
  console.error('🔴 Reconnection error:', error);
});

socket.on('reconnect_failed', () => {
  console.error('🔴 Failed to reconnect to server');
});

// Custom event listeners
export const subscribeToZoneUpdates = (callback) => {
  socket.on('zoneUpdate', callback);
  return () => socket.off('zoneUpdate', callback);
};

export const requestManualUpdate = () => {
  socket.emit('requestUpdate');
};

export const getConnectionStatus = () => {
  return socket.connected;
};

// server.js (example)
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: { origin: process.env.FRONTEND_ORIGIN || '*' }
});
const cors = require('cors');
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || '*' }));


export default socket;
