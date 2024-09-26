import { enableReactNativeComponents } from "@legendapp/state/config/enableReactNativeComponents";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import { useEffect } from "react";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

import "@repo/tailwind-config/global.css";
import { Providers } from "@repo/ui/providers";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Enable reactivity for state management
enableReactNativeComponents();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter: Inter_400Regular,
    InterBold: Inter_700Bold,
    InterMedium: Inter_500Medium,
    InterSemiBold: Inter_600SemiBold,
    ...Ionicons.font,
  });

  useEffect(() => {
    // Hide the splash screen once all assets have been loaded.
    if (loaded) {
      SplashScreen.hideAsync();
    }
    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    else if (error) throw error;
  }, [loaded, error]);

  return (
    !!loaded && (
      <Providers>
        <Slot />
      </Providers>
    )
  );
}
