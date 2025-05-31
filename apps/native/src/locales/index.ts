/**
 * NOTE: DO NOT IMPORT THIS FILE DIRECTLY
 * This file is imported by the app entry point and should not be imported directly.
 */

import { loadI18nAsync, i18n as locale } from "@repo/design/lib/locale";

declare module "i18next" {
    interface CustomTypeOptions {
        // Define the shape of your translation resources
        resources: {
            translation: typeof import("./en.json"); // Assuming en.json is your base
        };
    }
}

declare global {
    /* eslint-disable no-var */
    var i18n: typeof locale;
}

// Loading translations should be done as early as possible
loadI18nAsync(
    Object.assign(
        {},
        ...(() => {
            if (!process.env["JEST_WORKER_ID"]) {
                const locales = require.context("./", true, /\.json$/);
                return locales.keys().map((key) => ({
                    [key.replace(/^\.\/|\.json$/g, "")]: { translation: locales(key) },
                }));
            }

            return [{ en: { translation: require("./en.json") } }];
        })(),
    ),
);

globalThis.i18n = locale;
