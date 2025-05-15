import React, { createContext, useContext } from "react";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { useSharedValue } from "react-native-reanimated";
import { Pressable } from "@rn-primitives/slot";
import type { DialogProps } from "vaul";
import { cssInterop } from "nativewind";
import { View } from "react-native";

import { cn } from "../../lib/utils";
import {
  PressableRef,
  SlottablePressableProps,
  SlottableTextProps,
  SlottableViewProps,
  TextRef,
  ViewRef,
} from "@rn-primitives/types";
import { Text } from "../text";

type DrawerContextType = {
  closeDrawer: () => void;
};

cssInterop(BottomSheetModal, {
  className: "style",
  handlerClassName: "handleStyle",
  handlerIndicatorClassName: "handleIndicatorStyle",
  containerClassName: "containerStyle",
  backgroundClassName: "backgroundStyle",
});

const toDecimal = (value: string) => Number(value.replace("%", "")) / 100;

const DrawerContext = createContext<DrawerContextType | null>(null);

export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error("useDrawer must be used within a DrawerProvider");
  }
  return context;
};

type DrawerProviderProps = DialogProps & {
  children: React.ReactNode;
  handleClassName?: string;
  handleIndicatorClassName?: string;
  containerClassName?: string;
  backgroundClassName?: string;
  className?: string;
};

const Drawer: React.FC<DrawerProviderProps> = ({
  open,
  activeSnapPoint,
  snapPoints = ["50%"],
  handleOnly,
  onClose,
  dismissible,
  children,
  className,
  containerClassName,
  backgroundClassName,
}) => {
  const triggerRef = React.useRef<React.ReactElement | null>(null);
  const headerRef = React.useRef<React.ReactElement | null>(null);
  const footerRef = React.useRef<React.ReactElement | null>(null);
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);
  const activeIndex = useSharedValue(
    typeof activeSnapPoint === "string"
      ? toDecimal(activeSnapPoint)
      : (activeSnapPoint ?? 0),
  );

  React.useEffect(() => {
    if (bottomSheetModalRef.current) {
      if (open) {
        bottomSheetModalRef.current?.present();
      } else {
        bottomSheetModalRef.current?.close();
      }
    }
  }, [open]);

  React.useEffect(() => {
    if (typeof activeSnapPoint === "string") {
      activeIndex.value = toDecimal(activeSnapPoint);
    }
  }, [activeSnapPoint]);

  const closeDrawer = () => {
    bottomSheetModalRef.current?.close();
  };

  const filteredChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === DrawerTrigger) {
        triggerRef.current = child;
        return null;
      }

      if (child.type === DrawerContent) {
        const content = child as React.ReactElement; // @ts-expect-error - We know that child is a valid element
        return React.Children.map(content.props.children, (contentChild) => {
          if (React.isValidElement(contentChild)) {
            if (contentChild.type === DrawerHeader) {
              headerRef.current = contentChild;
              return null;
            }

            if (contentChild.type === DrawerFooter) {
              footerRef.current = contentChild;
              return null;
            }
          }

          return contentChild;
        });
      }
    }

    return child;
  });

  return (
    <DrawerContext.Provider value={{ closeDrawer }}>
      <Pressable onPress={() => bottomSheetModalRef.current?.present()}>
        {triggerRef.current}
      </Pressable>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        animatedIndex={activeIndex}
        snapPoints={snapPoints}
        enableOverDrag={dismissible !== true}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            enableTouchThrough={!!handleOnly}
          />
        )}
        enablePanDownToClose={dismissible !== true} // @ts-ignore
        containerClassName={containerClassName}
        backgroundClassName={cn("bg-background", backgroundClassName)}
        className={cn("px-3", className)}
        handleComponent={() => (
          <View>
            <View className="mx-auto mt-4 h-2 w-20 rounded-full bg-muted" />
            {headerRef.current}
          </View>
        )}
        footerComponent={() => footerRef.current}
        onClose={onClose}
      >
        {filteredChildren}
      </BottomSheetModal>
    </DrawerContext.Provider>
  );
};

const DrawerPortal = React.Fragment;

/** Web only use  */
const DrawerOverlay = React.Fragment;

const DrawerContent = BottomSheetView;

const DrawerHeader = ({ className, ...props }: React.ComponentProps<typeof View>) => (
  <View className={cn("gap-1.5 p-4 text-center sm:text-left", className)} {...props} />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = React.forwardRef<ViewRef, SlottableViewProps>(
  ({ className, ...props }, ref) => (
    <View
      ref={ref}
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  ),
);
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, ...props }, ref) => (
    <Text
      ref={ref}
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  ),
);
DrawerTitle.displayName = "DrawerTitle";

const DrawerDescription = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, ...props }, ref) => (
    <Text
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  ),
);

const DrawerTrigger = React.forwardRef<PressableRef, SlottablePressableProps>(
  ({ children, ...props }, ref) => (
    <Pressable ref={ref} {...props}>
      {children}
    </Pressable>
  ),
);

const DrawerClose = React.forwardRef<PressableRef, SlottablePressableProps>(
  ({ children }, ref) => {
    const { dismiss } = useBottomSheetModal();
    return (
      <Pressable onPress={() => dismiss()} ref={ref}>
        {children}
      </Pressable>
    );
  },
);

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
