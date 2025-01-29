import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import styles from "../../app/styles";
import { initStripe, useStripe } from "@stripe/stripe-react-native";


const StationDetailsScreen = ({ route }: { route: any }) => {
  const { station } = route.params;
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);


  const fetchPaymentSheetParams = async () => {
    try {
      const response = await fetch(
        `http://192.168.27.176:3000/create-payment-intent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: 500, // Convert to cents
            currency: "usd",
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch payment intent");
      }
      const data = await response.json();
      console.log("Received payment intent data:", data);
      if (data.paymentIntent) {
        return { paymentIntent: data.paymentIntent };
      } else {
        console.error("Invalid payment intent received.");
        return { paymentIntent: null };
      }
    } catch (error) {
      console.error("Error fetching payment sheet params:", error);
      Alert.alert(
        "Error",
        "Unable to fetch payment details. Please try again."
      );
      return { paymentIntent: null };
    }
  };

  const initializePaymentSheet = async () => {
    console.log("Initializing payment sheet...");

    const { paymentIntent } = await fetchPaymentSheetParams();
    if (paymentIntent) {
      console.log("Initializing Stripe payment sheet with intent:", paymentIntent);

      const { error } = await initPaymentSheet({
        merchantDisplayName: "Arsek Inc.",
        paymentIntentClientSecret: paymentIntent,
        defaultBillingDetails: { name: "Jane Doe" },
        returnURL: 'your-app://stripe-redirect', //nu se stie
        style: 'alwaysDark', //dark mode
      });
      if (error) {
        console.error("Error initializing payment sheet:", error);
        Alert.alert("Error", error.message);
      } else {
        console.log("Payment sheet initialized successfully.");
        setLoading(false);
      }
    } else {
      console.log("Payment intent not received. Initialization skipped.");
      setLoading(false);
    }
  };

  const openPaymentSheet = async () => {
    try {
      console.log("Opening payment sheet...");
      const { error } = await presentPaymentSheet();
  
      if (error) {
        console.error("Error presenting payment sheet:", error);
        Alert.alert(`Error code: ${error.code}`, error.message);
      } else {
        console.log("Payment successful!");
        Alert.alert("Success", "Your order is confirmed!");
      }
    } catch (error) {
      console.error("Error opening payment sheet:", error);
      Alert.alert("Error", "Something went wrong when opening the payment sheet.");
    }
  };

  useEffect(() => {
    console.log("Component mounted. Initializing payment sheet...");
    initStripe({
      publishableKey: "pk_test_51QhSjJP7xXDP0ztoS1A3FLyEiozjUjZDEl6QqbbyLY1W1HxEk52cX0Dwd3UJ2FRWIHbcw2O5SdXTnymXRgDwNNqH00M0WuHxsu",
      merchantIdentifier: 'Arsek Inc.',
      urlScheme:"http://192.168.27.176:3000" //nu se stie
    });
    initializePaymentSheet();
  }, []); // Only run once on component mount

  return (
    <View style={styles.detailsContainer}>
      <Text style={styles.detailsTitle}>{station.name}</Text>
      <Text style={styles.detailsDescription}>
        Price: {station.kwPrice} USD/kWh,{" "}
        {station.status === "connected" ? "Online" : "Offline"}
      </Text>
      <TouchableOpacity
        style={styles.calloutButton}
        onPress={openPaymentSheet}
        disabled={loading} // Disable button while loading
      >
        <Text style={styles.calloutButtonText}>
          {loading ? "Loading..." : "Start Payment"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default StationDetailsScreen;
