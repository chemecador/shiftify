import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigator from "./src/navigation/Navigator";
import { StatusBar } from "expo-status-bar";

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Navigator />
    </SafeAreaProvider>
  );
}
