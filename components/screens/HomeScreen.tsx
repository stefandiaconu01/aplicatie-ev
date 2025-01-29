import React, { useEffect, useState } from "react";
import { Text, View, Alert, TouchableOpacity } from "react-native";
import MapboxGL from "@rnmapbox/maps";
import { fetchStations } from "../../api/stations";
import styles from "../../app/styles";

MapboxGL.setAccessToken("YOUR_MAPBOX_ACCESS_TOKEN");

interface Station {
  name: string;
  sn: string;
  kwPrice: number;
  status: string;
  latitude: number;
  longitude: number;
}

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const [stations, setStations] = useState<Station[]>([]);
  const [error, setError] = useState<string | null>(null);

  const validStations = stations.filter(
    (station) => station.latitude && station.longitude
  );

  useEffect(() => {
    const loadStations = async () => {
      try {
        const data = await fetchStations();
        setStations(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load stations");
      }
    };

    loadStations();
  }, []);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.mapContainer}>
      <Text style={styles.mapText}>EV Stations Map</Text>
      <MapboxGL.MapView style={styles.map}>
        <MapboxGL.Camera
          zoomLevel={6}
          centerCoordinate={[24.96925, 45.84468]}
        />

        {validStations.map((station, index) => (
          <MapboxGL.PointAnnotation
            key={index}
            id={`station-${index}`}
            coordinate={[station.longitude, station.latitude]}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate("StationDetails", { station })}
              style={styles.calloutContainer}
            >
              <View>
                <Text style={styles.calloutTitle}>{station.name}</Text>
                <Text style={styles.calloutDescription}>
                  Pret: {station.kwPrice} RON/kWh, {" "}
                  {station.status === "connected" ? "Online" : "Offline"}
                </Text>
              </View>
            </TouchableOpacity>
          </MapboxGL.PointAnnotation>
        ))}
      </MapboxGL.MapView>
    </View>
  );
};

export default HomeScreen;
