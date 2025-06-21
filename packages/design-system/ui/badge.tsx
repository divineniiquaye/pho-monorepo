import { cva, type VariantProps } from "class-variance-authority";
import { View } from "react-native";
import * as React from "react";

import { TextClassContext } from "./text";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-colors web:transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary [a&]:hover:bg-primary/90",
        secondary: "border-transparent bg-secondary [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "[a&]:hover:bg-accent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const badgeTextVariants = cva("text-xs native:text-sm font-medium", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      secondary: "text-secondary-foreground",
      destructive: "text-white",
      outline: "text-foreground [a&]:hover:text-accent-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const Badge = React.forwardRef<
  React.ComponentRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View> &
    VariantProps<typeof badgeVariants> & { textClass?: string }
>(({ className, children, textClass, variant = "default", ...props }, ref) => {
  return (
    <View ref={ref} className={badgeVariants({ variant, className })} {...props}>
      <TextClassContext.Provider
        value={badgeTextVariants({ variant, className: textClass })}
      >
        {children}
      </TextClassContext.Provider>
    </View>
  );
});

export { Badge, badgeVariants, badgeTextVariants };
