// https://nextjs.org/docs/pages/building-your-application/configuring/eslint

import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
    // import.meta.dirname is available after Node.js v20.11.0
    baseDirectory: import.meta.dirname,
});

/** @type {import('eslint').Linter.Config[]} */
export default [
    ...compat.config({
        extends: ["next"],
        settings: {
            next: {
                rootDir: "apps/web/",
            },
        },
    }),
];
