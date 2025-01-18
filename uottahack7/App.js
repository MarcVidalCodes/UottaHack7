import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/HomeScreen';
import BlankScreen from './src/screens/BlankScreen';
const Tab = createBottomTabNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Room" component={HomeScreen} />
        <Tab.Screen name="Blank" component={BlankScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}