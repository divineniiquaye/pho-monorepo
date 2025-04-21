import { Toaster } from "sonner-native";

export default function SonnerProvider({ theme }: { theme: "light" | "dark" }) {
  return (
    <Toaster
      swipeToDismissDirection="up"
      visibleToasts={4}
      richColors={true}
      theme={theme}
    />
  );
}
