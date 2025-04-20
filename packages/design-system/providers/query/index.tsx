import type { AppStateStatus } from "react-native";
import { useEffect, useState } from "react";
import { AppState } from "react-native";
import * as Network from "expo-network";
import {
  focusManager,
  onlineManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  useEffect(() => {
    const appState = AppState.addEventListener("change", (status: AppStateStatus) => {
      focusManager.setFocused(status === "active");
    });
    const networkState = Network.addNetworkStateListener((state) => {
      onlineManager.setOnline(state.isConnected ?? false);
    });

    return () => {
      appState.remove();
      networkState.remove();
    };
  }, []);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
