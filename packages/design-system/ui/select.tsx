"use client";

import * as SelectPrimitive from "@rn-primitives/select";
import {
  Dimensions,
  Platform,
  PressableStateCallbackType,
  TextProps,
  View,
} from "react-native";
import { Text as SlotText, View as SlotView } from "@rn-primitives/slot";
import { Pressable, Text } from "react-native";
import * as React from "react";

import { ChevronDown } from "../icons/ChevronDown";
import { ChevronUp } from "../icons/ChevronUp";
import { Check } from "../icons/Check";
import { cn } from "../lib/utils";
import isWeb from "../lib/isWeb";

const { height: HEIGHT } = Dimensions.get("screen");

type Option = SelectPrimitive.Option;

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = React.forwardRef<
  View,
  Omit<TextProps, "children"> & {
    placeholder?: React.ReactNode;
    asChild?: boolean;
    children?: (value: Option) => React.ReactNode;
  }
>(({ asChild, placeholder, children, ...props }, ref) => {
  const { value } = SelectPrimitive.useRootContext();
  const Component =
    (typeof placeholder === "string" && !value) || !children
      ? asChild
        ? SlotText
        : Text
      : asChild
        ? SlotView
        : View;

  return (
    <Component ref={ref} {...props}>
      {value ? (children ? children(value) : value.label) : placeholder}
    </Component>
  );
});

const SelectTrigger = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Trigger>,
  Omit<React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>, "asChild">
>(({ className, children, "aria-label": label, ...props }, ref) => {
  const Component = isWeb ? "button" : Pressable;

  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-row h-10 native:h-12 native:transition-colors native:duration-200 items-center text-sm justify-between rounded-md border border-input bg-background px-3 py-2 web:ring-offset-background text-muted-foreground web:focus:outline-none web:focus:ring-2 native:focus:border-ring web:focus:ring-ring web:focus:ring-offset-2 [&>span]:line-clamp-1",
        props.disabled && "web:cursor-not-allowed opacity-50",
        className,
      )}
      asChild={true}
      {...props}
    >
      <Component role="combobox" aria-label={label ?? "Select"}>
        {children as any}
        <ChevronDown
          size={18}
          aria-hidden={true}
          className="text-foreground opacity-60"
        />
      </Component>
    </SelectPrimitive.Trigger>
  );
});
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

/**
 * Platform: WEB ONLY
 */
const SelectScrollUpButton = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>) => {
  if (Platform.OS !== "web") {
    return null;
  }
  return (
    <SelectPrimitive.ScrollUpButton
      className={cn(
        "flex web:cursor-default items-center justify-center py-1",
        className,
      )}
      {...props}
    >
      <ChevronUp size={14} className="text-foreground" />
    </SelectPrimitive.ScrollUpButton>
  );
};

/**
 * Platform: WEB ONLY
 */
const SelectScrollDownButton = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>) => {
  if (Platform.OS !== "web") {
    return null;
  }
  return (
    <SelectPrimitive.ScrollDownButton
      className={cn(
        "flex web:cursor-default items-center justify-center py-1",
        className,
      )}
      {...props}
    >
      <ChevronDown size={14} className="text-foreground" />
    </SelectPrimitive.ScrollDownButton>
  );
};

const SelectContent = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & { portalHost?: string }
>(
  (
    { className, children, position = "popper", portalHost, sideOffset, ...props },
    ref,
  ) => {
    const { open, triggerPosition, contentLayout } = SelectPrimitive.useRootContext();
    const flip = React.useMemo(
      () =>
        triggerPosition?.pageY
          ? Math.abs(triggerPosition.pageY - HEIGHT) <= HEIGHT * 0.35
          : false,
      [triggerPosition?.pageY],
    );

    return (
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          ref={ref}
          style={{ minWidth: triggerPosition?.width }}
          className={cn(
            "relative z-50 max-h-96 min-w-[8rem] rounded-md border border-border bg-popover shadow-md shadow-foreground/10 py-2 px-1 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            position === "popper" &&
              "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
            open
              ? "mt-1 web:zoom-in-95 web:animate-in web:fade-in-0"
              : "web:zoom-out-95 web:animate-out web:fade-out-0",
            className,
          )}
          sideOffset={
            sideOffset ??
            (flip
              ? -((contentLayout?.height ?? 0) + (triggerPosition?.height ?? 0) + 8)
              : 0)
          }
          position={position}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.Viewport
            className={cn(
              "p-1",
              position === "popper" &&
                "web:h-[var(--radix-select-trigger-height)] w-full web:min-w-[var(--radix-select-trigger-width)]",
            )}
          >
            {children}
          </SelectPrimitive.Viewport>
          <SelectScrollDownButton />
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    );
  },
);
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(
      "py-1.5 native:pb-2 pl-8 native:pl-10 pr-2 text-popover-foreground text-sm native:text-base font-semibold",
      className,
    )}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItemText: React.FC<{
  pressed: boolean;
  children?: (
    state: PressableStateCallbackType & { label: string; value: string },
  ) => React.ReactNode;
}> = ({ pressed, children }) => {
  const { itemValue, label } = SelectPrimitive.useItemContext();

  return children ? (
    children({ pressed, label, value: itemValue })
  ) : (
    <SelectPrimitive.ItemText className="text-sm text-popover-foreground native:text-base web:group-focus:text-accent-foreground" />
  );
};

const SelectItem = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Item>,
  Omit<React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>, "children"> & {
    checkedIcon?: React.ReactNode;
    children?: (
      state: PressableStateCallbackType & { label: string; value: string },
    ) => React.ReactNode;
  }
>(({ className, children, checkedIcon, ...props }, ref) => {
  return (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        "relative web:group flex flex-row w-full web:cursor-default web:select-none items-center rounded-sm py-1.5 native:py-2 pl-8 native:pl-10 pr-2 active:bg-accent web:outline-none web:focus:bg-accent",
        props.disabled && "web:pointer-events-none opacity-50",
        className,
      )}
      {...props}
    >
      {({ pressed }) => (
        <React.Fragment>
          <View className="absolute left-2 native:left-3.5 flex h-3.5 native:pt-px w-3.5 items-center justify-center">
            <SelectPrimitive.ItemIndicator>
              {checkedIcon ?? (
                <Check size={16} strokeWidth={3} className="text-popover-foreground" />
              )}
            </SelectPrimitive.ItemIndicator>
          </View>
          <SelectItemText pressed={pressed} children={children} />
        </React.Fragment>
      )}
    </SelectPrimitive.Item>
  );
});
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  type Option,
};
