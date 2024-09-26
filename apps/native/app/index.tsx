import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AlertTriangle } from "lucide-react-native";
import { Platform, View } from "react-native";
import { toast } from "sonner-native";

import { Alert, AlertDescription, AlertTitle } from "@repo/ui/themed/alert";
import { useColorScheme } from "@repo/ui/hooks/useColorScheme";
import { Button } from "@repo/ui/themed/button";
import { Text } from "@repo/ui/themed/text";
import ScreenLayout from "@repo/ui/layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/themed/select";

export default function Native() {
  const { setColorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();

  const contentInsets = {
    top: insets.top,
    bottom: Platform.select({ ios: insets.bottom, android: insets.bottom + 24 }),
    left: 12,
    right: 12,
  };

  return (
    <ScreenLayout delay={-1} className="flex-col items-center">
      <Text role="heading" className="text-2xl text-center font-bold mb-2">
        Native
      </Text>
      <Button
        variant="default"
        onPress={() => {
          console.log("Pressed!");
          toast.custom(
            <Animated.View entering={FadeIn} exiting={FadeOut} className="w-[75%]">
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
      >
        <Text>Boop</Text>
      </Button>
      <View className="mt-10">
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
          <SelectContent insets={contentInsets} className="w-[250px]">
            <SelectItem label="System" value="system" />
            <SelectItem label="Light" value="light" />
            <SelectItem label="Dark" value="dark" />
          </SelectContent>
        </Select>
      </View>
    </ScreenLayout>
  );
}
