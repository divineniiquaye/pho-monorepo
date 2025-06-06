/**
 * 1st part: Import packages and Load your env variables
 * we use dotenv to load the correct variables from the .env file based on the APP_ENV variable (default is development)
 * APP_ENV is passed as an inline variable while executing the command, for example: APP_ENV=staging pnpm build:android
 */
import plugins from "./plugins/onBuild";
import * as dotenv from "dotenv";
import path from "node:path";
import * as z from "zod";

const APP_ENV = process.env["APP_ENV"] ?? "development";
const envPath = path.resolve(__dirname, `.env.${APP_ENV}`);
dotenv.config({ path: envPath });

/**
 * 2nd part: Define some static variables for the app
 * Such as: bundle id, package name, app name.
 *
 * You can add them to the .env file but we think it's better to keep them here as as we use prefix to generate this values based on the APP_ENV
 * for example: if the APP_ENV is staging, the bundle id will be com.myapp.staging
 */
const NAME = "Myapp";
const BUNDLE_ID = "app.myapp.com";
const EXPO_ACCOUNT_OWNER = process.env["EXPO_ACCOUNT_OWNER"] ?? "myapp_owner";
const EAS_PROJECT_ID = process.env["EAS_PROJECT_ID"] ?? "<PROJECT_ID>";
const ASSET_URL = "./assets/images";
const BUILD_NUMBER = "1";
const VERSION = "0.1.0";
const SCHEME = "myapp";
const SLUG = SCHEME;

/**
 * 3rd part: Define your env variables schema
 * we use zod to define our env variables schema
 *
 * we split the env variables into two parts:
 *    1. client: These variables are used in the client-side code (`src` folder).
 *    2. buildTime: These variables are used in the build process (app.config.ts file). You can think of them as server-side variables.
 *
 * Main rules:
 *    1. If you need your variable on the client-side, you should add it to the client schema; otherwise, you should add it to the buildTime schema.
 *    2. Whenever you want to add a new variable, you should add it to the correct schema based on the previous rule, then you should add it to the corresponding object (_clientEnv or _buildTimeEnv).
 *
 * Note: `z.string()` means that the variable exists and can be an empty string, but not `undefined`.
 * If you want to make the variable required, you should use `z.string().min(1)` instead.
 * Read more about zod here: https://zod.dev/?id=strings
 *
 */
const client = z.object({
    APP_ENV: z.enum(["development", "production"]),
    NAME: z.string(),
    SCHEME: z.string(),
    BUNDLE_ID: z.string(),
    BUILD_NUMBER: z.string(),
    VERSION: z.string(),
    SLUG: z.string(),

    SENTRY_DSN: z.string().nullable().default(null),
});

const buildTime = z.object({
    EXPO_ACCOUNT_OWNER: z.string(),
    EAS_PROJECT_ID: z.string(),

    SENTRY_ORG: z.string().min(1, "SENTRY_ORG is required"),
    SENTRY_PROJECT: z.string().min(1, "SENTRY_PROJECT is required"),
});

/**
 * @type {Record<keyof z.infer<typeof client> , unknown>}
 */
const _clientEnv = {
    APP_ENV,
    NAME,
    SCHEME,
    BUNDLE_ID,
    BUILD_NUMBER,
    VERSION,
    SLUG,

    SENTRY_DSN: process.env["SENTRY_DSN"],
};

/**
 * @type {Record<keyof z.infer<typeof buildTime> , unknown>}
 */
const _buildTimeEnv = {
    EXPO_ACCOUNT_OWNER,
    EAS_PROJECT_ID,

    SENTRY_ORG: process.env["SENTRY_ORG"],
    SENTRY_PROJECT: process.env["SENTRY_PROJECT"],
};

const parsed = buildTime.merge(client).safeParse({
    ..._clientEnv,
    ..._buildTimeEnv,
});
if (parsed.success === false) {
    console.error(
        "❌ Invalid environment variables:",
        parsed.error.flatten().fieldErrors,

        `\n❌ Missing variables in .env.${APP_ENV} file, Make sure all required variables are defined in the .env.${APP_ENV} file.`,
        `\n💡 Tip: If you recently updated the .env.${APP_ENV} file and the error still persists, try restarting the server with the -c flag to clear the cache.`,
    );
    throw new Error("Invalid environment variables, Check terminal for more details ");
}

const config: import("expo/config").ExpoConfig = {
    name: parsed.data.NAME,
    description: "Bring the best services to you",
    userInterfaceStyle: "automatic",
    icon: `${ASSET_URL}/icon.png`,
    platforms: ["ios", "android"],
    orientation: "default",
    scheme: parsed.data.SCHEME,
    version: parsed.data.VERSION,
    slug: parsed.data.SLUG,
    newArchEnabled: true,
    notification: {
        icon: `${ASSET_URL}/icon.png`,
        iosDisplayInForeground: true,
        androidMode: "default",
        androidCollapsedTitle: parsed.data.NAME,
    },
    androidStatusBar: {
        translucent: true,
    },
    runtimeVersion: {
        policy: "nativeVersion",
    },
    updates: {
        url: `https://u.expo.dev/${parsed.data.EAS_PROJECT_ID}`,
        checkAutomatically: "NEVER",
        fallbackToCacheTimeout: 0,
    },
    plugins: [
        [
            "expo-font",
            {
                fonts: [
                    "./node_modules/@repo/design/fonts/NunitoSans.ttf",
                    "./node_modules/@repo/design/fonts/RobotoMono.ttf",
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
        ...plugins(buildTime.parse(_buildTimeEnv)),
    ],
    ios: {
        supportsTablet: true,
        bundleIdentifier: parsed.data.BUNDLE_ID,
        googleServicesFile: "./certs/GoogleService-Info.plist",
        buildNumber: parsed.data.BUILD_NUMBER,
        bitcode: true,
        entitlements: {
            "aps-environment":
                "production" === parsed.data.APP_ENV ? "production" : "development",
        },
        infoPlist: {
            UIApplicationSceneManifest: {
                UISceneConfigurations: {},
            },
            UIBackgroundModes: ["remote-notification"],
            ITSAppUsesNonExemptEncryption: false,
            RNFirebaseAnalyticsWithoutAdIdSupport: true,
            NSPrivacySystemBootTimeUsageDescription:
                "We access system boot time for analytics purposes.",
            NSPrivacyFileTimestampUsageDescription:
                "We use file timestamps to improve app performance.",
            NSLocationWhenInUseUsageDescription: `${parsed.data.NAME} needs access your location`,
        },
    },
    android: {
        package: parsed.data.BUNDLE_ID,
        googleServicesFile: "./certs/google-services.json",
        versionCode: Number.parseInt(parsed.data.BUILD_NUMBER),
        adaptiveIcon: {
            foregroundImage: `${ASSET_URL}/adaptive-icon.png`,
            backgroundImage: `${ASSET_URL}/adaptive-icon.png`,
        },
        permissions: [
            "android.permission.OBSERVE_GRANT_REVOKE_PERMISSIONS",
            "android.permission.RECEIVE_BOOT_COMPLETED",
            "android.permission.ACCESS_COARSE_LOCATION",
            "android.permission.READ_EXTERNAL_STORAGE",
            "android.permission.ACCESS_FINE_LOCATION",
            "android.permission.VIBRATE",
        ],
        intentFilters: [
            {
                action: "VIEW",
                autoVerify: true,
                data: [{ scheme: parsed.data.SCHEME }],
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
        ClientEnv: client.parse(_clientEnv),
        eas: { projectId: parsed.data.EAS_PROJECT_ID },
        updates: {
            assetPatternsToBeBundled: ["./assets/*"],
        },
    },
};

export type ClientEnv = z.infer<typeof client>;
export type BuildEnv = z.infer<typeof buildTime>;
export default config;
