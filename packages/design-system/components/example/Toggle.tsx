"use client";

import { View } from "react-native";
import * as React from "react";

import { Toggle, ToggleIcon } from "@repo/design/ui/toggle";
import { Bold } from "@repo/design/icons";

export function ToggleExample() {
  const [pressed, setPressed] = React.useState(false);
  return (
    <View className="flex-1 justify-center items-center p-6 gap-12">
      <Toggle
        pressed={pressed}
        onPressedChange={setPressed}
        aria-label="Toggle bold"
        variant="outline"
      >
        <ToggleIcon icon={Bold} size={18} />
      </Toggle>
    </View>
  );
}
