import { useDom } from "@repo/design/lib/use-dom";
import { Button } from "@repo/design/ui/button";
import { Text } from "@repo/design/ui/text";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@repo/design/ui/drawer";
import React from "react";

const DOMComponent = useDom(() => import("./charts"));

export function DrawerExample() {
  const [goal, setGoal] = React.useState(200);

  function onClick(adjustment: number) {
    setGoal(Math.max(200, Math.min(400, goal + adjustment)));
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <Text>Open Drawer</Text>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="mx-auto w-full max-w-sm h-44">
        <DrawerHeader>
          <DrawerTitle>Move Goal</DrawerTitle>
          <DrawerDescription>Set your daily activity goal.</DrawerDescription>
        </DrawerHeader>
        <DOMComponent onClick={onClick} goal={goal} />
        <DrawerFooter className="mt-2 mb-safe-offset-2 gap-2">
          <Button>
            <Text>Submit</Text>
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">
              <Text>Cancel</Text>
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
