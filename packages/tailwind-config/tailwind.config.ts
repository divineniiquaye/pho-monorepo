import { hairlineWidth, platformSelect } from "nativewind/theme";
import defaultTheme from "tailwindcss/defaultTheme";

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
            },
            borderWidth: {
                hairline: hairlineWidth(),
            },
            fontFamily: {
                sans: [
                    platformSelect({
                        web: "var(--font-geist-sans)",
                        default: "GeistSans_400Regular",
                    }),
                    ...defaultTheme.fontFamily.sans,
                ],
                mono: [
                    platformSelect({
                        web: "var(--font-geist-mono)",
                        default: "GeistMono_400Regular",
                    }),
                    ...defaultTheme.fontFamily.mono,
                ],
                ...platformSelect({
                    web: {},
                    default: {
                        "geist-sans-thin": "GeistSans_100Thin",
                        "geist-sans-light": "GeistSans_300Light",
                        "geist-sans-medium": "GeistSans_500Medium",
                        "geist-sans-semibold": "GeistSans_600SemiBold",
                        "geist-sans-bold": "GeistSans_700Bold",
                        "geist-sans-black": "GeistSans_800Black",
                        "geist-mono-thin": "GeistMono_100Thin",
                        "geist-mono-ultralight": "GeistMono_200UltraLight",
                        "geist-mono-light": "GeistMono_300Light",
                        "geist-mono-medium": "GeistMono_500Medium",
                        "geist-mono-semibold": "GeistMono_600SemiBold",
                        "geist-mono-bold": "GeistMono_700Bold",
                        "geist-mono-black": "GeistMono_800Black",
                        "geist-mono-ultrablack": "GeistMono_900UltraBlack",
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
