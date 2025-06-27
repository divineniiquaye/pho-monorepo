import { spawn, type ChildProcess } from "node:child_process";
import { promisify } from "node:util";
import treeKill from "tree-kill";
import path from "node:path";

const treeKillAsync = promisify(treeKill);

test("Expo dev server starts", async () => {
    let devProcess: ChildProcess | null = null;

    try {
        devProcess = spawn("pnpm", ["dev"], {
            env: { ...process.env, NODE_ENV: "development" },
            cwd: path.resolve(__dirname, ".."),
            stdio: "pipe",
            shell: true,
        });

        let output = "";
        devProcess.stdout?.on("data", (data) => {
            output += data.toString();
        });

        // Wait for the server to start (adjust timeout as needed)
        await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error("Timeout waiting for dev server to start"));
            }, 30_000);

            devProcess?.stdout?.on("data", (data) => {
                if (
                    data.toString().includes("Logs for your project will appear below.")
                ) {
                    clearTimeout(timeout);
                    resolve();
                }
            });
        });

        // Check for expected output
        expect(output).toContain("Starting Metro Bundler");
        expect(output).toContain("Logs for your project will appear below.");

        // Additional checks can be added here
    } finally {
        // Ensure the dev server is killed and wait for it to fully terminate
        if (devProcess?.pid) {
            try {
                await treeKillAsync(devProcess.pid);
            } catch (error) {
                console.error("Failed to kill process:", error);
            }
        }
    }
}, 60_000); // Increased timeout to account for both startup and shutdown
