import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "@/constants/colors";
import { Fonts } from "@/constants/typography";

const levelConfig: Record<string, { bg: string; color: string; label: string }> = {
  none: { bg: `${Colors.primary}18`, color: Colors.primaryDark, label: "Clean" },
  level1: { bg: `${Colors.alert1}20`, color: "#3A6040", label: "Level 1" },
  level2: { bg: `${Colors.alert2}20`, color: Colors.accentDark, label: "Level 2" },
  level3: { bg: `${Colors.alert3}20`, color: "#8A6010", label: "Level 3" },
  level4: { bg: `${Colors.alert4}20`, color: "#9A3818", label: "Level 4" },
  level5: { bg: `${Colors.alert5}20`, color: Colors.alert5, label: "Level 5" },
};

interface AlertLevelTagProps {
  level: string;
  label?: string;
}

export function AlertLevelTag({ level, label }: AlertLevelTagProps) {
  const config = levelConfig[level] ?? levelConfig.none;

  return (
    <View style={[styles.tag, { backgroundColor: config.bg }]}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={[styles.text, { color: config.color }]}>{label ?? config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  text: {
    fontSize: 10,
    fontFamily: Fonts.bodyBold,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
});
