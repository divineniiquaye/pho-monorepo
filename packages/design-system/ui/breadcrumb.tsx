import { Pressable, View } from "react-native";
import * as Slot from "@rn-primitives/slot";
import * as React from "react";

import { ChevronRight } from "@repo/design/icons/ChevronRight";
import { MoreHorizontal } from "@repo/design/icons/MoreHorizontal";
import { Text, TextClassContext } from "./text";
import isWeb from "@repo/design/lib/isWeb";
import { cn } from "@repo/design/lib/utils";
import {
  PressableRef,
  SlottablePressableProps,
  SlottableTextProps,
  TextRef,
  ViewRef,
} from "@rn-primitives/types";

const Breadcrumb = React.forwardRef<
  ViewRef,
  React.ComponentProps<typeof View> & {
    separator?: React.ReactNode;
  }
>(({ ...props }, ref) => (
  <View ref={ref} aria-label="breadcrumb" role="navigation" {...props} />
));
Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = React.forwardRef<
  ViewRef,
  React.ComponentProps<typeof View>
>(({ className, ...props }, ref) => (
  <View
    ref={ref}
    role="list"
    className={cn(
      "flex flex-row flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
      className,
    )}
    {...props}
  />
));
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = React.forwardRef<
  ViewRef,
  React.ComponentProps<typeof View>
>(({ className, ...props }, ref) => (
  <View
    ref={ref}
    role="listitem"
    className={cn("inline-flex items-center gap-1.5", className)}
    {...props}
  />
));
BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = React.forwardRef<PressableRef, SlottablePressableProps>(
  ({ asChild, className, children, ...props }, ref) => {
    const Comp = asChild ? Slot.Pressable : Pressable;

    return (
      <TextClassContext.Provider value="transition-colors text-muted-foreground hover:text-foreground">
        <Comp ref={ref} className={className} role="link" {...props}>
          {typeof children === "string" ? <Text>{children}</Text> : children}
        </Comp>
      </TextClassContext.Provider>
    );
  },
);
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, ...props }, ref) => (
    <Text
      ref={ref}
      role="link"
      aria-disabled
      aria-current="page"
      className={cn("font-normal !text-foreground", className)}
      {...props}
    />
  ),
);
BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof View>) => (
  <View
    role="presentation"
    aria-hidden
    className={cn("[&>svg]:w-3.5 [&>svg]:h-3.5", className)}
    {...props}
  >
    {children ?? <ChevronRight size={14} className="text-foreground" />}
  </View>
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

const BreadcrumbEllipsis = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Text>) => (
  <Text
    role="presentation"
    aria-hidden={true}
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    {children ?? <MoreHorizontal className="h-4 w-4 text-muted-foreground" />}
    {isWeb && <span className="sr-only">More</span>}
  </Text>
);
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis";

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
