#!/usr/bin/env node

import { accessSync, constants } from "node:fs";
import { execSync } from "node:child_process";

const { log } = console;

/**
 * Add more tasks here in the same format:
 * {
 *     name: "task name",
 *     check: "path to check",
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
            accessSync(task.check, constants.R_OK);
        } catch (e) {
            log(`✗ Skipping task for: ${task.name}`);
            continue;
        }

        log(`[${task.name}]: ${task.description}`);
        try {
            execSync(task.command);
            log(`✓ Successfully completed: ${task.name}\n`);
        } catch (error) {
            log(`✗ Failed to run task for: ${task.name}\n`);
        }
    }
}

runPostinstallTasks().catch((error) => {
    log("✗ Fatal error:", error.message);
    process.exit(1);
});
