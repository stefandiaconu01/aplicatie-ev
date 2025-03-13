import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/Ionicons"; // Import vector icons
import HomeScreen from "../components/screens/HomeScreen";
import StationDetailsScreen from "../components/screens/StationDetailsScreen";
import ProfileMainScreen from "../components/screens/ProfileMainScreen";
import AdminSettingsScreen from "../components/screens/AdminSettingsScreen";
import PrepaymentScreen from "../components/screens/PrepaymentScreen";
import ChargingSessionScreen from "../components/screens/ChargingSessionScreen";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export type RootStackParamList = {
  HomeMain: undefined;
  StationDetails: { station: any };
  PrepaymentScreen: { station: any; stationName: string; pistolType: string; price: number };
  ChargingSessionScreen: {
    station: any;
    stationName: string;
    pistolType: string;
    price: number;
    prepaymentAmount: number;
    paymentIntentId: string;
  };
};

const getTabBarVisibility = (route: any) => {
  const routeName = getFocusedRouteNameFromRoute(route);
  if (routeName === "ChargingSessionScreen") {
    return "none"; // Hide bottom tab when on ChargingSessionScreen
  }
  return "flex";
};

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="HomeMain"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="StationDetails"
      component={StationDetailsScreen}
      options={{ title: "Station Details" }}
    />
    <Stack.Screen
      name="PrepaymentScreen"
      component={PrepaymentScreen}
      options={{ title: "Charging Session - Prepayment" }}
    />
    <Stack.Screen
      name="ChargingSessionScreen"
      component={ChargingSessionScreen}
      options={{ title: "Charging Session - Started", headerShown: false }}
    />
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
        tabBarStyle: { display: getTabBarVisibility(route), height: 55 },
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
