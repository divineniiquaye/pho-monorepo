// You can learn more about each option below in the Jest docs: https://jestjs.io/docs/configuration.
module.exports = {
    modulePathIgnorePatterns: ["<rootDir>/node_modules", "<rootDir>/.next/"],
    testMatch: ["**/?(*.)+(spec|test).ts?(x)"],
    globals: { __DEV__: true },
    testEnvironment: "jsdom",
    transformIgnorePatterns: [
        `node_modules/(?!(?:.pnpm/)?((jest-)?react-native|@react-native(-community)?|expo(nent|-modules-core)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|@sentry/.*|native-base|react-native-svg|@rn-primitives/.*))`,
    ],
    transform: {
        // Use babel-jest to transpile tests with the next/babel preset
        // https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object
        "^.+\\.(js|jsx|ts|tsx)$": [
            "babel-jest",
            { presets: ["next/babel", "@babel/preset-flow"] },
            // { presets: ["babel-preset-expo", "@babel/preset-flow"] },
        ],
    },
    moduleNameMapper: {
        "^(.S*?)(?:.ts|.tsx)?$": ["$1.web.ts", "$1.web.tsx", "$1.ts", "$1.tsx"],
        "^(.S*?)(?:.js|.jsx)?$": ["$1.web.js", "$1.web.jsx", "$1.js", "$1.jsx"],
        "^react-native": "react-native-web",
        "@react-native/js-polyfills/error-guard$":
            "<rootDir>/node_modules/@tooling/jest/__mock__/@react-native/js-polyfills/error-guard.js",
        "react-native/Libraries/Utilities/PolyfillFunctions$":
            "<rootDir>/node_modules/@tooling/jest/__mock__/react-native/Libraries/Utilities/PolyfillFunctions.js",
        "^\./third-party-libs/react-native-safe-area-context$":
            "<rootDir>/../../node_modules/react-native-css-interop/src/runtime/third-party-libs/react-native-safe-area-context.tsx",
    },
};
