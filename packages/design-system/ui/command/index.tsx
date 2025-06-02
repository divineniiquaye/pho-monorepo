import { Pressable, TextInput, View } from "react-native";
import * as React from "react";

import { SlottableWithNestedChildren } from "@repo/design/lib/as-child";
import { Search } from "@repo/design/icons/Search";
import { cn } from "@repo/design/lib/utils";

import { Dialog, DialogContent, DialogTitle } from "../dialog";
import { Text, TextClassContext } from "../text";
import { commandScore } from "./command-score";
import { Separator } from "../separator";

type State = {
  search: string;
  value: string;
  filtered: { count: number; items: Map<string, number>; groups: Set<string> };
};

type Context = {
  setState: <K extends keyof State>(key: K, value: State[K], opts?: any) => void;
  value: (id: string, value: string, keywords?: string[]) => void;
  item: (id: string, groupId: string) => () => void;
  group: (id: string) => () => void;
  filter: () => boolean;
  // Ids
  listId: string;
  labelId: string;
  inputId: string;
};

type CommandProps = React.ComponentProps<typeof View> & {
  /**
   * Optional default item value when it is initially rendered.
   */
  defaultValue?: string;

  /**
   * Optional controlled state of the selected command menu item.
   */
  value?: string;

  /**
   * Optionally set to `false` to turn off the automatic filtering and sorting.
   * If `false`, you must conditionally render valid items based on the search query yourself.
   */
  shouldFilter?: boolean;

  /**
   * Custom filter function for whether each command menu item should matches the given search query.
   * It should return a number between 0 and 1, with 1 being the best match and 0 being hidden entirely.
   * By default, uses the `command-score` library.
   */
  filter?: (value: string, search: string, keywords?: string[]) => number;

  /**
   * Event handler called when the selected item of the menu changes.
   */
  onValueChange?: (value: string) => void;
};

const defaultFilter: CommandProps["filter"] = (value, search, keywords) =>
  commandScore(value, search, keywords ?? []);

const CommandContext = React.createContext({} as { state: State; context: Context });
const GroupContext = React.createContext(
  undefined as unknown as { id: string; forceMount?: boolean },
);

const CommandProvider: React.FC<
  React.PropsWithChildren<{ state: State; context: Context }>
> = ({ children, ...props }) => (
  <CommandContext.Provider value={props}>{children}</CommandContext.Provider>
);

const Command = React.forwardRef<React.ComponentRef<typeof View>, CommandProps>(
  ({ className, ...props }, ref) => {
    const listId = React.useId();
    const labelId = React.useId();
    const inputId = React.useId();

    const state = React.useRef<State>({
      search: "",
      value: props.value ?? props.defaultValue ?? "",
      filtered: {
        count: -1,
        items: new Map(),
        groups: new Set(),
      },
    });

    const [filteredState, setFilteredState] = React.useState<State>(state.current);

    const allItems = React.useRef<Set<string>>(new Set());
    const allGroups = React.useRef<Map<string, Set<string>>>(new Map());
    const ids = React.useRef<Map<string, { value: string; keywords?: string[] }>>(
      new Map(),
    );

    const propsRef = React.useRef(props);
    React.useEffect(() => {
      propsRef.current = props;
    });

    const context: Context = React.useMemo(
      () => ({
        setState: (key, value, opts) => {
          if (Object.is(state.current[key], value)) return;
          state.current[key] = value;

          if (key === "search") {
            filterItems(); // Filter synchronously before emitting back to children
          } else if (key === "value") {
            if (!opts) {
              // TODO: Scroll the selected item into view
            }
            if (propsRef.current?.value !== undefined) {
              const newValue = (value ?? "") as string;
              propsRef.current.onValueChange?.(newValue);
              return;
            }
          }

          setFilteredState({ ...state.current }); // Trigger UI update
        },
        value: (id, value, keywords) => {
          if (value !== ids.current.get(id)?.value) {
            ids.current.set(id, { value, keywords });
            state.current.filtered.items.set(id, score(value, keywords) ?? 0);
          }
        },
        item: (id, groupId) => {
          allItems.current.add(id);

          if (groupId) {
            if (!allGroups.current.has(groupId)) {
              allGroups.current.set(groupId, new Set([id]));
            } else {
              allGroups.current.get(groupId)?.add(id);
            }
          }

          return () => {
            ids.current.delete(id);
            allItems.current.delete(id);
            state.current.filtered.items.delete(id);
          };
        },
        group: (id) => {
          if (!allGroups.current.has(id)) {
            allGroups.current.set(id, new Set());
          }

          return () => {
            ids.current.delete(id);
            allGroups.current.delete(id);
          };
        },
        filter: () => propsRef.current.shouldFilter ?? true,
        listId,
        inputId,
        labelId,
      }),
      [],
    );

    function score(value: string, keywords?: string[]) {
      const filter = propsRef.current?.filter ?? defaultFilter;
      return value ? filter?.(value, state.current.search, keywords) : 0;
    }

    function filterItems() {
      if (!state.current.search || propsRef.current.shouldFilter === false) {
        state.current.filtered.count = allItems.current.size;
        setFilteredState({ ...state.current }); // Update UI
        return;
      }

      state.current.filtered.groups = new Set();
      let itemCount = 0;

      for (const id of allItems?.current) {
        const value = ids.current.get(id)?.value ?? "";
        const keywords = ids.current.get(id)?.keywords ?? [];
        const rank = score(value, keywords);
        state.current.filtered.items.set(id, rank ?? 0);
        if ((rank ?? 0) > 0) itemCount++;
      }

      for (const [groupId, group] of allGroups.current) {
        for (const itemId of group) {
          if ((state.current.filtered.items.get(itemId) ?? 0) > 0) {
            state.current.filtered.groups.add(groupId);
            break;
          }
        }
      }

      state.current.filtered.count = itemCount;
      setFilteredState({ ...state.current }); // Update UI
    }

    return (
      <CommandProvider state={filteredState} context={context}>
        <View
          ref={ref}
          className={cn(
            "flex web:h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
            className,
          )}
          {...props}
        />
      </CommandProvider>
    );
  },
);
Command.displayName = "Command";

const CommandDialog = ({
  children,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelBy,
  ...props
}: React.PropsWithChildren<React.ComponentPropsWithoutRef<typeof Dialog>>) => (
  <Dialog {...props}>
    <DialogTitle children={ariaLabel} />
    <DialogContent
      className={cn("overflow-hidden p-0 shadow-lg", className)}
      aria-labelledby={ariaLabelBy}
    >
      <Command>{children}</Command>
    </DialogContent>
  </Dialog>
);

const CommandInput = React.forwardRef<
  React.ComponentRef<typeof TextInput>,
  Omit<React.ComponentPropsWithoutRef<typeof TextInput>, "value" | "onChange"> & {
    /**
     * Optional controlled state for the value of the search input.
     */
    value?: string;
    /**
     * Event handler called when the search value changes.
     */
    onValueChange?: (search: string) => void;
  }
>(({ className, onValueChange, ...props }, ref) => {
  const { state, context } = React.useContext(CommandContext);
  const isControlled = props.value != null;

  return (
    <View className="flex flex-row items-center border-b border-b-border px-3">
      <Search className="mr-2 size-4 text-foreground opacity-50" />
      <View className="flex-1 h-full">
        <TextInput
          ref={ref}
          role="combobox"
          autoComplete="off"
          spellCheck={false}
          aria-autocomplete="list"
          id={context.inputId}
          aria-controls={context.listId}
          aria-labelledby={context.labelId}
          value={isControlled ? props.value : state.search}
          onChangeText={(text) => {
            if (!isControlled) context.setState("search", text);
            onValueChange?.(text);
          }}
          className={cn(
            "web:flex mb-1 w-full border-0 outline-none rounded-md bg-transparent py-3 text-base leading-[1.25] text-foreground placeholder:text-muted-foreground placeholder:opacity-50",
            className,
          )}
          {...props}
        />
      </View>
    </View>
  );
});
CommandInput.displayName = "CommandInput";

const CommandList = React.forwardRef<
  React.ComponentRef<typeof View>,
  React.ComponentProps<typeof View> & {
    asChild?: boolean;
    /**
     * Accessible label for this List of suggestions. Not shown visibly.
     */
    label?: string;
  }
>(({ className, label = "Suggestions", ...props }, ref) => {
  const { context } = React.useContext(CommandContext);

  return (
    <View
      ref={ref}
      role="list"
      aria-label={label}
      id={context.listId}
      className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
      {...props}
    >
      {SlottableWithNestedChildren(props, (child) => (
        <>{child}</>
      ))}
    </View>
  );
});
CommandList.displayName = "CommandList";

const CommandEmpty = React.forwardRef<
  React.ComponentRef<typeof View>,
  React.ComponentProps<typeof View>
>(({ children, ...props }, ref) => {
  const { state } = React.useContext(CommandContext);
  return (
    state.filtered.count === 0 && (
      <TextClassContext.Provider value="text-center text-sm">
        <View ref={ref} className="py-6" {...props}>
          {typeof children === "string" ? <Text>{children}</Text> : children}
        </View>
      </TextClassContext.Provider>
    )
  );
});
CommandEmpty.displayName = "CommandEmpty";

const CommandGroup = React.forwardRef<
  React.ComponentRef<typeof View>,
  React.ComponentProps<typeof View> & {
    asChild?: boolean;
    /** Optional heading to render for this group. */
    heading?: React.ReactNode;
    /** If no heading is provided, you must provide a value that is unique for this group. */
    value?: string;
    /** Whether this group is forcibly rendered regardless of filtering. */
    forceMount?: boolean;
  }
>(({ className, heading, value, forceMount, ...props }, ref) => {
  const { state, context } = React.useContext(CommandContext);

  const headingId = React.useId();
  const id = React.useId();
  const render = forceMount
    ? true
    : context.filter() === false
      ? true
      : !state.search
        ? true
        : state.filtered.groups.has(id);

  React.useLayoutEffect(() => {
    return context.group(id);
  }, []);

  useValue(id, [value, heading]);
  const contextValue = React.useMemo(() => ({ id, forceMount }), [forceMount]);

  return (
    <View
      ref={ref}
      role="group"
      className={cn("overflow-hidden p-1", { hidden: false === render }, className)}
      {...props}
    >
      <TextClassContext.Provider value="text-foreground">
        {typeof heading === "string" ? (
          <Text aria-hidden className="px-2 py-1 text-muted-foreground">
            {heading}
          </Text>
        ) : (
          heading
        )}
        {SlottableWithNestedChildren(props, (child) => (
          <View role="group" aria-labelledby={heading ? headingId : undefined}>
            <GroupContext.Provider value={contextValue}>{child}</GroupContext.Provider>
          </View>
        ))}
      </TextClassContext.Provider>
    </View>
  );
});
CommandGroup.displayName = "CommandGroup";

const CommandSeparator = React.forwardRef<
  React.ComponentRef<typeof Separator>,
  React.ComponentPropsWithoutRef<typeof Separator>
>(({ className, ...props }, ref) => (
  <Separator ref={ref} className={cn("-mx-px", className)} {...props} />
));
CommandSeparator.displayName = "CommandSeparator";

const CommandItem = React.forwardRef<
  React.ComponentRef<typeof Pressable>,
  React.ComponentPropsWithoutRef<typeof Pressable> & {
    /** Event handler for when this item is selected, either via click or keyboard selection. */
    onSelect?: (value: string) => void;
    /**
     * A unique value for this item.
     * If no value is provided, it will be inferred from `children` or the rendered `textContent`. If your `textContent` changes between renders, you _must_ provide a stable, unique `value`.
     */
    value?: string;
    /** Optional keywords to match against when filtering. */
    keywords?: string[];
    /** Whether this item is forcibly rendered regardless of filtering. */
    forceMount?: boolean;
  }
>(({ className, keywords, children, onSelect, ...props }, ref) => {
  const { context, state } = React.useContext(CommandContext);
  const groupContext = React.useContext(GroupContext);
  const id = React.useId();

  const value = useValue(id, [props.value, children], keywords);
  const forceMount = props?.forceMount ?? groupContext?.forceMount;

  React.useLayoutEffect(() => {
    if (!forceMount) {
      return context.item(id, groupContext?.id);
    }
  }, [forceMount]);

  const render = forceMount
    ? true
    : context.filter() === false
      ? true
      : !state.search
        ? true
        : (state.filtered.items.get(id) ?? 0) > 0;

  if (!render) return null;

  return (
    <Pressable
      ref={ref}
      id={id}
      role="listitem"
      className={cn(
        "relative flex flex-row cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none active:bg-accent active:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        props.disabled
          ? "opacity-50 pointer-events-none"
          : "hover:bg-accent hover:text-accent-foreground",
        className,
      )}
      onPress={props.disabled ? undefined : () => onSelect?.(value.current ?? "")}
      children={children}
      {...props}
    />
  );
});
CommandItem.displayName = "CommandItem";

const CommandShortcut = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Text>) => {
  return (
    <Text
      className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)}
      {...props}
    />
  );
};
CommandShortcut.displayName = "CommandShortcut";

function useValue(
  id: string,
  deps: (
    | string
    | React.ComponentPropsWithoutRef<typeof View | typeof Pressable>["children"]
  )[],
  aliases: string[] = [],
) {
  const valueRef = React.useRef<string>(null);
  const { context } = React.useContext(CommandContext);

  React.useLayoutEffect(() => {
    const value = async (): Promise<string> =>
      new Promise((resolve) => {
        React.Children.forEach(deps, (child) => {
          if (typeof child === "string") return resolve(child.trim());
          if (React.isValidElement(child) && child.type === Text) {
            // @ts-expect-error - We know that child is a valid element
            return resolve(child.props?.children?.trim());
          }
        });
      });

    value().then((value) => {
      context.value(
        id,
        value,
        aliases.map((alias) => alias.trim()),
      );
      valueRef.current = value;
    });
  });

  return valueRef;
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
