import { useNavigationContainerRef } from "@react-navigation/native";
import * as Sentry from "@sentry/react-native";
import { useEffect } from "react";

import { Env } from "@/env";

const routingInstrumentation = Sentry.reactNavigationIntegration({
    enableTimeToInitialDisplay: true,
});

export const initSentry = () => {
    Sentry.init({
        environment: Env.APP_ENV,
        enabled: !__DEV__,
        tracesSampleRate: 1.0,
        dsn: process.env["SENTRY_DSN"] ?? "",
        replaysSessionSampleRate: 1.0,
        replaysOnErrorSampleRate: 1.0,
        integrations: [
            routingInstrumentation,
            Sentry.mobileReplayIntegration({
                maskAllText: false,
                maskAllVectors: false,
                maskAllImages: false,
            }),
        ],
    });
};

export const useSentryNavigationConfig = () => {
    const ref = useNavigationContainerRef();
    useEffect(() => {
        if (!!ref.current) {
            routingInstrumentation.registerNavigationContainer(ref);
        }
    }, [ref]);
};
