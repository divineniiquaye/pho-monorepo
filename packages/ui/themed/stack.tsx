import { cva, type VariantProps } from "class-variance-authority";
import { View } from "react-native";
import React from "react";

import isWeb from "../hooks/isWeb";

export const hstackVariants = cva(
  `flex-row ${
    isWeb
      ? "flex relative z-0 box-border border-0 list-none min-w-0 min-h-0 bg-transparent items-stretch m-0 p-0 text-decoration-none"
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
      ? "flex flex-col relative z-0 box-border border-0 list-none min-w-0 min-h-0 bg-transparent items-stretch m-0 p-0 text-decoration-none"
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

type HStackProps = React.ComponentPropsWithoutRef<typeof View> &
  VariantProps<typeof hstackVariants>;

const HStack = React.forwardRef<React.ElementRef<typeof View>, HStackProps>(
  ({ className, space, reversed, ...props }, ref) => {
    return (
      <View
        className={hstackVariants({ space, reversed, class: className })}
        {...props}
        ref={ref}
      />
    );
  },
);

type VStackProps = React.ComponentPropsWithoutRef<typeof View> &
  VariantProps<typeof vstackVariants>;

const VStack = React.forwardRef<React.ElementRef<typeof View>, VStackProps>(
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
