import type { Config } from "tailwindcss";
import sharedConfig from "@repo/tailwind-config";

const config: Pick<Config, "prefix" | "presets" | "content" | "important" | "darkMode"> =
    {
        presets: [require("nativewind/preset")],
        content: ["./**/*.tsx"],
        important: "html",
        darkMode: "class",
        // prefix: "ui-",
        ...sharedConfig,
    };

export default config;
