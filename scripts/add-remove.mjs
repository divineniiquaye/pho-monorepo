#!/usr/bin/env node

import { execSync } from "node:child_process";
import { program } from "commander";
import chalk from "chalk";

const { log } = console;

program
    .description("Add/Remove a dependency from monorepo")
    .argument("[path]", "path name found in monorepo")
    .argument("[package]", "package name to add/remove")
    .option("-t, --type <TYPE>", "Type of action to add/remove")
    .option("-D, --dev", "Add/Remove as dev dependency")
    .option("--non-interactive", "Skip interactive prompt", false)
    .action(async (path, packageName, options) => {
        try {
            const devFlag = options.dev ? "-D" : "";
            const targetPath = path || !options.nonInteractive ? path : undefined;

            if (!!targetPath) {
                execSync(
                    `pnpm --filter ${targetPath} ${options.type} ${packageName} ${devFlag}`,
                    { stdio: "inherit" },
                );
            } else {
                execSync(`pnpm ${options.type} ${packageName} ${devFlag}`, {
                    stdio: "inherit",
                });
            }
        } catch (error) {
            log(chalk.red("Failed to run:", error.message));
            process.exit(1);
        }
    });

program.parse(process.argv);
