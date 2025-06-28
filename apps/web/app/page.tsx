"use client";

import { useColorScheme } from "@repo/design/hooks/useColorScheme";
import * as Typography from "@repo/design/ui/typography";
import { HStack, VStack } from "@repo/design/ui/stack";
import { Separator } from "@repo/design/ui/separator";
import { Progress } from "@repo/design/ui/progress";
import { Button } from "@repo/design/ui/button";
import { toast } from "@repo/design/ui/sonner";
import { Text } from "@repo/design/ui/text";
import { i18n } from "@/locales";
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
  PaginationExample,
  PopoverExample,
  ResizableExample,
  SelectExample,
  SkeletonCard,
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
import { LocaleSwitcher } from "@repo/design/components/example/Locale";
import { CommandExample } from "@repo/design/components/example/Command";
import { BreadcrumbExample } from "@repo/design/components/example/Breadcrumb";
import { SidebarDialogExample } from "@repo/design/components/example/SidebarDialog";
import { ToggleGroupExample } from "@repo/design/components/example/ToggleGroup";
import { DrawerExample } from "@repo/design/components/example/Drawer";

export default function Web() {
  const { setColorScheme } = useColorScheme();

  return (
    <div className="flex flex-1 mt-10 flex-col text-center items-center px-4 md:mx-auto">
      <Typography.Lead className="mb-2">Web</Typography.Lead>
      <Button
        testID="button"
        onPress={() => {
          console.log("Pressed!");
          toast.info(
            "Testing the toaster. This is a long description. You can describe your toast in detail.",
          );
          // alert("Pressed!");
        }}
        variant="default"
      >
        <Text className="">Boop</Text>
      </Button>
      <HStack className="mt-4 gap-4 !items-center">
        <Select
          onValueChange={(option) =>
            setColorScheme(option?.value as "system" | "light" | "dark")
          }
        >
          <SelectTrigger className="w-44">
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
      <VStack space="md" className="my-3">
        <HStack space="sm" className="flex-wrap max-sm:justify-center">
          <Typography.H1>@rn-primitives</Typography.H1>
          <Typography.P className="font-medium">
            Styled with{" "}
            <a className="hover:underline" href="https://nativewind.dev">
              NativeWind
            </a>
          </Typography.P>
        </HStack>
        <AccordionExample />
        <AlertDialogExample />
        <DrawerExample />
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
        <SheetExample />
        <ToggleExample />
        <ToggleGroupExample />
        <TooltipExample />
        <SidebarDialogExample />
        <CommandExample />
      </VStack>
    </div>
  );
}
