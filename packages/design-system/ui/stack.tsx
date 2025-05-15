"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { View } from "react-native";
import React from "react";

import isWeb from "../lib/isWeb";

export const hstackVariants = cva(
  `flex-row ${
    isWeb
      ? "flex relative z-0 box-border border-0 list-none min-w-0 min-h-0 bg-transparent items-baseline m-0 p-0 text-decoration-none"
      : ""
  }`,
  {
    variants: {
      space: {
        xs: "gap-1",
        sm: "gap-2",
        md: "gap-3",
        lg: "gap-4",
        xl: "gap-5",
        "2xl": "gap-6",
        "3xl": "gap-7",
        "4xl": "gap-8",
      },
      reversed: {
        true: "flex-row-reverse",
      },
    },
  },
);

export const vstackVariants = cva(
  `flex-col ${
    isWeb
      ? "flex flex-col relative z-0 box-border border-0 list-none min-w-0 min-h-0 bg-transparent m-0 p-0 text-decoration-none"
      : ""
  }`,
  {
    variants: {
      space: {
        xs: "gap-1",
        sm: "gap-2",
        md: "gap-3",
        lg: "gap-4",
        xl: "gap-5",
        "2xl": "gap-6",
        "3xl": "gap-7",
        "4xl": "gap-8",
      },
      reversed: {
        true: "flex-col-reverse",
      },
    },
  },
);

type HStackProps = React.ComponentProps<typeof View> &
  VariantProps<typeof hstackVariants>;

const HStack = React.forwardRef<React.ComponentRef<typeof View>, HStackProps>(
  ({ className, space, reversed, ...props }, ref) => {
    return (
      <View
        className={hstackVariants({ space, reversed, className })}
        {...props}
        ref={ref}
      />
    );
  },
);

type VStackProps = React.ComponentProps<typeof View> &
  VariantProps<typeof vstackVariants>;

const VStack = React.forwardRef<React.ComponentRef<typeof View>, VStackProps>(
  ({ className, space, reversed, ...props }, ref) => {
    return (
      <View
        className={vstackVariants({ space, reversed, class: className })}
        {...props}
        ref={ref}
      />
    );
  },
);

VStack.displayName = "VStack";
HStack.displayName = "HStack";

export { HStack, VStack };
