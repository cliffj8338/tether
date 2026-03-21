import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";
import Colors from "@/constants/colors";
import { Fonts } from "@/constants/typography";
import { Badge } from "@/components/ui/Badge";

export default function ParentTabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
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
        name="dashboard"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ color }) => (
            <Feather name="message-circle" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: "Alerts",
          tabBarIcon: ({ color }) => (
            <View>
              <Feather name="bell" size={20} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: "Community",
          tabBarIcon: ({ color }) => (
            <Feather name="users" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <Feather name="settings" size={20} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
