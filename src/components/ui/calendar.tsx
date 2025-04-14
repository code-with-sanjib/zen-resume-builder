import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, SelectSingleEventHandler } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  // Get current year for default selection
  const today = new Date();
  const currentYear = today.getFullYear();
  
  // Track the selected year
  const [selectedYear, setSelectedYear] = React.useState<number>(
    props.selected instanceof Date ? props.selected.getFullYear() : currentYear
  );
  
  // Generate an array of years (10 years before and after current year)
  const years = React.useMemo(() => {
    const startYear = currentYear - 10;
    const endYear = currentYear + 10;
    return Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
  }, [currentYear]);

  // Create a custom caption component that includes year dropdown
  const CustomCaption = React.useCallback(({ displayMonth }: { displayMonth: Date }) => {
    const handleYearSelect = (selectedValue: string) => {
      const year = parseInt(selectedValue);
      setSelectedYear(year);
      
      // Create a new date with the selected year but keep current month
      const newDate = new Date(displayMonth);
      newDate.setFullYear(year);
      
      // Call the DayPicker's goToMonth function
      if (props.onMonthChange) {
        props.onMonthChange(newDate);
      }
    };

    return (
      <div className="flex items-center justify-center space-x-2">
        <Select 
          value={displayMonth.getFullYear().toString()}
          onValueChange={handleYearSelect}
        >
          <SelectTrigger className="w-[100px] h-7 text-xs">
            <SelectValue placeholder={displayMonth.getFullYear().toString()} />
          </SelectTrigger>
          <SelectContent className="max-h-[200px] overflow-y-auto">
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm font-medium">
          {displayMonth.toLocaleString('default', { month: 'long' })}
        </span>
      </div>
    );
  }, [props.onMonthChange, years]);

  // Create a wrapper around the original onSelect function to close the popover
  const handleSelect: SelectSingleEventHandler = React.useCallback((day, selected, activeModifiers, e) => {
    if (props.onSelect) {
      props.onSelect(day, selected, activeModifiers, e);
    }
  }, [props.onSelect]);

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 bg-popover rounded-lg shadow-sm", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "hidden", // Hide default caption label as we're using custom
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-medium text-[0.8rem] uppercase",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-full transition-colors"
        ),
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-full",
        day_today: "bg-accent text-accent-foreground rounded-full font-semibold",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
        Caption: CustomCaption
      }}
      onSelect={handleSelect}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
