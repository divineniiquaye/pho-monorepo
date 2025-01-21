import { Link } from "expo-router";

import { useColorScheme } from "@repo/design/hooks/useColorScheme";
import * as Typography from "@repo/design/ui/typography";
import { Separator } from "@repo/design/ui/separator";
import { Progress } from "@repo/design/ui/progress";
import { Button } from "@repo/design/ui/button";
import { HStack } from "@repo/design/ui/stack";
import ScreenLayout from "@repo/design/layout";
import { toast } from "@repo/design/ui/sonner";
import { Text } from "@repo/design/ui/text";
import i18n from "@/locales";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/design/ui/select";
import {
  AccordionExample,
  AlertDialogExample,
  AspectRatioExample,
  AvatarExample,
  CalendarExample,
  DialogExample,
  DropdownMenuExample,
  HoverCardExample,
  InputOTPExample,
  PopoverExample,
  ResizableExample,
  SelectExample,
  TableExample,
  TooltipExample,
} from "@repo/design/components/example";
import { CheckboxExample } from "@repo/design/components/example/Checkbox";
import { CollapsibleExample } from "@repo/design/components/example/Collapsible";
import { ContextMenuExample } from "@repo/design/components/example/ContextMenu";
import { MenubarExample } from "@repo/design/components/example/Menubar";
import { NavigationMenuExample } from "@repo/design/components/example/NavigationMenu";
import { RadioGroupExample } from "@repo/design/components/example/RadioGroup";
import { SliderExample } from "@repo/design/components/example/Slider";
import { SwitchExample } from "@repo/design/components/example/Switch";
import { TabsExample } from "@repo/design/components/example/Tabs";
import { ToggleExample } from "@repo/design/components/example/Toggle";
import { SheetExample } from "@repo/design/components/example/Sheet";
import { FormExample } from "@repo/design/components/example/Form";
import { CommandExample } from "@repo/design/components/example/Command";
import { BreadcrumbExample } from "@repo/design/components/example/Breadcrumb";
import { ToggleGroupExample } from "@repo/design/components/example/ToggleGroup";
import { LocaleSwitcher } from "@repo/design/components/example/Locale";
import { ScrollView } from "react-native";

export default function Native() {
  const { setColorScheme } = useColorScheme();

  return (
    <ScreenLayout delay={false} className="flex-col items-center">
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
      <ScrollView contentContainerClassName="gap-5" className="my-3 w-full">
        <HStack space="sm" className="items-baseline">
          <Typography.H2>@rn-primitives</Typography.H2>
          <Typography.P className="font-medium">
            Styled with{" "}
            <Link
              className="hover:underline"
              href="https://www.nativewind.dev/v4/overview"
            >
              NativeWind
            </Link>
          </Typography.P>
        </HStack>
        <AccordionExample />
        <AlertDialogExample />
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
        <Separator />
        <InputOTPExample />
        <SliderExample />
        <SwitchExample />
        <TableExample />
        <FormExample />
        <TabsExample />
        <BreadcrumbExample />
        <ToggleExample />
        <SheetExample />
        <ToggleGroupExample />
        <TooltipExample />
        <CommandExample />
      </ScrollView>
    </ScreenLayout>
  );
}
