import { View } from "react-native";
import React from "react";
import Animated, {
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
} from "react-native-reanimated";

interface MeasureElementProps {
  onLayout: (width: number) => void;
  children: React.ReactNode;
}

const MeasureElement: React.FC<MeasureElementProps> = ({ onLayout, children }) => (
  <Animated.ScrollView
    horizontal
    pointerEvents="box-none"
    style={{ zIndex: -1, opacity: 0 }}
  >
    <View onLayout={(ev) => onLayout(ev.nativeEvent.layout.width)}>{children}</View>
  </Animated.ScrollView>
);

interface TranslatedElementProps {
  index: number;
  children: React.ReactNode;
  offset: Animated.SharedValue<number>;
  childrenWidth: number;
  separatorWidth: number;
}

const TranslatedElement: React.FC<TranslatedElementProps> = ({
  index,
  children,
  offset,
  childrenWidth,
  separatorWidth,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      left: index * (childrenWidth + separatorWidth),
      transform: [
        {
          translateX: -offset.value,
        },
      ],
    };
  });
  return (
    <Animated.View style={[{ position: "absolute" }, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

interface ChildrenScrollerProps {
  duration: number;
  childrenWidth: number;
  parentWidth: number;
  reverse: boolean;
  children: React.ReactNode;
  separator?: React.ReactNode;
  separatorWidth: number;
}

const ChildrenScroller: React.FC<ChildrenScrollerProps> = ({
  duration,
  childrenWidth,
  parentWidth,
  reverse,
  children,
  separator,
  separatorWidth,
}) => {
  const offset = useSharedValue(0);
  const coeff = useSharedValue(reverse ? -1 : 1);

  React.useEffect(() => {
    coeff.value = reverse ? -1 : 1;
  }, [reverse]);

  useFrameCallback((i) => {
    const totalWidth = childrenWidth + separatorWidth;
    offset.value +=
      (coeff.value * ((i.timeSincePreviousFrame ?? 1) * totalWidth)) / duration;
    offset.value = offset.value % totalWidth;
  }, true);

  const count = Math.ceil(parentWidth / (childrenWidth + separatorWidth)) + 1;
  const renderChild = (index: number) => (
    <React.Fragment key={`clone-${index}`}>
      <TranslatedElement
        index={index}
        offset={offset}
        childrenWidth={childrenWidth}
        separatorWidth={separatorWidth}
      >
        {children}
      </TranslatedElement>
      {separator && (
        <TranslatedElement
          index={index}
          offset={offset}
          childrenWidth={childrenWidth}
          separatorWidth={separatorWidth}
        >
          <View style={{ left: childrenWidth }}>{separator}</View>
        </TranslatedElement>
      )}
    </React.Fragment>
  );

  return <>{Array.from({ length: count }, (_, i) => i).map(renderChild)}</>;
};

type MarqueeProps = View["props"] & {
  duration?: number;
  reverse?: boolean;
  separator?: React.ReactNode;
};

export const Marquee = React.forwardRef<View, MarqueeProps>(
  (
    { duration = 2000, reverse = false, separator, children, onLayout, ...props },
    ref,
  ) => {
    const [parentWidth, setParentWidth] = React.useState(0);
    const [childrenWidth, setChildrenWidth] = React.useState(0);
    const [separatorWidth, setSeparatorWidth] = React.useState(0);

    return (
      <View
        ref={ref}
        pointerEvents="box-none"
        onLayout={(ev) => {
          setParentWidth(ev.nativeEvent.layout.width);
          onLayout?.(ev);
        }}
        {...props}
      >
        <View className="flex-row items-center overflow-hidden" pointerEvents="box-none">
          <MeasureElement onLayout={setChildrenWidth}>{children}</MeasureElement>

          {separator && (
            <MeasureElement onLayout={setSeparatorWidth}>{separator}</MeasureElement>
          )}

          {childrenWidth > 0 &&
            parentWidth > 0 &&
            (separator ? separatorWidth > 0 : true) && (
              <ChildrenScroller
                duration={duration}
                parentWidth={parentWidth}
                childrenWidth={childrenWidth}
                reverse={reverse}
                separator={separator}
                separatorWidth={separator ? separatorWidth : 4}
              >
                {children}
              </ChildrenScroller>
            )}
        </View>
      </View>
    );
  },
);
Marquee.displayName = "Marquee";
