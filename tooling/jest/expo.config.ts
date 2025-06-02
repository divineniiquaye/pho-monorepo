 // You can learn more about each option below in the Jest docs: https://jestjs.io/docs/configuration.
module.exports = {
    preset: "jest-expo",
    modulePathIgnorePatterns: ["<rootDir>/node_modules"],
    testMatch: ["**/?(*.)+(spec|test).ts?(x)"],
    transformIgnorePatterns: [
        `node_modules/(?!(?:.pnpm/)?((jest-)?react-native|@react-native(-community)?|expo(nent|-modules-core)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|@sentry/.*|native-base|react-native-svg|@rn-primitives/.*))`,
    ],
    moduleNameMapper: {
        "^\./third-party-libs/react-native-safe-area-context$":
            "<rootDir>/../../node_modules/react-native-css-interop/src/runtime/third-party-libs/react-native-safe-area-context.tsx",
    },
};
