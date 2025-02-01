"use client";

import { configureReanimatedLogger, ReanimatedLogLevel } from "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useWindowDimensions } from "react-native";
import { PortalHost } from "@rn-primitives/portal";
import Constants from "expo-constants";
import { vars } from "nativewind";

const KeyboardProvider =
  Constants.executionEnvironment !== "storeClient"
    ? require("react-native-keyboard-controller").KeyboardProvider
    : React.Fragment;

import { i18n } from "@repo/i18n-config";
import { useColorScheme } from "../hooks/useColorScheme";
import { ThemeProvider } from "./theme";
import SonnerProvider from "./sonner";
import isWeb from "../lib/isWeb";
import React from "react";

configureReanimatedLogger({
  level: ReanimatedLogLevel.error,
  strict: true, // Reanimated runs in strict mode by default
});

export function Providers({ children }: { children: React.ReactNode }) {
  const { colorScheme } = useColorScheme();
  const { width, height } = useWindowDimensions();

  const hasMounted = React.useRef(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [forceUpdate, setLangChange] = React.useState(0);

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    setIsLoaded(true);
    hasMounted.current = true;
    i18n.on("languageChanged", () => setLangChange((v) => v + 1));
  }, []);

  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeProvider theme={colorScheme}>
      <GestureHandlerRootView
        style={[{ flex: 1 }, vars({ "---width": width, "---height": height })]}
      >
        <KeyboardProvider>
          <BottomSheetModalProvider>
            <React.Fragment key={forceUpdate}>{children}</React.Fragment>
            <PortalHost />
            <SonnerProvider theme={colorScheme} />
          </BottomSheetModalProvider>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

const useIsomorphicLayoutEffect =
  isWeb && typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;
