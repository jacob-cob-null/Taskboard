import { View, ToolbarProps } from "react-big-calendar";
import { CalendarEvent } from "@/lib/validations";
import { ChevronDown, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

interface CalendarToolbarProps extends ToolbarProps<CalendarEvent> {
  onAddEvent?: () => void;
}

export default function CalendarToolbar(props: CalendarToolbarProps) {
  const { view, views, label, onView, onNavigate, localizer, onAddEvent } =
    props;

  const navigate = (action: "PREV" | "NEXT" | "TODAY") => {
    onNavigate(action);
  };

  const currentView = view;
  const availableViews = views as View[];

  // Shared button styles
  const btnBase =
    "relative inline-flex items-center px-4 py-2 border border-[#e5e7eb] bg-white text-sm font-semibold text-[#111827] hover:bg-[#f9fafb] focus:z-10 focus:outline-none transition-colors";
  const btnFirst = "rounded-l-md";
  const btnLast = "rounded-r-md";
  const btnMiddle = "-ml-px";

  return (
    <div className="flex flex-col gap-4 mb-4 border-b border-[#e5e7eb] pb-4">
      {/* Mobile Layout: Row 1 (Nav + View), Row 2 (Label) */}
      <div className="md:hidden flex flex-col gap-4">
        <div className="flex items-center justify-between w-full">
          {/* Navigation Group - Connected Buttons */}
          <div className="isolate inline-flex rounded-md shadow-sm border border-[#e5e7eb]">
            <button
              type="button"
              className="px-4 h-10 bg-white text-sm font-semibold text-[#111827] hover:bg-[#f9fafb] focus:z-10 focus:outline-none border-r border-[#e5e7eb] flex items-center justify-center transition-colors"
              onClick={() => navigate("TODAY")}
            >
              Today
            </button>
            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center bg-white text-[#111827] hover:bg-[#f9fafb] focus:z-10 focus:outline-none border-r border-[#e5e7eb] transition-colors"
              onClick={() => navigate("PREV")}
              aria-label="Previous range"
            >
              <span className="text-[#111827] font-semibold text-lg leading-none flex items-center justify-center">
                &lt;
              </span>
            </button>
            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center bg-white text-[#111827] hover:bg-[#f9fafb] focus:z-10 focus:outline-none transition-colors"
              onClick={() => navigate("NEXT")}
              aria-label="Next range"
            >
              <span className="text-[#111827] font-semibold text-lg leading-none flex items-center justify-center">
                &gt;
              </span>
            </button>
          </div>

          {/* Mobile View Selector + Add Button */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger className="h-10 bg-white border border-[#e5e7eb] rounded-md shadow-sm hover:bg-[#f9fafb] focus:outline-none transition-all px-3 min-w-[100px]">
                <span className="inline-flex items-center justify-center gap-2">
                  <span className="capitalize text-sm font-semibold text-[#111827]">
                    {localizer.messages[currentView] || currentView}
                  </span>
                  <ChevronDown className="w-4 h-4 text-[#6b7280] shrink-0" />
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[140px] border border-[#e5e7eb] rounded-md shadow-lg bg-white p-1 overflow-hidden z-50"
              >
                {availableViews.map((v) => (
                  <DropdownMenuItem
                    key={v}
                    onClick={() => onView(v)}
                    className={`
                    cursor-pointer px-3 py-2 font-medium capitalize rounded-sm text-sm
                    hover:bg-[#f3f4f6] focus:bg-[#f3f4f6]
                    ${currentView === v ? "bg-[#eff6ff] text-[#2563eb]" : "text-[#111827]"}
                  `}
                  >
                    {localizer.messages[v] || v}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {onAddEvent && (
              <button
                type="button"
                onClick={onAddEvent}
                className="h-10 px-3 bg-[#2563eb] text-white border border-[#2563eb] rounded-md shadow-sm hover:bg-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2 transition-all flex items-center justify-center gap-1.5 text-sm font-semibold"
                aria-label="Add event"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Add Event</span>
              </button>
            )}
          </div>
        </div>

        {/* Label (Mobile) */}
        <h2
          className="text-center font-bold text-lg text-gray-900 uppercase tracking-tight"
          aria-live="polite"
        >
          {label}
        </h2>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex items-center justify-between w-full">
        {/* Navigation Group */}
        <div className="isolate inline-flex rounded-md shadow-sm">
          <button
            type="button"
            className={`${btnBase} ${btnFirst}`}
            onClick={() => navigate("TODAY")}
          >
            Today
          </button>
          <button
            type="button"
            className={`${btnBase} ${btnMiddle} px-2`}
            onClick={() => navigate("PREV")}
            aria-label="Previous range"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            className={`${btnBase} ${btnLast} ${btnMiddle} px-2`}
            onClick={() => navigate("NEXT")}
            aria-label="Next range"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Label (Desktop) */}
        <h2
          className="rbc-toolbar-label font-bold text-xl text-[#111827] uppercase tracking-tight"
          aria-live="polite"
        >
          {label}
        </h2>

        {/* View Selector Dropdown + Add Button (Desktop - matches mobile) */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="h-10 bg-white border border-[#e5e7eb] rounded-md shadow-sm hover:bg-[#f9fafb] focus:outline-none transition-all px-4 min-w-[120px]">
              <span className="inline-flex items-center justify-center gap-2">
                <span className="capitalize text-sm font-semibold text-[#111827]">
                  {localizer.messages[currentView] || currentView}
                </span>
                <ChevronDown className="w-4 h-4 text-[#6b7280] shrink-0" />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[140px] border border-[#e5e7eb] rounded-md shadow-lg bg-white p-1 overflow-hidden z-50"
            >
              {availableViews.map((v) => (
                <DropdownMenuItem
                  key={v}
                  onClick={() => onView(v)}
                  className={`
                    cursor-pointer px-3 py-2 font-medium capitalize rounded-sm text-sm
                    hover:bg-[#f3f4f6] focus:bg-[#f3f4f6]
                    ${currentView === v ? "bg-[#eff6ff] text-[#2563eb]" : "text-[#111827]"}
                  `}
                >
                  {localizer.messages[v] || v}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {onAddEvent && (
            <button
              type="button"
              onClick={onAddEvent}
              className="h-10 px-4 bg-[#2563eb] text-white border border-[#2563eb] rounded-md shadow-sm hover:bg-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2 transition-all flex items-center justify-center gap-2 text-sm font-semibold"
              aria-label="Add event"
            >
              <Plus className="w-4 h-4 shrink-0" />
              Add Event
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
