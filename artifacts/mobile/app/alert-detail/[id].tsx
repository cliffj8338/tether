import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/colors";
import { Fonts } from "@/constants/typography";
import { AlertLevelTag } from "@/components/ui/AlertLevelTag";
import { TetherButton } from "@/components/ui/TetherButton";
import { useAlerts } from "@/hooks/useApiData";

export default function AlertDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const alertId = parseInt(id ?? "0");
  const insets = useSafeAreaInsets();
  const { alerts } = useAlerts();

  const alert = alerts.find((a) => a.id === alertId);

  if (!alert) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={Colors.text} />
        </Pressable>
        <View style={styles.center}>
          <Text>Alert not found</Text>
        </View>
      </View>
    );
  }

  const alertColor = getAlertColor(alert.alertLevel);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Alert Detail</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <View style={[styles.card, { borderColor: `${alertColor}40` }]}>
          <View style={[styles.iconWrap, { backgroundColor: `${alertColor}16` }]}>
            <Feather name="alert-triangle" size={24} color={alertColor} />
          </View>
          <Text style={styles.title}>{alert.title}</Text>
          <AlertLevelTag level={alert.alertLevel} />
          <Text style={styles.time}>{alert.time}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <Text style={styles.description}>{alert.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Flagged Message</Text>
          <View style={styles.messageCard}>
            <Text style={styles.messageText}>{alert.messagePreview}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Child</Text>
          <Text style={styles.description}>{alert.childName}</Text>
        </View>

        <View style={styles.actions}>
          <TetherButton title="View Conversation" onPress={() => {
            if (alert.conversationId) {
              router.push(`/conversation/${alert.conversationId}`);
            }
          }} />
          <TetherButton title="Dismiss Alert" onPress={() => router.back()} variant="ghost" />
        </View>
      </ScrollView>
    </View>
  );
}

function getAlertColor(level: string): string {
  const colors: Record<string, string> = {
    level1: Colors.alert1,
    level2: Colors.alert2,
    level3: Colors.alert3,
    level4: Colors.alert4,
    level5: Colors.alert5,
  };
  return colors[level] ?? Colors.textMid;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontFamily: Fonts.heading, fontSize: 20, color: Colors.text },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 24,
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  title: { fontFamily: Fonts.heading, fontSize: 20, color: Colors.text, textAlign: "center" },
  time: { fontFamily: Fonts.body, fontSize: 12, color: Colors.sand },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
    color: Colors.text,
    marginBottom: 8,
  },
  description: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.textMid,
    lineHeight: 21,
  },
  messageCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: 14,
  },
  messageText: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.text,
    fontStyle: "italic",
    lineHeight: 21,
  },
  actions: {
    gap: 10,
    marginTop: 12,
  },
});
