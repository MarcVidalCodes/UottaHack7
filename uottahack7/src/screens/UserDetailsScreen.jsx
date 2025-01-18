import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const UserDetailsScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [color, setColor] = useState('');

  const proceedToServerSelection = () => {
    navigation.navigate('ServerSelection', { username, color });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Details</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
      />
      <TextInput
        style={styles.input}
        value={color}
        onChangeText={setColor}
        placeholder="Color"
      />
      <Button title="Next" onPress={proceedToServerSelection} />
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

export default UserDetailsScreen;