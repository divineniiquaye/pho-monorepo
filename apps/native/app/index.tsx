import { ScrollView } from "react-native";
import { Link } from "expo-router";

import { useColorScheme } from "@repo/design/hooks";
import * as Typography from "@repo/design/ui/typography";
import { ScreenLayout } from "@repo/design/layout";
import { SheetManager } from "@repo/bottom-sheet";
import {
  Button,
  HStack,
  Progress,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Text,
  toast,
  VStack,
} from "@repo/design/ui";
import {
  AccordionExample,
  AlertDialogExample,
  AspectRatioExample,
  AvatarExample,
  CalendarExample,
  CheckboxExample,
  CollapsibleExample,
  ContextMenuExample,
  DialogExample,
  DrawerExample,
  DropdownMenuExample,
  HoverCardExample,
  InputOTPExample,
  LocaleSwitcher,
  MenubarExample,
  NavigationMenuExample,
  PopoverExample,
  RadioGroupExample,
  ResizableExample,
  SelectExample,
  SheetExample,
  SliderExample,
  SwitchExample,
  TableExample,
  TabsExample,
  ToggleExample,
  ToggleGroupExample,
  TooltipExample,
  BreadcrumbExample,
  PaginationExample,
  CommandExample,
  FormExample,
  SkeletonCard,
} from "@repo/design/components/example";

export default function Native() {
  const { setColorScheme } = useColorScheme();

  return (
    <ScreenLayout>
      <VStack className="mx-4 items-center">
        <Text role="heading" className="text-2xl text-center font-bold mb-2">
          Native
        </Text>
        <Button
          variant="default"
          onPress={() => {
            console.log("Pressed!");
            toast.info(
              "Testing the toaster. This is a long description. You can describe your toast in detail.",
              { position: "bottom-center" },
            );
            // alert("Pressed!");
          }}
        >
          <Text>Boop</Text>
        </Button>
        <HStack className="mt-4 gap-4 items-center">
          <Select
            onValueChange={(option) =>
              setColorScheme(option?.value as "system" | "light" | "dark")
            }
          >
            <SelectTrigger className="w-48">
              <SelectValue
                className="text-foreground text-sm native:text-lg"
                placeholder={i18n.t("Select a theme")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem label="System" value="system" />
              <SelectItem label="Light" value="light" />
              <SelectItem label="Dark" value="dark" />
            </SelectContent>
          </Select>
          <LocaleSwitcher />
        </HStack>
      </VStack>
      <ScrollView contentContainerClassName="gap-5">
        <HStack space="sm" className="items-baseline">
          <Typography.H2>@rn-primitives</Typography.H2>
          <Typography.P className="font-medium">
            Styled with{" "}
            <Link className="hover:underline" href="https://nativewind.dev">
              NativeWind
            </Link>
          </Typography.P>
        </HStack>
        <AccordionExample />
        <AlertDialogExample />
        <DrawerExample onPress={() => SheetManager.show("drawer")} />
        <Button variant="outline" onPress={() => SheetManager.show("example")}>
          <Text>Open Modal Sheet</Text>
        </Button>
        <AspectRatioExample />
        <AvatarExample />
        <CalendarExample />
        <CheckboxExample />
        <CollapsibleExample />
        <ContextMenuExample />
        <ResizableExample />
        <DialogExample />
        <DropdownMenuExample />
        <HoverCardExample />
        <MenubarExample />
        <NavigationMenuExample />
        <PopoverExample />
        <Progress value={50} />
        <RadioGroupExample />
        <SelectExample />
        <SkeletonCard />
        <Separator />
        <InputOTPExample />
        <SliderExample />
        <SwitchExample />
        <TableExample />
        <FormExample />
        <TabsExample />
        <BreadcrumbExample />
        <PaginationExample />
        <ToggleExample />
        <SheetExample />
        <ToggleGroupExample />
        <TooltipExample />
        <CommandExample />
      </ScrollView>
    </ScreenLayout>
  );
}
