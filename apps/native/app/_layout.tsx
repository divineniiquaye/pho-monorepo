import "@repo/tailwind-config/global.css";

import { enableReactNativeComponents } from "@legendapp/state/config/enableReactNativeComponents";
import * as SplashScreen from "expo-splash-screen";
import { Slot } from "expo-router";
import * as Font from "expo-font";
import React from "react";

import { Providers } from "@repo/design/providers";
import { useI18nLocale } from "@/locales";

import * as en from "@/locales/en.json";
import * as fr from "@/locales/fr.json";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Enable reactivity for state management
enableReactNativeComponents();

/** Hide the splash screen when the app is ready to be shown.*/
function useSplashScreen(loadResources: () => Promise<void>) {
  const [isSplashScreenShown, setSplashScreenShown] = React.useState(true);
  React.useEffect(() => {
    loadResources().then(() => setSplashScreenShown(false));
  }, []);
  React.useEffect(() => {
    let c: ReturnType<typeof setTimeout> | undefined;

    // Wait 1.5ms to get content partially or fully ready before hiding the splash screen.
    if (!isSplashScreenShown) c = setTimeout(SplashScreen.hide, 150);
    return () => {
      if (c) clearTimeout(c);
    };
  }, [isSplashScreenShown]);

  return isSplashScreenShown;
}

export default function RootLayout() {
  const forceUpdate = useI18nLocale({
    en: { translation: en },
    fr: { translation: fr },
  });

  const isSplashScreenShown = useSplashScreen(async () => {
    Font.loadAsync({
      GeistSans_100Thin: require("@/assets/fonts/GeistSans/Geist-Thin.otf"),
      GeistSans_300Light: require("@/assets/fonts/GeistSans/Geist-Light.otf"),
      GeistSans_400Regular: require("@/assets/fonts/GeistSans/Geist-Regular.otf"),
      GeistSans_500Medium: require("@/assets/fonts/GeistSans/Geist-Medium.otf"),
      GeistSans_600SemiBold: require("@/assets/fonts/GeistSans/Geist-SemiBold.otf"),
      GeistSans_700Bold: require("@/assets/fonts/GeistSans/Geist-Bold.otf"),
      GeistSans_800Black: require("@/assets/fonts/GeistSans/Geist-Black.otf"),

      GeistMono_100Thin: require("@/assets/fonts/GeistMono/Geist-Thin.otf"),
      GeistMono_200UltraLight: require("@/assets/fonts/GeistMono/Geist-UltraLight.otf"),
      GeistMono_300Light: require("@/assets/fonts/GeistMono/Geist-Light.otf"),
      GeistMono_400Regular: require("@/assets/fonts/GeistMono/Geist-Regular.otf"),
      GeistMono_500Medium: require("@/assets/fonts/GeistMono/Geist-Medium.otf"),
      GeistMono_600SemiBold: require("@/assets/fonts/GeistMono/Geist-SemiBold.otf"),
      GeistMono_700Bold: require("@/assets/fonts/GeistMono/Geist-Bold.otf"),
      GeistMono_800Black: require("@/assets/fonts/GeistMono/Geist-Black.otf"),
      GeistMono_900UltraBlack: require("@/assets/fonts/GeistMono/Geist-UltraBlack.otf"),
    });
  });

  if (isSplashScreenShown) return null;

  return <Providers key={forceUpdate} children={<Slot />} />;
}
