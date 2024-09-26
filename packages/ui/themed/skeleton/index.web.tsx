import { VariantProps } from "class-variance-authority";
import React from "react";

import { skeletonStyle, skeletonTextStyle } from "./styles";
import { cn } from "../../lib/utils";

type SkeletonProps = React.ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof skeletonStyle> & {
    startColor?: string;
    isLoaded?: boolean;
  };

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    { className, variant = "rounded", children, speed = 2, isLoaded = false, ...props },
    ref,
  ) => {
    if (isLoaded) return children;
    return (
      <div
        ref={ref}
        className={`animate-pulse ${skeletonStyle({
          className,
          variant,
          speed,
        })}`}
        {...props}
      />
    );
  },
);

type SkeletonTextProps = React.ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof skeletonTextStyle> & {
    _lines?: number;
    isLoaded?: boolean;
  };

const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonTextProps>(
  ({ className, _lines, isLoaded = false, gap = 2, children, ...props }, ref) => {
    if (isLoaded) return children;
    if (_lines) {
      return (
        <div
          ref={ref}
          className={cn("flex flex-col", skeletonTextStyle({ gap, className }))}
        >
          {Array.from({ length: _lines }).map((_, index) => (
            <div
              key={index}
              className={cn("animate-pulse", skeletonTextStyle({ className }))}
              {...props}
            />
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn("animate-pulse", skeletonTextStyle({ className }))}
        {...props}
      />
    );
  },
);

Skeleton.displayName = "Skeleton";
SkeletonText.displayName = "SkeletonText";

export { Skeleton, SkeletonText };
