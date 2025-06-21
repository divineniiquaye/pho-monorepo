import { cva, VariantProps } from "class-variance-authority";
import { useUnstableNativeVariable } from "nativewind";
import { LinearGradient } from "expo-linear-gradient";
import { Platform, View } from "react-native";
import React from "react";

import { cn } from "@repo/design/lib/utils";
import { useColorScheme } from "../hooks";

export const skeletonStyle = cva("", {
  variants: {
    variant: {
      sharp: "rounded-none",
      circular: "rounded-full",
      rounded: "rounded-md",
    },
    speed: {
      1: "duration-75",
      2: "duration-100",
      3: "duration-150",
      4: "duration-200",
    },
  },
});
export const skeletonTextStyle = cva("rounded-sm w-full", {
  variants: {
    speed: {
      1: "duration-75",
      2: "duration-100",
      3: "duration-150",
      4: "duration-200",
    },
    gap: {
      1: "gap-1",
      2: "gap-2",
      3: "gap-3",
      4: "gap-4",
    },
  },
});

type SkeletonProps = Omit<React.ComponentPropsWithoutRef<typeof View>, "children"> &
  VariantProps<typeof skeletonStyle> & {
    type?: "shimmer" | "pulse";
  } & (
    | {
        isLoaded: "progressive";
        children: (
          setIsLoaded: (isLoaded: boolean) => void,
          ready: boolean,
        ) => React.ReactNode;
      }
    | {
        isLoaded?: boolean;
        children?: React.ReactNode;
      }
  );

const Shimmer = ({ speed }: { speed?: 1 | 2 | 3 | 4 | null }) => {
  if (Platform.OS !== "web") {
    const { isDarkColorScheme } = useColorScheme();
    const accent = useUnstableNativeVariable("--accent") as unknown as string[];
    return (
      <LinearGradient
        className={cn("absolute inset-0 animate-shimmer", skeletonStyle({ speed }))}
        colors={[
          "transparent",
          `hsla(${accent.join(" ")} / ${isDarkColorScheme ? 0.5 : 0.3})`,
          "transparent",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />
    );
  }

  return (
    <View
      className={cn(
        "absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-accent to-transparent",
        skeletonStyle({ speed }),
      )}
    />
  );
};

const Skeleton = React.forwardRef<React.ComponentRef<typeof View>, SkeletonProps>(
  (
    {
      className,
      variant = "rounded",
      type = "shimmer",
      isLoaded = false,
      speed,
      children,
      ...props
    },
    ref,
  ) => {
    if (true === isLoaded) return <>{children}</>;
    const [ready, setIsReady] = React.useState<boolean>(
      typeof isLoaded === "boolean" ? isLoaded : false,
    );

    const baseClass = cn(
      "relative overflow-hidden bg-accent/50",
      "progressive" === isLoaded && "absolute",
      type === "pulse" && "animate-pulse bg-accent",
      type !== "shimmer" && type !== "pulse" && "bg-accent",
      skeletonStyle({ variant, speed }),
      className,
    );

    return (
      <>
        {/* @ts-ignore - children is not a valid prop */}
        {"progressive" === isLoaded && children(setIsReady, ready)}
        {!ready && (
          <View ref={ref} className={baseClass} {...props}>
            {type === "shimmer" && <Shimmer speed={speed} />}
          </View>
        )}
      </>
    );
  },
);

type SkeletonTextProps = React.ComponentPropsWithoutRef<typeof View> &
  VariantProps<typeof skeletonTextStyle> & {
    _lines?: number;
    isLoaded?: boolean;
    type?: "shimmer" | "pulse";
  };

const SkeletonText = React.forwardRef<React.ElementRef<typeof View>, SkeletonTextProps>(
  (
    {
      _lines,
      isLoaded = false,
      type = "shimmer",
      className,
      gap = 2,
      speed,
      children,
      ...props
    },
    ref,
  ) => {
    if (isLoaded) return children;

    const lineClass = cn(
      "relative overflow-hidden bg-accent/50",
      type === "pulse" && "animate-pulse bg-accent",
      type !== "shimmer" && type !== "pulse" && "bg-accent",
      skeletonTextStyle({ speed }),
      className,
    );

    if (_lines && _lines > 0) {
      const lines = Array.from({ length: _lines });
      return (
        <View ref={ref} className={cn("flex web:flex-col", skeletonTextStyle({ gap }))}>
          {lines.map((_, index) => (
            <View key={index} className={lineClass} {...props}>
              {type === "shimmer" && <Shimmer speed={speed} />}
            </View>
          ))}
        </View>
      );
    }

    return (
      <View ref={ref} className={lineClass} {...props}>
        {type === "shimmer" && <Shimmer speed={speed} />}
      </View>
    );
  },
);

Skeleton.displayName = "Skeleton";
SkeletonText.displayName = "SkeletonText";

export { Skeleton, SkeletonText };
