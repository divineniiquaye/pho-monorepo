import { BackHandler, Platform, type NativeEventSubscription } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import { Easing } from "react-native-reanimated";
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
import { SheetManager } from "./manager";
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
  onHide: (data?: any) => void;
  onBeforeShow?: (data?: any) => void;
  onContextUpdate: () => void;
}) => {
  const currentContext = useProviderContext();

  React.useEffect(() => {
    if (!id) return undefined;

    const subscriptions = [
      eventManager.subscribe(`show_${id}`, (data: any, context?: string) => {
        if (currentContext !== context) return;
        onContextUpdate?.();
        onBeforeShow?.(data);
      }),
      eventManager.subscribe(`hide_${id}`, (data: any, context) => {
        if (currentContext !== context) return;
        onHide?.(data);
      }),
    ];
    return () => {
      subscriptions.forEach((s) => s?.unsubscribe?.());
    };
  }, [id, onHide, onBeforeShow, onContextUpdate, currentContext]);
};

const BottomSheetComponent = React.forwardRef<BottomSheetInstance, BottomSheetProps>(
  (
    {
      children,
      snapPoints,
      onClose,
      onAnimate,
      hardwareBackPressToClose = true,
      enableDynamicSizing = false,
      handleIndicatorStyle,
      backgroundStyle,
      handleStyle,
      clickThrough,
      opacity,
      ...props
    },
    ref,
  ) => {
    const currentSheetRef = useSheetRef();
    const currentCtx = useProviderContext();
    const { isFullScreen } = useSheetAnimationContext();

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
      onHide: (data) => hideSheet(data, true),
      onBeforeShow: () => {
        valueRef.current = undefined;
        currentSheetRef.current = getInstance();
      },
      onContextUpdate: () => {
        if (sheetId) {
          SheetManager.add(sheetId, currentCtx);
          SheetManager.registerRef(sheetId, currentCtx, {
            current: getInstance(),
          } as React.RefObject<BottomSheetInstance>);
        }
      },
    });

    const hideSheet = React.useCallback(
      (data?: any, isSheetManagerOrRef?: boolean) => {
        hardwareBackPressEvent.current?.remove();
        bottomSheetRef.current?.close();

        onClose?.(data ?? valueRef.current);

        if (sheetId) {
          SheetManager.remove(sheetId, currentCtx);
          eventManager.publish(
            `onclose_${sheetId}`,
            data ?? valueRef.current,
            currentCtx,
          );
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
        SheetManager.registerRef(sheetId, currentCtx, {
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
        topInset={top + 18}
        onAnimate={(from, to) => {
          // @ts-ignore TODO: Fix types
          isFullScreen.value = ["%100", "100%"].includes(snapPoints?.[to]) ? 1 : 0;
          onAnimate?.(from, to);
        }}
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
