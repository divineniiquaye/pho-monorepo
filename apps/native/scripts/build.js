#!/usr/bin/env node

const { execSync } = require("child_process");

// Get the environment argument
const validEnvs = ["staging", "production", "development", "simulator"];
const env = process.argv[2] ?? "development";

if (!env || !validEnvs.includes(env)) {
    console.error(`Please provide a valid environment: ${validEnvs.join(", ")}`);
    process.exit(1);
}

// Map environments to their corresponding settings
const envSettings = {
    production: { appEnv: "production", easEnv: "production" },
    staging: { appEnv: "development", easEnv: "staging" },
    development: { appEnv: "development", easEnv: "development" },
    simulator: { appEnv: "development", easEnv: "simulator" },
};

const { appEnv, easEnv } = envSettings[env];
const additionalArgs = process.argv.slice(3).join(" ");
const command = `cross-env APP_ENV=${appEnv} EXPO_NO_DOTENV=1 eas build -e ${easEnv} ${additionalArgs}`;

try {
    console.log(`Executing command for ${env} environment:`);
    console.log(command);
    execSync(command, { stdio: "inherit" });
} catch (error) {
    // Log the entire error object to understand its structure
    console.error("Error executing command:", error);

    // Try accessing other properties or error output as fallback
    const errorMessage = error?.message || error.toString() || "Unknown error";
    console.error(`Build failed: ${errorMessage}`);
    process.exit(1);
}
