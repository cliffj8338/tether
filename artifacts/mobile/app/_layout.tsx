import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  useFonts as useNunitoFonts,
} from "@expo-google-fonts/nunito";
import {
  Fraunces_400Regular,
  Fraunces_400Regular_Italic,
  Fraunces_600SemiBold,
  useFonts as useFrauncesFonts,
} from "@expo-google-fonts/fraunces";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider } from "@/context/AuthContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(parent)" />
      <Stack.Screen name="(child)" />
      <Stack.Screen name="conversation/[id]" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="child-detail/[id]" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="alert-detail/[id]" options={{ animation: "slide_from_right" }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [nunitoLoaded, nunitoError] = useNunitoFonts({
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  const [frauncesLoaded, frauncesError] = useFonts({
    Fraunces_400Regular,
    Fraunces_400Regular_Italic,
    Fraunces_600SemiBold,
  });

  const fontsLoaded = nunitoLoaded && frauncesLoaded;
  const fontError = nunitoError || frauncesError;

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <KeyboardProvider>
                <RootLayoutNav />
              </KeyboardProvider>
            </GestureHandlerRootView>
          </QueryClientProvider>
        </AuthProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

function useFonts(fonts: Record<string, number>): [boolean, Error | null] {
  return useFrauncesFonts(fonts as any);
}
