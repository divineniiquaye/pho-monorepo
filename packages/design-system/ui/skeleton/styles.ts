import { cva } from "class-variance-authority";

export const skeletonStyle = cva("bg-secondary dark:bg-muted", {
    variants: {
        variant: {
            sharp: "rounded-none",
            circular: "rounded-full",
            rounded: "rounded-md",
        },
        speed: {
            1: "duration-75",
            2: "duration-100",
            3: "duration-150",
            4: "duration-200",
        },
    },
});
export const skeletonTextStyle = cva("rounded-sm w-full", {
    variants: {
        speed: {
            1: "duration-75",
            2: "duration-100",
            3: "duration-150",
            4: "duration-200",
        },
        gap: {
            1: "gap-1",
            2: "gap-2",
            3: "gap-3",
            4: "gap-4",
        },
    },
});
