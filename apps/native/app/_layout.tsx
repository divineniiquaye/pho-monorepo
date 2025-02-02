import { enableReactNativeComponents } from "@legendapp/state/config/enableReactNativeComponents";
import { Slot, SplashScreen } from "expo-router";
import * as Font from "expo-font";
import React from "react";

import { Providers } from "@repo/design/providers";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

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
  const isSplashScreenShown = useSplashScreen(async () => {
    Font.loadAsync({
      GeistSans_100Thin: require("@repo/design/fonts/GeistSans/GeistSans_100Thin.otf"),
      GeistSans_300Light: require("@repo/design/fonts/GeistSans/GeistSans_300Light.otf"),
      GeistSans_400Regular: require("@repo/design/fonts/GeistSans/GeistSans_400Regular.otf"),
      GeistSans_500Medium: require("@repo/design/fonts/GeistSans/GeistSans_500Medium.otf"),
      GeistSans_600SemiBold: require("@repo/design/fonts/GeistSans/GeistSans_600SemiBold.otf"),
      GeistSans_700Bold: require("@repo/design/fonts/GeistSans/GeistSans_700Bold.otf"),
      GeistSans_800Black: require("@repo/design/fonts/GeistSans/GeistSans_800Black.otf"),

      GeistMono_100Thin: require("@repo/design/fonts/GeistMono/GeistMono_100Thin.otf"),
      GeistMono_300Light: require("@repo/design/fonts/GeistMono/GeistMono_300Light.otf"),
      GeistMono_400Regular: require("@repo/design/fonts/GeistMono/GeistMono_400Regular.otf"),
      GeistMono_500Medium: require("@repo/design/fonts/GeistMono/GeistMono_500Medium.otf"),
      GeistMono_600SemiBold: require("@repo/design/fonts/GeistMono/GeistMono_600SemiBold.otf"),
      GeistMono_700Bold: require("@repo/design/fonts/GeistMono/GeistMono_700Bold.otf"),
      GeistMono_800Black: require("@repo/design/fonts/GeistMono/GeistMono_800Black.otf"),
    });
  });

  if (isSplashScreenShown) return null;

  return (
    <Providers>
      <Slot />
    </Providers>
  );
}
