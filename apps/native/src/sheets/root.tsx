import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import { usePathname } from "expo-router";
import { cssInterop } from "nativewind";
import React from "react";
import {
  BottomSheet,
  BottomSheetProps,
  BottomSheetInstance,
  SheetManager,
} from "react-native-bottom-sheet-manager";

import { cn } from "@repo/design/lib/utils";

type Props = BottomSheetProps & {
  clickThrough?: boolean;
  topInset?: number;
  opacity?: number;
  className?: string;
  handleIndicatorClassName?: string;
  backgroundClassName?: string;
  containerClassName?: string;
  handleClassName?: string;
};

cssInterop(BottomSheet, {
  handleIndicatorClassName: "handleIndicatorStyle",
  backgroundClassName: "backgroundStyle",
  containerClassName: "containerStyle",
  handleClassName: "handleStyle",
  className: "style",
});

const Sheet = React.forwardRef<BottomSheetInstance, Props>(
  (
    {
      enablePanDownToClose = true,
      clickThrough,
      snapPoints,
      children,
      className,
      handleIndicatorStyle,
      backgroundStyle,
      topInset,
      opacity,
      ...props
    }: Props,
    ref,
  ) => {
    const { colors } = useTheme();
    const pathState = usePathname();
    const { top } = useSafeAreaInsets();
    const themeBackgroundStyle = React.useMemo(
      () => ({
        backgroundColor: colors.card,
      }),
      [colors.card],
    );
    const themeHandleIndicatorStyle = React.useMemo(
      () => ({
        backgroundColor: colors.border,
        height: 5,
        width: 50,
      }),
      [colors.border],
    );

    React.useEffect(() => {
      SheetManager.hideAll();
    }, [pathState]);

    return (
      <BottomSheet
        snapPoints={snapPoints ?? (props?.enableDynamicSizing ? [] : ["60%"])}
        handleIndicatorStyle={[themeHandleIndicatorStyle, handleIndicatorStyle]}
        backgroundStyle={[themeBackgroundStyle, backgroundStyle]}
        enablePanDownToClose={enablePanDownToClose}
        // @ts-ignore className is added by nativewind
        className={cn("px-4", className)}
        topInset={topInset ?? top}
        backdropComponent={(props) => (
          <BottomSheet.Backdrop
            enableTouchThrough={!!clickThrough}
            opacity={opacity ?? 0.6}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            {...props}
          />
        )}
        ref={ref}
        {...props}
      >
        {children}
      </BottomSheet>
    );
  },
);
Sheet.displayName = "SheetModal";

export { Sheet, BottomSheet, Props as BottomSheetProps };
