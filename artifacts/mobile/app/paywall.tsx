import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Modal, ScrollView } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { Fonts } from "@/constants/typography";
import { useSubscription } from "@/lib/revenuecat";

export default function PaywallScreen() {
  const insets = useSafeAreaInsets();
  const { offerings, purchase, isPurchasing, restore, isRestoring, isSubscribed } = useSubscription();
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [error, setError] = useState("");

  const currentOffering = offerings?.current;
  const packageToPurchase = currentOffering?.availablePackages[0];
  const price = packageToPurchase?.product.priceString || "$9.99/mo";

  const handleSubscribe = () => {
    if (!packageToPurchase) return;
    setSelectedPackage(packageToPurchase);
    setShowConfirm(true);
  };

  const confirmPurchase = async () => {
    setShowConfirm(false);
    setError("");
    try {
      await purchase(selectedPackage);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (e: any) {
      if (e?.userCancelled) return;
      setError("Purchase failed. Please try again.");
    }
  };

  const handleRestore = async () => {
    setError("");
    try {
      const restoredInfo = await restore();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const hasEntitlement = restoredInfo?.entitlements?.active?.["premium"] !== undefined;
      if (hasEntitlement) router.back();
    } catch {
      setError("Could not restore purchases.");
    }
  };

  const features = [
    { icon: "shield" as const, title: "AI Content Monitoring", desc: "Two-pass AI filtering on every message" },
    { icon: "bell" as const, title: "Real-Time Alerts", desc: "Push notifications and emergency SMS" },
    { icon: "users" as const, title: "Unlimited Kids", desc: "Add all your children to one family plan" },
    { icon: "message-circle" as const, title: "Supervised Chat", desc: "Parent-approved contacts only" },
    { icon: "book-open" as const, title: "Faith Mode", desc: "Optional Christian values layer" },
    { icon: "trending-up" as const, title: "Trust Levels", desc: "Gradually grant more freedom" },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="x" size={22} color={Colors.text} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <View style={styles.iconCircle}>
            <Feather name="star" size={32} color={Colors.primary} />
          </View>
          <Text style={styles.heroTitle}>Tether Family</Text>
          <Text style={styles.heroSubtitle}>
            Keep your family connected and safe with intelligent content monitoring.
          </Text>
        </View>

        <View style={styles.priceCard}>
          <Text style={styles.priceLabel}>Monthly</Text>
          <Text style={styles.priceValue}>{price}</Text>
          <Text style={styles.priceSub}>per month • cancel anytime</Text>
        </View>

        <View style={styles.featuresSection}>
          {features.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <Feather name={f.icon} size={18} color={Colors.primary} />
              </View>
              <View style={styles.featureBody}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Pressable
          style={[styles.subscribeBtn, (isPurchasing || !packageToPurchase) && { opacity: 0.6 }]}
          onPress={handleSubscribe}
          disabled={isPurchasing || !packageToPurchase}
        >
          {isPurchasing ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.subscribeBtnText}>Subscribe — {price}</Text>
          )}
        </Pressable>

        <Pressable style={styles.restoreBtn} onPress={handleRestore} disabled={isRestoring}>
          <Text style={styles.restoreBtnText}>
            {isRestoring ? "Restoring..." : "Restore Purchases"}
          </Text>
        </Pressable>

        <Text style={styles.legalText}>
          Subscription automatically renews monthly. You can manage or cancel your subscription at any time. 
          No ads, ever. COPPA compliant.
        </Text>
      </ScrollView>

      <Modal visible={showConfirm} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setShowConfirm(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Subscription</Text>
            <Text style={styles.modalBody}>
              You'll be charged {price} per month for Tether Family. You can cancel anytime.
            </Text>
            <View style={styles.modalActions}>
              <Pressable style={styles.modalCancel} onPress={() => setShowConfirm(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.modalConfirm} onPress={confirmPurchase}>
                <Text style={styles.modalConfirmText}>Subscribe</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 28,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: `${Colors.primary}14`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  heroTitle: {
    fontFamily: Fonts.heading,
    fontSize: 32,
    color: Colors.text,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontFamily: Fonts.body,
    fontSize: 15,
    color: Colors.textMid,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 300,
  },
  priceCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: Colors.primary,
    padding: 24,
    alignItems: "center",
    marginBottom: 28,
  },
  priceLabel: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 13,
    color: Colors.textMid,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  priceValue: {
    fontFamily: Fonts.heading,
    fontSize: 36,
    color: Colors.text,
  },
  priceSub: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.textMid,
    marginTop: 4,
  },
  featuresSection: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: 6,
    marginBottom: 28,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 14,
  },
  featureIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: `${Colors.primary}12`,
    alignItems: "center",
    justifyContent: "center",
  },
  featureBody: { flex: 1 },
  featureTitle: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 14,
    color: Colors.text,
  },
  featureDesc: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.textMid,
    marginTop: 1,
  },
  errorText: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.alert4,
    textAlign: "center",
    marginBottom: 12,
  },
  subscribeBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  subscribeBtnText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
    color: Colors.white,
  },
  restoreBtn: {
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 8,
  },
  restoreBtnText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 14,
    color: Colors.accent,
  },
  legalText: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Colors.sand,
    textAlign: "center",
    lineHeight: 16,
    paddingHorizontal: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 340,
  },
  modalTitle: {
    fontFamily: Fonts.heading,
    fontSize: 20,
    color: Colors.text,
    marginBottom: 8,
  },
  modalBody: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.textMid,
    lineHeight: 20,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  modalCancel: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: "center",
  },
  modalCancelText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 14,
    color: Colors.textMid,
  },
  modalConfirm: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: "center",
  },
  modalConfirmText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    color: Colors.white,
  },
});
