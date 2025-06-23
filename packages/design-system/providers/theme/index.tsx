// import { SystemBars } from "react-native-edge-to-edge";
import {
  ThemeProvider as NativeThemeProvider,
  type Theme,
} from "@react-navigation/native";
import { WebView } from "@expo/dom-webview";
import { LinearGradient } from "expo-linear-gradient";
import { cssInterop } from "nativewind";

// Components Not Supported by NativeWind
cssInterop(WebView, { className: "containerStyle" });
cssInterop(LinearGradient, { className: "style" });

/**
 * If your background theme doesn't work well with android navigation bar,
 * use this code example to fix it.
 *
 * ```ts
 * // Handle system theme changes
 * useEffect(() => {
 *   if (Platform.OS === "android") {
 *     // You can change the navigation bar theme here
 *     SystemBars.setStyle({ navigationBar: theme });
 *   }
 *
 *   const ui = Appearance.addChangeListener(({ colorScheme }) => {
 *     if (Platform.OS === "android") {
 *       // You can change the navigation bar theme here
 *       SystemBars.setStyle({ navigationBar: colorScheme ?? "auto" });
 *     }
 *   });
 *
 *   return ui.remove;
 * });
 * ```
 */
export function ThemeProvider({
  defaultTheme,
  children,
  themes,
  theme,
}: {
  children: React.ReactNode;
  theme: "light" | "dark";
  defaultTheme?: "light" | "dark";
  themes?: Record<"light" | "dark", Theme>;
}) {
  return <NativeThemeProvider value={themes?.[defaultTheme || theme]}>{children}</NativeThemeProvider>;
}
