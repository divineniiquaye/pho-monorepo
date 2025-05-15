"use client";

import { View } from "react-native";
import * as React from "react";

import { Button, ButtonProps, buttonVariants } from "./button";
import { MoreHorizontal } from "../icons/MoreHorizontal";
import { ChevronRight } from "../icons/ChevronRight";
import { ChevronLeft } from "../icons/ChevronLeft";
import { cn } from "../lib/utils";
import { Text } from "./text";

const Pagination = ({ className, ...props }: React.ComponentProps<typeof View>) => (
  <View
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  React.ComponentRef<typeof View>,
  React.ComponentProps<typeof View>
>(({ className, ...props }, ref) => (
  <View
    role="list"
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  React.ComponentRef<typeof View>,
  React.ComponentProps<typeof View>
>(({ className, ...props }, ref) => (
  <View ref={ref} role="listitem" className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<typeof Button>;

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  children,
  ...props
}: PaginationLinkProps) => (
  <Button
    aria-current={isActive ? "page" : undefined}
    variant={isActive ? "link" : "ghost"}
    size={size}
    className={cn(
   
      className,
    )}
    {...props}
  >
    {typeof children === "string" ? <Text>{children}</Text> : children}
  </Button>
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5 flex-row", className)}
    {...props}
  >
    <ChevronLeft className="h-5 w-5 text-foreground" />
    <Text>Previous</Text>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5 flex-row", className)}
    {...props}
  >
    <Text>Next</Text>
    <ChevronRight className="h-5 w-5 text-foreground" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<typeof View>) => (
  <View
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-5 w-5 text-foreground" />
    <Text className="sr-only">More pages</Text>
  </View>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
