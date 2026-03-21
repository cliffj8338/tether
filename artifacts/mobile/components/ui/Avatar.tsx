import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Fonts } from "@/constants/typography";

interface AvatarProps {
  name: string;
  color?: string;
  size?: number;
}

export function Avatar({ name, color = "#6B9E8A", size = 42 }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size * 0.3,
          backgroundColor: color,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          { fontSize: size * 0.35 },
        ]}
      >
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#FFFFFF",
    fontFamily: Fonts.bodyBold,
    letterSpacing: 0.5,
  },
});
