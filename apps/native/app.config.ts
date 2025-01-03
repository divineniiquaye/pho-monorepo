import type { ExpoConfig } from "expo/config";

const ASSET_URL = "./assets/images";
const PROFILE = process.env["EAS_BUILD_PROFILE"] ?? "preview";
const PROJECT_ID = "<PROJECT_ID>";
const PRODUCT_NAME = "Myapp";
const BUILD_NUMBER = "10";

const config: ExpoConfig = {
    name: PRODUCT_NAME,
    description: "Bring the best services to you",
    userInterfaceStyle: "automatic",
    icon: `${ASSET_URL}/icon.png`,
    platforms: ["ios", "android"],
    orientation: "default",
    scheme: "myapp",
    version: "1.0.0",
    slug: "myapp",
    newArchEnabled: true,
    notification: {
        icon: `${ASSET_URL}/icon.png`,
        iosDisplayInForeground: true,
        androidMode: "default",
        androidCollapsedTitle: PRODUCT_NAME,
    },
    androidStatusBar: {
        translucent: true,
    },
    runtimeVersion: {
        policy: "nativeVersion",
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
    ].concat(
        process.env["CI"]
            ? ([
                  "@react-native-firebase/app",
                  "@react-native-firebase/perf",
                  "@react-native-firebase/crashlytics",
                  [
                      "@sentry/react-native/expo",
                      {
                          url: "https://sentry.io/",
                          organization: process.env["SENTRY_ORG"] ?? "myapp",
                          project: process.env["SENTRY_PROJECT"] ?? "react-native",
                          note: "Ensure you set the SENTRY_AUTH_TOKEN as an environment variable to authenticate with Sentry. Do not add it to the .env file. Instead, add it as an EAS secret or as an environment variable in your CI/CD pipeline for security.",
                      },
                  ],
              ] as any)
            : [],
    ) as any,
    ios: {
        supportsTablet: false,
        usesIcloudStorage: false,
        bundleIdentifier: "app.myapp.com",
        googleServicesFile: "./certs/GoogleService-Info.plist",
        buildNumber: BUILD_NUMBER,
        bitcode: true,
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
        googleServicesFile: "./certs/google-services.json",
        versionCode: Number.parseInt(BUILD_NUMBER),
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
        updates: {
            assetPatternsToBeBundled: ["./assets/*"],
        },
    },
};

export default config;
