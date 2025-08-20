// Learn more https://docs.expo.dev/guides/monorepos
// Learn more https://docs.expo.io/guides/customizing-metro
/**
 * @type {import('expo/metro-config')}
 */
const { wrapWithReanimatedMetroConfig } = require("react-native-reanimated/metro-config");
// const { getSentryExpoConfig } = require("@sentry/react-native/metro");
const { getDefaultConfig } = require("@expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const { FileStore } = require("metro-cache");

const path = require("node:path");

// Find the project and workspace directories
const projectRoot = __dirname;
// The workspace root is the parent of the project root
const workspaceRoot = path.resolve(projectRoot, "../..");

// If you want to use sentry, replace getDefaultConfig with getSentryExpoConfig
const config = getDefaultConfig(projectRoot, { isCSSEnabled: true });
const globalCSS = path.resolve(
    workspaceRoot,
    "packages/design-system/tailwind/global.css",
);
const tailwindConfigPath = path.resolve(projectRoot, "tailwind.config.ts");

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];
// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, "node_modules"),
    path.resolve(workspaceRoot, "node_modules"),
];
// 3. Force Metro to resolve (sub)dependencies only from the `nodeModulesPaths`
config.resolver.disableHierarchicalLookup = true;
// 4. Configure the resolver with new options
config.watcher.unstable_lazySha1 = true;
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = ["react-native", "require", "browser"];
// 5. This repository is configured Turborepo to use this cache location.
config.cacheStores = [
    new FileStore({ root: path.join(__dirname, "node_modules/.cache/metro") }),
];
// 6. The option below removes all console logs statements in production.
config.transformer.minifierConfig = {
    compress: { drop_console: true },
};

module.exports = withNativeWind(wrapWithReanimatedMetroConfig(config), {
    configPath: tailwindConfigPath,
    input: globalCSS,
    projectRoot,
});
