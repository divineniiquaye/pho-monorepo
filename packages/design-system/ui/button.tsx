"use client";

import { Animated, GestureResponderEvent, Pressable as RNPressable } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { Pressable } from "@rn-primitives/slot";
import * as React from "react";

import { TextClassContext } from "./text";
import { cn } from "../lib/utils";
import isWeb from "../lib/isWeb";

const buttonVariants = cva(
  "group flex items-center justify-center rounded-md web:ring-offset-background native:active:scale-95 native:transition-transform web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary web:hover:opacity-90 active:opacity-90",
        destructive: "bg-destructive web:hover:opacity-90 active:opacity-90",
        outline:
          "border border-input bg-background web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent active:text-accent-foreground",
        secondary: "bg-secondary web:hover:opacity-80 active:opacity-80",
        ghost:
          "web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent active:text-accent-foreground",
        link: "web:underline-offset-4 web:hover:underline web:focus:underline",
      },
      size: {
        default: "h-10 px-4 py-2 native:h-12 native:px-5 native:py-3",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8 native:h-14",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const buttonTextVariants = cva(
  "web:whitespace-nowrap text-sm native:text-base font-medium text-foreground web:transition-colors",
  {
    variants: {
      variant: {
        default: "text-primary-foreground",
        destructive: "text-destructive-foreground",
        outline: "group-active:text-accent-foreground",
        secondary: "text-secondary-foreground group-active:text-secondary-foreground",
        ghost: "group-active:text-accent-foreground",
        link: "text-primary group-active:underline",
      },
      size: {
        default: "",
        sm: "",
        lg: "native:text-lg",
        icon: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentPropsWithoutRef<typeof RNPressable> &
  VariantProps<typeof buttonVariants> & {
    /** Web only */
    type?: "submit" | "reset" | "button";
    asChild?: boolean;
    enableRipple?: boolean;
  };

const Button = React.forwardRef<React.ComponentRef<typeof RNPressable>, ButtonProps>(
  ({ className, variant, size, asChild, enableRipple, ...props }, ref) => {
    const Btn = asChild && isWeb ? Pressable : enableRipple ? RippleButton : RNPressable;
    return (
      <TextClassContext.Provider
        value={cn(
          props.disabled && "web:pointer-events-none",
          buttonTextVariants({ variant, size }),
        )}
      >
        <Btn
          className={cn(
            props.disabled && "opacity-50 web:pointer-events-none",
            buttonVariants({ variant, size, className }),
          )}
          ref={ref}
          role="button"
          {...props}
        />
      </TextClassContext.Provider>
    );
  },
);
Button.displayName = "Button";

type Ripple = { x: number; y: number; id: number };
const RippleButton = React.forwardRef<
  React.ComponentRef<typeof RNPressable>,
  React.ComponentPropsWithoutRef<typeof RNPressable>
>(({ onPress, children, ...props }, ref) => {
  const [ripples, setRipples] = React.useState<Ripple[]>([]);

  const handlePress = (e: GestureResponderEvent) => {
    if (e?.nativeEvent) {
      const id = Date.now();
      const { offsetX, offsetY, locationX, locationY } =
        e.nativeEvent as typeof e.nativeEvent & { offsetX: number; offsetY: number };
      setRipples((r) => [
        { x: (offsetX ?? locationX) - 50, y: (offsetY ?? locationY) - 50, id },
      ]);
    }
    onPress?.(e);
  };

  return (
    <RNPressable {...props} ref={ref} onPress={handlePress}>
      {children as any}
      {ripples.map(({ x, y, id }) => (
        <RippleCircle
          key={id}
          x={x}
          y={y}
          duration={400}
          onFinish={({ finished }) => {
            if (finished) {
              setRipples((r) => r.filter((p) => p.id !== id));
            }
          }}
        />
      ))}
    </RNPressable>
  );
});

type CircleProps = React.ComponentPropsWithoutRef<typeof Animated.View> & {
  x: number;
  y: number;
  duration: number;
  onFinish: Animated.EndCallback;
};

const RippleCircle: React.FC<CircleProps> = ({
  x,
  y,
  onFinish,
  duration = isWeb ? 600 : 400,
  className,
  style,
  ...props
}) => {
  const progress = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration,
      useNativeDriver: !isWeb,
    }).start(onFinish);
  }, []);

  const animatedStyle = {
    top: y,
    left: x,
    opacity: progress.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    }),
    transform: [
      {
        scale: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
    ],
  };

  return (
    <Animated.View
      pointerEvents="none"
      className={cn("absolute bg-accent rounded-[50px] h-[100px] w-[100px]", className)}
      style={[animatedStyle, style]}
      {...props}
    />
  );
};

export { Button, RippleButton, RippleCircle, buttonTextVariants, buttonVariants };
export type { ButtonProps };
