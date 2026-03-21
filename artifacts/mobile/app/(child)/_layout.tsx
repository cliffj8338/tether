import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import Colors from "@/constants/colors";
import { Fonts } from "@/constants/typography";

export default function ChildTabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.sand,
        tabBarLabelStyle: {
          fontFamily: Fonts.bodyBold,
          fontSize: 10,
          letterSpacing: 0.2,
        },
        tabBarStyle: {
          position: "absolute",
          backgroundColor: Platform.OS === "ios" ? "transparent" : "rgba(255,255,255,0.96)",
          borderTopWidth: 0,
          elevation: 0,
          shadowColor: Colors.text,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
        },
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView intensity={100} tint="light" style={StyleSheet.absoluteFill} />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Chats",
          tabBarIcon: ({ color }) => (
            <Feather name="message-circle" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Me",
          tabBarIcon: ({ color }) => (
            <Feather name="smile" size={20} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
