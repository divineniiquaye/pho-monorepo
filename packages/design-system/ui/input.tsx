"use client";

import { cva, VariantProps } from "class-variance-authority";
import React from "react";
import {
  Animated,
  Easing,
  LayoutChangeEvent,
  TextInput as RNTextInput,
  StyleProp,
  TextInputProps,
  TextStyle,
  View,
} from "react-native";

import { cn } from "../lib/utils";
import { useColorScheme } from "../hooks";

const inputVariant = cva(
  "flex-row overflow-hidden content-center items-center border-input px-3",
  {
    variants: {
      size: {
        "4xl": "h-20",
        "2xl": "h-16",
        xl: "h-15",
        lg: "h-14",
        md: "h-13",
        sm: "h-12",
      },

      variant: {
        underlined: "rounded-none border-b",
        outline: "rounded-md border",
        rounded: "rounded-full border",
      },
    },
    defaultVariants: { variant: "outline", size: "md" },
  },
);

const inputFieldVariant = cva(
  "flex-1 text-foreground py-0 placeholder:text-muted-foreground h-full ios:leading-[0px] web:cursor-text",
  {
    variants: {
      variant: {
        underlined: "web:outline-0 web:outline-none px-0",
        outline: "web:outline-0 web:outline-none",
        rounded: "web:outline-0 web:outline-none px-4",
      },

      size: {
        sm: "text-lg",
        md: "text-[1.14rem]",
        lg: "text-[1.18rem]",
        xl: "text-[1.24rem]",
        "2xl": "text-[1.27rem]",
        "4xl": "text-[1.40rem]",
      },
    },
  },
);

const floatInputVariant = {
  sm: [15.8, 13],
  md: [16, 13.2],
  lg: [16.4, 13.2],
  xl: [17.4, 14.4],
  "2xl": [17.8, 14.4],
  "4xl": [19.6, 16.2],
};

type InputContextType = {
  isFocused: boolean;
  setIsFocused: (value: boolean) => void;
  variant: "underlined" | "outline" | "rounded" | null;
  size?: "4xl" | "2xl" | "xl" | "lg" | "md" | "sm" | null;
  editable?: boolean;
  label: { text?: string; position: Animated.Value };
};

const InputContext = React.createContext<InputContextType | null>(null);

type InputProps = React.ComponentProps<typeof View> &
  VariantProps<typeof inputVariant> & {
    /** If false, text is not editable. The default value is true. */
    editable?: boolean;
    /** Label only works if a value is provided for the input field, else it will behave like focus-in/focus-out */
    label?: string;
    labelClassName?: string;
    labelStyle?: StyleProp<TextStyle>;
  };
const Input = React.forwardRef<View, InputProps>(
  (
    {
      children,
      className,
      label,
      labelClassName,
      labelStyle,
      editable = true,
      variant = "outline",
      size = "md",
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const float = floatInputVariant[size ?? "md"];

    const labelPosition = React.useRef(new Animated.Value(0)).current;
    const labelAnimatedStyle = {
      transform: [
        {
          translateY: labelPosition.interpolate({
            inputRange: [0, 1],
            outputRange: [2 - (float[0] - float[1] - 1), -(float[1] - 1)],
          }),
        },
      ],
      fontSize: labelPosition.interpolate({
        inputRange: [0, 1],
        outputRange: float,
      }),
    };

    return (
      <InputContext.Provider
        value={{
          variant,
          size,
          editable,
          isFocused,
          setIsFocused,
          label: { text: label, position: labelPosition },
        }}
      >
        <View
          ref={ref}
          className={inputVariant({
            variant,
            size,
            className: cn(
              !editable && "opacity-50 cursor-not-allowed",
              className,
              isFocused && "!border-ring outline-none",
            ),
          })}
          {...props}
        >
          <Animated.Text
            className={cn(
              "absolute text-muted-foreground native:pl-3 w-[97%] z-10",
              labelClassName,
            )}
            style={[labelAnimatedStyle, labelStyle]}
            pointerEvents="none"
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {label}
          </Animated.Text>
          {children}
        </View>
      </InputContext.Provider>
    );
  },
);
Input.displayName = "Input";

type InputFieldProps = Omit<React.ComponentProps<typeof RNTextInput>, "editable"> &
  VariantProps<typeof inputFieldVariant> & {
    as?: React.ComponentType<TextInputProps & { ref?: React.Ref<RNTextInput> }>;
  };
const InputField = React.forwardRef<RNTextInput, InputFieldProps>(
  (
    {
      as: TextInput = RNTextInput,
      keyboardAppearance,
      autoCapitalize,
      returnKeyType,
      className,
      variant,
      size,
      onFocus,
      onBlur,
      onLayout,
      ...props
    },
    ref,
  ) => {
    const { isDarkColorScheme } = useColorScheme();
    const context = React.useContext(InputContext);
    if (!context) throw new Error("InputField must be used within Input");

    const value = props?.value || props?.defaultValue ? 1 : 0;

    const animateLabel = (toValue: number) => {
      Animated.timing(context.label.position, {
        toValue,
        duration: 150,
        useNativeDriver: false, // fontSize animation requires this to be false
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      }).start();
    };

    const onLayoutFn = React.useCallback(
      (e: LayoutChangeEvent) => {
        if (context?.label?.text && value) animateLabel(1);
        onLayout?.(e);
      },
      [context.label.text],
    );

    return (
      <TextInput
        ref={ref}
        keyboardAppearance={keyboardAppearance ?? (isDarkColorScheme ? "dark" : "light")}
        autoCapitalize={autoCapitalize ?? "none"}
        className={inputFieldVariant({
          variant: variant ?? context.variant,
          size: size ?? context.size,
          className: cn(
            !context.editable && "web:cursor-not-allowed",
            context?.label?.text && "pt-2.5",
            className,
          ),
        })}
        editable={context.editable}
        onLayout={onLayoutFn}
        onFocus={(e) => {
          context.setIsFocused(true);
          onFocus?.(e);

          if (context?.label?.text) animateLabel(1);
        }}
        onBlur={(e) => {
          context.setIsFocused(false);
          onBlur?.(e);
          if (!value && context?.label?.text) animateLabel(0);
        }}
        returnKeyType={
          returnKeyType ??
          (["numeric", "phone-pad", "number-pad", "decimal-pad"].includes(
            props.keyboardType!,
          )
            ? "done"
            : "default")
        }
        {...props}
      />
    );
  },
);
InputField.displayName = "InputField";

export { Input, InputField };
