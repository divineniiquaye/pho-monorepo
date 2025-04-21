"use client";

import { useState } from "react";
import { View } from "react-native";
import { Button } from "@repo/design/ui/button";
import { Input, InputField } from "@repo/design/ui/input";
import { Label } from "@repo/design/ui/label";
import { Text } from "@repo/design/ui/text";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@repo/design/ui/sheet";

export function SheetExample() {
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Text>Open Sheet</Text>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <View className="grid native:w-full gap-4 py-4">
          <View className="grid grid-cols-4 native:flex-row items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input className="web:col-span-3 native:flex-1">
              <InputField id="name" value="Pedro Duarte" />
            </Input>
          </View>
          <View className="grid grid-cols-4 native:flex-row items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input className="web:col-span-3 native:flex-1">
              <InputField id="username" value="@peduarte" />
            </Input>
          </View>

          <Button
            variant="outline"
            onPress={() => setShowAdditionalInfo(!showAdditionalInfo)}
          >
            <Text>{showAdditionalInfo ? "Hide" : "Show"} Additional Info</Text>
          </Button>

          {showAdditionalInfo && (
            <View className="border border-foreground rounded-lg p-4 mt-2">
              <View className="grid grid-cols-4 native:flex-row items-center gap-4">
                <Label htmlFor="bio" className="text-right">
                  Bio
                </Label>
                <Input className="web:col-span-3 native:flex-1">
                  <InputField id="bio" placeholder="Tell us about yourself" />
                </Input>
              </View>
              <View className="grid grid-cols-4 native:flex-row items-center gap-4 mt-4">
                <Label htmlFor="website" className="text-right">
                  Website
                </Label>
                <Input className="web:col-span-3 native:flex-1">
                  <InputField id="website" placeholder="https://your-website.com" />
                </Input>
              </View>
            </View>
          )}
        </View>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">
              <Text>Save changes</Text>
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
