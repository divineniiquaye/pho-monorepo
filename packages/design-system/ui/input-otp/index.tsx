import * as Clipboard from "expo-clipboard";
import * as React from "react";
import {
  View,
  TextInput,
  TextInputProps,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  Platform,
} from "react-native";

import { Dot } from "@repo/design/icons/Dot";
import { cn } from "@repo/design/lib/utils";
import { Text } from "../text";

type InputOTPRef = {
  focus: () => void;
  onChange: (value: string) => void;
};

type OTPContextType = {
  isActive: boolean;
  char: string | null;
  placeholderChar: string | null;
}[];

const OTPContext = React.createContext<OTPContextType | undefined>(undefined);

export function useOTPContext(index: number) {
  const context = React.useContext(OTPContext);
  if (!context) {
    throw new Error("OTP components must be used within an InputOTP provider");
  }
  return context[index];
}

type OTPInputProps = Omit<
  TextInputProps,
  "onChange" | "onChangeText" | "maxLength" | "children"
> & {
  className?: string;
  maxLength: number;
  disabled?: boolean;
  textAlign?: "left" | "center" | "right";
  onChange?: (newValue: string) => void;
  onComplete?: (string: string) => void;
  pasteTransformer?: (pasted: string) => string;
  containerClassName?: string;
  children?: React.ReactNode;
  pattern?: string | RegExp;
};

const InputOTP = React.forwardRef<InputOTPRef, OTPInputProps>(
  (
    {
      className,
      containerClassName,
      placeholder,
      value: uncheckedValue,
      onChange: uncheckedOnChange,
      maxLength,
      textAlign = "left",
      disabled,
      onComplete,
      pasteTransformer,
      onBlur,
      pattern,
      children,
      ...props
    },
    ref,
  ) => {
    const [code, setCode] = React.useState(props?.defaultValue ?? "");
    const [isFocused, setIsFocused] = React.useState<boolean>(false);
    const value = uncheckedValue ?? code;

    const inputRef = React.useRef<TextInput>(null);
    React.useImperativeHandle(ref, () => ({
      focus: onFocus,
      onChange: onChange,
    }));

    const regexp = React.useMemo(
      () =>
        pattern ? (typeof pattern === "string" ? new RegExp(pattern) : pattern) : null,
      [pattern],
    );

    const onFocus = React.useCallback(() => {
      inputRef.current?.focus();
      setIsFocused(true);
    }, []);

    const onChange = React.useCallback(
      (newValue: string) => {
        if (props.editable === false || !!disabled) return;
        uncheckedOnChange?.(newValue);
        setCode(newValue);
      },
      [uncheckedOnChange, disabled, props?.editable],
    );

    const handleChange = React.useCallback(
      (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
        const newValue = e.nativeEvent.text;
        if (!!newValue && regexp && !regexp.test(newValue)) {
          e.preventDefault();
          return;
        }

        onChange(newValue);
        if (newValue?.length === maxLength) {
          onComplete?.(newValue);
          inputRef.current?.blur();
        }
      },
      [maxLength, onChange, onComplete, regexp],
    );

    React.useEffect(() => {
      const copyCode = Clipboard.addClipboardListener(({ contentTypes }) => {
        if (contentTypes.includes(Clipboard.ContentType.PLAIN_TEXT)) {
          Clipboard.getStringAsync().then((content) => {
            const text = pasteTransformer ? pasteTransformer(content) : content;
            const matches = regexp?.test(text) || /[^0-9]/g.test(text);

            if ("" === value && text.length <= maxLength && matches) {
              onChange(text);
            }
          });
        }
      });

      return () => Clipboard.removeClipboardListener(copyCode);
    }, []);

    const contextValue = React.useMemo(
      () =>
        Array.from({ length: maxLength }, (_, i) => ({
          char: !!props?.secureTextEntry ? "*" : (value[i] ?? null),
          placeholderChar: value[0] !== undefined ? null : (placeholder?.[i] ?? null),
          isActive:
            Boolean(isFocused) &&
            (i === value.length ||
              (value.length === maxLength && i === value.length - 1)),
        })),
      [value, isFocused, maxLength, props?.secureTextEntry],
    );

    return (
      <OTPContext.Provider value={contextValue}>
        <View
          className={cn("flex items-center gap-2", containerClassName)}
          onTouchEnd={onFocus}
        >
          <TextInput
            ref={inputRef}
            value={value}
            onChange={handleChange}
            maxLength={maxLength}
            keyboardType="number-pad"
            textAlign={textAlign}
            aria-disabled={disabled}
            editable={!disabled}
            className={cn("absolute opacity-0", className)}
            autoComplete={Platform.OS === "android" ? "sms-otp" : "one-time-code"}
            textContentType="oneTimeCode"
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            returnKeyType="done"
            {...props}
          />
          {children}
        </View>
      </OTPContext.Provider>
    );
  },
);
InputOTP.displayName = "InputOTP";

const InputOTPGroup = React.forwardRef<View, React.ComponentProps<typeof View>>(
  ({ className, ...props }, ref) => (
    <View
      ref={ref}
      className={cn("flex flex-row items-center gap-2", className)}
      {...props}
    />
  ),
);
InputOTPGroup.displayName = "InputOTPGroup";

interface InputOTPSlotProps
  extends Omit<React.ComponentProps<typeof View>, "children"> {
  index: number;
  children?:
    | React.ReactNode
    | ((index: number, char: string | null, isActive: boolean) => React.ReactNode);
}

const InputOTPSlot = React.forwardRef<View, InputOTPSlotProps>(
  ({ index, className, children, ...props }, ref) => {
    const { char, isActive } = useOTPContext(index);

    return typeof children === "function" ? (
      children(index, char, isActive)
    ) : (
      <View
        ref={ref}
        className={cn(
          "relative flex h-12 w-10 items-center justify-center border-y border-x border-input rounded-md",
          isActive && "border-2 border-ring",
          className,
        )}
        {...props}
      >
        <Text className="text-base font-medium">{char}</Text>
        {isActive && (
          <View className="absolute w-0.5 h-6 opacity-80 bg-foreground animate-caret-blink" />
        )}
      </View>
    );
  },
);
InputOTPSlot.displayName = "InputOTPSlot";

const InputOTPSeparator = React.forwardRef<
  View,
  React.ComponentProps<typeof View>
>(({ ...props }, ref) => (
  <View ref={ref} role="separator" {...props}>
    <Dot className="text-foreground" />
  </View>
));
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
