import Fuse, { type FuseOptionKey, type IFuseOptions } from "fuse.js";
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

/**
 * Parses a URL string into a path and query parameters object.
 * Query parameters are automatically converted to their appropriate types:
 * - "true"/"false" become boolean values
 * - numeric strings become numbers
 * - all other values remain strings
 *
 * @example
 * const [path, query] = parseCustomUrl('/users?id=123&active=true&name=john');
 * // Returns: ['/users', { id: 123, active: true, name: 'john' }]
 */
export function parseCustomUrl(
    input: string,
): [string, Record<string, string | number | boolean>] {
    const [path, queryString] = input.split("?");
    const query: Record<string, string | number | boolean> = {};

    if (queryString) {
        const pairs = queryString.split("&");
        for (const pair of pairs) {
            const [key, value] = pair.split("=");
            let parsedValue: string | number | boolean = value;

            if (value === "true") {
                parsedValue = true;
            } else if (value === "false") {
                parsedValue = false;
            } else if (!isNaN(Number(value))) {
                parsedValue = Number(value);
            }

            query[key] = parsedValue;
        }
    }

    return [path, query];
}

/**
 * Fuzzy search function for filtering data based on a search query.
 *
 * @example
 * ```tsx
 * const [search, setSearch] = React.useState("");
 * const data = [{ name: "John Doe", age: 45, "country": "Ghana" }, ...];
 *
 * const filteredData = fuzzSearch(search, data, ["name", "country"]);
 * ```
 *
 * For more information, see: https://www.fusejs.io/
 */
export function fuzzSearch<T>(
    filter: string = "",
    data: T[] = [],
    options?: IFuseOptions<T> | FuseOptionKey<T>[],
) {
    if (!options) return data;
    let fuse: Fuse<T> | undefined;

    if (!fuse) {
        fuse = new Fuse<T>(
            data,
            Array.isArray(options)
                ? {
                      shouldSort: true,
                      threshold: 0.3,
                      location: 0,
                      distance: 100,
                      minMatchCharLength: 1,
                      keys: options,
                  }
                : options,
        );
    }

    return filter ? fuse.search(filter) : data;
}
