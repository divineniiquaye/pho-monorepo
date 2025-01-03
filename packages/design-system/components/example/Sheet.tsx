"use client";

import { useState } from "react";
import { View } from "react-native";
import { Button } from "@repo/design/ui/button";
import { Input } from "@repo/design/ui/input";
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
      <SheetContent side="bottom">
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
            <Input id="name" value="Pedro Duarte" containerClassName="web:col-span-3" />
          </View>
          <View className="grid grid-cols-4 native:flex-row items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" value="@peduarte" containerClassName="web:col-span-3" />
          </View>

          <Button
            variant="outline"
            onPress={() => setShowAdditionalInfo(!showAdditionalInfo)}
          >
            <Text>{showAdditionalInfo ? "Hide" : "Show"} Additional Info</Text>
          </Button>

          {showAdditionalInfo && (
            <View className="border rounded-lg p-4 mt-2">
              <View className="grid grid-cols-4 native:flex-row items-center gap-4">
                <Label htmlFor="bio" className="text-right">
                  Bio
                </Label>
                <Input
                  id="bio"
                  placeholder="Tell us about yourself"
                  containerClassName="web:col-span-3"
                />
              </View>
              <View className="grid grid-cols-4 native:flex-row items-center gap-4 mt-4">
                <Label htmlFor="website" className="text-right">
                  Website
                </Label>
                <Input
                  id="website"
                  placeholder="https://your-website.com"
                  containerClassName="web:col-span-3"
                />
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
