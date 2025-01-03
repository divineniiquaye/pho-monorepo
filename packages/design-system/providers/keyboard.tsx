import React, { createContext, useContext, useCallback } from "react";
import { useWindowDimensions } from "react-native";
import {
  useSharedValue,
  SharedValue,
  useAnimatedKeyboard,
  useAnimatedStyle,
  interpolate,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import { scrollTo } from "../lib/scroll-to";

interface LayoutInfo {
  y: number;
  height: number;
}

interface KeyboardContextType {
  height: SharedValue<number>;
  focused: SharedValue<number>;
  setFocused: (layout: LayoutInfo) => void;
  clearFocused: () => void;
}

const KeyboardContext = createContext<KeyboardContextType | null>(null);

export const KeyboardProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { height } = useAnimatedKeyboard({ isStatusBarTranslucentAndroid: true });
  const { height: _height } = useWindowDimensions();
  const focused = useSharedValue(0);

  const setFocused = useCallback(({ y, height }: LayoutInfo) => {
    focused.value = _height - y - (height + 5);
  }, []);

  const clearFocused = useCallback(() => {
    focused.value = 0;
  }, []);

  const value = React.useMemo(
    () => ({
      height,
      focused,
      setFocused,
      clearFocused,
    }),
    [height, focused, setFocused, clearFocused],
  );

  return <KeyboardContext.Provider value={value}>{children}</KeyboardContext.Provider>;
};

export const useKeyboard = (): KeyboardContextType => {
  const context = useContext(KeyboardContext);
  if (!context) {
    throw new Error("useKeyboard must be used within a KeyboardProvider");
  }

  return context;
};

/**
 * By default, do not enable `softwareKeyboardLayoutMode` on Android to either pan or resize.
 * This will cause the keyboard animation to be broken.
 *
 * Returns reanimated style to be applied.
 */
export function useKeyboardReaction<T extends React.Component>(
  scrollDispatch?: "scrollTo" | "scrollToOffset",
) {
  const { height, focused } = useKeyboard();
  const scrollRef = useAnimatedRef<T>();
  const yOffset = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      yOffset.value = event.contentOffset.y;
    },
  });

  useAnimatedReaction(
    () => height.value,
    (value) => {
      if (scrollDispatch) {
        const pageY = Math.abs(focused.value);
        const yTo = pageY + value;

        if (yTo > yOffset.value) {
          scrollTo(
            scrollRef,
            "scrollTo" === scrollDispatch
              ? {
                  dispatch: "scrollTo",
                  x: 0,
                  y: pageY + value,
                }
              : {
                  dispatch: "scrollToOffset",
                  offset: pageY + value,
                },
          );
        }
      }
    },
    [scrollRef?.current],
  );

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateY: interpolate(
            height.value,
            [0, 1],
            [
              0,
              focused.value > height.value || focused.value === 0
                ? 0
                : -(height.value - focused.value),
            ],
            "clamp",
          ),
        },
      ],
    }),
    [],
  );

  return { scrollRef, scrollHandler, animatedStyle };
}

interface InputLayoutHook {
  onLayout: (event: LayoutInfo) => void;
  clearFocused: () => void;
}

export const useInputLayout = (): InputLayoutHook => {
  const { setFocused, clearFocused } = useKeyboard();

  const onLayout = useCallback(
    ({ y, height }: LayoutInfo) => setFocused({ y, height }),
    [setFocused],
  );

  return { onLayout, clearFocused };
};
