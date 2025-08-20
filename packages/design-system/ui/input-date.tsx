import { getDaysInMonth, isValid, compareAsc, isBefore, isAfter } from "date-fns";
import {
  View,
  Text,
  TextInput,
  type ViewStyle,
  Platform,
  TextInputProps,
} from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

import { useColorScheme } from "../hooks";
import { cn } from "../lib";

const inputDateVariant = cva(
  "flex-row items-center justify-evenly border px-3 bg-background overflow-hidden",
  {
    variants: {
      size: {
        xl: "h-15 gap-2",
        lg: "h-14 gap-2",
        md: "h-13 gap-1",
        sm: "h-12 gap-1",
      },
      variant: {
        outline: "rounded-md border-border",
        rounded: "rounded-full border-border",
        underlined: "rounded-none border-b border-border bg-transparent",
      },
    },
    defaultVariants: { variant: "outline", size: "md" },
  },
);

const inputSegmentVariant = cva(
  "text-foreground placeholder:text-muted-foreground flex-grow text-center py-0 h-full web:outline-0 web:outline-none",
  {
    variants: {
      size: {
        sm: "text-lg",
        md: "text-[1.14rem]",
        lg: "text-[1.18rem]",
        xl: "text-[1.24rem]",
      },
    },
  },
);

// Utility functions using date-fns
const isValidDate = (year: number, month: number, day: number): boolean => {
  if (year < 1000 || year > 9999) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1) return false;

  const date = new Date(year, month - 1, day);
  return (
    isValid(date) &&
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

const compareDates = (date1: DateValue | null, date2: DateValue | null): number => {
  if (!date1 || !date2) return 0;

  const d1 = new Date(date1.year, date1.month - 1, date1.day);
  const d2 = new Date(date2.year, date2.month - 1, date2.day);

  return compareAsc(d1, d2);
};

const isDateInRange = (
  date: DateValue,
  minValue?: DateValue,
  maxValue?: DateValue,
): boolean => {
  const dateObj = new Date(date.year, date.month - 1, date.day);

  if (minValue) {
    const minDate = new Date(minValue.year, minValue.month - 1, minValue.day);
    if (isBefore(dateObj, minDate)) return false;
  }

  if (maxValue) {
    const maxDate = new Date(maxValue.year, maxValue.month - 1, maxValue.day);
    if (isAfter(dateObj, maxDate)) return false;
  }

  return true;
};

type InputDateContextType = {
  isFocused: boolean;
  focusedSegment: "month" | "day" | "year" | null;
  variant: "outline" | "rounded" | "underlined" | null;
  size: "sm" | "md" | "lg" | "xl" | null;
  isDisabled: boolean;
  isReadOnly: boolean;
  isInvalid: boolean;
  currentValue: DateValue | null;
  handleValueChange: (value: DateValue | null) => void;
  handleSegmentChange: (segment: "month" | "day" | "year", text: string) => void;
  handleSegmentFocus: (segment: "month" | "day" | "year") => void;
  handleSegmentBlur: (segment: "month" | "day" | "year") => void;
  formatSegmentValue: (segment: "month" | "day" | "year") => string;
  monthRef: React.RefObject<TextInput | null>;
  dayRef: React.RefObject<TextInput | null>;
  yearRef: React.RefObject<TextInput | null>;
};

const InputDateContext = React.createContext<InputDateContextType | null>(null);

export interface DateValue {
  year: number;
  month: number;
  day: number;
}

export interface InputDateProps extends VariantProps<typeof inputDateVariant> {
  value?: DateValue | null;
  defaultValue?: DateValue | null;
  onChange?: (value: DateValue | null) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isInvalid?: boolean;
  minValue?: DateValue;
  maxValue?: DateValue;
  style?: ViewStyle;
  className?: string;
  inputStyle?: ViewStyle;
  inputClassName?: string;
  as?: React.ComponentType<React.ComponentProps<typeof TextInput>>;
}

export const InputDate: React.FC<InputDateProps> = ({
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  isDisabled = false,
  isReadOnly = false,
  isInvalid = false,
  minValue,
  maxValue,
  style,
  className,
  inputStyle,
  inputClassName,
  variant = "outline",
  size = "md",
  as: Component = TextInput,
}) => {
  const [internalValue, setInternalValue] = React.useState<DateValue | null>(
    defaultValue || null,
  );
  const [focusedSegment, setFocusedSegment] = React.useState<
    "month" | "day" | "year" | null
  >(null);
  const [isFocused, setIsFocused] = React.useState(false);
  const [pendingSegments, setPendingSegments] = React.useState<Partial<DateValue>>({});

  const monthRef = React.useRef<TextInput>(null);
  const dayRef = React.useRef<TextInput>(null);
  const yearRef = React.useRef<TextInput>(null);
  const blurTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentValue = value !== undefined ? value : internalValue;

  // Sync external value changes (but not during active editing)
  React.useEffect(() => {
    if (value !== undefined && !isFocused) {
      setInternalValue(value);
      setPendingSegments({});
    }
  }, [value, isFocused]);

  const handleValueChange = React.useCallback(
    (newValue: DateValue | null) => {
      if (value === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    },
    [value, onChange],
  );

  const focusNextSegment = React.useCallback(
    (currentSegment: "month" | "day" | "year") => {
      setTimeout(() => {
        if (currentSegment === "month") {
          dayRef.current?.focus();
        } else if (currentSegment === "day") {
          yearRef.current?.focus();
        }
      }, 0);
    },
    [],
  );

  const focusPreviousSegment = React.useCallback(
    (currentSegment: "month" | "day" | "year") => {
      setTimeout(() => {
        if (currentSegment === "day") {
          monthRef.current?.focus();
        } else if (currentSegment === "year") {
          dayRef.current?.focus();
        }
      }, 0);
    },
    [],
  );

  const handleSegmentChange = React.useCallback(
    (segment: "month" | "day" | "year", text: string) => {
      if (isDisabled || isReadOnly) return;

      // Handle deletion - auto-focus previous field when current becomes empty
      if (text === "") {
        const newPending = { ...pendingSegments };
        delete newPending[segment];
        setPendingSegments(newPending);

        // Clear the entire date if no segments remain
        if (Object.keys(newPending).length === 0) {
          handleValueChange(null);
        }

        // Auto-focus previous segment on deletion
        focusPreviousSegment(segment);
        return;
      }

      // Only allow numeric input
      if (!/^\d+$/.test(text)) return;

      const numericValue = Number.parseInt(text);
      if (isNaN(numericValue)) return;

      // Update pending segments
      const newPending = {
        ...pendingSegments,
        [segment]: numericValue,
      };
      setPendingSegments(newPending);

      // Try to construct a complete date
      const baseDate = currentValue;
      const potentialDate = { ...baseDate, ...newPending };

      // Enhanced auto-advance logic
      let shouldAdvance = false;

      if (segment === "month") {
        // Advance if 2 digits, or if 1 digit > 1 (since max month is 12)
        shouldAdvance = text.length === 2 || (text.length === 1 && numericValue > 1);
        if (numericValue > 12) {
          setPendingSegments({ ...newPending, month: 12 });
          potentialDate.month = 12;
        }
      } else if (segment === "day") {
        // Consider the maximum days for current month/year
        const maxDays = getDaysInMonth(
          new Date(
            potentialDate.year ?? new Date().getFullYear(),
            potentialDate.month ?? 1,
          ),
        );

        if (numericValue > maxDays) {
          setPendingSegments({ ...newPending, day: maxDays });
          potentialDate.day = maxDays;
        }
        shouldAdvance = text.length === 2;
      } else if (segment === "year") {
        shouldAdvance = text.length === 4;
        if (maxValue && numericValue > maxValue.year) {
          setPendingSegments({ ...newPending, year: maxValue.year });
          potentialDate.year = maxValue.year;
        }
      }

      // Commit the date if we have all segments or if it's a valid complete date
      const hasAllSegments = Object.keys(newPending).length === 3;
      const isCompleteValidDate =
        hasAllSegments &&
        isValidDate(potentialDate.year!, potentialDate.month!, potentialDate.day!);

      if (
        (isCompleteValidDate || shouldAdvance) &&
        isValidDate(potentialDate.year!, potentialDate.month!, potentialDate.day!) &&
        isDateInRange(potentialDate as Required<DateValue>, minValue, maxValue)
      ) {
        handleValueChange(potentialDate as Required<DateValue>);
        setPendingSegments({});
      }

      // Auto-advance focus to next field
      if (shouldAdvance) {
        focusNextSegment(segment);
      }
    },
    [
      isDisabled,
      isReadOnly,
      pendingSegments,
      currentValue,
      handleValueChange,
      minValue,
      maxValue,
      focusNextSegment,
      focusPreviousSegment,
    ],
  );

  const handleSegmentFocus = React.useCallback(
    (segment: "month" | "day" | "year") => {
      // Clear any pending blur timeout
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
        blurTimeoutRef.current = null;
      }

      setFocusedSegment(segment);
      if (!isFocused) {
        setIsFocused(true);
        onFocus?.();
      }
    },
    [isFocused, onFocus],
  );

  const handleSegmentBlur = React.useCallback(
    (segment: "month" | "day" | "year") => {
      // Use timeout to handle focus transitions between segments
      blurTimeoutRef.current = setTimeout(() => {
        setFocusedSegment(null);
        setIsFocused(false);

        // Commit any pending segments on blur
        if (Object.keys(pendingSegments).length > 0) {
          const baseDate = currentValue || {
            year: new Date().getFullYear(),
            month: 1,
            day: 1,
          };
          const finalDate = { ...baseDate, ...pendingSegments };

          // Only commit if we have a complete valid date
          if (
            Object.keys(pendingSegments).length === 3 &&
            isValidDate(finalDate.year, finalDate.month, finalDate.day)
          ) {
            if (isDateInRange(finalDate, minValue, maxValue)) {
              handleValueChange(finalDate);
            }
          }
          setPendingSegments({});
        }

        onBlur?.();
      }, 150); // Slightly longer timeout to handle rapid focus changes
    },
    [pendingSegments, currentValue, handleValueChange, onBlur, minValue, maxValue],
  );

  const formatSegmentValue = React.useCallback(
    (segment: "month" | "day" | "year"): string => {
      // Show pending input if available
      if (pendingSegments[segment] !== undefined) {
        const segmentValue = pendingSegments[segment]!;
        return segmentValue.toString();
      }

      if (!currentValue) return "";

      const segmentValue = currentValue[segment];
      return segmentValue.toString();
    },
    [currentValue, pendingSegments],
  );

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(
    () => ({
      isFocused,
      focusedSegment,
      variant,
      size,
      isDisabled,
      isReadOnly,
      isInvalid,
      currentValue,
      handleValueChange,
      handleSegmentChange,
      handleSegmentFocus,
      handleSegmentBlur,
      formatSegmentValue,
      monthRef,
      dayRef,
      yearRef,
    }),
    [
      isFocused,
      focusedSegment,
      variant,
      size,
      isDisabled,
      isReadOnly,
      isInvalid,
      currentValue,
      handleValueChange,
      handleSegmentChange,
      handleSegmentFocus,
      handleSegmentBlur,
      formatSegmentValue,
    ],
  );

  return (
    <InputDateContext.Provider value={contextValue}>
      <View
        style={style}
        className={inputDateVariant({
          variant,
          size,
          className: cn(
            isInvalid && "!border-destructive/60",
            isDisabled && "opacity-50",
            isFocused && "!border-ring",
            className,
          ),
        })}
      >
        <DateSegment
          ref={monthRef}
          segment="month"
          placeholder="MM"
          maxLength={2}
          className={inputClassName}
          style={inputStyle}
          as={Component}
        />

        <Text
          className={cn(
            "text-muted-foreground",
            size === "sm"
              ? "text-sm"
              : size === "lg"
                ? "text-lg"
                : size === "xl"
                  ? "text-xl"
                  : "text-base",
          )}
        >
          /
        </Text>

        <DateSegment
          ref={dayRef}
          segment="day"
          placeholder="DD"
          maxLength={2}
          className={inputClassName}
          style={inputStyle}
          as={Component}
        />

        <Text
          className={cn(
            "text-muted-foreground",
            size === "sm"
              ? "text-sm"
              : size === "lg"
                ? "text-lg"
                : size === "xl"
                  ? "text-xl"
                  : "text-base",
          )}
        >
          /
        </Text>

        <DateSegment
          ref={yearRef}
          segment="year"
          placeholder="YYYY"
          maxLength={4}
          className={inputClassName}
          style={inputStyle}
          as={Component}
        />
      </View>
    </InputDateContext.Provider>
  );
};

const DateSegment = React.forwardRef<
  TextInput,
  {
    as?: React.ComponentType<TextInputProps & { ref?: React.Ref<TextInput> }>;
    segment: "month" | "day" | "year";
    placeholder: string;
    maxLength: number;
    className?: string;
    style?: ViewStyle;
  }
>(
  (
    {
      as: Component = TextInput,
      segment,
      placeholder,
      maxLength,
      className,
      style: segmentStyle,
    },
    ref,
  ) => {
    const context = React.useContext(InputDateContext);
    if (!context) return null; // Graceful fallback instead of throwing

    const { isDarkColorScheme } = useColorScheme();

    return (
      <Component
        ref={ref}
        className={inputSegmentVariant({
          size: context.size,
          className: cn(
            context.isInvalid && "text-destructive",
            context.isDisabled && "text-muted-foreground bg-muted",
            className,
          ),
        })}
        style={segmentStyle}
        value={context.formatSegmentValue(segment)}
        onChangeText={(text: string) => context.handleSegmentChange(segment, text)}
        keyboardAppearance={isDarkColorScheme ? "dark" : "light"}
        keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
        editable={!context.isDisabled && !context.isReadOnly}
        onFocus={() => context.handleSegmentFocus(segment)}
        onBlur={() => context.handleSegmentBlur(segment)}
        placeholder={placeholder}
        maxLength={maxLength}
        enterKeyHint="done"
        selectTextOnFocus
        accessible
        accessibilityLabel={`${segment} input`}
        accessibilityHint={`Enter ${segment} value`}
      />
    );
  },
);

DateSegment.displayName = "DateSegment";

// Export utility functions for external use
export { isValidDate, compareDates };
