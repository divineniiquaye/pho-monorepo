import RNSkeleton, { ISkeletonProps } from "react-native-reanimated-skeleton";
import { ViewProps, ViewStyle } from "react-native";
import React from "react";

import { useColorScheme } from "../hooks";

type LayoutNode = ViewStyle & {
  children?: LayoutNode[];
};

/**
 * Recursively traverses a React component tree to build a skeleton layout structure.
 * Only processes elements with `id="auto-skeleton"` prop, which can include optional styling.
 * 
 * The id prop format should be: `auto-skeleton@prop1:value1,prop2:value2`
 * Example: `id="auto-skeleton@width:100,height:20,marginBottom:8"`
 * 
 * @param nodes - Array of React nodes to process
 * @param parentKey - Key prefix for tracking node hierarchy (used internally)
 * @returns Array of LayoutNode objects describing the skeleton structure
 */
function buildLayout(nodes: React.ReactNode[], parentKey = ""): LayoutNode[] {
  const layouts: LayoutNode[] = [];

  nodes.forEach((node, index) => {
    if (!React.isValidElement(node)) return;
    const keyPath = parentKey === "" ? `${index}` : `${parentKey}-${index}`;
    const props = node.props as ViewProps;

    if (props.id?.startsWith("auto-skeleton")) {
      const [_, styleString] = props.id.split("@");
      const thisNode: LayoutNode = ((styleString as string) || "").split(",").reduce(
        (acc, style) => {
          const [key, value] = style.split(":");
          if (!key || !value) return acc;
          return { ...acc, [key]: isNaN(Number(value)) ? value : Number(value) };
        },
        (props.style as any) || {},
      );

      const childArray = props.children ? React.Children.toArray(props.children) : [];
      if (childArray.length > 0) {
        const nested = buildLayout(childArray, keyPath);
        if (nested.length > 0) {
          thisNode.children = nested;
        }
      }

      layouts.push(thisNode);
    } else {
      // Even if this node isn't skeletonized, its children might be
      const childArray = props.children ? React.Children.toArray(props.children) : [];
      if (childArray.length > 0) {
        const nested = buildLayout(childArray, keyPath);
        layouts.push(...nested);
      }
    }
  });

  return layouts;
}

/**
 * A wrapper component that automatically generates skeleton layouts based on child components.
 * Uses special `id` props to determine which elements should be skeletonized and their styles.
 *
 * @example
 * ```tsx
 * <AutoSkeleton>
 *   <View id="auto-skeleton@width:100,height:20">
 *     <Text>Loading...</Text>
 *   </View>
 * </AutoSkeleton>
 * ```
 */
const AutoSkeleton: React.FC<Omit<ISkeletonProps, "layout">> = ({
  children,
  ...props
}) => {
  const autoLayout = React.useMemo(() => {
    const top = React.Children.toArray(children) as React.ReactNode[];
    return buildLayout(top);
  }, [children]);

  return (
    <Skeleton {...props} layout={autoLayout}>
      {children}
    </Skeleton>
  );
};
AutoSkeleton.displayName = "AutoSkeleton";

/**
 * Base skeleton component that renders loading placeholders with customizable styles.
 * Automatically handles dark/light mode color schemes.
 */
const Skeleton: React.FC<ISkeletonProps> = ({
  containerStyle,
  boneColor,
  highlightColor,
  ...props
}) => {
  const { isDarkColorScheme } = useColorScheme();
  const COLORS = React.useMemo(
    () => (isDarkColorScheme ? ["#232b4a", "#1E243C"] : ["#f7FAFB", "#ebf0f4"]),
    [isDarkColorScheme],
  );
  return (
    <RNSkeleton
      containerStyle={[{ flex: 1 }, containerStyle]}
      highlightColor={highlightColor || COLORS[0]}
      boneColor={boneColor || COLORS[1]}
      {...props}
    />
  );
};
Skeleton.displayName = "Skeleton";

export { AutoSkeleton, Skeleton };
