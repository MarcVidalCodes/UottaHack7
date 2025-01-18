const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const rooms = {};

io.on('connection', (socket) => {
  console.log('New connection');

  socket.on('joinRoom', ({ room, username }) => {
    socket.join(room);
    if (!rooms[room]) {
      rooms[room] = [];
    }

    // Check if the username already exists in the room
    const userExists = rooms[room].some(user => user.username === username);
    if (userExists) {
      console.log(`Username ${username} already exists in room ${room}`);
      socket.emit('usernameExists', { error: 'Username already exists in the room' });
      return;
    }

    rooms[room].push({ id: socket.id, username });
    console.log(`Joined room: ${room}`);
    console.log(`Current users in room ${room}: ${rooms[room].map(user => user.username)}`);
    io.to(room).emit('roomUsers', rooms[room]);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
    for (const room in rooms) {
      rooms[room] = rooms[room].filter(user => user.id !== socket.id);
      io.to(room).emit('roomUsers', rooms[room]);
    }
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});