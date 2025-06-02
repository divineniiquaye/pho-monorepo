import { DefaultTheme, type Theme } from "@react-navigation/native";

export const DefaultFont = "NunitoSans";
export const FontTheme = {
    regular: {
        fontFamily: DefaultFont,
        fontWeight: "400",
    },
    medium: {
        fontFamily: DefaultFont,
        fontWeight: "500",
    },
    bold: {
        fontFamily: DefaultFont,
        fontWeight: "600",
    },
    heavy: {
        fontFamily: DefaultFont,
        fontWeight: "700",
    },
};

export const LightTheme = {
    background: "transparent", // background
    border: "hsl(240 5.9% 90%)", // border
    card: "hsl(0 0% 100%)", // card
    notification: "hsl(0 84.2% 60.2%)", // destructive
    primary: "hsl(240 5.9% 10%)", // primary
    text: "hsl(240 10% 3.9%)", // foreground
};

export const DarkTheme = {
    background: "transparent", // background
    border: "hsl(240 3.7% 15.9%)", // border
    card: "hsl(240 10% 3.9%)", // card
    notification: "hsl(0 72% 51%)", // destructive
    primary: "hsl(0 0% 98%)", // primary
    text: "hsl(0 0% 98%)", // foreground
};

export const NavigationBarTheme = {
    light: LightTheme.background,
    dark: DarkTheme.background,
};

export const NavigationTheme = {
    light: {
        dark: DefaultTheme.dark,
        colors: LightTheme,
        fonts: FontTheme,
    } as Theme,
    dark: {
        dark: !DefaultTheme.dark,
        colors: DarkTheme,
        fonts: FontTheme,
    } as Theme,
} as const;
