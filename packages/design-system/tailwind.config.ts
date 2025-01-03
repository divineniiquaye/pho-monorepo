import type { Config } from "tailwindcss";
import sharedConfig from "@repo/tailwind-config";

const config: Pick<Config, "content" | "important" | "darkMode"> = {
    content: ["./**/*.tsx", "!./node_modules/**"],
    important: "html",
    darkMode: "class",
    ...sharedConfig,
};

export default config;
