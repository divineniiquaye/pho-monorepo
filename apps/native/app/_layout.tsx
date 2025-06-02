import { enableReactNativeComponents } from "@legendapp/state/config/enableReactNativeComponents";
import { SplashScreen, Stack } from "expo-router";
import React from "react";
import {
  useFonts,
  NotoSans_100Thin,
  NotoSans_300Light,
  NotoSans_400Regular,
  NotoSans_500Medium,
  NotoSans_600SemiBold,
  NotoSans_700Bold,
  NotoSans_800ExtraBold,
  NotoSans_900Black,
} from "@expo-google-fonts/noto-sans";

import { Providers } from "@repo/design/providers";
import { SheetProvider } from "@repo/bottom-sheet";

// Register bottom sheets
import "@/sheets";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Enable reactivity for state management
enableReactNativeComponents();

/** Hide the splash screen when the app is ready to be shown.*/
function useSplashScreen(loadResources: () => Promise<void>) {
  const [loaded] = useFonts({
    NotoSans_100Thin,
    NotoSans_300Light,
    NotoSans_400Regular,
    NotoSans_500Medium,
    NotoSans_600SemiBold,
    NotoSans_700Bold,
    NotoSans_800ExtraBold,
    NotoSans_900Black,
  });

  const [isSplashScreenShown, setSplashScreenShown] = React.useState(true);
  React.useEffect(() => {
    if (loaded) loadResources().then(() => setSplashScreenShown(false));
  }, [loaded]);
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
  const isSplashScreenShown = useSplashScreen(async () => {
    // Implement some async logic here
  });

  if (isSplashScreenShown) return null;

  return (
    <Providers>
      <SheetProvider context="global">
        <Stack screenOptions={{ headerShown: false }} />
      </SheetProvider>
    </Providers>
  );
}
