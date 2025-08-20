import Animated from "react-native-reanimated";
import React from "react";

import { cn } from "../lib";

type TypewriterProps = Omit<
  React.ComponentPropsWithoutRef<typeof Animated.Text>,
  "children"
> & {
  text: string;
  speed?: number;
  loop?: boolean;
  pauseAfterComplete?: number;
  cursor?: boolean;
  /** default: `animate-caret-blink duration-700 repeat-infinite` */
  cursorClassName?: string;
  onComplete?: () => void;
};

export const Typewriter = React.forwardRef<Animated.Text, TypewriterProps>(
  (
    {
      text,
      speed = 100,
      loop = false,
      pauseAfterComplete = 1000,
      cursor = false,
      className,
      cursorClassName,
      onComplete,
      ...props
    },
    ref,
  ) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const timerRef = React.useRef<NodeJS.Timeout>(null);

    React.useEffect(() => {
      timerRef.current && clearTimeout(timerRef.current);

      if (currentIndex < text.length) {
        timerRef.current = setTimeout(() => setCurrentIndex((i) => i + 1), speed);
      } else if (loop) {
        onComplete?.();
        timerRef.current = setTimeout(() => setCurrentIndex(0), pauseAfterComplete);
      } else {
        onComplete?.();
      }

      return () => {
        timerRef.current && clearTimeout(timerRef.current);
      };
    }, [currentIndex, text, speed, loop, pauseAfterComplete]);

    // When `text` prop changes, restart immediately
    React.useEffect(() => {
      setCurrentIndex(0);
    }, [text]);

    return (
      <Animated.Text
        ref={ref}
        className={cn("text-foreground text-xl font-medium leading-relaxed", className)}
        {...props}
      >
        {text.slice(0, currentIndex)}
        {cursor && (
          <Animated.Text
            className={cn(
              "animate-caret-blink duration-700 repeat-infinite",
              cursorClassName,
            )}
          >
            |
          </Animated.Text>
        )}
      </Animated.Text>
    );
  },
);

Typewriter.displayName = "Typewriter";
