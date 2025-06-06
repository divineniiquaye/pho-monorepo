#!/usr/bin/env node

import { execSync } from "node:child_process";
const { log } = console;

// Define all postinstall tasks here
const tasks = [
    {
        name: "react-native-reanimated-skeleton expo support",
        description: "Updating imports for linear gradient",
        command: `find ./node_modules/react-native-reanimated-skeleton -type f -exec sed -i '' -e 's/import LinearGradient/import { LinearGradient }/g' -e 's/react-native-linear-gradient/expo-linear-gradient/g' {} +`,
    },
    {
        name: "build expo-github-cache",
        description: "Building expo-github-cache",
        command: "pnpm run --filter=@tooling/expo-github-cache build",
    },
    // Add more tasks here in the same format:
    // {
    //     name: "task name",
    //     description: "what this task does",
    //     command: "command to execute"
    // }
];

async function runPostinstallTasks() {
    log("Starting postinstall tasks...\n");

    for (const task of tasks) {
        try {
            log(`🔧 ${task.name}`);
            log("     " + task.description);

            execSync(task.command, { stdio: "inherit" });

            log(`✓ Successfully completed: ${task.name}\n`);
        } catch (error) {
            log(`✗ Failed: ${task.name}`);
            log(`Error: ${error.message}\n`);
            process.exit(1);
        }
    }

    log("✨ All postinstall tasks completed successfully!");
}

runPostinstallTasks().catch((error) => {
    log("✗ Fatal error:", error.message);
    process.exit(1);
});
