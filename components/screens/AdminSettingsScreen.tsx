import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import styles from '../../app/styles';
import StationsMap from '../admin-tabs/StationsMap';
import CarFleets from '../admin-tabs/CarFleets';
import ManageUsers from '../admin-tabs/ManageUsers';
import OCPPTest from '../admin-tabs/ocppTest';

const Stack = createNativeStackNavigator();

const AdminMainScreen = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.centeredContainer}>
      <TouchableOpacity
        style={styles.customButton}
        onPress={() => navigation.navigate('StationsMap')}
      >
        <Text style={styles.buttonText}>Stations Map</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.customButton}
        onPress={() => navigation.navigate('CarFleets')}
      >
        <Text style={styles.buttonText}>Car Fleets</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.customButton}
        onPress={() => navigation.navigate('ManageUsers')}
      >
        <Text style={styles.buttonText}>Manage Users</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.customButton}
        onPress={() => navigation.navigate('OCPPTest')}
      >
        <Text style={styles.buttonText}>OCPP Test</Text>
      </TouchableOpacity>
    </View>
  );
};

const AdminSettingsScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AdminMainScreen"
        component={AdminMainScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StationsMap"
        component={StationsMap}
        options={{ title: 'Stations Map' }}
      />
      <Stack.Screen
        name="CarFleets"
        component={CarFleets}
        options={{ title: 'Car Fleets' }}
      />
      <Stack.Screen
        name="ManageUsers"
        component={ManageUsers}
        options={{ title: 'Manage Users' }}
      />
      <Stack.Screen
        name="OCPPTest"
        component={OCPPTest}
        options={{ title: 'OCPP Test' }}
      />
    </Stack.Navigator>
  );
};

export default AdminSettingsScreen;
