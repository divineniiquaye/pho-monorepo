import { useColorScheme as useRNColorScheme } from "react-native";
import { useTheme } from "next-themes";

export function useColorScheme() {
    const { resolvedTheme, setTheme } = useTheme();
    const theme = useRNColorScheme();

    const finalTheme = resolvedTheme === "system" ? theme : (resolvedTheme ?? theme);
    return {
        colorScheme: finalTheme,
        isDarkColorScheme: finalTheme === "dark",
        setColorScheme: setTheme,
        toggleColorScheme: () => setTheme(finalTheme === "dark" ? "light" : "dark"),
    };
}
