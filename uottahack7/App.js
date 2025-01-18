import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ServerSelectionScreen from './src/screens/ServerSelectionScreen';
import UserDetailsScreen from './src/screens/UserDetailsScreen';
import HomeScreen from './src/screens/HomeScreen';
import { SocketProvider } from './src/SocketContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SocketProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="UserDetails">
          <Stack.Screen name="UserDetails" component={UserDetailsScreen} />
          <Stack.Screen name="ServerSelection" component={ServerSelectionScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SocketProvider>
  );
}