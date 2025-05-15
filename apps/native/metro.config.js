// Learn more https://docs.expo.dev/guides/monorepos
// Learn more https://docs.expo.io/guides/customizing-metro
/**
 * @type {import('expo/metro-config')}
 */
const { wrapWithReanimatedMetroConfig } = require("react-native-reanimated/metro-config");
const { getDefaultConfig } = require("@expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const { FileStore } = require("metro-cache");

const path = require("node:path");

// Find the project and workspace directories
const projectRoot = __dirname;
// The workspace root is the parent of the project root
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);
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
// 4. Enable package exports for metro
config.resolver.unstable_enablePackageExports = true;
// 5. This repository is configured Turborepo to use this cache location.
config.cacheStores = [
    new FileStore({ root: path.join(__dirname, "node_modules/.cache/metro") }),
];

module.exports = withNativeWind(wrapWithReanimatedMetroConfig(config), {
    configPath: tailwindConfigPath,
    input: globalCSS,
    projectRoot,
});
