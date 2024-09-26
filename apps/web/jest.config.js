const nextJest = require("next/jest");

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    globals: { __DEV__: true },
    testEnvironment: "jsdom",
    moduleNameMapper: {
        "^(.S*?)(?:.ts|.tsx)?$": ["$1.web.ts", "$1.web.tsx", "$1.ts", "$1.tsx"],
        "^(.S*?)(?:.js|.jsx)?$": ["$1.web.js", "$1.web.jsx", "$1.js", "$1.jsx"],
        "^react-native$": "react-native-web",
    },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
