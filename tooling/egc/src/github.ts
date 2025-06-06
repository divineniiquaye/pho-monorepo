import { Octokit, type RestEndpointMethodTypes } from "@octokit/rest";
import { create as createTar } from "tar";
import { v4 as uuidv4 } from "uuid";
import * as path from "node:path";
import fs from "fs-extra";

import { getTemporaryDirectory } from "./utils";
import { logger } from "./logger";

interface GithubProviderOptions {
    token: string;
    owner: string;
    repo: string;
    tagName: string;
    binaryPath: string;
}

export async function createReleaseAndUploadAsset({
    token,
    owner,
    repo,
    tagName,
    binaryPath,
}: GithubProviderOptions) {
    const octokit = new Octokit({ auth: token });

    try {
        let releaseId: number;

        const commitSha = await getBranchShaWithFallback(octokit, owner, repo);
        logger.success(`Found commit SHA: ${commitSha.substring(0, 7)}`);

        const { exists } = await ensureAnnotatedTag(octokit, {
            owner,
            repo,
            tag: tagName,
            message: tagName,
            object: commitSha,
            type: "commit",
        });
        logger.success(`Tag ${exists ? "already exists" : "created successfully"}`);

        if (exists) {
            const existingRelease = await octokit.rest.repos.getReleaseByTag({
                owner,
                repo,
                tag: tagName,
            });
            releaseId = existingRelease.data.id;
            logger.success(`Found existing release with ID: ${releaseId}`);
        } else {
            const newRelease = await octokit.rest.repos.createRelease({
                owner,
                repo,
                tag_name: tagName,
                name: tagName,
                draft: false,
                prerelease: true,
            });
            releaseId = newRelease.data.id;
            logger.success(`Created new release with ID: ${releaseId}`);
        }

        const result = await uploadReleaseAsset(octokit, {
            owner,
            repo,
            releaseId,
            binaryPath,
        });
        logger.succeedSpinner("Asset uploaded successfully");

        return result.data.browser_download_url;
    } catch (error) {
        logger.error("GitHub release failed", error);
        throw new Error(
            `GitHub release failed: ${error instanceof Error ? error.message : String(error)}`,
        );
    }
}

async function getBranchShaWithFallback(
    octokit: Octokit,
    owner: string,
    repo: string,
): Promise<string> {
    const branchesToTry = ["main", "master"];

    for (const branchName of branchesToTry) {
        try {
            const { data } = await octokit.rest.repos.getBranch({
                owner,
                repo,
                branch: branchName,
            });
            return data.commit.sha;
        } catch (error) {
            if (error instanceof Error && error.message.includes("Branch not found")) {
                if (branchName === "master") throw new Error("No valid branch found");
                continue;
            }
            throw error;
        }
    }
    throw new Error("Branch fallback exhausted");
}
async function ensureAnnotatedTag(
    octokit: Octokit,
    params: RestEndpointMethodTypes["git"]["createTag"]["parameters"],
): Promise<{ sha: string; exists: boolean }> {
    const { owner, repo, tag } = params;
    const refName = `refs/tags/${tag}`;

    try {
        const { data: existingRef } = await octokit.rest.git.getRef({
            owner,
            repo,
            ref: `tags/${tag}`,
        });
        return { sha: existingRef.object.sha, exists: true };
    } catch (err: any) {
        if (err.status !== 404) {
            throw err;
        }
    }

    // Create the annotated tag object
    const { data: tagData } = await octokit.rest.git.createTag(params);

    // Create the tag reference pointing to the tag object
    await octokit.rest.git.createRef({
        owner,
        repo,
        ref: refName,
        sha: tagData.sha,
    });
    return { sha: tagData.sha, exists: false };
}

async function uploadReleaseAsset(
    octokit: Octokit,
    params: {
        owner: string;
        repo: string;
        releaseId: number;
        binaryPath: string;
    },
) {
    let filePath = params.binaryPath;
    let name = path.basename(filePath);

    if ((await fs.stat(filePath)).isDirectory()) {
        logger.info("Asset is a directory, creating tarball");
        await fs.mkdirp(getTemporaryDirectory());
        const tarPath = path.join(getTemporaryDirectory(), `${uuidv4()}.tar.gz`);
        const parentPath = path.dirname(filePath);

        await createTar({ cwd: parentPath, file: tarPath, gzip: true }, [name]);
        logger.success(`Tarball created at ${path.basename(tarPath)}`);

        filePath = tarPath;
        name = `${name}.tar.gz`;
    }

    logger.startSpinner("Reading file data for upload");
    const fileData = await fs.readFile(filePath);
    logger.updateSpinner(
        `Uploading ${name} (${(fileData.length / 1024 / 1024).toFixed(2)} MB)`,
    );

    return octokit.rest.repos.uploadReleaseAsset({
        owner: params.owner,
        repo: params.repo,
        release_id: params.releaseId,
        name,
        data: fileData as unknown as string, // Type workaround for binary data
        headers: {
            "content-type": "application/octet-stream",
            "content-length": fileData.length.toString(),
        },
    });
}

export async function getReleaseAssetsByTag({
    token,
    owner,
    repo,
    tag,
}: {
    token: string;
    owner: string;
    repo: string;
    tag: string;
}) {
    const octokit = new Octokit({ auth: token });
    try {
        const release = await octokit.rest.repos.getReleaseByTag({
            owner,
            repo,
            tag,
        });
        return release.data.assets;
    } catch (error: any) {
        // For 404 errors (release not found), don't log an error - this is expected when no cache exists
        if (error.status === 404) {
            throw new Error(`No release found with tag ${tag}`);
        }
        // For other errors, log them as they might indicate actual issues
        logger.error(`Error accessing GitHub release for tag ${tag}`, error);
        throw error;
    }
}
