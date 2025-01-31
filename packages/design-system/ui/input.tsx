"use client";

import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { EyeOffIcon } from "../icons/EyeOffIcon";
import { Eye } from "../icons/Eye";
import { cn } from "../lib/utils";

const Input = React.memo(
  React.forwardRef<
    React.ComponentRef<typeof TextInput>,
    React.ComponentPropsWithoutRef<typeof TextInput> & {
      variant?: "default" | "underline" | "float" | "float-underline";
      containerClassName?: string;
      left?: React.ComponentType;
      right?: React.ComponentType;
      as?: typeof TextInput;
    }
  >(
    (
      {
        left: LeftComponent,
        right: RightComponent,
        onChangeText,
        className,
        variant = "default",
        placeholderClassName,
        containerClassName,
        secureTextEntry,
        placeholder,
        as: As,
        onFocus,
        onBlur,
        ...props
      },
      ref,
    ) => {
      const Component = As ?? TextInput;
      const [secureEntry, setSecureEntry] = React.useState(!!secureTextEntry);
      const [isFocused, setIsFocused] = React.useState(false);

      const [currentValue, setValue] = React.useState("");
      const value = props?.value ?? currentValue ?? props?.defaultValue;

      const inputRef = React.useRef<TextInput>(null);
      React.useImperativeHandle(ref, () => inputRef.current!);
      const float = ["float", "float-underline"].includes(variant);

      if (props?.onChange) {
        console.warn("onChange is not supported on Input. Use onChangeText instead.");
      }

      return (
        <Pressable
          onPress={() => inputRef.current?.focus()}
          className={cn(
            "flex-row items-center justify-between gap-2 h-[2.6rem] native:h-[2.9rem] web:py-1.5 border-input px-3 bg-background transition-colors duration-300",
            ["underline", "float-underline"].includes(variant)
              ? "border-b-[1.4px]"
              : "border-[1.4px] rounded-md",
            props.editable === false && "opacity-50 cursor-not-allowed",
            isFocused && "border-ring outline-none",
            containerClassName,
          )}
        >
          {LeftComponent && <LeftComponent />}
          <Text
            className={cn(
              "absolute pl-3 inset-x-0 text-muted-foreground text-base web:text-sm leading-[1.25] transition-all duration-300",
              !!value && {
                "web:text-xs native:text-[12.4px] -translate-y-[13px] web:-translate-y-3 native:pt-1":
                  float,
                "opacity-0 web:hidden": !float,
              },
              placeholderClassName,
            )}
          >
            {placeholder}
          </Text>
          <Component
            ref={inputRef}
            className={cn(
              "web:w-full native:flex-1 border-none outline-none text-base web:text-sm leading-[1.25] text-foreground placeholder:text-muted-foreground file:bg-transparent file:font-medium",
              float && value && "pt-2",
              className,
            )}
            onChangeText={(text) => {
              if (onChangeText) onChangeText(text);
              else setValue(text);
            }}
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
