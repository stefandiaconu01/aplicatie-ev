import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, Alert, TextInput } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { fetchStations } from '../api/stations';
import { handleStartPress } from './utils/rabbit';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

interface Station {
  name: string;
  sn: string;
  kwPrice: number;
  status: string;
  latitude: number;
  longitude: number;
}


// New Screen to Display Station Details
const StationDetailsScreen = ({ route }: { route: any }) => {
  const { station } = route.params;

  const handleStart = () => {
    handleStartPress(station.sn);
    Alert.alert('Action', `Start button pressed for ${station.name}`);
  };

  return (
    <View style={styles.detailsContainer}>
      <Text style={styles.detailsTitle}>{station.name}</Text>
      <Text style={styles.detailsDescription}>
        Pret: {station.kwPrice} RON/kWh,{' '}
        {station.status === 'connected' ? 'Online' : 'Offline'}
      </Text>
      <TouchableOpacity style={styles.calloutButton} onPress={handleStart}>
        <Text style={styles.calloutButtonText}>Start</Text>
      </TouchableOpacity>
    </View>
  );
};

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const [stations, setStations] = useState<Station[]>([]);
  const [error, setError] = useState<string | null>(null);

  const validStations = stations.filter(
    (station) => station.latitude && station.longitude
  );

  useEffect(() => {
    const loadStations = async () => {
      try {
        const data = await fetchStations();
        setStations(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load stations');
      }
    };

    loadStations();
  }, []);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.mapContainer}>
      <Text style={styles.mapText}>Solar Planners</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 45.84468,
          longitude: 24.96925,
          latitudeDelta: 4.0,
          longitudeDelta: 4.0,
        }}
      >
        {validStations.map((station, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: station.latitude,
              longitude: station.longitude,
            }}
          >
            <Callout onPress={() => navigation.navigate('StationDetails', { station })}>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{station.name}</Text>
                <Text style={styles.calloutDescription}>
                  Pret: {station.kwPrice} RON/kWh,{' '}
                  {station.status === 'connected' ? 'Online' : 'Offline'}
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

// Main App Navigator
const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StationDetails"
        component={StationDetailsScreen}
        options={({ route }) => ({ title: 'Station Details' })}
      />
    </Stack.Navigator>
  );
};

// Profile Screen and Sub-Screens
const ProfileMainScreen = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.centeredContainer}>
      {/* Profile Picture */}
      <Image
        source={{ uri: 'https://via.placeholder.com/150' }} // Placeholder image
        style={styles.profilePicture}
      />

      {/* Name and Email */}
      <Text style={styles.profileName}>John Doe</Text>
      <Text style={styles.profileEmail}>johndoe@example.com</Text>

      {/* Buttons */}
      <TouchableOpacity
        style={styles.customButton}
        onPress={() => navigation.navigate('Carduri')}
      >
        <Text style={styles.buttonText}>Carduri</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.customButton}
        onPress={() => navigation.navigate('Tranzactii')}
      >
        <Text style={styles.buttonText}>Tranzactii</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.customButton}
        onPress={() => navigation.navigate('Setari')}
      >
        <Text style={styles.buttonText}>Setari</Text>
      </TouchableOpacity>
    </View>
  );
};

const Carduri = () => (
  <View style={styles.abcdefContainer}>
    <Text style={styles.abcdefText}>Carduri</Text>
  </View>
);

const Tranzactii = () => (
  <View style={styles.abcdefContainer}>
    <Text style={styles.abcdefText}>Tranzactii</Text>
  </View>
);

const Setari = () => {
  const [cui, setCui] = useState('');
  const [email, setEmail] = useState('');

  const handleSave = () => {
    // You can add your save logic here (e.g., send data to a server or save locally)
    Alert.alert('Saved', `CUI: ${cui}\nEmail: ${email}`);
  };

  return (
    <View style={styles.setariContainer}>
      {/* CUI Input */}
      <Text style={styles.label}>CUI</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter CUI"
        value={cui}
        onChangeText={setCui}
      />

      {/* Email Input */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const ProfileScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileMain"
        component={ProfileMainScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Carduri" component={Carduri} options={{ title: 'Carduri' }} />
      <Stack.Screen name="Tranzactii" component={Tranzactii} options={{ title: 'Tranzactii' }} />
      <Stack.Screen name="Setari" component={Setari} options={{ title: 'Setari' }} />
    </Stack.Navigator>
  );
};

// Main App Navigator
export default function Index() {
  return (
    <Tab.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeStack} options={{ title: 'Harta' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  mapText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  calloutContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    maxWidth: 200,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  calloutDescription: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  calloutButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calloutButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  detailsContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detailsDescription: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  customButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginVertical: 10,
    alignItems: 'center',
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  abcdefContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  abcdefText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  setariContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: 'white',
  },
  saveButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
});
