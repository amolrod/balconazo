"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  RangeCalendar as RangeCalendarPrimitive,
  DateValue,
  Heading,
  Button,
  RangeCalendarProps,
} from "react-aria-components";
import "./calendar-rac.css";

interface CalendarRangeProps<T extends DateValue> extends RangeCalendarProps<T> {
  className?: string;
}

export function RangeCalendar<T extends DateValue>({
  className,
  ...props
}: CalendarRangeProps<T>) {
  return (
    <RangeCalendarPrimitive
      className={`calendar-root ${className || ''}`}
      {...props}
    >
      <header className="calendar-header">
        <Button slot="previous" className="calendar-nav-btn">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Heading className="calendar-heading" />
        <Button slot="next" className="calendar-nav-btn">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </header>
      <CalendarGrid className="calendar-grid">
        <CalendarGridHeader>
          {(day) => (
            <CalendarHeaderCell className="calendar-weekday">
              {day}
            </CalendarHeaderCell>
          )}
        </CalendarGridHeader>
        <CalendarGridBody>
          {(date) => (
            <CalendarCell date={date} className="calendar-cell" />
          )}
        </CalendarGridBody>
      </CalendarGrid>
    </RangeCalendarPrimitive>
  );
}
