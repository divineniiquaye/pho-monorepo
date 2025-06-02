import {
  createNavigatorFactory,
  NavigatorTypeBagBase,
  ParamListBase,
  StaticConfig,
  TypedNavigator,
  useNavigationBuilder,
} from "@react-navigation/native";

import { BottomSheetRouter, BottomSheetRouterOptions } from "./router";
import { BottomSheetView } from "./view";
import type {
  BottomSheetActionHelpers,
  BottomSheetNavigationEventMap,
  BottomSheetNavigationOptions,
  BottomSheetNavigationProp,
  BottomSheetNavigationState,
  BottomSheetNavigatorProps,
} from "./types";

function BottomSheetNavigator({
  id,
  children,
  screenListeners,
  screenOptions,
  ...rest
}: BottomSheetNavigatorProps) {
  const { state, descriptors, navigation, NavigationContent } = useNavigationBuilder<
    BottomSheetNavigationState<ParamListBase>,
    BottomSheetRouterOptions,
    BottomSheetActionHelpers<ParamListBase>,
    BottomSheetNavigationOptions,
    BottomSheetNavigationEventMap
  >(BottomSheetRouter, {
    id,
    children,
    screenListeners,
    screenOptions,
  });

  return (
    <NavigationContent>
      <BottomSheetView
        {...rest}
        state={state}
        navigation={navigation}
        descriptors={descriptors}
      />
    </NavigationContent>
  );
}

/**
 * To use BottomSheetNavigator with expo-router, the first screen should be your app content
 * and add a border radius of 24px to the root view if want to snap to 100%.
 *
 * @example
 * ```tsx
 * import {
 *   createBottomSheetNavigator,
 *   BottomSheetNavigationOptions,
 *   BottomSheetNavigationEventMap,
 *   BottomSheetNavigationState,
 * } from "@repo/bottom-sheet";
 * import { Slot, withLayoutContext } from "expo-router";
 *
 * const { Navigator } = createBottomSheetNavigator();
 *
 * const BottomSheet = withLayoutContext<
 *   BottomSheetNavigationOptions,
 *   typeof Navigator,
 *   BottomSheetNavigationState<any>,
 *   BottomSheetNavigationEventMap
 * >(Navigator);
 *
 * export const unstable_settings = {
 *   initialRouteName: "index",
 * };
 *
 * export default function Layout() {
 *   if (typeof window === "undefined") return <Slot />;
 *   return (
 *     <BottomSheet
 *       screenOptions={
 *         {
 *           // API Reference: `@repo/design/bottom-sheet/types.ts`
 *           // And: https://gorhom.github.io/react-native-bottom-sheet/modal/props/
 *         }
 *       }
 *
 *   );
 * }
 * ```
 */
export function createBottomSheetNavigator<
  const ParamList extends ParamListBase,
  const NavigatorID extends string | undefined = undefined,
  // We'll define a type bag specialized for bottom sheets:
  const TypeBag extends NavigatorTypeBagBase = {
    // The param list from the user
    ParamList: ParamList;
    // Optional ID for this navigator
    NavigatorID: NavigatorID;
    // The state shape
    State: BottomSheetNavigationState<ParamList>;
    // The screen options
    ScreenOptions: BottomSheetNavigationOptions;
    // The event map
    EventMap: BottomSheetNavigationEventMap;
    // The type of the "navigation" object used by each screen in the navigator
    NavigationList: {
      [RouteName in keyof ParamList]: BottomSheetNavigationProp<
        ParamList,
        RouteName,
        NavigatorID
      >;
    };
    // The navigator component
    Navigator: typeof BottomSheetNavigator;
  },
  // The static config allows for "static" route config
  const Config extends StaticConfig<TypeBag> = StaticConfig<TypeBag>,
>(config?: Config): TypedNavigator<TypeBag, Config> {
  // We call `createNavigatorFactory` with our un-typed navigator
  // but pass in the config to get the typed container
  return createNavigatorFactory(BottomSheetNavigator)(config);
}

export * from "./types";
