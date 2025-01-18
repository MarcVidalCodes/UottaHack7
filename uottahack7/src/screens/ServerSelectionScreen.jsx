import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useSocket } from '../SocketContext';

const ServerSelectionScreen = ({ route, navigation }) => {
  const { username, color } = route.params;
  const socket = useSocket();
  const [serverCounts, setServerCounts] = useState({
    server1: 0,
    server2: 0,
    server3: 0,
    server4: 0
  });

  useEffect(() => {
    if (socket) {
      socket.on('roomUsers', (users) => {
        console.log('Received roomUsers event:', users);
        const counts = {
          server1: users.filter(user => user.room === 'server1').length,
          server2: users.filter(user => user.room === 'server2').length,
          server3: users.filter(user => user.room === 'server3').length,
          server4: users.filter(user => user.room === 'server4').length
        };
        console.log('Updated server counts:', counts);
        setServerCounts(counts);
      });
    }
  }, [socket]);

  const joinServer = (server) => {
    if (socket) {
      console.log(`Joining room: ${server} as ${username} with color ${color}`);
      socket.emit('joinRoom', { room: server, username, color });
      navigation.navigate('Home', { server });
    } else {
      console.log('Socket not connected');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Server</Text>
      {Object.keys(serverCounts).map((server) => (
        <Button
          key={server}
          title={`${server} (${serverCounts[server]}/10)`}
          onPress={() => joinServer(server)}
        />
      ))}
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
});

export default ServerSelectionScreen;