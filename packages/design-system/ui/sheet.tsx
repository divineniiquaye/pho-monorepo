"use client";

import * as React from "react";
import * as SheetPrimitive from "@rn-primitives/dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { Platform, StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideInLeft,
  SlideInRight,
  SlideInUp,
  SlideOutDown,
  SlideOutLeft,
  SlideOutRight,
  SlideOutUp,
} from "react-native-reanimated";
import { X } from "../icons/X";

import isWeb from "../lib/isWeb";
import { cn } from "../lib/utils";

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

const SheetOverlayWeb = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay> & {
    side?: "right" | "left" | "top" | "bottom" | null;
  }
>(({ className, side, ...props }, ref) => {
  const { open } = SheetPrimitive.useRootContext();
  return (
    <SheetPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-black/80",
        open ? "animate-in fade-in-20" : "animate-out fade-out-20",
        className,
      )}
      {...props}
      ref={ref}
    />
  );
});

SheetOverlayWeb.displayName = "SheetOverlayWeb";

const SheetOverlayNative = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay> & {
    side: "right" | "left" | "top" | "bottom" | null;
  }
>(({ className, children, side = "left", ...props }, ref) => (
  <Animated.View style={StyleSheet.absoluteFill} entering={FadeIn} exiting={FadeOut}>
    <SheetPrimitive.Overlay
      style={StyleSheet.absoluteFill}
      className={cn(
        "flex bg-black/80",
        { "items-end": "right" === side, "justify-end": "bottom" === side },
        className,
      )}
      {...props}
      ref={ref}
    >
      <Animated.View
        entering={
          "right" === side
            ? SlideInRight
            : "left" === side
              ? SlideInLeft
              : "top" === side
                ? SlideInUp
                : SlideInDown
        }
        exiting={
          "right" === side
            ? SlideOutRight
            : "left" === side
              ? SlideOutLeft
              : "top" === side
                ? SlideOutUp
                : SlideOutDown
        }
      >
        {children as any}
      </Animated.View>
    </SheetPrimitive.Overlay>
  </Animated.View>
));
SheetOverlayNative.displayName = "SheetOverlayNative";

const SheetOverlay = Platform.select({
  web: SheetOverlayWeb,
  default: SheetOverlayNative,
});

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background web:p-5 native:px-6 native:pb-safe-offset-2.5 web:shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 native:pt-safe-offset-1 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 pt-6 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 native:pt-safe-offset-1 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 native:pt-safe-offset-1 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  },
);

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {
  handleKeyboard?: boolean;
}

const SheetContent = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Content>,
  SheetContentProps & {
    portalHost?: string;
  }
>(
  (
    {
      side = "web" === Platform.OS ? "right" : "left",
      className,
      portalHost,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <SheetPortal hostName={portalHost}>
        <SheetOverlay side={side}>
          <SheetPrimitive.Content
            ref={ref}
            className={cn(sheetVariants({ side }), className)}
            {...props}
          >
            {children}
            <SheetPrimitive.Close
              className={cn(
                "absolute right-4 native:-mt-5 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
                "bottom" === side ? "native:pt-6" : "native:pt-safe-offset-1",
              )}
            >
              <X className="h-4 w-4 text-foreground" />
              {isWeb && <span className="sr-only">Close</span>}
            </SheetPrimitive.Close>
          </SheetPrimitive.Content>
        </SheetOverlay>
      </SheetPortal>
    );
  },
);
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({
  className,
  ...props
}: React.ComponentProps<typeof View>) => (
  <View
    className={cn("flex flex-col space-y-2 text-center sm:text-left", className)}
    {...props}
  />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({
  className,
  ...props
}: React.ComponentProps<typeof View>) => (
  <View
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className,
    )}
    {...props}
  />
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-sm native:text-base text-muted-foreground", className)}
    {...props}
  />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
