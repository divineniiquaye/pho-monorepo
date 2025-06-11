import { ThemeProvider } from "next-themes";
import React from "react";

import { useColorScheme } from "../hooks/useColorScheme";
import isWeb from "../lib/isWeb";

if (!isWeb) {
  console.warn(
    "Using the DomLayout component with ios/android is not recommended. It's meant for components with the `use dom` directive.",
  );
}

/**
 * A layout component that provides theme context for DOM-rendered components.
 * This component is primarily intended for use with components that have the `use dom` directive
 * and should generally be avoided in web contexts.
 * 
 * @component
 * @warning Issues a console warning when used in web environments
 * 
 * Features:
 * - Provides theme context via next-themes
 * - Automatically syncs with system color scheme
 * - Handles theme transitions
 * 
 * @param {React.PropsWithChildren<{}>} props - React children to be wrapped with theme context
 * @returns {JSX.Element} Themed layout wrapper
 * 
 * @example
 * <DomLayout>
 *   <YourComponent />
 * </DomLayout>
 */
export function DomLayout({ children }: React.PropsWithChildren<{}>) {
  const { colorScheme } = useColorScheme();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={colorScheme}
      disableTransitionOnChange
      enableColorScheme
      enableSystem
    >
      {children}
    </ThemeProvider>
  );
}
