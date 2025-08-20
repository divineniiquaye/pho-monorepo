// You can learn more about each option below in the Jest docs: https://jestjs.io/docs/configuration.
module.exports = {
    cache: false,
    preset: "ts-jest",
    modulePathIgnorePatterns: ["<rootDir>/node_modules"],
    testMatch: ["**/?(*.)+(spec|test).ts?(x)"],
    testEnvironment: "node",
    transform: {
        "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.test.json" }],
    },
};
