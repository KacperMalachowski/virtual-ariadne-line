import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  button: {
    borderRadius: 50,
    paddingVertical: 12, // Slightly increased for better touch area
    paddingHorizontal: 25, // Adjusted for better button proportions
    backgroundColor: "#007bff", // Default button color
    marginVertical: 5, // Add spacing between buttons
  },
  buttonText: {
    color: "white", // Changed to white for better contrast
    fontWeight: "bold",
    fontSize: 16, // Slightly larger font for better readability
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Slightly darker dim background
    padding: 20,
  },
  modalContent: {
    width: "85%", // Adjusted width for better alignment
    backgroundColor: "#ffffff", // Clean white background
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
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "black",
    fontWeight: "bold",
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
