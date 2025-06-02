const config = {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    ...require("@tooling/jest/expo.config"),
    setupFilesAfterEnv: ["./__tests__/jest-setup.ts"],
};
module.exports = config;
