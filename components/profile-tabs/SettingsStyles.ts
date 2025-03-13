import { StyleSheet } from "react-native";

const settingsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
    justifyContent: "space-evenly",
  },
  rowContainer: {
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  label: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#333",
    paddingRight: 10,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexShrink: 1,
  },
  value: {
    fontSize: 18,
    color: "#555",
    marginRight: 10,
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
    flexShrink: 1,
    minWidth: 100,
  },
  editButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginLeft: 5,
  },
  cancelButton: {
    marginLeft: 10,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
    marginLeft: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalMessage: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    padding: 10,
    margin: 5,
    backgroundColor: "#ccc",
    borderRadius: 5,
    alignItems: "center",
  },
  modalProceedButton: {
    backgroundColor: "#3498db",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  boldText: {
    fontWeight: "bold",
    color: "#000",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
});

export default settingsStyles;
