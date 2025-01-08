import i18n from "@repo/i18n-config";
export * from "@repo/i18n-config";

declare module "i18next" {
    interface CustomTypeOptions {
        // Define the shape of your translation resources
        resources: {
            translation: typeof import("./en.json"); // Assuming en.json is your base
        };
    }
}

export default i18n;
