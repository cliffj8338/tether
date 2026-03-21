import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "@/constants/colors";
import { Fonts } from "@/constants/typography";

interface StatCardProps {
  value: number;
  label: string;
  color: string;
}

export function StatCard({ value, label, color }: StatCardProps) {
  return (
    <View style={styles.card}>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 15,
    padding: 14,
    alignItems: "center",
  },
  value: {
    fontFamily: Fonts.heading,
    fontSize: 26,
    lineHeight: 30,
    marginBottom: 5,
  },
  label: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 11,
    color: Colors.textMid,
    textAlign: "center",
    lineHeight: 14,
  },
});
