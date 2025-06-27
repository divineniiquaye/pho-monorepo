#!/usr/bin/env node

import { execSync } from "node:child_process";
import select from "@inquirer/select";
import { program } from "commander";
import chalk from "chalk";

const { log } = console;

async function getAllProjects() {
    try {
        const output = execSync("pnpm m la -r --json", { encoding: "utf-8" });
        const projects = JSON.parse(output);
        return projects.map((project) => project.name);
    } catch (error) {
        log(chalk.red("Failed to get projects:", error.message));
        return [];
    }
}

program
    .description("Add/Remove a dependency from monorepo")
    .argument("[args...]", "package name to add/remove")
    .passThroughOptions()
    .option("-A, --add", "Add a package", false)
    .option("-R, --remove", "Remove a package", false)
    .option("-U, --update", "Update package(s)", false)
    .action(async (args, options, command) => {
        try {
            const projects = await getAllProjects();
            const argFilter = args.filter((arg) =>
                ["add", "remove", "update"].includes(arg),
            );
            let commandType = !!options.add
                ? "add"
                : !!options.remove
                  ? "remove"
                  : !!options.update
                    ? "update"
                    : undefined;

            if (
                (args.length === 1 && args.includes("update")) ||
                (commandType === "update" && args.length === 0)
            ) {
                execSync(
                    "pnpm dlx npm-check-updates --deep -u -x '/^(?:@types/)?react(?:-dom|-test-renderer)?$/' && pnpm install",
                    { stdio: "inherit" },
                );
            } else if (argFilter.length !== 0) {
                console.log(
                    chalk.red(
                        "Using (add, remove, or update) as an argument is not supported, please use the --add, --remove, or --update options instead",
                    ),
                );
                console.error("  └─ eg. pnpm deps zod --update or pnpm deps -u");
                console.error("  └─ eg. pnpm deps jest -D --add");
                console.error("  └─ eg. pnpm deps zod --remove");
                process.exit(1);
            } else if (args.length >= 1) {
                const targetPath = await select({
                    message: `Select the project you want to ${commandType ?? "add/remove/update"} the package(s) to:`,
                    choices: projects.map((app) => ({ name: app, value: app })),
                });

                if (!commandType) {
                    commandType = await select({
                        message: `What would you like to do?`,
                        choices: [
                            { name: "Add as a package", value: "add" },
                            { name: "Remove package", value: "remove" },
                            { name: "Update package", value: "update" },
                        ],
                    });
                }

                if (!!targetPath && !!commandType) {
                    execSync(
                        `pnpm ${commandType} --filter ${targetPath} ${args.join(" ")}`,
                        { stdio: "inherit" },
                    );
                } else {
                    console.log(
                        chalk.red(
                            "Please specify any of the following options: --add, --remove, --update",
                        ),
                    );
                    console.error("  └─ eg. pnpm deps zod --update or pnpm deps -u");
                    console.error("  └─ eg. pnpm deps zod --remove");
                    console.error("  └─ eg. pnpm deps zod --add");
                    process.exit(1);
                }
            } else {
                console.log(
                    chalk.red("Kindly specify the package name to add/remove/update"),
                );
                console.error("  └─ eg. pnpm deps zod --add or pnpm deps jest -D --add");
                console.error("  └─ eg. pnpm deps zod --update or pnpm deps update");
                console.error("  └─ eg. pnpm deps zod --remove");
            }
        } catch (error) {
            log(chalk.red("Failed to run:", error.message));
            process.exit(1);
        }
    });

program.parse(process.argv);
