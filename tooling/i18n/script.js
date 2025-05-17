#!/usr/bin/env node

import { glob, globSync } from "glob";
import chokidar from "chokidar";
import path from "node:path";
import fs from "fs-extra";

// Path to the package.json file
const packageJsonPath = path.join(import.meta.dirname, "../../package.json");

// Enhanced regex pattern to match:
// - t('key')
// - t("key", {...}) where {...} optional and/or can span multiple lines
const extractKeys =
    /i18n\.t\(\s*(?:.*?\s*\?\s*(['"])((?:\\.|(?!\1).)*)\1\s*:\s*(['"])((?:\\.|(?!\3).)*)\3|(['"])((?:\\.|(?!\5).)*)\5)\s*(?:,\s*\{\s*defaultValue:\s*(['"])((?:\\.|(?!\7).)*)\7)?\s*\)?/g;

/**
 * Loads and parses a JSON file
 * @param {string} filePath - Path to JSON file
 * @returns {Object} Parsed JSON data
 */
function loadJSON(filePath) {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

/**
 * Saves data to a JSON file
 * @param {string} filePath - Path to save JSON file
 * @param {Object} data - Data to save
 */
function saveJSON(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

/**
 * Check & resolve empty translations
 * @param {Object} translations - Translations to check
 * @param {string[] | undefined} localeKeys - keys to check against
 * @returns {Object | string[]} Resolved translations or missing keys
 */
function resolveEmptyTranslations(translations, localeKeys) {
    if (!!localeKeys) {
        return Object.fromEntries(
            Object.entries(translations)
                .filter(([k]) => localeKeys.includes(k))
                .map(([k, v]) => {
                    return [
                        k,
                        typeof v === "object" && v?.constructor === Object
                            ? resolveEmptyTranslations(v, Object.keys(v))
                            : "",
                    ];
                }),
        );
    }

    return Object.entries(translations).filter(([k, v]) =>
        typeof v === "object" && v?.constructor === Object
            ? resolveEmptyTranslations(v)
            : "" === v,
    );
}

/**
 * Scans files and generates translations
 * @param {string} outputDir - Output directory path
 * @param {string[]} extra - Extra paths to scan
 * @param {boolean} watchMode - Whether to watch for file changes
 * @returns {Promise<string>} Path to output file
 */
async function scanAndGenerateTranslations(outputDir, extra, watchMode) {
    const outputFile = path.join(outputDir, "src/locales/en.json");
    /** @type {Object.<string, string>} */
    let translations = {};

    /**
     * Matches locale strings in a file
     * @param {string} file - Path to file
     */
    const matchLocale = (file) => {
        const content = fs.readFileSync(file, "utf-8");
        let match;

        while ((match = extractKeys.exec(content)) !== null) {
            [match[6] ?? match[4], match[2]].forEach((key) => {
                if (key && !translations[key]) {
                    const value = match[8] ?? key;
                    if (key.includes(".")) {
                        const parts = key.split(".");
                        let current = translations;
                        parts.forEach((part, index) => {
                            if (index === parts.length - 1) {
                                current[part] = value;
                            } else {
                                current[part] = current[part] || {};
                                current = current[part];
                            }
                        });
                    } else {
                        translations[key] = value;
                    }
                }
            });
        }
    };

    /** Sort and generate translations */
    const generateTranslations = async () => {
        const sortedTranslations = Object.keys(translations)
            .sort(
                (a, b) =>
                    a.length +
                    translations[a].length -
                    (b.length + translations[b].length),
            )
            .reduce((acc, key) => {
                acc[key] = translations[key];
                return acc;
            }, {});

        await fs.ensureDir(outputDir);
        await fs.writeFile(
            outputFile,
            `${JSON.stringify(sortedTranslations, null, 2)}\n`,
            "utf-8",
        );
    };

    if (watchMode) {
        const globPattern = [
            path.join(outputDir, "{app,src}/**/*.{js,ts,tsx}"),
            ...extra,
        ];
        const watcher = async (eventName, filePath) => {
            if (!["add", "addDir", "unlinkDir"].includes(eventName)) {
                console.count(`\rChecking ${path.relative("../../", filePath)} 🔍`);
            }

            translations = {}; // Reset translations
            globSync(globPattern).forEach(matchLocale);
            await generateTranslations();
        };
        chokidar
            .watch(await glob(globPattern), {
                persistent: true,
                interval: 1000,
            })
            .on("all", watcher);
    }

    return outputFile;
}

/**
 * Checks translations for completeness
 * @param {string} outputFile - Path to output file
 * @param {boolean} dryRun - Whether to run in dry run mode
 * @returns {boolean} Whether there are any errors
 */
function checkTranslations(outputFile, dryRun) {
    const englishTranslations = loadJSON(outputFile);
    const englishKeys = Object.keys(englishTranslations);
    const outputDir = path.dirname(outputFile);
    const hasErrors = {};

    fs.readdirSync(outputDir)
        .filter((file) => file.endsWith(".json") && file !== "en.json")
        .forEach((localeFile) => {
            const localeTranslations = loadJSON(path.join(outputDir, localeFile));
            const localeKeys = Object.keys(localeTranslations);

            // Check for missing translations
            const missingKeys = [...englishKeys].filter((k) => !localeKeys.includes(k));
            const emptyTranslations = resolveEmptyTranslations(localeTranslations);

            if (missingKeys.length > 0) {
                const groupedTranslations = {
                    ...resolveEmptyTranslations(englishTranslations, missingKeys),
                    ...localeTranslations,
                };
                if (!dryRun) {
                    saveJSON(
                        path.join(outputDir, localeFile),
                        Object.keys(groupedTranslations)
                            .sort(
                                (a, b) =>
                                    a.length +
                                    groupedTranslations[a].length -
                                    (b.length + groupedTranslations[b].length),
                            )
                            .reduce((acc, key) => {
                                acc[key] = groupedTranslations[key];
                                return acc;
                            }, {}),
                    );
                }
            }

            if (missingKeys.length > 0 || emptyTranslations.length > 0) {
                hasErrors[localeFile] =
                    `(${missingKeys.length}) untranslated keys has been resolved and (${emptyTranslations.length}) has empty values`;
            }
        });

    if (Object.keys(hasErrors).length > 0) {
        console.error(
            `\n🚨 Translation Issues found in ${path.relative("../../", outputDir)}`,
        );
        console.table(hasErrors);
        return true;
    }

    return false;
}

/**
 * Main function to handle different execution modes
 * @returns {Promise<void>}
 */
async function main() {
    const args = process.argv.slice(2);
    const packageJSON = loadJSON(packageJsonPath);
    const watchMode = args.includes("--watch");
    const localeSuccess = {};

    const localesDirs = packageJSON?.["i18n-config"]?.["paths"] ?? [];
    const extraIncludes =
        packageJSON["i18n-config"]["include"]?.map((p) =>
            path.join(import.meta.dirname, "../../", p, "**/*.{js,ts,tsx}"),
        ) ?? [];

    if (!Array.isArray(localesDirs)) {
        console.error("No i18n-config found in package.json or it is not an array.");
        return;
    }

    for (const localesDir of localesDirs) {
        const foundPath = path.join(import.meta.dirname, "../../", localesDir);
        const outputFile = await scanAndGenerateTranslations(
            foundPath,
            extraIncludes,
            watchMode,
        );

        if (!checkTranslations(outputFile, args.includes("--dry-run"))) {
            localeSuccess[localesDir] = "All translations are synced with en 🚀";
        }
    }

    if (Object.keys(localeSuccess).length > 0) {
        console.log("\n✅ Translations are complete!");
        console.table(localeSuccess);
    }

    if (watchMode) {
        console.log("\nWatching for file changes... 👀");
        process.stdin.resume(); // Keep process alive
    }
}

main().catch(console.error);
