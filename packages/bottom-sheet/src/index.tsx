import {
  BackHandler,
  Platform,
  StyleSheet,
  View,
  type NativeEventSubscription,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import {
  Easing,
  interpolate,
  useAnimatedReaction,
  useSharedValue,
} from "react-native-reanimated";
import React from "react";
import RNBottomSheet, {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetScrollView,
  BottomSheetFlatList,
  BottomSheetSectionList,
  BottomSheetVirtualizedList,
  BottomSheetHandle,
  BottomSheetFooter,
  BottomSheetBackdrop,
  BottomSheetFooterContainer,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";

import { BottomSheetInstance, BottomSheetProps, SheetIds } from "./types";
import { PrivateManager } from "./manager";
import { eventManager } from "./events";
import {
  useProviderContext,
  useSheetAnimationContext,
  useSheetIDContext,
  useSheetRef,
} from "./provider";

interface BottomSheetFC
  extends React.MemoExoticComponent<React.ForwardRefExoticComponent<BottomSheetProps>> {
  <Id extends SheetIds>(
    props: BottomSheetProps & React.RefAttributes<BottomSheetInstance<Id>>,
  ): React.JSX.Element;

  // Components
  View: typeof BottomSheetView;
  ScrollView: typeof BottomSheetScrollView;
  FlatList: typeof BottomSheetFlatList;
  SectionList: typeof BottomSheetSectionList;
  VirtualizedList: typeof BottomSheetVirtualizedList;
  Handle: typeof BottomSheetHandle;
  Footer: typeof BottomSheetFooter;
  FooterContainer: typeof BottomSheetFooterContainer;
  Backdrop: typeof BottomSheetBackdrop;
  TextInput: typeof BottomSheetTextInput;
}

const useSheetManager = ({
  id,
  onHide,
  onBeforeShow,
  onContextUpdate,
}: {
  id?: string;
  onHide: (data?: any, dismiss?: boolean) => void;
  onBeforeShow?: (data?: any) => void;
  onContextUpdate: () => void;
}) => {
  const [visible, setVisible] = React.useState(false);
  const currentContext = useProviderContext();

  React.useEffect(() => {
    if (!id) return undefined;

    const subscriptions = [
      eventManager.subscribe(`show_${id}`, (data: any, context?: string) => {
        if (currentContext !== context || visible) return;
        onContextUpdate?.();
        onBeforeShow?.(data);
        setVisible(true);
      }),
      eventManager.subscribe(`hide_${id}`, (data: any, context, dismiss?: boolean) => {
        if (currentContext !== context) return;
        onHide?.(data, dismiss);
      }),
    ];
    return () => {
      subscriptions.forEach((s) => s?.unsubscribe?.());
    };
  }, [id, onHide, onBeforeShow, onContextUpdate, currentContext]);

  return { visible, setVisible };
};

const BottomSheetComponent = React.forwardRef<BottomSheetInstance, BottomSheetProps>(
  (
    {
      children,
      snapPoints,
      onClose,
      stackBehavior = "switch",
      hardwareBackPressToClose = true,
      enableDynamicSizing = false,
      handleIndicatorStyle,
      backgroundStyle,
      handleStyle,
      clickThrough,
      fullScreen,
      opacity,
      ...props
    },
    ref,
  ) => {
    const currentSheetRef = useSheetRef();
    const currentCtx = useProviderContext();

    const { isFullScreen } = useSheetAnimationContext();
    const animatedIndex = useSharedValue(0);

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

    const valueRef = React.useRef<unknown>(null);
    const bottomSheetRef = React.useRef<BottomSheetModal>(null);
    const hardwareBackPressEvent = React.useRef<NativeEventSubscription>(null);

    const id = useSheetIDContext();
    const sheetId = props.id || id;
    useSheetManager({
      id: sheetId,
      onHide: (data, dismiss) => hideSheet(data, true, dismiss),
      onBeforeShow: () => {
        valueRef.current = undefined;
        currentSheetRef.current = getInstance();
      },
      onContextUpdate: () => {
        if (sheetId) {
          PrivateManager.add(sheetId, currentCtx);
          PrivateManager.registerRef(sheetId, currentCtx, {
            current: getInstance(),
          } as React.RefObject<BottomSheetInstance>);
        }
      },
    });

    useAnimatedReaction(
      () => {
        isFullScreen.value = 0;
        return animatedIndex.value;
      },
      (index) => {
        "worklet";
        const points: (string | number)[] = ["%100", "100%"];
        const checkFullScreen = fullScreen
          ? -1
          : snapPoints instanceof Array
            ? snapPoints.findIndex((p) => points.includes(p))
            : snapPoints?.value?.findIndex((p) => points.includes(p)) || -1;

        if (-1 !== checkFullScreen) {
          isFullScreen.value = interpolate(
            index,
            [checkFullScreen - 1, checkFullScreen],
            [0, 1],
          );
        }
      },
      [],
    );

    const hideSheet = React.useCallback(
      (data?: any, isSheetManagerOrRef?: boolean, dismiss?: boolean) => {
        const value = data ?? valueRef.current;

        if (!dismiss || stackBehavior !== "push") {
          hardwareBackPressEvent.current?.remove();
          bottomSheetRef.current?.close();
          onClose?.(value);
        }

        if (sheetId) {
          PrivateManager.remove(sheetId, currentCtx);
          if (dismiss && stackBehavior === "push") return;

          const history = PrivateManager.history.length >= 1;
          eventManager.publish(
            `onclose_${sheetId}`,
            value,
            currentCtx,
            history || dismiss,
          );

          if (stackBehavior === "replace") return;
          if (dismiss) {
            PrivateManager.history.push({ id: sheetId, context: currentCtx });
          } else if (history) {
            const { id, context } = PrivateManager.history.pop()!;
            eventManager.publish(`show_wrap_${id}`, undefined, context, true);
          }
        }
        if (isSheetManagerOrRef) valueRef.current = data;
      },
      [sheetId, currentCtx, onClose],
    );
    const getInstance = React.useCallback(
      (): BottomSheetInstance => ({
        close(options = {}): void {
          valueRef.current = (options as Record<string, unknown>).value;
          bottomSheetRef.current?.close(options?.animationConfigs);
        },
        expand(animationConfigs): void {
          bottomSheetRef.current?.expand(animationConfigs);
        },
        collapse(animationConfigs): void {
          bottomSheetRef.current?.collapse(animationConfigs);
        },
        snapToIndex(index: number, animationConfigs): void {
          bottomSheetRef.current?.snapToIndex(index, animationConfigs);
        },
        snapToPosition(position, animationConfigs): void {
          bottomSheetRef.current?.snapToPosition(position, animationConfigs);
        },
      }),
      [],
    );

    React.useEffect(() => {
      if (sheetId) {
        PrivateManager.registerRef(sheetId, currentCtx, {
          current: getInstance(),
        } as React.RefObject<BottomSheetInstance>);
      }
      currentSheetRef.current = getInstance();
    }, [currentCtx, getInstance, sheetId, currentSheetRef]);

    React.useEffect(() => {
      if (Platform.OS === "android" && hardwareBackPressToClose) {
        hardwareBackPressEvent.current = BackHandler.addEventListener(
          "hardwareBackPress",
          () => {
            bottomSheetRef.current?.close();
            return true;
          },
        );
      }

      return () => hardwareBackPressEvent.current?.remove();
    }, [hardwareBackPressToClose]);

    React.useImperativeHandle(ref, getInstance, [getInstance]);

    return (
      <View
        pointerEvents="box-none"
        style={[
          StyleSheet.absoluteFill,
          {
            zIndex:
              sheetId && stackBehavior === "push"
                ? PrivateManager.zIndex(sheetId, currentCtx)
                : 0,
          },
        ]}
      >
        <RNBottomSheet
          enableDynamicSizing={enableDynamicSizing}
          animationConfigs={{ duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }}
          backdropComponent={(props) => (
            <BottomSheetBackdrop
              enableTouchThrough={!!clickThrough}
              opacity={opacity || 0.45}
              disappearsOnIndex={-1}
              appearsOnIndex={0}
              {...props}
            />
          )}
          {...props}
          ref={bottomSheetRef}
          onClose={hideSheet}
          animatedIndex={animatedIndex}
          topInset={fullScreen ? 0 : top + 18}
          snapPoints={enableDynamicSizing ? undefined : (snapPoints ?? ["66%"])}
          handleIndicatorStyle={[themeHandleIndicatorStyle, handleIndicatorStyle]}
          backgroundStyle={[themeBackgroundStyle, backgroundStyle]}
          handleStyle={[
            themeBackgroundStyle,
            { borderTopLeftRadius: 24, borderTopRightRadius: 24 },
            handleStyle,
          ]}
        >
          {children}
        </RNBottomSheet>
      </View>
    );
  },
);

const BottomSheet = React.memo(BottomSheetComponent) as BottomSheetFC;
BottomSheet.displayName = "BottomSheet";

BottomSheet.View = BottomSheetView;
BottomSheet.ScrollView = BottomSheetScrollView;
BottomSheet.FlatList = BottomSheetFlatList;
BottomSheet.SectionList = BottomSheetSectionList;
BottomSheet.VirtualizedList = BottomSheetVirtualizedList;
BottomSheet.Handle = BottomSheetHandle;
BottomSheet.Footer = BottomSheetFooter;
BottomSheet.FooterContainer = BottomSheetFooterContainer;
BottomSheet.Backdrop = BottomSheetBackdrop;
BottomSheet.TextInput = BottomSheetTextInput;

export default BottomSheet;
