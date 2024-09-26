import { ThemeProvider as NativeThemeProvider } from "@react-navigation/native";
import { Appearance, Platform } from "react-native";
import { useEffect } from "react";

import { setAndroidNavigationBar } from "../../lib/android-navigation-bar";
import { useColorScheme } from "../../hooks/useColorScheme";
import { NAV_THEME } from "../../lib/constants";

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
      const ui = Appearance.addChangeListener(({ colorScheme }) => {
        setAndroidNavigationBar(colorScheme ?? "dark");
        setColorScheme(colorScheme ?? "system");
      });

      return ui.remove;
    }
  });

  return (
    <NativeThemeProvider value={{ colors: NAV_THEME[theme], dark: "dark" === theme }}>
      {children}
    </NativeThemeProvider>
  );
}
