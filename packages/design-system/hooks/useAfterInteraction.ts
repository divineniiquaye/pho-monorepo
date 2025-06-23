import { InteractionManager } from "react-native";
import React from "react";

export function useAfterInteractions(
    delay: number | false = false,
    /**
     * Optional async callback that returns a boolean
     * to drive the “ready” state. If you don’t need
     * any post-interaction logic, just omit it.
     */
    callback?: () => Promise<boolean>,
    deps: React.DependencyList = [],
) {
    const [ready, setReady] = React.useState(Boolean(process.env.JEST_WORKER_ID));
    const interactionHandle = React.useRef<ReturnType<
        typeof InteractionManager.runAfterInteractions
    > | null>(null);
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    React.useEffect(() => {
        if (process.env.JEST_WORKER_ID) return;
        const runInteraction = async () => {
            interactionHandle.current = InteractionManager.runAfterInteractions(
                async () => {
                    const result = callback ? await callback() : true;
                    setReady(result);
                },
            );
        };

        if (delay === false) runInteraction();
        else timeoutRef.current = setTimeout(runInteraction, Math.max(delay, 300));

        return () => {
            interactionHandle.current?.cancel?.();
            interactionHandle.current = null;
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, [callback, delay, ...deps]);

    return { ready };
}
