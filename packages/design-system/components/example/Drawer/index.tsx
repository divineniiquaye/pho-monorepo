import { Button } from "@repo/design/ui/button";
import { Text } from "@repo/design/ui/text";

export function DrawerExample({ onPress }: { onPress?: () => void }) {
  return (
    <Button variant="outline" onPress={onPress}>
      <Text>Open Drawer</Text>
    </Button>
  );
}
