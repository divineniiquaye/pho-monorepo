import { SheetProps } from "react-native-bottom-sheet-manager";

import { Sheet, BottomSheet } from "../root";
import { VStack } from "@repo/design/ui/stack";
import { Text } from "@repo/design/ui";

export default function ModalScreen({ id }: SheetProps<"example">) {
  
  return (
    <Sheet id={id} enableDynamicSizing>
      <BottomSheet.View>
        <VStack className="mb-safe-offset-2 p-8">
          <Text>Hello World</Text>
        </VStack>
      </BottomSheet.View>
    </Sheet>
  );
}
