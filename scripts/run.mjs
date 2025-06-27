#!/usr/bin/env node

import { execSync } from "node:child_process";
import { readdirSync } from "node:fs";
import select from "@inquirer/select";
import { program } from "commander";
import { join } from "node:path";
import chalk from "chalk";

const { log } = console;

async function getApps() {
    const appsDir = join(process.cwd(), "apps");
    try {
        return readdirSync(appsDir, { withFileTypes: true })
            .filter((dirent) => dirent.isDirectory())
            .map((dirent) => dirent.name);
    } catch (error) {
        log(chalk.red("Error: Could not find 'apps' directory"));
        process.exit(1);
    }
}

program
    .description("Build/Run/Test specified app or all apps")
    .argument("<type>", "type of build")
    .argument("[app]", "app name from apps directory")
    .option("--non-interactive", "Skip interactive prompt", false)
    .option("-O, --only", "Exclude app from running")
    .action(async (type, targetApp, options) => {
        try {
            const apps = await getApps();

            if (!targetApp && !options.nonInteractive) {
                targetApp = await select({
                    message: `Which app would you like to ${type}?`,
                    choices: [
                        ...apps.map((app) => ({ name: app, value: app })),
                        ...(apps.length <= 1 ? [] : ["all"]),
                    ],
                });
            }

            if ("all" === targetApp) {
                execSync(`turbo run ${type} --parallel`, { stdio: "inherit" });
            } else if (!targetApp || !apps.includes(targetApp)) {
                log(
                    chalk.red(
                        targetApp
                            ? `Error: App '${targetApp}' not found in apps directory`
                            : "No app defined, please specify one use an interactive terminal",
                    ),
                );
                process.exit(1);
            } else if (options.only) {
                execSync(`pnpm --filter ./apps/${targetApp} run ${type}`, {
                    stdio: "inherit",
                });
            } else {
                const exclude = apps
                    .filter((app) => app !== targetApp)
                    .map((app) => `--filter !${app}`);
                execSync(`turbo run ${type} ${exclude.join(" ")}`, {
                    stdio: "inherit",
                });
            }

            if (type === "build") log(chalk.green("Build completed successfully!"));
        } catch (error) {
            log(chalk.red("Failed to run:", error.message));
            process.exit(1);
        }
    });

program.parse(process.argv);
