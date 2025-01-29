import React, { useState } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const ManageUsers = () => {
  const [users, setUsers] = useState([]); // List of users
  const [isAddModalVisible, setIsAddModalVisible] = useState(false); // Add modal visibility
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); // Edit modal visibility
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false); // Confirm delete modal
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] =
    useState(false); // Change password modal
  const [selectedUserIndex, setSelectedUserIndex] = useState(null); // Index of user being edited
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    phone: "",
    fleet: "",
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // For password visibility toggle
  const [changePassword, setChangePassword] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const [dummyFleets] = useState([
    "Fleet A",
    "Fleet B",
    "Fleet C",
    "Fleet D",
    "Fleet E",
  ]);

  const addUser = () => {
    if (
      newUser.username &&
      newUser.password &&
      newUser.confirmPassword &&
      newUser.password === newUser.confirmPassword &&
      newUser.email
    ) {
      setUsers([...users, newUser]);
      resetForm();
      setIsAddModalVisible(false);
    }
  };
  const saveUser = () => {
    const updatedUsers = [...users];
    updatedUsers[selectedUserIndex] = newUser;
    setUsers(updatedUsers);
    resetForm();
    setIsEditModalVisible(false);
  };

  const deleteUser = () => {
    const updatedUsers = users.filter(
      (_, index) => index !== selectedUserIndex
    );
    setUsers(updatedUsers);
    setIsConfirmModalVisible(false);
    setIsEditModalVisible(false);
  };

  const changePasswordForUser = () => {
    if (
      changePassword.newPassword &&
      changePassword.confirmNewPassword &&
      changePassword.newPassword === changePassword.confirmNewPassword
    ) {
      const updatedUsers = [...users];
      updatedUsers[selectedUserIndex].password = changePassword.newPassword;
      setUsers(updatedUsers);
      setIsChangePasswordModalVisible(false);
      setChangePassword({ newPassword: "", confirmNewPassword: "" });
    }
  };

  const resetForm = () => {
    setNewUser({
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      phone: "",
      fleet: "",
    });
    setSelectedUserIndex(null);
  };

  return (
    <View style={styles.container}>
      {users.length > 0 ? (
        <FlatList
          data={users}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.userItem}
              onPress={() => {
                setSelectedUserIndex(index);
                setNewUser(item);
                setIsEditModalVisible(true);
              }}
            >
              <Text style={styles.userText}>Username: {item.username}</Text>
              <Text style={styles.userText}>Email: {item.email}</Text>
              <Text style={styles.userText}>Fleet: {item.fleet}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.emptyMessage}>
          No users available. Add a new user to get started.
        </Text>
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsAddModalVisible(true)}
      >
        <Icon name="add" size={30} color="white" />
      </TouchableOpacity>

      {/* Add User Modal */}
      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add User</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={newUser.username}
              onChangeText={(text) =>
                setNewUser({ ...newUser, username: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={newUser.password}
              onChangeText={(text) =>
                setNewUser({ ...newUser, password: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry
              value={newUser.confirmPassword}
              onChangeText={(text) =>
                setNewUser({ ...newUser, confirmPassword: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              keyboardType="email-address"
              value={newUser.email}
              onChangeText={(text) => setNewUser({ ...newUser, email: text })}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.addButton} onPress={addUser}>
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

      {/* Edit User Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit User</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={newUser.username}
              onChangeText={(text) =>
                setNewUser({ ...newUser, username: text })
              }
            />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Password"
                secureTextEntry={!isPasswordVisible}
                value={newUser.password}
                editable={false} // Prevent editing directly
              />
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <Icon
                  name={isPasswordVisible ? "visibility" : "visibility-off"}
                  size={24}
                  color="#555"
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.changePasswordButton}
              onPress={() => setIsChangePasswordModalVisible(true)}
            >
              <Text style={styles.changePasswordText}>Change Password</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              keyboardType="email-address"
              value={newUser.email}
              onChangeText={(text) => setNewUser({ ...newUser, email: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              value={newUser.phone}
              onChangeText={(text) => setNewUser({ ...newUser, phone: text })}
            />
            <Text style={styles.dropdownTitle}>Select Fleet:</Text>
            <View style={{ maxHeight: 200 }}>
              <ScrollView>
                {dummyFleets.map((fleet) => (
                  <TouchableOpacity
                    key={fleet}
                    style={[
                      styles.memberItem,
                      newUser.fleet === fleet && styles.memberSelected,
                    ]}
                    onPress={() => setNewUser({ ...newUser, fleet })}
                  >
                    <Text>{fleet}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            {/* Save and Cancel buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.addButton} onPress={saveUser}>
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
              Are you sure you want to delete this user?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.addButton} onPress={deleteUser}>
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

      {/* Change Password Modal */}
      <Modal
        visible={isChangePasswordModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <TextInput
              style={styles.input}
              placeholder="New Password"
              secureTextEntry
              value={changePassword.newPassword}
              onChangeText={(text) =>
                setChangePassword({ ...changePassword, newPassword: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm New Password"
              secureTextEntry
              value={changePassword.confirmNewPassword}
              onChangeText={(text) =>
                setChangePassword({
                  ...changePassword,
                  confirmNewPassword: text,
                })
              }
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={changePasswordForUser}
              >
                <Text style={styles.addButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsChangePasswordModalVisible(false)}
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
  userItem: {
    backgroundColor: "white",
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // For Android
  },
  userText: { fontSize: 16, color: "#333" },
  emptyMessage: {
    fontSize: 18,
    textAlign: "center",
    color: "#888",
    marginTop: 30, // Increase spacing
    paddingHorizontal: 20, // Add padding for better readability
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
  dropdownTitle: { fontSize: 16, marginBottom: 10 },
  memberItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 5,
  },
  memberSelected: { backgroundColor: "#d1ecf1" },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 7,
  },
  addButton: { backgroundColor: "#2196F3", padding: 10, borderRadius: 8 },
  addButtonText: { color: "white", fontWeight: "bold" },
  cancelButton: { backgroundColor: "#eb463b", padding: 10, borderRadius: 8 },
  cancelButtonText: { color: "white", fontWeight: "bold" },
  changePasswordButton: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#FFA726", // Orange for visibility
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  changePasswordText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ManageUsers;
