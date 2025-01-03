import * as Clipboard from "expo-clipboard";
import { useState } from "react";

import { toast } from "@repo/design/ui/sonner";

export const useCopyToClipboard = (): {
  isCopied: boolean;
  copyToClipboard: (value: string) => void;
} => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copyToClipboard = (value: string) => {
    if (isCopied) {
      return;
    }

    Clipboard.setStringAsync(value).then(() => {
      setIsCopied(true);
      toast.success("Copied to clipboard!");
    });

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return { isCopied, copyToClipboard };
};
