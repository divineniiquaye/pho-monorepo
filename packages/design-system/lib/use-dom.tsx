import { View } from "react-native";
import React from "react";
import { cn } from "./utils";

export type DomProps<P extends Record<string, any>> = {
  dom?: import("expo/dom").DOMProps;
  children: React.ComponentType<P>;
  /** If loader is string, it will be used as className for the default loader */
  loader?: React.ReactNode;
  duration?: number;
  className?: string;
} & P;

/**
 * Custom hook for dynamically loading and rendering DOM-specific components.
 * Provides a way to lazy load components with proper mounting/unmounting handling.
 * 
 * NOTE: Always use this hook at the top-level, do not use it inside a component.
 *
 * @template P - Generic type extending object for component props
 * @param {() => Promise<{ default: React.ComponentType<P> }>} importFn - Dynamic import function for the component
 * @returns {React.MemorizedComponent} Memoized component wrapper
 *
 * @example
 * const MyDomComponent = useDom(() => import('./MyDomComponent'));
 */
export function useDom<P extends object>(
  importFn: () => Promise<{ default: React.ComponentType<P> }>,
  { dom, loader, className }: Pick<DomProps<P>, "dom" | "loader" | "className"> = {},
) {
  return React.memo(function DynamicComponent(props: P) {
    const [Component, setComponent] = React.useState<React.ComponentType<P> | null>(null);

    React.useEffect(() => {
      let mounted = true;

      (async () => {
        try {
          const module = await importFn();
          if (mounted) {
            setComponent(() => module.default);
          }
        } catch (error) {
          console.error("Failed to load component:", error);
        }
      })();

      return () => {
        mounted = false;
      };
    }, []);

    if (!Component) {
      return null;
    }

    return (
      <DomComponent
        dom={dom}
        loader={loader}
        className={className}
        children={Component}
        {...props}
      />
    );
  });
}

/**
 * Wrapper component for DOM-specific components that provides loading states and styling.
 *
 * @component
 * @template P - Generic type extending object for component props
 *
 * @param {Object} props
 * @param {React.ComponentType<P>} props.children - The DOM component to render
 * @param {number} [props.duration=2000] - Loading state duration in milliseconds
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} [props.loader] - Custom loader component or className string
 * @param {import("expo/dom").DOMProps} [props.dom] - Expo DOM-specific props
 *
 * Features:
 * - Customizable loading states
 * - Default spinner animation
 * - Flexible styling options
 * - Proper cleanup on unmount
 *
 * @example
 * <DomComponent
 *   duration={1500}
 *   className="my-custom-class"
 *   loader={<CustomLoader />}
 * >
 *   <MyDOMComponent />
 * </DomComponent>
 */
export function DomComponent<P extends object>({
  children: DOMComponent,
  className,
  loader,
  dom,
  ...props
}: {
  dom?: import("expo/dom").DOMProps;
  children: React.ComponentType<P>;
  /** If loader is string, it will be used as className for the default loader */
  loader?: React.ReactNode;
  className?: string;
} & P) {
  const [isLoading, setIsLoading] = React.useState(true);

  return (
    <View className={cn("relative flex-1", className)}>
      {isLoading &&
        (loader ?? (
          <View
            className={cn(
              "absolute z-20 inset-0 flex items-center justify-center bg-background",
              typeof loader === "string" && loader,
            )}
          >
            <View className="animate-spin h-8 w-8 border-4 border-muted rounded-full border-t-primary" />
          </View>
        ))}
      <DOMComponent
        dom={{
          onLoadEnd: () => setIsLoading(false),
          matchContents: true,
          ...dom,
        }}
        {...(props as P)}
      />
    </View>
  );
}
