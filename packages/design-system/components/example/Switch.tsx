"use client";

import { View } from "react-native";
import * as React from "react";

import { Switch } from "@repo/design/ui/switch";
import { Label } from "@repo/design/ui/label";

export function SwitchExample() {
  const [checked, setChecked] = React.useState(false);

  return (
    <View className="flex-row items-center gap-2">
      <Switch checked={checked} onCheckedChange={setChecked} nativeID="airplane-mode" />
      <Label
        nativeID="airplane-mode"
        onPress={() => {
          setChecked((prev) => !prev);
        }}
      >
        Airplane Mode
      </Label>
    </View>
  );
}
