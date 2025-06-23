"use client";

import { configureReanimatedLogger, ReanimatedLogLevel } from "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PortalHost } from "@rn-primitives/portal";
import { Theme } from "@react-navigation/native";
import Constants from "expo-constants";
import React from "react";

const KeyboardProvider =
  Constants.executionEnvironment !== "storeClient"
    ? require("react-native-keyboard-controller").KeyboardProvider
    : React.Fragment;

import { i18n } from "../lib/locale";
import { useColorScheme } from "../hooks/useColorScheme";
import { ThemeProvider } from "./theme";
import SonnerProvider from "./sonner";
import QueryProvider from "./query";
import isWeb from "../lib/isWeb";

configureReanimatedLogger({
  level: ReanimatedLogLevel.error,
  strict: true, // Reanimated runs in strict mode by default
});

export function Providers({
  defaultTheme,
  children,
  themes,
}: {
  children: React.ReactNode;
  themes?: Record<"light" | "dark", Theme>;
  defaultTheme?: "light" | "dark";
}) {
  const { colorScheme } = useColorScheme();

  const hasMounted = React.useRef(false);
  const [forceUpdate, setLangChange] = React.useState(0);

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    hasMounted.current = true;
    i18n.on("languageChanged", () => setLangChange((v) => v + 1));
  }, []);

  return (
    <ThemeProvider theme={colorScheme} defaultTheme={defaultTheme} themes={themes}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardProvider>
          <QueryProvider>
            <React.Fragment key={forceUpdate}>{children}</React.Fragment>
            <PortalHost />
            <SonnerProvider theme={colorScheme} />
          </QueryProvider>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

const useIsomorphicLayoutEffect =
  isWeb && typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;
