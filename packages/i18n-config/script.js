#!/usr/bin/env node

const { glob, globSync } = require("glob");
const chokidar = require("chokidar");
const fs = require("fs-extra");
const path = require("path");

// Path to the package.json file
const packageJsonPath = path.join(__dirname, "../../package.json");

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

    const globPattern = [path.join(outputDir, "{app,src}/**/*.{js,ts,tsx}"), ...extra];

    if (watchMode) {
        const watcher = async (eventName, filePath) => {
            if (!["add", "addDir", "unlinkDir"].includes(eventName)) {
                console.log(`Checking ${path.relative("../../", filePath)} 🔍`);
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
 * Syncs translations across locale files
 * @param {string} outputFile - Path to output file
 */
function syncTranslations(outputFile) {
    const outputDir = path.dirname(outputFile);
    const keysInEnglish = new Set(Object.keys(loadJSON(outputFile)));

    const localeFiles = fs
        .readdirSync(outputDir)
        .filter((file) => file.endsWith(".json") && file !== "en.json");

    localeFiles.forEach((localeFile) => {
        const localePath = path.join(outputDir, localeFile);
        const localeTranslations = loadJSON(localePath);
        /** @type {Object.<string, string>} */
        const updatedTranslations = {};

        keysInEnglish.forEach((key) => {
            updatedTranslations[key] = localeTranslations.hasOwnProperty(key)
                ? localeTranslations[key]
                : "";
        });

        saveJSON(localePath, updatedTranslations);
        console.log(`Synced keys for locale: ${localeFile} 🌟`);
    });
}

/**
 * Checks translations for completeness
 * @param {string} outputFile - Path to output file
 * @returns {boolean} Whether there are any errors
 */
function checkTranslations(outputFile) {
    const outputDir = dirname(outputFile);
    const keysInEnglish = new Set(Object.keys(loadJSON(outputFile)));
    const localeFiles = fs
        .readdirSync(outputDir)
        .filter((file) => file.endsWith(".json") && file !== "en.json");

    let hasErrors = false;

    localeFiles.forEach((localeFile) => {
        const localeTranslations = loadJSON(path.join(outputDir, localeFile));
        const localeKeys = new Set(Object.keys(localeTranslations));

        // Check for missing translations
        const missingKeys = [...keysInEnglish].filter((key) => !localeKeys.has(key));
        const emptyTranslations = [...localeKeys].filter(
            (key) => localeKeys.has(key) && localeTranslations[key] === "",
        );

        if (missingKeys.length > 0 || emptyTranslations.length > 0) {
            hasErrors = true;
            console.error(`\n🚨 Issues found in ${localeFile}:`);

            if (missingKeys.length > 0) {
                console.error("Missing keys:", missingKeys);
            }

            if (emptyTranslations.length > 0) {
                console.error("Empty translations:", emptyTranslations);
            }
        }
    });

    return hasErrors;
}

/**
 * Main function to handle different execution modes
 * @returns {Promise<void>}
 */
async function main() {
    const args = process.argv.slice(2);
    const packageJSON = loadJSON(packageJsonPath);
    const watchMode = args.includes("--watch");

    const localesDirs = packageJSON?.["i18n-config"]?.["paths"] ?? [];
    const extraIncludes =
        packageJSON["i18n-config"]["include"]?.map((p) =>
            path.join(__dirname, "../../", p, "**/*.{js,ts,tsx}"),
        ) ?? [];

    if (!Array.isArray(localesDirs)) {
        console.error("No i18n-config found in package.json or it is not an array.");
        return;
    }

    for (const localesDir of localesDirs) {
        const foundPath = path.join(__dirname, "../../", localesDir);
        const outputFile = await scanAndGenerateTranslations(
            foundPath,
            extraIncludes,
            watchMode,
        );

        if (args.includes("--check")) {
            const hasErrors = checkTranslations(outputFile, foundPath);
            if (!hasErrors) {
                console.log(`All translations in ${localesDir} are complete! 🚀`);
            }
        } else if (args.includes("--resolve")) {
            syncTranslations(outputFile, foundPath);
            console.log(`Translation files in ${localesDir} synced successfully. ✅`);
        }
    }

    if (watchMode) {
        console.log("Watching for file changes... 👀");
        process.stdin.resume(); // Keep process alive
    }
}

main().catch(console.error);
