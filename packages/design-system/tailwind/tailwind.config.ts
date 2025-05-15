import { hairlineWidth, platformSelect } from "nativewind/theme";
import defaultTheme from "tailwindcss/defaultTheme";

/**
 * This is a custom tailwind config that is used to style your application.
 * You can customize it to your liking or create a new one.
 * 
 * Example usage:
 * 
 * ```ts
 * import type { Config } from "tailwindcss";
 * import sharedConfig from "@repo/tailwind-config";
 * 
 * const config: Pick<Config, "content" | "important" | "darkMode"> = {
 *  content: ["./**\/*.tsx", "!./node_modules/**"],
 *  important: "html",
 *  darkMode: "class",
 *  ...sharedConfig,
 * };
 * 
 * export default config;
 * ```
 */
const config: Omit<import("tailwindcss").Config, "content"> = {
    plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                success: {
                    DEFAULT: "hsl(var(--success))",
                    foreground: "hsl(var(--success-foreground))",
                },
                warning: {
                    DEFAULT: "hsl(var(--warning))",
                    foreground: "hsl(var(--warning-foreground))",
                },
                brand: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                sidebar: {
                    DEFAULT: "hsl(var(--sidebar-background))",
                    foreground: "hsl(var(--sidebar-foreground))",
                    primary: "hsl(var(--sidebar-primary))",
                    "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
                    accent: "hsl(var(--sidebar-accent))",
                    "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
                    border: "hsl(var(--sidebar-border))",
                    ring: "hsl(var(--sidebar-ring))",
                },
                "kp-input": "hsl(var(--kp-input))",
            },
            borderWidth: {
                hairline: hairlineWidth(),
            },
            fontFamily: {
                sans: [
                    platformSelect({
                        ios: "NotoSans-Regular",
                        android: "NotoSans_400Regular",
                    }),
                    ...defaultTheme.fontFamily.sans,
                ],
                mono: [
                    platformSelect({
                        ios: "NotoSans-Regular",
                        android: "NotoSans_500Medium",
                    }),
                    ...defaultTheme.fontFamily.mono,
                ],
                ...platformSelect({
                    ios: {
                        "noto-sans-thin": "NotoSans-Thin",
                        "noto-sans-extra-light": "NotoSans-ExtraLight",
                        "noto-sans-light": "NotoSans-Light",
                        "noto-sans-medium": "NotoSans-Medium",
                        "noto-sans-semibold": "NotoSans-SemiBold",
                        "noto-sans-bold": "NotoSans-Bold",
                        "noto-sans-extra-bold": "NotoSans-ExtraBold",
                        "noto-sans-black": "NotoSans-Black",
                    },
                    android: {
                        "noto-sans-thin": "NotoSans_100Thin",
                        "noto-sans-extra-light": "NotoSans_200ExtraLight",
                        "noto-sans-light": "NotoSans_300Light",
                        "noto-sans-medium": "NotoSans_500Medium",
                        "noto-sans-semibold": "NotoSans_600SemiBold",
                        "noto-sans-bold": "NotoSans_700Bold",
                        "noto-sans-extra-bold": "NotoSans_800ExtraBold",
                        "noto-sans-black": "NotoSans_900Black",
                    },
                }),
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                "caret-blink": {
                    "0%,70%,100%": { opacity: "1" },
                    "20%,50%": { opacity: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "caret-blink": "caret-blink 1.2s ease-out infinite",
            },
        },
    },
};

export default config;
