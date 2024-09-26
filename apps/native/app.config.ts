import { withSentry } from "@sentry/react-native/expo";
import type { ExpoConfig } from "expo/config";

const ASSET_URL = "./assets";
const PROFILE = process.env["EAS_BUILD_PROFILE"] ?? "preview";
const PROJECT_ID = "<PROJECT_ID>";
const PRODUCT_NAME = "Myapp";
const BUILD_NUMBER = "10";

let config: ExpoConfig = {
    name: PRODUCT_NAME,
    description: "Bring the best services to you",
    userInterfaceStyle: "automatic",
    icon: `${ASSET_URL}/icon.png`,
    orientation: "portrait",
    scheme: "myapp",
    version: "1.0.0",
    slug: "myapp",
    notification: {
        icon: `${ASSET_URL}/icon.png`,
        iosDisplayInForeground: true,
        androidMode: "default",
        androidCollapsedTitle: PRODUCT_NAME,
    },
    splash: {
        image: `${ASSET_URL}/splash.png`,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
    },
    updates: {
        requestHeaders: {
            "expo-channel-name": "main",
        },
    },
    runtimeVersion: {
        policy: "nativeVersion",
    },
    plugins: [
        ...(process.env["CI"]
            ? [
                  "@react-native-firebase/app",
                  "@react-native-firebase/perf",
                  "@react-native-firebase/crashlytics",
              ]
            : []),
        "expo-font",
        "expo-location",
        [
            "expo-build-properties",
            {
                android: {
                    enableProguardInReleaseBuilds: true,
                    enableShrinkResourcesInReleaseBuilds: true,
                    disableAutomaticComponentCreation: true,
                    newArchEnabled: true,
                },
                ios: {
                    useFrameworks: "static",
                    RNFirebaseAnalyticsWithoutAdIdSupport: true,
                    newArchEnabled: true,
                },
            },
        ],
    ],
    ios: {
        supportsTablet: false,
        usesIcloudStorage: false,
        bundleIdentifier: "app.myapp.com",
        googleServicesFile: './certs/GoogleService-Info.plist',
        buildNumber: BUILD_NUMBER,
        entitlements: {
            "aps-environment": "production" === PROFILE ? "production" : "development",
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
            NSLocationWhenInUseUsageDescription: `${PRODUCT_NAME} needs access your location`,
        },
    },
    android: {
        package: "app.myapp.com",
        softwareKeyboardLayoutMode: "pan",
        googleServicesFile: './certs/google-services.json',
        versionCode: parseInt(BUILD_NUMBER),
        adaptiveIcon: {
            foregroundImage: `${ASSET_URL}/adaptive-icon.png`,
            backgroundColor: "#FFFFFF",
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
                data: [{ scheme: "myapp" }],
                category: ["BROWSABLE", "DEFAULT"],
            },
        ],
    },
    experiments: {
        typedRoutes: true,
    },
    extra: {
        eas: { projectId: PROJECT_ID },
        criticalIndex: 0,
        message: "",
        updates: {
            assetPatternsToBeBundled: ["./assets/*"],
        },
    },
};

if (process.env["CI"]) {
    config = withSentry(config, {
        url: "https://sentry.io/",
        organization: process.env["SENTRY_ORG"] ?? "myapp",
        project: process.env["SENTRY_PROJECT"] ?? "react-native",
    });
}

export default config;
