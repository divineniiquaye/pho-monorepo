import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import React from "react";

import { SheetManager, SheetProps, useSheetRef } from "@repo/bottom-sheet";
import { ChevronDown, ChevronUp } from "@repo/design/icons";
import { Button, Text, VStack } from "@repo/design/ui";

import { Sheet, BottomSheet } from "../root";

export default function ModalScreen({ id }: SheetProps<"example">) {
  const [expand, setExpand] = React.useState(false);
  const sheetRef = useSheetRef();

  const pulse = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: Math.sin(pulse.value) * 4 }],
  }));

  React.useEffect(() => {
    pulse.value = withRepeat(
      withTiming(4 * Math.PI, { duration: 2000, easing: Easing.linear }),
    );
  }, []);

  return (
    <Sheet
      id={id}
      className="rounded-3xl"
      snapPoints={["60%", "100%"]}
      onChange={(index) => setExpand(index === 1)}
    >
      <BottomSheet.View className="pt-6 px-4 pb-safe h-full justify-between">
        <VStack space="xl">
          <Text className="text-2xl text-center">Modal Sheet</Text>
          <Text className="my-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
            ut labore et dolore magna aliqua. Ut enim ad minim Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna
            aliqua. Ut enim ad minim
          </Text>
          <Button
            variant="ghost"
            onPress={() => {
              setExpand(!expand);
              sheetRef.current.snapToIndex(expand ? 0 : 1);
            }}
          >
            <Animated.View style={animatedStyle}>
              {expand ? (
                <ChevronUp size={36} className="text-foreground" />
              ) : (
                <ChevronDown size={36} className="text-foreground" />
              )}
            </Animated.View>
          </Button>
        </VStack>
        <Button onPress={() => SheetManager.hide(id)}>
          <Text>Close</Text>
        </Button>
      </BottomSheet.View>
    </Sheet>
  );
}
