import React, { useState } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const Cards = () => {
  const [cards, setCards] = useState([]); // List of cards
  const [isAddModalVisible, setIsAddModalVisible] = useState(false); // Controls add form visibility
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); // Controls edit form visibility
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false); // Confirm delete modal
  const [selectedCardIndex, setSelectedCardIndex] = useState(null); // Index of the card being edited
  const [newCard, setNewCard] = useState({
    cardHolderName: "",
    cardNumber: "",
    cvv: "",
    expirationDate: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); // For validation errors
  const { expirationMonth, expirationYear } = newCard;
  const month = parseInt(expirationMonth, 10);
  const year = parseInt(expirationYear, 10);

  // Function to validate the card input fields
  const validateCard = () => {
    const { cardHolderName, cardNumber, cvv, expirationDate } = newCard;

    // Check card holder name for invalid characters
    if (!/^[a-zA-Z\s]+$/.test(cardHolderName)) {
      setErrorMessage(
        "Card holder name should only contain letters and spaces."
      );
      return false;
    }

    // Check card number for numeric and 16 digits
    if (!/^\d{16}$/.test(cardNumber)) {
      setErrorMessage("Card number must be a 16-digit number.");
      return false;
    }

    // Check CVV for numeric and 3 digits
    if (!/^\d{3}$/.test(cvv)) {
      setErrorMessage("CVV must be a 3-digit number.");
      return false;
    }

    if (!/^\d{4}$/.test(expirationYear)) {
      setErrorMessage("Expiration year must be in YYYY format.");
      return false;
    }

    // // Check expiration date format MM/YY and ensure it's a future date
    // const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    // if (!expiryRegex.test(expirationDate)) {
    //   setErrorMessage("Expiration date must be in MM/YY format.");
    //   return false;
    // }

    if (!month || !year || month < 1 || month > 12) {
      setErrorMessage("Invalid expiration date. Ensure month is 01-12.");
      return false;
    }

    const currentDate = new Date();
    const expiryDate = new Date(year, month - 1); // Use full year and month
    if (expiryDate <= currentDate) {
      setErrorMessage("Expiration date must be in the future.");
      return false;
    }

    // If all validations pass
    setErrorMessage("");
    return true;
  };

  // Function to handle adding a new card
  const addCard = () => {
    if (validateCard()) {
      setCards([
        ...cards,
        {
          ...newCard,
          expirationDate: `${newCard.expirationMonth.padStart(2, "0")}/${
            newCard.expirationYear
          }`,
        },
      ]);
      // Add the new card to the list
      resetForm();
      setIsAddModalVisible(false); // Close the form modal
    }
  };

  // Function to handle saving edits to an existing card
  const saveCard = () => {
    if (validateCard()) {
      const updatedCards = [...cards];
      updatedCards[selectedCardIndex] = {
        ...newCard,
        expirationDate: `${newCard.expirationMonth.padStart(2, "0")}/${
          newCard.expirationYear
        }`,
      };
      setCards(updatedCards);
      resetForm();
      setIsEditModalVisible(false); // Close the edit modal
    }
  };

  // Function to reset the form fields
  const resetForm = () => {
    setNewCard({
      cardHolderName: "",
      cardNumber: "",
      cvv: "",
      expirationDate: "",
    });
    setSelectedCardIndex(null);
    setErrorMessage("");
  };

  // Function to handle removing a card
  const removeCard = () => {
    const updatedCards = cards.filter(
      (_, index) => index !== selectedCardIndex
    );
    setCards(updatedCards);
    setIsConfirmModalVisible(false);
    setIsEditModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {cards.length > 0 ? (
        <FlatList
          data={cards}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.cardItem}
              onPress={() => {
                setSelectedCardIndex(index);
                setNewCard(item);
                setIsEditModalVisible(true);
              }}
            >
              <Text style={styles.cardText}>
                Card Holder: {item.cardHolderName}
              </Text>
              <Text style={styles.cardText}>
                Card Number: {item.cardNumber}
              </Text>
              <Text style={styles.cardText}>
                Expiration: {item.expirationDate || `${item.expirationMonth}/${item.expirationYear}`}
              </Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.emptyMessage}>
          There are no cards saved. Add a new card to get started.
        </Text>
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsAddModalVisible(true)}
      >
        <Icon name="add" size={30} color="white" />
      </TouchableOpacity>

      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adauga Card</Text>
            <TextInput
              style={styles.input}
              placeholder="Card Holder Name"
              value={newCard.cardHolderName}
              onChangeText={(text) =>
                setNewCard({ ...newCard, cardHolderName: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Card Number"
              keyboardType="number-pad"
              value={newCard.cardNumber}
              onChangeText={(text) =>
                setNewCard({ ...newCard, cardNumber: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="CVV"
              keyboardType="number-pad"
              value={newCard.cvv}
              onChangeText={(text) => setNewCard({ ...newCard, cvv: text })}
            />
            <View style={styles.row}>
              <TextInput
                style={[styles.input, { flex: 1, marginRight: 5 }]}
                placeholder="MM"
                keyboardType="number-pad"
                value={newCard.expirationMonth}
                onChangeText={(text) =>
                  setNewCard({ ...newCard, expirationMonth: text })
                }
              />
              <TextInput
                style={[styles.input, { flex: 1, marginLeft: 5 }]}
                placeholder="YY"
                keyboardType="number-pad"
                value={newCard.expirationYear}
                onChangeText={(text) =>
                  setNewCard({ ...newCard, expirationYear: text })
                }
              />
            </View>
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.addButton} onPress={addCard}>
                <Text style={styles.addButtonText}>Add Card</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsAddModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal for Editing a Card */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Card</Text>
            <TextInput
              style={styles.input}
              placeholder="Card Holder Name"
              value={newCard.cardHolderName}
              onChangeText={(text) =>
                setNewCard({ ...newCard, cardHolderName: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Card Number"
              keyboardType="number-pad"
              value={newCard.cardNumber}
              onChangeText={(text) =>
                setNewCard({ ...newCard, cardNumber: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="CVV"
              keyboardType="number-pad"
              value={newCard.cvv}
              onChangeText={(text) => setNewCard({ ...newCard, cvv: text })}
            />
            <View style={styles.row}>
              <TextInput
                style={[styles.input, { flex: 1, marginRight: 5 }]}
                placeholder="MM"
                keyboardType="number-pad"
                value={newCard.expirationMonth}
                onChangeText={(text) =>
                  setNewCard({ ...newCard, expirationMonth: text })
                }
              />
              <TextInput
                style={[styles.input, { flex: 1, marginLeft: 5 }]}
                placeholder="YY"
                keyboardType="number-pad"
                value={newCard.expirationYear}
                onChangeText={(text) =>
                  setNewCard({ ...newCard, expirationYear: text })
                }
              />
            </View>
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.addButton} onPress={saveCard}>
                <Text style={styles.addButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: "#f44336" }]}
                onPress={() => setIsConfirmModalVisible(true)}
              >
                <Text style={styles.cancelButtonText}>Remove Card</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Confirmation Modal for Deleting a Card */}
      <Modal
        visible={isConfirmModalVisible}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Are you sure you want to remove this card?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.addButton} onPress={removeCard}>
                <Text style={styles.addButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsConfirmModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  cardItem: {
    backgroundColor: "white",
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  cardText: {
    fontSize: 16,
    color: "#333",
  },
  emptyMessage: {
    fontSize: 18,
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#2196F3",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#eb463b",
    padding: 10,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Cards;
