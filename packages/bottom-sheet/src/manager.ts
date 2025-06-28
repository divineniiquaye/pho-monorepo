import { RefObject } from "react";

import { providerRegistryStack, sheetsRegistry } from "./provider";
import { BottomSheetInstance, Sheets } from "./types";
import { eventManager } from "./events";

// Array of all the ids of Sheets currently rendered in the app.
const ids: string[] = [];
const keys: string[] = [];
const refs: { [name: string]: RefObject<BottomSheetInstance> } = {};
const DEFAULT_Z_INDEX = 999;

const makeKey = (id: string, context: string) => `${id}:${context}`;

export const PrivateManager = {
    // Return to the previous sheet when the current sheet is closed.
    history: [] as { id: string; context: string }[],

    context(options?: { context?: string; id?: string }) {
        if (!options) options = {};
        if (!options?.context) {
            // If no context is provided, use to current top most context
            // to render the sheet.
            for (const context of providerRegistryStack.slice().reverse()) {
                // We only automatically select nested sheet providers.
                if (
                    context.startsWith("$$-auto") &&
                    !context.includes(options?.id as string)
                ) {
                    options.context = context;
                    break;
                }
            }
        }
        return options.context;
    },

    registerRef: (
        id: string,
        context: string,
        instance: RefObject<BottomSheetInstance>,
    ) => {
        const key = makeKey(id, context);
        refs[key] = instance;
        keys.push(key);
    },

    /**
     *
     * Get internal ref of a sheet by the given id.
     *
     * @param id Id of the sheet
     * @param context Context in which the sheet is rendered. Normally this function returns the top most rendered sheet ref automatically.
     */
    get: <SheetId extends keyof Sheets>(
        id: SheetId | (string & {}),
        context?: string,
    ): RefObject<BottomSheetInstance<SheetId>> => {
        if (!context) {
            for (let ctx of providerRegistryStack.slice().reverse()) {
                for (let _id in sheetsRegistry[ctx]) {
                    if (_id === id) {
                        context = ctx;
                        break;
                    }
                }
            }
        }
        return refs[makeKey(id, context!)] as RefObject<BottomSheetInstance<SheetId>>;
    },

    add: (id: string, context: string) => {
        if (ids.indexOf(id) < 0) {
            ids[ids.length] = makeKey(id, context);
        }
    },

    remove: (id: string, context: string) => {
        if (ids.indexOf(makeKey(id, context)) > -1) {
            ids.splice(ids.indexOf(makeKey(id, context)));
        }
    },

    zIndex: (id: string, context: string = "global"): number => {
        const index = keys.indexOf(makeKey(id, context));
        return index > -1 ? DEFAULT_Z_INDEX + index + 1 : DEFAULT_Z_INDEX;
    },

    stack: () =>
        ids.map((id) => {
            return {
                id: id.split(":")[0],
                context: id.split(":")?.[1] || "global",
            };
        }),
};

class _SheetManager {
    /**
     * Show the Modal Sheet with an id.
     *
     * @param id id of the Sheet to show
     * @param options
     */
    async show<SheetId extends keyof Sheets>(
        id: SheetId | (string & {}),
        options?: {
            /**
             * Any data to pass to the Sheet. Will be available from the component `props` prop on the modal sheet.
             */
            payload?: Sheets[SheetId]["payload"];

            /**
             * Receive payload from the Sheet when it closes
             */
            onClose?: (data: Sheets[SheetId]["returnValue"] | undefined) => void;

            /**
             * Provide `context` of the `SheetProvider` where you want to show the action sheet.
             */
            context?: string;
        },
    ): Promise<Sheets[SheetId]["returnValue"]> {
        return new Promise((resolve) => {
            const currentContext = PrivateManager.context({ ...options, id: id });
            const handler = (data: any, context = "global") => {
                if (context !== "global" && currentContext && currentContext !== context) return;
                options?.onClose?.(data);
                sub?.unsubscribe();
                resolve(data);
            };

            var sub = eventManager.subscribe(`onclose_${id}`, handler);
            PrivateManager.stack().forEach(({ id, context }) => {
                eventManager.publish(`hide_${id}`, undefined, context, true);
            });

            // Check if the sheet is registered with any `SheetProviders`.
            let isRegisteredWithSheetProvider = false;
            for (let ctx in sheetsRegistry) {
                for (let _id in sheetsRegistry[ctx]) {
                    if (_id === id) {
                        isRegisteredWithSheetProvider = true;
                    }
                }
            }
            eventManager.publish(
                isRegisteredWithSheetProvider ? `show_wrap_${id}` : `show_${id}`,
                options?.payload,
                currentContext || "global",
            );
        });
    }

    /**
     * An async hide function. This is useful when you want to show one Sheet after closing another.
     *
     * @param id id of the Sheet to show
     * @param data
     */
    async hide<SheetId extends keyof Sheets>(
        id: SheetId | (string & {}),
        options?: {
            /**
             * Return some data to the caller on closing the Sheet.
             */
            payload?: Sheets[SheetId]["returnValue"];
            /**
             * Provide `context` of the `SheetProvider` to hide the action sheet.
             */
            context?: string;
        },
    ): Promise<Sheets[SheetId]["returnValue"]> {
        let currentContext = PrivateManager.context({
            ...options,
            id: id,
        });
        return new Promise((resolve) => {
            let isRegisteredWithSheetProvider = false;
            // Check if the sheet is registered with any `SheetProviders`
            // and select the nearest context where sheet is registered.

            for (const _id of ids) {
                if (_id === `${id}:${currentContext}`) {
                    isRegisteredWithSheetProvider = true;
                    break;
                }
            }

            const hideHandler = (data: any, context = "global") => {
                if (context !== "global" && currentContext && currentContext !== context)
                    return;
                sub?.unsubscribe();
                resolve(data);
            };

            var sub = eventManager.subscribe(`onclose_${id}`, hideHandler);
            eventManager.publish(
                isRegisteredWithSheetProvider ? `hide_wrap_${id}` : `hide_${id}`,
                options?.payload,
                !isRegisteredWithSheetProvider ? "global" : currentContext,
            );
        });
    }

    /**
     * Hide all the opened Sheets.
     *
     * @param id Hide all sheets for the specific id.
     */
    hideAll<SheetId extends keyof Sheets>(id?: SheetId | (string & {})) {
        PrivateManager.stack().forEach(({ id: _id, context }) => {
            if (id && !_id.startsWith(id)) return;
            eventManager.publish(`hide_${_id}`, undefined, context);
        });
    }
}

/**
 * SheetManager is used to imperatively show/hide any sheet with a unique id prop.
 */
export const SheetManager = new _SheetManager();
