import type { Config } from "tailwindcss";
import sharedConfig from "@repo/tailwind-config";

const config: Pick<Config, "prefix" | "presets" | "content" | "important" | "darkMode"> =
    {
        presets: [require("nativewind/preset")],
        content: ["./**/*.tsx", "!./node_modules/**"],
        important: "html",
        darkMode: "class",
        // prefix: "ui-",
        ...sharedConfig,
    };

export default config;
