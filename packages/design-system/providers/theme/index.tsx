import { ThemeProvider as NativeThemeProvider } from "@react-navigation/native";
import { Appearance, Platform } from "react-native";
import { WebView } from "@expo/dom-webview";
import { cssInterop } from "nativewind";
import { useEffect } from "react";

import { setAndroidNavigationBar } from "@repo/design/lib/android-navigation-bar";
import { useColorScheme } from "@repo/design/hooks/useColorScheme";
import { NavigationTheme } from "@repo/design/lib/constants";

// NativeWind doesn't support webview yet
cssInterop(WebView, { className: "containerStyle" });

export function ThemeProvider({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme: "light" | "dark";
}) {
  const { setColorScheme } = useColorScheme();

  // Handle system theme changes
  useEffect(() => {
    if (Platform.OS === "android") {
      setAndroidNavigationBar(theme);
    }

    const ui = Appearance.addChangeListener(({ colorScheme }) => {
      setAndroidNavigationBar(colorScheme ?? "dark");
      setColorScheme(colorScheme ?? "system");
    });

    return ui.remove;
  });

  return (
    <NativeThemeProvider value={NavigationTheme[theme]}>{children}</NativeThemeProvider>
  );
}
