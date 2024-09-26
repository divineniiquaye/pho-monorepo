"use client";

import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { AlertTriangle } from "lucide-react-native";
import { toast } from "sonner-native";

import { Alert, AlertDescription, AlertTitle } from "@repo/ui/themed/alert";
import { useColorScheme } from "@repo/ui/hooks/useColorScheme";
import { Button } from "@repo/ui/themed/button";
import { Text } from "@repo/ui/themed/text";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/themed/select";

export default function Web() {
  const { setColorScheme } = useColorScheme();

  return (
    <div className="flex flex-1 mt-10 flex-col text-center items-center">
      <h1 className="text-2xl text-foreground font-bold mb-2">Web</h1>
      <Button
        testID="button"
        onPress={() => {
          console.log("Pressed!");
          toast.custom(
            <Animated.View entering={FadeIn} exiting={FadeOut} className="max-w-lg">
              <Alert icon={AlertTriangle} variant="destructive">
                <AlertTitle>Toast!</AlertTitle>
                <AlertDescription>
                  Testing the toaster. This is a long description. You can describe your
                  toast in detail.
                </AlertDescription>
              </Alert>
            </Animated.View>,
          );
          // alert("Pressed!");
        }}
        variant="default"
      >
        <Text className="">Boop</Text>
      </Button>
      <div className="mt-10 space-y-2">
        <Text className="text-center text-muted-foreground pb-2">Theme Switch</Text>
        <Select
          onValueChange={(option) =>
            setColorScheme(option?.value as "system" | "light" | "dark")
          }
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue
              className="text-foreground text-sm native:text-lg"
              placeholder="Select a theme"
            />
          </SelectTrigger>
          <SelectContent className="w-[250px]">
            <SelectItem label="System" value="system" />
            <SelectItem label="Light" value="light" />
            <SelectItem label="Dark" value="dark" />
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
