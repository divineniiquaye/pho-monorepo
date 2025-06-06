import { SystemBars, SystemBarsProps } from "react-native-edge-to-edge";
import Animated, { SharedValue } from "react-native-reanimated";
import { View } from "react-native";
import React from "react";

import { useAfterInteractions } from "../hooks/useAfterInteraction";
import { AutoSkeleton } from "./skeleton";
import { cn } from "../lib/utils";

export type LayoutProps = Omit<
  React.ComponentPropsWithoutRef<typeof Animated.View>,
  "children"
> & {
  children: React.ReactNode | SharedValue<React.ReactNode>;
  placeholder?: React.ComponentType;
  status?: SystemBarsProps;
  className?: string;
  wait?: boolean | (() => boolean);
  delay?: number | false;
};

export function ScreenLayout({
  placeholder: Placeholder,
  children,
  className,
  status,
  wait,
  delay = false,
  ...props
}: LayoutProps) {
  const { transitionRef, areInteractionsComplete } = useAfterInteractions<Animated.View>(
    (timeout) =>
      new Promise((resolve) => {
        const interaction = () => {
          if (typeof wait === "function") {
            resolve(wait());
          } else {
            const show = !wait || wait === true;
            if (show) resolve(show);
          }
        };

        if (typeof delay === "number") {
          timeout.current = setTimeout(interaction, Math.max(300, delay));
        } else interaction();
      }),
    [wait],
  );

  return (
    <View
      className={cn(
        "bg-background flex-grow pb-safe android:pb-safe-offset-2 pt-safe-offset-2 px-safe-offset-4 transition-all android:duration-300 rounded-t-3xl",
        className,
      )}
    >
      <SystemBars style="auto" {...status} />
      <Animated.View ref={transitionRef} style={{ flex: 1 }} {...props}>
        <AutoSkeleton isLoading={!areInteractionsComplete}>
          {children as any}
        </AutoSkeleton>
      </Animated.View>
    </View>
  );
}
