import { useCallback, useState, useMemo } from "react";
import { GestureResponderEvent } from "react-native";
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    getWeek,
    startOfWeek,
    endOfWeek,
    isWithinInterval,
    eachWeekOfInterval,
    isAfter,
    isBefore,
    compareAsc,
    setHours,
    setMinutes,
    addSeconds,
} from "date-fns";

import { CalendarProps, DateRange, DayItem, Matcher } from "../ui/calender/types";

export function useCalendar(
    props: Pick<
        CalendarProps,
        | "weekStartsOn"
        | "showWeekNumber"
        | "mode"
        | "selected"
        | "onSelect"
        | "disabled"
        | "locale"
        | "toYear"
        | "onNextClick"
        | "onPrevClick"
    >,
) {
    const {
        weekStartsOn = 0,
        mode = "single",
        showWeekNumber = false,
        selected,
        onSelect,
        disabled,
        locale,
        toYear,
        onNextClick,
        onPrevClick,
    } = props;

    const [currentDate, setCurrentDate] = useState(toYear ?? new Date());

    const generateCalenderRows = useCallback(
        (days: DayItem[]): DayItem[][] => {
            const rows = [];
            const splitDays = showWeekNumber ? 8 : 7;
            for (let i = 0; i < days.length; i += splitDays) {
                rows.push(days.slice(i, i + splitDays));
            }

            return rows;
        },
        [currentDate, showWeekNumber],
    );

    const generateCalendarDays = useCallback((): DayItem[] => {
        const firstDayOfMonth = startOfMonth(currentDate);
        const lastDayOfMonth = endOfMonth(currentDate);
        const startDate = startOfWeek(firstDayOfMonth, { weekStartsOn });
        const endDate = endOfWeek(lastDayOfMonth, { weekStartsOn });

        const days = eachDayOfInterval({ start: startDate, end: endDate }).map(
            (date) => ({
                date,
                isCurrentMonth: isSameMonth(date, currentDate),
            }),
        );

        if (showWeekNumber) {
            let weekNumberIndex = 0;
            const weeks = eachWeekOfInterval({
                start: firstDayOfMonth,
                end: lastDayOfMonth,
            });
            return days.reduce((acc, day, index) => {
                if (index % 7 === 0 && weekNumberIndex < weeks.length) {
                    acc.push({
                        date: getWeek(weeks[weekNumberIndex]),
                        isCurrentMonth: day.isCurrentMonth,
                    });
                    weekNumberIndex++;
                }
                acc.push(day);
                return acc;
            }, [] as DayItem[]);
        }

        return days;
    }, [currentDate, showWeekNumber, weekStartsOn]);

    const generateCalendarWeekNumbers = useCallback(() => {
        const firstDayOfMonth = startOfMonth(currentDate);
        const lastDayOfMonth = endOfMonth(currentDate);

        return eachWeekOfInterval({
            start: firstDayOfMonth,
            end: lastDayOfMonth,
        }).map((date) => ({ date, weekNumber: getWeek(date) }));
    }, [currentDate]);

    const isDateMatched = useCallback((date: Date, matcher: Matcher): boolean => {
        if (typeof matcher === "boolean") return matcher;
        if (matcher instanceof Date) return isSameDay(date, matcher);
        if (Array.isArray(matcher)) return matcher.some((d) => isSameDay(date, d));
        if (typeof matcher === "function") return matcher(date);
        if ("after" in matcher) return isAfter(date, matcher.after);
        if ("before" in matcher) return isBefore(date, matcher.before);
        if ("from" in matcher && "to" in matcher) {
            return isWithinInterval(date, {
                start: matcher.from as Date,
                end: matcher.to as Date,
            });
        }
        if ("dayOfWeek" in matcher) {
            const dayOfWeek = Array.isArray(matcher.dayOfWeek)
                ? matcher.dayOfWeek
                : [matcher.dayOfWeek];
            return dayOfWeek.includes(date.getDay());
        }
        return false;
    }, []);

    const isDateDisabled = useCallback(
        (date: Date | number) => {
            if (!disabled || typeof date === "number") return false;
            const matchers = Array.isArray(disabled) ? disabled : [disabled];
            return matchers.some((matcher) => isDateMatched(date, matcher));
        },
        [disabled, isDateMatched],
    );

    const addTimeStamp = useCallback(
        (time: number, timestamp: "H" | "M" | "S") => {
            switch (typeof mode === "number" ? "multiple" : mode) {
                case "multiple":
                    const dates = (selected ?? []) as Date[];
                    if (dates.length >= 1) {
                        onSelect?.(
                            dates.map((date) =>
                                "H" === timestamp
                                    ? setHours(date, time)
                                    : "M" === timestamp
                                      ? setMinutes(date, time)
                                      : addSeconds(date, time),
                            ),
                        );
                    }
                    break;
                case "range":
                    const range = selected as DateRange;
                    onSelect?.({
                        from:
                            "H" === timestamp
                                ? setHours(range.from, time)
                                : "M" === timestamp
                                  ? setMinutes(range.from, time)
                                  : addSeconds(range.from, time),
                        to: range?.to
                            ? "H" === timestamp
                                ? setHours(range.to, time)
                                : "M" === timestamp
                                  ? setMinutes(range.to, time)
                                  : addSeconds(range.to, time)
                            : undefined,
                    } as DateRange);
                    break;
                default:
                    if (selected) {
                        onSelect?.(
                            "H" === timestamp
                                ? setHours(selected as Date, time)
                                : "M" === timestamp
                                  ? setMinutes(selected as Date, time)
                                  : addSeconds(selected as Date, time),
                        );
                    }
            }
        },
        [selected, mode],
    );

    const handleDateSelect = useCallback(
        (item: DayItem, e: GestureResponderEvent) => {
            // The second condition will never run, @ts type issue
            if (isDateDisabled(item.date) || typeof item.date === "number") return;

            switch (typeof mode === "number" ? "multiple" : mode) {
                case "multiple":
                    const dates = (selected ?? []) as Date[];
                    const value = dates.some((d) => isSameDay(d, item.date))
                        ? dates.filter((d) => !isSameDay(d, item.date))
                        : dates.length < (typeof mode === "number" ? mode : Infinity)
                          ? [...dates, item.date]
                          : [];
                    if (value.length > 0) onSelect?.(value, item.date, e);
                    break;
                case "range":
                    let selectedDate = selected as DateRange;
                    if (!selectedDate?.from || !!selectedDate?.to) {
                        onSelect?.({ from: item.date, to: undefined }, item.date, e);
                    } else {
                        let newSelectedDates = [
                            selectedDate.from as Date,
                            item.date,
                        ].sort((a, b) => a.getTime() - b.getTime());

                        if (compareAsc(newSelectedDates[0], newSelectedDates[1]) !== 0) {
                            onSelect?.(
                                { from: newSelectedDates[0], to: newSelectedDates[1] },
                                item.date,
                                e,
                            );
                        }
                    }
                    break;
                default: // single
                    onSelect?.(item.date, item.date, e);
            }
        },
        [onSelect, selected, mode, isDateDisabled],
    );

    const goToPreviousMonth = useCallback(() => {
        setCurrentDate((date) => subMonths(date, 1));
        onPrevClick?.(currentDate);
    }, [onPrevClick, currentDate]);

    const goToNextMonth = useCallback(() => {
        setCurrentDate((date) => addMonths(date, 1));
        onNextClick?.(currentDate);
    }, [onNextClick, currentDate]);

    const monthYearString = useMemo(
        () => format(currentDate, "MMMM yyyy", { locale }),
        [currentDate, locale],
    );

    const weekDays = useMemo(() => {
        const days = eachDayOfInterval({
            start: startOfWeek(new Date(), { weekStartsOn }),
            end: endOfWeek(new Date()),
        }).map((day) => format(day, "eeeeee", { locale }));
        if (showWeekNumber) days.unshift("Wk");
        return days;
    }, [locale, showWeekNumber, weekStartsOn]);

    return {
        currentDate,
        setCurrentDate,
        addTimeStamp,
        generateCalendarDays,
        generateCalenderRows,
        generateCalendarWeekNumbers,
        isDateDisabled,
        handleDateSelect,
        goToPreviousMonth,
        goToNextMonth,
        monthYearString,
        weekDays,
    };
}
