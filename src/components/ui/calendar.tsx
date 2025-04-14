
import * as React from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  hideYearDropdown?: boolean;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  hideYearDropdown = false,
  ...props
}: CalendarProps) {
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

  // Create memoized caption component for better performance
  const CustomCaption = React.useCallback(
    ({ displayMonth, onMonthChange }: { displayMonth: Date, onMonthChange: (date: Date) => void }) => {
      const [isOpen, setIsOpen] = React.useState(false);
      const yearRef = React.useRef<HTMLDivElement>(null);
      const dropdownRef = React.useRef<HTMLDivElement>(null);
      const selectedYearRef = React.useRef<HTMLDivElement>(null);
      
      const monthNames = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
      ];

      const currentYear = displayMonth.getFullYear();
      const currentMonth = monthNames[displayMonth.getMonth()];

      // Years range for dropdown - from 1950 to current year + 10
      const years = React.useMemo(
        () => {
          const currentYear = new Date().getFullYear();
          return Array.from(
            { length: currentYear - 1950 + 11 }, 
            (_, i) => i + 1950
          );
        },
        []
      );

      // Handle outside clicks to close dropdown
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

      // Scroll to selected year when dropdown opens
      React.useEffect(() => {
        if (isOpen && selectedYearRef.current && dropdownRef.current) {
          setTimeout(() => {
            selectedYearRef.current?.scrollIntoView({
              block: "center",
              behavior: "smooth",
            });
          }, 100);
        }
      }, [isOpen]);

      // Handle year selection
      const handleYearSelect = React.useCallback(
        (year: number) => {
          onMonthChange(new Date(year, displayMonth.getMonth(), 1));
          setIsOpen(false);
        },
        [displayMonth, onMonthChange]
      );

      // Navigation handlers
      const handleNextMonth = () => {
        const nextMonth = new Date(displayMonth);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        onMonthChange(nextMonth);
      };

      const handlePrevMonth = () => {
        const prevMonth = new Date(displayMonth);
        prevMonth.setMonth(prevMonth.getMonth() - 1);
        onMonthChange(prevMonth);
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
            type="button"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div
            className="flex items-center justify-center font-medium text-base relative"
            ref={yearRef}
          >
            <div className="flex items-center gap-1">
              <span className="font-medium text-lg">{currentMonth}</span>
              {!hideYearDropdown && (
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
              )}
            </div>
          </div>

          <button
            onClick={handleNextMonth}
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100"
            )}
            title="Next month"
            type="button"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      );
    },
    []
  );

  // Icons component
  const Icons = React.useMemo(
    () => ({
      IconLeft: () => <ChevronLeft className="h-4 w-4 stroke-2" />,
      IconRight: () => <ChevronRight className="h-4 w-4 stroke-2" />,
    }),
    []
  );

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 pointer-events-auto rounded-lg shadow-sm bg-popover", className)}
      classNames={{
        ...baseClassNames,
        ...classNames,
      }}
      captionLayout="buttons"
      components={{
        ...Icons,
        Caption: ({ displayMonth }) => 
          CustomCaption({ 
            displayMonth, 
            onMonthChange: props.onMonthChange || (() => {}) 
          }),
      }}
      fromYear={1950}
      toYear={2050}
      onDayClick={(day, modifiers, e, activeModifiers) => {
        if (props.mode === "single" && typeof props.onSelect === "function") {
          props.onSelect(day);
        }
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
