import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Alert,
  Image,
  Modal,
  StyleSheet,
} from "react-native";
import MapView, { Polyline, Marker } from "react-native-maps";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import styles from "./Map.styles";

export default function Map() {
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const [route, setRoute] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationSubscription, setLocationSubscription] = useState(null);
  const [characteristicPoints, setCharacteristicPoints] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
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
      // Stop tracking and clear characteristic points
      if (locationSubscription) {
        locationSubscription.remove();
        setLocationSubscription(null);
      }
      setGpsEnabled(false);
      setCharacteristicPoints([]); // Clear points when GPS is stopped
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
            setRoute((prevRoute) => {
              const updatedRoute = [...prevRoute, newLocation];
              if (mapRef.current) {
                mapRef.current.animateToRegion({
                  ...newLocation,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                });
              }
              return updatedRoute;
            });
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

  const saveCharacteristicPoint = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Permission to access camera was denied"
        );
        return;
      }

      const image = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!image.canceled && currentLocation) {
        const newPoint = {
          location: currentLocation,
          imageUri: image.assets[0].uri,
        };
        setCharacteristicPoints((prevPoints) => [...prevPoints, newPoint]);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
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

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map}>
        {currentLocation && (
          <Marker coordinate={currentLocation} title="Current Location" />
        )}
        <Polyline coordinates={route} strokeWidth={5} strokeColor="blue" />
        {characteristicPoints.map((point, index) => (
          <Marker
            key={index}
            coordinate={point.location}
            title={`Point ${index + 1}`}
            description="Characteristic Point"
            onPress={() => setSelectedImage(point.imageUri)} // Set the selected image URI
          />
        ))}
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
        {gpsEnabled && (
          <TouchableOpacity
            onPress={saveCharacteristicPoint}
            style={[styles.button, { backgroundColor: "blue", marginTop: 10 }]}
          >
            <Text style={styles.buttonText}>Save Point</Text>
          </TouchableOpacity>
        )}
      </View>
      {selectedImage && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={!!selectedImage}
          onRequestClose={closeImageModal}
        >
          <View style={styles.modalContainer}>
            <Image source={{ uri: selectedImage }} style={styles.modalImage} />
            <TouchableOpacity
              onPress={closeImageModal}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
}
