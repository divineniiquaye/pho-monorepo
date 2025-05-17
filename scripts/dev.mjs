#!/usr/bin/env node

import { execSync } from "node:child_process";
import select from "@inquirer/select";
import { readdirSync } from "node:fs";
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
    .description("Run specified app or all apps")
    .argument("[app]", "app name from apps directory")
    .option("--non-interactive", "Skip interactive prompt", false)
    .option("-e, --except", "Exclude app from running")
    .action(async (app, options) => {
        try {
            const apps = await getApps();
            let targetApp = apps.length <= 1 ? "all" : app;
            const except = options.except ? "!" : "";

            if (!targetApp && !options.nonInteractive) {
                targetApp = await select({
                    message: "Which app would you like to run?",
                    choices: [...apps.map((app) => ({ name: app, value: app })), "all"],
                });
            }

            if (targetApp && targetApp !== "all") {
                if (!apps.includes(targetApp)) {
                    log(
                        chalk.red(
                            `Error: App '${targetApp}' not found in apps directory`,
                        ),
                    );
                    process.exit(1);
                }
                log(chalk.blue(`Running app: ${targetApp}`));
                execSync(`turbo run --filter ${except}${targetApp} dev`, {
                    stdio: "inherit",
                });
            } else {
                log(chalk.blue("Running all apps"));
                execSync("turbo run dev", { stdio: "inherit" });
            }
        } catch (error) {
            log(chalk.red("Failed to run:", error.message));
            process.exit(1);
        }
    });

program.parse(process.argv);
