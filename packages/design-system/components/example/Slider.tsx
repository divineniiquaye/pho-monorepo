"use client";

import { Pressable, View, Text } from "react-native";
import * as React from "react";

import { Slider } from "@repo/design/ui/slider";

export function SliderExample() {
  const [value, setValue] = React.useState(50);

  return (
    <>
      <View className="flex-1 justify-center items-center p-6 gap-12">
        <Pressable
          onPress={() => {
            setValue(Math.floor(Math.random() * 100));
          }}
        >
          <Text className="text-5xl text-center text-foreground">
            {Math.round(value)}
          </Text>
        </Pressable>
        <Slider
          value={value}
          onValueChange={(vals) => {
            const nextValue = vals[0];
            if (typeof nextValue !== "number") return;
            setValue(nextValue);
          }}
          max={100}
          step={5}
        />
      </View>
    </>
  );
}
