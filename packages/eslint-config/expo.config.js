// https://docs.expo.dev/guides/using-eslint/

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
    {
        plugins: {
            expo: require("eslint-config-expo"),
        },
        rules: {
            "@typescript-eslint/no-unused-vars": "off",
        },
    },
];
