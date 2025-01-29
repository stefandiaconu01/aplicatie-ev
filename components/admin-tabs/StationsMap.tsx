import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Button,
  Modal,
  TextInput,
  Alert,
  Switch,
} from "react-native";
import { fetchStations } from "../../api/stations"; // Ensure this API utility exists
import styles from "../../app/styles";

const DATA_API_URL = `https://eu-central-1.aws.data.mongodb-api.com/app/data-ikloh/endpoint/data/v1/action`;

const API_KEY =
  "4VBvtU5RPVQOmVKmDoJN7mCmx453QbzScV1vKovCYlilrT7tMD0nbyH043083CoG";
//console.log(API_KEY);

const HEADERS = {
  "Content-Type": "application/json",
  "api-key": API_KEY,
};

interface Station {
  id: string;
  name: string;
  sn: string;
  kwPrice: number;
  status: string;
  latitude: number;
  longitude: number;
  showOnMap: boolean;
}

const StationsMap = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadStations = async () => {
      try {
        const data = await fetchStations();
        setStations(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load stations.");
      }
    };

    loadStations();
  }, []);

  const handleEditPress = (station: Station) => {
    setSelectedStation(station);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!selectedStation) return;

    try {
      // Update the station in the database
      const response = await fetch(`${DATA_API_URL}/updateOne`, {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify({
          dataSource: "CSMS",
          database: "EV_Stations",
          collection: "stations",
          filter: { id: selectedStation.id },
          update: {
            $set: {
              latitude: selectedStation.latitude,
              longitude: selectedStation.longitude,
              showOnMap: selectedStation.showOnMap,
            },
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update station.");
      }

      // Update local state
      setStations((prevStations) =>
        prevStations.map((station) =>
          station.id === selectedStation.id
            ? { ...station, ...selectedStation }
            : station
        )
      );

      Alert.alert("Success", "Station updated successfully.");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to update station.");
    } finally {
      setModalVisible(false);
      setSelectedStation(null);
    }
  };

  const renderStation = ({ item }: { item: Station }) => (
    <TouchableOpacity style={localStyles.card}>
      <View style={localStyles.cardContent}>
        <View>
          <Text style={localStyles.stationName}>{item.name}</Text>
          <Text style={localStyles.details}>SN: {item.sn}</Text>
          <Text style={localStyles.details}>Price: {item.kwPrice} RON/kWh</Text>
          <Text style={localStyles.details}>
            Status: {item.status === "connected" ? "Online" : "Offline"}
          </Text>
        </View>
        <Button title="Edit" onPress={() => handleEditPress(item)} />
      </View>
    </TouchableOpacity>
  );

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={stations}
        renderItem={renderStation}
        keyExtractor={(item) => item.id} // Ensure a unique key for each item
        contentContainerStyle={localStyles.listContainer}
      />

      {selectedStation && (
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={localStyles.modalOverlay}>
            <View style={localStyles.modalContent}>
              <Text style={localStyles.modalTitle}>Edit Station</Text>

              <TextInput
                style={localStyles.input}
                value={String(selectedStation.latitude)}
                onChangeText={(text) =>
                  setSelectedStation((prev) =>
                    prev ? { ...prev, latitude: parseFloat(text) } : null
                  )
                }
                placeholder="Latitude"
                keyboardType="numeric"
              />

              <TextInput
                style={localStyles.input}
                value={String(selectedStation.longitude)}
                onChangeText={(text) =>
                  setSelectedStation((prev) =>
                    prev ? { ...prev, longitude: parseFloat(text) } : null
                  )
                }
                placeholder="Longitude"
                keyboardType="numeric"
              />

              <View style={localStyles.switchContainer}>
                <Text>Show on Map</Text>
                <Switch
                  value={selectedStation.showOnMap}
                  onValueChange={(value) =>
                    setSelectedStation((prev) =>
                      prev ? { ...prev, showOnMap: value } : null
                    )
                  }
                />
              </View>

              <View style={localStyles.buttonContainer}>
                <Button title="Save" onPress={handleSave} />
                <Button
                  title="Cancel"
                  color="red"
                  onPress={() => {
                    setModalVisible(false);
                    setSelectedStation(null);
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const localStyles = StyleSheet.create({
  listContainer: { paddingVertical: 10 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stationName: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  details: { fontSize: 14, color: "#555" },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  input: {
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default StationsMap;
