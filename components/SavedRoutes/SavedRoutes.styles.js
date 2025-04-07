import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  routeButton: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "lightgray",
    marginVertical: 5,
  },
  routeButtonText: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "gray",
  },
});

export default styles;
