import React from 'react';
import { View, Text, TouchableOpacity} from 'react-native';
// import {Image} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Cards from '../profile-tabs/Cards';
import Transactions from '../profile-tabs/Transactions';
import Settings from '../profile-tabs/Settings';
import styles from '../../app/styles';

const Stack = createNativeStackNavigator();

const imageUri = 'https://via.placeholder.com/150';

const ProfileMainScreen = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.centeredContainer}>
      {/* <Image
        source={imageUri ? { uri: imageUri } : require('./assets/images/splash.png')}
        style={styles.profilePicture}
      /> */}
      <Text style={styles.profileName}>John Doe</Text>
      <Text style={styles.profileEmail}>johndoe@example.com</Text>
      <TouchableOpacity
        style={styles.customButton}
        onPress={() => navigation.navigate('Cards')}
      >
        <Text style={styles.buttonText}>Cards</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.customButton}
        onPress={() => navigation.navigate('Transactions')}
      >
        <Text style={styles.buttonText}>Transactions</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.customButton}
        onPress={() => navigation.navigate('Settings')}
      >
        <Text style={styles.buttonText}>User Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

const ProfileScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileMainScreen"
        component={ProfileMainScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Cards" component={Cards} options={{ title: 'Cards' }} />
      <Stack.Screen name="Transactions" component={Transactions} options={{ title: 'Transactions' }} />
      <Stack.Screen name="Settings" component={Settings} options={{ title: 'User Settings' }} />
    </Stack.Navigator>
  );
};

export default ProfileScreen;
