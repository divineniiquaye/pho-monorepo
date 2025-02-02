import "@repo/tailwind-config/global.css";

import { ExpoRoot, SplashScreen } from "expo-router";
import { registerRootComponent } from "expo";
import { loadI18nAsync } from "@/locales";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Loading translations should be done as early as possible
loadI18nAsync({
  en: { translation: require("@/locales/en.json") },
  fr: { translation: require("@/locales/fr.json") },
});

// https://docs.expo.dev/router/reference/troubleshooting/#expo_router_app_root-not-defined
export function App() {
  const ctx = require.context("./app");
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
