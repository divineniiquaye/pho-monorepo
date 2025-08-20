#!/usr/bin/env node

import { execSync } from "node:child_process";
import { readdirSync } from "node:fs";
import select from "@inquirer/select";
import { program } from "commander";
import { join } from "node:path";
import chalk from "chalk";

const { log } = console;

const projectTypeChecks = [
    { type: "expo", files: ["eas.json"] },
    {
        type: "next",
        files: ["next.config.ts", "next.config.js", "next.config.mjs"],
    },
    // Extendable: { type: "astro", files: ["astro.config.mjs"] },
    // Extendable: { type: "vue", files: ["vue.config.js"] },
];

const envSettings = {
    production: { appEnv: "production", easEnv: "production" },
    staging: { appEnv: "development", easEnv: "staging" },
    development: { appEnv: "development", easEnv: "development" },
};

const validEnvs = Object.keys(envSettings);

function detectProjectType(appPath) {
    for (const check of projectTypeChecks) {
        if (
            check.files.some((file) => {
                try {
                    return readdirSync(appPath).includes(file);
                } catch {
                    return false;
                }
            })
        ) {
            return check.type;
        }
    }
    return "unknown";
}

async function getApps() {
    const appsDir = join(process.cwd(), "apps");
    try {
        return readdirSync(appsDir, { withFileTypes: true })
            .filter((dirent) => dirent.isDirectory())
            .map((dirent) => {
                const appPath = join(appsDir, dirent.name);
                return { name: dirent.name, type: detectProjectType(appPath) };
            });
    } catch (error) {
        log(chalk.red("Error: Could not find 'apps' directory"));
        process.exit(1);
    }
}

function validateEnvironment(mode) {
    if (!validEnvs.includes(mode)) {
        console.error(`Please provide a valid environment: ${validEnvs.join(", ")}`);
        process.exit(1);
    }
    return envSettings[mode];
}

async function selectPlatform(appEnv, optionsPlatform) {
    if (optionsPlatform && ["android", "ios"].includes(optionsPlatform)) {
        return optionsPlatform;
    }
    const platformChoice = await select({
        message: `Choose a platform to build for (android/ios)`,
        choices: [
            { name: "Build for android", value: "android" },
            { name: "Build for ios", value: "ios" },
        ],
    });
    return platformChoice;
}

function runCommand(command, cwd) {
    execSync(command, { cwd, stdio: "inherit" });
}

async function buildExpoApp(name, appEnv, easEnv, options) {
    const runningInCI = process.env["CI"] ?? false;

    if (!runningInCI) {
        const platform = await selectPlatform(appEnv, options.platform);
        if (!["android", "ios"].includes(platform)) {
            log(chalk.red("Please try again with a valid platform (android/ios)"));
            process.exit(1);
        }
        const variant = {
            ios: `--configuration ${appEnv === "production" ? "Release" : "Debug"}`,
            android: `--variant ${appEnv === "production" ? "release" : "debug"}`,
        };
        runCommand(`pnpm run ${platform} ${variant[platform]}`, `./apps/${name}`);
    } else {
        const autoSubmitFlag = options.autoSubmit ? "--auto-submit" : "";
        const interactiveFlag = runningInCI !== "local" ? "--non-interactive" : "";
        const platformArg = options.platform ?? "all";
        runCommand(
            `cross-env APP_ENV=${appEnv} EXPO_NO_DOTENV=1 pnpm run build -e ${easEnv} --platform ${platformArg} ${autoSubmitFlag} ${interactiveFlag} --no-wait`,
            `./apps/${name}`,
        );
    }
}

function buildNextApp(name) {
    runCommand(`pnpm run build`, `./apps/${name}`);
}

function buildGenericApp(name) {
    log(chalk.yellow(`Unknown project type for ${name}, running generic build...`));
    runCommand(`pnpm run build`, `./apps/${name}`);
}

program
    .description("Build specified app")
    .argument("[app]", "app name from apps directory")
    .option("-p, --platform [VALUE]", "Platform to build for (all/android/ios)")
    .option(
        "-m, --mode <VALUE>",
        "EAS build mode (development/production/staging)",
        "development",
    )
    .option("--auto-submit", "Auto submit to the store? (TestFlight/Internal testing)")
    .action(async (targetApp, options) => {
        try {
            const apps = await getApps();
            const { appEnv, easEnv } = validateEnvironment(options.mode);

            if (!targetApp) {
                const choice = await select({
                    message: "Which app would you like to build?",
                    choices: apps.map((app) => ({
                        name: `${app.name} (${app.type})`,
                        value: app,
                    })),
                });
                targetApp = choice;
            } else {
                targetApp = apps.find((app) => app.name === targetApp);
            }

            if (!targetApp) {
                log(
                    chalk.red(
                        "No app defined, please specify one use an interactive terminal",
                    ),
                );
                process.exit(1);
            }

            const { name, type } = targetApp;

            if (type === "expo") await buildExpoApp(name, appEnv, easEnv, options);
            else if (type === "next") buildNextApp(name);
            else buildGenericApp(name);
        } catch (error) {
            log(chalk.red("Failed to run:", error.message));
            process.exit(1);
        }
    });

program.parse(process.argv);
