// @ts-nocheck
"use client";

import { Animated as RNAnimated, StyleSheet } from "react-native";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useServerInsertedHTML } from "next/navigation";
import Animated from "react-native-reanimated";
import { cssInterop } from "nativewind";

// Nativewind doesn't support reanimated components and native animated components yet for web
cssInterop(RNAnimated.Text, { className: { target: "style" } });
cssInterop(Animated.Text, { className: { target: "style" } });
cssInterop(RNAnimated.Image, { className: { target: "style" } });
cssInterop(Animated.Image, { className: { target: "style" } });
cssInterop(RNAnimated.View, { className: { target: "style" } });
cssInterop(Animated.View, { className: { target: "style" } });
cssInterop(RNAnimated.ScrollView, { className: { target: "style" } });
cssInterop(Animated.ScrollView, { className: { target: "style" } });
cssInterop(RNAnimated.FlatList, { className: { target: "style" } });
cssInterop(Animated.FlatList, { className: { target: "style" } });
cssInterop(RNAnimated.SectionList, { className: { target: "style" } });

export function ThemeProvider({
  defaultTheme,
  children,
}: {
  children: React.ReactNode;
  defaultTheme?: "light" | "dark";
  theme: "light" | "dark";
}) {
  useServerInsertedHTML(() => {
    const sheet = StyleSheet.getSheet();
    return (
      <style dangerouslySetInnerHTML={{ __html: sheet.textContent }} id={sheet.id} />
    );
  });

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultTheme}
      disableTransitionOnChange
      enableColorScheme
      enableSystem
    >
      {children}
    </NextThemesProvider>
  );
}
