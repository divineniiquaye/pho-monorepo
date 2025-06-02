import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { ParamListBase, useTheme } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SystemBars } from "react-native-edge-to-edge";
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
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

  /**
   * Opacity of the sheet's overlay.
   * @default 0.45
   */
  opacity?: number;
};

function BottomSheetModalScreen({
  index,
  navigation,
  clickThrough,
  opacity,
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
      const currentIndex = lastIndexRef.current;
      lastIndexRef.current = newIndex;
      if (newIndex >= 0 && newIndex !== currentIndex) {
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
          opacity={opacity || 0.45}
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

export function BottomSheetView({ state, descriptors }: Props) {
  const { colors } = useTheme();
  const { top } = useSafeAreaInsets();
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

  // IOS modal sheet type of animation
  const isFullScreen = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    flex: 1,
    transform: [
      {
        scaleX: withSpring(interpolate(isFullScreen.value, [0, 1], [1, 0.92]), {
          damping: 15,
          stiffness: 100,
        }),
      },
      {
        translateY: withSpring(interpolate(isFullScreen.value, [0, 1], [0, top + 5]), {
          damping: 15,
          stiffness: 100,
        }),
      },
    ],
  }));

  // Since background color is white, we need to set status bar to light
  const setStatusBar = SystemBars.setStyle;
  useAnimatedReaction(
    () => isFullScreen.value,
    (currentValue) => {
      "worklet";
      runOnJS(setStatusBar)(currentValue === 1 ? "light" : "auto");
    },
    [],
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
      <Animated.View style={{ flex: 1, backgroundColor: "#000" }}>
        <Animated.View style={animatedStyle}>{firstDescriptor.render?.()}</Animated.View>
      </Animated.View>
      {shouldRenderProvider.current && (
        <BottomSheetModalProvider>
          {state.routes.slice(1).map((route) => {
            const descriptor = descriptors[route.key];
            if (!descriptor) return null;

            const { options, navigation, render } = descriptor;
            const {
              index,
              snapPoints,
              handleStyle,
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
                  !!snapPoints ? snapPoints.length - 1 : 0,
                )}
                snapPoints={
                  !snapPoints && !enableDynamicSizing ? DEFAULT_SNAP_POINTS : snapPoints
                }
                onAnimate={(_, to) => {
                  // @ts-ignore TODO: Fix types
                  isFullScreen.value = ["%100", "100%"].includes(snapPoints?.[to])
                    ? 1
                    : 0;
                }}
                animationConfigs={{
                  duration: 300,
                  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                }}
                topInset={top + 18}
                navigation={navigation}
                enableDynamicSizing={enableDynamicSizing}
                backgroundStyle={[themeBackgroundStyle, backgroundStyle]}
                handleIndicatorStyle={[themeHandleIndicatorStyle, handleIndicatorStyle]}
                handleStyle={[themeBackgroundStyle, { borderRadius: 20 }, handleStyle]}
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
