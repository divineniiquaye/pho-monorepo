import React from "react";
import Animated, {
  interpolate,
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SystemBars } from "react-native-edge-to-edge";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BottomSheetInstance, SheetPayload, Sheets } from "./types";
import { eventManager } from "./events";

export const providerRegistryStack: string[] = [];

/**
 * An object that holds all the sheet components against their ids.
 */
export const sheetsRegistry: {
  [context: string]: { [id: string]: React.ElementType };
} = {
  global: {},
};

export interface SheetProps<SheetId extends keyof Sheets = never> {
  sheetId: SheetId;
  payload?: Sheets[SheetId]["payload"];
}

// Registers your Sheet with the SheetProvider.
export function registerSheet<SheetId extends keyof Sheets = never>(
  id: SheetId | (string & {}),
  Sheet: React.ElementType,
  ...contexts: string[]
) {
  if (!id || !Sheet) return;
  if (!contexts || contexts.length === 0) contexts = ["global"];
  for (let context of contexts) {
    const registry = !sheetsRegistry[context]
      ? (sheetsRegistry[context] = {})
      : sheetsRegistry[context];
    registry[id as string] = Sheet;
    eventManager.publish(`${context}-on-register`);
  }
}

/**
 * The SheetProvider makes available the sheets in a given context. The default context is
 * `global`. However if you want to render a Sheet within another sheet or if you want to render
 * Sheets in a modal. You can use a separate Provider with a custom context value.
 *
 * Remember to add a border radius of 24px to the root view if you want to snap to 100%,
 * and if you're using react native navigation theme provider, set the background color to transparent.
 *
 * For example
 * ```ts
 * // Define your SheetProvider in the component/modal where
 * // you want to show some Sheets.
 * <SheetProvider context="local-context" />
 *
 * // Then register your sheet when for example the
 * // Modal component renders.
 *
 * registerSheet('local-sheet', LocalSheet,'local-context');
 *
 * ```
 */
export function SheetProvider({
  context = "global",
  duration = 300,
  children,
}: React.PropsWithChildren<{ context?: string; duration?: number }>) {
  const { top } = useSafeAreaInsets();
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  const sheetIds = Object.keys(sheetsRegistry[context] || sheetsRegistry["global"] || {});

  // Rerender when a new sheet is added.
  const onRegister = React.useCallback(forceUpdate, [forceUpdate]);

  // IOS modal sheet type of animation
  const isFullScreen = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    flex: 1,
    transform: [
      {
        scaleX: withTiming(
          interpolate(isFullScreen.value, [0, 0.9, 1], [1, 1, 0.92], "clamp"),
        ),
      },
      {
        translateY: withSpring(
          interpolate(isFullScreen.value, [0, 0.9, 1], [0, top, top + 5], "clamp"),
          { duration: 300, dampingRatio: 1.5 },
        ),
      },
    ],
  }));

  // Since background color is white, we need to set status bar to light
  const setStatusBar = SystemBars.setStyle;
  useAnimatedReaction(
    () => isFullScreen.value,
    (currentValue) => {
      "worklet";
      runOnJS(setStatusBar)(currentValue >= 0.5 ? "light" : "auto");
    },
    [],
  );

  React.useEffect(() => {
    providerRegistryStack.indexOf(context) > -1
      ? providerRegistryStack.indexOf(context)
      : providerRegistryStack.push(context) - 1;
    const unsub = eventManager.subscribe(`${context}-on-register`, onRegister);
    return () => {
      providerRegistryStack.splice(providerRegistryStack.indexOf(context), 1);
      unsub?.unsubscribe();
    };
  }, [context, onRegister]);

  return (
    <SheetAnimationContext.Provider value={{ isFullScreen }}>
      <Animated.View style={{ flex: 1, backgroundColor: "#000" }}>
        <Animated.View style={animatedStyle}>{children}</Animated.View>
      </Animated.View>
      <BottomSheetModalProvider>
        {sheetIds.map((id) => (
          <RenderSheet key={id} id={id} context={context} duration={duration} />
        ))}
      </BottomSheetModalProvider>
    </SheetAnimationContext.Provider>
  );
}
const ProviderContext = React.createContext("global");
const SheetIDContext = React.createContext<string | undefined>(undefined);
const SheetAnimationContext = React.createContext<{
  isFullScreen: SharedValue<number>;
}>({ isFullScreen: { value: 0 } as any });

export const SheetRefContext = React.createContext<
  React.RefObject<BottomSheetInstance | null>
>({} as any);

const SheetPayloadContext = React.createContext<any>(undefined);

/**
 * Get id of the current context.
 */
export const useProviderContext = () => React.useContext(ProviderContext);
/**
 * Get id of the current sheet
 */
export const useSheetIDContext = () => React.useContext(SheetIDContext);
/**
 * Get the current sheet animation context.
 */
export const useSheetAnimationContext = () => React.useContext(SheetAnimationContext);
/**
 * Get the current Sheet's internal ref.
 * @returns
 */
export const useSheetRef = <SheetId extends keyof Sheets = never>(): React.RefObject<
  BottomSheetInstance<SheetId>
> => React.useContext(SheetRefContext) as React.RefObject<BottomSheetInstance<SheetId>>;

/**
 * Get the payload this sheet was opened with.
 * @returns
 */
export function useSheetPayload<SheetId extends keyof Sheets = never>() {
  return React.useContext(SheetPayloadContext) as Sheets[SheetId]["payload"];
}

/**
 * Listen to sheet events.
 */
export function useOnSheet<SheetId extends keyof Sheets = never>(
  id: SheetId | (string & {}),
  type: "show" | "hide" | "onclose",
  listener: (payload: SheetPayload<SheetId>, context: string, ...args: any[]) => void,
) {
  React.useEffect(() => {
    const subscription = eventManager.subscribe(`${type}_${id}`, listener);
    return () => subscription.unsubscribe();
  }, [id, listener]);
}

const RenderSheet = ({
  id,
  context,
  duration,
}: {
  id: string;
  context: string;
  duration: number;
}) => {
  const [payload, setPayload] = React.useState();
  const [visible, setVisible] = React.useState(false);
  const ref = React.useRef<BottomSheetInstance | null>(null);
  const Sheet = context.startsWith("$$-auto-")
    ? sheetsRegistry?.global?.[id]
    : sheetsRegistry[context]
      ? sheetsRegistry[context]?.[id]
      : undefined;

  const onShow = React.useCallback(
    (data: any, ctx = "global", reopened?: boolean) => {
      if (ctx !== context) return;
      if (!reopened) setPayload(data);
      setVisible(true);
    },
    [context],
  );

  const onClose = React.useCallback(
    (_data: any, ctx = "global", reopened?: boolean) => {
      if (context !== ctx) return;
      if (!reopened) {
        setPayload(undefined);
        setTimeout(() => setVisible(false), Math.max(duration ?? 300, 300));
      } else {
        setVisible(false);
      }
    },
    [context],
  );

  const onHide = React.useCallback(
    (data: any, ctx = "global") => {
      eventManager.publish(`hide_${id}`, data, ctx);
    },
    [id],
  );

  React.useEffect(() => {
    if (visible) {
      eventManager.publish(`show_${id}`, payload, context);
    }
  }, [context, id, payload, visible]);

  React.useEffect(() => {
    let subs = [
      eventManager.subscribe(`show_wrap_${id}`, onShow),
      eventManager.subscribe(`onclose_${id}`, onClose),
      eventManager.subscribe(`hide_wrap_${id}`, onHide),
    ];
    return () => {
      subs.forEach((s) => s.unsubscribe());
    };
  }, [id, context, onShow, onHide, onClose]);

  if (!Sheet) return null;

  return visible ? (
    <ProviderContext.Provider value={context}>
      <SheetIDContext.Provider value={id}>
        <SheetRefContext.Provider value={ref}>
          <SheetPayloadContext.Provider value={payload}>
            <Sheet id={id} payload={payload} context={context} />
          </SheetPayloadContext.Provider>
        </SheetRefContext.Provider>
      </SheetIDContext.Provider>
    </ProviderContext.Provider>
  ) : null;
};
