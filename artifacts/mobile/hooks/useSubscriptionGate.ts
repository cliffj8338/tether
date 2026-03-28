import { useCallback } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import { useSubscription } from "@/lib/revenuecat";

const FREE_CHILD_LIMIT = 1;

export function useSubscriptionGate() {
  let isSubscribed = false;
  try {
    const sub = useSubscription();
    isSubscribed = sub.isSubscribed;
  } catch {
    isSubscribed = false;
  }

  const requirePremium = useCallback(
    (featureName: string): boolean => {
      if (isSubscribed) return true;
      Alert.alert(
        "Premium Feature",
        `${featureName} requires a Tether Family subscription.`,
        [
          { text: "Not Now", style: "cancel" },
          { text: "See Plans", onPress: () => router.push("/paywall" as any) },
        ],
      );
      return false;
    },
    [isSubscribed],
  );

  const canAddChild = useCallback(
    (currentChildCount: number): boolean => {
      if (isSubscribed) return true;
      if (currentChildCount < FREE_CHILD_LIMIT) return true;
      requirePremium("Adding more than 1 child");
      return false;
    },
    [isSubscribed, requirePremium],
  );

  return {
    isSubscribed,
    requirePremium,
    canAddChild,
    FREE_CHILD_LIMIT,
  };
}
