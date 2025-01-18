import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native'; // Import Text component
import MapView, { Circle } from 'react-native-maps'; // Import Circle component
import * as Location from 'expo-location';
import Slider from '@react-native-community/slider';

export default function App() {
  const [location, setLocation] = useState(null);
  const [radius, setRadius] = useState(5000); // Initial radius of 5km
  const [timer, setTimer] = useState(15); // Initial timer of 15 seconds
  const [circleCenter, setCircleCenter] = useState(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Location permission denied');
        return;
      }

      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (location) => {
          setLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
          if (!circleCenter) {
            setCircleCenter({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            });
          }
        }
      );
    };

    requestLocationPermission();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 1) {
          setRadius((prevRadius) => Math.max(prevRadius - 1000, 0)); // Reduce radius by 1km
          setCircleCenter((prevCenter) => ({
            latitude: prevCenter.latitude + (Math.random() - 0.5) * 0.01,
            longitude: prevCenter.longitude + (Math.random() - 0.5) * 0.01,
          }));
          return 15; // Reset timer to 15 seconds
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {location ? (
        <>
          <View style={styles.timerContainer}>
            <Text>Timer: {timer} seconds</Text>
          </View>
          <MapView
            style={styles.map}
            initialRegion={location}
            showsUserLocation={true}
            followsUserLocation={true}
          >
            {circleCenter && (
              <Circle
                center={circleCenter}
                radius={radius}
                strokeColor="rgba(0, 150, 255, 0.5)"
                fillColor="rgba(0, 150, 255, 0.2)"
              />
            )}
          </MapView>
          <View style={styles.sliderContainer}>
            <Text>Radius: {radius / 1000} km</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={10000}
              step={100}
              value={radius}
              onValueChange={setRadius}
              minimumTrackTintColor="#0096FF"
              maximumTrackTintColor="#000000"
            />
          </View>
        </>
      ) : (
        <Text>Loading...</Text> // Use Text component to display loading message
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  map: {
    width: '100%',
    height: '70%',
  },
  sliderContainer: {
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timerContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});