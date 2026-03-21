import React from "react";
import { Pressable, Text, StyleSheet, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { Fonts } from "@/constants/typography";

interface TetherButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export function TetherButton({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  icon,
}: TetherButtonProps) {
  const handlePress = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  if (variant === "primary") {
    return (
      <Pressable
        onPress={handlePress}
        disabled={disabled || loading}
        style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }]}
      >
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.btn, disabled && styles.disabled]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              {icon}
              <Text style={styles.primaryText}>{title}</Text>
            </>
          )}
        </LinearGradient>
      </Pressable>
    );
  }

  const variantStyles = {
    secondary: { bg: Colors.surface, text: Colors.text, border: Colors.border },
    danger: { bg: `${Colors.alert4}10`, text: Colors.alert4, border: `${Colors.alert4}30` },
    ghost: { bg: "transparent", text: Colors.textMid, border: "transparent" },
  };

  const v = variantStyles[variant];

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: v.bg, borderColor: v.border, borderWidth: 1.5, opacity: pressed ? 0.8 : 1 },
        disabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.text} size="small" />
      ) : (
        <>
          {icon}
          <Text style={[styles.secondaryText, { color: v.text }]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
  },
  primaryText: {
    color: "#FFFFFF",
    fontFamily: Fonts.bodyBold,
    fontSize: 15,
  },
  secondaryText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 15,
  },
  disabled: {
    opacity: 0.5,
  },
});
