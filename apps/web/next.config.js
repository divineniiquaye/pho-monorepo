const { withExpo } = require("@expo/next-adapter");

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    transpilePackages: [
        "@react-native/assets-registry",
        "@repo/ui",
        "expo",
        "expo-asset",
        "expo-constants",
        "expo-font",
        "expo-modules-core",
        "expo-status-bar",
        "nativewind",
        "react-native-css-interop",
        "react-native",
        "react-native-gesture-handler",
        "react-native-reanimated",
        "react-native-web",
        "solito",
    ],
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "play.google.com",
            },
            {
                protocol: "https",
                hostname: "developer.apple.com",
            },
        ],
    },
    webpack: (config) => {
        config.resolve.alias = {
            ...(config.resolve.alias || {}),
            // Transform all direct `react-native` imports to `react-native-web`
            "react-native$": "react-native-web",
        };
        // config.resolve.extensions = [
        //     ".web.js",
        //     ".web.jsx",
        //     ".web.ts",
        //     ".web.tsx",
        //     ...config.resolve.extensions,
        // ];
        return config;
    },
};

module.exports = withExpo(nextConfig);
