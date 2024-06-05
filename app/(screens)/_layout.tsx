import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const ScreenLayout = () => {
  return (
    <>
      <StatusBar backgroundColor="#161622" style="light" />

      <Stack>
        <Stack.Screen
          name="ScanQR"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Documents"
          options={{
            headerShown: false,
          }}
          />
          <Stack.Screen
            name="DisplayDocuments"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
          name="Transfer"
          options={{
            headerShown: false,
          }}
          />
      </Stack>
    </>
  );
};

export default ScreenLayout;
