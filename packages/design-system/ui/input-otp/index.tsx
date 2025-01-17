import * as Clipboard from "expo-clipboard";
import * as React from "react";
import {
  View,
  TextInput,
  Animated,
  TextInputProps,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  Platform,
} from "react-native";
import { Dot } from "@repo/design/icons/Dot";
import { cn } from "@repo/design/lib/utils";
import { Text } from "../text";

type OTPContextType = {
  isActive: boolean;
  char: string | null;
  placeholderChar: string | null;
  hasFakeCaret: boolean;
}[];

const OTPContext = React.createContext<OTPContextType | undefined>(undefined);

function useOTPContext(index: number) {
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
  onChange?: (newValue: string) => unknown;
  className?: string;
  maxLength: number;
  disabled?: boolean;
  textAlign?: "left" | "center" | "right";
  onComplete?: (...args: any[]) => unknown;
  pasteTransformer?: (pasted: string) => string;
  containerClassName?: string;
  children?: React.ReactNode;
  pattern?: string | RegExp;
};

const InputOTP = React.forwardRef<TextInput, OTPInputProps>(
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
    const value = uncheckedValue ?? code;

    const inputRef = React.useRef<TextInput>(null);
    React.useImperativeHandle(ref, () => inputRef.current!);
    const [isFocused, setIsFocused] = React.useState<boolean | 1>(false);

    const regexp = React.useMemo(
      () =>
        pattern ? (typeof pattern === "string" ? new RegExp(pattern) : pattern) : null,
      [pattern],
    );

    const onChange = React.useCallback(
      (newValue: string) => {
        uncheckedOnChange?.(newValue);
        setCode(newValue);
      },
      [uncheckedOnChange],
    );

    const handleChange = React.useCallback(
      (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
        if (props.editable === false) return;
        const newValue = e.nativeEvent.text.slice(0, maxLength);

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
      [maxLength, onChange, regexp],
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
        Array.from({ length: maxLength }, (_, i) => {
          const char = value[i] ?? null;
          const isActive =
            (i === value.length ||
              (value.length === maxLength && i === value.length - 1)) &&
            Boolean(isFocused);

          return {
            isActive,
            hasFakeCaret: isActive && char === null,
            char: !!props?.secureTextEntry ? "*" : char,
            placeholderChar: value[0] !== undefined ? null : (placeholder?.[i] ?? null),
          };
        }),
      [value, isFocused, maxLength, props?.secureTextEntry],
    );

    return (
      <OTPContext.Provider value={contextValue}>
        <View
          className={cn("flex items-center gap-2", containerClassName)}
          onTouchEnd={(e) => {
            inputRef.current?.focus();
            setIsFocused(true);
          }}
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

const InputOTPGroup = React.forwardRef<View, React.ComponentPropsWithoutRef<typeof View>>(
  ({ className, ...props }, ref) => (
    <View
      ref={ref}
      className={cn("flex flex-row items-center gap-2", className)}
      {...props}
    />
  ),
);
InputOTPGroup.displayName = "InputOTPGroup";

interface InputOTPSlotProps extends React.ComponentPropsWithoutRef<typeof View> {
  index: number;
}

const InputOTPSlot = React.forwardRef<View, InputOTPSlotProps>(
  ({ index, className, ...props }, ref) => {
    const { char, hasFakeCaret, isActive } = useOTPContext(index);

    return (
      <View
        ref={ref}
        className={cn(
          "relative flex h-12 w-10 items-center justify-center border-y border-x border-input rounded-md transition-all",
          isActive && "z-10 border-2 border-ring",
          className,
        )}
        {...props}
      >
        <Text className="text-base">{char}</Text>
        {hasFakeCaret && (
          <View className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <Animated.View className="h-[18px] w-px animate-caret-blink bg-foreground duration-1000" />
          </View>
        )}
      </View>
    );
  },
);
InputOTPSlot.displayName = "InputOTPSlot";

const InputOTPSeparator = React.forwardRef<
  View,
  React.ComponentPropsWithoutRef<typeof View>
>(({ ...props }, ref) => (
  <View ref={ref} role="separator" {...props}>
    <Dot className="text-foreground" />
  </View>
));
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
