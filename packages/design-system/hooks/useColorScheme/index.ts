import { useColorScheme as useNativewindColorScheme } from "nativewind";

export function useColorScheme() {
    const { colorScheme, setColorScheme, toggleColorScheme } = useNativewindColorScheme();

    return {
        isDarkColorScheme: colorScheme === "dark",
        colorScheme: colorScheme ?? "light",
        setColorScheme,
        toggleColorScheme,
    };
}
