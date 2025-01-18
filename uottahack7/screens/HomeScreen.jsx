import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import io from 'socket.io-client';
const HomeScreen = () => {
  const [socket, setSocket] = useState(null);
  const [room, setRoom] = useState('');
  useEffect(() => {
    const socket = io('http://10.0.0.40:3000'); // Ensure this matches your server address
    setSocket(socket);
    socket.on('connect', () => {
      console.log('Connected to server');
    });
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  const joinRoom = () => {
    if (socket) {
      console.log(`Joining room: ${room}`);
      socket.emit('joinRoom', room);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join a Room</Text>
      <TextInput
        style={styles.input}
        value={room}
        onChangeText={setRoom}
        placeholder="Room name"
      />
      <Button title="Join" onPress={joinRoom} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    width: '100%',
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
  },
});
export default HomeScreen;