const pluginPrettier = require("eslint-config-prettier/flat");
const pluginReact = require("eslint-plugin-react-compiler");
const pluginExpo = require("eslint-config-expo/flat");
const { defineConfig } = require("eslint/config");

/** https://docs.expo.dev/guides/using-eslint/ */
module.exports = defineConfig([
    pluginReact.configs.recommended,
    pluginPrettier,
    pluginExpo,
    {
        rules: {
            "react-hooks/exhaustive-deps": "off",
            "@typescript-eslint/no-unused-vars": "off",
        },
    },
]);
