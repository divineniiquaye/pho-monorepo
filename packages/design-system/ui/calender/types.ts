import { GestureResponderEvent, StyleProp, ViewStyle } from "react-native";
import { Locale } from "date-fns";

/**
 * Selection modes supported by DayPicker.
 *
 * - `single`: use DayPicker to select single days.
 * - `multiple`: allow selecting multiple days.
 * - `range`: use DayPicker to select a range of days.
 */
export type Mode = "single" | "multiple" | "range";

/**
 * Shared handler type for `onSelect` callback when a selection mode is set.
 *
 * @template T - The type of the selected item.
 * @callback OnSelectHandler
 * @param {T} selected - The selected item after the event.
 * @param {Date} triggerDate - The date when the event was triggered.
 * @param {GestureResponderEvent} e - The event object.
 */
export type OnSelectHandler<T> = (
    selected: T,
    triggerDate?: Date,
    e?: GestureResponderEvent,
) => void;

/**
 * An item in the calendar.
 *
 * @param {Date} date - The date of the day
 * @param {boolean} isCurrentMonth - Whether the day belongs to the current month
 */
export type DayItem = {
    date: Date | number;
    isCurrentMonth: boolean;
};

/**
 * Match a day falling after the specified date, with the date not included.
 *
 * @example
 *   // Match days after the 2nd of February 2019
 *   const matcher: DateAfter = { after: new Date(2019, 1, 2) };
 */
export type DateAfter = {
    after: Date;
};

/**
 * Match a day falling before the specified date, with the date not included.
 *
 * @example
 *   // Match days before the 2nd of February 2019
 *   const matcher: DateBefore = { before: new Date(2019, 1, 2) };
 */
export type DateBefore = {
    before: Date;
};

/**
 * An interval of dates. Differently from {@link DateRange}, the range ends here
 * are not included.
 *
 * @example
 *   // Match the days between the 2nd and the 5th of February 2019
 *   const matcher: DateInterval = {
 *     after: new Date(2019, 1, 2),
 *     before: new Date(2019, 1, 5)
 *   };
 */
export type DateInterval = {
    before: Date;
    after: Date;
};

/**
 * A range of dates. The range can be open. Differently from
 * {@link DateInterval}, the range ends here are included.
 *
 * @example
 *   // Match the days between the 2nd and the 5th of February 2019
 *   const matcher: DateRange = {
 *     from: new Date(2019, 1, 2),
 *     to: new Date(2019, 1, 5)
 *   };
 */
export type DateRange = { from: Date; to?: Date };

/**
 * Match dates being one of the specified days of the week (`0-6`, where `0` is
 * Sunday).
 *
 * @example
 *   // Match Sundays
 *   const matcher: DayOfWeek = { dayOfWeek: 0 };
 *   // Match weekends
 *   const matcher: DayOfWeek = { dayOfWeek: [0, 6] };
 */
export type DayOfWeek = {
    dayOfWeek: number | number[];
};

/**
 * A value or a function that matches a specific day.
 *
 * @example
 *   // will always match the day
 *   const booleanMatcher: Matcher = true;
 *
 *   // will match the today's date
 *   const dateMatcher: Matcher = new Date();
 *
 *   // will match the days in the array
 *   const arrayMatcher: Matcher = [
 *     new Date(2019, 1, 2),
 *     new Date(2019, 1, 4)
 *   ];
 *
 *   // will match days after the 2nd of February 2019
 *   const afterMatcher: DateAfter = { after: new Date(2019, 1, 2) };
 *
 *   // will match days before the 2nd of February 2019 }
 *   const beforeMatcher: DateBefore = { before: new Date(2019, 1, 2) };
 *
 *   // will match Sundays
 *   const dayOfWeekMatcher: DayOfWeek = {
 *     dayOfWeek: 0
 *   };
 *
 *   // will match the included days, except the two dates
 *   const intervalMatcher: DateInterval = {
 *     after: new Date(2019, 1, 2),
 *     before: new Date(2019, 1, 5)
 *   };
 *
 *   // will match the included days, including the two dates
 *   const rangeMatcher: DateRange = {
 *     from: new Date(2019, 1, 2),
 *     to: new Date(2019, 1, 5)
 *   };
 *
 *   // will match when the function return true
 *   const functionMatcher: Matcher = (day: Date) => {
 *     return day.getMonth() === 2; // match when month is March
 *   };
 */
export type Matcher =
    | boolean
    | ((date: Date) => boolean)
    | Date
    | Date[]
    | DateRange
    | DateBefore
    | DateAfter
    | DateInterval
    | DayOfWeek;

/**
 * The event handler when a month is changed in the calendar.
 *
 * ```tsx
 * <Calender onMonthChange={(month) => console.log(month)} />
 * ```
 */
export type MonthChangeEventHandler = (month: Date) => void;

/**
 * The CSS classnames to use for the {@link UI} elements, the
 * {@link SelectionState} and the {@link DayFlag}.
 *
 * @example
 *   const classNames = {
 *     "selected": "rounded-full bg-red-500",
 *     // etc.
 *   };
 */
export type ClassNames = {
    row?: string;
    trigger?: string;
    weeks?: string;
    navigation?: string;
    chevronLeft?: string;
    chevronRight?: string;
    timestamp?: string;
    dayText?: string;
    day?: string;
    today?: string;
    year?: string;
    range?: string;
    selected?: string;
    weekdays?: string;
    month?: string;
};

export interface PropsSingle {
    mode: "single";
    /** The selected date. */
    selected: Date | undefined;
    /** Event handler when a day is selected. */
    onSelect?: OnSelectHandler<Date>;
}

/**
 * The props when the multiple selection is required.
 */
export interface PropsMulti {
    /** The maximum number of selectable days. */
    mode: "multiple" | number;
    /** The selected dates. */
    selected: Date[] | undefined;
    /** Event handler when days are selected. */
    onSelect?: OnSelectHandler<Date[]>;
}

/**
 * The props when the range selection is required.
 */
export interface PropsRange {
    mode: "range";
    /**
     * When `true`, the range will reset when including a disabled day.
     */
    excludeDisabled?: boolean | undefined;
    /** The selected range. */
    selected: DateRange | undefined;
    /** Event handler when a range is selected. */
    onSelect?: OnSelectHandler<DateRange>;
}

export type PropsBase = {
    /**
     * Enable the selection of a single day, multiple days, or a range of days.
     */
    mode?: Mode | number | undefined;

    /** Styles to add to the root element. */
    style?: StyleProp<ViewStyle>;

    /** Class name to add to the root element. */
    className?: string;

    /**
     * Change the class names used to style Calender.
     *
     * Use this prop when you need to change the default class names — for
     * example, when importing the style via CSS modules or when using a CSS
     * framework.
     */
    classNames?: ClassNames;

    /**
     * The text direction of the calendar. Use `ltr` for left-to-right (default)
     * or `rtl` for right-to-left.
     */
    dir?: HTMLDivElement["dir"];

    /**
     * The locale object used to localize dates. Pass a locale from
     * `date-fns/locale` to localize the calendar.
     *
     * @example
     *   import { es } from "date-fns/locale";
     *   <Calender locale={es} />
     *
     * @defaultValue enUS - The English locale default of `date-fns`.
     * @see https://github.com/date-fns/date-fns/tree/main/src/locale for a list of the supported locales
     */
    locale?: Locale;

    /**
     * Show the outside days (days falling in the next or the previous month).
     */
    showOutsideDays?: boolean;

    /**
     * Show the week numbers column. Weeks are numbered according to the local
     * week index.
     *
     * - To use ISO week numbering, use the `ISOWeek` prop.
     * - To change how the week numbers are displayed, use the `formatters` prop.
     */
    showWeekNumber?: boolean;

    /**
     * Hide the row displaying the weekday row header.
     */
    hideWeekdays?: boolean;

    /**
     * Hide the navigation buttons. This prop won't disable the navigation: to
     * disable the navigation, use {@link disableNavigation}.
     */
    hideNavigation?: boolean;

    /**
     * Disable the navigation between months. This prop won't hide the navigation:
     * to hide the navigation, use {@link hideNavigation}.
     */
    disableNavigation?: boolean;

    /**
     * Show the the Calender first week but it is horizontally scrollable,
     * and can be dragged down to open full calendar.
     *
     * NOTE: This prop is currently only supported on web.
     */
    expandable?: boolean;

    /**
     * Show and apply timestamp to selected dates.
     */
    timestamp?: "H" | "M" | "S" | "H:M" | "H:M:S";

    /**
     * Show dropdowns to navigate between months or years.
     *
     * - `true`: display the dropdowns for both month and year
     * - `label`: display the month and the year as a label.
     * - `month`: display only the dropdown for the months
     * - `year`: display only the dropdown for the years
     *
     * **Note:** showing the dropdown will set the start/end months
     * {@link fromYear} to 100 years ago, and {@link toYear} to the current year.
     */
    captionLayout?: "label" | "dropdown" | "dropdown-months" | "dropdown-years";

    /**
     * The year the calendar ends at. If value is a number,
     * it will be the number of years from the current year.
     *
     * @defaultValue Is 100 years from the current year
     */
    fromYear?: number | Date;

    /**
     * This the year the calendar starts at.
     *
     * @defaultValue The current year.
     */
    toYear?: Date;

    /**
     * The index of the first day of the week (0 - Sunday). Overrides the locale's
     * one.
     */
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | undefined;

    /**
     * Apply the `disabled` modifier to the matching days.
     */
    disabled?: Matcher | Matcher[] | undefined;

    /**
     * Event handler when the next month button is clicked.
     */
    onNextClick?: MonthChangeEventHandler;

    /**
     * Event handler when the previous month button is clicked.
     */
    onPrevClick?: MonthChangeEventHandler;
};

export type CalendarProps = PropsBase &
    (
        | PropsSingle
        | PropsMulti
        | PropsRange
        | {
              mode?: undefined;
              selected: Date | Date[] | DateRange | undefined;
              onSelect?: OnSelectHandler<any>;
          }
    );
