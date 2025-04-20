const pluginPrettier = require("eslint-config-prettier/flat");
const pluginExpo = require("eslint-config-expo/flat");
const { defineConfig } = require("eslint/config");

/** https://docs.expo.dev/guides/using-eslint/ */
module.exports = defineConfig([
    pluginPrettier,
    pluginExpo,
    {
        rules: {
            "react-hooks/exhaustive-deps": "off",
            "@typescript-eslint/no-unused-vars": "off",
        },
    },
]);
