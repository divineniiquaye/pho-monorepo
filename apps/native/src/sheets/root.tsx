import { usePathname } from "expo-router";
import { cssInterop } from "nativewind";
import React from "react";
import {
  BottomSheet,
  BottomSheetProps,
  BottomSheetInstance,
  SheetManager,
} from "@repo/bottom-sheet";

cssInterop(BottomSheet, {
  handleIndicatorClassName: "handleIndicatorStyle",
  backgroundClassName: "backgroundStyle",
  containerClassName: "containerStyle",
  handleClassName: "handleStyle",
  className: "style",
});

const Sheet = React.forwardRef<BottomSheetInstance, BottomSheetProps>(
  ({ enablePanDownToClose = true, ...props }: BottomSheetProps, ref) => {
    const pathState = usePathname();
    React.useEffect(() => {
      SheetManager.hideAll();
    }, [pathState]);

    return (
      <BottomSheet {...props} ref={ref} enablePanDownToClose={enablePanDownToClose} />
    );
  },
);
Sheet.displayName = "SheetModal";

export { Sheet, BottomSheet, BottomSheetProps };
