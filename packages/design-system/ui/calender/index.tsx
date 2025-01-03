import { View, FlatList, Pressable, ScrollView } from "react-native";
import { useCallback, useMemo, useState } from "react";
import {
  format,
  isSameDay,
  addMonths,
  subMonths,
  isWithinInterval,
  setMonth,
  setYear,
  eachMonthOfInterval,
  eachYearOfInterval,
  isToday as isTodayDate,
} from "date-fns";

import { ChevronRight } from "@repo/design/icons/ChevronRight";
import { ChevronLeft } from "@repo/design/icons/ChevronLeft";
import { useCalendar } from "@repo/design/hooks/useCalender";
import { cn } from "@repo/design/lib/utils";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../table";
import { Option, Select, SelectContent, SelectItem, SelectTrigger } from "../select";
import type { DateRange, DayItem, CalendarProps } from "./types";
import { Separator } from "../separator";
import { TimePicker } from "./timestamp";
import { HStack } from "../stack";
import { Button } from "../button";
import { Text } from "../text";

function Calendar(props: CalendarProps) {
  const {
    showOutsideDays = true,
    hideNavigation = false,
    disableNavigation = false,
    hideWeekdays = false,
    className,
    classNames,
    timestamp,
    dir = "ltr",
    style,
    locale,
    selected,
    expandable,
    mode = "single",
    captionLayout = "label",
    fromYear,
    toYear,
  } = props;

  const {
    currentDate,
    setCurrentDate,
    addTimeStamp,
    generateCalenderRows,
    generateCalendarDays,
    isDateDisabled,
    handleDateSelect,
    goToPreviousMonth,
    goToNextMonth,
    monthYearString,
    weekDays,
  } = useCalendar(props);

  const [expand, setExpand] = useState(expandable);
  const days = generateCalendarDays();
  const months = useMemo(
    () =>
      eachMonthOfInterval({
        start: new Date(2023, 12, 1),
        end: new Date(2024, 11, 1),
      }).map((d) => format(d, "MMMM", { locale })),
    [locale],
  );

  const years = useMemo(() => {
    const currentYear = toYear ?? new Date();

    if (fromYear instanceof Date) {
      return eachYearOfInterval({ start: currentYear, end: fromYear }).map((d) =>
        d.getFullYear(),
      );
    }

    return Array.from(
      { length: fromYear ?? 100 },
      (_, i) => currentYear.getFullYear() - i,
    );
  }, [toYear, fromYear]);

  const handleMonthChange = useCallback(
    (option: Option) => {
      const newDate = setMonth(currentDate, months.indexOf(option?.value as string));
      setCurrentDate(newDate);
    },
    [currentDate, months, setCurrentDate],
  );

  const handleYearChange = useCallback(
    (option: Option) => {
      const newDate = setYear(currentDate, parseInt(option?.value as string, 10));
      setCurrentDate(newDate);
    },
    [currentDate, setCurrentDate],
  );

  const renderDay = useCallback(
    ({ item }: { item: DayItem }) => {
      const selectedDate =
        mode === "single"
          ? [selected as Date]
          : mode === "range"
            ? [(selected as DateRange)?.from as Date, (selected as DateRange)?.to as Date]
            : ((selected ?? []) as Date[]);

      const isInRange =
        mode === "range" &&
        selectedDate.length === 2 &&
        isWithinInterval(item.date, {
          start: selectedDate[0] as Date,
          end: selectedDate[1] as Date,
        });

      const isWk = typeof item.date === "number";
      const isDisabled = isDateDisabled(item.date);
      const isToday = !isWk && isTodayDate(item.date);
      const isSelected = !isWk && selectedDate?.some?.((d) => isSameDay(d, item.date));

      return (
        <Pressable
          className={cn(
            "group min-h-10 min-w-10 items-center justify-center text-sm",
            isDisabled
              ? "text-muted-foreground opacity-50 hover:bg-transparent"
              : isSelected
                ? "bg-primary rounded-md"
                : isInRange
                  ? "bg-accent text-accent-foreground"
                  : isToday
                    ? "bg-accent rounded-md"
                    : "hover:bg-accent web:hover:text-accent-foreground hover:rounded-md",
            isInRange &&
              selectedDate[1].getDate() - selectedDate[0].getDate() === 1 &&
              "mx-px",
            classNames?.day,
          )}
          disabled={isWk || isDisabled || (!item.isCurrentMonth && !showOutsideDays)}
          onPress={(e) => handleDateSelect(item, e)}
        >
          <Text
            className={cn(
              {
                "opacity-0": !item.isCurrentMonth && !showOutsideDays,
                "text-primary-foreground opacity-100": isSelected,
                "text-accent-foreground": isToday && !isSelected,
                "text-muted-foreground": !item.isCurrentMonth && !isSelected,
                "opacity-80": isWk,
              },
              classNames?.dayText,
            )}
          >
            {isWk ? item.date.toString() : format(item.date, "d")}
          </Text>
        </Pressable>
      );
    },
    [
      currentDate,
      selected,
      handleDateSelect,
      locale,
      showOutsideDays,
      mode,
      isDateDisabled,
      classNames,
    ],
  );

  const renderCaption = useCallback(() => {
    const selectedMonth = format(currentDate, "LLLL", { locale });
    const selectedYear = format(currentDate, "yyyy", { locale });
    const monthSelect = (
      <Select
        defaultValue={{ value: selectedMonth, label: selectedMonth }}
        onValueChange={handleMonthChange}
      >
        <SelectTrigger
          className={cn("bg-transparent border-0 gap-1 web:ring-0", classNames?.trigger)}
          aria-label="Month"
        >
          <Text className={cn("font-medium text-base native:text-lg", classNames?.month)}>
            {selectedMonth}
          </Text>
          {captionLayout === "dropdown-years" && (
            <Text
              className={cn("font-medium text-base native:text-lg", classNames?.month)}
            >
              {selectedYear}
            </Text>
          )}
        </SelectTrigger>
        <SelectContent style={{ minWidth: 154 }}>
          <FlatList
            data={months}
            initialNumToRender={12}
            renderItem={({ item }) => (
              <SelectItem key={item} value={item} label={item}>
                {item}
              </SelectItem>
            )}
            keyExtractor={(item) => item}
          />
        </SelectContent>
      </Select>
    );

    const yearSelect = (
      <Select
        defaultValue={{ value: selectedYear, label: selectedYear }}
        onValueChange={handleYearChange}
      >
        <SelectTrigger
          className={cn("bg-transparent border-0 gap-1 web:ring-0", classNames?.trigger)}
          aria-label="Year"
        >
          {captionLayout === "dropdown-months" && (
            <Text
              className={cn("font-medium text-base native:text-lg", classNames?.month)}
            >
              {selectedMonth}
            </Text>
          )}
          <Text className={cn("font-medium text-base native:text-lg", classNames?.month)}>
            {selectedYear}
          </Text>
        </SelectTrigger>
        <SelectContent style={{ height: 384 }}>
          <FlatList
            data={years}
            renderItem={({ item }) => (
              <SelectItem key={item} value={item.toString()} label={item.toString()}>
                {item}
              </SelectItem>
            )}
          />
        </SelectContent>
      </Select>
    );

    switch (captionLayout) {
      case "dropdown":
        return (
          <HStack reversed={"rtl" === dir}>
            {monthSelect}
            {yearSelect}
          </HStack>
        );
      case "dropdown-months":
        return (
          <HStack className="items-center gap-1" reversed={"rtl" === dir}>
            {monthSelect}
            <Text
              className={cn("font-medium text-base native:text-lg", classNames?.year)}
            >
              {selectedYear}
            </Text>
          </HStack>
        );
      case "dropdown-years":
        return (
          <HStack className="items-center gap-1" reversed={"rtl" === dir}>
            <Text
              className={cn("font-medium text-base native:text-lg", classNames?.month)}
            >
              {selectedMonth}
            </Text>
            {yearSelect}
          </HStack>
        );
      case "label":
      default:
        return (
          <Text className={cn("font-medium text-base native:text-lg", classNames?.month)}>
            {monthYearString}
          </Text>
        );
    }
  }, [
    captionLayout,
    months,
    years,
    handleMonthChange,
    handleYearChange,
    monthYearString,
    classNames,
  ]);

  return (
    <View
      className={cn(
        "flex-1 bg-background border border-border rounded-md p-2.5 web:min-w-[360px]",
        className,
      )}
      style={style}
    >
      {!hideNavigation && (
        <View
          className={cn(
            "flex-row justify-between items-center mb-2",
            classNames?.navigation,
          )}
        >
          <Button
            variant="outline"
            onPress={goToPreviousMonth}
            disabled={disableNavigation}
            className={cn(
              "group w-12 h-8 [&_svg]:size-4 [&_svg]:shrink-0",
              classNames?.chevronLeft,
            )}
            accessibilityLabel={`Go to previous month, ${format(subMonths(currentDate, 1), "MMMM yyyy", { locale })}`}
          >
            <ChevronLeft className="text-primary transition-opacity opacity-60 group-hover:opacity-100 group-active:opacity-100 w-4 h-4" />
          </Button>
          {renderCaption()}
          <Button
            variant="outline"
            onPress={goToNextMonth}
            disabled={disableNavigation}
            className={cn(
              "group w-12 h-8 [&_svg]:size-4 [&_svg]:shrink-0",
              classNames?.chevronRight,
            )}
            accessibilityLabel={`Go to next month, ${format(addMonths(currentDate, 1), "MMMM yyyy", { locale: locale })}`}
          >
            <ChevronRight className="text-primary transition-opacity opacity-60 group-hover:opacity-100 group-active:opacity-100 w-4 h-4" />
          </Button>
        </View>
      )}
      <Table>
        {!hideWeekdays && (
          <TableHeader>
            <TableRow
              className={cn(
                "justify-between border-0",
                "rtl" === dir && "flex-row-reverse",
                classNames?.weekdays,
              )}
            >
              {weekDays.map((day) => (
                <TableHead key={day} className="text-center p-0 min-h-10 min-w-10">
                  <Text key={day} className="text-foreground text-center font-medium">
                    {day}
                  </Text>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
        )}
        <TableBody asChild>
          <ScrollView
            horizontal={expand}
            pagingEnabled={expandable}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            scrollToOverflowEnabled={true}
            contentContainerClassName="gap-2"
          >
            {generateCalenderRows(days).map((row, i) => (
              <TableRow
                key={i}
                className={cn(
                  "w-full border-0 web:hover:bg-muted/30",
                  expand && "w-[39vh] native:w-[calc(var(---width)-48px)]",
                  "rtl" === dir && "flex-row-reverse",
                  classNames?.row,
                )}
              >
                {row.map((item, i) => (
                  <TableCell key={i} className="p-0 flex-1">
                    {renderDay({ item })}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </ScrollView>
        </TableBody>
      </Table>
      {timestamp && (
        <View className="mt-4 flex-col">
          <Separator />
          <TimePicker
            mode={timestamp}
            onChange={addTimeStamp}
            className={classNames?.timestamp}
          />
        </View>
      )}
      {expandable && (
        <Pressable
          className="w-full h-3 mt-3 justify-center items-center"
          onPress={() => setExpand(!expand)}
        >
          <View className="w-14 h-1 bg-primary/50 rounded-xl" />
        </Pressable>
      )}
    </View>
  );
}

export { Calendar, type CalendarProps };
