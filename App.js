import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Map from "./components/Map";
import SavedRoutes from "./components/SavedRoutes";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Map">
        <Stack.Screen name="Map" component={Map} />
        <Stack.Screen name="SavedRoutes" component={SavedRoutes} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
