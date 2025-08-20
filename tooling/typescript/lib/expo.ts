import type { ExpoConfig } from "expo/config";
import { z } from "zod";

type CreateExpoConfigOptions<C extends z.ZodObject<any>, B extends z.ZodObject<any>> = {
    clientSchema: C;
    buildTimeSchema: B;
    allowedEnvs: string[];
    createConfig: (clientEnv: z.infer<C>, buildEnv: z.infer<B>) => ExpoConfig;
};

export const ignoreCheck =
    ["bin/eas", "bin/expo"].some((v) => process.env["_"]?.endsWith(v)) ||
    process.env?.["npm_lifecycle_event"] === "android";

export const zExtend = <T extends z.ZodTypeAny>(schema: T, key?: string) =>
    key
        ? schema.refine(() => undefined == process.env?.[key], {
              message: `${key} is meant to be static and not defined as env`,
          })
        : ignoreCheck
          ? schema.optional()
          : schema;

export function createExpoConfig<C extends z.ZodObject<any>, B extends z.ZodObject<any>>({
    clientSchema,
    buildTimeSchema,
    allowedEnvs,
    createConfig,
}: CreateExpoConfigOptions<C, B>) {
    const data = Object.fromEntries(
        Object.entries(process.env).filter(([key]) => allowedEnvs.includes(key)),
    );
    const parsed = buildTimeSchema.extend(clientSchema.shape).safeParse(data);

    if (!parsed.success) {
        console.error(
            "\n",
            z.prettifyError(parsed.error),
            `\n❌ Missing variables in .env.local file, Make sure all required variables are defined in the .env.local file.`,
            `\n💡 Tip: If you recently updated the .env.local file and the error still persists, try restarting the server with the -c flag to clear the cache.`,
        );
        throw new Error( // Incase the code wasn't running from terminal
            "Invalid environment variables, Check terminal for more details ",
        );
    }

    return createConfig(clientSchema.parse(data), buildTimeSchema.parse(data));
}
