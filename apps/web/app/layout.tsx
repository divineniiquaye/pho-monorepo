import "@repo/design/tailwind/global.css";

import "raf/polyfill";
import "setimmediate";

import { ViewTransitions } from "next-view-transitions";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Metadata } from "next";
import React from "react";

import { I18nProvider } from "@/locales/locale";
import { cn } from "@repo/design/lib/utils";

export const metadata: Metadata = {
  title: "Create My App",
  description: "A description of my app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html
        lang="en"
        suppressHydrationWarning
        className={cn(
          GeistSans.variable,
          GeistMono.variable,
          "bg-background touch-manipulation font-sans antialiased scroll-smooth",
        )}
      >
        <head />
        <body className="transition-colors">
          <I18nProvider children={children} />
        </body>
      </html>
    </ViewTransitions>
  );
}
