import React, { createContext, useContext, useMemo, forwardRef } from "react";
import { LayoutChangeEvent, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  SharedValue,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { GripHorizontal } from "@repo/design/icons/GripHorizontal";
import { GripVertical } from "@repo/design/icons/GripVertical";
import { cn } from "@repo/design/lib/utils";
import {
  ImperativePanelGroupHandle,
  ImperativePanelHandle,
  PanelGroupOnLayout,
  PanelGroupProps,
  PanelGroupStorage,
  PanelOnCollapse,
  PanelOnExpand,
  PanelOnResize,
} from "react-resizable-panels";

type Direction = "horizontal" | "vertical";

interface GroupContext {
  panel: (
    key: string,
    sizeValue: SharedValue<number>,
    minSize: number,
    maxSize: number,
  ) => () => void;
  sizes: { key: string; value: SharedValue<number>; minSize: number; maxSize: number }[];
  containerSize: number;
  direction: Direction;
}

const PanelGroupContext = createContext<GroupContext | null>(null);

const usePanelGroupContext = () => {
  const context = useContext(PanelGroupContext);
  if (!context) {
    throw new Error("Resizable components must be used within a ResizablePanelGroup");
  }
  return context;
};

type ResizablePanelGroupProps = React.ComponentProps<typeof View> &
  PanelGroupProps & {
    /** Web only */
    autoSaveId?: string | null;
    className?: string;
    direction: Direction;
    /** Web only */
    id?: string | null;
    /** Web only */
    keyboardResizeBy?: number | null;
    /** Web only */
    onLayout?: PanelGroupOnLayout | null;
    /** Web only */
    storage?: PanelGroupStorage;
    /** Web only */
    tagName?: keyof HTMLElementTagNameMap;
    /** Web only */
    dir?: "auto" | "ltr" | "rtl" | undefined;
  };

type ResizablePanelProps = React.ComponentPropsWithRef<typeof Animated.View> & {
  className?: string | undefined;
  /** Web only */
  collapsedSize?: number | undefined;
  /** Web only */
  collapsible?: boolean | undefined;
  defaultSize?: number | undefined;
  /** Web only */
  id?: string | undefined;
  maxSize?: number | undefined;
  minSize?: number | undefined;
  /** Web only */
  onCollapse?: PanelOnCollapse | undefined;
  onExpand?: PanelOnExpand | undefined;
  onResize?: PanelOnResize | undefined;
  /** Web only */
  order?: number | undefined;
  /** Web only */
  tagName?: keyof HTMLElementTagNameMap | undefined;
};

interface ResizableHandleProps extends React.ComponentPropsWithRef<typeof Animated.View> {
  withHandle?: boolean;
  className?: string;
}

const ResizablePanelGroup = forwardRef<
  ImperativePanelGroupHandle,
  ResizablePanelGroupProps
>(({ direction = "horizontal", className = "", children, style, ...props }, ref) => {
  const [sizes, setSizes] = React.useState<GroupContext["sizes"]>([]);
  const [containerSize, setContainerSize] = React.useState(0);

  React.useImperativeHandle(
    ref,
    () => ({
      getId: () => props.id || "",
      getLayout: () => sizes.map((s) => s.value.value),
      setLayout: (layout: number[]) => {
        sizes.forEach((s, i) => {
          if (layout[i] !== undefined) {
            s.value.value = layout[i];
          }
        });
      },
    }),
    [sizes, props.id],
  );

  const onLayout = React.useCallback(
    (event: LayoutChangeEvent) =>
      setContainerSize(
        direction === "vertical"
          ? event.nativeEvent.layout.height
          : event.nativeEvent.layout.width,
      ),
    [direction],
  );

  const panel = React.useCallback(
    (key: string, sizeValue: SharedValue<number>, minSize: number, maxSize: number) => {
      setSizes((prevSizes) => {
        const newSizes = [...prevSizes];
        const existingIndex = newSizes.findIndex((s) => s.key === key);

        if (existingIndex !== -1) {
          newSizes[existingIndex] = {
            key,
            value: sizeValue,
            minSize,
            maxSize,
          };
        } else {
          newSizes.push({
            key,
            value: sizeValue,
            minSize,
            maxSize,
          });
        }

        return newSizes;
      });

      return () => setSizes((prev) => prev.filter((s) => s.key !== key));
    },
    [],
  );

  const contextValue = useMemo(
    () => ({ direction, containerSize, panel, sizes }),
    [direction, containerSize, panel, sizes],
  );

  return (
    <PanelGroupContext.Provider value={contextValue}>
      <View
        onLayout={onLayout}
        className={cn(
          "flex-1 w-full h-full",
          direction === "vertical" ? "flex-col" : "flex-row",
          className,
        )}
        style={style}
        {...props}
      >
        {children}
      </View>
    </PanelGroupContext.Provider>
  );
});
ResizablePanelGroup.displayName = "ResizablePanelGroup";

const ResizablePanel = forwardRef<ImperativePanelHandle, ResizablePanelProps>(
  (
    {
      defaultSize = 50,
      maxSize = 100,
      minSize = 0,
      onCollapse,
      onResize,
      onExpand,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const { direction, sizes, panel } = usePanelGroupContext();
    const size = useSharedValue(defaultSize);
    const uniqueId = React.useId();

    const panelSize = sizes.find((s) => s.key === uniqueId)?.value || size;
    const animatedStyle = useAnimatedStyle(() => ({
      [direction === "horizontal" ? "width" : "height"]: `${panelSize.value}%`,
    }));

    React.useImperativeHandle(
      ref,
      () => ({
        collapse: () => {
          if (props?.collapsible) {
            onCollapse?.();
          }
        },
        expand: (minSize?: number) => {
          const targetSize = minSize || defaultSize;
          size.value = targetSize;
          onExpand?.();
        },
        getId: () => props.id || uniqueId,
        getSize: () => size.value,
        isCollapsed: () => !!props?.collapsable,
        isExpanded: () => !props?.collapsable,
        resize: (newSize: number) => {
          const clampedSize = Math.min(maxSize, Math.max(minSize, newSize));
          panelSize.value = clampedSize;
          onResize?.(clampedSize, undefined);
        },
      }),
      [
        size,
        uniqueId,
        props.id,
        props?.collapsible,
        defaultSize,
        maxSize,
        minSize,
        onCollapse,
        onExpand,
        onResize,
      ],
    );

    React.useEffect(() => {
      const cleanup = panel(uniqueId, size, minSize, maxSize);
      return cleanup;
    }, [uniqueId, minSize, maxSize]);

    return (
      <Animated.View
        className={className}
        style={
          undefined !== panelSize
            ? animatedStyle
            : {
                [direction === "horizontal" ? "width" : "height"]: `${defaultSize}%`,
              }
        }
        {...props}
      >
        {children}
      </Animated.View>
    );
  },
);
ResizablePanel.displayName = "ResizablePanel";

const ResizableHandle = forwardRef<Animated.View, ResizableHandleProps>(
  ({ withHandle = true, className, ...props }, ref) => {
    const { direction, containerSize, sizes, panel } = usePanelGroupContext();
    const handlePosition = useSharedValue(0);
    const prevPosition = useSharedValue(0);
    const handleId = React.useId();

    const panelIndices = useMemo(() => {
      const handleIndex = sizes.findIndex((s) => s.key === handleId);
      return {
        prevPanel: handleIndex > 0 ? sizes[handleIndex - 1] : null,
        nextPanel: handleIndex < sizes.length - 1 ? sizes[handleIndex + 1] : null,
        previousHandles: sizes.slice(0, handleIndex - 1).reduce((acc, curr) => {
          return acc + (curr.value.value || 0);
        }, 0),
      };
    }, [sizes, handleId]);

    const gesture = Gesture.Pan()
      .onStart(() => {
        prevPosition.value = handlePosition.value;
      })
      .onUpdate(({ translationX, translationY }) => {
        const delta = direction === "vertical" ? translationY : translationX;
        const deltaPercentage = (delta * 100) / containerSize;

        if (panelIndices.prevPanel && panelIndices.nextPanel) {
          const newPosition = prevPosition.value + deltaPercentage;

          // Get prev and next panels' current sizes
          const prevPanelSize = panelIndices.prevPanel.value.value;
          const nextPanelSize = panelIndices.nextPanel.value.value;

          // Calculate new sizes after resize
          const sizeDiff = newPosition - handlePosition.value;
          const newPrevPanelSize = prevPanelSize + sizeDiff;
          const newNextPanelSize = nextPanelSize - sizeDiff;

          // Get panel refs to access their constraints
          const prevPanelRef = sizes.find((s) => s.key === panelIndices.prevPanel?.key);
          const nextPanelRef = sizes.find((s) => s.key === panelIndices.nextPanel?.key);

          // Apply min/max constraints
          const prevPanelMinSize = prevPanelRef?.minSize ?? 10;
          const prevPanelMaxSize = prevPanelRef?.maxSize ?? 100;
          const nextPanelMinSize = nextPanelRef?.minSize ?? 10;
          const nextPanelMaxSize = nextPanelRef?.maxSize ?? 100;

          // Check if new sizes respect constraints
          if (
            newPrevPanelSize >= prevPanelMinSize &&
            newPrevPanelSize <= prevPanelMaxSize &&
            newNextPanelSize >= nextPanelMinSize &&
            newNextPanelSize <= nextPanelMaxSize
          ) {
            // Update the panels' sizes
            panelIndices.prevPanel.value.value = newPrevPanelSize;
            panelIndices.nextPanel.value.value = newNextPanelSize;
            handlePosition.value = newPosition;
          }
        }
      });

    const animatedStyle = useAnimatedStyle(() => ({
      [direction === "vertical" ? "top" : "left"]: `${handlePosition.value}%`,
    }));

    React.useEffect(() => {
      const cleanup = panel(handleId, handlePosition, 0, 100);
      return cleanup;
    }, [handleId]);

    React.useEffect(() => {
      if (panelIndices?.prevPanel?.value) {
        handlePosition.value =
          panelIndices.previousHandles + panelIndices.prevPanel.value.value;
      }
    }, [panelIndices?.prevPanel?.key]);

    return (
      <GestureDetector gesture={gesture}>
        <Animated.View
          ref={ref}
          style={animatedStyle}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className={cn(
            "absolute z-10 bg-border items-center",
            direction === "vertical"
              ? "w-full h-1 justify-center"
              : "w-1 h-full justify-center",
            className,
          )}
          {...props}
        >
          {withHandle && (
            <View
              className={cn(
                "items-center justify-center rounded-sm border bg-border",
                direction === "vertical" ? "h-4 w-6" : "h-6 w-4",
              )}
            >
              {direction === "vertical" ? (
                <GripHorizontal className="h-4 w-4 text-foreground" />
              ) : (
                <GripVertical className="h-4 w-4 text-foreground" />
              )}
            </View>
          )}
        </Animated.View>
      </GestureDetector>
    );
  },
);
ResizableHandle.displayName = "ResizableHandle";

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
