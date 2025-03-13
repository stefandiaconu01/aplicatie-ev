import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
  Switch,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  CustomerSheetBeta,
  CustomerSheetError,
  initStripe,
} from "@stripe/stripe-react-native";
import styles from "./CardsStyles";
import {
  addCardToDatabase,
  fetchCardsByUser,
  updateCardData,
  resetOtherMainCards,
  fetchAllStripeCardsForUser,
  deleteCardFromDatabase,
} from "../../api/cards";
import { fetchUserData } from "../../api/users";
import Constants from "expo-constants";

const STRIPE_PUBLISHABLE_KEY =
  Constants.expoConfig?.extra?.STRIPE_PUBLISHABLE_KEY;

const Cards = () => {
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState([]);
  const [menuVisible, setMenuVisible] = useState(null);

  useEffect(() => {
    if (STRIPE_PUBLISHABLE_KEY) {
      initStripe({
        publishableKey: STRIPE_PUBLISHABLE_KEY,
        merchantIdentifier: "Arsek Inc.",
      });
    } else {
      console.error("Stripe publishable key is missing!");
    }

    loadCards();
  }, []);

  const formatDate = (isoDate) => {
    if (!isoDate) return "N/A";

    const date = new Date(isoDate);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    const HH = String(date.getHours()).padStart(2, "0");
    const MM = String(date.getMinutes()).padStart(2, "0");
    const SS = String(date.getSeconds()).padStart(2, "0");

    return `${dd}/${mm}/${yyyy} - ${HH}:${MM}:${SS}`;
  };

  const loadCards = async () => {
    try {
      setLoading(true);
      const fetchedCards = await fetchCardsByUser();
      //console.log("Fetched Cards:", fetchedCards);
      setCards(fetchedCards);
    } catch (error) {
      console.error("Error loading cards:", error);
      Alert.alert("Error", "Failed to load cards.");
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch and display all Stripe cards for this userId
  const handleShowStripeCards = async () => {
    try {
      const stripeCards = await fetchAllStripeCardsForUser();

      if (!stripeCards || stripeCards.length === 0) {
        Alert.alert("No Cards Found", "No cards are stored in Stripe.");
        return;
      }

      const cardList = stripeCards
        .map(
          (card, index) =>
            `${index + 1}. ${card.card.brand} ****${card.card.last4} - Exp: ${
              card.card.exp_month
            }/${card.card.exp_year}`
        )
        .join("\n");

      Alert.alert("Stripe Cards", cardList);
    } catch (error) {
      console.error("Error showing Stripe cards:", error);
      Alert.alert("Error", "Failed to fetch Stripe cards.");
    }
  };

  //la munca: "http://192.168.27.176:3001/"
  //acasa - IP DINAMIC: "http://192.168.0.103:3001/"
  const fetchCustomerData = async () => {
    try {
      console.log("Fetching customer data...");
      const response = await fetch("http://192.168.27.176:3001/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const jsonData = await response.json();
      console.log("Server response:", jsonData);
      return jsonData;
    } catch (error) {
      console.error("Error fetching customer data:", error);
      Alert.alert("Error", "Failed to fetch customer data.");
      return null;
    }
  };

  const fetchSetupIntent = async (customerId) => {
    try {
      const response = await fetch(
        "http://192.168.27.176:3001/create-setup-intent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customerId }),
        }
      );
      const jsonData = await response.json();
      console.log("Setup Intent response:", jsonData);
      return jsonData;
    } catch (error) {
      console.error("Error creating setup intent:", error);
      Alert.alert("Error", "Failed to create setup intent.");
      return null;
    }
  };

  const handleAddCard = async () => {
    setLoading(true);
    try {
      const customerData = await fetchCustomerData();
      if (!customerData) return;

      const setupIntent = await fetchSetupIntent(customerData.customer);
      if (!setupIntent) return;

      const { error } = await CustomerSheetBeta.initialize({
        setupIntentClientSecret: setupIntent.setupIntent,
        customerEphemeralKeySecret: customerData.ephemeralKeySecret,
        customerId: customerData.customer,
        headerTextForSelectionScreen: "Manage your payment method",
      });

      if (error) {
        console.error("Error initializing customer sheet:", error);
        Alert.alert("Error", "Failed to initialize customer sheet.");
        return;
      }

      const { error: presentError, paymentMethod } =
        await CustomerSheetBeta.present();

      //console.log("Payment Method:", paymentMethod);

      if (presentError) {
        if (presentError.code !== CustomerSheetError.Canceled) {
          console.error("Error presenting customer sheet:", presentError);
          Alert.alert("Error", "Failed to present customer sheet.");
        }
        return;
      }

      if (paymentMethod) {
        const cardData = {
          cardBrand: paymentMethod.Card.brand,
          last4: paymentMethod.Card.last4,
          expMonth: paymentMethod.Card.expMonth,
          expYear: paymentMethod.Card.expYear,
          stripeCustomerId: customerData.customer,
          stripePaymentMethodId: paymentMethod.id,
        };

        await addCardToDatabase(cardData);
        Alert.alert("Success", "Card added successfully!");
      }
    } catch (error) {
      console.error("Error adding card:", error);
      Alert.alert("Error", "Failed to add card.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCard = async (cardId) => {
    Alert.alert(
      "Delete Card",
      "Are you sure you want to permanently delete this card?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Proceed",
          onPress: async () => {
            try {
              await deleteCardFromDatabase(cardId);
              Alert.alert("Success", "Card deleted successfully!");
              loadCards(); // Refresh the card list
            } catch (error) {
              console.error("Error deleting card:", error);
              Alert.alert("Error", "Failed to delete card.");
            }
          },
        },
      ]
    );
  };

  const handleToggleSwitch = async (cardId, field, currentValue) => {
    const hasMainCard = cards.some((card) => card.isMain);

    if (field === "isAutocharge" && !currentValue) {
      try {
        const userData = await fetchUserData();
        if (!userData || !userData.autocharge) {
          Alert.alert(
            "Autocharge Not Enabled",
            "Your account is not allowed to register autocharge cards. Please check the General Settings page and enable autocharge in order to proceed."
          );
          return;
        }
      } catch (error) {
        console.error("Error checking user autocharge status:", error);
        Alert.alert("Error", "Failed to verify autocharge permission.");
        return;
      }

      if (!hasMainCard) {
        Alert.alert(
          "Define a Main Card First",
          "You cannot use autocharging before defining a Main Card. Please define a Main Card first."
        );
        return;
      }

      Alert.alert(
        "Activate Autocharge",
        "Are you sure you want to turn on the autocharge function for this card?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Proceed",
            onPress: () =>
              updateCardData(cardId, field, !currentValue).then(loadCards),
          },
        ]
      );
    } else if (field === "isMain" && !currentValue) {
      Alert.alert(
        "Set as Main Card",
        "Do you want this to be your Main Card? This will also be used for Autocharging, if enabled.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Proceed",
            onPress: async () => {
              await resetOtherMainCards(cardId);
              await updateCardData(cardId, field, !currentValue);
              loadCards();
            },
          },
        ]
      );
    } else if (field === "isMain" && currentValue) {
      Alert.alert(
        "Disable Main Card",
        "You are not allowed to have no Main Card defined and Autocharge turned on. If you wish to continue, you will not be able to use the autocharge function anymore, unless you define a new Main Card.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Proceed",
            onPress: async () => {
              await updateCardData(cardId, "isMain", false);
              await updateCardData(cardId, "isAutocharge", false);
              await resetOtherMainCards(null, true); // Reset autocharge for all cards
              loadCards();
            },
          },
        ]
      );
    } else {
      updateCardData(cardId, field, !currentValue).then(loadCards);
    }
  };

  const renderCardItem = ({ item, index }) => (
    <TouchableWithoutFeedback onPress={() => setMenuVisible(null)}>
      <View style={styles.cardItem}>
        {/* Card Details */}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text style={styles.cardText}>
              <Text style={styles.boldText}>Brand:</Text> {item.cardBrand}
            </Text>
            <Text style={styles.cardText}>
              <Text style={styles.boldText}>Last 4 Digits:</Text> ****
              {item.last4}
            </Text>
            <Text style={styles.cardText}>
              <Text style={styles.boldText}>Expiry Date:</Text> {item.expMonth}/
              {item.expYear}
            </Text>
            <Text style={styles.cardText}>
              <Text style={styles.boldText}>Added at:</Text>{" "}
              {formatDate(item.addedAt)}
            </Text>
            <View style={[styles.switchContainer]}>
              <Text style={styles.label}>Autocharge:</Text>
              <Switch
                value={item.isAutocharge}
                onValueChange={() =>
                  handleToggleSwitch(
                    item._id,
                    "isAutocharge",
                    item.isAutocharge
                  )
                }
              />
            </View>

            <View style={[styles.switchContainer]}>
              <Text style={styles.label}>Main Card:</Text>
              <Switch
                value={item.isMain}
                onValueChange={() =>
                  handleToggleSwitch(item._id, "isMain", item.isMain)
                }
              />
            </View>
          </View>

          {/* Three-Dot Menu */}
          <TouchableOpacity
            onPress={() => setMenuVisible(menuVisible === index ? null : index)}
            style={styles.menuButton}
          >
            <Icon name="more-vert" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Menu Options */}
        {menuVisible === index && (
          <View style={styles.menuOptions}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(null);
                handleDeleteCard(item._id);
              }}
            >
              <Text style={styles.menuItemText}>Delete Card</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cards}
        keyExtractor={(item) => item._id}
        renderItem={renderCardItem}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>
            There are no cards saved. Add a new card to get started.
          </Text>
        }
        ListFooterComponent={<View style={{ height: 77 }} />}
      />

      <TouchableOpacity style={styles.fab} onPress={handleAddCard}>
        <Icon name="add" size={30} color="white" />
      </TouchableOpacity>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
      )}

      <TouchableOpacity
        style={styles.showStripeCardsButton}
        onPress={handleShowStripeCards}
      >
        <Text style={styles.showStripeCardsText}>Show Stripe Cards</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Cards;
