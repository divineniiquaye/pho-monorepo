/** @type {import('@babel/core').TransformOptions} */
module.exports = (api) => {
    api.cache(true);
    return {
        presets: [
            [
                "babel-preset-expo",
                { jsxImportSource: "nativewind", unstable_transformImportMeta: true },
            ],
            "nativewind/babel",
        ],

        /** NOTE: This must be last in the plugins @see https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation/#babel-plugin */
        plugins: ["react-native-reanimated/plugin"],
    };
};
