import type { BottomSheetProps as RNBottomSheetProps } from "@gorhom/bottom-sheet";
import type { WithSpringConfig, WithTimingConfig } from "react-native-reanimated";
import React from "react";

export interface Sheets {}
export type SheetIds = keyof Sheets;
export type SheetID<Id extends SheetIds> = Id | (string & {});

export type SheetPayload<Id extends SheetIds> = Sheets[Id]["payload"];
export type SheetReturnValue<Id extends SheetIds> = Sheets[Id]["returnValue"];
type AnimationConfigs = WithSpringConfig | WithTimingConfig;

export interface SheetProps<Id extends SheetIds = SheetIds> {
    readonly id: SheetID<Id>;
    readonly payload: SheetPayload<Id>;
    readonly context: string;
}

export interface SheetDefinition<Payload = never, ReturnValue = never> {
    payload: Payload;
    returnValue: ReturnValue;
}

export interface BottomSheetInstance<Id extends SheetIds = SheetIds> {
    /**
     * Close the bottom sheet.
     * @param args
     */
    readonly close: (
        ...args: SheetReturnValue<Id> extends never
            ? [
                  options?: {
                      /**
                       * Snap animation configs.
                       */
                      animationConfigs?: AnimationConfigs;
                  },
              ]
            : [
                  options: {
                      /**
                       * Return some data to the caller on closing the `BottomSheet`.
                       */
                      value: SheetReturnValue<Id>;

                      /**
                       * Snap animation configs.
                       */
                      animationConfigs?: AnimationConfigs;
                  },
              ]
    ) => void;

    /**
     * Snap to the maximum provided point from `snapPoints`.
     * @param animationConfigs Snap animation configs.
     */
    readonly expand: (animationConfigs?: AnimationConfigs) => void;

    /**
     * Snap to the minimum provided point from `snapPoints`.
     * @param animationConfigs Snap animation configs.
     */
    readonly collapse: (animationConfigs?: AnimationConfigs) => void;

    /**
     * Snap to one of the provided points from `snapPoints`.
     * @param index Snap point index.
     * @param animationConfigs Snap animation configs.
     */
    readonly snapToIndex: (index: number, animationConfigs?: AnimationConfigs) => void;

    /**
     * Snap to a position out of provided  `snapPoints`.
     * @param position Position in pixel or percentage.
     * @param animationConfigs Snap animation configs.
     */
    readonly snapToPosition: (
        position: string | number,
        animationConfigs?: AnimationConfigs,
    ) => void;
}

export type BottomSheetProps = Omit<
    RNBottomSheetProps,
    "children" | "onClose" | "animatedIndex" | "topInset"
> & {
    /**
     * ID of the `BottomSheet`.
     */
    id?: SheetID<SheetIds>;

    /**
     * Content of the `BottomSheet`.
     */
    children: React.ReactNode;

    /**
     * When set to true, `BottomSheet` is closed when the hardware back button is pressed.
     * @default true
     */
    hardwareBackPressToClose?: boolean;

    /**
     * Callback when the sheet close.
     *
     * @type () => void;
     */
    onClose?: (data?: any) => void;

    /**
     * Can click through the sheet to the underlying view.
     * @default false
     */
    clickThrough?: boolean;

    /**
     * Opacity of the sheet's overlay.
     * @default 0.45
     */
    opacity?: number;

    /**
     * Defines the stack behavior when modal mounts. (experimental)
     * @default "switch"
     */
    stackBehavior?: "push" | "replace" | "switch";

    /**
     * Whether the bottom sheet edge to edge.
     * @default false
     */
    fullScreen?: boolean;

    className?: string;
    handleIndicatorClassName?: string;
    backgroundClassName?: string;
    containerClassName?: string;
    handleClassName?: string;
};
