import { SystemBars } from "react-native-edge-to-edge";
import { Platform } from "react-native";

export async function setAndroidNavigationBar(theme: "light" | "dark") {
    if (Platform.OS === "android") {
        SystemBars.setStyle({
            navigationBar: theme === "dark" ? "light" : "dark",
        });
    }
}
