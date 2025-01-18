const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);
io.on('connection', (socket) => {
  console.log('New connection');
  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`Joined room: ${room}`);
  });
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
server.listen(3000, () => {
  console.log('Server is running on port 3000');
});