import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Alert,
  Image,
  Modal,
  TextInput,
  StyleSheet,
} from "react-native";
import MapView, { Polyline, Marker } from "react-native-maps";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useNavigation, useRoute } from "@react-navigation/native"; // Import navigation and route hooks
import styles from "./Map.styles";

export default function Map() {
  const navigation = useNavigation(); // Initialize navigation
  const route = useRoute(); // Get route data from navigation
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const [routeData, setRoute] = useState([]); // Ensure setRoute is defined
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationSubscription, setLocationSubscription] = useState(null);
  const [characteristicPoints, setCharacteristicPoints] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [routeName, setRouteName] = useState(""); // New state for route name
  const [isNamingRoute, setIsNamingRoute] = useState(false); // New state for naming modal
  const mapRef = useRef(null);

  useEffect(() => {
    if (route.params?.routeData) {
      const { route: savedRoute, characteristicPoints: savedPoints } =
        route.params.routeData;
      setRoute(savedRoute); // Use setRoute to update the route
      setCharacteristicPoints(savedPoints || []);
      if (mapRef.current && savedRoute.length > 0) {
        mapRef.current.animateToRegion({
          ...savedRoute[0],
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    }
  }, [route.params]);

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
    if (gpsEnabled) {
      // Stop tracking
      if (locationSubscription) {
        locationSubscription.remove();
        setLocationSubscription(null);
      }
      setGpsEnabled(false);

      if (routeData.length > 0) {
        // Ask the user if they want to save the route
        Alert.alert(
          "Save Route",
          "Do you want to save this route for future use?",
          [
            {
              text: "No",
              style: "cancel",
            },
            {
              text: "Yes",
              onPress: () => setIsNamingRoute(true), // Open naming modal
            },
          ]
        );
      }
    } else {
      // Start tracking
      setRoute([]);
      setCharacteristicPoints([]);

      try {
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

  const saveRoute = async () => {
    if (route.length === 0) {
      Alert.alert("No Route", "There is no route to save.");
      return;
    }

    if (!routeName.trim()) {
      Alert.alert("Invalid Name", "Please provide a name for the route.");
      return;
    }

    const data = {
      name: routeName, // Include the route name
      route,
      characteristicPoints,
    };

    try {
      const fileUri = `${FileSystem.documentDirectory}route_${Date.now()}.json`;
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(data));
      Alert.alert("Success", `Route "${routeName}" saved to ${fileUri}`);
      setRouteName(""); // Reset the route name
      setIsNamingRoute(false); // Close the naming modal
    } catch (error) {
      Alert.alert("Error", `Failed to save route: ${error.message}`);
    }
  };

  const promptRouteName = () => {
    setIsNamingRoute(true); // Open the naming modal
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
        {routeData.length > 0 && ( // Ensure routeData is not empty
          <Polyline
            coordinates={routeData.filter(
              (point) => point && point.latitude && point.longitude // Validate points
            )}
            strokeWidth={5}
            strokeColor="blue"
          />
        )}
        {characteristicPoints.map((point, index) => (
          <Marker
            key={index}
            coordinate={point.location}
            title={`Point ${index + 1}`}
            description="Characteristic Point"
            onPress={() => setSelectedImage(point.imageUri)} // Ensure image URI is set
          />
        ))}
      </MapView>
      <View style={styles.buttonContainer}>
        {gpsEnabled && (
          <TouchableOpacity
            onPress={saveCharacteristicPoint}
            style={[
              styles.button,
              { backgroundColor: "blue", marginBottom: 10 },
            ]} // Adjusted margin for spacing
          >
            <Text style={styles.buttonText}>Save Point</Text>
          </TouchableOpacity>
        )}
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
        <TouchableOpacity
          onPress={() => navigation.navigate("SavedRoutes")} // Navigate to SavedRoutes view
          style={[styles.button, { backgroundColor: "purple", marginTop: 10 }]}
        >
          <Text style={styles.buttonText}>View Saved Routes</Text>
        </TouchableOpacity>
      </View>
      {selectedImage && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={!!selectedImage}
          onRequestClose={closeImageModal}
        >
          <View style={styles.modalContainer}>
            <Image
              source={{ uri: selectedImage }}
              style={{ width: 300, height: 300 }}
            />{" "}
            {/* Ensure image is displayed */}
            <TouchableOpacity
              onPress={closeImageModal}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
      {isNamingRoute && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={isNamingRoute}
          onRequestClose={() => setIsNamingRoute(false)}
        >
          <View style={styles.modalContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter route name"
              value={routeName}
              onChangeText={setRouteName}
            />
            <TouchableOpacity
              onPress={saveRoute}
              style={[
                styles.button,
                { backgroundColor: "green", marginTop: 10 },
              ]}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsNamingRoute(false)}
              style={[styles.closeButton, { marginTop: 10 }]}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
}
