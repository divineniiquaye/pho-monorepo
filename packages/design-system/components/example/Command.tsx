import React from "react";
import { View } from "react-native";
import { Calculator, Calendar, CreditCard, Settings, Smile, User } from "@repo/design/icons";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@repo/design/ui/command";
import { Text } from "@repo/design/ui/text";
import { Button } from "@repo/design/ui/button";
import isWeb from "@repo/design/lib/isWeb";

export function CommandExample() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    global?.addEventListener?.("keydown", down);
    return () => global?.removeEventListener?.("keydown", down);
  }, []);

  return (
    <View className="flex-1">
      <Button
        onPress={() => setOpen((open) => !open)}
        variant="outline"
        className="web:flex-row web:gap-4"
      >
        <Text>Open Command</Text>
        {isWeb && (
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>J
          </kbd>
        )}
      </Button>
      {/* <Command className="rounded-lg border border-border shadow-md md:min-w-[450px]"> */}
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className="rounded-lg border border-border shadow-md min-w-[330px] md:min-w-[450px]"
      >
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <Calendar size={20} className="text-foreground" />
              <Text>Calendar</Text>
            </CommandItem>
            <CommandItem>
              <Smile size={20} className="text-foreground" />
              <Text>Search Emoji</Text>
            </CommandItem>
            <CommandItem disabled>
              <Calculator size={20} className="text-foreground" />
              <Text>Calculator</Text>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <User size={20} className="text-foreground" />
              <Text>Profile</Text>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <CreditCard size={20} className="text-foreground" />
              <Text>Billing</Text>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Settings size={20} className="text-foreground" />
              <Text>Settings</Text>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </View>
  );
}
