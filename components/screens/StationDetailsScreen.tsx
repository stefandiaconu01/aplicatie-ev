import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { View, Text, TouchableOpacity, Alert, Animated } from "react-native";
import { initStripe, useStripe } from "@stripe/stripe-react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import styles from "../../app/styles";

import { RootStackParamList } from "../../app/index";

// import Constants from "expo-constants";


// const STRIPE_PUBLISHABLE_KEY = Constants.expoConfig?.extra?.STRIPE_PUBLISHABLE_KEY;

// Define navigation type
type NavigationProps = NativeStackNavigationProp<RootStackParamList, "StationDetails">;

const StationDetailsScreen = ({ route }: { route: any }) => {
  const navigation = useNavigation<NavigationProps>();
  const { station } = route.params;
  // const { initPaymentSheet, presentPaymentSheet } = useStripe();


  // Function to navigate to PrepaymentScreen with required data
  const handleStartCharging = (pistolType: string) => {
    navigation.navigate("PrepaymentScreen", {
      station: station,
      stationName: station.name,
      pistolType,
      price: station.kwPrice,
    });
  };

  const fadeAnim = useState(new Animated.Value(1))[0];
  const pulseAnim = useState(new Animated.Value(1))[0];

  // Hardcoded stats
  const leftPistolStatus = "available"; // Change to 'occupied' or 'offline' as needed
  const rightPistolStatus = "available";

  const getPistolTextColor = (status: string) => {
    switch (status) {
      case "available":
        return { color: "#2E7D32" }; // Dark green
      case "occupied":
        return { color: "#FFA500" }; // Yellow
      case "offline":
        return { color: "#D32F2F" }; // Red
      default:
        return { color: "#555" };
    }
  };

  useEffect(() => {
    // initStripe({
    //   publishableKey: STRIPE_PUBLISHABLE_KEY ? STRIPE_PUBLISHABLE_KEY : '',
    //   merchantIdentifier: "Arsek Inc.",
    // });
    // initializePaymentSheet();

    // Start pulsating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.5,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    // initStripe({
    //   publishableKey: STRIPE_PUBLISHABLE_KEY ? STRIPE_PUBLISHABLE_KEY : '',
    //   merchantIdentifier: "Arsek Inc.",
    // });
    // initializePaymentSheet();

    // Pulsating animation for status indicator
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    // initStripe({
    //   publishableKey: STRIPE_PUBLISHABLE_KEY ? STRIPE_PUBLISHABLE_KEY : '',
    //   merchantIdentifier: "Arsek Inc.",
    // });
    // initializePaymentSheet();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);


  // const fetchPaymentSheetParams = async () => {
  //   try {
  //     const response = await fetch(
  //       "http://localhost:3000/create-payment-intent",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ amount: 500, currency: "usd" }),
  //       }
  //     );
  //     const data = await response.json();
  //     return { paymentIntent: data.paymentIntent };
  //   } catch (error) {
  //     Alert.alert("Error", "Unable to fetch payment details.");
  //     return { paymentIntent: null };
  //   }
  // };

  // const initializePaymentSheet = async () => {
  //   const { paymentIntent } = await fetchPaymentSheetParams();
  //   if (paymentIntent) {
  //     const { error } = await initPaymentSheet({
  //       merchantDisplayName: "Arsek Inc.",
  //       paymentIntentClientSecret: paymentIntent,
  //       style: "alwaysDark",
  //     });
  //     if (error) Alert.alert("Error", error.message);
  //   }
  // };

  // const openPaymentSheet = async () => {
  //   const { error } = await presentPaymentSheet();
  //   if (error) {
  //     Alert.alert(`Error code: ${error.code}`, error.message);
  //   } else {
  //     Alert.alert("Success", "Your order is confirmed!");
  //   }
  // };

  return (
    <Animated.View style={[styles.detailsContainer, { opacity: fadeAnim }]}>
      <Text style={styles.detailsTitle}>{station.name}</Text>
      <Text style={styles.detailsDescription}>
        Price: <Text style={styles.boldText}>{station.kwPrice} RON/kWh</Text>
      </Text>

      <View style={styles.statusContainer}>
        <Animated.View
          style={[
            styles.statusIndicator,
            station.status === "connected"
              ? styles.onlineIndicator
              : styles.offlineIndicator,
            { transform: [{ scale: pulseAnim }] }, // Apply the pulsating animation
          ]}
        />

        <Text style={styles.statusText}>
          {station.status === "connected" ? "Online" : "Offline"}
        </Text>
      </View>

      {/* Charging Options */}
      <View style={styles.chargingContainer}>
        {/* Left Pistol */}
        <View style={styles.pistolSection}>
          <Text style={styles.pistolTitle}>Left Pistol</Text>

          {/* Status Indicator */}
          <View style={styles.pistolStatusContainer}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Status: </Text>
            <Text
              style={[
                styles.pistolStatusText,
                getPistolTextColor(leftPistolStatus),
              ]}
            >
              {leftPistolStatus.charAt(0).toUpperCase() +
                leftPistolStatus.slice(1)}
            </Text>
          </View>

          {/* Icon */}
          <FontAwesome5
            name="charging-station"
            size={40}
            color="#007AFF"
            style={styles.pistolIcon}
          />

          {/* Button */}
          <TouchableOpacity
            style={styles.calloutButton}
            onPress={() => handleStartCharging("Left")}
            //instead of onPress={openPaymentSheet
          >
            <Text style={styles.calloutButtonText}>Start Charging</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Right Pistol */}
        <View style={styles.pistolSection}>
          <Text style={styles.pistolTitle}>Right Pistol</Text>

          {/* Status Indicator */}
          <View style={styles.pistolStatusContainer}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Status: </Text>
            <Text
              style={[
                styles.pistolStatusText,
                getPistolTextColor(rightPistolStatus),
              ]}
            >
              {rightPistolStatus.charAt(0).toUpperCase() +
                rightPistolStatus.slice(1)}
            </Text>
          </View>

          {/* Icon */}
          <FontAwesome5
            name="charging-station"
            size={40}
            color="#007AFF"
            style={styles.pistolIcon}
          />

          {/* Button */}
          <TouchableOpacity
            style={styles.calloutButton}
            onPress={() => handleStartCharging("Right")}
          >
            <Text style={styles.calloutButtonText}>Start Charging</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

export default StationDetailsScreen;
