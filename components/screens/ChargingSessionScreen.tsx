import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../app/index";
import styles from "../../app/styles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type ChargingSessionScreenRouteProp = RouteProp<
  RootStackParamList,
  "ChargingSessionScreen"
>;

type NavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "ChargingSessionScreen"
>;

const TOTAL_SQUARES = 24;

const ChargingSessionScreen = () => {
  const route = useRoute<ChargingSessionScreenRouteProp>();
  const navigation = useNavigation<NavigationProps>();
  const {
    station,
    stationName,
    pistolType,
    price,
    prepaymentAmount,
    paymentIntentId,
  } = route.params;

  const [stopModalVisible, setStopModalVisible] = useState(false);
  const [completionModalVisible, setCompletionModalVisible] = useState(false);
  const [chargingActive, setChargingActive] = useState(true); // Prevents modal spam
  const [refundAmount, setRefundAmount] = useState(0);

  // Simulated charging state
  const [batteryLevel, setBatteryLevel] = useState(40); // Initial Battery %
  const [paymentUsed, setPaymentUsed] = useState(0); // Initial Usage (0 RON)
  const chargeRate = 1; // 1 kW charged per second
  const intervalTime = 1000; // Update every second

  useEffect(() => {
    if (!chargingActive) return; // Prevents further updates after charging stops

    const interval = setInterval(() => {
      setBatteryLevel((prev) => {
        const newBattery = Math.min(prev + 0.5, 100);
        return newBattery;
      });

      setPaymentUsed((prev) => {
        const newPayment = Math.min(
          prev + chargeRate * price,
          prepaymentAmount
        );
        return newPayment;
      });

      // Auto-stop conditions: Battery reaches 100% OR Payment Usage hits limit
      if (batteryLevel >= 100 || paymentUsed >= prepaymentAmount) {
        clearInterval(interval);
        setChargingActive(false); // Stop updates
        calculateRefund();
        setCompletionModalVisible(true); // Open "Charging Completed" Modal
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [batteryLevel, paymentUsed, price, prepaymentAmount, chargingActive]);

  // Calculate refund if the session stops before using the full prepayment amount
  const calculateRefund = () => {
    const unusedAmount = Math.max(prepaymentAmount - paymentUsed, 0);
    
    const roundedRefund = Math.round(unusedAmount * 100) / 100; // Converts to 2 decimals
    
    setRefundAmount(roundedRefund);
  };
  

  // Function to stop the charging session
  const handleStopCharging = () => {
    setStopModalVisible(true);
  };

  // Function when the user confirms stopping the session
  const confirmStopCharging = () => {
    setStopModalVisible(false);
    calculateRefund();
    setChargingActive(false);
    setCompletionModalVisible(true);
  };

  //la munca: "http://192.168.27.176:3000/create-payment-intent"
  //acasa - IP DINAMIC: "http://192.168.0.103:3000/create-payment-intent"
  // Function when the user acknowledges the charging session completion
  const handleProceed = async () => {
    setCompletionModalVisible(false);

    if (refundAmount > 0) {
      try {
        const response = await fetch("http://192.168.27.176:3000/refund", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentIntentId,
            refundAmount: Number(refundAmount.toFixed(2)),
          }),
        });

        const result = await response.json();

        if (result.success) {
          Alert.alert(
            "Refund Successful",
            `You have been refunded ${refundAmount.toFixed(2)} RON.`
          );
        } else {
          Alert.alert(
            "Refund Failed",
            "An error occurred while processing your refund."
          );
        }
      } catch (error) {
        Alert.alert("Refund Error", "Could not process the refund.");
      }
    }

    // Redirect back to station
    navigation.reset({
      index: 1,
      routes: [
        { name: "HomeMain" }, // Index 0 → Home
        { name: "StationDetails", params: { station } }, // Index 1 → Station Details
      ],
    });
  };

  return (
    <View style={styles.chargingSessionContainer}>
      <Text style={styles.chargingSessionTitle}>Charging Session Details</Text>
      <View style={styles.chargingSessionDetails}>
        <Text style={styles.chargingSessionText}>
          Station: <Text style={styles.boldText}>{stationName}</Text>
        </Text>
        <Text style={styles.chargingSessionText}>
          Pistol: <Text style={styles.boldText}>{pistolType}</Text>
        </Text>
        <Text style={styles.chargingSessionText}>
          Charging Price: <Text style={styles.boldText}>{price} RON/kWh</Text>
        </Text>
        <Text style={styles.chargingSessionText}>
          Paid Amount:{" "}
          <Text style={styles.boldText}>{prepaymentAmount} RON</Text>
        </Text>
      </View>

      {/* Battery Level Indicator with Animated Squares */}
      <View style={styles.batteryContainer}>
        <View style={styles.batteryCircle}>
          {Array.from({ length: TOTAL_SQUARES }).map((_, index) => {
            const angle = (index / TOTAL_SQUARES) * 360; // Distribute squares evenly
            const isFilled = index < (batteryLevel / 100) * TOTAL_SQUARES; // Determine if square should be filled

            return (
              <View
                key={index}
                style={[
                  styles.batterySquare,
                  {
                    transform: [
                      { rotate: `${angle}deg` },
                      { translateY: -50 }, // Push squares outward
                    ],
                    backgroundColor: isFilled ? "#3156bd" : "white",
                  },
                ]}
              />
            );
          })}
          <Text style={styles.batteryLevelText}>
            {batteryLevel.toFixed(1)}%
          </Text>
        </View>
        <Text style={styles.paymentUsageText}>
          Payment Usage: {paymentUsed.toFixed(2)} / {prepaymentAmount} RON
        </Text>
      </View>

      {/* Stop Charging Button */}
      {chargingActive && (
        <TouchableOpacity
          style={styles.stopChargingButton}
          onPress={handleStopCharging}
        >
          <Text style={styles.stopChargingButtonText}>Stop Charging</Text>
        </TouchableOpacity>
      )}

      {/* Stop Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={stopModalVisible}
        onRequestClose={() => setStopModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Are you sure you want to interrupt the charging session?
            </Text>
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setStopModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={confirmStopCharging}
              >
                <Text style={styles.modalConfirmButtonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Charging Completed Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={completionModalVisible}
        onRequestClose={() => setCompletionModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {refundAmount > 0
                ? `Charging Session Completed - Prepaid Amount unused.\nYou will be refunded the remaining amount.`
                : "Charging session completed."}
              {"\n"}You can find the details of the session at Profile &gt;
              Invoices.
            </Text>
            <TouchableOpacity
              style={styles.proceedButtonChargingSession}
              onPress={handleProceed}
            >
              <Text style={styles.proceedButtonTextChargingSession}>
                Proceed
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ChargingSessionScreen;
