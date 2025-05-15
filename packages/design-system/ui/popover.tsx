"use client";

import * as React from "react";
import { Dimensions, Platform, StyleSheet } from "react-native";
import { TextClassContext } from "./text";
import * as PopoverPrimitive from "@rn-primitives/popover";
import { cn } from "../lib/utils";

const { height: HEIGHT } = Dimensions.get("screen");

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
    portalHost?: string;
  }
>(({ className, align = "center", sideOffset, portalHost, ...props }, ref) => {
  const { triggerPosition, contentLayout } = PopoverPrimitive.useRootContext();
  const flip = React.useMemo(
    () =>
      triggerPosition?.pageY
        ? Math.abs(triggerPosition.pageY - HEIGHT) <= HEIGHT * 0.35
        : false,
    [triggerPosition?.pageY],
  );

  return (
    <PopoverPrimitive.Portal hostName={portalHost}>
      <PopoverPrimitive.Overlay
        style={Platform.OS !== "web" ? StyleSheet.absoluteFill : undefined}
      >
        <TextClassContext.Provider value="text-popover-foreground">
          <PopoverPrimitive.Content
            ref={ref}
            align={align}
            sideOffset={
              sideOffset ??
              (flip
                ? -((contentLayout?.height ?? 0) + (triggerPosition?.height ?? 0))
                : 0)
            }
            className={cn(
              "z-50 w-72 rounded-md web:cursor-auto border border-border bg-popover p-4 shadow-md shadow-foreground/5 web:outline-none web:data-[side=bottom]:slide-in-from-top-2 web:data-[side=left]:slide-in-from-right-2 web:data-[side=right]:slide-in-from-left-2 web:data-[side=top]:slide-in-from-bottom-2 web:animate-in web:zoom-in-95 web:fade-in-0",
              className,
            )}
            {...props}
          />
        </TextClassContext.Provider>
      </PopoverPrimitive.Overlay>
    </PopoverPrimitive.Portal>
  );
});
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverContent, PopoverTrigger };
