import { getPackageJson, ResolveBuildCacheProps } from "@expo/config";
import { execSync } from "node:child_process";
import * as path from "node:path";
import os from "node:os";

import { logger } from "./logger";

/**
 * Determines if the current build is a development client build
 */
export function isDevClientBuild({
    runOptions,
    projectRoot,
}: {
    runOptions: ResolveBuildCacheProps["runOptions"];
    projectRoot: string;
}): boolean {
    if (!detectDevClientDependency(projectRoot)) {
        return false;
    }

    if ("variant" in runOptions && runOptions.variant !== undefined) {
        return runOptions.variant === "debug";
    }
    if ("configuration" in runOptions && runOptions.configuration !== undefined) {
        return runOptions.configuration === "Debug";
    }

    return true;
}

/**
 * Checks if the project has expo-dev-client as a direct dependency
 */
export function detectDevClientDependency(projectRoot: string): boolean {
    const { dependencies = {}, devDependencies = {} } = getPackageJson(projectRoot);
    return !!dependencies["expo-dev-client"] || !!devDependencies["expo-dev-client"];
}

/**
 * Returns the application temporary directory path
 */
export function getTemporaryDirectory(): string {
    const name = "github-build-cache-provider";
    const tmpdir = os.tmpdir();
    switch (process.platform) {
        case "darwin":
        case "win32":
            return path.join(tmpdir, name);
        default:
            const username = path.basename(os.homedir());
            return path.join(tmpdir, username, name);
    }
}

/**
 * Returns the path for storing build cache files
 */
export function getBuildCacheDirectory(): string {
    return path.join(getTemporaryDirectory(), "build-run-cache");
}

/**
 * Get the GitHub token from environment variable or GitHub CLI
 */
export function getGitHubToken(): string | undefined {
    // First check environment variable
    const githubToken = process.env.GITHUB_TOKEN;
    if (githubToken) return githubToken;

    try {
        try {
            // Try to get token from gh CLI
            const token = execSync("gh auth token", { encoding: "utf8" }).trim();

            if (token === "no oauth token found for github.com") {
                logger.error(
                    "Please run 'gh auth login' to authenticate with GitHub CLI",
                );
                return undefined;
            }

            return token.trimEnd();
        } catch (error) {
            logger.error("Please run 'gh auth login' to authenticate with GitHub CLI");
            return undefined;
        }
    } catch (error) {
        // gh CLI not installed
        logger.error(
            "Please either:\n" +
                "1. Export GITHUB_TOKEN environment variable, or\n" +
                "2. Install GitHub CLI from https://cli.github.com and run 'gh auth login'",
        );
        return undefined;
    }
}
