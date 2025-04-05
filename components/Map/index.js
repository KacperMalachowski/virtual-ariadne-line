import React, { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity, Text, Alert } from "react-native";
import MapView, { Polyline, Marker } from "react-native-maps";
import * as Location from "expo-location";
import styles from "./Map.styles";

export default function Map() {
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const [route, setRoute] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationSubscription, setLocationSubscription] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchInitialLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "Permission to access location was denied"
          );
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const initialLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        setCurrentLocation(initialLocation);
        setRoute([initialLocation]);

        if (mapRef.current) {
          mapRef.current.animateToRegion({
            ...initialLocation,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    };

    fetchInitialLocation();
  }, []);

  const toggleGps = async () => {
    console.log("Toggle GPS, current state:", gpsEnabled, " route:", route);
    if (gpsEnabled) {
      // Stop tracking
      if (locationSubscription) {
        locationSubscription.remove();
        setLocationSubscription(null);
      }
      setGpsEnabled(false);
    } else {
      try {
        // Request permissions and start tracking
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "Permission to access location was denied"
          );
          return;
        }

        const subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 1000,
            distanceInterval: 5,
          },
          (location) => {
            const newLocation = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            };
            setCurrentLocation(newLocation);
            setRoute((prevRoute) => [...prevRoute, newLocation]);

            if (mapRef.current) {
              mapRef.current.animateToRegion({
                ...newLocation,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              });
            }
          },
          (error) => {
            Alert.alert("Location Error", error.message);
          }
        );

        setLocationSubscription(subscription);
        setGpsEnabled(true);
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [locationSubscription]);

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map}>
        {currentLocation && (
          <Marker coordinate={currentLocation} title="Current Location" />
        )}
        <Polyline coordinates={route} strokeWidth={5} strokeColor="blue" />
      </MapView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={toggleGps}
          style={[
            styles.button,
            { backgroundColor: gpsEnabled ? "red" : "green" },
          ]}
        >
          <Text style={styles.buttonText}>
            {gpsEnabled ? "Stop GPS" : "Start GPS"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
