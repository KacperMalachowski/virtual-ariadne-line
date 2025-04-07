import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { useNavigation } from "@react-navigation/native";
import styles from "./SavedRoutes.styles";

export default function SavedRoutes() {
  const [savedRoutes, setSavedRoutes] = useState([]);
  const [isRenaming, setIsRenaming] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [newRouteName, setNewRouteName] = useState("");
  const navigation = useNavigation();

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
              return {
                fileName: file,
                name: routeData.name || null,
                data: routeData,
              };
            } catch {
              return { fileName: file, name: null, data: null };
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

  const renameRoute = async () => {
    if (!newRouteName.trim()) {
      Alert.alert("Invalid Name", "Please provide a valid name.");
      return;
    }

    try {
      const fileUri = `${FileSystem.documentDirectory}${selectedRoute.fileName}`;
      const content = await FileSystem.readAsStringAsync(fileUri);
      const routeData = JSON.parse(content);
      routeData.name = newRouteName;

      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(routeData));
      setSavedRoutes((prevRoutes) =>
        prevRoutes.map((route) =>
          route.fileName === selectedRoute.fileName
            ? { ...route, name: newRouteName }
            : route
        )
      );

      Alert.alert("Success", "Route renamed successfully.");
      setIsRenaming(false);
      setNewRouteName("");
      setSelectedRoute(null);
    } catch (error) {
      Alert.alert("Error", `Failed to rename route: ${error.message}`);
    }
  };

  const confirmRenameRoute = (route) => {
    setSelectedRoute(route);
    setNewRouteName(route.name || "");
    setIsRenaming(true);
  };

  const removeRoute = async (fileName) => {
    try {
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.deleteAsync(fileUri);
      setSavedRoutes((prevRoutes) =>
        prevRoutes.filter((route) => route.fileName !== fileName)
      );
      Alert.alert("Success", "Route removed successfully.");
    } catch (error) {
      Alert.alert("Error", `Failed to remove route: ${error.message}`);
    }
  };

  const confirmRemoveRoute = (fileName) => {
    Alert.alert("Remove Route", "Are you sure you want to remove this route?", [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", onPress: () => removeRoute(fileName) },
    ]);
  };

  const showRouteOnMap = (routeData) => {
    navigation.navigate("Map", { routeData });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={savedRoutes}
        keyExtractor={(item) => item.fileName}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 5,
            }}
          >
            <TouchableOpacity
              style={[styles.routeButton, { flex: 1 }]}
              onPress={() => showRouteOnMap(item.data)}
            >
              <Text style={styles.routeButtonText}>
                {item.name || item.fileName}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.routeButton,
                { backgroundColor: "orange", marginLeft: 10 },
              ]}
              onPress={() => confirmRenameRoute(item)}
            >
              <Text style={styles.routeButtonText}>Rename</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.routeButton,
                { backgroundColor: "red", marginLeft: 10 },
              ]}
              onPress={() => confirmRemoveRoute(item.fileName)}
            >
              <Text style={styles.routeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No saved routes found.</Text>
        }
      />
      <TouchableOpacity
        style={[
          styles.routeButton,
          { backgroundColor: "green", marginTop: 20 },
        ]}
        onPress={() => navigation.navigate("Map")}
      >
        <Text style={styles.routeButtonText}>Back to Map</Text>
      </TouchableOpacity>
      {isRenaming && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={isRenaming}
          onRequestClose={() => setIsRenaming(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Rename Route</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter new route name"
                value={newRouteName}
                onChangeText={setNewRouteName}
              />
              <TouchableOpacity
                onPress={renameRoute}
                style={[styles.modalButton, styles.modalButtonSave]}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsRenaming(false)}
                style={[styles.modalButton, styles.modalButtonCancel]}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
