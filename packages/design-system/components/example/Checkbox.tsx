"use client";

import { View } from "react-native";
import * as React from "react";

import { Checkbox } from "@repo/design/ui/checkbox";
import { Label } from "@repo/design/ui/label";

export function CheckboxExample() {
  const [checked, setChecked] = React.useState(false);
  return (
    <View className="flex-row gap-3 items-center">
      <Checkbox id="terms" checked={checked} onCheckedChange={setChecked} />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </View>
  );
}
