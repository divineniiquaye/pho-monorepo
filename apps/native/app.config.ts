import { createExpoConfig, zExtend } from "@tooling/typescript/lib/expo";
import * as z from "zod";

const ASSET_URL = "./assets/images";
const BUILD_NUMBER = "1";

const client = z.object({
    APP_ENV: z.enum(["development", "production"]).default("development"),
    NAME: z.string().default("Myapp"),
    SCHEME: z.string().default("myapp"),
    BUNDLE_ID: z.string().default("app.myapp.com"),
    BUILD_NUMBER: z.string().default(BUILD_NUMBER),
    VERSION: z.string().default("1.0.0"),
    SLUG: z.string().default("myapp"),

    SENTRY_DSN: zExtend(z.string().min(1, "SENTRY_DSN is required").default("")),
});

const buildTime = z.object({
    EXPO_ACCOUNT_OWNER: zExtend(
        z.string().default("<YOUR_ACCOUNT_OWNER>"),
        "EXPO_ACCOUNT_OWNER",
    ),
    EAS_PROJECT_ID: zExtend(z.string().default("<YOUR_PROJECT_ID>"), "EAS_PROJECT_ID"),

    SENTRY_ORG: z.string().default("myapp"),
    SENTRY_PROJECT: z.string().default("react-native"),
});

const config = createExpoConfig({
    clientSchema: client,
    buildTimeSchema: buildTime,
    allowedEnvs: ["APP_ENV", "API_URL", "SENTRY_DSN", "SENTRY_ORG", "SENTRY_PROJECT"],
    createConfig: (clientEnv, buildEnv) => ({
        name: clientEnv.NAME,
        description: "Welcome to Myapp",
        userInterfaceStyle: "automatic",
        icon: `${ASSET_URL}/icon.png`,
        platforms: ["ios", "android"],
        orientation: "default",
        scheme: clientEnv.SCHEME,
        version: clientEnv.VERSION,
        slug: clientEnv.SLUG,
        newArchEnabled: true,
        notification: {
            icon: `${ASSET_URL}/icon.png`,
            iosDisplayInForeground: true,
            androidMode: "default",
            androidCollapsedTitle: clientEnv.NAME,
        },
        androidStatusBar: {
            translucent: true,
        },
        runtimeVersion: {
            policy: "nativeVersion",
        },
        updates: {
            url: `https://u.expo.dev/${buildEnv.EAS_PROJECT_ID}`,
            checkAutomatically: "NEVER",
            fallbackToCacheTimeout: 0,
        },
        plugins: [
            [
                process.env?.["EAS_BUILD_PROFILE"] === "development"
                    ? "expo-dev-client"
                    : "expo-router",
            ],
            [
                "react-native-edge-to-edge",
                { android: { enforceNavigationBarContrast: false } },
            ],
            [
                "expo-font",
                {
                    fonts: [
                        "../../node_modules/@repo/design/fonts/Geist.ttf",
                        "../../node_modules/@repo/design/fonts/NunitoSans.ttf",
                        "../../node_modules/@repo/design/fonts/RobotoMono.ttf",
                    ],
                },
            ],
            [
                "expo-splash-screen",
                {
                    image: `${ASSET_URL}/splash.png`,
                    backgroundColor: "#FFFFFF",
                    imageWidth: 200,
                    dark: {
                        backgroundColor: "#000000",
                    },
                },
            ],
            // [
            //     "@sentry/react-native/expo",
            //     {
            //         url: "https://sentry.io/",
            //         organization: buildEnv.SENTRY_ORG,
            //         project: buildEnv.SENTRY_PROJECT,
            //         note: "Ensure you set the SENTRY_AUTH_TOKEN as an environment variable to authenticate with Sentry. Do not add it to the .env file. Instead, add it as an EAS secret or as an environment variable in your CI/CD pipeline for security.",
            //     },
            // ],
        ],
        ios: {
            supportsTablet: true,
            usesAppleSignIn: true,
            bundleIdentifier: clientEnv.BUNDLE_ID,
            googleServicesFile: "./certs/GoogleService-Info.plist",
            buildNumber: clientEnv.BUILD_NUMBER,
            entitlements: {
                "aps-environment":
                    "production" === clientEnv.APP_ENV ? "production" : "development",
            },
            infoPlist: {
                UIApplicationSceneManifest: {
                    UISceneConfigurations: {},
                },
                UIBackgroundModes: ["remote-notification"],
                ITSAppUsesNonExemptEncryption: false,
                RNFirebaseAnalyticsWithoutAdIdSupport: true,
                NSCameraUsageDescription: `Allow ${clientEnv.NAME} to access your camera to scan QR code`,
                NSPrivacySystemBootTimeUsageDescription:
                    "We access system boot time for analytics purposes.",
                NSPrivacyFileTimestampUsageDescription:
                    "We use file timestamps to improve app performance.",
            },
        },
        android: {
            package: clientEnv.BUNDLE_ID,
            googleServicesFile: "./certs/google-services.json",
            versionCode: Number.parseInt(clientEnv.BUILD_NUMBER),
            adaptiveIcon: {
                foregroundImage: `${ASSET_URL}/adaptive-icon.png`,
                backgroundImage: `${ASSET_URL}/adaptive-icon.png`,
            },
            permissions: [
                "android.permission.OBSERVE_GRANT_REVOKE_PERMISSIONS",
                "android.permission.RECEIVE_BOOT_COMPLETED",
                "android.permission.READ_EXTERNAL_STORAGE",
                "android.permission.VIBRATE",
            ],
            intentFilters: [
                {
                    action: "VIEW",
                    autoVerify: true,
                    data: [{ scheme: clientEnv.SCHEME }],
                    category: ["BROWSABLE", "DEFAULT"],
                },
            ],
        },
        experiments: {
            typedRoutes: true,
            buildCacheProvider: {
                plugin: "@tooling/expo-github-cache",
                options: {
                    owner: "divineniiquaye",
                    repo: "pho-monorepo-artifacts",
                },
            },
        },
        extra: {
            ClientEnv: clientEnv,
            eas: { projectId: buildEnv.EAS_PROJECT_ID },
            updates: { assetPatternsToBeBundled: ["./assets/*"] },
        },
    }),
});

export type ClientEnv = z.infer<typeof client>;
export type BuildEnv = z.infer<typeof buildTime>;
export default config;
