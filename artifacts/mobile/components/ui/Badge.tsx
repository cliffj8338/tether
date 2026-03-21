import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "@/constants/colors";
import { Fonts } from "@/constants/typography";

interface BadgeProps {
  count: number;
  color?: string;
  size?: "small" | "medium";
}

export function Badge({ count, color = Colors.alert4, size = "small" }: BadgeProps) {
  if (count <= 0) return null;
  const dim = size === "small" ? 17 : 22;

  return (
    <View style={[styles.badge, { backgroundColor: color, width: dim, height: dim, borderRadius: dim / 2 }]}>
      <Text style={[styles.text, { fontSize: size === "small" ? 9 : 11 }]}>
        {count > 99 ? "99+" : count}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.white,
  },
  text: {
    color: "#FFFFFF",
    fontFamily: Fonts.bodyBold,
  },
});
