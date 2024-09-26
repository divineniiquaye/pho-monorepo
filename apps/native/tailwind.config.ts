import type { Config } from "tailwindcss";

import sharedConfig from "@repo/tailwind-config";

const config: Pick<
    Config,
    "corePlugin" | "content" | "presets" | "plugins" | "darkMode"
> = {
    content: ["./app/**/*.tsx", "./node_modules/@repo/ui/**/*.tsx"],
    presets: [require("nativewind/preset")],
    corePlugin: { backgroundOpacity: true },
    darkMode: "class",
    ...sharedConfig,
};

export default config;
