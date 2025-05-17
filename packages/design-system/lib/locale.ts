import i18n, { Resource } from "i18next";

export const locales = [
    { id: "en", name: "English" },
    { id: "fr", name: "Français" },
] as const;

export const AllLocales = locales.map((locale) => locale.id);
export type Locale = (typeof AllLocales)[number];

const loadI18nAsync = async (resources: Resource, lng: Locale = "en") =>
    i18n.init({ fallbackLng: "en", resources, lng });

export { i18n, loadI18nAsync };
