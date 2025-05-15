#!/usr/bin/env node

/**
 * This script is used to increment the build number in scripts/env.js.
 * Before running this script, make sure your BUILD_NUMBER is up to date.
 */

const fs = require("fs");
const path = require("path");

// eslint-disable-next-line no-undef
const ENV_FILE = path.join(__dirname, "../app.config.ts");

// Read the contents of scripts/env.js
fs.readFile(ENV_FILE, "utf8", (err, data) => {
    if (err) {
        console.error("Error reading file:", err);
        return;
    }

    // Regular expression to find and extract BUILD_NUMBER
    const regex = /const\s+BUILD_NUMBER\s*=\s*"(\d+)"\s*;/;
    const args = process.argv.slice(2);

    // If the --force flag is passed, we will always increment the build number
    const match =
        args.includes("--force") || "true" !== process?.env?.CI
            ? data.match(regex)
            : null;

    if (match) {
        const newBuildNumber = (parseInt(match[1]) + 1).toString();

        // Replace the old BUILD_NUMBER with the new one
        const updatedData = data.replace(
            regex,
            `const BUILD_NUMBER = "${newBuildNumber}";`,
        );

        // Write the updated content back to the file
        fs.writeFile(ENV_FILE, updatedData, "utf8", (err) => {
            if (err) {
                console.error("Error writing file:", err);
                return;
            }
            console.log("Build number incremented successfully.");
        });
    } else console.log("Running on CI, build number already incremented.");
});
