import spawnAsync from "@expo/spawn-async";
import { pipeline } from "stream/promises";
import { v4 as uuidv4 } from "uuid";
import * as path from "node:path";
import fetch from "node-fetch";
import { extract } from "tar";
import glob from "fast-glob";
import fs from "fs-extra";

import { getGitHubToken, getTemporaryDirectory } from "./utils";
import { logger } from "./logger";

async function downloadFileAsync(url: string, outputPath: string): Promise<void> {
    try {
        logger.info(`Downloading from URL: ${url}`);

        let isGitHubApiUrl = false;
        try {
            const parsedUrl = new URL(url);
            isGitHubApiUrl = parsedUrl.hostname === "api.github.com";
        } catch {
            // Invalid URL format, treat as non-GitHub
            isGitHubApiUrl = false;
        }

        const githubToken = getGitHubToken();
        const headers: Record<string, string> = {
            Accept: "application/octet-stream",
        };

        if (githubToken) {
            headers.Authorization = isGitHubApiUrl
                ? `token ${githubToken}`
                : `Bearer ${githubToken}`;
        }

        const response = await fetch(url, { headers });

        if (!response.ok || !response.body) {
            throw new Error(
                `Failed to download file from ${url}, because ${response.status} ${response.statusText}`,
            );
        }

        const contentLength = Number.parseInt(
            response.headers.get("content-length") || "0",
            10,
        );

        logger.startSpinner("Downloading file");

        if (contentLength > 0) {
            let receivedBytes = 0;
            const downloadStream = response.body;

            downloadStream.on("data", (chunk) => {
                receivedBytes += chunk.length;
                const downloadedMB = Math.floor(receivedBytes / 1024 / 1024);
                const totalMB = Math.floor(contentLength / 1024 / 1024);
                logger.updateSpinner(`Downloading ${downloadedMB}MB / ${totalMB}MB`);
            });

            await pipeline(downloadStream, fs.createWriteStream(outputPath));
        } else {
            await pipeline(response.body, fs.createWriteStream(outputPath));
        }

        logger.updateSpinner("Download complete");
    } catch (error: any) {
        if (await fs.pathExists(outputPath)) {
            await fs.remove(outputPath);
        }
        throw error;
    }
}

async function maybeCacheAppAsync(
    appPath: string,
    cachedAppPath?: string,
): Promise<string> {
    if (cachedAppPath) {
        await fs.ensureDir(path.dirname(cachedAppPath));
        await fs.move(appPath, cachedAppPath);
        logger.success("App cached successfully for future use");
        return cachedAppPath;
    }
    return appPath;
}

export async function downloadAndMaybeExtractAppAsync(
    url: string,
    platform: "ios" | "android",
    cachedAppPath?: string,
): Promise<string> {
    const outputDir = path.join(getTemporaryDirectory(), uuidv4());
    await fs.promises.mkdir(outputDir, { recursive: true });

    if (url.endsWith("apk")) {
        const apkFilePath = path.join(outputDir, `${uuidv4()}.apk`);
        await downloadFileAsync(url, apkFilePath);
        logger.succeedSpinner("Successfully downloaded app");

        return await maybeCacheAppAsync(apkFilePath, cachedAppPath);
    }

    const tmpArchivePathDir = path.join(getTemporaryDirectory(), uuidv4());
    const tmpArchivePath = path.join(tmpArchivePathDir, `${uuidv4()}.tar.gz`);
    await fs.mkdir(tmpArchivePathDir, { recursive: true });

    await downloadFileAsync(url, tmpArchivePath);
    logger.succeedSpinner("Successfully downloaded app archive");
    await tarExtractAsync(tmpArchivePath, outputDir);

    return await maybeCacheAppAsync(
        await getAppPathAsync(outputDir, platform === "ios" ? "app" : "apk"),
        cachedAppPath,
    );
}

export async function extractAppFromLocalArchiveAsync(
    appArchivePath: string,
    platform: "ios" | "android",
): Promise<string> {
    const outputDir = path.join(getTemporaryDirectory(), uuidv4());
    await fs.promises.mkdir(outputDir, { recursive: true });

    logger.info(`Extracting ${platform} app from local archive`);
    await tarExtractAsync(appArchivePath, outputDir);

    return await getAppPathAsync(outputDir, platform === "android" ? "apk" : "app");
}

async function getAppPathAsync(
    outputDir: string,
    applicationExtension: string,
): Promise<string> {
    const appFilePaths = await glob(`./**/*.${applicationExtension}`, {
        cwd: outputDir,
        onlyFiles: false,
    });

    if (appFilePaths.length === 0) {
        throw Error("Did not find any installable apps inside tarball.");
    }

    return path.join(outputDir, appFilePaths[0]);
}

async function tarExtractAsync(input: string, output: string): Promise<void> {
    try {
        if (process.platform !== "win32") {
            await spawnAsync("tar", ["-xf", input, "-C", output], {
                stdio: "inherit",
            });
            return;
        }
    } catch (error: any) {
        logger.warn(
            `Failed to extract tar using native tools, falling back on JS tar module. ${error.message}`,
        );
    }

    // tar node module has previously had problems with big files, and seems to
    // be slower, so only use it as a backup.
    logger.info(`Extracting ${path.basename(input)} using JS tar module`);
    await extract({ file: input, cwd: output });
}
