import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  mapText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 40
  },
  infoContainer: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  calloutContainer: {
    backgroundColor: "white",
    padding: 6,
    borderRadius: 6,
    minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  stationLabel: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    minWidth: 150,
  },
  calloutWrapper: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
  },
  calloutDescription: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
    color: 'grey',
  },
  calloutAll: {
    position: 'relative',
    width: 1000,
    height: 1000,
  },
  calloutButtonContainer: {
    bottom: -5, // Adjust placement inside the callout box
    alignSelf: "center",
    zIndex: 999, // Ensure it's clickable
  },
  calloutButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 100,
    marginTop: 10,
  },
  floatingButton: {
    position: "absolute",
    alignSelf: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },  
  calloutButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  markerPopup: {
    position: "absolute",
    bottom: 35,
    backgroundColor: "white",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  markerPopupText: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  markerDot: {
    width: 15,
    height: 15,
    backgroundColor: "red",
    borderRadius: 4,
    borderWidth: 3,
    borderColor: "white",
  },
  markerImage: {
    width: 30,
    height: 40,
    resizeMode: "contain",
  },
  detailsContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  detailsTitle: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detailsDescription: {
    fontSize: 18,
    marginBottom: 100,
    textAlign: 'center',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  customCallout: {
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    alignSelf: "center",
  },
  calloutText: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  customCalloutText: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  customButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginVertical: 10,
    alignItems: 'center',
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  abcdefContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  adminTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  placeholderText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
  },
  abcdefText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  settingsContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  autochargeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: 'white',
  },
  saveButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },


  // StationDetailsScreen styles

  chargingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 25,
  },
  
  pistolSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  
  pistolTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },

  pistolStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  
  pistolStatusText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  
  pistolIcon: {
    marginBottom: 15,
  },
  
  divider: {
    width: 2,
    height: "60%",
    backgroundColor: "#ccc",
    marginHorizontal: 10,
    alignSelf: "center",
  },

  boldText: {
    fontWeight: "bold",
  },
  
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  
  statusIndicator: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 8,
  },
  
  
  onlineIndicator: {
    backgroundColor: "#4CAF50", // Green
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
  },
  
  offlineIndicator: {
    backgroundColor: "#D32F2F", // Red
    shadowColor: "#D32F2F",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
  },
  
  statusText: {
    fontSize: 18,
    fontWeight: "bold",
  },


  //Prepayment Screen


  prepaymentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  
  prepaymentTitle: {
    fontSize: 27,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  
  prepaymentDetails: {
    padding: 15,
    borderRadius: 10,
    width: "90%",
    alignItems: "flex-start",
    marginBottom: -5,
  },
  
  prepaymentText: {
    fontSize: 18,
    marginBottom: 10,
  },  

  dividerPrepay: {
    width: "90%",
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 20,
  },

  prepaymentSubtitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },

  prepaymentGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 15,
    marginBottom: 20,
  },

  prepaymentButton: {
    width: "45%",
    paddingVertical: 15,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  prepaymentButtonSelected: {
    backgroundColor: "#005BB5",
  },

  prepaymentButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  proceedButton: {
    width: "90%",
    paddingVertical: 15,
    backgroundColor: "#FFA500",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
  },

  proceedButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  disabledButton: {
    opacity: 0.5,
  },


  //ChargingSessionScreen.tsx

chargingSessionContainer: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#f8f9fa",
  padding: 20,
},

chargingSessionTitle: {
  fontSize: 22,
  fontWeight: "bold",
  marginBottom: 20,
  textAlign: "center",
  color: "#333",
},

chargingSessionDetails: {
  backgroundColor: "white",
  padding: 15,
  borderRadius: 10,
  width: "90%",
  alignItems: "flex-start",
  shadowRadius: 4,
  elevation: 5,
  marginBottom: 20,
},

chargingSessionText: {
  fontSize: 18,
  marginBottom: 10,
  fontWeight: "600",
  color: "#555",
},

stopChargingButton: {
  backgroundColor: "#D32F2F", // Red
  paddingVertical: 12,
  paddingHorizontal: 24,
  borderRadius: 10,
  marginTop: 20,
  alignItems: "center",
},

stopChargingButtonText: {
  color: "white",
  fontSize: 18,
  fontWeight: "bold",
},

// Modal Styling

modalOverlay: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
},

modalContainer: {
  width: "85%",
  backgroundColor: "white",
  padding: 20,
  borderRadius: 10,
  alignItems: "center",
},

modalTitle: {
  fontSize: 18,
  fontWeight: "bold",
  textAlign: "center",
  marginBottom: 20,
},

modalButtonsContainer: {
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%",
},

modalCancelButton: {
  backgroundColor: "gray",
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 8,
  flex: 1,
  alignItems: "center",
  marginRight: 10,
},

modalCancelButtonText: {
  color: "white",
  fontSize: 16,
  fontWeight: "bold",
},

modalConfirmButton: {
  backgroundColor: "#D32F2F",
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 8,
  flex: 1,
  alignItems: "center",
},

modalConfirmButtonText: {
  color: "white",
  fontSize: 16,
  fontWeight: "bold",
},

proceedButtonChargingSession: {
  backgroundColor: "#FFA500",
  paddingVertical: 12,
  paddingHorizontal: 24,
  borderRadius: 8,
  marginTop: 20,
},

proceedButtonTextChargingSession: {
  color: "white",
  fontSize: 18,
  fontWeight: "bold",
},

batteryContainer: {
  alignItems: "center",
  justifyContent: "center",
  marginVertical: 20,
},

batteryCircle: {
  width: 120,
  height: 120,
  borderRadius: 60,
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
},

batterySquare: {
  position: "absolute",
  width: 12,
  height: 12,
  borderRadius: 2,
  borderWidth: 1,
  borderColor: "#3156bd",
},

batteryLevelText: {
  fontSize: 22,
  fontWeight: "bold",
  position: "absolute",
  color: "#3156bd",
},

paymentUsageText: {
  fontSize: 18,
  marginTop: 10,
  fontWeight: "bold",
  color: "#555",
},
  
  
});

export default styles;
