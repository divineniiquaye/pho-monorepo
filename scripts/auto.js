/* eslint-disable */
const { execPromise } = require("@auto-it/core");
const pkg = require("../package.json");
const fs = require("node:fs");

module.exports = class LintDocsPlugin {
    constructor() {
        this.name = "Updating Package Version";
    }

    /**
     * Setup the plugin
     *
     * @param {import('@auto-canary/core').default} auto
     */
    apply(auto) {
        auto.hooks.afterChangelog.tapPromise(this.name, async () => {
            pkg.pho = pkg.version;
            fs.writeFileSync("../package.json", JSON.stringify(pkg, null, 2) + "\\n");
            await execPromise("git", ["add", "."]);
        });
    }
};
