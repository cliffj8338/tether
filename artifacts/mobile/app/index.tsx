import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";
import { Fonts } from "@/constants/typography";
import { useAuth } from "@/context/AuthContext";

export default function SplashRouter() {
  const { user, isLoading, isOnboarded } = useAuth();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (isLoading) return;

    const timer = setTimeout(() => {
      if (!isOnboarded) {
        router.replace("/onboarding");
      } else if (!user) {
        router.replace("/onboarding");
      } else if (user.role === "parent") {
        router.replace("/(parent)/dashboard");
      } else {
        router.replace("/(child)/home");
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [isLoading, user, isOnboarded]);

  return (
    <LinearGradient
      colors={[Colors.primary, Colors.primaryDark]}
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
    >
      <View style={styles.logoWrap}>
        <View style={styles.logoIcon}>
          <View style={styles.logoDot} />
          <View style={[styles.logoLine, styles.lineTop]} />
          <View style={[styles.logoLine, styles.lineBottom]} />
          <View style={[styles.logoLine, styles.lineLeft]} />
          <View style={[styles.logoLine, styles.lineRight]} />
        </View>
        <Text style={styles.logoText}>tether</Text>
      </View>
      <Text style={styles.tagline}>Safe conversations for growing minds</Text>
      <ActivityIndicator color="rgba(255,255,255,0.6)" style={styles.loader} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoWrap: {
    alignItems: "center",
    gap: 14,
  },
  logoIcon: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
  },
  logoDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "white",
  },
  logoLine: {
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 2,
  },
  lineTop: {
    width: 3,
    height: 18,
    top: 0,
    left: 30.5,
  },
  lineBottom: {
    width: 3,
    height: 18,
    bottom: 0,
    left: 30.5,
  },
  lineLeft: {
    width: 18,
    height: 3,
    left: 0,
    top: 30.5,
  },
  lineRight: {
    width: 18,
    height: 3,
    right: 0,
    top: 30.5,
  },
  logoText: {
    fontFamily: Fonts.heading,
    fontSize: 36,
    color: "white",
    letterSpacing: 1,
  },
  tagline: {
    fontFamily: Fonts.body,
    fontSize: 15,
    color: "rgba(255,255,255,0.7)",
    marginTop: 8,
  },
  loader: {
    marginTop: 40,
  },
});
