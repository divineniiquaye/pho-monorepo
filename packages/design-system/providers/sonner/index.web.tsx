"use client";

import { Toaster } from "sonner";

export default function SonnerProvider({ theme }: { theme: "light" | "dark" }) {
  return (
    <Toaster visibleToasts={4} richColors={true} theme={theme} />
  );
}
