import { Platform, ViewStyle } from "react-native";

export const Shadows: Record<string, ViewStyle> = {
  level1: Platform.select({
    ios: {
      shadowColor: "#232535",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    android: {
      elevation: 2,
    },
    default: {},
  }) as ViewStyle,

  level2: Platform.select({
    ios: {
      shadowColor: "#232535",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 32,
    },
    android: {
      elevation: 8,
    },
    default: {},
  }) as ViewStyle,

  level3: Platform.select({
    ios: {
      shadowColor: "#6B9E8A",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.44,
      shadowRadius: 18,
    },
    android: {
      elevation: 12,
    },
    default: {},
  }) as ViewStyle,
};
