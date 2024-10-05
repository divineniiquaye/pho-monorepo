import type { Config } from "tailwindcss";

import sharedConfig from "@repo/tailwind-config";

const config: Pick<
    Config,
    "corePlugin" | "content" | "presets" | "plugins" | "darkMode"
> = {
    content: [
        "./app/**/*.tsx",
        "../../packages/ui/**/*.tsx",
        "!../../packages/ui/**/node_modules/**",
    ],
    presets: [require("nativewind/preset")],
    corePlugin: { backgroundOpacity: true },
    darkMode: "class",
    ...sharedConfig,
};

export default config;
