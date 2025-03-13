import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./context/AuthContext";
import { Slot } from "expo-router";
import { StripeProvider } from "@stripe/stripe-react-native";
import Constants from "expo-constants";

const STRIPE_PUBLISHABLE_KEY = Constants.expoConfig?.extra?.STRIPE_PUBLISHABLE_KEY;

export default function App() {
  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY ? STRIPE_PUBLISHABLE_KEY  : ''}>
      <AuthProvider>
        <NavigationContainer>
          <Slot />
        </NavigationContainer>
      </AuthProvider>
    </StripeProvider>
  );
}
