import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";
import { Fonts } from "@/constants/typography";
import { useAuth } from "@/context/AuthContext";
import { TetherMark } from "@/components/icons/TetherMark";

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
        <TetherMark size={72} color="white" endpointOpacity={0.55} />
        <Text style={styles.logoText}>Tether</Text>
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
  logoText: {
    fontFamily: Fonts.headingItalic,
    fontSize: 36,
    color: "white",
    letterSpacing: -1,
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
