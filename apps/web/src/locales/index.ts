export * from "@repo/design/lib/locale";

declare module "i18next" {
    interface CustomTypeOptions {
        // Define the shape of your translation resources
        resources: {
            translation: typeof import("./en.json"); // Assuming en.json is your base
        };
    }
}
