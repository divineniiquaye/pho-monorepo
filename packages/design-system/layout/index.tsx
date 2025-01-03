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

type LayoutProps = Omit<
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

export default function ScreenLayout({
  androidNavigationBarColor,
  placeholder: Placeholder,
  children,
  className,
  status,
  wait,
  animated,
  delay = 300,
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
            NavigationBar.setBackgroundColorAsync(androidNavigationBarColor);
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
    <View className="flex-grow">
      <StatusBar style="auto" {...status} />
      <Animated.View
        className={cn(
          "bg-background flex-1 py-safe px-safe-offset-4 ios:landscape:px-safe-offset-1",
          "transition-[color,background-color,border-color,text-decoration-color,fill,stroke,padding-top,padding-bottom] ios:duration-200 android:duration-500",
          className,
        )}
        entering={animated?.entering ?? FadeIn.duration(300)}
        exiting={animated?.exiting ?? FadeOut}
        ref={transitionRef}
        {...props}
      >
        {typeof children === "function" ? (
          children(areInteractionsComplete, Placeholder ?? DefaultPlaceHolder)
        ) : areInteractionsComplete ? (
          children
        ) : !!Placeholder ? (
          <Placeholder />
        ) : (
          <DefaultPlaceHolder />
        )}
      </Animated.View>
    </View>
  );
}
