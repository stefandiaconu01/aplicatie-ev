import React, { useState } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Button,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import * as FileSystem from "expo-file-system";

const dummyTransactions = [
  {
    id: "1",
    date: "2025-01-08 14:30",
    duration: "1h 15m",
    location: "Bucharest, Romania",
    total: "120.50 RON",
  },
  {
    id: "2",
    date: "2025-01-07 10:45",
    duration: "2h 30m",
    location: "Cluj-Napoca, Romania",
    total: "245.00 RON",
  },
  {
    id: "3",
    date: "2025-01-06 18:20",
    duration: "45m",
    location: "Timisoara, Romania",
    total: "75.30 RON",
  },
  {
    id: "4",
    date: "2025-01-05 12:00",
    duration: "1h",
    location: "Iasi, Romania",
    total: "110.00 RON",
  },
];

const Transactions = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const handleDownload = async (transaction) => {
    const fileName = `Invoice_${transaction.id}.txt`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;
    console.log('Downloading File:', filePath);

    try {
      const fileContent = `
        Transaction Details:
        Date: ${transaction.date}
        Duration: ${transaction.duration}
        Location: ${transaction.location}
        Total: ${transaction.total}
      `;

      await FileSystem.writeAsStringAsync(filePath, fileContent);
      Alert.alert('Success', `File saved to ${filePath}`);
    } catch (error) {
      console.error('Error saving file:', error);
      Alert.alert('Error', 'Failed to save file.');
    }
  };

  const handlePress = (transaction) => {
    setSelectedTransaction(transaction);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedTransaction(null);
  };

  const renderTransaction = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handlePress(item)}>
      <View style={styles.cardContent}>
        <View>
          <Text style={styles.date}>{item.date}</Text>
          <Text style={styles.details}>Duration: {item.duration}</Text>
          <Text style={styles.details}>Location: {item.location}</Text>
          <Text style={styles.details}>Total: {item.total}</Text>
        </View>
        <Button title="Download" onPress={() => handleDownload(item)} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={dummyTransactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Transaction Details</Text>
                {selectedTransaction && (
                  <>
                    <Text>Date: {selectedTransaction.date}</Text>
                    <Text>Duration: {selectedTransaction.duration}</Text>
                    <Text>Location: {selectedTransaction.location}</Text>
                    <Text>Total: {selectedTransaction.total}</Text>
                  </>
                )}
                <Button title="Close" onPress={closeModal} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: { paddingVertical: 10 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 8,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  details: { fontSize: 14, color: '#555' },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default Transactions;