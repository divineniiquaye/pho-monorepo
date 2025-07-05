import Animated, { FadeIn, SharedValue } from "react-native-reanimated";
import { SystemBars, SystemBarsProps } from "react-native-edge-to-edge";
import { ActivityIndicator, View } from "react-native";
import React from "react";

import { useAfterInteractions } from "../hooks/useAfterInteraction";
import { cn } from "../lib/utils";

export type LayoutProps = Omit<
  React.ComponentPropsWithoutRef<typeof Animated.View>,
  "children"
> & {
  children: React.ReactNode | SharedValue<React.ReactNode>;
  placeholder?: React.ComponentType<React.ComponentPropsWithoutRef<typeof Animated.View>>;
  status?: SystemBarsProps;
  className?: string;
  wait?: boolean;
  delay?: number | false;
  // Callback that is called when the layout is ready
  onReady?: () => Promise<boolean>;
};

export function ScreenLayout({
  placeholder: Placeholder,
  onReady,
  children,
  className,
  status,
  wait,
  delay = false,
  ...props
}: LayoutProps) {
  const { ready } = useAfterInteractions(delay, onReady);
  return (
    <View
      className={cn(
        "flex-1 bg-background flex-grow pb-safe android:pb-safe-offset-2 pt-safe-offset-2 px-safe-offset-4 transition-all android:duration-300 rounded-t-3xl",
        className,
      )}
    >
      {ready && <SystemBars style="auto" {...status} />}
      {!wait && ready ? (
        Object.keys(props).length === 0 ? (
          (children as React.ReactNode)
        ) : (
          <Animated.View style={{ flex: 1 }} {...props}>
            {children}
          </Animated.View>
        )
      ) : Placeholder ? (
        <Placeholder {...props} />
      ) : (
        <Animated.View
          className={cn("flex-1 bg-background h-full w-full justify-center pb-safe")}
          entering={props?.entering ?? FadeIn}
          exiting={props?.exiting}
        >
          <ActivityIndicator size="large" />
        </Animated.View>
      )}
    </View>
  );
}
