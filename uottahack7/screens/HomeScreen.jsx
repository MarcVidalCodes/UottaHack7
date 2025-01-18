import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Alert } from 'react-native';
import io from 'socket.io-client';

const HomeScreen = () => {
  const [socket, setSocket] = useState(null);
  const [room, setRoom] = useState('');
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const socket = io('http://172.20.10.2:3000'); // Ensure this matches your server address
    setSocket(socket);

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    socket.on('roomUsers', (users) => {
      console.log('Received roomUsers event:', users);
      setUsers(users);
    });

    socket.on('usernameExists', ({ error }) => {
      Alert.alert('Error', error);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const joinRoom = () => {
    if (socket) {
      console.log(`Joining room: ${room} as ${username}`);
      socket.emit('joinRoom', { room, username });
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
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
      />
      <Button title="Join" onPress={joinRoom} />
      <FlatList
        data={users}
        keyExtractor={(item) => item.id + item.username} // Ensure unique keys
        renderItem={({ item }) => <Text style={styles.user}>{item.username}</Text>}
      />
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
  user: {
    fontSize: 18,
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default HomeScreen;