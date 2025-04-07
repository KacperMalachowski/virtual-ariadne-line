import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import styles from "./SavedRoutes.styles";

export default function SavedRoutes() {
  const [savedRoutes, setSavedRoutes] = useState([]);

  useEffect(() => {
    const loadSavedRoutes = async () => {
      try {
        const files = await FileSystem.readDirectoryAsync(
          FileSystem.documentDirectory
        );
        const routeFiles = files.filter((file) => file.startsWith("route_"));
        const routesWithNames = await Promise.all(
          routeFiles.map(async (file) => {
            const fileUri = `${FileSystem.documentDirectory}${file}`;
            try {
              const content = await FileSystem.readAsStringAsync(fileUri);
              const routeData = JSON.parse(content);
              return { fileName: file, name: routeData.name || null };
            } catch {
              return { fileName: file, name: null };
            }
          })
        );
        setSavedRoutes(routesWithNames);
      } catch (error) {
        Alert.alert("Error", `Failed to load saved routes: ${error.message}`);
      }
    };

    loadSavedRoutes();
  }, []);

  const viewRoute = async (fileName) => {
    try {
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      const content = await FileSystem.readAsStringAsync(fileUri);
      const routeData = JSON.parse(content);
      Alert.alert("Route Details", JSON.stringify(routeData, null, 2));
    } catch (error) {
      Alert.alert("Error", `Failed to load route: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={savedRoutes}
        keyExtractor={(item) => item.fileName}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.routeButton}
            onPress={() => viewRoute(item.fileName)}
          >
            <Text style={styles.routeButtonText}>
              {item.name || item.fileName}{" "}
              {/* Display route name or fallback to filename */}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No saved routes found.</Text>
        }
      />
    </View>
  );
}
