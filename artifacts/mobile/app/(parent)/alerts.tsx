import React from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { Fonts } from "@/constants/typography";
import { AlertLevelTag } from "@/components/ui/AlertLevelTag";
import { useDemoData } from "@/hooks/useDemoData";

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

export default function AlertsScreen() {
  const insets = useSafeAreaInsets();
  const { alerts } = useDemoData();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Alerts</Text>
        <View style={styles.headerRight}>
          <Pressable style={styles.markAllBtn}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const alertColor = getAlertColor(item.alertLevel);
          return (
            <Pressable
              style={[styles.alertCard, !item.isRead && styles.alertCardUnread]}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            >
              <View style={[styles.alertStrip, { backgroundColor: alertColor }]} />
              <View style={[styles.alertIconWrap, { backgroundColor: `${alertColor}16` }]}>
                <Feather
                  name={item.alertLevel === "level4" || item.alertLevel === "level5" ? "alert-triangle" : "info"}
                  size={18}
                  color={alertColor}
                />
              </View>
              <View style={styles.alertBody}>
                <View style={styles.alertRow1}>
                  <Text style={styles.alertChild}>{item.childName}</Text>
                  <Text style={styles.alertTime}>{item.time}</Text>
                </View>
                <Text style={styles.alertTitle}>{item.title}</Text>
                <Text style={styles.alertDesc} numberOfLines={2}>{item.description}</Text>
                <View style={styles.alertFooter}>
                  <AlertLevelTag level={item.alertLevel} />
                  {!item.isRead && <View style={styles.unreadDot} />}
                </View>
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="bell" size={48} color={Colors.border} />
            <Text style={styles.emptyTitle}>No alerts</Text>
            <Text style={styles.emptyText}>Everything looks good! No flagged content to review.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: { fontFamily: Fonts.heading, fontSize: 28, color: Colors.text },
  headerRight: { flexDirection: "row", gap: 8 },
  markAllBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: Colors.surface,
  },
  markAllText: { fontFamily: Fonts.bodySemiBold, fontSize: 12, color: Colors.accent },
  alertCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    flexDirection: "row",
    padding: 14,
    gap: 11,
    overflow: "hidden",
  },
  alertCardUnread: {
    borderColor: `${Colors.alert4}40`,
    backgroundColor: `${Colors.alert4}04`,
  },
  alertStrip: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  alertIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  alertBody: { flex: 1 },
  alertRow1: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  alertChild: { fontFamily: Fonts.bodyBold, fontSize: 13, color: Colors.text },
  alertTime: { fontFamily: Fonts.body, fontSize: 11, color: Colors.sand },
  alertTitle: { fontFamily: Fonts.bodySemiBold, fontSize: 13, color: Colors.text, marginBottom: 3 },
  alertDesc: { fontFamily: Fonts.body, fontSize: 12, color: Colors.textMid, lineHeight: 17, marginBottom: 8 },
  alertFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.alert4,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: { fontFamily: Fonts.bodySemiBold, fontSize: 16, color: Colors.text },
  emptyText: { fontFamily: Fonts.body, fontSize: 14, color: Colors.textMid, textAlign: "center", paddingHorizontal: 40 },
});
