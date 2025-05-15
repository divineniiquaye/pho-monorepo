import type { Config } from "tailwindcss";
import sharedConfig from "@repo/design/tailwind/tailwind.config";

const config: Pick<Config, "content" | "important" | "darkMode"> =
    {
        content: [
            "./app/**/*.tsx",
            "../../packages/design-system/**/*.tsx",
            "!../../packages/design-system/**/node_modules/**",
        ],
        important: "html",
        darkMode: "class",
        ...sharedConfig,
    };

export default config;
