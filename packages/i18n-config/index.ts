import i18n, { Resource } from "i18next";
import React from "react";

export const locales = [
    { id: "en", name: "English" },
    { id: "fr", name: "Français" },
] as const;

export const AllLocales = locales.map((locale) => locale.id);
export type Locale = (typeof AllLocales)[number];

export const useI18nLocale = (resources: Resource, lng: Locale = "en"): number => {
    const [key, forceUpdate] = React.useState(0);
    React.useEffect(() => {
        i18n.init({
            fallbackLng: "en",
            resources,
            lng,
        });

        i18n.on("languageChanged", (c) => forceUpdate((v) => v + 1));
    }, []);

    return key;
};

export default i18n;
