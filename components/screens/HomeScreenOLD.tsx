import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import MapboxGL, { Callout } from "@rnmapbox/maps";
import { fetchStations } from "../../api/stations";
import styles from "../../app/styles";

import Constants from "expo-constants";

const MAPBOX_TOKEN = Constants.expoConfig?.extra?.MAPBOX_TOKEN;

MapboxGL.setAccessToken(
  MAPBOX_TOKEN ? MAPBOX_TOKEN : ''
);

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
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  useEffect(() => {
    const loadStations = async () => {
      try {
        const data = await fetchStations();
        console.log("Fetched Stations:", data); // Debug log
        setStations(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load stations");
      }
    };

    loadStations();
  }, []);

  // Filter out invalid stations to prevent Mapbox errors
  const validStations = stations.filter(
    (station) =>
      station.latitude !== undefined &&
      station.longitude !== undefined &&
      !isNaN(station.latitude) &&
      !isNaN(station.longitude)
  );

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

        {validStations.map((station, index) => {
          const coordinate = [station.longitude, station.latitude];

          return (
              <MapboxGL.PointAnnotation
                key={index.toString()}
                id={`station-${index}`}
                coordinate={coordinate}
                onSelected={() =>
                  navigation.navigate("StationDetails", { station })
                }
              >
                <Callout title={station.name}>
                  <View style={styles.calloutContainer}>
                    <Text style={styles.calloutTitle}>{station.name}</Text>
                    <Text style={styles.calloutDescription}>
                      Price: {station.kwPrice} RON/kWh,{" "}
                      {station.status === "connected" ? "Online" : "Offline"}
                    </Text>
                  </View>
                </Callout>
              </MapboxGL.PointAnnotation>
          );
        })}
      </MapboxGL.MapView>
    </View>
  );
};

export default HomeScreen;
