import { exec, type ChildProcess } from "node:child_process";
import path from "node:path";

let buildProcess: ChildProcess | null = null;

afterAll(() => {
    if (buildProcess?.pid) {
        try {
            process.kill(buildProcess.pid, 0); // Check if process exists
            process.kill(buildProcess.pid); // Kill the process if it exists
        } catch (error) {
            // Process doesn't exist or we don't have permission to kill it
            console.info("Process already terminated or cannot be killed.");
        }
    }
});

test("Next.js build completes", async () => {
    try {
        buildProcess = exec("pnpm build", {
            env: { ...process.env, NODE_ENV: "production" },
            cwd: path.resolve(__dirname, ".."),
        });

        const buildOutput = new Promise<string>((resolve, reject) => {
            let output = "";
            buildProcess?.stdout?.on("data", (data) => {
                output += data.toString();
            });
            buildProcess?.stderr?.on("data", (data) => {
                output += data.toString();
            });
            buildProcess?.on("close", (code) => {
                resolve(output);
                if (code === 0) {
                } else {
                    reject(new Error(`Build process exited with code ${code}`));
                }
            });
        });

        const result = await buildOutput;

        // Check for Next.js version and build process
        expect(result).toContain("Next.js 15");
        expect(result).toContain("Creating an optimized production build");

        // Check for route information
        expect(result).toContain("Route (app)");
        expect(result).toContain("First Load JS shared by all");

        // Check for specific route patterns
        expect(result).toContain("○ /");
        expect(result).toContain("○ /_not-found");
        expect(result).toContain("○ /robots.txt");
        expect(result).toContain("○ /sitemap.xml");

        // Check for chunk information
        expect(result).toContain("other shared chunks (total)");

        // Check for static route indicator
        expect(result).toContain("○  (Static)  prerendered as static content");
    } finally {
        // The process kill check has been moved to the afterAll block
    }
}, 90_000);
