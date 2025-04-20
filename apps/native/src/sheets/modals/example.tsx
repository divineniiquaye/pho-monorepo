import { SheetProps } from "react-native-bottom-sheet-manager";

import { Sheet, BottomSheet } from "../root";
import { VStack } from "@repo/design/ui/stack";
// import { i18n } from "@/locales";

export default function ModalScreen({ id }: SheetProps<"select-token">) {
  
  return (
    <Sheet id={id} enableDynamicSizing>
      <BottomSheet.View>
        <VStack className="mb-safe-offset-2">
          <Text>Hello World</Text>
        </VStack>
      </BottomSheet.View>
    </Sheet>
  );
}
