const { withTV } = require("tailwind-variants/transformer");
import type { Config } from "tailwindcss";

import sharedConfig from "@repo/tailwind-config";

const config: Pick<
    Config,
    "corePlugin" | "content" | "presets" | "plugins" | "important" | "darkMode"
> = {
    content: [
        "./app/**/*.tsx",
        "../../packages/ui/**/*.tsx",
        "!../../packages/ui/**/node_modules/**",
    ],
    plugins: [require("tailwindcss-animate")],
    presets: [require("nativewind/preset")],
    corePlugin: { backgroundOpacity: true },
    darkMode: "class",
    important: "html",
    ...sharedConfig,
};

export default withTV(config);
