import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import settingsStyles from "./SettingsStyles";
import { fetchUserData, updateUserData } from "../../api/users";

const Settings = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cui, setCui] = useState("");
  const [email, setEmail] = useState("");
  const [autochargeEnabled, setAutochargeEnabled] = useState(false);

  const [editingField, setEditingField] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalConfirmAction, setModalConfirmAction] = useState<() => void>(
    () => {}
  );

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await fetchUserData();
        if (userData) {
          setFirstName(userData.firstName || "");
          setLastName(userData.lastName || "");
          setCui(userData.CUI || "");
          setEmail(userData.mail || "");
          setAutochargeEnabled(userData.autocharge === true);
        }
      } catch (err) {
        console.error("Failed to load user data:", err);
      }
    };

    loadUserData();
  }, []);

  const showModal = (message: string, onConfirm: () => void) => {
    setModalMessage(message);
    setModalConfirmAction(() => onConfirm);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const validateInput = (field: string, value: string): string => {
    if (field === "firstName" || field === "lastName") {
      if (!/^[a-zA-Z]+$/.test(value)) {
        return `${
          field === "firstName" ? "First Name" : "Last Name"
        } must contain only letters.`;
      }
    }
    if (field === "mail") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return "Please enter a valid email address.";
      }
    }
    return "";
  };

  const formatName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const handleEdit = (field: string, currentValue: string) => {
    setEditingField(field);
    setInputValue(currentValue);
    setErrorMessage("");
  };

  const handleSave = async () => {
    const validationError = validateInput(editingField!, inputValue);

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    if (editingField === "CUI" || editingField === "mail") {
      showModal(
        <Text>
          Are you sure you want to change the {editingField} from{" "}
          <Text style={settingsStyles.boldText}>
            {editingField === "CUI" ? cui : email}
          </Text>{" "}
          to <Text style={settingsStyles.boldText}>{inputValue}</Text>?
        </Text>,
        async () => {
          await saveFieldToDatabase(editingField!, inputValue);
          closeModal();
        }
      );
    } else {
      await saveFieldToDatabase(editingField!, inputValue);
    }
  };

  const saveFieldToDatabase = async (field: string, value: string) => {
    try {
      let valueToUpdate = value;

      if (field === "firstName") {
        const formattedValue = formatName(value);
        setFirstName(formattedValue);
        valueToUpdate = formattedValue;
      } else if (field === "lastName") {
        const formattedValue = formatName(value);
        setLastName(formattedValue);
        valueToUpdate = formattedValue;
      } else if (field === "CUI") {
        setCui(value);
      } else if (field === "mail") {
        setEmail(value);
      }

      await updateUserData(field, valueToUpdate);
    } catch (err) {
      console.error("Failed to update user data:", err);
      Alert.alert("Error", "Failed to update user data.");
    }

    setEditingField(null);
  };

  const handleCancel = () => {
    setEditingField(null);
    setErrorMessage("");
  };

  const handleToggleAutocharge = () => {
    if (!autochargeEnabled) {
      showModal(
        <Text>
          Are you sure you want to turn on the{" "}
          <Text style={settingsStyles.boldText}>Autocharge function</Text>? After
          enabling this feature, please make sure you have a Main Card set up 
          inside the Cards page. This card will be used for all autocharging transactions.
        </Text>,
        async () => {
          try {
            await updateUserData("autocharge", true);
            setAutochargeEnabled(true);
            closeModal();
          } catch (err) {
            console.error("Failed to update autocharge status:", err);
            Alert.alert("Error", "Failed to update autocharge status.");
          }
        }
      );
    } else {
      setAutochargeEnabled(false);
      updateUserData("autocharge", false);
    }
  };

  const renderField = (label: string, value: string, fieldKey: string) => (
    <View key={fieldKey} style={settingsStyles.rowContainer}>
      <View style={settingsStyles.row}>
        <Text style={settingsStyles.label}>{label}:</Text>

        <View style={settingsStyles.valueContainer}>
          {editingField === fieldKey ? (
            <TextInput
              style={settingsStyles.input}
              value={inputValue}
              onChangeText={(text) => {
                setInputValue(text);
                setErrorMessage(validateInput(fieldKey, text));
              }}
              autoFocus
            />
          ) : (
            <Text style={settingsStyles.value}>{value}</Text>
          )}

          {editingField === fieldKey ? (
            <View style={settingsStyles.editButtons}>
              <TouchableOpacity onPress={handleSave} disabled={!!errorMessage}>
                <FontAwesome
                  name="check"
                  size={20}
                  color={errorMessage ? "gray" : "green"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCancel}
                style={settingsStyles.cancelButton}
              >
                <FontAwesome name="times" size={20} color="red" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => handleEdit(fieldKey, value)}>
              <FontAwesome name="pencil" size={20} color="#3498db" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {editingField === fieldKey && errorMessage ? (
        <Text style={settingsStyles.errorText}>{errorMessage}</Text>
      ) : null}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={settingsStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={125}
    >
      <ScrollView
        contentContainerStyle={settingsStyles.scrollContainer}
        keyboardShouldPersistTaps="always"
      >
        {renderField("First Name", firstName, "firstName")}
        {renderField("Last Name", lastName, "lastName")}
        {renderField("CUI", cui, "CUI")}
        {renderField("Email", email, "mail")}

        <View style={[settingsStyles.row, settingsStyles.switchContainer]}>
          <Text style={settingsStyles.label}>Activate Autocharge:</Text>
          <Switch
            value={autochargeEnabled}
            onValueChange={handleToggleAutocharge}
          />
        </View>
      </ScrollView>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={settingsStyles.modalOverlay}>
          <View style={settingsStyles.modalContainer}>
            {modalMessage}
            <View style={settingsStyles.modalButtons}>
              <Pressable
                style={settingsStyles.modalButton}
                onPress={closeModal}
              >
                <Text style={settingsStyles.modalButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[
                  settingsStyles.modalButton,
                  settingsStyles.modalProceedButton,
                ]}
                onPress={modalConfirmAction}
              >
                <Text style={settingsStyles.modalButtonText}>Proceed</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default Settings;
