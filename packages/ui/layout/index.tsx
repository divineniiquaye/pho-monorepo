import { ColorValue, InteractionManager, Platform, View } from "react-native";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar, StatusBarProps } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import React from "react";
import Animated, {
  AnimatedProps,
  FadeInDown,
  FadeInUp,
  FadeOutDown,
} from "react-native-reanimated";

import { LayoutPlaceholder } from "../skeleton/layout";
import { cn } from "../lib/utils";

type LayoutProps = View["props"] & {
  header?: (edges: EdgeInsets) => React.ReactNode;
  androidNavigationBarColor?: ColorValue;
  placeholder?: React.ReactNode;
  status?: StatusBarProps;
  className?: string;
  wait?: boolean;
  delay?: number;
  animated?: {
    entering?: AnimatedProps<View>["entering"];
    exiting?: AnimatedProps<View>["exiting"];
    default?: AnimatedProps<View>["entering"];
  };
};

export default function ScreenLayout({
  androidNavigationBarColor,
  placeholder,
  header,
  children,
  className,
  status,
  style,
  wait,
  animated,
  delay = 0,
  ...props
}: LayoutProps) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = React.useState(delay > 0);
  React.useEffect(() => {
    const interactionPromise = InteractionManager.runAfterInteractions(() => {
      const timer = setTimeout(
        () => {
          if ("android" === Platform.OS && androidNavigationBarColor) {
            NavigationBar.setBackgroundColorAsync(androidNavigationBarColor);
          }

          setLoading(false);
        },
        delay < 300 ? 0 : delay,
      );
      return () => clearTimeout(timer);
    });

    return interactionPromise.cancel;
  }, [delay]);

  return (
    <View className={cn("bg-background flex-grow", className)}>
      <StatusBar style="auto" {...status} />
      {header ? header(insets) : null}
      {loading || wait ? (
        <Animated.View
          style={{ marginHorizontal: 16, marginTop: header ? 0 : insets.top }}
          exiting={animated?.exiting ?? FadeOutDown}
          entering={animated?.entering ?? FadeInUp}
        >
          {placeholder ?? <LayoutPlaceholder />}
        </Animated.View>
      ) : (
        <Animated.View
          style={[
            {
              marginBottom: insets.bottom || 16,
              marginTop: insets.top,
              marginHorizontal: 16,
              flexGrow: 1,
            },
            style,
          ]}
          entering={-1 === delay ? undefined : (animated?.default ?? FadeInDown)}
          {...props}
        >
          {children}
        </Animated.View>
      )}
    </View>
  );
}
