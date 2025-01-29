import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/Ionicons"; // Import vector icons
import HomeScreen from "../components/screens/HomeScreen";
import StationDetailsScreen from "../components/screens/StationDetailsScreen";
import ProfileMainScreen from "../components/screens/ProfileMainScreen";
import AdminSettingsScreen from "../components/screens/AdminSettingsScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="HomeMain"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="StationDetails" component={StationDetailsScreen} options={{ title: "Station Details" }}/>
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="ProfileMain"
      component={ProfileMainScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const AdminStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="AdminSettings"
      component={AdminSettingsScreen}
      options={{ title: "Admin Settings" }}
    />
  </Stack.Navigator>
);

export default function index() {
  return (
    <Tab.Navigator
      initialRouteName="Home" // Set your initial screen here
      screenOptions={({ route }) => ({
        headerShown: false, // Removes the header at the top
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "Admin") {
            iconName = focused ? "settings" : "settings-outline";
          }

          // Return the corresponding icon
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#4682B4",
        tabBarInactiveTintColor: "gray", 
        tabBarStyle: {
          height: 55, 
        },
        tabBarLabelStyle: {
          fontSize: 14, 
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
      <Tab.Screen name="Admin" component={AdminStack} />
    </Tab.Navigator>
  );
}
