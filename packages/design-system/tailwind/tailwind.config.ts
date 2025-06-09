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
                        web: "var(--font-geist-sans)",
                        default: "NunitoSans",
                    }),
                    ...defaultTheme.fontFamily.sans,
                ],
                mono: [
                    platformSelect({
                        web: "var(--font-geist-mono)",
                        default: "RobotoMono",
                    }),
                    ...defaultTheme.fontFamily.mono,
                ],
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
                wiggle: {
                    "0%,100%": { transform: "rotate(-4deg)" },
                    "50%": { transform: "rotate(4deg)" },
                },
                buzz: {
                    "0%,100%": { transform: "translateX(0)" },
                    "10%,30%,50%,70%,90%": { transform: "translateX(-2px)" },
                    "20%,40%,60%,80%": { transform: "translateX(2px)" },
                },
                rubberband: {
                    "0%": { transform: "scaleX(1) scaleY(1)" },
                    "30%": { transform: "scaleX(1.25) scaleY(0.75)" },
                    "40%": { transform: "scaleX(0.75) scaleY(1.25)" },
                    "60%": { transform: "scaleX(1.15) scaleY(0.85)" },
                    "65%": { transform: "scaleX(0.95) scaleY(1.05)" },
                    "75%": { transform: "scaleX(1.05) scaleY(0.95)" },
                    "100%": { transform: "scaleX(1) scaleY(1)" },
                },
                shimmer: {
                    "0%": { transform: "translateX(-100%)" },
                    "100%": { transform: "translateX(100%)" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "caret-blink": "caret-blink 1.2s ease-out infinite",
                wiggle: "wiggle 0.4s ease-out infinite",
                buzz: "buzz 0.5s linear infinite",
                shimmer: "shimmer 1s ease-out infinite",
                rubberband: "rubberband 1s ease-in-out",
            },
        },
    },
};

export default config;
