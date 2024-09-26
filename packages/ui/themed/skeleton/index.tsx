import { Animated, Easing, Platform, View } from "react-native";
import { VariantProps } from "class-variance-authority";
import React, { forwardRef } from "react";

import { skeletonStyle, skeletonTextStyle } from "./styles";

type SkeletonProps = React.ComponentProps<typeof View> &
  VariantProps<typeof skeletonStyle> & {
    isLoaded?: boolean;
  };

type SkeletonTextProps = React.ComponentProps<typeof View> &
  VariantProps<typeof skeletonTextStyle> & {
    _lines?: number;
    isLoaded?: boolean;
  };

const Skeleton = forwardRef<React.ElementRef<typeof Animated.View>, SkeletonProps>(
  ({ className, variant, children, isLoaded = false, speed = 2, ...props }, ref) => {
    const pulseAnim = new Animated.Value(1);
    const customTimingFunction = Easing.bezier(0.4, 0, 0.6, 1);
    const fadeDuration = 0.6;
    const animationDuration = (fadeDuration * 10000) / (speed ?? 2); // Convert seconds to milliseconds

    const pulse = Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1, // Start with opacity 1
        duration: animationDuration / 2, // Third of the animation duration
        easing: customTimingFunction,
        useNativeDriver: Platform.OS !== "web",
      }),
      Animated.timing(pulseAnim, {
        toValue: 0.75,
        duration: animationDuration / 2, // Third of the animation duration
        easing: customTimingFunction,
        useNativeDriver: Platform.OS !== "web",
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: animationDuration / 2, // Third of the animation duration
        easing: customTimingFunction,
        useNativeDriver: Platform.OS !== "web",
      }),
    ]);

    if (!isLoaded) {
      Animated.loop(pulse).start();
      return (
        <Animated.View
          style={{ opacity: pulseAnim }}
          className={skeletonStyle({ variant, className })}
          {...props}
          ref={ref}
        />
      );
    }

    Animated.loop(pulse).stop();
    return children;
  },
);

const SkeletonText = forwardRef<React.ElementRef<typeof View>, SkeletonTextProps>(
  ({ className, _lines, isLoaded = false, gap = 2, children, ...props }, ref) => {
    if (isLoaded) return children;
    if (_lines) {
      return (
        <View className={skeletonTextStyle({ gap, className })} ref={ref}>
          {Array.from({ length: _lines }).map((_, index) => (
            <Skeleton
              key={index}
              className={skeletonTextStyle({ className })}
              {...props}
            />
          ))}
        </View>
      );
    }

    return <Skeleton className={skeletonTextStyle({ className })} {...props} ref={ref} />;
  },
);

Skeleton.displayName = "Skeleton";
SkeletonText.displayName = "SkeletonText";

export { Skeleton, SkeletonText };
