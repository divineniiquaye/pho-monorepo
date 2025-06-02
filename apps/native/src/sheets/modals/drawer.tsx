import React from "react";

import { SheetManager, SheetProps } from "@repo/bottom-sheet";
import { Button, Text, VStack } from "@repo/design/ui";
import { useDom as Load } from "@repo/design/lib";
import { Sheet, BottomSheet } from "../root";

const DOMComponent = Load(() => import("@repo/design/components/example/Drawer/charts"), {
  dom: { showsVerticalScrollIndicator: false },
});

export default function ModalScreen({ id }: SheetProps<"example">) {
  const [goal, setGoal] = React.useState(200);

  function onClick(adjustment: number) {
    setGoal(Math.max(200, Math.min(400, goal + adjustment)));
  }

  return (
    <Sheet id={id} className="rounded-3xl" enableDynamicSizing detached>
      <BottomSheet.ScrollView className="pt-2 px-4" showsVerticalScrollIndicator={false}>
        <VStack className="mx-auto w-full max-w-sm pb-safe gap-8">
          <VStack>
            <Text className="text-2xl font-semibold leading-none tracking-tight">
              Move Goal
            </Text>
            <Text className="text-lg text-muted-foreground">
              Set your daily activity goal.
            </Text>
          </VStack>
          <DOMComponent onClick={onClick} goal={goal} />
          <VStack className="gap-2 mb-2">
            <Button>
              <Text>Submit</Text>
            </Button>
            <Button variant="outline" onPress={() => SheetManager.hide(id)}>
              <Text>Cancel</Text>
            </Button>
          </VStack>
        </VStack>
      </BottomSheet.ScrollView>
    </Sheet>
  );
}
