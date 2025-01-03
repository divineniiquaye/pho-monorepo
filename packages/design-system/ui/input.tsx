"use client";

import { cssInterop } from "nativewind";
import * as React from "react";
import {
  NativeSyntheticEvent,
  Pressable,
  TextInput,
  TextInputFocusEventData,
  View,
  Animated,
} from "react-native";

import { useInputLayout } from "@repo/design/providers/keyboard";
import { cn, parseClassPrefix } from "@repo/design/lib/utils";
import isWeb from "@repo/design/lib/isWeb";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
if (isWeb) {
  cssInterop(AnimatedTextInput, { className: { target: "style" } });
  cssInterop(AnimatedPressable, { className: { target: "style" } });
}

/**
 * NOTE: Avoid using a placeholder longer than the width of the input field
 */
const Input = React.forwardRef<
  React.ComponentRef<typeof TextInput>,
  React.ComponentPropsWithoutRef<typeof TextInput> & {
    variant?: "float" | "default" | "underline";
    placeholderContainerClassName?: string;
    containerClassName?: string;
  }
>(
  (
    {
      className,
      variant = "default",
      placeholder,
      placeholderClassName,
      placeholderContainerClassName,
      containerClassName,
      defaultValue,
      onChangeText,
      onChange,
      onFocus,
      onBlur,
      style,
      value,
      ...props
    },
    ref,
  ) => {
    const { onLayout, clearFocused } = useInputLayout();

    const focusAnim = React.useRef(new Animated.Value(0)).current;
    const layout = React.useRef({ y: 0, height: 42 });
    const floatReset = React.useMemo(
      () =>
        variant === "float" && className
          ? (parseClassPrefix<number>(className, "h-", "number") ?? 12)
          : 12,
      [className, variant],
    );

    const hasHandler = !!onChangeText || !!onChange;
    const [text, setText] = React.useState<string>(
      defaultValue ?? (!hasHandler ? (value ?? "") : ""),
    );

    const hasValue = !!value || !!text;
    const inputRef = React.useRef<TextInput>(null);
    React.useImperativeHandle(ref, () => inputRef.current!);

    const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      Animated.timing(focusAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
      onLayout(layout.current);
      onFocus?.(e);
    };

    const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      Animated.timing(focusAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
      clearFocused();
      onBlur?.(e);
    };

    const animatedStyle = {
      view: {
        top: focusAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [hasValue ? -10 : floatReset, -10],
        }),
      },
      label: {
        fontSize: focusAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [hasValue ? 12 : 15, 12],
        }),
      },
    };

    return (
      <View className={cn("w-full native:flex native:flex-initial", containerClassName)}>
        {placeholder && (variant === "float" || !hasValue) && (
          <AnimatedPressable
            className={cn(
              "absolute z-40 justify-center w-full web:cursor-text bottom-1/4 native:bottom-[28%]",
              placeholderContainerClassName,
            )}
            style={variant === "float" && animatedStyle.view}
            onPress={() => inputRef.current?.focus()}
            disabled={false === props.editable}
            accessibilityRole="button"
            accessible
          >
            <Animated.Text
              style={variant === "float" && animatedStyle.label}
              className={cn(
                "text-muted-foreground text-base truncate native:text-lg native:leading-[1.25] px-3",
                placeholderClassName,
              )}
            >
              {placeholder}
            </Animated.Text>
          </AnimatedPressable>
        )}
        <AnimatedTextInput
          ref={inputRef}
          className={cn(
            "overflow-hidden h-[2.6rem] native:h-12 border-input bg-background px-3 py-2 text-base web:text-sm leading-[1.25] text-foreground file:bg-transparent file:font-medium focus:outline-none focus:border-ring transition-colors duration-300",
            variant === "underline"
              ? "border-b-[1.2px]"
              : {
                  "border-[1.2px] rounded-md": true,
                  "placeholder:text-transparent native:focus:pt-3 web:focus-visible:pt-4 has-[value]:pt-3 [&:not(:placeholder-shown)]:pt-4 transition-[padding-top]":
                    variant === "float",
                },
            props.editable === false && "opacity-50 cursor-not-allowed",
            className,
          )}
          onLayout={(event) =>
            event?.target?.measureInWindow(
              (_, y, __, height) => (layout.current = { y, height }),
            )
          }
          onChangeText={!!onChangeText ? onChangeText : !onChange ? setText : undefined}
          placeholder={variant === "float" && isWeb ? placeholder : undefined}
          defaultValue={hasHandler ? defaultValue : undefined}
          value={hasHandler ? value : text}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
      </View>
    );
  },
);

Input.displayName = "Input";

export { Input };
