"use client";

import { View } from "react-native";
import * as React from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/design/ui/collapsible";
import { ChevronsDownUp, ChevronsUpDown } from "@repo/design/icons";
import { Button } from "@repo/design/ui/button";
import { Text } from "@repo/design/ui/text";

export function CollapsibleExample() {
  const [open, setOpen] = React.useState(false);
  return (
    <Collapsible asChild open={open} onOpenChange={setOpen}>
      <View>
        <View className="w-full gap-2">
          <View className="flex flex-row items-center justify-between space-x-4 px-4">
            <Text className="text-foreground text-sm native:text-lg font-semibold">
              @peduarte starred 3 repositories
            </Text>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon">
                {open ? (
                  <ChevronsDownUp size={16} className="text-foreground" />
                ) : (
                  <ChevronsUpDown size={16} className="text-foreground" />
                )}
                <Text className="sr-only">Toggle</Text>
              </Button>
            </CollapsibleTrigger>
          </View>
          <View className="rounded-md border border-border px-4 py-3 ">
            <Text className="text-foreground text-sm native:text-lg">
              @radix-ui/primitives
            </Text>
          </View>
          <CollapsibleContent className="gap-2">
            <CollapsibleItem>@radix-ui/react</CollapsibleItem>
            <CollapsibleItem>@stitches/core</CollapsibleItem>
          </CollapsibleContent>
        </View>
      </View>
    </Collapsible>
  );
}

function CollapsibleItem({ children }: { children: string }) {
  return (
    <View className="rounded-md border border-border px-4 py-3">
      <Text className="text-foreground text-base">{children}</Text>
    </View>
  );
}
