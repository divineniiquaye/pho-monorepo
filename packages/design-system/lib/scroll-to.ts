import {
    AnimatedRefOnJS,
    AnimatedRefOnUI,
} from "react-native-reanimated/lib/typescript/hook/commonTypes";
import { AnimatedRef, dispatchCommand } from "react-native-reanimated";
import { Platform } from "react-native";
import { Component } from "react";

type localGlobal = typeof global & Record<string, unknown>;

type ScrollToProps =
    | {
          dispatch: "scrollToOffset";
          animated?: false;
          offset: number;
      }
    | {
          dispatch: "scrollTo";
          animated?: false;
          x: number;
          y: number;
      };

type ScrollTo = <T extends Component>(
    animatedRef: AnimatedRef<T>,
    props: ScrollToProps,
) => void;

/**
 * Lets you synchronously scroll to a given position of a `ScrollView`.
 * Note: This function is not available on Fabric.
 *
 * @param animatedRef - An [animated
 *   ref](https://docs.swmansion.com/react-native-reanimated/docs/core/useAnimatedRef)
 *   attached to an `Animated.ScrollView` or `Animated.FlatList` component.
 * @param props - The props you want to pass to the `scrollTo` command.
 * @see https://docs.swmansion.com/react-native-reanimated/docs/scroll/scrollTo
 */
export let scrollTo: ScrollTo;

function scrollToFabric<T extends Component>(
    animatedRef: AnimatedRefOnJS | AnimatedRefOnUI,
    props: ScrollToProps,
) {
    "worklet";
    if ("scrollTo" === props.dispatch) {
        dispatchCommand(
            // This assertion is needed to comply to `dispatchCommand` interface
            animatedRef as unknown as AnimatedRef<Component>,
            props.dispatch,
            [props.x, props.y, props.animated ?? true],
        );
    } else if ("scrollToOffset" === props.dispatch) {
        dispatchCommand(
            // This assertion is needed to comply to `dispatchCommand` interface
            animatedRef as unknown as AnimatedRef<Component>,
            props.dispatch,
            [props.offset, props.animated ?? true],
        );
    }
}

function scrollToJest() {
    console.warn("scrollTo() is not supported with Jest.");
}

function scrollToChromeDebugger() {
    console.warn("scrollTo() is not supported with Chrome Debugger.");
}

function scrollToDefault() {
    console.warn("scrollTo() is not supported on this configuration.");
}

if (!shouldBeUseWeb()) {
    // Those assertions are actually correct since on Native platforms `AnimatedRef` is
    // mapped as a different function in `shareableMappingCache` and
    // TypeScript is not able to infer that.
    scrollTo = scrollToFabric as unknown as ScrollTo;
} else if (isJest()) {
    scrollTo = scrollToJest;
} else if (isChromeDebugger()) {
    scrollTo = scrollToChromeDebugger;
} else {
    scrollTo = scrollToDefault;
}

function shouldBeUseWeb() {
    return (
        isJest() ||
        isChromeDebugger() ||
        Platform.OS === "web" ||
        Platform.OS === "windows"
    );
}

function isJest() {
    return !!process.env.JEST_WORKER_ID;
}

function isChromeDebugger() {
    return (
        (!(global as localGlobal).nativeCallSyncHook ||
            !!(global as localGlobal).__REMOTEDEV__) &&
        !(global as localGlobal).RN$Bridgeless
    );
}
