import { registerSheet, type SheetDefinition } from "@repo/bottom-sheet";

// Register all sheets in the modals folder
const sheets = require.context("./modals", true, /\.tsx$/);
sheets
    .keys()
    .forEach((key) =>
        registerSheet(key.replace(/^\.\/|\.tsx$/g, ""), sheets(key).default),
    );

declare module "@repo/bottom-sheet" {
    interface Sheets {
        example: SheetDefinition;
        drawer: SheetDefinition;
    }
}

export {};
