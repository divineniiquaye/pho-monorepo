"use client";

import {
  View,
  TouchableOpacity,
  TextInput,
  Pressable,
  GestureResponderEvent,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from "react-native";
import React from "react";
import Animated, {
  useAnimatedStyle,
  withSequence,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";

import { cn } from "@repo/design/lib/utils";
import { Text } from "../text";

interface TimePickerProps {
  mode: "H:M:S" | "H" | "M" | "S" | "H:M";
  onChange: (time: number, timestamp: "H" | "M" | "S") => void;
  className?: string;
}

const TimeComponent = ({
  value,
  type,
  active,
  invalid,
  onPress,
}: {
  value: string;
  type: "H" | "M" | "S";
  active: boolean;
  invalid: boolean;
  onPress: (type: "H" | "M" | "S", e: GestureResponderEvent) => void;
}) => {
  const shakeAnimation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: shakeAnimation.value }],
    }),
    [],
  );

  React.useEffect(() => {
    if (active && invalid) {
      shakeAnimation.value = withSequence(
        withTiming(10, { duration: 100 }),
        withTiming(-10, { duration: 100 }),
        withTiming(10, { duration: 100 }),
        withTiming(0, { duration: 100 }),
      );
    }
  }, [active, invalid]);

  return (
    <Pressable onPress={(e) => onPress("H", e)} className="flex-1 web:py-1">
      <Animated.Text
        style={animatedStyle}
        className={cn(
          "text-2xl web:text-lg text-center",
          value.length === 0
            ? "text-muted-foreground"
            : active && invalid
              ? "text-destructive"
              : "text-foreground",
        )}
      >
        {value || "00"}
      </Animated.Text>
      {active && (
        <View
          className={cn(
            "pointer-events-none absolute inset-0 flex items-center justify-center",
            value.length === 1 && "left-[15%]",
            value.length === 2 && "left-[45%]",
          )}
        >
          <Animated.View
            className={cn(
              "h-[18px] w-[1.5px] animate-caret-blink bg-foreground duration-1000",
              active && invalid && "bg-destructive",
            )}
          />
        </View>
      )}
    </Pressable>
  );
};

export function TimePicker({ mode, onChange, className }: TimePickerProps) {
  const inputRef = React.useRef<TextInput>(null);

  const [isTimeValid, setIsTimeValid] = React.useState(true);
  const [time, setTime] = React.useState({
    hours: "",
    minutes: "",
    seconds: "",
    isPM: false,
  });
  const [activeInput, setActiveInput] = React.useState<"H" | "M" | "S" | null>(null);

  const handleBackspace = React.useCallback(
    (
      nativeEvent: NativeSyntheticEvent<TextInputKeyPressEventData>,
      type: "H" | "M" | "S" | null,
    ) => {
      if (!type) return;
      if (nativeEvent.nativeEvent.key === "Backspace") {
        if (type === "M" && time.minutes === "") {
          setActiveInput("H");
        } else if (type === "S" && time.seconds === "") {
          setActiveInput("M");
        }
      }
    },
    [time.minutes, time.seconds],
  );

  const handleTimeChange = (text: string) => {
    if (!activeInput) return;

    const isValid = !text || parseInt(text) <= (activeInput === "H" ? 12 : 59);
    setIsTimeValid(isValid);

    if (activeInput === "H") {
      setTime((prev) => ({ ...prev, hours: text }));
      if (isValid && text.length === 2) {
        onChange(parseInt(text) + (time.isPM ? 12 : 0), "H");
        if (mode.includes("M")) setActiveInput("M");
        else inputRef.current?.blur();
      }
    } else if (activeInput === "M") {
      setTime((prev) => ({ ...prev, minutes: text }));
      if (isValid && text.length === 2) {
        onChange(parseInt(text), "M");
        if (mode.includes("S")) setActiveInput("S");
        else inputRef.current?.blur();
      }
    } else if (activeInput === "S") {
      setTime((prev) => ({ ...prev, seconds: text }));
      if (isValid && text.length === 2) {
        onChange(parseInt(text), "S");
        inputRef.current?.blur();
      }
    }
  };

  const handlePeriodToggle = (isPM: boolean) => {
    if (time.hours.length === 2) {
      onChange(parseInt(time.hours) + (isPM ? 12 : 0), "H");
    }
    setTime((prev) => ({ ...prev, isPM }));
  };

  const handlePress = (type: "H" | "M" | "S") => {
    inputRef.current?.focus();
    setActiveInput(type);
  };

  return (
    <View className={cn("flex-row items-center gap-4 mt-3", className)}>
      <View className="flex-1 gap-4 flex-row items-center justify-center border border-input rounded-lg native:h-12 relative">
        {mode.startsWith("H") && (
          <TimeComponent
            type="H"
            value={time.hours}
            onPress={() => handlePress("H")}
            active={activeInput === "H"}
            invalid={!isTimeValid}
          />
        )}
        {mode.includes("M") && (
          <>
            {"M" !== mode && <Text className="font-medium text-base">:</Text>}
            <TimeComponent
              type="M"
              value={time.minutes}
              onPress={() => handlePress("M")}
              active={activeInput === "M"}
              invalid={!isTimeValid}
            />
          </>
        )}
        {mode.includes("S") && (
          <>
            {"S" !== mode && <Text className="font-medium text-base">:</Text>}
            <TimeComponent
              type="S"
              value={time.seconds}
              onPress={() => handlePress("S")}
              active={activeInput === "S"}
              invalid={!isTimeValid}
            />
          </>
        )}

        <TextInput
          ref={inputRef}
          value={
            activeInput === "H"
              ? time.hours
              : activeInput === "M"
                ? time.minutes
                : time.seconds
          }
          onKeyPress={(e) => handleBackspace(e, activeInput)}
          onBlur={() => setActiveInput(null)}
          onChangeText={handleTimeChange}
          className="absolute opacity-0"
          keyboardType="numeric"
          maxLength={2}
        />
      </View>

      <View className="flex-row bg-muted p-1 rounded-lg">
        <TouchableOpacity
          onPress={() => handlePeriodToggle(false)}
          className={cn("px-4 py-2 web:py-1.5 rounded-lg", !time.isPM && "bg-background")}
        >
          <Text
            className={cn(
              "text-sm native:text-base",
              !time.isPM ? "text-foreground font-medium" : "text-muted-foreground",
            )}
          >
            AM
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handlePeriodToggle(true)}
          className={cn("px-4 py-2 web:py-1.5 rounded-xl", time.isPM && "bg-background")}
        >
          <Text
            className={cn(
              "text-sm native:text-base",
              time.isPM ? "text-foreground font-medium" : "text-muted-foreground",
            )}
          >
            PM
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
