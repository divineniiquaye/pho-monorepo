import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";

import { ParamListBase, useTheme } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { FullWindowOverlay } from "react-native-screens";
import { Platform, StyleSheet } from "react-native";
import * as React from "react";
import type {
  BottomSheetDescriptorMap,
  BottomSheetNavigationConfig,
  BottomSheetNavigationHelpers,
  BottomSheetNavigationProp,
  BottomSheetNavigationState,
} from "./types";

type BottomSheetModalScreenProps = BottomSheetModalProps & {
  navigation: BottomSheetNavigationProp<ParamListBase>;
  /**
   * When `true`, tapping on the backdrop will not dismiss the modal.
   * @default false
   */
  clickThrough?: boolean;
};

function Overlay({ children }: React.PropsWithChildren) {
  if (Platform.OS === "ios") {
    return (
      <FullWindowOverlay>
        <SafeAreaProvider style={styles.safeAreaProvider}>{children}</SafeAreaProvider>
      </FullWindowOverlay>
    );
  }

  return <>{children}</>;
}

function BottomSheetModalScreen({
  index,
  navigation,
  clickThrough,
  children,
  ...props
}: BottomSheetModalScreenProps) {
  const ref = React.useRef<BottomSheetModal>(null);
  const lastIndexRef = React.useRef(index);

  // Present on mount.
  React.useEffect(() => {
    ref.current?.present();
  }, []);

  const isMounted = React.useRef(true);
  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  React.useEffect(() => {
    if (index != null && lastIndexRef.current !== index) {
      ref.current?.snapToIndex(index);
    }
  }, [index]);

  const onChange = React.useCallback(
    (newIndex: number) => {
      lastIndexRef.current = newIndex;
      if (newIndex >= 0) {
        navigation.snapTo(newIndex);
      }
    },
    [navigation],
  );

  const onDismiss = React.useCallback(() => {
    // BottomSheetModal will call onDismiss on unmount, be we do not want that since
    // we already popped the screen.
    if (isMounted.current) {
      navigation.goBack();
    }
  }, [navigation]);

  return (
    <BottomSheetModal
      ref={ref}
      onDismiss={onDismiss}
      onChange={onChange}
      index={index}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          enableTouchThrough={!!clickThrough}
        />
      )}
      {...props}
    >
      {children}
    </BottomSheetModal>
  );
}

const DEFAULT_SNAP_POINTS = ["66%"];

type Props = BottomSheetNavigationConfig & {
  state: BottomSheetNavigationState<ParamListBase>;
  navigation: BottomSheetNavigationHelpers;
  descriptors: BottomSheetDescriptorMap;
};

export function BottomSheetView({ state, navigation, descriptors }: Props) {
  const { colors } = useTheme();
  const themeBackgroundStyle = React.useMemo(
    () => ({
      backgroundColor: colors.card,
    }),
    [colors.card],
  );
  const themeHandleIndicatorStyle = React.useMemo(
    () => ({
      backgroundColor: colors.border,
      height: 5,
      width: 50,
    }),
    [colors.border],
  );

  // Avoid rendering provider if we only have one screen.
  const shouldRenderProvider = React.useRef(false);
  shouldRenderProvider.current = shouldRenderProvider.current || state.routes.length > 1;

  const firstRoute = state.routes[0];
  if (!firstRoute) {
    // no routes at all, probably shouldn't happen, but let's be defensive
    return null;
  }

  const firstDescriptor = descriptors[firstRoute.key];
  if (!firstDescriptor) {
    // if we don't have a descriptor for the first route, bail out
    return null;
  }

  return (
    <>
      {firstDescriptor.render?.()}
      {shouldRenderProvider.current && (
        <BottomSheetModalProvider>
          {state.routes.slice(1).map((route) => {
            const descriptor = descriptors[route.key];
            if (!descriptor) return null;

            const { options, navigation, render } = descriptor;
            const {
              index,
              snapPoints,
              backgroundStyle,
              handleIndicatorStyle,
              enableDynamicSizing,
              ...sheetProps
            } = options;

            return (
              <BottomSheetModalScreen
                key={route.key}
                // Make sure index is in range, it could be out if snapToIndex is persisted
                // and snapPoints is changed.
                index={Math.min(
                  route.snapToIndex ?? index ?? 0,
                  snapPoints != null ? snapPoints.length - 1 : 0,
                )}
                snapPoints={
                  snapPoints == null && !enableDynamicSizing
                    ? DEFAULT_SNAP_POINTS
                    : snapPoints
                }
                navigation={navigation}
                enableDynamicSizing={enableDynamicSizing}
                backgroundStyle={[themeBackgroundStyle, backgroundStyle]}
                handleIndicatorStyle={[themeHandleIndicatorStyle, handleIndicatorStyle]}
                containerComponent={Overlay}
                {...sheetProps}
              >
                {render?.()}
              </BottomSheetModalScreen>
            );
          })}
        </BottomSheetModalProvider>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  safeAreaProvider: { flex: 1, pointerEvents: "box-none" },
});
