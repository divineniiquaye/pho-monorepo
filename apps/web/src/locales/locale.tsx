"use client";

import { Locale, useI18nLocale } from ".";
import { Providers } from "@repo/design/providers";
import { PropsWithChildren } from "react";

import * as en from "@/locales/en.json";
import * as fr from "@/locales/fr.json";

export function I18nProvider({ children, lng }: PropsWithChildren<{ lng?: Locale }>) {
  const forceUpdate = useI18nLocale(
    {
      en: { translation: en },
      fr: { translation: fr },
    },
    lng,
  );

  return <Providers key={forceUpdate}>{children}</Providers>;
}
