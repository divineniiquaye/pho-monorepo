"use client";

import { focusManager, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { PortalHost } from "@rn-primitives/portal";
import { Toaster } from "sonner-native";
import { AppState } from "react-native";
import { useEffect } from "react";

import { useColorScheme } from "../hooks/useColorScheme";
import { ThemeProvider } from "./theme";
import isWeb from "../hooks/isWeb";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const { colorScheme } = useColorScheme();
  if (__DEV__) useReactQueryDevTools(queryClient);

  // Listen for app state changes
  useEffect(() => {
    if (!isWeb) {
      const subscription = AppState.addEventListener("change", (status) => {
        focusManager.setFocused(status === "active");
      });
      return () => subscription.remove();
    }
  });

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider theme={colorScheme}>
          <QueryClientProvider client={queryClient}>
            {children}
            <PortalHost />
            <Toaster
              autoWiggleOnUpdate="toast-change"
              swipeToDismissDirection="up"
              pauseWhenPageIsHidden
              visibleToasts={4}
              theme="system"
            />
          </QueryClientProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
