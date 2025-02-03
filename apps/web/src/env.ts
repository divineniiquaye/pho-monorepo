import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const Env = createEnv({
    shared: {
        NEXT_URL: z
            .string()
            .optional()
            .transform((v) => (v ? `https://${v}` : undefined)),
        PORT: z.coerce.number().default(3000),
        EXPO_OS: z.enum(["ios", "android", "web"]).default("web"),
    },

    /**
     * Specify your server-side environment variables schema here. This way you can ensure the app isn't
     * built with invalid env vars.
     */
    server: {},

    /**
     * Specify your client-side environment variables schema here.
     * For them to be exposed to the client, prefix them with `NEXT_PUBLIC_`.
     */
    client: {},

    /**
     * Destructure all variables from `process.env` to make sure they aren't tree-shaken away.
     */
    runtimeEnv: {
        NEXT_URL: process.env.NEXT_URL || process.env.NEXT_PUBLIC_SITE_URL,
        EXPO_OS: process.env.EXPO_OS,
        PORT: process.env.PORT,
    },
    skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION,
});
