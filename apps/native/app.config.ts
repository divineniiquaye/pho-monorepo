import type { ExpoConfig } from "expo/config";
import { ClientEnv, Env } from "./scripts/env";

const ASSET_URL = "./assets/images";

const config: ExpoConfig = {
    name: Env.NAME,
    description: "Bring the best services to you",
    userInterfaceStyle: "automatic",
    icon: `${ASSET_URL}/icon.png`,
    platforms: ["ios", "android"],
    orientation: "default",
    scheme: Env.SCHEME,
    version: Env.VERSION,
    slug: Env.SLUG,
    newArchEnabled: true,
    notification: {
        icon: `${ASSET_URL}/icon.png`,
        iosDisplayInForeground: true,
        androidMode: "default",
        androidCollapsedTitle: Env.NAME,
    },
    androidStatusBar: {
        translucent: true,
    },
    runtimeVersion: {
        policy: "nativeVersion",
    },
    updates: {
        url: `https://u.expo.dev/${Env.EAS_PROJECT_ID}`,
        checkAutomatically: "NEVER",
        fallbackToCacheTimeout: 0,
    },
    plugins: [
        "expo-font",
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
        [
            "expo-build-properties",
            {
                android: {
                    enableProguardInReleaseBuilds: true,
                    enableShrinkResourcesInReleaseBuilds: true,
                    disableAutomaticComponentCreation: true,
                },
                ios: {
                    useFrameworks: "static",
                    RNFirebaseAnalyticsWithoutAdIdSupport: true,
                },
            },
        ],
    ].concat(require("./plugins/onBuild")),
    ios: {
        supportsTablet: true,
        bundleIdentifier: Env.BUNDLE_ID,
        googleServicesFile: "./certs/GoogleService-Info.plist",
        buildNumber: Env.BUILD_NUMBER,
        bitcode: true,
        entitlements: {
            "aps-environment":
                "production" === Env.APP_ENV ? "production" : "development",
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
            NSLocationWhenInUseUsageDescription: `${Env.NAME} needs access your location`,
        },
    },
    android: {
        package: Env.BUNDLE_ID,
        googleServicesFile: "./certs/google-services.json",
        versionCode: Number.parseInt(Env.BUILD_NUMBER),
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
                data: [{ scheme: Env.SCHEME }],
                category: ["BROWSABLE", "DEFAULT"],
            },
        ],
    },
    experiments: {
        typedRoutes: true,
    },
    extra: {
        ClientEnv,
        eas: { projectId: Env.EAS_PROJECT_ID },
        updates: {
            assetPatternsToBeBundled: ["./assets/*"],
        },
    },
};

export default config;
