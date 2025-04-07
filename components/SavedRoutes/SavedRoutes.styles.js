import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15, // Increased padding for better spacing
    backgroundColor: "#f5f5f5", // Light background for better contrast
  },
  routeButton: {
    borderRadius: 12, // Softer rounded corners
    paddingVertical: 12, // Increased padding for better touch area
    paddingHorizontal: 20,
    backgroundColor: "#007bff", // Blue background for buttons
    marginVertical: 8, // Increased spacing between buttons
    shadowColor: "#000", // Add shadow for better visibility
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // Shadow for Android
  },
  routeButtonText: {
    color: "white", // White text for better contrast
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16, // Slightly larger font for better readability
  },
  emptyText: {
    textAlign: "center",
    marginTop: 30, // Increased margin for better spacing
    color: "#888", // Subtle gray color for empty text
    fontSize: 16, // Slightly larger font for better readability
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Dim background for focus
    padding: 20,
  },
  modalContent: {
    width: "85%", // Adjusted width for better alignment
    backgroundColor: "white", // Clean white background
    borderRadius: 12, // Softer rounded corners
    padding: 25, // Increased padding for better spacing
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6, // Enhanced shadow for Android
  },
  modalTitle: {
    fontSize: 20, // Larger font for better emphasis
    fontWeight: "700", // Bold for better visibility
    marginBottom: 20, // Increased spacing below the title
    color: "#333", // Neutral dark text color
    textAlign: "center",
  },
  textInput: {
    width: "100%",
    height: 45,
    borderColor: "#ccc", // Subtle border color
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: "#f9f9f9", // Light gray background for input
    marginBottom: 20,
    fontSize: 16, // Slightly larger font for better usability
  },
  modalButton: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15, // Increased spacing between buttons
  },
  modalButtonText: {
    color: "white",
    fontWeight: "600", // Semi-bold for better readability
    fontSize: 16, // Larger font for button text
  },
  modalButtonSave: {
    backgroundColor: "#28a745", // Green for save button
  },
  modalButtonCancel: {
    backgroundColor: "#dc3545", // Red for cancel button
  },
});

export default styles;
