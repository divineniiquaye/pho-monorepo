import {
    BuildCacheProviderPlugin,
    ResolveBuildCacheProps,
    RunOptions,
    UploadBuildCacheProps,
} from "@expo/config";
import fs from "fs-extra";
import * as path from "node:path";

import { isDevClientBuild, getBuildCacheDirectory, getGitHubToken } from "./utils";
import { getReleaseAssetsByTag, createReleaseAndUploadAsset } from "./github";
import { downloadAndMaybeExtractAppAsync } from "./download";
import { logger } from "./logger";

export async function resolveGitHubRemoteBuildCache(
    { projectRoot, platform, fingerprintHash, runOptions }: ResolveBuildCacheProps,
    { owner, repo }: { owner: string; repo: string },
): Promise<string | null> {
    if (!runOptions.buildCache) {
        logger.info("Build cache is disabled, skipping download");
        return null;
    }

    const cachedAppPath = getCachedAppPath({
        fingerprintHash,
        platform,
        projectRoot,
        runOptions,
    });

    if (fs.existsSync(cachedAppPath)) {
        logger.success("Cached build found, skipping download");
        return cachedAppPath;
    }

    try {
        const githubToken = getGitHubToken();
        if (!githubToken) return null;
        const tag = getTagName({
            fingerprintHash,
            projectRoot,
            runOptions,
            platform,
        });

        const assets = await getReleaseAssetsByTag({
            token: githubToken,
            owner,
            repo,
            tag,
        });

        if (!assets || assets.length === 0) {
            logger.warn("No assets found for this fingerprint");
            return null;
        }

        // Use the API URL (url) instead of browser_download_url for GitHub API downloads
        const buildDownloadURL = assets[0].url;
        if (!buildDownloadURL) {
            logger.warn("Asset URL not found in the release");
            return null;
        }

        logger.info(
            `Build with matching fingerprint found, name: ${assets[0].name}, size: ${Math.round((assets[0].size || 0) / 1024 / 1024)}MB`,
        );

        try {
            const result = await downloadAndMaybeExtractAppAsync(
                buildDownloadURL,
                platform,
                cachedAppPath,
            );
            if (result) {
                return result;
            }
            logger.warn("Download completed but no valid app was extracted");
        } catch (downloadError) {
            logger.error("Failed to download or extract the app", downloadError);
        }
    } catch (error) {
        if (error instanceof Error && error.message.includes("No release found")) {
            // This is an expected case when no cache exists, don't show stacktrace
            logger.error("No cached builds available for this fingerprint");
        } else {
            // For unexpected errors, show more details
            logger.error("Cache retrieval failed:", error);
        }
    }

    return null;
}

export async function uploadGitHubRemoteBuildCache(
    {
        projectRoot,
        fingerprintHash,
        runOptions,
        buildPath,
        platform,
    }: UploadBuildCacheProps,
    { owner, repo }: { owner: string; repo: string },
): Promise<string | null> {
    logger.info("Uploading build to Github Releases");

    try {
        const githubToken = getGitHubToken();
        if (!githubToken) return null;
        const tagName = getTagName({
            fingerprintHash,
            projectRoot,
            runOptions,
            platform,
        });

        const result = await createReleaseAndUploadAsset({
            token: githubToken,
            owner,
            repo,
            tagName,
            binaryPath: buildPath,
        });
        logger.success("Build successfully uploaded to GitHub Releases");
        return result;
    } catch (error) {
        logger.error("Release failed", error);
    }

    return null;
}

function getTagName({
    fingerprintHash,
    projectRoot,
    runOptions,
    platform,
}: {
    fingerprintHash: string;
    projectRoot: string;
    runOptions: RunOptions;
    platform: "ios" | "android";
}): string {
    const isDevClient = isDevClientBuild({ projectRoot, runOptions });
    return `fingerprint.${fingerprintHash}${isDevClient ? ".dev-client" : ""}.${platform}`;
}

function getCachedAppPath({
    fingerprintHash,
    platform,
    projectRoot,
    runOptions,
}: {
    fingerprintHash: string;
    projectRoot: string;
    runOptions: RunOptions;
    platform: "ios" | "android";
}): string {
    return path.join(
        getBuildCacheDirectory(),
        `${getTagName({ fingerprintHash, projectRoot, runOptions, platform })}.${platform === "ios" ? "app" : "apk"}`,
    );
}

const providerPlugin: BuildCacheProviderPlugin = {
    resolveBuildCache: resolveGitHubRemoteBuildCache,
    uploadBuildCache: uploadGitHubRemoteBuildCache,
};

export default providerPlugin;
