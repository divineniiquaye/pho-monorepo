"use client";

import * as React from "react";
import * as SliderPrimitive from "@rn-primitives/slider";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Platform, View } from "react-native";
import { vars } from "nativewind";

import { cn } from "../lib/utils";

type SliderThumbProps = {
  onChange?: (value: number[]) => void;
  disabled?: boolean;
  step: number;
  width: number;
  value: number;
  min: number;
  max: number;
};
const SliderThumbWeb = ({ value, max, min, disabled }: SliderThumbProps) => {
  const track = React.useMemo(
    () => convertValueToPercentage(value, min, max),
    [value, min, max],
  );
  return (
    <SliderPrimitive.Thumb
      style={vars({ "--radix-slider-thumb": `${track}%` })}
      collapsable={false}
      aria-label="Slider"
      className={cn(
        "absolute h-5 w-5 -translate-y-1.5 -translate-x-1/2 left-[--radix-slider-thumb] rounded-full border-2 border-primary bg-background ring-offset-background web:transition-colors focus-visible:outline-none web:focus-visible:ring-1 web:focus-visible:ring-ring web:focus-visible:ring-offset-1",
        disabled && "web:pointer-events-none opacity-50",
      )}
    />
  );
};
SliderThumbWeb.displayName = SliderPrimitive.Thumb.displayName + "Web";

const SliderThumbNative = ({ onChange, ...props }: SliderThumbProps) => {
  const lastValue = React.useRef(props.value);
  return (
    <GestureDetector
      gesture={Gesture.Pan()
        .enabled(!props.disabled)
        .onStart(() => {
          lastValue.current = props.value;
        })
        .onUpdate(({ translationX }) => {
          const newValue = Math.min(
            props.max,
            Math.max(
              props.min,
              lastValue.current + translationX * ((props.max - props.min) / props.width),
            ),
          );
          const steppedValue = Math.round(newValue / props.step) * props.step;
          onChange?.([steppedValue]);
        })
        .runOnJS(true)}
    >
      <SliderThumbWeb {...props} />
    </GestureDetector>
  );
};
SliderThumbNative.displayName = SliderPrimitive.Thumb.displayName + "Native";

const SliderThumb = Platform.select({
  web: SliderThumbWeb,
  default: SliderThumbNative,
});

const Slider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  const [width, setWidth] = React.useState(100);
  const track = React.useMemo(
    () => convertValueToPercentage(props.value, props.min ?? 0, props.max ?? 100),
    [props.value, props.min, props.max],
  );

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className,
      )}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Range
          style={vars({ "--radix-slider-range-track-width": `${track}%` })}
          className="web:absolute h-full w-[--radix-slider-range-track-width] bg-primary"
        />
      </SliderPrimitive.Track>
      <SliderThumb
        value={props.value}
        disabled={props.disabled}
        onChange={props.onValueChange}
        step={props.step ?? 1}
        max={props.max ?? 100}
        min={props.min ?? 0}
        width={width}
      />
    </SliderPrimitive.Root>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

function convertValueToPercentage(value: number, min: number, max: number) {
  const maxSteps = max - min;
  const percentPerStep = 100 / maxSteps;
  const percentage = percentPerStep * (value - min);
  return Math.min(percentage, Math.max(0, 100));
}

export { Slider };
