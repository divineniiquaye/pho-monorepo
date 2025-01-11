"use client";

import {
  View,
  TouchableOpacity,
  TextInput,
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

import { useInputLayout } from "@repo/design/providers/keyboard";
import { cn } from "@repo/design/lib/utils";
import { Text } from "../text";

interface TimePickerProps {
  mode: "H:M:S" | "H" | "M" | "S" | "H:M";
  onChange: (time: number, timestamp: "H" | "M" | "S") => void;
  className?: string;
}

export function TimePicker({ mode, onChange, className }: TimePickerProps) {
  const { onLayout, clearFocused } = useInputLayout();
  const layout = React.useRef({ y: 0, height: 0 });
  const hRef = React.useRef<TextInput>(null);
  const mRef = React.useRef<TextInput>(null);
  const sRef = React.useRef<TextInput>(null);
  const shakeAnimation = useSharedValue(0);

  const [isTimeValid, setIsTimeValid] = React.useState(true);
  const [time, setTime] = React.useState({
    hours: "",
    minutes: "",
    seconds: "",
    isPM: false,
  });

  const handleBackspace = React.useCallback(
    (
      type: "H" | "M" | "S",
      nativeEvent: NativeSyntheticEvent<TextInputKeyPressEventData>,
    ) => {
      if (nativeEvent.nativeEvent.key === "Backspace") {
        if (type === "M" && time.minutes === "") {
          hRef.current?.focus();
        } else if (type === "S" && time.seconds === "") {
          mRef.current?.focus();
        }
      }
    },
    [time.minutes, time.seconds],
  );

  const handleTimeChange = (text: string, type: "H" | "M" | "S") => {
    const isValid = !text || parseInt(text) <= (type === "H" ? 12 : 59);
    setIsTimeValid(isValid);

    if ("H" === type) {
      setTime((prev) => ({ ...prev, hours: text }));
      if (isValid && text.length === 2) {
        onChange(parseInt(text) + (time.isPM ? 12 : 0), "H");

        if (mRef.current) mRef.current.focus();
        else sRef.current?.focus();
      }
    } else if ("M" === type) {
      setTime((prev) => ({ ...prev, minutes: text }));
      if (isValid && text.length === 2) {
        onChange(parseInt(text), type);

        if (sRef.current) sRef.current.focus();
        else mRef.current?.blur();
      }
    } else if ("S" === type) {
      setTime((prev) => ({ ...prev, seconds: text }));

      if (isValid && text.length === 2) {
        onChange(parseInt(text), "S");
        sRef.current?.blur();
      }
    }

    if (!isValid) {
      shakeAnimation.value = withSequence(
        withTiming(10, { duration: 100 }),
        withTiming(-10, { duration: 100 }),
        withTiming(10, { duration: 100 }),
        withTiming(0, { duration: 100 }),
      );
    }
  };

  const handlePeriodToggle = (isPM: boolean) => {
    if (time.hours.length === 2) {
      onChange(parseInt(time.hours) + (isPM ? 12 : 0), "H");
    }

    setTime((prev) => ({ ...prev, isPM }));
  };

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: shakeAnimation.value }],
    }),
    [],
  );

  return (
    <View className={cn("flex-row items-center gap-4 mt-3", className)}>
      <Animated.View
        className="flex-1 gap-4 flex-row items-center justify-center border border-input rounded-lg native:h-12 web:py-1"
        style={animatedStyle}
        onLayout={(event) =>
          event?.target?.measureInWindow(
            (_, y, __, height) => (layout.current = { y, height }),
          )
        }
      >
        {mode.startsWith("H") && (
          <TextInput
            value={time.hours}
            returnKeyType="done"
            onChangeText={(v) => handleTimeChange(v, "H")}
            placeholderClassName="text-muted-foreground"
            className={cn(
              "flex-1 text-2xl android:text-xl web:text-lg text-center placeholder:text-muted-foreground android:bottom-0 p-0 outline-none ios:pb-1.5",
              isTimeValid ? "text-foreground" : "text-destructive",
            )}
            onFocus={() => onLayout(layout.current)}
            onBlur={clearFocused}
            keyboardType="numeric"
            placeholder="00"
            maxLength={2}
            ref={hRef}
          />
        )}
        {mode.includes("M") && (
          <>
            {"M" !== mode && <Text className="android:bottom-px">:</Text>}
            <TextInput
              value={time.minutes}
              returnKeyType="done"
              onChangeText={(v) => handleTimeChange(v, "M")}
              onKeyPress={(e) => handleBackspace("M", e)}
              placeholderClassName="text-muted-foreground"
              className={cn(
                "flex-1 text-2xl android:text-xl web:text-lg text-center placeholder:text-muted-foreground items-center justify-center outline-none ios:pb-1.5",
                isTimeValid ? "text-foreground" : "text-destructive",
              )}
              onFocus={() => onLayout(layout.current)}
              onBlur={clearFocused}
              keyboardType="numeric"
              placeholder="00"
              maxLength={2}
              ref={mRef}
            />
          </>
        )}
        {mode.includes("S") && (
          <>
            {"S" !== mode && <Text className="android:bottom-px">:</Text>}
            <TextInput
              value={time.seconds}
              returnKeyType="done"
              onChangeText={(v) => handleTimeChange(v, "S")}
              onKeyPress={(e) => handleBackspace("S", e)}
              placeholderClassName="text-muted-foreground"
              className={cn(
                "flex-1 text-2xl android:text-xl web:text-lg text-center placeholder:text-muted-foreground items-center justify-center outline-none ios:pb-1.5",
                isTimeValid ? "text-foreground" : "text-destructive",
              )}
              onFocus={() => onLayout(layout.current)}
              onBlur={clearFocused}
              keyboardType="numeric"
              placeholder="00"
              maxLength={2}
              ref={sRef}
            />
          </>
        )}
      </Animated.View>

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
