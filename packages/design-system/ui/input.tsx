"use client";

import * as React from "react";
import { Pressable, TextInput } from "react-native";

import { cn } from "../lib/utils";
import { EyeOffIcon } from "../icons/EyeOffIcon";
import { Eye } from "../icons/Eye";

const Input = React.memo(
  React.forwardRef<
    React.ComponentRef<typeof TextInput>,
    React.ComponentPropsWithoutRef<typeof TextInput> & {
      variant?: "default" | "underline";
      containerClassName?: string;
      left?: React.ComponentType;
      right?: React.ComponentType;
    }
  >(
    (
      {
        left: LeftComponent,
        right: RightComponent,
        className,
        variant = "default",
        placeholderClassName,
        containerClassName,
        secureTextEntry,
        onFocus,
        onBlur,
        ...props
      },
      ref,
    ) => {
      const [secureEntry, setSecureEntry] = React.useState(!!secureTextEntry);
      const [isFocused, setIsFocused] = React.useState(false);

      const inputRef = React.useRef<TextInput>(null);
      React.useImperativeHandle(ref, () => inputRef.current!);

      return (
        <Pressable
          onPress={() => inputRef.current?.focus()}
          className={cn(
            "flex-row items-center justify-between gap-2 h-[2.6rem] native:h-[2.9rem] web:py-1.5 border-input px-3 bg-background transition-colors duration-300",
            variant === "underline" ? "border-b-[1.4px]" : "border-[1.4px] rounded-md",
            props.editable === false && "opacity-50 cursor-not-allowed",
            isFocused && "border-ring outline-none",
            containerClassName,
          )}
        >
          {LeftComponent && <LeftComponent />}
          <TextInput
            ref={inputRef}
            className={cn(
              "web:w-full native:flex-1 border-none outline-none text-base web:text-sm leading-[1.25] text-foreground placeholder:text-muted-foreground file:bg-transparent file:font-medium",
              className,
            )}
            placeholderClassName={cn("text-muted-foreground", placeholderClassName)}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            secureTextEntry={secureEntry}
            {...props}
          />
          {RightComponent ? (
            <RightComponent />
          ) : secureTextEntry ? (
            <Pressable onPress={() => setSecureEntry(!secureEntry)}>
              {secureEntry ? (
                <EyeOffIcon className="text-foreground size-4 native:size-5" />
              ) : (
                <Eye className="text-foreground size-4 native:size-5" />
              )}
            </Pressable>
          ) : null}
        </Pressable>
      );
    },
  ),
);

Input.displayName = "Input";

export { Input };
