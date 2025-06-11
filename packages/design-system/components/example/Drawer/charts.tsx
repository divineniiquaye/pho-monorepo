"use dom";

// Css should always be imported where `use dom` is declared
import "@repo/design/tailwind/global.css";

import { Button } from "@repo/design/ui/button";
import { Minus, Plus } from "lucide-react-native";
import { Bar, BarChart, ResponsiveContainer } from "recharts";
import { DomLayout } from "@repo/design/layout/dom";

const data = [
  {
    goal: 400,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 239,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 349,
  },
];

export default function DOMComponent({
  goal,
  onClick,
}: {
  goal: number;
  onClick: (adjustment: number) => void;
}) {
  return (
    <DomLayout>
      <div className="p-4 -mb-8 w-full">
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full"
            onPress={() => onClick(-10)}
            disabled={goal <= 200}
          >
            <Minus />
            <span className="sr-only">Decrease</span>
          </Button>
          <div className="flex-1 text-center">
            <div className="text-7xl font-bold tracking-tighter">{goal}</div>
            <div className="text-[0.70rem] uppercase text-muted-foreground">
              Calories/day
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full"
            onPress={() => onClick(10)}
            disabled={goal >= 400}
          >
            <Plus />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
        <div className="mt-3 h-28">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <Bar
                dataKey="goal"
                style={
                  {
                    fill: "hsl(var(--foreground))",
                    opacity: 0.9,
                  } as React.CSSProperties
                }
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DomLayout>
  );
}
