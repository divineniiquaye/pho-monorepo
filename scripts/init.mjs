#!/usr/bin/env node

import { copyFile, readFile, mkdir, rm } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { exec as execRaw } from "node:child_process";
import { readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { program } from "commander";
import {
    cancel,
    intro,
    isCancel,
    log,
    outro,
    select,
    spinner,
    text,
} from "@clack/prompts";

const url = "https://github.com/divineniiquaye/pho-monorepo";
const exec = promisify(execRaw);

// Using ESM, __dirname and __filename are not available.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Escapes special characters in filenames that would cause issues in bash commands
// Adds backslash before: () [] {} ^ $ * + ? . | and \
const cleanFileName = (file) => file.replace(/([()[\]{}^$*+?.|\\])/g, "\\$1");

const execSyncOpts = { stdio: "ignore" };
const internalContentDirs = ["_site"];
const internalContentFiles = [
    ".github/workflows/release.yml",
    ".github/workflows/site.yml",
    "/scripts/init.mjs",
    "CHANGELOG.md",
    "LICENSE",
    ".autorc",
];
const allInternalContent = [...internalContentDirs, ...internalContentFiles];
const supportedPackageManagers = ["npm", "yarn", "bun", "pnpm"];

/** ---- Utils Functions ---- */
const getName = async () => {
    const value = await text({
        message: "What is your project named?",
        placeholder: "my-app",
        validate(value) {
            if (value.length === 0) {
                return "Please enter a project name.";
            }
        },
    });

    if (isCancel(value)) {
        cancel("Operation cancelled.");
        process.exit(0);
    }

    return value.toString();
};

/** @returns {Promise<"npm" | "yarn" | "bun" | "pnpm">} */
const getPackageManager = async () => {
    const value = await select({
        message: "Which package manager would you like to use?",
        options: supportedPackageManagers.map((choice) => ({
            value: choice,
            label: choice,
        })),
        initialValue: "pnpm",
    });

    if (isCancel(value)) {
        cancel("Operation cancelled.");
        process.exit(0);
    }

    return value.toString();
};

/**
 * @param {string} label
 * @param {string[]} availableVersions
 * @param {string | undefined} initialValue
 * @returns {Promise<string>}
 */
const selectVersion = async (label, availableVersions, initialValue) => {
    const version = await select({
        message: `Select a version to update ${label}:`,
        options: availableVersions.map((v) => ({ value: v, label: `v${v}` })),
        initialValue,
        maxItems: 10,
    });

    if (isCancel(version)) {
        cancel("Operation cancelled.");
        process.exit(0);
    }

    return version.toString();
};

/**
 *
 * @param {string} cwd
 * @param {string} file
 * @param {string} type - eg. "overwrite", "delete"
 * @returns "yes" | "no" | "all" | "none"
 */
async function confirmAction(cwd, file, type) {
    const choice = await select({
        message: `\nDo you want to ${type} this file? (${relative(cwd, file)})`,
        options: [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
            { label: "Overwrite all files", value: "all" },
            { label: "Skip all files", value: "none" },
        ],
    });

    if (isCancel(choice)) {
        cancel("Operation cancelled.");
        process.exit(0);
    }

    return choice.toString();
}

/** @param {string} cwd  */
async function detectDefaultApps(cwd) {
    const appsDir = join(cwd, "apps");
    try {
        const result = readdirSync(appsDir, { withFileTypes: true })
            .filter((dirent) => dirent.isDirectory())
            .map((dirent) => dirent.name);

        return result.filter((app) => ["native", "web"].includes(app));
    } catch (error) {
        return [];
    }
}

/**
 * @param {string} name
 * @param {"npm" | "yarn" | "bun" | "pnpm"} packageManager
 * @returns {Promise<void>}
 */
const clonePhoMonorepo = async (name, packageManager) => {
    // const runCommand = { pnpm: "pnpm", npm: "npx", yarn: "yarn", bun: "bunx" };
    const command = [
        // `${runCommand[packageManager]} create`,
        "npx create-next-app@latest",
        name,
        "--example",
        url,
        "--disable-git",
        "--skip-install",
        `--use-${packageManager}`,
    ];
    await exec(command.join(" "), execSyncOpts);
};

const deleteInternalContent = async () => {
    for (const folder of internalContentDirs) {
        await rm(folder, { recursive: true, force: true });
    }

    for (const file of internalContentFiles) {
        await rm(file, { force: true });
    }
};

const initializeGit = async () => {
    await exec("git init", execSyncOpts);
    await exec("git add .", execSyncOpts);
    await exec('git commit -m "✨ Initial commit"', execSyncOpts);
};

/**
 * @param {string} projectDir
 * @param {"npm" | "yarn" | "bun" | "pnpm"} packageManager
 * @returns {Promise<void>}
 */
const updatePackageManagerConfiguration = async (projectDir, packageManager) => {
    const packageJsonPath = join(projectDir, "package.json");
    const packageJsonFile = await readFile(packageJsonPath, "utf8");
    const packageJson = JSON.parse(packageJsonFile);

    // Add workspaces to package.json
    packageManager.workspaces = ["apps/*", "packages/*", "tooling/*"];

    if (packageManager === "bun") {
        packageJson.packageManager = "bun@1.1.43";
    } else if (packageManager === "npm") {
        packageJson.packageManager = "npm@10.8.1";
    } else if (packageManager === "yarn") {
        packageJson.packageManager = "yarn@1.22.22";
    }

    const newPackageJson = JSON.stringify(packageJson, null, 2);

    await writeFile(packageJsonPath, `${newPackageJson}\n`);
    await rm("pnpm-lock.yaml", { force: true });
    await rm("pnpm-workspace.yaml", { force: true });
};

/** @param {string} path */
const updateInternalPackageDependencies = async (path) => {
    const pkgJsonFile = await readFile(path, "utf8");
    const pkgJson = JSON.parse(pkgJsonFile);

    if (pkgJson.dependencies) {
        // Update dependencies
        const entries = Object.entries(pkgJson.dependencies);

        for (const [dep, version] of entries) {
            if (version === "workspace:*") {
                pkgJson.dependencies[dep] = "*";
            }
        }
    }

    if (pkgJson.devDependencies) {
        // Update devDependencies
        const entries = Object.entries(pkgJson.devDependencies);

        for (const [dep, version] of entries) {
            if (version === "workspace:*") {
                pkgJson.devDependencies[dep] = "*";
            }
        }
    }

    const newPkgJson = JSON.stringify(pkgJson, null, 2);

    await writeFile(path, `${newPkgJson}\n`);
};

/** @returns {Promise<string[]>} */
export const getAvailableVersions = async () => {
    const changelog = await readFile(join(__dirname, "../CHANGELOG.md"), "utf-8");
    const versionRegex = /# v(\d+\.\d+\.\d+)/g;
    const matches = [...changelog.matchAll(versionRegex)];

    return matches
        .map((match) => match[1])
        .sort((a, b) => {
            const [aMajor, aMinor, aPatch] = a.split(".").map(Number);
            const [bMajor, bMinor, bPatch] = b.split(".").map(Number);
            if (aMajor !== bMajor) {
                return bMajor - aMajor;
            }
            if (aMinor !== bMinor) {
                return bMinor - aMinor;
            }
            return bPatch - aPatch;
        });
};

/**
 * @param {string} cwd
 * @returns {Promise<string | undefined>}
 */
const getCurrentVersion = async (cwd) => {
    const packageJsonPath = join(cwd, "package.json");
    const packageJsonContents = await readFile(packageJsonPath, "utf-8");
    const packageJson = JSON.parse(packageJsonContents);

    return packageJson?.pho;
};
/**
 *
 * @param {string} a
 * @param {string} b
 */
const compareVersions = (a, b) => {
    const [aMajor, aMinor, aPatch] = a.split(".").map(Number);
    const [bMajor, bMinor, bPatch] = b.split(".").map(Number);
    if (aMajor !== bMajor) {
        return aMajor - bMajor;
    }
    if (aMinor !== bMinor) {
        return aMinor - bMinor;
    }
    return aPatch - bPatch;
};

/** @param {string} projectDir */
const updateInternalDependencies = async (projectDir) => {
    const rootPackageJsonPath = join(projectDir, "package.json");
    await updateInternalPackageDependencies(rootPackageJsonPath);

    const workspaceDirs = ["apps", "packages", "tooling"];

    for (const dir of workspaceDirs) {
        const dirPath = join(projectDir, dir);
        const packages = await readdir(dirPath);

        for (const pkg of packages) {
            const path = join(dirPath, pkg, "package.json");
            await updateInternalPackageDependencies(path);
        }
    }
};

/**
 * @param {string} cwd
 * @param {string} name
 */
const createTemporaryDirectory = async (cwd, name) => {
    const tempDir = join(cwd, name);

    await rm(tempDir, { recursive: true, force: true });
    await mkdir(tempDir, { recursive: true });
    return tempDir;
};

/** @param {string} version */
const getFiles = async (version) => {
    await exec(`git checkout ${version}`);

    const response = await exec("git ls-files");
    return response.stdout.toString().trim().split("\n");
};

/**
 * @param {string} cwd
 * @param {{ version: string; files: string[] }} from
 * @param {{ version: string; files: string[] }} to
 * @returns {Promise<string[]>}
 */
const getDiff = async (cwd, from, to) => {
    const filesToUpdate = [];
    const apps = await detectDefaultApps(cwd);

    for (const file of to.files) {
        // Skip internal content that is meant to be deleted during init
        if (allInternalContent.some((ic) => file.startsWith(ic))) {
            continue;
        }

        // Skip default apps files if not found
        if (apps.some((app) => file.includes(`apps/${app}`))) {
            continue;
        }

        const hasChanged =
            !from.files.includes(file) ||
            (
                await exec(
                    `git diff ${from.version} ${to.version} -- "${cleanFileName(file)}"`,
                    { maxBuffer: 1024 * 1024 * 1024 },
                )
            )
                .toString()
                .trim() !== "";

        if (hasChanged) {
            filesToUpdate.push(file);
        }
    }

    return filesToUpdate;
};

/**
 * @param {string} cwd
 * @param {string} tempDir
 * @param {string[]} files
 * @param {boolean} forced
 */
const updateFiles = async (cwd, tempDir, files, forced) => {
    let globalChoice = null;

    for (const file of files) {
        const sourcePath = join(tempDir, file);
        const destPath = join(cwd, file);

        if (!forced && existsSync(destPath)) {
            if (false === globalChoice) continue;
            else if (null === globalChoice) {
                const choice = await confirmAction(cwd, file, "overwrite");
                if ("all" === choice) globalChoice = true;
                else if ("none" === choice) {
                    globalChoice = false;
                    continue;
                } else if ("no" === choice) continue;
            }
        } else {
            // Ensure destination directory exists
            await mkdir(dirname(destPath), { recursive: true });
        }

        await copyFile(sourcePath, destPath);
    }
};

/**
 * @param {string} cwd
 * @param {string[]} files
 * @param {boolean} forced
 */
const deletedFiles = async (cwd, files, forced) => {
    const apps = await detectDefaultApps(cwd);
    let globalChoice = null;

    for (const file of files) {
        // Skip internal content that is meant to be deleted during init
        if (allInternalContent.some((ic) => file.startsWith(ic))) {
            continue;
        }

        // Skip default apps files if not found
        if (apps.some((app) => file.includes(`apps/${app}`))) {
            continue;
        }

        if (!forced) {
            if (false === globalChoice) continue;
            else if (null === globalChoice) {
                const choice = await confirmAction(cwd, file, "delete");
                if ("all" === choice) globalChoice = true;
                else if ("none" === choice) {
                    globalChoice = false;
                    continue;
                } else if ("no" === choice) continue;
            }
        }

        const filePath = join(cwd, file);
        if (existsSync(filePath)) await rm(filePath, { force: true });
    }
};

program
    .command("init [name]")
    .description("Initialize a new php-monorepo project")
    .option("--skip-install", "Skip installing dependencies", false)
    .option("--disable-git", "Disable git initialization", false)
    .option(
        "-p, --package-manager <manager>",
        "Package manager to use (npm, yarn, bun, pnpm)",
    )
    .action(async (projectName, options) => {
        try {
            intro("Let's start a pho-monorepo project!");

            const cwd = process.cwd();
            const name = projectName || (await getName());
            const packageManager = options.packageManager || (await getPackageManager());

            if (!supportedPackageManagers.includes(packageManager)) {
                throw new Error("Invalid package manager");
            }

            const s = spinner();
            const projectDir = join(cwd, name);

            s.start("Cloning pho-monorepo...");
            await clonePhoMonorepo(name, packageManager);

            s.message("Moving into repository...");
            process.chdir(projectDir);

            if (packageManager !== "pnpm") {
                s.message("Updating package manager configuration...");
                await updatePackageManagerConfiguration(projectDir, packageManager);

                s.message("Updating workspace dependencies...");
                await updateInternalDependencies(projectDir);
            }

            s.message("Deleting internal content...");
            await deleteInternalContent();

            if (!options.skipInstall) {
                s.message("Installing dependencies...");
                const suffix = packageManager === "npm" ? "--force" : "";
                await exec(`${packageManager} install ${suffix}`, execSyncOpts);
                await exec(`${packageManager} remove @clack/prompts`);
            }

            if (!options.disableGit) {
                s.message("Initializing Git repository...");
                await initializeGit();
            }

            s.stop("Project initialized successfully!");
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : `Failed to initialize project: ${error}`;

            log.error(message);
            process.exit(1);
        }
    });

program
    .command("update")
    .description("Update the project from one version to another")
    .option("--from <version>", "Version to update from e.g. 1.0.0")
    .option("--to <version>", "Version to update to e.g. 2.0.0")
    .option("--force", "Force update even if there are local changes and over", false)
    .action(async (options) => {
        try {
            intro("Let's update your pho-monorepo project!");

            const cwd = process.cwd();
            const availableVersions = await getAvailableVersions();
            let currentVersion = await getCurrentVersion(cwd);

            // Ditch the project version if it is not in the available versions
            if (currentVersion && !availableVersions.includes(currentVersion)) {
                currentVersion = undefined;
            }

            const fromVersion =
                options.from ||
                (await selectVersion("from", availableVersions, currentVersion));

            if (fromVersion === availableVersions[0]) {
                outro("You are already on the latest version!");
                return;
            }

            const upgradeableVersions = availableVersions.filter(
                (v) => compareVersions(v, fromVersion) > 0,
            );

            const from = `v${fromVersion}`;
            const to = `v${options.to || (await selectVersion("to", upgradeableVersions, upgradeableVersions[0]))}`;

            const s = spinner();
            s.start(`Preparing to update from ${from} to ${to}...`);

            s.message("Creating temporary directory...");
            const tempDir = await createTemporaryDirectory(cwd, "phox-update");

            s.message("Cloning pho-monorepo...");
            await exec("git --version");
            await exec(`git clone ${url} ${tempDir}`, execSyncOpts);

            s.message("Moving into repository...");
            process.chdir(tempDir);

            s.message(`Getting files from version ${from}...`);
            const fromFiles = await getFiles(from);

            s.message(`Getting files from version ${to}...`);
            const toFiles = await getFiles(to);

            s.message(`Computing diff between versions ${from} and ${to}...`);
            const diff = await getDiff(
                cwd,
                {
                    version: from,
                    files: fromFiles,
                },
                {
                    version: to,
                    files: toFiles,
                },
            );

            s.message("Moving back to original directory...");
            process.chdir(cwd);

            s.message(`Updating ${diff.length} files...`);
            await updateFiles(cwd, tempDir, diff, !!options.force);

            s.message("Cleaning up...");
            await deletedFiles(
                cwd,
                fromFiles.filter((file) => !toFiles.includes(file)),
                !!options.force,
            );

            await rm(tempDir, { recursive: true, force: true });
            s.stop(`Successfully updated project from ${from} to ${to}!`);
            outro("Please review and test the changes carefully.");
        } catch (error) {
            const message = error instanceof Error ? error.message : `${error}`;

            log.error(`Failed to update project: ${message}`);
            process.exit(1);
        }
    });

program.parse(process.argv);
