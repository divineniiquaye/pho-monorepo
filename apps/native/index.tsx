import "@repo/design/tailwind/global.css";

import { ExpoRoot, SplashScreen } from "expo-router";
import { registerRootComponent } from "expo";
import "@/locales";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

/**
 * https://docs.expo.dev/router/reference/troubleshooting/#expo_router_app_root-not-defined
 * Alternatively, you omit the code below and only import "expo-router/entry".
 */
export function App() {
  const ctx = require.context("./app");
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
