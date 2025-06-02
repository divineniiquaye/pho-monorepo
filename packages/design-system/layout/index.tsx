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
  children:
    | React.ReactNode
    | SharedValue<React.ReactNode>
    | ((
        loaded: boolean,
        placeholder: React.ComponentType,
      ) => React.ReactNode | SharedValue<React.ReactNode>);
  placeholder?: React.ComponentType;
  status?: SystemBarsProps;
  className?: string;
  wait?: boolean;
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
  const DefaultPlaceHolder = () => (
    <Animated.View
      className={cn("bg-background h-full w-full justify-center pb-safe")}
      entering={props?.entering ?? FadeIn}
      exiting={props?.exiting}
    >
      <ActivityIndicator size="large" />
    </Animated.View>
  );

  const { transitionRef, areInteractionsComplete } = useAfterInteractions<Animated.View>(
    (timeout) =>
      new Promise((resolve) => {
        const interaction = () => resolve(wait ?? true);

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
        {areInteractionsComplete ? (
          typeof children === "function" ? (
            children(areInteractionsComplete, Placeholder ?? DefaultPlaceHolder)
          ) : (
            children
          )
        ) : !!Placeholder ? (
          <Placeholder />
        ) : (
          <DefaultPlaceHolder />
        )}
      </Animated.View>
    </View>
  );
}
