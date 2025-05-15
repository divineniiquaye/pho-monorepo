import "@repo/design/tailwind/global.css";

import { ExpoRoot, SplashScreen } from "expo-router";
import { registerRootComponent } from "expo";
import { loadI18nAsync } from "@/locales";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Loading translations should be done as early as possible
const locales = require.context("./src/locales", true, /\.json$/);
loadI18nAsync(
  Object.assign(
    {},
    ...locales
      .keys()
      .map((key) => ({
        [key.replace(/^\.\/|\.json$/g, "")]: { translation: locales(key) },
      })),
  ),
);

// https://docs.expo.dev/router/reference/troubleshooting/#expo_router_app_root-not-defined
export function App() {
  const ctx = require.context("./app");
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
