
import * as React from "react";
import Calendar from "react-calendar";
import { cn } from "@/lib/utils";
import 'react-calendar/dist/Calendar.css';

export type CalendarProps = React.ComponentProps<typeof Calendar>;

function CustomCalendar({
  className,
  classNames,
  ...props
}: CalendarProps) {
  return (
    <Calendar
      className={cn(
        "p-3 bg-white rounded-lg shadow-sm border border-gray-200",
        "react-calendar", // Base class
        "react-calendar--light", // Light mode
        className
      )}
      {...props}
    />
  );
}

CustomCalendar.displayName = "Calendar";

export { CustomCalendar as Calendar };

