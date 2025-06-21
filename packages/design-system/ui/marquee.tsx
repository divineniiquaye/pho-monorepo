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
}

const TranslatedElement: React.FC<TranslatedElementProps> = ({
  index,
  children,
  offset,
  childrenWidth,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      left: (index - 1) * childrenWidth,
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
}

const ChildrenScroller: React.FC<ChildrenScrollerProps> = ({
  duration,
  childrenWidth,
  parentWidth,
  reverse,
  children,
}) => {
  const offset = useSharedValue(0);
  const coeff = useSharedValue(reverse ? 1 : -1);

  React.useEffect(() => {
    coeff.value = reverse ? 1 : -1;
  }, [reverse]);

  useFrameCallback((i) => {
    offset.value +=
      (coeff.value * ((i.timeSincePreviousFrame ?? 1) * childrenWidth)) / duration;
    offset.value = offset.value % childrenWidth;
  }, true);

  const count = Math.round(parentWidth / childrenWidth) + 2;
  const renderChild = (index: number) => (
    <TranslatedElement
      key={`clone-${index}`}
      index={index}
      offset={offset}
      childrenWidth={childrenWidth}
    >
      {children}
    </TranslatedElement>
  );

  return <>{Array.from({ length: count }, (_, i) => i).map(renderChild)}</>;
};

type MarqueeProps = View["props"] & {
  duration?: number;
  reverse?: boolean;
};

export const Marquee = React.forwardRef<View, MarqueeProps>(
  ({ duration = 2000, reverse = false, children, onLayout, ...props }, ref) => {
    const [parentWidth, setParentWidth] = React.useState(0);
    const [childrenWidth, setChildrenWidth] = React.useState(0);

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
        <View className="flex-row overflow-hidden" pointerEvents="box-none">
          <MeasureElement onLayout={setChildrenWidth}>{children}</MeasureElement>

          {childrenWidth > 0 && parentWidth > 0 && (
            <ChildrenScroller
              duration={duration}
              parentWidth={parentWidth}
              childrenWidth={childrenWidth}
              reverse={reverse}
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
