import { ActivityIndicator, ColorValue, Platform, View } from "react-native";
import { StatusBar, StatusBarProps } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import React from "react";
import Animated, {
  AnimatedProps,
  FadeIn,
  FadeOut,
  SharedValue,
} from "react-native-reanimated";

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
  androidNavigationBarColor?: ColorValue;
  placeholder?: React.ComponentType;
  status?: StatusBarProps;
  className?: string;
  wait?: boolean;
  delay?: number | false;
  animated?: {
    className?: string;
    entering?: AnimatedProps<View>["entering"];
    exiting?: AnimatedProps<View>["exiting"];
  };
};

export function ScreenLayout({
  androidNavigationBarColor,
  placeholder: Placeholder,
  children,
  className,
  status,
  wait,
  animated,
  delay = false,
  ...props
}: LayoutProps) {
  const DefaultPlaceHolder = React.useCallback(
    () => (
      <Animated.View
        className={cn(
          "bg-background h-full w-full justify-center pb-safe",
          animated?.className,
        )}
        entering={FadeIn.duration(500)}
        exiting={FadeOut}
      >
        <ActivityIndicator size="large" />
      </Animated.View>
    ),
    [animated?.className],
  );

  const { transitionRef, areInteractionsComplete } = useAfterInteractions<Animated.View>(
    (timeout) =>
      new Promise((resolve) => {
        const interaction = () => {
          if ("android" === Platform.OS && androidNavigationBarColor) {
            NavigationBar.setBackgroundColorAsync(androidNavigationBarColor as string);
          }

          resolve(wait ?? true); // Wait for the next interaction
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
        "bg-background flex-grow py-safe px-safe-offset-4 ios:landscape:px-safe-offset-1 transition-all android:duration-300",
        className,
      )}
    >
      <StatusBar style="auto" {...status} />
      <Animated.View
        entering={animated?.entering}
        exiting={animated?.exiting}
        ref={transitionRef}
        style={{ flex: 1 }}
        {...props}
      >
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
