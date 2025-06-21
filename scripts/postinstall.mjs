#!/usr/bin/env node

import { execSync } from "node:child_process";
const { log } = console;

/**
 * Add more tasks here in the same format:
 * {
 *     name: "task name",
 *     description: "what this task does",
 *     command: "command to execute"
 * }
 * 
 * To use this file, add the following line to your package.json file:
 * "postinstall": "node scripts/postinstall.mjs"
 */
const tasks = [];

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
