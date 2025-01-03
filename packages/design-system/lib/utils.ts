import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Extracts height values from Tailwind classes.
 * Handles standard Tailwind prefix classes (eg. h-12) and arbitrary values (eg: h-[2.6rem], h-[50px])
 */
export function parseClassPrefix<T extends string | number>(
    className: string,
    prefix: string = "h-",
    strict?: "string" | "number",
): T | null {
    const prefixIndex = className.indexOf(prefix);
    const spaceIndex = className.indexOf(" ", prefixIndex);
    const prefixClass =
        spaceIndex !== -1
            ? className.slice(prefixIndex, spaceIndex)
            : className.slice(prefixIndex);

    if (!prefixClass) return null;
    const value = prefixClass.slice(2);

    if (value.startsWith("[") && value.endsWith("]")) {
        const arbitraryValue = value.slice(1, -1);

        if (arbitraryValue.endsWith("rem")) {
            return (parseFloat(arbitraryValue) * 16) as T; // Convert rem to pixels (1rem = 16px)
        }
        if (arbitraryValue.endsWith("px")) {
            return parseFloat(arbitraryValue) as T;
        }
        if (strict === "number") {
            const arbitraryNumericValue = parseInt(arbitraryValue);
            if (isNaN(arbitraryNumericValue)) {
                throw new Error(`Invalid arbitrary value: ${arbitraryValue}`);
            }
            return arbitraryNumericValue as T;
        }
        return arbitraryValue as T;
    }

    const numericValue = parseInt(value);
    if (isNaN(numericValue)) {
        if (strict === "number") throw new Error(`Invalid numeric value: ${value}`);
        return value as T;
    }
    return numericValue as T;
}
