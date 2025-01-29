import React, { useState } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  ScrollView
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const CarFleets = () => {
  const [fleets, setFleets] = useState([]); // List of car fleets
  const [isAddModalVisible, setIsAddModalVisible] = useState(false); // Add modal visibility
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); // Edit modal visibility
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false); // Confirm delete modal
  const [selectedFleetIndex, setSelectedFleetIndex] = useState(null); // Index of fleet being edited
  const [newFleet, setNewFleet] = useState({
    fleetName: "",
    fleetDiscount: "",
    fleetMembers: [],
  });
  const [dummyMembers] = useState([
    "Gargantua",
    "Pantagruel",
    "Bobi",
    "Alice",
    "Stefan",
    "John Doe",
    "Jane Austen",
    "Jane Austen2",
    "Jane Austen3",
    "Jane Austen4",
    "Jane Austen5",
    "Jane Austen6",
  ]);

  const toggleMemberSelection = (member) => {
    setNewFleet((prevFleet) => {
      const isSelected = prevFleet.fleetMembers.includes(member);
      const updatedMembers = isSelected
        ? prevFleet.fleetMembers.filter((m) => m !== member)
        : [...prevFleet.fleetMembers, member];
      return { ...prevFleet, fleetMembers: updatedMembers };
    });
  };

  const addFleet = () => {
    if (newFleet.fleetName && newFleet.fleetDiscount) {
      setFleets([...fleets, newFleet]);
      resetForm();
      setIsAddModalVisible(false);
    }
  };

  const saveFleet = () => {
    const updatedFleets = [...fleets];
    updatedFleets[selectedFleetIndex] = newFleet;
    setFleets(updatedFleets);
    resetForm();
    setIsEditModalVisible(false);
  };

  const deleteFleet = () => {
    const updatedFleets = fleets.filter(
      (_, index) => index !== selectedFleetIndex
    );
    setFleets(updatedFleets);
    setIsConfirmModalVisible(false);
    setIsEditModalVisible(false);
  };

  const resetForm = () => {
    setNewFleet({ fleetName: "", fleetDiscount: "", fleetMembers: [] });
    setSelectedFleetIndex(null);
  };

  return (
    <View style={styles.container}>
      {fleets.length > 0 ? (
        <FlatList
          data={fleets}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.fleetItem}
              onPress={() => {
                setSelectedFleetIndex(index);
                setNewFleet(item);
                setIsEditModalVisible(true);
              }}
            >
              <Text style={styles.fleetText}>Fleet Name: {item.fleetName}</Text>
              <Text style={styles.fleetText}>
                Discount: {item.fleetDiscount}%
              </Text>
              <Text style={styles.fleetText}>
                Members: {item.fleetMembers.join(", ")}
              </Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.emptyMessage}>
          No car fleets available. Add a new fleet to get started.
        </Text>
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsAddModalVisible(true)}
      >
        <Icon name="add" size={30} color="white" />
      </TouchableOpacity>

      {/* Add Fleet Modal */}
      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Car Fleet</Text>
            <TextInput
              style={styles.input}
              placeholder="Fleet Name"
              value={newFleet.fleetName}
              onChangeText={(text) =>
                setNewFleet({ ...newFleet, fleetName: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Discount (%)"
              keyboardType="numeric"
              value={newFleet.fleetDiscount}
              onChangeText={(text) =>
                setNewFleet({ ...newFleet, fleetDiscount: text })
              }
            />
            <Text style={styles.membersTitle}>Select Members:</Text>
            <View style={{ maxHeight: 200 }}>
              <ScrollView>
                {dummyMembers.map((member) => (
                  <TouchableOpacity
                    key={member}
                    style={[
                      styles.memberItem,
                      newFleet.fleetMembers.includes(member) &&
                        styles.memberSelected,
                    ]}
                    onPress={() => toggleMemberSelection(member)}
                  >
                    <Text>{member}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.addButton} onPress={addFleet}>
                <Text style={styles.addButtonText}>Save</Text>
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

      {/* Edit Fleet Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Car Fleet</Text>
            <TextInput
              style={styles.input}
              placeholder="Fleet Name"
              value={newFleet.fleetName}
              onChangeText={(text) =>
                setNewFleet({ ...newFleet, fleetName: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Discount (%)"
              keyboardType="numeric"
              value={newFleet.fleetDiscount}
              onChangeText={(text) =>
                setNewFleet({ ...newFleet, fleetDiscount: text })
              }
            />
            <Text style={styles.membersTitle}>Select Members:</Text>
            <View style={{ maxHeight: 200 }}>
              <ScrollView>
                {dummyMembers.map((member) => (
                  <TouchableOpacity
                    key={member}
                    style={[
                      styles.memberItem,
                      newFleet.fleetMembers.includes(member) &&
                        styles.memberSelected,
                    ]}
                    onPress={() => toggleMemberSelection(member)}
                  >
                    <Text>{member}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.addButton} onPress={saveFleet}>
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
                <Text style={styles.cancelButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal
        visible={isConfirmModalVisible}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Are you sure you want to delete this fleet?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.addButton} onPress={deleteFleet}>
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
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
  fleetItem: {
    backgroundColor: "white",
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
  },
  fleetText: { fontSize: 16, color: "#333" },
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
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  membersTitle: { fontSize: 16, marginBottom: 10 },
  memberItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 5,
  },
  memberSelected: { backgroundColor: "#d1ecf1" },
  modalActions: { flexDirection: "row", justifyContent: "space-between" },
  addButton: { backgroundColor: "#2196F3", padding: 10, borderRadius: 8 },
  addButtonText: { color: "white", fontWeight: "bold" },
  cancelButton: { backgroundColor: "#eb463b", padding: 10, borderRadius: 8 },
  cancelButtonText: { color: "white", fontWeight: "bold" },
});

export default CarFleets;
