const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const rooms = {
  server1: [],
  server2: [],
  server3: [],
  server4: []
};

io.on('connection', (socket) => {
  console.log('New connection:', socket.id);

  socket.on('joinRoom', ({ room, username, color }) => {
    console.log(`joinRoom event received: room=${room}, username=${username}, color=${color}`);
    if (rooms[room].length >= 10) {
      socket.emit('roomFull', { error: 'Room is full' });
      return;
    }

    socket.join(room);
    rooms[room].push({ id: socket.id, username, color });
    console.log(`Joined room: ${room}`);
    console.log(`Current users in room ${room}: ${rooms[room].map(user => `${user.username} (${user.id})`).join(', ')}`);
    io.to(room).emit('roomUsers', rooms[room]);
  });

  socket.on('leaveRoom', ({ room }) => {
    console.log(`leaveRoom event received: room=${room}`);
    rooms[room] = rooms[room].filter(user => user.id !== socket.id);
    socket.leave(room);
    console.log(`User left room: ${room}`);
    console.log(`Current users in room ${room}: ${rooms[room].map(user => `${user.username} (${user.id})`).join(', ')}`);
    io.to(room).emit('roomUsers', rooms[room]);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    for (const room in rooms) {
      rooms[room] = rooms[room].filter(user => user.id !== socket.id);
      console.log(`Current users in room ${room}: ${rooms[room].map(user => `${user.username} (${user.id})`).join(', ')}`);
      io.to(room).emit('roomUsers', rooms[room]);
    }
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});