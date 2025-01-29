import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, Switch } from 'react-native';
import styles from '../../app/styles';

const Settings = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cnp, setCnp] = useState('');
  const [cui, setCui] = useState('');
  const [email, setEmail] = useState('');
  const [autochargeEnabled, setAutochargeEnabled] = useState(false);

  const handleSave = () => {
    Alert.alert('Saved', 
      `First Name: ${firstName}\nLast Name: ${lastName}\nCNP: ${cnp}\nCUI: ${cui}\nEmail: ${email} \nAutocharge: ${autochargeEnabled ? 'Enabled' : 'Disabled'}\n`
    );
  };

  const handleToggleAutocharge = () => {
    if (!autochargeEnabled) {
      Alert.alert(
        'Confirmation',
        'Are you sure you want to enable the autocharge function?',
        [
          {
            text: 'No',
            style: 'cancel',
          },
          {
            text: 'Proceed',
            onPress: () => setAutochargeEnabled(true),
          },
        ]
      );
    } else {
      setAutochargeEnabled(false);
    }
  };

  return (
    <View style={styles.settingsContainer}>
      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <Text style={styles.label}>Last Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <Text style={styles.label}>CNP</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter CNP"
        value={cnp}
        onChangeText={setCnp}
      />
      <Text style={styles.label}>CUI</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter CUI"
        value={cui}
        onChangeText={setCui}
      />
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <View style={styles.autochargeContainer}>
        <Text style={styles.label}>Activate Autocharge</Text>
        <Switch
          value={autochargeEnabled}
          onValueChange={handleToggleAutocharge}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Settings;
