import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./context/AuthContext";
import { Slot } from "expo-router";
import { StripeProvider } from "@stripe/stripe-react-native";

export default function App() {
  return (
    <StripeProvider publishableKey="pk_test_51QhSjJP7xXDP0ztoS1A3FLyEiozjUjZDEl6QqbbyLY1W1HxEk52cX0Dwd3UJ2FRWIHbcw2O5SdXTnymXRgDwNNqH00M0WuHxsu">
      <AuthProvider>
        <NavigationContainer>
          <Slot />
        </NavigationContainer>
      </AuthProvider>
    </StripeProvider>
  );
}
