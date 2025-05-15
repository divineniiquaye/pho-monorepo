import { View, Pressable, useWindowDimensions } from "react-native";
import React, { forwardRef } from "react";
import { vars } from "nativewind";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  useAnimatedRef,
  runOnJS,
  SharedValue,
} from "react-native-reanimated";

import { ChevronLeft } from "../../icons/ChevronLeft";
import { ChevronRight } from "../../icons/ChevronRight";
import { cn } from "../../lib/utils";
import { Button } from "../button";
import { HStack } from "../stack";

/** Only supported on web */
type CarouselApi = {};

type CarouselContextType = {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  scrollX: SharedValue<number>;
  totalItems: number;
  itemWidth: number;
  autoPlay: boolean;
  autoPlayInterval: number;
  scrollViewRef: React.RefObject<Animated.ScrollView>;
  scrollTo: (index: number) => void;
  registerItem: (id: string) => number;
};

const CarouselContext = React.createContext<CarouselContextType | null>(null);

const useCarousel = () => {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error("Carousel components must be used within a Carousel component");
  }
  return context;
};

type CarouselProps = React.ComponentPropsWithoutRef<typeof Animated.View> & {
  orientation?: "horizontal" | "vertical";
  autoPlayInterval?: number;
  autoPlay?: boolean;
  /**
   * The height of the carousel.
   * @default 208
   */
  height?: number;
  /**
   * The width of the carousel.
   * Default is the width of the screen.
   */
  width?: number | ((width: number, height: number) => number);
};

type CarouselContentProps = Omit<
  React.ComponentPropsWithoutRef<typeof Animated.ScrollView>,
  | "horizontal"
  | "showsHorizontalScrollIndicator"
  | "showsVerticalScrollIndicator"
  | "scrollEventThrottle"
  | "onScroll"
>;

/**
 * TODO: Add support for vertical orientation
 */
const Carousel = forwardRef<React.ComponentRef<typeof Animated.View>, CarouselProps>(
  (
    {
      children,
      className,
      autoPlay = false,
      height = 208,
      width,
      autoPlayInterval = 3000,
      ...props
    },
    ref,
  ) => {
    const { width: WIDTH, height: HEIGHT } = useWindowDimensions();
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [totalItems, setTotalItems] = React.useState(0);

    const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
    const scrollX = useSharedValue(0);

    const itemWidth =
      typeof width === "function" ? width(WIDTH, HEIGHT) : (width ?? WIDTH);
    const itemsRegistry = React.useRef<string[]>([]);

    const registerItem = (id: string) => {
      if (!itemsRegistry.current.includes(id)) {
        itemsRegistry.current.push(id);
        setTotalItems(itemsRegistry.current.length);
      }

      return itemsRegistry.current.indexOf(id);
    };

    const scrollTo = (index: number) => {
      if (scrollViewRef.current && index >= 0 && index < totalItems) {
        scrollViewRef.current.scrollTo({
          x: index * itemWidth,
          animated: true,
        });
      }
    };

    React.useEffect(() => {
      let intervalId: ReturnType<typeof setInterval>;

      if (autoPlay && totalItems > 1) {
        intervalId = setInterval(() => {
          setActiveIndex((currentIndex) => {
            const nextIndex = (currentIndex + 1) % totalItems;
            scrollTo(nextIndex);
            return nextIndex;
          });
        }, autoPlayInterval);
      }

      return () => {
        if (intervalId) clearInterval(intervalId);
      };
    }, [totalItems, WIDTH, autoPlay, autoPlayInterval]);

    const contextValue: CarouselContextType = {
      totalItems,
      activeIndex,
      setActiveIndex,
      scrollX,
      itemWidth,
      autoPlay,
      autoPlayInterval,
      scrollViewRef,
      scrollTo,
      registerItem,
    };

    return (
      <CarouselContext.Provider value={contextValue}>
        <View
          style={vars({
            "--carousel-width": itemWidth,
            "--carousel-height": height,
          })}
        >
          <Animated.View
            ref={ref}
            className={cn("relative w-full h-[--carousel-height]", className)}
            {...props}
          >
            {children}
          </Animated.View>
        </View>
      </CarouselContext.Provider>
    );
  },
);
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef(
  (
    {
      children,
      className,
      contentContainerClassName,
      pagingEnabled = true,
      ...props
    }: CarouselContentProps,
    ref,
  ) => {
    const { scrollX, itemWidth, setActiveIndex, scrollViewRef } = useCarousel();

    React.useImperativeHandle(ref, () => scrollViewRef.current!);
    const scrollHandler = useAnimatedScrollHandler({
      onScroll: (event) => {
        scrollX.value = event.contentOffset.x;
        const newIndex = Math.round(scrollX.value / itemWidth);
        runOnJS(setActiveIndex)(newIndex);
      },
    });

    return (
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal={true}
        pagingEnabled={pagingEnabled}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        className={cn("flex-1 w-full h-full", className)}
        contentContainerClassName={cn("justify-center", contentContainerClassName)}
        {...props}
      >
        {children}
      </Animated.ScrollView>
    );
  },
);
CarouselContent.displayName = "CarouselContent";

const CarouselItem = forwardRef<
  Animated.View,
  React.ComponentPropsWithoutRef<typeof Animated.View> & {
    animation?: "scale" | "none";
    index: number;
  }
>(({ index, animation = "scale", children, className, style, ...props }, ref) => {
  const { itemWidth, scrollX, registerItem } = useCarousel();

  React.useEffect(() => {
    registerItem(`carousel-item-${index}`);
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => {
    if (animation === "scale") {
      return {
        transform: [
          {
            scale: interpolate(
              scrollX.value,
              [(index - 1) * itemWidth, index * itemWidth, (index + 1) * itemWidth],
              [0.8, 1, 0.8],
              "clamp",
            ),
          },
        ],
      };
    }

    return {};
  }, [animation]);

  return (
    <Animated.View
      ref={ref}
      style={[animatedStyle, style]}
      className={cn(
        "items-center justify-center",
        "w-[--carousel-width] h-full",
        className,
      )}
      {...props}
    >
      {children}
    </Animated.View>
  );
});
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = forwardRef<
  React.ComponentRef<typeof Pressable>,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { activeIndex, scrollTo } = useCarousel();

  const handlePress = () => {
    if (activeIndex > 0) {
      scrollTo(activeIndex - 1);
    }
  };

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute z-10 h-8 w-8 rounded-full bg-black/40 items-center justify-center",
        "left-2 top-1/2 -translate-y-1/2",
        className,
      )}
      disabled={activeIndex === 0}
      onPress={handlePress}
      {...props}
    >
      <ChevronLeft
        className={`h-5 w-5 ${activeIndex === 0 ? "text-foreground" : "text-foreground/50"}`}
      />
    </Button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = forwardRef<
  React.ComponentRef<typeof Pressable>,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { activeIndex, totalItems, scrollTo } = useCarousel();

  const handlePress = () => {
    if (activeIndex < totalItems - 1) {
      scrollTo(activeIndex + 1);
    }
  };

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute z-10 h-8 w-8 rounded-full bg-black/40 items-center justify-center",
        "right-2 top-1/2 -translate-y-1/2",
        className,
      )}
      disabled={activeIndex === totalItems - 1}
      onPress={handlePress}
      {...props}
    >
      <ChevronRight
        className={`h-5 w-5 ${
          activeIndex === totalItems - 1 ? "text-foreground" : "text-foreground/50"
        }`}
      />
    </Button>
  );
});
CarouselNext.displayName = "CarouselNext";

const CarouselEllipsis = forwardRef<
  React.ComponentRef<typeof View>,
  React.ComponentProps<typeof View> & {
    dotClassName?: string | ((isActive: boolean) => string);
  }
>(({ className, dotClassName, ...props }, ref) => {
  const { activeIndex, totalItems, scrollTo } = useCarousel();
  const dots = Array.from({ length: totalItems }, (_, i) => i);

  return (
    <HStack
      ref={ref}
      className={cn(
        "absolute items-center justify-center bottom-4 left-0 right-0 gap-2",
        className,
      )}
      {...props}
    >
      {dots.map((index) => (
        <Pressable
          key={index}
          onPress={() => scrollTo(index)}
          className={cn(
            "transition-all duration-300 size-2 rounded-[4px] bg-black/50",
            activeIndex === index && "bg-black w-4",
            typeof dotClassName === "function"
              ? dotClassName(activeIndex === index)
              : dotClassName,
          )}
        />
      ))}
    </HStack>
  );
});
CarouselEllipsis.displayName = "CarouselEllipsis";

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselEllipsis,
};
