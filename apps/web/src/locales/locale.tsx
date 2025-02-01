"use client";

import { Providers } from "@repo/design/providers";
import { PropsWithChildren } from "react";
import { loadI18nAsync } from ".";

// Loading translations should be done as early as possible
loadI18nAsync({
  en: { translation: require("@/locales/en.json") },
  fr: { translation: require("@/locales/fr.json") },
});

export function I18nProvider({ children }: PropsWithChildren) {
  return <Providers>{children}</Providers>;
}
