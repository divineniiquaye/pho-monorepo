// import { SystemBars } from "react-native-edge-to-edge";
import {
  ThemeProvider as NativeThemeProvider,
  type Theme,
} from "@react-navigation/native";
import { WebView } from "@expo/dom-webview";
import { cssInterop } from "nativewind";

// NativeWind doesn't support webview yet
cssInterop(WebView, { className: "containerStyle" });

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
  children,
  themes,
  theme,
}: {
  children: React.ReactNode;
  theme: "light" | "dark";
  themes?: Record<"light" | "dark", Theme>;
}) {
  return <NativeThemeProvider value={themes?.[theme]}>{children}</NativeThemeProvider>;
}
