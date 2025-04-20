import { registerSheet, type SheetDefinition } from "react-native-bottom-sheet-manager";

// Register all sheets in the modals folder
const sheets = require.context("./modals", true, /\.tsx$/);
sheets
    .keys()
    .forEach((key) =>
        registerSheet(key.replace(/^\.\/|\.tsx$/g, ""), sheets(key).default),
    );

declare module "react-native-bottom-sheet-manager" {
    interface Sheets {
        "example": SheetDefinition;
    }
}

export {};
