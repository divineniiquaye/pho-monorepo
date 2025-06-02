import { useAnimatedRef } from "react-native-reanimated";
import { InteractionManager } from "react-native";
import React from "react";

export function useAfterInteractions<T extends React.Component>(
    callback?: (
        timeout: React.MutableRefObject<ReturnType<typeof setTimeout> | null>,
    ) => Promise<boolean>,
    deps: React.DependencyList = [],
) {
    const [areInteractionsComplete, setInteractionsComplete] = React.useState(
        !!process.env["JEST_WORKER_ID"],
    );
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const transitionRef = useAnimatedRef<T>();
    const subscriptionRef = React.useRef<ReturnType<
        typeof InteractionManager.runAfterInteractions
    > | null>(null);

    React.useEffect(() => {
        if (process.env["JEST_WORKER_ID"]) return;
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        subscriptionRef.current = InteractionManager.runAfterInteractions(async () => {
            if (transitionRef.current) {
                setInteractionsComplete(callback ? await callback(timeoutRef) : true);
            }
            subscriptionRef.current = null;
        });
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            subscriptionRef.current?.cancel();
        };
    }, [transitionRef, ...deps]);

    return { areInteractionsComplete, transitionRef };
}
