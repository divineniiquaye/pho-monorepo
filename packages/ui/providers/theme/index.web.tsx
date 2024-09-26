// @ts-nocheck
"use client";

import { useServerInsertedHTML } from "next/navigation";
import { StyleSheet } from "react-native";

export function ThemeProvider({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme: "light" | "dark";
}) {
  useServerInsertedHTML(() => {
    const sheet = StyleSheet.getSheet();
    return (
      <style dangerouslySetInnerHTML={{ __html: sheet.textContent }} id={sheet.id} />
    );
  });

  return <>{children}</>;
}
