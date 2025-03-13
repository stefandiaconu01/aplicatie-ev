import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
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
  const [visibleStation, setVisibleStation] = useState<Station | null>(null);

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

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setVisibleStation(null);
    });

    return unsubscribe;
  }, [navigation]);

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
      <MapboxGL.MapView
        style={styles.map}
        onPress={() => {
          setVisibleStation(null);
        }}
      >
        <MapboxGL.Camera
          zoomLevel={6}
          centerCoordinate={[24.96925, 45.84468]}
        />

        {validStations.map((station, index) => {
          const coordinate = [station.longitude, station.latitude];
          //Should use this isVisible to render the callout from above the marker - however, the callout cannot be rendered conditionally...
          const isVisible = visibleStation?.sn === station.sn;

          return (
            <React.Fragment key={index.toString()}>
              {/* PointAnnotation Marker */}
              <MapboxGL.PointAnnotation
                id={`station-${index}`}
                coordinate={coordinate}
                onSelected={() => {
                  setVisibleStation(station);
                }}
              >
                <Callout title={station.name} style={styles.calloutWrapper} /> 
                {/* <Callout title="" style={{ width: 0, height: 0, opacity: 0 }} />*/}
              </MapboxGL.PointAnnotation>
            </React.Fragment>
          );
        })}
      </MapboxGL.MapView>

      {/* Floating bottom info box + button */}
      {visibleStation && (
        <View style={styles.infoContainer}>
          <Text style={styles.calloutTitle}>{visibleStation.name}</Text>
          <Text style={styles.calloutDescription}>
            {visibleStation.kwPrice} RON/kWh,{" "}
            {visibleStation.status === "connected" ? "Online" : "Offline"}
          </Text>
          <TouchableOpacity
            style={styles.calloutButton}
            onPress={() => {
              setVisibleStation(null);
              navigation.navigate("StationDetails", {
                station: visibleStation,
              });
            }}
          >
            <Text style={styles.calloutButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default HomeScreen;
