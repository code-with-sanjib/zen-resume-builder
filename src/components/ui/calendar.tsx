
import * as React from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { DayPicker, SelectSingleEventHandler } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  onSelect?: SelectSingleEventHandler;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  onSelect,
  ...props
}: CalendarProps) {
  const { toast } = useToast();
  
  // Enhanced onSelect handler that closes the calendar
  const handleSelect: SelectSingleEventHandler = (day, selectedDay, activeModifiers) => {
    // Check if the day is disabled
    if (!day || (activeModifiers && activeModifiers.disabled)) {
      toast({
        title: "Invalid date selection",
        description: "Please select a valid date",
        variant: "destructive",
      });
      return;
    }
    
    // Call original onSelect if provided
    if (onSelect) {
      onSelect(day, selectedDay, activeModifiers);
    }
    
    // Close calendar by triggering the popover's onOpenChange 
    // The parent component should handle this by closing the popover
    if (day && props.onDayClick) {
      props.onDayClick(day, activeModifiers || {}, {} as React.MouseEvent<Element, MouseEvent>);
    }
  };
  
  // Memoize components to prevent unnecessary re-renders
  const Icons = React.useMemo(
    () => ({
      IconLeft: () => <ChevronLeft className="h-4 w-4 stroke-2" />,
      IconRight: () => <ChevronRight className="h-4 w-4 stroke-2" />,
    }),
    []
  );

  // Memoize the YearDropdown to avoid re-rendering when parent component updates
  const YearDropdown = React.useCallback(
    ({ displayMonth }: { displayMonth: Date }) => {
      const [isOpen, setIsOpen] = React.useState(false);
      const yearRef = React.useRef<HTMLDivElement>(null);
      const dropdownRef = React.useRef<HTMLDivElement>(null);
      const selectedYearRef = React.useRef<HTMLDivElement>(null);

      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const currentYear = displayMonth.getFullYear();
      const currentMonth = monthNames[displayMonth.getMonth()];

      // Create years array efficiently
      const years = React.useMemo(
        () => Array.from({ length: 2050 - 1950 + 1 }, (_, i) => i + 1950),
        []
      );

      // Handle outside clicks
      React.useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
          if (
            yearRef.current &&
            !yearRef.current.contains(event.target as Node)
          ) {
            setIsOpen(false);
          }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
          document.removeEventListener("mousedown", handleClickOutside);
      }, [isOpen]);

      // Scroll to selected year
      React.useEffect(() => {
        if (isOpen && selectedYearRef.current) {
          selectedYearRef.current.scrollIntoView({
            block: "center",
            behavior: "smooth",
          });
        }
      }, [isOpen]);

      // Handle year selection
      const handleYearSelect = React.useCallback(
        (year: number) => {
          props.onMonthChange?.(new Date(year, displayMonth.getMonth(), 1));
          setIsOpen(false);
        },
        [displayMonth, props.onMonthChange]
      );

      // Handle next month navigation
      const handleNextMonth = () => {
        const nextMonth = new Date(displayMonth);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        props.onMonthChange?.(nextMonth);
      };

      // Handle previous month navigation
      const handlePrevMonth = () => {
        const prevMonth = new Date(displayMonth);
        prevMonth.setMonth(prevMonth.getMonth() - 1);
        props.onMonthChange?.(prevMonth);
      };

      return (
        <div className="flex items-center justify-between w-full px-1">
          <button
            onClick={handlePrevMonth}
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100"
            )}
            title="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div
            className="flex items-center justify-center font-medium text-base relative select-none"
            ref={yearRef}
          >
            <div className="flex items-center gap-1">
              <span className="font-medium text-lg">{currentMonth}</span>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/30"
                  aria-haspopup="listbox"
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-lg">{currentYear}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isOpen ? "rotate-180 transform" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute z-50 mt-1 w-40 max-h-64 overflow-auto rounded-md bg-popover shadow-md ring-1 ring-black ring-opacity-5"
                    style={{ scrollbarWidth: "thin" }}
                  >
                    {years.map((year) => (
                      <div
                        key={year}
                        ref={year === currentYear ? selectedYearRef : null}
                        className={cn(
                          "px-4 py-2 text-sm cursor-pointer hover:bg-accent/80 hover:text-accent-foreground transition-colors",
                          year === currentYear
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-foreground"
                        )}
                        onClick={() => handleYearSelect(year)}
                        role="option"
                        aria-selected={year === currentYear}
                      >
                        {year}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleNextMonth}
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100"
            )}
            title="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      );
    },
    [props.onMonthChange]
  );

  // Base class names - memoized to prevent recalculation
  const baseClassNames = React.useMemo(
    () => ({
      months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
      month: "space-y-4",
      caption: "flex justify-center pt-1 relative items-center",
      caption_label: "text-base font-medium",
      nav: "space-x-1 flex items-center",
      nav_button: cn(
        buttonVariants({ variant: "ghost", size: "icon" }),
        "h-8 w-8 bg-transparent p-0 opacity-70 hover:opacity-100 transition-opacity"
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
      day_range_end: "day-range-end",
      day_selected:
        "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-full",
      day_today: "bg-accent text-accent-foreground rounded-full font-semibold",
      day_outside:
        "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
      day_disabled: "text-muted-foreground opacity-50",
      day_range_middle:
        "aria-selected:bg-accent aria-selected:text-accent-foreground",
      day_hidden: "invisible",
    }),
    []
  );

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 pointer-events-auto rounded-lg shadow-sm", className)}
      classNames={{
        ...baseClassNames,
        ...classNames,
      }}
      captionLayout="buttons"
      components={{
        ...Icons,
        Caption: YearDropdown,
      }}
      onSelect={handleSelect}
      fromYear={1950}
      toYear={2050}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
