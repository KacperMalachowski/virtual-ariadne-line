import React from "react";
import { View, StyleSheet, Text } from "react-native";
import MapView from "react-native-maps";

export default class Map extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <MapView style={styles.map} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
