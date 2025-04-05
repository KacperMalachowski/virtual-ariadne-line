import React from "react";
import { View } from "react-native";
import Map from "./components/Map";

export default class App extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Map />
      </View>
    );
  }
}
