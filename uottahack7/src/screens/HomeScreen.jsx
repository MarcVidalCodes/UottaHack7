import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { useSocket } from '../SocketContext';

const HomeScreen = ({ route, navigation }) => {
  const { server } = route.params;
  const socket = useSocket();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (socket) {
      socket.on('roomUsers', (users) => {
        console.log('Received roomUsers event:', users);
        setUsers(users);
        console.log(`Current users in ${server}:`, users.map(user => `${user.username} with color ${user.color}`).join(', '));
      });

      return () => {
        console.log(`Leaving room: ${server}`);
        socket.emit('leaveRoom', { room: server });
        socket.disconnect();
      };
    }
  }, [socket]);

  const leaveRoom = () => {
    console.log(`Leaving room: ${server}`);
    socket.emit('leaveRoom', { room: server });
    navigation.navigate('ServerSelection');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Users in {server}</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={[styles.user, { color: item.color }]}>{item.username}</Text>
        )}
      />
      <Button title="Leave Room" onPress={leaveRoom} />
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
  user: {
    fontSize: 18,
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default HomeScreen;