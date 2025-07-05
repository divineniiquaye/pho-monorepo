"use client";

import { View } from "react-native";
import React from "react";

export * from "./Breadcrumb";
export * from "./Checkbox";
export * from "./Drawer";
export * from "./Checkbox";
export * from "./Collapsible";
export * from "./Command";
export * from "./ContextMenu";
export * from "./Form";
export * from "./Locale";
export * from "./Menubar";
export * from "./NavigationMenu";
export * from "./RadioGroup";
export * from "./Sheet";
export * from "./Sidebar";
export * from "./SidebarDialog";
export * from "./Slider";
export * from "./Switch";
export * from "./Tabs";
export * from "./Toggle";
export * from "./ToggleGroup";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/design/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@repo/design/ui/alert-dialog";
import { AspectRatio } from "@repo/design/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/design/ui/avatar";
import { Button } from "@repo/design/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/design/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@repo/design/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@repo/design/ui/hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/design/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@repo/design/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/design/ui/table";
import { Text } from "@repo/design/ui/text";
import { Input, InputField } from "@repo/design/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@repo/design/ui/tooltip";
import { Skeleton, SkeletonText } from "@repo/design/ui/skeleton";
import * as Typography from "@repo/design/ui/typography";
import { Calendar } from "@repo/design/ui/calender";
import {
  CalendarDays,
  Cloud,
  Github,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  UserPlus,
  Users,
} from "@repo/design/icons";
import { DateRange } from "@repo/design/ui/calender/types";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@repo/design/ui/input-otp";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@repo/design/ui/resizable";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@repo/design/ui/pagination";

export function AccordionExample() {
  return (
    <Accordion type="multiple" collapsible defaultValue={["item-1"]}>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <Text>Is it accessible?</Text>
        </AccordionTrigger>
        <AccordionContent>
          <Text>Yes. It adheres to the WAI-ARIA design pattern.</Text>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>
          <Text>What are universal components?</Text>
        </AccordionTrigger>
        <AccordionContent>
          <Text>
            In the world of React Native, universal components are components that work on
            both web and native platforms.
          </Text>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>
          <Text>Is this component universal?</Text>
        </AccordionTrigger>
        <AccordionContent>
          <Text>Yes. Try it out on the web, iOS, and/or Android.</Text>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export function AlertDialogExample() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <Text>Show Alert Dialog</Text>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account and
            remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <Text>Cancel</Text>
          </AlertDialogCancel>
          <AlertDialogAction>
            <Text>Continue</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function AspectRatioExample() {
  return (
    <AspectRatio ratio={16 / 9}>
      <View className="bg-blue-500 h-full w-full rounded-lg flex flex-col gap-2 justify-center items-center">
        <Typography.H1 className="text-white">16:9</Typography.H1>
        <Typography.Small className="text-white">Aspect-ratio</Typography.Small>
      </View>
    </AspectRatio>
  );
}

const GITHUB_AVATAR_URI = "https://github.com/mrzachnugent.png";

export function AvatarExample() {
  return (
    <Avatar alt="Zach Nugent's Avatar">
      <AvatarImage source={{ uri: GITHUB_AVATAR_URI }} />
      <AvatarFallback>
        <Text>ZN</Text>
      </AvatarFallback>
    </Avatar>
  );
}

export function CalendarExample() {
  // const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [date, setDate] = React.useState<DateRange>({ from: new Date() });

  return (
    <Calendar
      mode="range"
      selected={date}
      onSelect={setDate}
      captionLayout="dropdown"
      timestamp="H:M:S"
      // hideWeekdays
      // showOutsideDays={false}
      // classNames={{
      //   chevronRight: "invisible"
      // }}
      expandable
      // showWeekNumber

      className="web:max-w-[350px] web:self-center"
    />
  );
}

export function DialogExample() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Text>Edit Profile</Text>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <View className="p-2">
          <Input>
            <InputField id="username" value="@peduarte" placeholder="Username" />
          </Input>
        </View>

        <DialogFooter>
          <DialogClose asChild>
            <Button>
              <Text>OK</Text>
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DropdownMenuExample() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Text>Open</Text>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 native:w-72">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Users className="text-foreground" size={14} />
            <Text>Team</Text>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <UserPlus className="text-foreground" size={14} />
              <Text>Invite users</Text>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>
                <Mail className="text-foreground" size={14} />
                <Text>Email</Text>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageSquare className="text-foreground" size={14} />
                <Text>Message</Text>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <PlusCircle className="text-foreground" size={14} />
                <Text>More...</Text>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem>
            <Plus className="text-foreground" size={14} />
            <Text>New Team</Text>
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Github className="text-foreground" size={14} />
          <Text>GitHub</Text>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LifeBuoy className="text-foreground" size={14} />
          <Text>Support</Text>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Cloud className="text-foreground" size={14} />
          <Text>API</Text>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="text-foreground" size={14} />
          <Text>Log out</Text>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function HoverCardExample() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link" size="lg">
          <Text>@nextjs</Text>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 native:w-96">
        <View className="flex flex-row justify-between gap-4">
          <Avatar alt="Vercel avatar">
            <AvatarImage source={{ uri: "https://github.com/vercel.png" }} />
            <AvatarFallback>
              <Text>VA</Text>
            </AvatarFallback>
          </Avatar>
          <View className="gap-1 flex-1">
            <Text className="text-sm native:text-base font-semibold block">@nextjs</Text>
            <Text className="text-sm native:text-base">
              The React Framework – created and maintained by @vercel.
            </Text>
            <View className="flex flex-row items-center pt-2 gap-2">
              <CalendarDays size={14} className="text-foreground opacity-70" />
              <Text className="text-xs native:text-sm text-muted-foreground">
                Joined December 2021
              </Text>
            </View>
          </View>
        </View>
      </HoverCardContent>
    </HoverCard>
  );
}

export function InputOTPExample() {
  return (
    <InputOTP maxLength={6} containerClassName="flex-row justify-center">
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
}

export function PaginationExample() {
  return (
    <Pagination className="items-center">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onPress={() => console.log("#")} />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink onPress={() => console.log("#")}>1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink onPress={() => console.log("#")} isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink onPress={() => console.log("#")}>3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext onPress={() => console.log("#")} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export function PopoverExample() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Text>Open popover</Text>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <View className="web:grid gap-4">
          <View className="space-y-2">
            <Text className="font-medium leading-none native:text-xl block">
              Dimensions
            </Text>
            <Text className="text-sm text-muted-foreground">
              Set the dimensions for the layer.
            </Text>
          </View>
        </View>
      </PopoverContent>
    </Popover>
  );
}

export function ResizableExample() {
  return (
    <ResizablePanelGroup
      direction="vertical"
      className="min-h-[300px] max-w-md rounded-lg border border-border md:min-w-[450px] self-center"
    >
      <ResizablePanel defaultSize={25}>
        <View className="flex h-full items-center justify-center p-3 web:p-6">
          <Text className="font-semibold">Header</Text>
        </View>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <View className="flex h-full items-center justify-center p-6">
          <Text className="font-semibold">Content</Text>
        </View>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={25}>
        <View className="flex h-full items-center justify-center p-3 wen:p-6">
          <Text className="font-semibold">Footer</Text>
        </View>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export function SelectExample() {
  return (
    <Select defaultValue={{ value: "apple", label: "Apple" }} className="z-10">
      <SelectTrigger>
        <SelectValue
          className="text-foreground text-sm native:text-lg"
          placeholder="Select a fruit"
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem label="Apple" value="apple" />
          <SelectItem label="Banana" value="banana" />
          <SelectItem label="Blueberry" value="blueberry" />
          <SelectItem label="Grapes" value="grapes" />
          <SelectItem label="Pineapple" value="pineapple" />
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export function SkeletonCard() {
  return (
    <View className="w-full overflow-hidden gap-4 p-3 rounded-md">
      <Skeleton className="h-[150px]" />
      <SkeletonText _lines={3} className="h-3" />
      <View className="flex-row gap-2 items-center">
        <Skeleton variant="circular" className="size-[24px] mr-2" />
        <SkeletonText _lines={2} gap={1} className="h-2 w-2/5" />
      </View>
    </View>
  );
}

export function TooltipExample() {
  return (
    <Tooltip delayDuration={150}>
      <TooltipTrigger asChild>
        <Button variant="outline">
          <Text>Hover me</Text>
        </Button>
      </TooltipTrigger>
      <TooltipContent className="p-24">
        <Text className="native:text-lg">Add to library</Text>
      </TooltipContent>
    </Tooltip>
  );
}

export function TableExample() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Text>Head</Text>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>
            <Text>Cell</Text>
          </TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>
            <Text>Footer</Text>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
