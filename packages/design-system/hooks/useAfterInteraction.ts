import { InteractionManager } from "react-native";
import React from "react";

export function useAfterInteractions(
    delay?: number | false,
    /**
     * Optional async callback that returns a boolean
     * to drive the “ready” state. If you don’t need
     * any post-interaction logic, just omit it.
     */
    callback?: () => Promise<boolean>,
    deps: React.DependencyList = [],
) {
    const [ready, setReady] = React.useState(Boolean(process.env.JEST_WORKER_ID));
    React.useEffect(() => {
        if (process.env.JEST_WORKER_ID) return;
        let cancel: ReturnType<typeof InteractionManager.runAfterInteractions>;
        let timeout: ReturnType<typeof setTimeout>;
        const handler = async () => {
            const result = callback ? await callback() : true;
            setReady(result);
        };

        if (typeof delay === "number") {
            timeout = setTimeout(
                async () => {
                    cancel = await InteractionManager.runAfterInteractions(handler);
                },
                Math.max(300, delay),
            );
        } else {
            cancel = InteractionManager.runAfterInteractions(handler);
        }

        return () => {
            if (timeout) clearTimeout(timeout);
            cancel?.cancel();
        };
    }, [callback, delay, ...deps]);

    return { ready };
}
