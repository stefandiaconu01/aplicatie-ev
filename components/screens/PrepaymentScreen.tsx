import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../app/index";
import { initStripe, useStripe } from "@stripe/stripe-react-native";
import styles from "../../app/styles";

import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";

import Constants from "expo-constants";

const STRIPE_PUBLISHABLE_KEY =
  Constants.expoConfig?.extra?.STRIPE_PUBLISHABLE_KEY;

type PrepaymentScreenRouteProp = RouteProp<
  RootStackParamList,
  "PrepaymentScreen"
>;

const PrepaymentScreen = () => {
  const route = useRoute<PrepaymentScreenRouteProp>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { station, stationName, pistolType, price } = route.params;
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  // Prepayment amounts
  const prepaymentOptions = [50, 100, 150, 200];
  const [selectedPrepayment, setSelectedPrepayment] = useState<number | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);

  //la munca: "http://192.168.27.176:3000/create-payment-intent"
  //acasa - IP DINAMIC: "http://192.168.0.103:3000/create-payment-intent"
  const fetchPaymentSheetParams = async (amount: number) => {
    try {
      const response = await fetch(
        "http://192.168.27.176:3000/create-payment-intent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: amount * 100, // Multiply by 100 to convert to cents
            currency: "ron",
          }),
        }
      );
      const data = await response.json();

      console.log("Received PaymentIntent response:", data); // DEBUG LOG

      return {
        paymentIntent: data.paymentIntent,
        paymentIntentId: data.paymentIntentId, // Now we extract this ID for refunds
      };
    } catch (error) {
      Alert.alert("Error", "Unable to fetch payment details.");
      return { paymentIntent: null, paymentIntentId: null };
    }
  };

  var paymentIntentIdx = "";

  const initializePaymentSheet = async (amount: number) => {
    const { paymentIntent, paymentIntentId } = await fetchPaymentSheetParams(
      amount
    );

    paymentIntentIdx = paymentIntentId;

    if (paymentIntent) {
      const { error } = await initPaymentSheet({
        merchantDisplayName: "Arsek Inc.",
        paymentIntentClientSecret: paymentIntent,
        style: "alwaysDark",
      });
      if (error) Alert.alert("Error", error.message);
    }
  };

  const openPaymentSheet = async () => {
    if (!selectedPrepayment) {
      Alert.alert("Error", "Please select a prepayment amount.");
      return;
    }

    setIsProcessing(true);

    // Initialize the payment sheet with the selected prepayment amount
    await initializePaymentSheet(selectedPrepayment);

    // Now open the Stripe payment sheet
    const { error } = await presentPaymentSheet();
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert(
        "Success",
        "Payment accepted! The charging session will start soon.",
        [
          {
            text: "OK",
            onPress: () =>
              navigation.navigate("ChargingSessionScreen", {
                station: station,
                stationName,
                pistolType,
                price,
                prepaymentAmount: selectedPrepayment!,
                paymentIntentId: paymentIntentIdx,
              }),
          },
        ]
      );
    }
    setTimeout(() => setIsProcessing(false), 2500);
  };

  useEffect(() => {
    initStripe({
      publishableKey: STRIPE_PUBLISHABLE_KEY ? STRIPE_PUBLISHABLE_KEY : "",
      merchantIdentifier: "Arsek Inc.",
    });
  }, []);

  return (
    <View style={styles.prepaymentContainer}>
      <Text style={styles.prepaymentTitle}>Prepayment</Text>

      {/* Charging Session Details */}
      <View style={styles.prepaymentDetails}>
        <Text style={styles.prepaymentText}>
          Station: <Text style={styles.boldText}>{stationName}</Text>
        </Text>
        <Text style={styles.prepaymentText}>
          Pistol: <Text style={styles.boldText}>{pistolType}</Text>
        </Text>
        <Text style={styles.prepaymentText}>
          Charging Price: <Text style={styles.boldText}>{price} RON/kWh</Text>
        </Text>
      </View>

      {/* Divider */}
      <View style={styles.dividerPrepay} />

      {/* Prepayment Section */}
      <Text style={styles.prepaymentSubtitle}>
        Please choose a prepayment value:
      </Text>
      <View style={styles.prepaymentGrid}>
        {prepaymentOptions.map((amount) => (
          <TouchableOpacity
            key={amount}
            style={[
              styles.prepaymentButton,
              selectedPrepayment === amount
                ? styles.prepaymentButtonSelected
                : {},
            ]}
            onPress={() => {
              setSelectedPrepayment(amount);
              initializePaymentSheet(amount); // Now we initialize the sheet when user selects an amount
            }}
          >
            <Text style={styles.prepaymentButtonText}>{amount} RON</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Proceed Button (Unlocks when a selection is made) */}
      {selectedPrepayment && (
        <TouchableOpacity
          style={[styles.proceedButton, isProcessing && styles.disabledButton]}
          onPress={!isProcessing ? openPaymentSheet : undefined}
          disabled={isProcessing}
        >
          <Text style={styles.proceedButtonText}>
          {isProcessing ? "Processing..." : `Proceed with ${selectedPrepayment} RON >>`}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default PrepaymentScreen;
