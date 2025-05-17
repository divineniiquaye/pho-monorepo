import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@repo/design/ui/dropdown-menu";
import { Text } from "@repo/design/ui/text";
import { Button } from "@repo/design/ui/button";
import { Languages } from "@repo/design/icons/Languages";
import { i18n, Locale, locales } from "@repo/design/lib/locale";

export function LocaleSwitcher({ className }: { className?: string }) {
  const [isPending, startTransition] = React.useTransition();

  function onChange(value: string) {
    const locale = value as Locale;
    i18n.changeLanguage(locale);
    startTransition(() => {});
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={`p-2 focus-visible:ring-offset-0 ${className}`}
          aria-label="Select Language"
          variant="outline"
        >
          <Languages className="text-muted-foreground size-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup value={i18n.language} onValueChange={onChange}>
          {locales.map((elt) => (
            <DropdownMenuRadioItem key={elt.id} value={elt.id}>
              <Text>{elt.name}</Text>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
