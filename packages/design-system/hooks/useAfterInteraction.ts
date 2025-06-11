import { InteractionManager } from "react-native";
import React from "react";

export function useAfterInteractions(
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

    React.useEffect(() => {
        if (process.env.JEST_WORKER_ID) return;
        interactionHandle.current = InteractionManager.runAfterInteractions(async () => {
            const result = callback ? await callback() : true;
            setReady(result);
        });

        return () => interactionHandle.current?.cancel();
    }, [callback, ...deps]);

    return { ready };
}
