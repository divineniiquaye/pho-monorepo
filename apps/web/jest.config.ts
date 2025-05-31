import nextJest from "next/jest";

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: "./",
});

module.exports = createJestConfig({
    ...require("@tooling/jest/next.config"),
    setupFilesAfterEnv: ["./__tests__/jest-setup.ts"],
});
